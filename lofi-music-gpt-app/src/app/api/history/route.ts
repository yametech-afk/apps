import { NextResponse } from "next/server";

// In-memory store for demo purposes
// In production, use a database like Supabase, SQLite, or Postgres
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

// Note: This is ephemeral — resets on server restart.
// For persistence, integrate with a database.
const generations: Generation[] = [];

export async function GET() {
  return NextResponse.json({
    generations: generations.slice(-20).reverse(), // Last 20, newest first
    total: generations.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const generation: Generation = {
      id: body.id || crypto.randomUUID(),
      originalPrompt: body.originalPrompt,
      enhancedPrompt: body.enhancedPrompt,
      trackUrl: body.trackUrl || null,
      status: body.status || "prompt_ready",
      metadata: body.metadata || {
        bpm: "70-85",
        duration: "120",
        model: "gpt-4o-mini",
        timestamp: new Date().toISOString(),
      },
    };

    generations.push(generation);

    return NextResponse.json({ success: true, generation });
  } catch {
    return NextResponse.json(
      { error: "Failed to save generation." },
      { status: 500 }
    );
  }
}
