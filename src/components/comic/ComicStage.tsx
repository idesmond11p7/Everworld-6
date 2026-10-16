import React from 'react';
import { Flame, Compass, ShieldAlert, Thermometer, Wind, Zap } from 'lucide-react';
import { ComicPanel } from './ComicPanel';
import { SpeechBubble } from './SpeechBubble';
import { SCENARIO_ASSETS } from '../../scenarios/sanctum_scenario';

interface ComicStageProps {
  dragonVitals: { stamina: number; coreTemp: number; scaleArmor: number; rage: number };
  dragonMind: { intruderType: string; recognizedRelic: string | null; daisIntegrity: string; tacticalIntent: string };
  wandererVitals: { stamina: number; coreTemp: number; shield: number; adrenaline: number };
  wandererMind: { dragonWeakness: string; sanctumApertureSafe: boolean; daisMagmaFissure: string; tacticalOption: string };
  sanctumEnv: { ambientTemp: number; magmaPressure: number; stability: number };
  lastDialogue?: { speaker: string; text: string; type?: 'speech' | 'thought' | 'shout'; color?: string };
  selectedAperture: string;
  onSelectAperture: (apertureId: string) => void;
  onInspectEntity: (entityId: string) => void;
}

export const ComicStage: React.FC<ComicStageProps> = ({
  dragonVitals,
  dragonMind,
  wandererVitals,
  wandererMind,
  sanctumEnv,
  lastDialogue,
  selectedAperture,
  onSelectAperture,
  onInspectEntity,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Graphic Novel Header Strip */}
      <div className="bg-amber-400 border-3 border-black p-3 shadow-[4px_4px_0px_#000000] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-black text-amber-300 font-mono text-xs font-black px-2 py-0.5 uppercase tracking-wider">
              ISSUE #01
            </span>
            <span className="text-xs font-serif italic text-zinc-900">
              The Obsidian Sanctum · Encounter Phase
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-950 mt-0.5">
            CLASH OF THE DUAL REALMS
          </h1>
        </div>

        {/* Ambient Sanctum Telemetry Strip */}
        <div className="flex items-center gap-3 bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#000000]">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-800">
            <Thermometer className="w-4 h-4 text-rose-600" />
            <span className="tabular-nums">{sanctumEnv.ambientTemp}°C</span>
          </div>
          <span className="text-zinc-300">|</span>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-800">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>MAGMA: {sanctumEnv.magmaPressure}%</span>
          </div>
          <span className="text-zinc-300">|</span>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-800">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>STABILITY: {sanctumEnv.stability}%</span>
          </div>
        </div>
      </div>

      {/* Panel 1: Wide Establishing Shot of the Sanctum */}
      <ComicPanel
        panelNumber="PANEL 01"
        title="THE OBSIDIAN SANCTUM — ANTEROOM OF MOLTEN MEMORY"
        caption="Subterranean heat hums against ancient rune-carved pillars. Above the boiling dais, the ancient serpent watches."
        badgeText="TOPOLOGY: 4 APERTURES"
      >
        <div className="relative w-full h-64 md:h-80 border-2 border-black overflow-hidden bg-zinc-900 group">
          <img
            src={SCENARIO_ASSETS.sanctumBackdrop}
            alt="The Obsidian Sanctum"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter contrast-125 saturate-110"
          />
          {/* Halftone Overlay Effect */}
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60 pointer-events-none" />

          {/* Interactive Aperture Nodes on Tactical Map */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
            {/* High Vault / Dais Node */}
            <div className="flex justify-center pointer-events-auto">
              <button
                onClick={() => onSelectAperture('magma_dais')}
                className={`px-3 py-1 text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_#000000] transition-transform hover:scale-105 ${
                  selectedAperture === 'magma_dais'
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/95 text-zinc-900 hover:bg-rose-100'
                }`}
              >
                🔥 MAGMA DAIS (ELEVATION +12m)
              </button>
            </div>

            {/* Mid Arch & Bridge Nodes */}
            <div className="flex justify-between items-center px-6 pointer-events-auto">
              <button
                onClick={() => onSelectAperture('basalt_bridge')}
                className={`px-3 py-1 text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_#000000] transition-transform hover:scale-105 ${
                  selectedAperture === 'basalt_bridge'
                    ? 'bg-amber-400 text-black'
                    : 'bg-white/95 text-zinc-900 hover:bg-amber-100'
                }`}
              >
                ⚡ BASALT BRIDGE (HEAT: 620°C)
              </button>

              <button
                onClick={() => onSelectAperture('magma_trench')}
                className={`px-3 py-1 text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_#000000] transition-transform hover:scale-105 ${
                  selectedAperture === 'magma_trench'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/95 text-zinc-900 hover:bg-orange-100'
                }`}
              >
                🌊 MAGMA TRENCH
              </button>
            </div>

            {/* Threshold Entry Node */}
            <div className="flex justify-start pointer-events-auto">
              <button
                onClick={() => onSelectAperture('threshold_arch')}
                className={`px-3 py-1 text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_#000000] transition-transform hover:scale-105 ${
                  selectedAperture === 'threshold_arch'
                    ? 'bg-sky-500 text-white'
                    : 'bg-white/95 text-zinc-900 hover:bg-sky-100'
                }`}
              >
                🚪 THRESHOLD ARCH (ENTRY POINT)
              </button>
            </div>
          </div>
        </div>
      </ComicPanel>

      {/* Panels 2 & 3: Split Confrontation Shots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: The Dragon (Ignis-Vorax) */}
        <ComicPanel
          panelNumber="PANEL 02"
          title="IGNIS-VORAX — THE OBSIDIAN COLOSSUS"
          caption="Scales harder than basalt, radiating primordial volcanic fervor."
          accentColor="#E11D48"
          badgeText="ENTITY_01"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Dragon Avatar with Ink Border */}
            <div className="relative w-32 h-32 shrink-0 border-2 border-black overflow-hidden bg-zinc-900 shadow-[3px_3px_0px_#000000]">
              <img
                src={SCENARIO_ASSETS.dragonPortrait}
                alt="Ignis-Vorax"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter contrast-125"
              />
              <button
                onClick={() => onInspectEntity('entity_ignis_vorax')}
                className="absolute bottom-0 inset-x-0 bg-black/80 hover:bg-rose-600 text-[10px] text-white font-mono text-center py-0.5 border-t border-black transition-colors"
              >
                INSPECT STATE
              </button>
            </div>

            {/* Dragon Live Somatic Gauges */}
            <div className="flex-1 space-y-2 text-xs font-mono">
              <div>
                <div className="flex justify-between font-bold text-zinc-900 mb-0.5">
                  <span>SCALE ARMOR</span>
                  <span className="tabular-nums">{dragonVitals.scaleArmor}%</span>
                </div>
                <div className="h-3 w-full border-2 border-black bg-zinc-100 p-0.5">
                  <div
                    className="h-full bg-rose-600 transition-all duration-300"
                    style={{ width: `${dragonVitals.scaleArmor}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-zinc-900 mb-0.5">
                  <span>STAMINA</span>
                  <span className="tabular-nums">{dragonVitals.stamina}%</span>
                </div>
                <div className="h-3 w-full border-2 border-black bg-zinc-100 p-0.5">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${dragonVitals.stamina}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-[11px] font-bold text-zinc-800 pt-1 border-t border-zinc-200">
                <span>CORE TEMP:</span>
                <span className="text-rose-600 font-extrabold tabular-nums">{dragonVitals.coreTemp}°C</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-zinc-800">
                <span>DRACONIC RAGE:</span>
                <span className="text-orange-600 font-extrabold tabular-nums">{dragonVitals.rage}%</span>
              </div>
            </div>
          </div>

          {/* Epistemic Thought Balloon */}
          <div className="mt-3 pt-2 border-t-2 border-dashed border-zinc-300">
            <SpeechBubble
              speaker="Ignis-Vorax"
              text={`"A flea dares step upon my dais? It carries trinkets of glass... it will burn into ash like the others."`}
              type="thought"
              speakerColor="#E11D48"
              direction="left"
            />
          </div>
        </ComicPanel>

        {/* Right: The Wanderer (Kaelen) */}
        <ComicPanel
          panelNumber="PANEL 03"
          title="KAELEN — CHRONO-CARTOGRAPHER"
          caption="Equipped with the resonant Void-Glass compass, mapping causal rifts."
          accentColor="#0284C7"
          badgeText="ENTITY_02"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Wanderer Avatar with Ink Border */}
            <div className="relative w-32 h-32 shrink-0 border-2 border-black overflow-hidden bg-zinc-900 shadow-[3px_3px_0px_#000000]">
              <img
                src={SCENARIO_ASSETS.wandererPortrait}
                alt="Kaelen"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter contrast-125"
              />
              <button
                onClick={() => onInspectEntity('entity_kaelen')}
                className="absolute bottom-0 inset-x-0 bg-black/80 hover:bg-sky-600 text-[10px] text-white font-mono text-center py-0.5 border-t border-black transition-colors"
              >
                INSPECT STATE
              </button>
            </div>

            {/* Wanderer Live Somatic Gauges */}
            <div className="flex-1 space-y-2 text-xs font-mono">
              <div>
                <div className="flex justify-between font-bold text-zinc-900 mb-0.5">
                  <span>KINETIC SHIELD</span>
                  <span className="tabular-nums">{wandererVitals.shield}%</span>
                </div>
                <div className="h-3 w-full border-2 border-black bg-zinc-100 p-0.5">
                  <div
                    className="h-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${wandererVitals.shield}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-zinc-900 mb-0.5">
                  <span>STAMINA</span>
                  <span className="tabular-nums">{wandererVitals.stamina}%</span>
                </div>
                <div className="h-3 w-full border-2 border-black bg-zinc-100 p-0.5">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${wandererVitals.stamina}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-[11px] font-bold text-zinc-800 pt-1 border-t border-zinc-200">
                <span>ADRENALINE:</span>
                <span className="text-amber-600 font-extrabold tabular-nums">{wandererVitals.adrenaline}%</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-zinc-800">
                <span>VOID RESONANCE:</span>
                <span className="text-sky-600 font-extrabold tabular-nums">98 Hz (ACTIVE)</span>
              </div>
            </div>
          </div>

          {/* Epistemic Thought Balloon */}
          <div className="mt-3 pt-2 border-t-2 border-dashed border-zinc-300">
            <SpeechBubble
              speaker="Kaelen"
              text={`"The third chest plate is fractured from subterranean pressure. If I can invert the heat flux before the bridge crumbles, the causal tether will hold."`}
              type="thought"
              speakerColor="#0284C7"
              direction="right"
            />
          </div>
        </ComicPanel>
      </div>

      {/* Dynamic Dramatic Dialogue Strip */}
      {lastDialogue && (
        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_#000000]">
          <div className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400 mb-1">
            LATEST DRAMATIC UTTERANCE // OCCURRENCE
          </div>
          <SpeechBubble
            speaker={lastDialogue.speaker}
            text={lastDialogue.text}
            type={lastDialogue.type || 'speech'}
            speakerColor={lastDialogue.color || '#E11D48'}
            direction={lastDialogue.speaker.includes('Dragon') ? 'left' : 'right'}
          />
        </div>
      )}
    </div>
  );
};
