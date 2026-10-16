import React, { useState } from 'react';
import { Database, ShieldCheck, Clock, FileCode, ChevronRight, ChevronDown, Sparkles } from 'lucide-react';
import { StateRecord } from '../../core/state/StateStore';

interface StatePathInspectorProps {
  records: ReadonlyArray<StateRecord>;
  selectedEntity?: string;
  onSelectEntity?: (entityUuid: string) => void;
}

export const StatePathInspector: React.FC<StatePathInspectorProps> = ({
  records,
  selectedEntity,
  onSelectEntity,
}) => {
  const [filterDomain, setFilterDomain] = useState<string>('ALL');
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => {
    setExpandedPaths((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredRecords = records.filter((r) => {
    if (selectedEntity && r.entityUuid !== selectedEntity) return false;
    if (filterDomain !== 'ALL' && r.ownerDomain !== filterDomain) return false;
    return true;
  });

  const domains = Array.from(new Set(records.map((r) => r.ownerDomain)));

  return (
    <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_#000000]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-zinc-950" />
          <h2 className="text-lg font-black uppercase tracking-tight text-zinc-950">
            AUTHORITATIVE STATE PATH STORE
          </h2>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterDomain('ALL')}
            className={`px-2.5 py-1 text-xs font-mono font-bold border border-black cursor-pointer ${
              filterDomain === 'ALL' ? 'bg-black text-amber-300' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            ALL DOMAINS ({records.length})
          </button>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setFilterDomain(dom)}
              className={`px-2.5 py-1 text-xs font-mono font-bold border border-black cursor-pointer ${
                filterDomain === dom ? 'bg-black text-amber-300' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Path List */}
      <div className="space-y-2">
        {filteredRecords.map((rec) => {
          const key = `${rec.timelineId}::${rec.entityUuid}::${rec.path}`;
          const isExpanded = expandedPaths[key] ?? true;
          return (
            <div
              key={key}
              className="border-2 border-black bg-zinc-50 transition-colors hover:bg-zinc-100 shadow-[2px_2px_0px_#000000]"
            >
              <div
                onClick={() => toggleExpand(key)}
                className="p-2.5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-zinc-900 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-900 shrink-0" />
                  )}
                  <span className="font-mono font-black text-xs text-zinc-950 tracking-tight">
                    {rec.entityUuid} / <span className="text-rose-600">{rec.path}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="bg-amber-200 text-zinc-950 px-1.5 py-0.5 border border-black font-bold text-[10px]">
                    {rec.ownerDomain}
                  </span>
                  <span className="bg-zinc-900 text-white px-2 py-0.5 font-extrabold text-[11px] tabular-nums">
                    v{rec.version.toString()}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="p-3 bg-white border-t-2 border-black font-mono text-xs space-y-2">
                  <div className="flex flex-wrap justify-between gap-2 text-[11px] text-zinc-600 border-b border-zinc-200 pb-1">
                    <span>
                      Digest: <code className="text-zinc-900 font-bold">{rec.valueDigest}</code>
                    </span>
                    <span>
                      Interval: <span className="tabular-nums">[{rec.interval.start.toString()} μs, active]</span>
                    </span>
                  </div>

                  {/* Value Payload Display */}
                  <div className="bg-zinc-950 text-emerald-400 p-2.5 rounded border border-zinc-800 overflow-x-auto">
                    <pre className="text-xs leading-relaxed font-mono">
                      {JSON.stringify(rec.value, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
