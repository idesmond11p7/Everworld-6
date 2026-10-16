import React from 'react';

interface SpeechBubbleProps {
  speaker: string;
  text: string;
  type?: 'speech' | 'thought' | 'shout';
  speakerColor?: string;
  direction?: 'left' | 'right';
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  speaker,
  text,
  type = 'speech',
  speakerColor = '#E11D48',
  direction = 'left',
}) => {
  if (type === 'shout') {
    return (
      <div className="relative my-2 inline-block max-w-md animate-bounce">
        <div
          className="relative bg-amber-300 border-3 border-black px-4 py-2 text-zinc-950 font-black tracking-wide uppercase text-sm shadow-[4px_4px_0px_#000000]"
          style={{
            clipPath: 'polygon(0% 10%, 15% 0%, 35% 8%, 50% 0%, 70% 10%, 85% 0%, 100% 12%, 92% 50%, 100% 88%, 82% 100%, 65% 90%, 50% 100%, 30% 92%, 15% 100%, 0% 85%, 6% 48%)',
          }}
        >
          <div className="text-[10px] font-mono tracking-widest text-zinc-800" style={{ color: speakerColor }}>
            [{speaker}]
          </div>
          <p className="font-extrabold">{text}</p>
        </div>
      </div>
    );
  }

  if (type === 'thought') {
    return (
      <div className={`relative my-2 flex flex-col ${direction === 'right' ? 'items-end' : 'items-start'} max-w-sm`}>
        <div className="relative bg-zinc-50 border-2 border-dashed border-zinc-800 rounded-3xl px-4 py-2.5 text-zinc-900 shadow-[3px_3px_0px_rgba(0,0,0,0.8)]">
          <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-500 mb-0.5">
            💭 {speaker}'s Epistemic Belief
          </div>
          <p className="text-xs italic leading-relaxed text-zinc-800 font-serif">"{text}"</p>
        </div>
        {/* Thought bubble trail dots */}
        <div className={`flex gap-1 mt-1 ${direction === 'right' ? 'mr-6' : 'ml-6'}`}>
          <div className="w-2 h-2 rounded-full border border-black bg-white" />
          <div className="w-1.5 h-1.5 rounded-full border border-black bg-white" />
          <div className="w-1 h-1 rounded-full border border-black bg-white" />
        </div>
      </div>
    );
  }

  // Standard dialogue speech bubble
  return (
    <div className={`relative my-2 flex flex-col ${direction === 'right' ? 'items-end' : 'items-start'} max-w-md`}>
      <div className="relative bg-white border-2 border-black rounded-2xl px-4 py-2.5 text-zinc-950 shadow-[4px_4px_0px_#000000]">
        <div className="text-[11px] font-black uppercase tracking-wider mb-0.5 flex items-center gap-1.5" style={{ color: speakerColor }}>
          <span className="w-2 h-2 rounded-full border border-black inline-block" style={{ backgroundColor: speakerColor }} />
          {speaker}
        </div>
        <p className="text-sm font-medium leading-snug">{text}</p>
        {/* Tail */}
        <div
          className={`absolute -bottom-2 ${direction === 'right' ? 'right-6' : 'left-6'} w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-black`}
        />
        <div
          className={`absolute -bottom-1.5 ${direction === 'right' ? 'right-6' : 'left-6'} w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white`}
        />
      </div>
    </div>
  );
};
