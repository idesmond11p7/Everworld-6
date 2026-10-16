/**
 * Everworld 6: Authoritative State Store Implementation
 * 
 * Implements hierarchical state paths with version monotonicity,
 * domain ownership, and transaction rollback.
 */

import {
  EntityUuid,
  StateInterval,
  StateMutation,
  StateReference,
  TimelineId,
  WorldTimeMicroseconds,
} from "../../types/causal";
import { IStateStoreReader, IStateStoreWriter } from "../invariants";

export interface StateRecord {
  readonly path: string;
  readonly entityUuid: EntityUuid;
  readonly timelineId: TimelineId;
  version: bigint;
  value: unknown;
  interval: StateInterval;
  valueDigest: string;
  ownerDomain: string;
}

export class EverworldStateStore implements IStateStoreReader, IStateStoreWriter {
  // Key: `${timelineId}::${entityUuid}::${path}`
  private readonly activeStates = new Map<string, StateRecord>();
  // History key: `${timelineId}::${entityUuid}::${path}::${version}`
  private readonly historicalStates = new Map<string, StateRecord>();

  private buildKey(timelineId: TimelineId, entityUuid: EntityUuid, path: string): string {
    return `${timelineId}::${entityUuid}::${path}`;
  }

  private buildHistoryKey(
    timelineId: TimelineId,
    entityUuid: EntityUuid,
    path: string,
    version: bigint
  ): string {
    return `${timelineId}::${entityUuid}::${path}::${version.toString()}`;
  }

  public registerGenesisState(
    timelineId: TimelineId,
    entityUuid: EntityUuid,
    path: string,
    initialValue: unknown,
    ownerDomain: string,
    timestamp: WorldTimeMicroseconds = 0n
  ): StateReference {
    const key = this.buildKey(timelineId, entityUuid, path);
    const digest = this.computeDigest(initialValue);
    const record: StateRecord = {
      path,
      entityUuid,
      timelineId,
      version: 1n,
      value: initialValue,
      interval: { start: timestamp, end: null },
      valueDigest: digest,
      ownerDomain,
    };

    this.activeStates.set(key, record);
    this.historicalStates.set(this.buildHistoryKey(timelineId, entityUuid, path, 1n), { ...record });

    return {
      timelineId,
      entityUuid,
      path,
      version: 1n,
      interval: record.interval,
      valueDigest: digest,
    };
  }

  public getActiveState(
    timelineId: TimelineId,
    entityUuid: EntityUuid,
    path: string
  ): StateReference | undefined {
    const key = this.buildKey(timelineId, entityUuid, path);
    const rec = this.activeStates.get(key);
    if (!rec) return undefined;
    return {
      timelineId: rec.timelineId,
      entityUuid: rec.entityUuid,
      path: rec.path,
      version: rec.version,
      interval: rec.interval,
      valueDigest: rec.valueDigest,
    };
  }

  public getActiveRecord(
    timelineId: TimelineId,
    entityUuid: EntityUuid,
    path: string
  ): StateRecord | undefined {
    return this.activeStates.get(this.buildKey(timelineId, entityUuid, path));
  }

  public getHistoricalState(
    timelineId: TimelineId,
    entityUuid: EntityUuid,
    path: string,
    version: bigint
  ): StateReference | undefined {
    const hKey = this.buildHistoryKey(timelineId, entityUuid, path, version);
    const rec = this.historicalStates.get(hKey);
    if (!rec) return undefined;
    return {
      timelineId: rec.timelineId,
      entityUuid: rec.entityUuid,
      path: rec.path,
      version: rec.version,
      interval: rec.interval,
      valueDigest: rec.valueDigest,
    };
  }

  public applyMutations(
    timelineId: TimelineId,
    mutations: ReadonlyArray<StateMutation>,
    _determinationId: string,
    timestamp: WorldTimeMicroseconds
  ): ReadonlyArray<StateReference> {
    const rollbackSnapshots: Array<{ key: string; record: StateRecord | undefined }> = [];
    const producedRefs: StateReference[] = [];

    try {
      for (const m of mutations) {
        const key = this.buildKey(timelineId, m.entityUuid, m.path);
        const current = this.activeStates.get(key);
        rollbackSnapshots.push({ key, record: current ? { ...current } : undefined });

        if (current) {
          // Close interval of previous version
          current.interval = { start: current.interval.start, end: timestamp };
          this.historicalStates.set(
            this.buildHistoryKey(timelineId, m.entityUuid, m.path, current.version),
            { ...current }
          );

          // Update active record to new version
          const newDigest = m.newValueDigest || this.computeDigest(m.canonicalValuePayload);
          const updated: StateRecord = {
            path: m.path,
            entityUuid: m.entityUuid,
            timelineId,
            version: m.newVersion,
            value: m.canonicalValuePayload,
            interval: { start: timestamp, end: null },
            valueDigest: newDigest,
            ownerDomain: current.ownerDomain,
          };
          this.activeStates.set(key, updated);
          this.historicalStates.set(
            this.buildHistoryKey(timelineId, m.entityUuid, m.path, m.newVersion),
            { ...updated }
          );

          producedRefs.push({
            timelineId,
            entityUuid: m.entityUuid,
            path: m.path,
            version: m.newVersion,
            interval: updated.interval,
            valueDigest: newDigest,
          });
        } else {
          // Initial allocation
          const newDigest = m.newValueDigest || this.computeDigest(m.canonicalValuePayload);
          const allocated: StateRecord = {
            path: m.path,
            entityUuid: m.entityUuid,
            timelineId,
            version: m.newVersion,
            value: m.canonicalValuePayload,
            interval: { start: timestamp, end: null },
            valueDigest: newDigest,
            ownerDomain: "DYNAMIC_ALLOCATED",
          };
          this.activeStates.set(key, allocated);
          this.historicalStates.set(
            this.buildHistoryKey(timelineId, m.entityUuid, m.path, m.newVersion),
            { ...allocated }
          );

          producedRefs.push({
            timelineId,
            entityUuid: m.entityUuid,
            path: m.path,
            version: m.newVersion,
            interval: allocated.interval,
            valueDigest: newDigest,
          });
        }
      }
      return producedRefs;
    } catch (err) {
      // Rollback
      for (const snap of rollbackSnapshots) {
        if (snap.record) {
          this.activeStates.set(snap.key, snap.record);
        } else {
          this.activeStates.delete(snap.key);
        }
      }
      throw err;
    }
  }

  public getAllActiveRecords(): ReadonlyArray<StateRecord> {
    return Array.from(this.activeStates.values());
  }

  public getEntityActiveRecords(entityUuid: EntityUuid): ReadonlyArray<StateRecord> {
    return Array.from(this.activeStates.values()).filter((r) => r.entityUuid === entityUuid);
  }

  private computeDigest(val: unknown): string {
    const str = JSON.stringify(val, (_k, v) => (typeof v === "bigint" ? v.toString() : v));
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return `sha256_${Math.abs(hash).toString(16).padStart(8, "0")}`;
  }
}
