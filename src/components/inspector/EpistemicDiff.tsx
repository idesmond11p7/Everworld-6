import React from 'react';
import { Eye, EyeOff, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

interface EpistemicDiffProps {
  dragonMind: Record<string, unknown>;
  wandererMind: Record<string, unknown>;
  groundTruth: {
    sanctumStability: number;
    dragonChestScaleFractured: boolean;
    wandererHasVoidGlass: boolean;
    daisMagmaFissureCritical: boolean;
    bridgeTraversable: boolean;
  };
}

export const EpistemicDiff: React.FC<EpistemicDiffProps> = ({
  dragonMind,
  wandererMind,
  groundTruth,
}) => {
  return (
    <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_#000000] space-y-4">
      <div className="border-b-2 border-black pb-2">
        <span className="bg-black text-amber-300 font-mono text-[10px] font-black px-1.5 py-0.5 uppercase tracking-wider">
          EPISTEMIC HORIZON (DOC 25)
        </span>
        <h2 className="text-lg font-black uppercase tracking-tight text-zinc-950 mt-1">
          SUBJECTIVE PROJECTION VS. OBJECTIVE GROUND TRUTH
        </h2>
        <p className="text-xs font-serif italic text-zinc-600">
          Entities act exclusively according to their internal belief graphs, not the global world state.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dragon Epistemic Horizon */}
        <div className="border-2 border-black p-3 bg-rose-50 shadow-[2px_2px_0px_#000000]">
          <div className="flex items-center justify-between border-b border-rose-300 pb-2 mb-2">
            <h3 className="font-black text-sm uppercase text-rose-950 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-rose-700" />
              IGNIS-VORAX'S BELIEF HORIZON
            </h3>
            <span className="text-[10px] font-mono font-bold bg-rose-200 text-rose-900 px-1.5 py-0.5 border border-rose-400">
              SOLIPSISTIC EGO
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-white p-2 border border-black">
              <div className="font-bold text-zinc-900 flex justify-between">
                <span>Belief: Wanderer Fragility</span>
                <span className="text-rose-600 font-mono font-black">
                  {String(dragonMind.intruderType || 'INSIGNIFICANT_MORTAL')}
                </span>
              </div>
              <div className="text-[11px] text-zinc-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Ground Truth: Kaelen possesses Chrono-Void Compass (Resonant Threat).</span>
              </div>
            </div>

            <div className="bg-white p-2 border border-black">
              <div className="font-bold text-zinc-900 flex justify-between">
                <span>Belief: Dais Stability</span>
                <span className="text-rose-600 font-mono font-black">
                  {String(dragonMind.daisIntegrity || 'IMPREGNABLE')}
                </span>
              </div>
              <div className="text-[11px] text-zinc-600 mt-1 flex items-center gap-1">
                <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                <span>Ground Truth: Magma fissure active; dais stability at {groundTruth.sanctumStability}%.</span>
              </div>
            </div>

            <div className="bg-white p-2 border border-black">
              <div className="font-bold text-zinc-900 flex justify-between">
                <span>Recognized Relic:</span>
                <span className="text-zinc-700 font-mono font-black">
                  {dragonMind.recognizedRelic ? String(dragonMind.recognizedRelic) : 'NONE (BLINDSPOT)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Wanderer Epistemic Horizon */}
        <div className="border-2 border-black p-3 bg-sky-50 shadow-[2px_2px_0px_#000000]">
          <div className="flex items-center justify-between border-b border-sky-300 pb-2 mb-2">
            <h3 className="font-black text-sm uppercase text-sky-950 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-sky-700" />
              KAELEN'S BELIEF HORIZON
            </h3>
            <span className="text-[10px] font-mono font-bold bg-sky-200 text-sky-900 px-1.5 py-0.5 border border-sky-400">
              CAUSAL SIGHT
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-white p-2 border border-black">
              <div className="font-bold text-zinc-900 flex justify-between">
                <span>Belief: Dragon Chest Plate</span>
                <span className="text-sky-700 font-mono font-black">
                  {String(wandererMind.dragonWeakness || 'FRACTURED_SCALE')}
                </span>
              </div>
              <div className="text-[11px] text-zinc-600 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ground Truth: Scale is genuinely compromised; vulnerable to void flux.</span>
              </div>
            </div>

            <div className="bg-white p-2 border border-black">
              <div className="font-bold text-zinc-900 flex justify-between">
                <span>Belief: Aperture Safety</span>
                <span className="text-sky-700 font-mono font-black">
                  {wandererMind.sanctumApertureSafe ? 'SAFE RETREAT' : 'COMPROMISED'}
                </span>
              </div>
              <div className="text-[11px] text-zinc-600 mt-1 flex items-center gap-1">
                {groundTruth.bridgeTraversable ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                )}
                <span>
                  Ground Truth: Basalt Bridge is {groundTruth.bridgeTraversable ? 'traversable' : 'submerged in magma'}.
                </span>
              </div>
            </div>

            <div className="bg-white p-2 border border-black">
              <div className="font-bold text-zinc-900 flex justify-between">
                <span>Tactical Stance:</span>
                <span className="text-zinc-700 font-mono font-black">
                  {String(wandererMind.tacticalOption || 'ATTUNE_VOID_COMPASS')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
