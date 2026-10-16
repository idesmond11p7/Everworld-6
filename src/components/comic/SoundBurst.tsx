import React, { useEffect, useState } from 'react';

interface SoundBurstProps {
  soundText: string;
  subtext?: string;
  onFinished?: () => void;
}

export const SoundBurst: React.FC<SoundBurstProps> = ({ soundText, subtext, onFinished }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinished) onFinished();
    }, 2800);
    return () => clearTimeout(timer);
  }, [soundText, onFinished]);

  if (!visible || !soundText) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-4">
      <div className="animate-in zoom-in-50 duration-200 transform -rotate-6">
        <div className="relative bg-amber-400 border-4 border-black px-8 py-4 shadow-[8px_8px_0px_#000000] text-center">
          <div className="absolute -top-3 -left-3 bg-rose-600 text-white font-black text-xs px-2 py-0.5 border-2 border-black rotate-3">
            OCCURRENCE COMMITTED
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter text-zinc-950 stroke-black drop-shadow-[3px_3px_0px_#FFF]">
            {soundText}
          </h2>
          {subtext && (
            <p className="mt-1 font-mono text-xs font-bold uppercase tracking-widest text-zinc-900 bg-amber-200 border border-black px-2 py-0.5 inline-block">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
