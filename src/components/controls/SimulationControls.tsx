import React from 'react';
import { Play, Pause, StepForward, RotateCcw, Clock, Activity } from 'lucide-react';

interface SimulationControlsProps {
  isRunning: boolean;
  onToggleRun: () => void;
  onStepTick: () => void;
  onReset: () => void;
  tickCount: number;
  worldTimeMicros: bigint;
  tickRateMs: number;
  onChangeTickRate: (rateMs: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  onToggleRun,
  onStepTick,
  onReset,
  tickCount,
  worldTimeMicros,
  tickRateMs,
  onChangeTickRate,
}) => {
  const seconds = Number(worldTimeMicros / 1000000n);

  return (
    <div className="bg-zinc-950 text-white border-3 border-black p-3 shadow-[4px_4px_0px_#000000] flex flex-wrap items-center justify-between gap-4">
      {/* Clock Telemetry */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              SIMULATION TIME (Φ)
            </div>
            <div className="text-sm font-mono font-extrabold text-amber-300 tabular-nums">
              {seconds}s <span className="text-zinc-500 text-xs">({worldTimeMicros.toString()} μs)</span>
            </div>
          </div>
        </div>

        <div className="hidden sm:block border-l border-zinc-800 pl-4">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
            CONTINUOUS TICKS
          </div>
          <div className="text-sm font-mono font-extrabold text-white tabular-nums">
            #{tickCount}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleRun}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000000] transition-transform active:translate-y-0.5 cursor-pointer ${
            isRunning ? 'bg-amber-400 text-black hover:bg-amber-300' : 'bg-emerald-500 text-white hover:bg-emerald-400'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" /> PAUSE Φ
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" /> RUN Φ
            </>
          )}
        </button>

        <button
          onClick={onStepTick}
          disabled={isRunning}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-black uppercase bg-zinc-800 text-white hover:bg-zinc-700 border-2 border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_#000000] active:translate-y-0.5 cursor-pointer"
        >
          <StepForward className="w-3.5 h-3.5" /> STEP Φ
        </button>

        {/* Speed Selector */}
        <div className="hidden md:flex items-center border-2 border-zinc-700 bg-zinc-900 p-0.5">
          <button
            onClick={() => onChangeTickRate(1500)}
            className={`px-2 py-0.5 text-[11px] font-mono font-bold ${
              tickRateMs === 1500 ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            0.5x
          </button>
          <button
            onClick={() => onChangeTickRate(800)}
            className={`px-2 py-0.5 text-[11px] font-mono font-bold ${
              tickRateMs === 800 ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            1x
          </button>
          <button
            onClick={() => onChangeTickRate(350)}
            className={`px-2 py-0.5 text-[11px] font-mono font-bold ${
              tickRateMs === 350 ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            2x
          </button>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-300 hover:text-rose-100 hover:bg-rose-950/60 border border-rose-900 transition-colors cursor-pointer"
          title="Reset Scenario to Genesis"
        >
          <RotateCcw className="w-3.5 h-3.5" /> RESET
        </button>
      </div>
    </div>
  );
};
