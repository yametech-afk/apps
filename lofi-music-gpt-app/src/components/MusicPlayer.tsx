"use client";

import { Generation } from "@/types";

interface MusicPlayerProps {
  generation: Generation | null;
  onCopyPrompt: (prompt: string) => void;
  onRegenerate: () => void;
}

export default function MusicPlayer({ generation, onCopyPrompt, onRegenerate }: MusicPlayerProps) {
  if (!generation) return null;

  return (
    <div className="space-y-4 p-5 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/20 rounded-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-purple-200 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Generated Prompt
        </h3>
        <span className="text-[10px] text-purple-400/60 font-mono">
          {new Date(generation.metadata.timestamp).toLocaleTimeString()}
        </span>
      </div>

      {/* Enhanced Prompt Display */}
      <div className="p-4 bg-black/30 rounded-xl border border-white/5">
        <p className="text-sm text-purple-100 leading-relaxed italic">
          &ldquo;{generation.enhancedPrompt}&rdquo;
        </p>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 text-[10px] font-mono bg-purple-500/10 border border-purple-500/20 rounded-md text-purple-300">
          BPM: {generation.metadata.bpm}
        </span>
        <span className="px-2 py-1 text-[10px] font-mono bg-indigo-500/10 border border-indigo-500/20 rounded-md text-indigo-300">
          Duration: {generation.metadata.duration}s
        </span>
        <span className="px-2 py-1 text-[10px] font-mono bg-green-500/10 border border-green-500/20 rounded-md text-green-300">
          Model: {generation.metadata.model}
        </span>
      </div>

      {/* Audio Player Placeholder */}
      {generation.trackUrl ? (
        <div className="space-y-2">
          <audio controls className="w-full" src={generation.trackUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : (
        <div className="p-4 bg-white/5 border border-dashed border-purple-400/30 rounded-xl text-center">
          <p className="text-xs text-purple-300/60 mb-2">
            Copy the enhanced prompt and paste it into your preferred music generator:
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-[10px]">
            <a href="https://suno.com" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-purple-500/20 rounded-md text-purple-200 hover:bg-purple-500/30 transition-colors">
              Suno.com
            </a>
            <a href="https://udio.com" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-purple-500/20 rounded-md text-purple-200 hover:bg-purple-500/30 transition-colors">
              Udio.com
            </a>
            <a href="https://mubert.com" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-purple-500/20 rounded-md text-purple-200 hover:bg-purple-500/30 transition-colors">
              Mubert.com
            </a>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onCopyPrompt(generation.enhancedPrompt)}
          className="flex-1 py-2 px-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-sm text-purple-200 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Prompt
        </button>
        <button
          onClick={onRegenerate}
          className="flex-1 py-2 px-4 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg text-sm text-indigo-200 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Regenerate
        </button>
      </div>
    </div>
  );
}
