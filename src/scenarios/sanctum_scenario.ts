/**
 * Everworld 6: Canonical Sanctum Scenario Seed
 * 
 * Sets up the dynamic encounter between Ignis-Vorax (The Dragon)
 * and Kaelen (The Wanderer) inside the Obsidian Sanctum.
 */

import { EverworldStateStore } from "../core/state/StateStore";

export const TIMELINE_PRIME = "timeline_prime";

export const ENTITY_DRAGON = "entity_ignis_vorax";
export const ENTITY_WANDERER = "entity_kaelen";
export const ENTITY_SANCTUM = "sanctum_environment";

export const SCENARIO_ASSETS = {
  sanctumBackdrop: "/src/assets/images/comic_sanctum_backdrop_1792151861551.jpg",
  dragonPortrait: "/src/assets/images/comic_dragon_portrait_1792151862069.jpg",
  wandererPortrait: "/src/assets/images/comic_wanderer_portrait_1792151862488.jpg",
};

export function seedSanctumScenario(stateStore: EverworldStateStore): void {
  // 1. Seed Dragon (Ignis-Vorax)
  stateStore.registerGenesisState(
    TIMELINE_PRIME,
    ENTITY_DRAGON,
    "identity.profile",
    {
      name: "Ignis-Vorax",
      title: "The Slumbering Mountain",
      archetype: "Colossal Primordial Dragon",
      lineageHash: "lineage_primordial_0x98A",
    },
    "PHYSICAL_TOPOLOGY"
  );

  stateStore.registerGenesisState(
    TIMELINE_PRIME,
    ENTITY_DRAGON,
    "somatics.vitals",
    {
      stamina: 85,
      coreTemp: 1480, // Celsius
      scaleArmor: 92, // Percentage
      rage: 45, // Percentage
    },
    "SOMATIC_METABOLISM"
  );

  stateStore.registerGenesisState(
    TIMELINE_PRIME,
    ENTITY_DRAGON,
    "topology.position",
    {
      apertureId: "magma_dais",
      name: "Central Magma Dais",
      elevation: 12,
      coordinates: [42, 88],
    },
    "PHYSICAL_TOPOLOGY"
  );

  stateStore.registerGenesisState(
    TIMELINE_PRIME,
    ENTITY_DRAGON,
    "mind.beliefs",
    {
      intruderType: "INSIGNIFICANT_MORTAL",
      recognizedRelic: null,
      daisIntegrity: "IMPREGNABLE",
      tacticalIntent: "CONSUME_WITH_CONVECTION",
    },
    "COGNITIVE_EPISTEMICS"
  );

  stateStore.registerGenesisState(
    TIMELINE_PRIME,
    ENTITY_DRAGON,
    "items.artifacts",
    {
      name: "Heart of Cinders",
      resonance: 100,
      status: "IGNITED",
      elementalFlux: "THERMAL_SUPREME",
    },
    "ITEM_AFFORDANCES"
  );

  // 2. Seed Wanderer (Kaelen)
  stateStore.registerGenesisState(
    TIMELINE_PRIME,
    ENTITY_WANDERER,
    "identity.profile",
    {
      name: "Kaelen",
      title: "Chrono-Cartographer",
      archetype: "Relic Seeker & Void Weaver",
      lineageHash: "lineage_void_weavers_0x11B",
    },
    "PHYSICAL_TOPOLOGY"
  );

  stateStore.registerGenesisState(
    TIMELINE_PRIME,
    ENTITY_WANDERER,
    "somatics.vitals",
    {
      stamina: 78,
      coreTemp: 37.2, // Celsius
      shield: 85, // Percentage
      adrenaline: 75, // Percentage
    },
    "SOMATIC_METABOLISM"
  );

  stateStore.registerGenesisState(
    TIMELINE_PRIME,
    ENTITY_WANDERER,
    "topology.position",
    {
      apertureId: "threshold_arch",
      name: "Threshold of Despair",
      elevation: 2,
      coordinates: [10, 15],
    },
    "PHYSICAL_TOPOLOGY"
  );

  stateStore.registerGenesisState(
    TIMELINE_PRIME,
    ENTITY_WANDERER,
    "mind.beliefs",
    {
      dragonWeakness: "FRACTURED_CHEST_SCALE",
      sanctumApertureSafe: true,
      daisMagmaFissure: "CRITICAL_PRESSURE",
      tacticalOption: "ATTUNE_VOID_COMPASS",
    },
    "COGNITIVE_EPISTEMICS"
  );

  stateStore.registerGenesisState(
    TIMELINE_PRIME,
    ENTITY_WANDERER,
    "items.void_glass",
    {
      name: "Void-Glass Compass",
      resonance: 84,
      charge: 90,
      status: "ATTUNED",
      inversionReady: true,
    },
    "ITEM_AFFORDANCES"
  );

  // 3. Seed Sanctum Environment
  stateStore.registerGenesisState(
    TIMELINE_PRIME,
    ENTITY_SANCTUM,
    "environment.ambient",
    {
      ambientTemp: 82, // Celsius
      magmaPressure: 64, // Percentage
      stability: 88, // Percentage
      airQuality: "SULFURIC_HAZE",
    },
    "CONTINUOUS_ENVIRONMENT"
  );

  stateStore.registerGenesisState(
    TIMELINE_PRIME,
    ENTITY_SANCTUM,
    "topology.apertures.bridge",
    {
      name: "Basalt Arch Bridge",
      traversable: true,
      status: "INTACT",
      heatRating: 620,
    },
    "PHYSICAL_TOPOLOGY"
  );

  stateStore.registerGenesisState(
    TIMELINE_PRIME,
    ENTITY_SANCTUM,
    "topology.apertures.dais",
    {
      name: "Central Magma Dais",
      elevation: 12,
      magmaSurgeRisk: 42,
    },
    "PHYSICAL_TOPOLOGY"
  );
}
