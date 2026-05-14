"use client";

interface VisualizerBarsProps {
  isActive: boolean;
}

export default function VisualizerBars({ isActive }: VisualizerBarsProps) {
  return (
    <div className="flex items-end justify-center gap-[3px] h-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-t from-purple-500 to-indigo-400 animate-pulse"
              : "bg-purple-500/20"
          }`}
          style={{
            height: isActive
              ? `${Math.random() * 60 + 20}%`
              : "15%",
            animationDelay: `${i * 0.1}s`,
            animationDuration: isActive ? `${0.5 + Math.random() * 0.5}s` : "0s",
          }}
        />
      ))}
    </div>
  );
}
