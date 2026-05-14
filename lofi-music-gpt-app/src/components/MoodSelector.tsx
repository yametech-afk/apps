"use client";

import { MoodOption, Mood } from "@/types";

const MOODS: MoodOption[] = [
  { value: "study", label: "Study", emoji: "\u{1F4DA}", description: "Focus-friendly beats" },
  { value: "sleep", label: "Sleep", emoji: "\u{1F31C}", description: "Drift off gently" },
  { value: "focus", label: "Focus", emoji: "\u{1F3AF}", description: "Deep concentration" },
  { value: "rainy", label: "Rainy", emoji: "\u{1F327}\u{FE0F}", description: "Rainy day vibes" },
  { value: "cafe", label: "Cafe", emoji: "\u{2615}", description: "Coffee shop ambience" },
  { value: "sunset", label: "Sunset", emoji: "\u{1F305}", description: "Golden hour warmth" },
  { value: "night", label: "Night", emoji: "\u{1F303}", description: "Late night sessions" },
  { value: "melancholy", label: "Melancholy", emoji: "\u{1F3B5}", description: "Bittersweet feelings" },
  { value: "cozy", label: "Cozy", emoji: "\u{1F56F}\u{FE0F}", description: "Warm and comforting" },
  { value: "dreamy", label: "Dreamy", emoji: "\u{2601}\u{FE0F}", description: "Float away" },
];

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelect: (mood: Mood) => void;
}

export default function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-purple-200/80">
        Choose a mood
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onSelect(mood.value)}
            className={`group relative flex flex-col items-center p-3 rounded-xl border transition-all duration-200 ${
              selectedMood === mood.value
                ? "border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/10"
                : "border-white/10 bg-white/5 hover:border-purple-400/50 hover:bg-purple-500/10"
            }`}
          >
            <span className="text-2xl mb-1">{mood.emoji}</span>
            <span className="text-xs font-medium text-purple-100">{mood.label}</span>
            {/* Tooltip */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] bg-gray-900 text-purple-200 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {mood.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
