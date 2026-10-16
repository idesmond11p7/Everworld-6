import React from 'react';
import { Zap, Flame, Shield, Sparkles, AlertTriangle } from 'lucide-react';
import { ActionProposal } from '../../core/coupling/CouplingEngine';
import { ENTITY_DRAGON, ENTITY_WANDERER } from '../../scenarios/sanctum_scenario';

interface ActionDispatchDeckProps {
  onDispatchAction: (proposal: ActionProposal) => void;
  disabled?: boolean;
}

export const ActionDispatchDeck: React.FC<ActionDispatchDeckProps> = ({
  onDispatchAction,
  disabled = false,
}) => {
  const actions: Array<{
    proposal: ActionProposal;
    badge: string;
    description: string;
    couplingSummary: string;
    theme: 'rose' | 'sky' | 'amber';
  }> = [
    {
      proposal: {
        actionId: 'DRAGON_HELLFIRE_BREATH',
        label: 'Unleash Hellfire Breath',
        actorEntityUuid: ENTITY_DRAGON,
        targetEntityUuid: ENTITY_WANDERER,
        domainEngineId: 'DRACONIC_THERMAL_ENGINE',
        soundFx: 'FWSSSHHH!',
        dialogueLine: 'BURN, WRETCH OF CLAY! YOUR PATH ENDS IN SMOKE!',
        innerThought: 'Its kinetic barrier will boil into vapor.',
      },
      badge: 'IGNIS-VORAX ATTACK',
      description: 'Expels 1,600°C cone of convective flame toward the threshold.',
      couplingSummary: 'Couples Thermal Flux -> Somatic Shield -40% -> Epistemic Dread -> Ambient Temp +35°C',
      theme: 'rose',
    },
    {
      proposal: {
        actionId: 'WANDERER_VOID_TETHER',
        label: 'Attune Void-Glass Tether',
        actorEntityUuid: ENTITY_WANDERER,
        targetEntityUuid: ENTITY_DRAGON,
        domainEngineId: 'CHRONO_VOID_ENGINE',
        soundFx: 'KRR-RAK!',
        dialogueLine: 'By the Seventh Weaver, your fire turns upon its origin!',
        innerThought: 'The resonance is locked onto the cracked scale... hold steady.',
      },
      badge: 'KAELEN TACTIC',
      description: 'Channels anti-thermal void resonance to invert draconic heat.',
      couplingSummary: 'Couples Item Resonance -> Dragon Scale Armor -18% -> Dragon Epistemic Shock',
      theme: 'sky',
    },
    {
      proposal: {
        actionId: 'WANDERER_INSCRIBE_RUNIC_SEAL',
        label: 'Inscribe Grounding Seal',
        actorEntityUuid: ENTITY_WANDERER,
        domainEngineId: 'TOPOLOGICAL_RUNIC_ENGINE',
        soundFx: 'SHIING!',
        dialogueLine: 'Firm the ground, bind the tremor!',
        innerThought: 'If the basalt arch holds, I have an escape route.',
      },
      badge: 'DEFENSIVE RUNE',
      description: 'Etches stabilizing glyphs into the floor, reinforcing shields & arch.',
      couplingSummary: 'Couples Topological Seal -> Wanderer Shield +30% -> Sanctum Stability +20%',
      theme: 'sky',
    },
    {
      proposal: {
        actionId: 'SANCTUM_MAGMA_SURGE',
        label: 'Trigger Subterranean Surge',
        actorEntityUuid: 'sanctum_environment',
        domainEngineId: 'ENVIRONMENTAL_SEISMIC_ENGINE',
        soundFx: 'THOOOOM!',
        dialogueLine: '*A deep subterranean tectonic groan shakes the foundations*',
        innerThought: 'The molten lake beneath the central dais is expanding.',
      },
      badge: 'ENVIRONMENTAL CRISIS',
      description: 'Tectonic fissure breaches, flooding the trench with superheated magma.',
      couplingSummary: 'Couples Seismic Fault -> Basalt Bridge Submersion -> Ambient Temp +45°C',
      theme: 'amber',
    },
  ];

  return (
    <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_#000000]">
      <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
        <div>
          <span className="bg-black text-amber-300 font-mono text-[10px] font-black px-1.5 py-0.5 uppercase tracking-wider">
            TRANSITION MACHINERY
          </span>
          <h2 className="text-base font-black uppercase tracking-tight text-zinc-950 mt-1">
            DISCRETE OCCURRENCE DISPATCH DECK
          </h2>
        </div>
        <span className="text-xs font-serif italic text-zinc-600 hidden sm:inline">
          Proposes atomic event ➔ Validates 13 Invariants ➔ Executes Coupling Waves
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act) => {
          const isRose = act.theme === 'rose';
          const isSky = act.theme === 'sky';
          return (
            <button
              key={act.proposal.actionId}
              disabled={disabled}
              onClick={() => onDispatchAction(act.proposal)}
              className={`p-3 text-left border-2 border-black shadow-[3px_3px_0px_#000000] flex flex-col justify-between transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isRose
                  ? 'bg-rose-50 hover:bg-rose-100'
                  : isSky
                  ? 'bg-sky-50 hover:bg-sky-100'
                  : 'bg-amber-50 hover:bg-amber-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[9px] font-mono font-black px-1.5 py-0.5 border border-black ${
                      isRose
                        ? 'bg-rose-600 text-white'
                        : isSky
                        ? 'bg-sky-600 text-white'
                        : 'bg-amber-400 text-black'
                    }`}
                  >
                    {act.badge}
                  </span>
                  <span className="font-black italic text-xs text-zinc-900">
                    "{act.proposal.soundFx}"
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-zinc-950 mb-1 leading-snug">
                  {act.proposal.label}
                </h4>
                <p className="text-xs text-zinc-700 leading-normal mb-2">
                  {act.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-300">
                <span className="text-[10px] font-mono text-zinc-600 leading-tight block">
                  {act.couplingSummary}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
