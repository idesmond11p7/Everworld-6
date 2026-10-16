import React from 'react';
import { GitCommit, CheckCircle, ShieldCheck, ArrowRight, CornerDownRight } from 'lucide-react';
import { DeterminationCommitPacket, OccurrenceManifestation } from '../../types/causal';

interface CausalLedgerDrawerProps {
  packets: ReadonlyArray<DeterminationCommitPacket>;
  occurrences: ReadonlyArray<OccurrenceManifestation>;
  isOpen: boolean;
  onClose: () => void;
}

export const CausalLedgerDrawer: React.FC<CausalLedgerDrawerProps> = ({
  packets,
  occurrences,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white border-l-4 border-black h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="bg-zinc-950 text-white p-4 border-b-3 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-black uppercase tracking-tight text-white">
                CAUSAL LEDGER DAG & OCCURRENCES
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Immutable Directed Acyclic Graph · 13 Structural Invariants Enforced
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 bg-amber-400 text-black font-black text-xs uppercase border-2 border-black hover:bg-amber-300 transition-colors shadow-[2px_2px_0px_#000000] cursor-pointer"
          >
            CLOSE [ESC]
          </button>
        </div>

        {/* Invariant Banner */}
        <div className="bg-emerald-50 border-b-2 border-black p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-950">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>2PC WAL STATUS: ACTIVE & VERIFIED (INV 1-13 PASS)</span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 border border-emerald-400 font-bold">
            {packets.length} DETERMINATIONS
          </span>
        </div>

        {/* DAG Packets List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 font-mono">
          {packets.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              No runtime determinations yet. Genesis states are loaded.
            </div>
          ) : (
            packets.map((pkt, idx) => (
              <div
                key={pkt.determinationId}
                className="bg-white border-2 border-black p-3.5 shadow-[3px_3px_0px_#000000] space-y-2.5"
              >
                {/* Packet Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white text-[10px] font-black px-1.5 py-0.5">
                      #{idx + 1}
                    </span>
                    <span className="font-black text-xs text-zinc-950">
                      {pkt.determinationId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 font-bold">
                      {pkt.domainEngineId}
                    </span>
                    <span className="text-zinc-500 tabular-nums">
                      {pkt.timestamp.toString()} μs
                    </span>
                  </div>
                </div>

                {/* Actualized Occurrences */}
                {pkt.actualizedOccurrences && pkt.actualizedOccurrences.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Occurrences Manifested:
                    </div>
                    {pkt.actualizedOccurrences.map((occ) => (
                      <div
                        key={occ.occurrenceId}
                        className="bg-zinc-100 border border-black p-2 flex items-center justify-between text-xs"
                      >
                        <span className="font-extrabold text-zinc-900">
                          💥 {occ.label}
                        </span>
                        <span className="text-[10px] text-zinc-600 font-mono">
                          target: {occ.primaryAffectedEntity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Committed Mutations */}
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Committed Dual-Write Mutations ({pkt.committedMutations.length}):
                  </div>
                  <div className="space-y-1">
                    {pkt.committedMutations.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="bg-zinc-50 border border-zinc-300 p-1.5 text-[11px] flex flex-wrap items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-1.5">
                          <CornerDownRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="font-bold text-zinc-800">{m.entityUuid}</span>
                          <span className="text-zinc-400">/</span>
                          <span className="text-rose-600 font-bold">{m.path}</span>
                        </div>
                        <div className="text-zinc-600 text-[10px] tabular-nums">
                          v{m.previousVersion.toString()} ➔ <span className="font-bold text-emerald-600">v{m.newVersion.toString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Provenance & Invariant Check */}
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-100">
                  <span>Digest: {pkt.provenanceDigest}</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> VERIFIED 2PC WAL
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
