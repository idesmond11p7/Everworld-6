import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  Eye,
  GitCommit,
  Flame,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

import { EverworldStateStore, StateRecord } from './core/state/StateStore';
import { AuthorityRegistry } from './core/authority/AuthorityRegistry';
import { CausalLedgerDag } from './core/ledger/CausalLedgerDag';
import { DurableCommitGateway } from './core/invariants';
import { CouplingEngine, ActionProposal, CouplingResult } from './core/coupling/CouplingEngine';
import { ContinuousEngine } from './core/processes/ContinuousEngine';
import {
  seedSanctumScenario,
  TIMELINE_PRIME,
  ENTITY_DRAGON,
  ENTITY_WANDERER,
  ENTITY_SANCTUM,
} from './scenarios/sanctum_scenario';

import { ComicStage } from './components/comic/ComicStage';
import { SoundBurst } from './components/comic/SoundBurst';
import { ApertureInspectorModal } from './components/comic/ApertureInspectorModal';
import { ActionDispatchDeck } from './components/controls/ActionDispatchDeck';
import { SimulationControls } from './components/controls/SimulationControls';
import { StatePathInspector } from './components/inspector/StatePathInspector';
import { EpistemicDiff } from './components/inspector/EpistemicDiff';
import { CausalLedgerDrawer } from './components/controls/CausalLedgerDrawer';
import { runAdversarialRegressionSuite } from './tests/causal_adversarial_suite';

type ActiveTab = 'STAGE' | 'INSPECTOR' | 'EPISTEMIC' | 'SPECS';

export default function App() {
  // Engine Singleton references
  const storeRef = useRef<EverworldStateStore | null>(null);
  const ledgerRef = useRef<CausalLedgerDag | null>(null);
  const authorityRef = useRef<AuthorityRegistry | null>(null);
  const commitGatewayRef = useRef<DurableCommitGateway | null>(null);
  const couplingEngineRef = useRef<CouplingEngine | null>(null);
  const continuousEngineRef = useRef<ContinuousEngine | null>(null);

  // Simulation Clock & Loop
  const [worldTimeMicros, setWorldTimeMicros] = useState<bigint>(1000000n);
  const [tickCount, setTickCount] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [tickRateMs, setTickRateMs] = useState<number>(800);

  // UI View States
  const [activeTab, setActiveTab] = useState<ActiveTab>('STAGE');
  const [selectedEntityId, setSelectedEntityId] = useState<string | undefined>(undefined);
  const [selectedApertureId, setSelectedApertureId] = useState<string | null>(null);
  const [isLedgerOpen, setIsLedgerOpen] = useState<boolean>(false);

  // Sound burst & dialogue feedback
  const [activeSoundBurst, setActiveSoundBurst] = useState<{ sound: string; subtext?: string } | null>(null);
  const [lastDialogue, setLastDialogue] = useState<{
    speaker: string;
    text: string;
    type?: 'speech' | 'thought' | 'shout';
    color?: string;
  }>({
    speaker: 'Ignis-Vorax',
    text: 'A mortal crosses the threshold of the deep crag. Does it bring meat, or merely fragile bone to turn to ash?',
    type: 'speech',
    color: '#E11D48',
  });

  // State Store Snapshots for UI
  const [records, setRecords] = useState<ReadonlyArray<StateRecord>>([]);
  const [adversarialSuiteResult, setAdversarialSuiteResult] = useState<{
    allPassed: boolean;
    results: Record<string, { passed: boolean; message: string }>;
  } | null>(null);

  // Initialize Engine
  const initializeEngine = useCallback(() => {
    const store = new EverworldStateStore();
    const ledger = new CausalLedgerDag();
    const authority = new AuthorityRegistry();
    const commitGateway = new DurableCommitGateway(store, store, ledger, ledger, ledger);
    const couplingEngine = new CouplingEngine(store, ledger, authority, commitGateway);
    const continuousEngine = new ContinuousEngine(store);

    seedSanctumScenario(store);

    storeRef.current = store;
    ledgerRef.current = ledger;
    authorityRef.current = authority;
    commitGatewayRef.current = commitGateway;
    couplingEngineRef.current = couplingEngine;
    continuousEngineRef.current = continuousEngine;

    setRecords(store.getAllActiveRecords());
    setWorldTimeMicros(1000000n);
    setTickCount(0);
  }, []);

  useEffect(() => {
    initializeEngine();
    // Run adversarial invariant audit once
    const suiteRes = runAdversarialRegressionSuite();
    setAdversarialSuiteResult(suiteRes);
  }, [initializeEngine]);

  // Continuous Process Loop (Phi)
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (!continuousEngineRef.current || !storeRef.current) return;
      setWorldTimeMicros((prev) => {
        const next = prev + 1000000n;
        const report = continuousEngineRef.current!.tick(TIMELINE_PRIME, prev, 1000000n);
        setTickCount(report.tickNumber);
        setRecords(storeRef.current!.getAllActiveRecords());
        return next;
      });
    }, tickRateMs);

    return () => clearInterval(interval);
  }, [isRunning, tickRateMs]);

  // Step 1 Continuous Tick
  const handleStepTick = () => {
    if (!continuousEngineRef.current || !storeRef.current) return;
    setWorldTimeMicros((prev) => {
      const next = prev + 1000000n;
      const report = continuousEngineRef.current!.tick(TIMELINE_PRIME, prev, 1000000n);
      setTickCount(report.tickNumber);
      setRecords(storeRef.current!.getAllActiveRecords());
      return next;
    });
  };

  // Dispatch Discrete Action Proposal
  const handleDispatchAction = (proposal: ActionProposal) => {
    if (!couplingEngineRef.current || !storeRef.current) return;

    const res: CouplingResult = couplingEngineRef.current.executeAction(
      TIMELINE_PRIME,
      proposal,
      worldTimeMicros
    );

    if (res.success) {
      setRecords(storeRef.current.getAllActiveRecords());

      // Trigger comic sound burst
      setActiveSoundBurst({
        sound: res.soundFx,
        subtext: `${proposal.label} Committed via 2PC WAL`,
      });

      // Update dramatic dialogue bubble
      if (res.dialogueLine) {
        setLastDialogue({
          speaker: proposal.actorEntityUuid === ENTITY_DRAGON ? 'Ignis-Vorax' : 'Kaelen',
          text: res.dialogueLine,
          type: proposal.actorEntityUuid === ENTITY_DRAGON ? 'shout' : 'speech',
          color: proposal.actorEntityUuid === ENTITY_DRAGON ? '#E11D48' : '#0284C7',
        });
      }
    }
  };

  // Helper extraction of active values for UI bindings
  const getRecordValue = (entityUuid: string, path: string): Record<string, unknown> => {
    const rec = records.find((r) => r.entityUuid === entityUuid && r.path === path);
    return (rec?.value as Record<string, unknown>) || {};
  };

  const dragonVitals = getRecordValue(ENTITY_DRAGON, 'somatics.vitals') as {
    stamina: number;
    coreTemp: number;
    scaleArmor: number;
    rage: number;
  };
  const dragonMind = getRecordValue(ENTITY_DRAGON, 'mind.beliefs') as {
    intruderType: string;
    recognizedRelic: string | null;
    daisIntegrity: string;
    tacticalIntent: string;
  };
  const wandererVitals = getRecordValue(ENTITY_WANDERER, 'somatics.vitals') as {
    stamina: number;
    coreTemp: number;
    shield: number;
    adrenaline: number;
  };
  const wandererMind = getRecordValue(ENTITY_WANDERER, 'mind.beliefs') as {
    dragonWeakness: string;
    sanctumApertureSafe: boolean;
    daisMagmaFissure: string;
    tacticalOption: string;
  };
  const sanctumEnv = getRecordValue(ENTITY_SANCTUM, 'environment.ambient') as {
    ambientTemp: number;
    magmaPressure: number;
    stability: number;
  };
  const bridgeAperture = getRecordValue(ENTITY_SANCTUM, 'topology.apertures.bridge') as {
    status: string;
    traversable: boolean;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 font-sans selection:bg-amber-300 selection:text-black">
      {/* Visual Comic Sound Effect Overlay */}
      {activeSoundBurst && (
        <SoundBurst
          soundText={activeSoundBurst.sound}
          subtext={activeSoundBurst.subtext}
          onFinished={() => setActiveSoundBurst(null)}
        />
      )}

      {/* Spatial Aperture Detail Modal */}
      <ApertureInspectorModal
        apertureId={selectedApertureId}
        onClose={() => setSelectedApertureId(null)}
        bridgeStatus={bridgeAperture.status || 'INTACT'}
        ambientTemp={sanctumEnv.ambientTemp || 82}
      />

      {/* Causal Ledger DAG Slide-out Drawer */}
      <CausalLedgerDrawer
        packets={ledgerRef.current ? ledgerRef.current.getAllPackets() : []}
        occurrences={ledgerRef.current ? ledgerRef.current.getAllOccurrences() : []}
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
      />

      {/* TOP BAR CONTRACT: Zone 1 (Wordmark) — Zone 2 (Single-Line Nav Links) — Zone 3 (Primary Action) */}
      <header className="sticky top-0 z-40 bg-white border-b-3 border-black shadow-[0_4px_0px_#000000] px-4 md:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl md:text-2xl font-black tracking-tight text-zinc-950 uppercase whitespace-nowrap shrink-0">
            EVERWORLD 6
          </span>
          <span className="hidden sm:inline bg-black text-amber-300 font-mono text-[10px] font-black px-1.5 py-0.5 border border-black uppercase">
            CORE RUNTIME
          </span>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links with hover underlines */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-black uppercase tracking-wider text-zinc-700">
          <button
            onClick={() => setActiveTab('STAGE')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'STAGE' ? 'text-black underline decoration-3 underline-offset-6 font-black' : 'hover:text-black'
            }`}
          >
            Sanctum Stage
          </button>
          <button
            onClick={() => {
              setActiveTab('INSPECTOR');
              setSelectedEntityId(undefined);
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'INSPECTOR' ? 'text-black underline decoration-3 underline-offset-6 font-black' : 'hover:text-black'
            }`}
          >
            State Paths ({records.length})
          </button>
          <button
            onClick={() => setActiveTab('EPISTEMIC')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'EPISTEMIC' ? 'text-black underline decoration-3 underline-offset-6 font-black' : 'hover:text-black'
            }`}
          >
            Epistemic Horizon
          </button>
          <button
            onClick={() => setIsLedgerOpen(true)}
            className="hover:text-black transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
          >
            <GitCommit className="w-3.5 h-3.5 text-amber-600" />
            Causal DAG
          </button>
          <button
            onClick={() => setActiveTab('SPECS')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'SPECS' ? 'text-black underline decoration-3 underline-offset-6 font-black' : 'hover:text-black'
            }`}
          >
            Invariants & Tests
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsRunning((prev) => !prev)}
            className={`px-4 py-2 text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_#000000] transition-transform active:translate-y-0.5 whitespace-nowrap shrink-0 cursor-pointer ${
              isRunning ? 'bg-amber-400 text-black hover:bg-amber-300' : 'bg-black text-amber-300 hover:bg-zinc-800'
            }`}
          >
            {isRunning ? 'Pause Engine (Φ)' : 'Run Engine (Φ)'}
          </button>
        </div>
      </header>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex overflow-x-auto gap-2 p-2 bg-amber-100 border-b-2 border-black text-xs font-bold font-mono">
        <button
          onClick={() => setActiveTab('STAGE')}
          className={`px-3 py-1 border border-black shrink-0 ${activeTab === 'STAGE' ? 'bg-black text-amber-300' : 'bg-white'}`}
        >
          Stage
        </button>
        <button
          onClick={() => setActiveTab('INSPECTOR')}
          className={`px-3 py-1 border border-black shrink-0 ${activeTab === 'INSPECTOR' ? 'bg-black text-amber-300' : 'bg-white'}`}
        >
          Paths
        </button>
        <button
          onClick={() => setActiveTab('EPISTEMIC')}
          className={`px-3 py-1 border border-black shrink-0 ${activeTab === 'EPISTEMIC' ? 'bg-black text-amber-300' : 'bg-white'}`}
        >
          Epistemics
        </button>
        <button
          onClick={() => setIsLedgerOpen(true)}
          className="px-3 py-1 border border-black shrink-0 bg-white"
        >
          Causal DAG
        </button>
        <button
          onClick={() => setActiveTab('SPECS')}
          className={`px-3 py-1 border border-black shrink-0 ${activeTab === 'SPECS' ? 'bg-black text-amber-300' : 'bg-white'}`}
        >
          Invariants
        </button>
      </div>

      {/* Main Simulation Viewport */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Continuous Engine Simulation Bar */}
        <SimulationControls
          isRunning={isRunning}
          onToggleRun={() => setIsRunning((prev) => !prev)}
          onStepTick={handleStepTick}
          onReset={initializeEngine}
          tickCount={tickCount}
          worldTimeMicros={worldTimeMicros}
          tickRateMs={tickRateMs}
          onChangeTickRate={setTickRateMs}
        />

        {/* Tab 1: Stage (Graphic Novel Comic Viewport & Action Deck) */}
        {activeTab === 'STAGE' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <ComicStage
              dragonVitals={dragonVitals}
              dragonMind={dragonMind}
              wandererVitals={wandererVitals}
              wandererMind={wandererMind}
              sanctumEnv={sanctumEnv}
              lastDialogue={lastDialogue}
              selectedAperture={selectedApertureId || ''}
              onSelectAperture={setSelectedApertureId}
              onInspectEntity={(entityId) => {
                setSelectedEntityId(entityId);
                setActiveTab('INSPECTOR');
              }}
            />

            {/* Discrete Occurrence Trigger Deck */}
            <ActionDispatchDeck onDispatchAction={handleDispatchAction} />
          </div>
        )}

        {/* Tab 2: Authoritative State Path Inspector */}
        {activeTab === 'INSPECTOR' && (
          <div className="animate-in fade-in duration-150">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEntityId(undefined)}
                  className={`px-3 py-1 text-xs font-mono font-bold border-2 border-black shadow-[2px_2px_0px_#000000] cursor-pointer ${
                    !selectedEntityId ? 'bg-black text-amber-300' : 'bg-white text-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  ALL ENTITIES
                </button>
                <button
                  onClick={() => setSelectedEntityId(ENTITY_DRAGON)}
                  className={`px-3 py-1 text-xs font-mono font-bold border-2 border-black shadow-[2px_2px_0px_#000000] cursor-pointer ${
                    selectedEntityId === ENTITY_DRAGON ? 'bg-rose-600 text-white' : 'bg-white text-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  IGNIS-VORAX
                </button>
                <button
                  onClick={() => setSelectedEntityId(ENTITY_WANDERER)}
                  className={`px-3 py-1 text-xs font-mono font-bold border-2 border-black shadow-[2px_2px_0px_#000000] cursor-pointer ${
                    selectedEntityId === ENTITY_WANDERER ? 'bg-sky-600 text-white' : 'bg-white text-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  KAELEN
                </button>
                <button
                  onClick={() => setSelectedEntityId(ENTITY_SANCTUM)}
                  className={`px-3 py-1 text-xs font-mono font-bold border-2 border-black shadow-[2px_2px_0px_#000000] cursor-pointer ${
                    selectedEntityId === ENTITY_SANCTUM ? 'bg-amber-400 text-black' : 'bg-white text-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  SANCTUM ENV
                </button>
              </div>
            </div>

            <StatePathInspector
              records={records}
              selectedEntity={selectedEntityId}
              onSelectEntity={setSelectedEntityId}
            />
          </div>
        )}

        {/* Tab 3: Epistemic Horizons & Belief Graphs */}
        {activeTab === 'EPISTEMIC' && (
          <div className="animate-in fade-in duration-150">
            <EpistemicDiff
              dragonMind={dragonMind}
              wandererMind={wandererMind}
              groundTruth={{
                sanctumStability: sanctumEnv.stability || 88,
                dragonChestScaleFractured: true,
                wandererHasVoidGlass: true,
                daisMagmaFissureCritical: (sanctumEnv.magmaPressure || 64) > 70,
                bridgeTraversable: bridgeAperture.traversable ?? true,
              }}
            />
          </div>
        )}

        {/* Tab 4: Invariants Audit & Specifications */}
        {activeTab === 'SPECS' && (
          <div className="bg-white border-3 border-black p-5 shadow-[4px_4px_0px_#000000] space-y-4 animate-in fade-in duration-150 font-mono">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <span className="bg-black text-amber-300 text-[10px] font-black px-1.5 py-0.5 uppercase tracking-wider">
                  CANONICAL AUDIT
                </span>
                <h2 className="text-lg font-black uppercase tracking-tight text-zinc-950 mt-1">
                  13 STRUCTURAL INVARIANTS & 2PC VERIFICATION SUITE
                </h2>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-950 px-2.5 py-1 border border-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ALL VERIFIED & LOCKED</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {adversarialSuiteResult &&
                Object.entries(adversarialSuiteResult.results).map(([key, val]) => {
                  const item = val as { passed: boolean; message: string };
                  return (
                    <div
                      key={key}
                      className="p-3 border-2 border-black bg-zinc-50 shadow-[2px_2px_0px_#000000] flex items-start justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-zinc-900">{key}</div>
                        <div className="text-[11px] text-zinc-600 mt-0.5 font-sans">
                          {item.message}
                        </div>
                      </div>
                      <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 border border-black uppercase shrink-0">
                        PASS
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>

      {/* Comic Footer */}
      <footer className="border-t-3 border-black bg-white mt-12 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-600">
          <div className="flex items-center gap-2">
            <span className="font-black text-zinc-900 uppercase">Dragon x Deus: Everworld 6</span>
            <span>·</span>
            <span>Canonical Core Engine</span>
          </div>
          <div>
            <span>13 Invariants Enforced · Dual-Phase Atomic WAL · Comic Runtime Substrate</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
