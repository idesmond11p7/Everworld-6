/**
 * Everworld 6: Structural Invariant Validators & Write-Ahead Log (WAL) 2PC Protocol (Doc 17)
 */

import {
  CausalLedgerErrorCode,
  DeterminationCommitPacket,
  StateMutation,
  StateReference,
  SupportLeaf,
  SupportNode,
  TimelineId,
} from "../types/causal";

export class CausalLedgerValidationError extends Error {
  constructor(
    public readonly code: CausalLedgerErrorCode,
    message: string
  ) {
    super(`[${code}] ${message}`);
    this.name = "CausalLedgerValidationError";
  }
}

/**
 * Interface representing the Authoritative State Store lookup for validator pre-flight.
 */
export interface IStateStoreReader {
  getActiveState(
    timelineId: TimelineId,
    entityUuid: string,
    path: string
  ): StateReference | undefined;
  getHistoricalState(
    timelineId: TimelineId,
    entityUuid: string,
    path: string,
    version: bigint
  ): StateReference | undefined;
}

/**
 * Interface representing the Causal Ledger DAG reader for acyclicity & duplicate checks.
 */
export interface ILedgerDagReader {
  hasDetermination(determinationId: string): boolean;
  getDeterminationPacket(determinationId: string): DeterminationCommitPacket | undefined;
  getUpstreamDeterminations(determinationId: string): ReadonlySet<string>;
}

export function extractSupportLeaves(node: SupportNode): ReadonlyArray<SupportLeaf> {
  switch (node.kind) {
    case "LEAF":
      return [node];
    case "CONJUNCTIVE_AND":
    case "DISJUNCTIVE_OR":
    case "DISCRETE_K_OF_N":
    case "INTERACTION_GROUP":
      return node.children.flatMap(extractSupportLeaves);
    case "ACCUMULATED_QUANTITY_THRESHOLD":
      return node.children;
  }
}

function checkSupportCanonicalOrdering(node: SupportNode): void {
  if (node.kind === "CONJUNCTIVE_AND" || node.kind === "DISJUNCTIVE_OR") {
    for (let i = 0; i < node.children.length - 1; i++) {
      const a = node.children[i];
      const b = node.children[i + 1];
      if (a.kind === "LEAF" && b.kind === "LEAF") {
        const cmpEntity = a.stateRef.entityUuid.localeCompare(b.stateRef.entityUuid);
        if (cmpEntity > 0) {
          throw new CausalLedgerValidationError(
            CausalLedgerErrorCode.NON_CANONICAL_SUPPORT_ORDER,
            `Conjunction leaves not sorted by entityUuid: ${a.stateRef.entityUuid} > ${b.stateRef.entityUuid}`
          );
        }
        if (cmpEntity === 0) {
          const cmpPath = a.stateRef.path.localeCompare(b.stateRef.path);
          if (cmpPath > 0) {
            throw new CausalLedgerValidationError(
              CausalLedgerErrorCode.NON_CANONICAL_SUPPORT_ORDER,
              `Conjunction leaves not sorted by path: ${a.stateRef.path} > ${b.stateRef.path}`
            );
          }
          if (cmpPath === 0 && a.stateRef.version > b.stateRef.version) {
            throw new CausalLedgerValidationError(
              CausalLedgerErrorCode.NON_CANONICAL_SUPPORT_ORDER,
              `Conjunction leaves not sorted by version: ${a.stateRef.version} > ${b.stateRef.version}`
            );
          }
        }
      }
    }
  }

  if (node.kind === "INTERACTION_GROUP" && node.isCommutative) {
    for (let i = 0; i < node.children.length - 1; i++) {
      const a = node.children[i];
      const b = node.children[i + 1];
      if (a.kind === "LEAF" && b.kind === "LEAF") {
        const cmp = a.stateRef.entityUuid.localeCompare(b.stateRef.entityUuid);
        if (cmp > 0) {
          throw new CausalLedgerValidationError(
            CausalLedgerErrorCode.NON_CANONICAL_SUPPORT_ORDER,
            `Commutative interaction group leaves not sorted by entityUuid: ${a.stateRef.entityUuid} > ${b.stateRef.entityUuid}`
          );
        }
      }
    }
  }

  if ("children" in node) {
    for (const child of node.children) {
      checkSupportCanonicalOrdering(child);
    }
  }
}

/**
 * Validates all 13 Structural Invariants against the DeterminationCommitPacket.
 */
export function validateDeterminationPacket(
  packet: DeterminationCommitPacket,
  stateStore: IStateStoreReader,
  ledgerDag: ILedgerDagReader
): void {
  // INV-1: Schema Validity
  if (!packet.determinationId || !packet.timelineId || !packet.domainEngineId) {
    throw new CausalLedgerValidationError(
      CausalLedgerErrorCode.SCHEMA_VIOLATION,
      "Determination packet missing essential identifier fields."
    );
  }

  // INV-10: Idempotency & Collision Guard
  if (ledgerDag.hasDetermination(packet.determinationId)) {
    const existing = ledgerDag.getDeterminationPacket(packet.determinationId);
    if (existing && existing.provenanceDigest === packet.provenanceDigest) {
      // Idempotent retry is legal
      return;
    }
    throw new CausalLedgerValidationError(
      CausalLedgerErrorCode.DETERMINATION_ID_COLLISION,
      `DeterminationId collision: ${packet.determinationId} already exists with different provenance digest.`
    );
  }

  // INV-13: Host Ephemera Leak Check
  const packetStr = JSON.stringify(packet, (_k, v) => (typeof v === "bigint" ? v.toString() : v));
  if (
    packetStr.includes("0x") ||
    packetStr.includes("thread_id") ||
    packetStr.includes("heap_ptr") ||
    packetStr.includes("solver_substep")
  ) {
    throw new CausalLedgerValidationError(
      CausalLedgerErrorCode.HOST_EPHEMERA_LEAK,
      "Host computational ephemera detected in determination commit packet payload."
    );
  }

  // INV-9: Absence Invariant Purity
  if (
    packet.domainEngineId.toLowerCase().includes("omission") ||
    packet.determinationId.toLowerCase().includes("omission")
  ) {
    throw new CausalLedgerValidationError(
      CausalLedgerErrorCode.GHOST_OMISSION_NODE_PROHIBITED,
      "Negative conditions and omissions cannot be ingested as positive determination nodes."
    );
  }

  const leaves = extractSupportLeaves(packet.supportStructure);

  // INV-6: Support Non-Emptiness (Genesis Exemption)
  if (packet.kind === "STANDARD_TRANSITION" && leaves.length === 0) {
    throw new CausalLedgerValidationError(
      CausalLedgerErrorCode.EMPTY_SUPPORT_STRUCTURE,
      `Standard determination ${packet.determinationId} has empty support structure.`
    );
  }

  // INV-7: Role Legality
  for (const leaf of leaves) {
    if (leaf.role !== "ACTIVE_CONTRIBUTOR" && leaf.role !== "PRECONDITION_ENABLER") {
      throw new CausalLedgerValidationError(
        CausalLedgerErrorCode.ILLEGAL_SUPPORT_ROLE,
        `Illegal support role detected on stateRef ${leaf.stateRef.path}: ${(leaf as { role: string }).role}`
      );
    }
  }

  // INV-11: Canonical Input Ordering
  checkSupportCanonicalOrdering(packet.supportStructure);

  // INV-5: Timeline Confinement
  for (const leaf of leaves) {
    if (leaf.stateRef.timelineId !== packet.timelineId) {
      throw new CausalLedgerValidationError(
        CausalLedgerErrorCode.TIMELINE_BOUNDARY_BREACH,
        `Consumed stateRef on timeline ${leaf.stateRef.timelineId} breaches packet timeline ${packet.timelineId}.`
      );
    }
  }

  // INV-2: Temporal Interval Consistency
  for (const leaf of leaves) {
    if (leaf.stateRef.interval.start > packet.timestamp) {
      throw new CausalLedgerValidationError(
        CausalLedgerErrorCode.TEMPORAL_INCONSISTENCY,
        `Consumed stateRef ${leaf.stateRef.path} starts at ${leaf.stateRef.interval.start}, after determination timestamp ${packet.timestamp}.`
      );
    }
  }

  for (const mutation of packet.committedMutations) {
    if (mutation.validFrom < packet.timestamp) {
      throw new CausalLedgerValidationError(
        CausalLedgerErrorCode.TEMPORAL_INCONSISTENCY,
        `Committed mutation on ${mutation.path} validFrom ${mutation.validFrom} precedes determination timestamp ${packet.timestamp}.`
      );
    }
  }

  // INV-3: Path-Specific Version Head Monotonicity
  for (const mutation of packet.committedMutations) {
    const activeHead = stateStore.getActiveState(
      packet.timelineId,
      mutation.entityUuid,
      mutation.path
    );

    if (packet.kind === "GENESIS_INITIALIZATION") {
      if (activeHead !== undefined) {
        throw new CausalLedgerValidationError(
          CausalLedgerErrorCode.VERSION_STALE_OR_NON_MONOTONIC,
          `Genesis initialization cannot overwrite existing active state on path ${mutation.path}.`
        );
      }
      if (mutation.previousVersion !== 0n || mutation.newVersion !== 1n) {
        throw new CausalLedgerValidationError(
          CausalLedgerErrorCode.VERSION_STALE_OR_NON_MONOTONIC,
          `Genesis initialization on ${mutation.path} must transition from 0 to 1.`
        );
      }
    } else {
      if (!activeHead) {
        throw new CausalLedgerValidationError(
          CausalLedgerErrorCode.VERSION_STALE_OR_NON_MONOTONIC,
          `Cannot mutate non-existent path ${mutation.path} on entity ${mutation.entityUuid}.`
        );
      }
      if (activeHead.version !== mutation.previousVersion) {
        throw new CausalLedgerValidationError(
          CausalLedgerErrorCode.VERSION_STALE_OR_NON_MONOTONIC,
          `Stale version mutation on ${mutation.path}: expected head ${activeHead.version}, got previousVersion ${mutation.previousVersion}.`
        );
      }
      if (mutation.newVersion !== mutation.previousVersion + 1n) {
        throw new CausalLedgerValidationError(
          CausalLedgerErrorCode.VERSION_STALE_OR_NON_MONOTONIC,
          `Non-monotonic version leap on ${mutation.path}: ${mutation.previousVersion} -> ${mutation.newVersion}.`
        );
      }
    }
  }

  // INV-4: Directed Acyclicity
  // Verify that none of the consumed state references are descendants of the committing determination ID
  for (const leaf of leaves) {
    const upstream = ledgerDag.getUpstreamDeterminations(leaf.stateRef.valueDigest);
    if (upstream.has(packet.determinationId)) {
      throw new CausalLedgerValidationError(
        CausalLedgerErrorCode.CAUSAL_CYCLE_DETECTED,
        `Cycle detected: determination ${packet.determinationId} consumes its own causal descendant.`
      );
    }
  }
}

/**
 * 2-Phase Commit (2PC) / Write-Ahead Log Gateway Implementation
 */
export interface IStateStoreWriter {
  applyMutations(
    timelineId: TimelineId,
    mutations: ReadonlyArray<StateMutation>,
    determinationId: string,
    timestamp: bigint
  ): ReadonlyArray<StateReference>;
}

export interface ILedgerDagWriter {
  appendDetermination(
    packet: DeterminationCommitPacket,
    newStates: ReadonlyArray<StateReference>
  ): void;
}

export interface IWriteAheadLog {
  writeIntent(packet: DeterminationCommitPacket): string; // returns commitToken
  markCommitted(commitToken: string): void;
  markAborted(commitToken: string, reason: string): void;
}

export class DurableCommitGateway {
  constructor(
    private readonly stateStoreReader: IStateStoreReader,
    private readonly stateStoreWriter: IStateStoreWriter,
    private readonly ledgerDagReader: ILedgerDagReader,
    private readonly ledgerDagWriter: ILedgerDagWriter,
    private readonly wal: IWriteAheadLog
  ) {}

  public commit(packet: DeterminationCommitPacket): ReadonlyArray<StateReference> {
    // 1. Pre-flight Validation (Phase 1)
    validateDeterminationPacket(packet, this.stateStoreReader, this.ledgerDagReader);

    // 2. WAL Intent Reservation
    const commitToken = this.wal.writeIntent(packet);

    try {
      // 3. Atomic Dual-Write (Phase 2)
      const newStates = this.stateStoreWriter.applyMutations(
        packet.timelineId,
        packet.committedMutations,
        packet.determinationId,
        packet.timestamp
      );

      this.ledgerDagWriter.appendDetermination(packet, newStates);

      // 4. Mark WAL Committed
      this.wal.markCommitted(commitToken);
      return newStates;
    } catch (err) {
      this.wal.markAborted(commitToken, (err as Error).message);
      throw new CausalLedgerValidationError(
        CausalLedgerErrorCode.DUAL_WRITE_TRANSACTION_FAILED,
        `2PC Commit failed: ${(err as Error).message}`
      );
    }
  }
}
