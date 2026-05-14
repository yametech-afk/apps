export interface Generation {
  id: string;
  originalPrompt: string;
  enhancedPrompt: string;
  trackUrl: string | null;
  status: string;
  metadata: {
    bpm: string;
    duration: string;
    model: string;
    timestamp: string;
  };
}

export interface GenerateResponse {
  id: string;
  originalPrompt: string;
  enhancedPrompt: string;
  trackUrl: string | null;
  status: string;
  metadata: {
    bpm: string;
    duration: string;
    model: string;
    timestamp: string;
  };
  error?: string;
}

export type Mood =
  | "study"
  | "sleep"
  | "focus"
  | "rainy"
  | "cafe"
  | "sunset"
  | "night"
  | "melancholy"
  | "cozy"
  | "dreamy";

export interface MoodOption {
  value: Mood;
  label: string;
  emoji: string;
  description: string;
}
