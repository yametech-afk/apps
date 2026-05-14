import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { generateMusic } from "./music-service";

const SYSTEM_PROMPT = `You are a professional lo-fi music producer and prompt engineer. Your job is to take a user's simple mood or description and transform it into a highly detailed, creative prompt optimized for AI music generators like Suno or Udio.

Your output should include:
- Genre specification (lo-fi hip hop, chillhop, lo-fi jazz, ambient lo-fi, etc.)
- Mood and atmosphere details
- Specific instruments (Rhodes piano, vinyl crackle, mellow drums, soft bass, etc.)
- Tempo/BPM suggestion (typically 60-90 BPM for lo-fi)
- Production style notes (tape saturation, reverb, sidechain compression, etc.)
- Structure hints (intro, verse, chorus if applicable)
- Any environmental sounds (rain, cafe ambience, birds, etc.)

Keep the prompt concise but rich — ideally 2-4 sentences that paint a vivid sonic picture. Do NOT include any explanation or metadata — just output the refined music prompt.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, mood, bpm, duration } = body;

    if (!prompt && !mood) {
      return NextResponse.json(
        { error: "Please provide a prompt or mood description." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please set OPENAI_API_KEY in your .env.local file." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    // Build user message with optional parameters
    let userMessage = `Create a lo-fi music prompt for: "${prompt || mood}"`;
    if (bpm) userMessage += ` | Target BPM: ${bpm}`;
    if (duration) userMessage += ` | Duration: ${duration} seconds`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const enhancedPrompt = completion.choices[0]?.message?.content?.trim();

    if (!enhancedPrompt) {
      return NextResponse.json(
        { error: "Failed to generate enhanced prompt." },
        { status: 500 }
      );
    }

    // Generate music via Mubert API (or demo mode if no key)
    const trackId = crypto.randomUUID();
    const musicResult = await generateMusic(
      enhancedPrompt,
      duration || 120
    );

    return NextResponse.json({
      id: trackId,
      originalPrompt: prompt || mood,
      enhancedPrompt,
      trackUrl: musicResult.trackUrl,
      status: musicResult.status === "ready" ? "track_ready" : "prompt_ready",
      musicStatus: musicResult.status,
      musicMessage: musicResult.message || null,
      metadata: {
        bpm: bpm || "70-85",
        duration: duration || "120",
        model: "gpt-4o-mini",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("Generation error:", error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred during generation." },
      { status: 500 }
    );
  }
}
