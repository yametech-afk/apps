"use client";

import { Generation } from "@/types";

interface HistoryProps {
  generations: Generation[];
  onSelect: (generation: Generation) => void;
  onClear: () => void;
}

export default function History({ generations, onSelect, onClear }: HistoryProps) {
  if (generations.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2 opacity-40">{"\u{1F3B6}"}</div>
        <p className="text-sm text-purple-300/40">
          Your generated prompts will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-purple-200/80">
          Recent Generations ({generations.length})
        </h3>
        <button
          onClick={onClear}
          className="text-[10px] text-purple-400/50 hover:text-red-300 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
        {generations.map((gen) => (
          <button
            key={gen.id}
            onClick={() => onSelect(gen)}
            className="w-full text-left p-3 bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/20 rounded-xl transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-purple-200 truncate">
                  {gen.originalPrompt}
                </p>
                <p className="text-[11px] text-purple-300/50 mt-1 line-clamp-2">
                  {gen.enhancedPrompt}
                </p>
              </div>
              <span className="text-[9px] text-purple-400/40 whitespace-nowrap mt-0.5">
                {new Date(gen.metadata.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex gap-1 mt-2">
              <span className="px-1.5 py-0.5 text-[9px] bg-purple-500/10 rounded text-purple-300/60">
                {gen.metadata.bpm} BPM
              </span>
              <span className="px-1.5 py-0.5 text-[9px] bg-indigo-500/10 rounded text-indigo-300/60">
                {gen.metadata.duration}s
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
