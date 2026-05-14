"use client";

import { useState } from "react";
import { Mood } from "@/types";
import MoodSelector from "./MoodSelector";

interface PromptInputProps {
  onGenerate: (prompt: string, mood: Mood | null, bpm?: number, duration?: number) => void;
  isLoading: boolean;
}

export default function PromptInput({ onGenerate, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [bpm, setBpm] = useState<number | undefined>(undefined);
  const [duration, setDuration] = useState<number | undefined>(120);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !selectedMood) return;
    onGenerate(prompt.trim(), selectedMood, bpm, duration);
  };

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood === selectedMood ? null : mood);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Mood Selector */}
      <MoodSelector selectedMood={selectedMood} onSelect={handleMoodSelect} />

      {/* Text Input */}
      <div className="space-y-2">
        <label htmlFor="prompt" className="block text-sm font-medium text-purple-200/80">
          Describe your vibe
        </label>
        <div className="relative">
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="chill study beats with soft rain and vinyl crackle..."
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-purple-50 placeholder-purple-300/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 resize-none transition-all"
          />
          <div className="absolute bottom-2 right-2 text-xs text-purple-300/30">
            {prompt.length}/500
          </div>
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs text-purple-300/60 hover:text-purple-300 transition-colors flex items-center gap-1"
      >
        <svg
          className={`w-3 h-3 transition-transform ${showAdvanced ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Advanced options
      </button>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div>
            <label className="block text-xs font-medium text-purple-200/60 mb-1">
              BPM (60-120)
            </label>
            <input
              type="number"
              min={60}
              max={120}
              value={bpm || ""}
              onChange={(e) => setBpm(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="70-85"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-purple-50 placeholder-purple-300/30 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-purple-200/60 mb-1">
              Duration (seconds)
            </label>
            <input
              type="number"
              min={30}
              max={300}
              value={duration || ""}
              onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="120"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-purple-50 placeholder-purple-300/30 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        type="submit"
        disabled={isLoading || (!prompt.trim() && !selectedMood)}
        className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            Generate Lo-Fi
          </>
        )}
      </button>
    </form>
  );
}
