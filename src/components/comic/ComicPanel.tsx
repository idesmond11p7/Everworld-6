import React from 'react';

interface ComicPanelProps {
  panelNumber?: string;
  title: string;
  caption?: string;
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
  badgeText?: string;
}

export const ComicPanel: React.FC<ComicPanelProps> = ({
  panelNumber,
  title,
  caption,
  children,
  className = '',
  accentColor = '#000000',
  badgeText,
}) => {
  return (
    <div
      className={`relative bg-white border-3 border-black shadow-[5px_5px_0px_#000000] flex flex-col overflow-hidden transition-all ${className}`}
      style={{ borderColor: accentColor === '#000000' ? '#000000' : accentColor }}
    >
      {/* Top Caption Box */}
      <div className="bg-zinc-950 text-white px-3 py-1.5 flex items-center justify-between border-b-3 border-black">
        <div className="flex items-center gap-2">
          {panelNumber && (
            <span className="bg-amber-400 text-black font-black text-[10px] px-1.5 py-0.5 border border-black uppercase tracking-wider">
              {panelNumber}
            </span>
          )}
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-zinc-100">{title}</h3>
        </div>
        {badgeText && (
          <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
            {badgeText}
          </span>
        )}
      </div>

      {caption && (
        <div className="bg-amber-50 border-b-2 border-black px-3 py-1 text-[11px] font-serif italic text-zinc-800">
          "{caption}"
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-3 flex-1 flex flex-col">{children}</div>
    </div>
  );
};
