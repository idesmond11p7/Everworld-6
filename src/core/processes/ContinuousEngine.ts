/**
 * Everworld 6: Continuous Process Engine (Phi)
 * 
 * Handles orthogonal continuous state evolution over delta-time:
 * - Thermal diffusion across sanctum topology
 * - Somatic metabolic recovery & adrenaline decay
 * - Ambient magma pressure oscillation
 */

import { TimelineId, WorldTimeMicroseconds } from "../../types/causal";
import { EverworldStateStore } from "../state/StateStore";

export interface ProcessTickReport {
  readonly tickNumber: number;
  readonly deltaMicroseconds: WorldTimeMicroseconds;
  readonly totalTime: WorldTimeMicroseconds;
  readonly changes: Array<{ entityUuid: string; path: string; summary: string }>;
}

export class ContinuousEngine {
  private tickCount = 0;

  constructor(private readonly stateStore: EverworldStateStore) {}

  public tick(
    timelineId: TimelineId,
    currentTime: WorldTimeMicroseconds,
    deltaMicroseconds: WorldTimeMicroseconds = 1000000n // 1 second
  ): ProcessTickReport {
    this.tickCount++;
    const changes: Array<{ entityUuid: string; path: string; summary: string }> = [];
    const newTimestamp = currentTime + deltaMicroseconds;

    // 1. Environmental ambient process: Heat diffusion & Magma pressure oscillation
    const envRecord = this.stateStore.getActiveRecord(timelineId, "sanctum_environment", "environment.ambient");
    if (envRecord) {
      const env = envRecord.value as { ambientTemp: number; magmaPressure: number; stability: number };
      // Ambient temperature slowly drifts toward equilibrium (85°C)
      const targetTemp = 85;
      const tempDelta = (targetTemp - env.ambientTemp) * 0.05;
      const newTemp = Math.round((env.ambientTemp + tempDelta) * 10) / 10;

      // Magma pressure has subtle harmonic wave
      const wave = Math.sin(this.tickCount * 0.3) * 1.5;
      const newPressure = Math.min(100, Math.max(10, Math.round((env.magmaPressure + wave) * 10) / 10));

      envRecord.value = {
        ...env,
        ambientTemp: newTemp,
        magmaPressure: newPressure,
      };
      envRecord.version += 1n;
      changes.push({
        entityUuid: "sanctum_environment",
        path: "environment.ambient",
        summary: `Temp: ${newTemp}°C, Pressure: ${newPressure}%`,
      });
    }

    // 2. Dragon Somatic Drift: Heat regeneration & slow rage cooldown
    const dragonVitals = this.stateStore.getActiveRecord(timelineId, "entity_ignis_vorax", "somatics.vitals");
    if (dragonVitals) {
      const v = dragonVitals.value as { stamina: number; coreTemp: number; rage: number };
      const newStamina = Math.min(100, v.stamina + 1);
      const newRage = Math.max(10, v.rage - 1);
      dragonVitals.value = {
        ...v,
        stamina: newStamina,
        rage: newRage,
      };
      dragonVitals.version += 1n;
      changes.push({
        entityUuid: "entity_ignis_vorax",
        path: "somatics.vitals",
        summary: `Stamina: ${newStamina}%, Rage: ${newRage}%`,
      });
    }

    // 3. Wanderer Somatic Drift: Adrenaline normalization & shield recharge
    const wandererVitals = this.stateStore.getActiveRecord(timelineId, "entity_kaelen", "somatics.vitals");
    if (wandererVitals) {
      const v = wandererVitals.value as { stamina: number; shield: number; adrenaline: number };
      const newAdrenaline = Math.max(15, v.adrenaline - 2);
      const newShield = Math.min(100, v.shield + 2);
      wandererVitals.value = {
        ...v,
        adrenaline: newAdrenaline,
        shield: newShield,
      };
      wandererVitals.version += 1n;
      changes.push({
        entityUuid: "entity_kaelen",
        path: "somatics.vitals",
        summary: `Shield: ${newShield}%, Adrenaline: ${newAdrenaline}%`,
      });
    }

    return {
      tickNumber: this.tickCount,
      deltaMicroseconds,
      totalTime: newTimestamp,
      changes,
    };
  }
}
