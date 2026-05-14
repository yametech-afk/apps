"use client";

import { useState, useCallback } from "react";
import PromptInput from "@/components/PromptInput";
import MusicPlayer from "@/components/MusicPlayer";
import History from "@/components/History";
import VisualizerBars from "@/components/VisualizerBars";
import { Generation, Mood } from "@/types";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState<Generation | null>(null);
  const [history, setHistory] = useState<Generation[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<{ prompt: string; mood: Mood | null; bpm?: number; duration?: number } | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = useCallback(async (prompt: string, mood: Mood | null, bpm?: number, duration?: number) => {
    setIsLoading(true);
    setLastPrompt({ prompt, mood, bpm, duration });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt || undefined,
          mood: mood || undefined,
          bpm,
          duration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || "Generation failed");
        return;
      }

      const generation: Generation = {
        id: data.id,
        originalPrompt: prompt || mood || "custom",
        enhancedPrompt: data.enhancedPrompt,
        trackUrl: data.trackUrl,
        status: data.status,
        metadata: data.metadata,
      };

      setCurrentGeneration(generation);
      setHistory((prev) => [generation, ...prev].slice(0, 20));
      showToast("Prompt generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      showToast("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      showToast("Prompt copied to clipboard!");
    } catch {
      // Fallback for browsers that don't support clipboard API
      showToast("Could not copy — select and copy manually.");
    }
  };

  const handleRegenerate = () => {
    if (lastPrompt) {
      handleGenerate(lastPrompt.prompt, lastPrompt.mood, lastPrompt.bpm, lastPrompt.duration);
    }
  };

  const handleSelectFromHistory = (generation: Generation) => {
    setCurrentGeneration(generation);
  };

  const handleClearHistory = () => {
    setHistory([]);
    showToast("History cleared.");
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-800/3 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <VisualizerBars isActive={isLoading} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent mb-3">
            Lo-Fi Generator
          </h1>
          <p className="text-purple-300/60 text-sm sm:text-base max-w-md mx-auto">
            AI-powered prompts for lo-fi music generation. Choose your mood, describe your vibe, and create.
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Input + Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt Input Card */}
            <section className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl backdrop-blur-sm glow-purple">
              <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
            </section>

            {/* Music Player / Result */}
            {(currentGeneration || isLoading) && (
              <section>
                {isLoading ? (
                  <div className="p-8 bg-white/[0.02] border border-purple-500/20 rounded-2xl text-center space-y-4">
                    <div className="flex justify-center">
                      <VisualizerBars isActive={true} />
                    </div>
                    <p className="text-sm text-purple-300/60 animate-pulse">
                      Crafting your lo-fi prompt...
                    </p>
                  </div>
                ) : (
                  <MusicPlayer
                    generation={currentGeneration}
                    onCopyPrompt={handleCopyPrompt}
                    onRegenerate={handleRegenerate}
                  />
                )}
              </section>
            )}
          </div>

          {/* Right Column: History */}
          <aside className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl backdrop-blur-sm h-fit">
            <History
              generations={history}
              onSelect={handleSelectFromHistory}
              onClear={handleClearHistory}
            />
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-[11px] text-purple-400/30">
            Powered by OpenAI GPT-4o-mini | Use generated prompts with Suno, Udio, or Mubert
          </p>
        </footer>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="px-4 py-2 bg-purple-900/90 border border-purple-500/30 rounded-lg shadow-lg backdrop-blur-sm">
            <p className="text-sm text-purple-100">{toast}</p>
          </div>
        </div>
      )}
    </main>
  );
}
