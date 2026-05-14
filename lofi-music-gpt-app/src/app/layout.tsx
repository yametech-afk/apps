import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lo-Fi Generator | AI-Powered Music Prompts",
  description:
    "Generate beautiful lo-fi music prompts using AI. Choose your mood, describe your vibe, and get optimized prompts for Suno, Udio, and other AI music generators.",
  keywords: ["lo-fi", "music", "AI", "generator", "prompts", "chillhop", "study beats"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-animated-gradient">
        {children}
      </body>
    </html>
  );
}
