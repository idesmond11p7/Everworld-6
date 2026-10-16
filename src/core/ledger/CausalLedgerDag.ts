/**
 * Everworld 6: Causal Ledger DAG & Write-Ahead Log
 * 
 * Implements DAG storage, causal lineage tracking, and WAL 2PC support.
 */

import {
  DeterminationCommitPacket,
  OccurrenceManifestation,
  StateReference,
} from "../../types/causal";
import { ILedgerDagReader, ILedgerDagWriter, IWriteAheadLog } from "../invariants";

export interface WalEntry {
  readonly commitToken: string;
  readonly packet: DeterminationCommitPacket;
  status: "INTENT" | "COMMITTED" | "ABORTED";
  abortReason?: string;
}

export class CausalLedgerDag implements ILedgerDagReader, ILedgerDagWriter, IWriteAheadLog {
  private readonly determinations = new Map<string, DeterminationCommitPacket>();
  private readonly determinationOrder: string[] = [];
  private readonly upstreamGraph = new Map<string, Set<string>>(); // determinationId or valueDigest -> upstream IDs
  private readonly producedStatesByDetermination = new Map<string, ReadonlyArray<StateReference>>();
  private readonly occurrences: OccurrenceManifestation[] = [];

  // WAL storage
  private readonly walEntries = new Map<string, WalEntry>();
  private walCounter = 0;

  // --- ILedgerDagReader ---
  public hasDetermination(determinationId: string): boolean {
    return this.determinations.has(determinationId);
  }

  public getDeterminationPacket(determinationId: string): DeterminationCommitPacket | undefined {
    return this.determinations.get(determinationId);
  }

  public getUpstreamDeterminations(key: string): ReadonlySet<string> {
    return this.upstreamGraph.get(key) ?? new Set<string>();
  }

  // --- ILedgerDagWriter ---
  public appendDetermination(
    packet: DeterminationCommitPacket,
    newStates: ReadonlyArray<StateReference>
  ): void {
    this.determinations.set(packet.determinationId, packet);
    this.determinationOrder.push(packet.determinationId);
    this.producedStatesByDetermination.set(packet.determinationId, newStates);

    // Track occurrences
    if (packet.actualizedOccurrences) {
      this.occurrences.push(...packet.actualizedOccurrences);
    }

    // Build DAG links: Map new state value digests to this determination and its upstreams
    const directUpstreams = new Set<string>();
    // If supportStructure references other state value digests, incorporate their upstreams
    const leafDigests = this.extractDigests(packet.supportStructure);
    for (const d of leafDigests) {
      const parentUpstreams = this.upstreamGraph.get(d);
      if (parentUpstreams) {
        for (const u of parentUpstreams) {
          directUpstreams.add(u);
        }
      }
    }

    // Add this determination itself to upstream set for all produced state digests
    const selfAndAncestors = new Set(directUpstreams);
    selfAndAncestors.add(packet.determinationId);

    this.upstreamGraph.set(packet.determinationId, selfAndAncestors);
    for (const st of newStates) {
      this.upstreamGraph.set(st.valueDigest, selfAndAncestors);
    }
  }

  // --- IWriteAheadLog ---
  public writeIntent(packet: DeterminationCommitPacket): string {
    this.walCounter++;
    const commitToken = `wal_${this.walCounter}_${packet.determinationId}`;
    this.walEntries.set(commitToken, {
      commitToken,
      packet,
      status: "INTENT",
    });
    return commitToken;
  }

  public markCommitted(commitToken: string): void {
    const entry = this.walEntries.get(commitToken);
    if (entry) {
      entry.status = "COMMITTED";
    }
  }

  public markAborted(commitToken: string, reason: string): void {
    const entry = this.walEntries.get(commitToken);
    if (entry) {
      entry.status = "ABORTED";
      entry.abortReason = reason;
    }
  }

  // --- Query APIs ---
  public getAllPackets(): ReadonlyArray<DeterminationCommitPacket> {
    return this.determinationOrder.map((id) => this.determinations.get(id)!);
  }

  public getAllOccurrences(): ReadonlyArray<OccurrenceManifestation> {
    return [...this.occurrences];
  }

  public getLatestPacket(): DeterminationCommitPacket | undefined {
    if (this.determinationOrder.length === 0) return undefined;
    const lastId = this.determinationOrder[this.determinationOrder.length - 1];
    return this.determinations.get(lastId);
  }

  public getStatesForDetermination(determinationId: string): ReadonlyArray<StateReference> {
    return this.producedStatesByDetermination.get(determinationId) ?? [];
  }

  private extractDigests(node: unknown): string[] {
    const digests: string[] = [];
    const visit = (n: unknown) => {
      if (!n || typeof n !== "object") return;
      const rec = n as Record<string, unknown>;
      if (rec.kind === "LEAF" && rec.stateRef && typeof rec.stateRef === "object") {
        const sr = rec.stateRef as Record<string, unknown>;
        if (typeof sr.valueDigest === "string") {
          digests.push(sr.valueDigest);
        }
      }
      if (Array.isArray(rec.children)) {
        for (const c of rec.children) visit(c);
      }
    };
    visit(node);
    return digests;
  }
}
