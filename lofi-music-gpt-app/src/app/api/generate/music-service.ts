/**
 * Music Generation Service
 *
 * Integrates with Mubert API for AI-generated lo-fi music.
 * Falls back to a demo mode when no API key is configured.
 *
 * To get a Mubert API key:
 * - Contact [email protected]
 * - API docs: https://mubert.com/api/docs
 * - Base URL: https://music-api.mubert.com/api/v3/public/
 *
 * Alternative APIs you can swap in:
 * - Suno (unofficial wrappers)
 * - Udio
 * - MusicAPI.ai
 * - Kie.ai
 */

export interface MusicGenerationResult {
  trackUrl: string | null;
  status: "generating" | "ready" | "failed" | "demo";
  duration: number;
  message?: string;
}

// Mubert API tags for lo-fi styles
const LOFI_TAGS: string[] = [
  "lofi",
  "chillhop",
  "ambient",
  "jazz",
  "piano",
  "mellow",
  "relaxing",
  "downtempo",
  "dreamy",
  "atmospheric",
];

/**
 * Extract relevant tags from the enhanced prompt for Mubert
 */
function extractTags(enhancedPrompt: string): string[] {
  const promptLower = enhancedPrompt.toLowerCase();
  const matchedTags: string[] = [];

  const tagKeywords: Record<string, string[]> = {
    lofi: ["lo-fi", "lofi", "lo fi"],
    chillhop: ["chillhop", "chill hop", "chill"],
    ambient: ["ambient", "atmospheric", "atmosphere"],
    jazz: ["jazz", "rhodes", "saxophone"],
    piano: ["piano", "keys", "keyboard"],
    rain: ["rain", "rainy", "rainfall"],
    vinyl: ["vinyl", "crackle", "tape"],
    drums: ["drums", "beats", "percussion", "boom bap"],
    bass: ["bass", "sub bass", "bassline"],
    guitar: ["guitar", "acoustic"],
    synth: ["synth", "synthesizer", "pad"],
    night: ["night", "midnight", "nocturnal"],
    cafe: ["cafe", "coffee", "coffeeshop"],
    study: ["study", "focus", "concentration"],
    sleep: ["sleep", "sleepy", "lullaby"],
    melancholy: ["melancholy", "sad", "bittersweet", "nostalgic"],
    dreamy: ["dreamy", "dream", "ethereal", "floating"],
    warm: ["warm", "cozy", "comfort"],
  };

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some((kw) => promptLower.includes(kw))) {
      matchedTags.push(tag);
    }
  }

  // Always include base lo-fi tags if none matched
  if (matchedTags.length === 0) {
    return LOFI_TAGS.slice(0, 5);
  }

  return matchedTags.slice(0, 8); // Mubert accepts up to ~8 tags
}

/**
 * Generate music via Mubert API
 *
 * Mubert API flow:
 * 1. POST to /public/track/generate with tags and duration
 * 2. Receive a task ID
 * 3. Poll /public/track/status until ready
 * 4. Get the download URL
 */
async function generateWithMubert(
  enhancedPrompt: string,
  duration: number
): Promise<MusicGenerationResult> {
  const apiKey = process.env.MUSIC_API_KEY;
  const baseUrl =
    process.env.MUSIC_API_URL || "https://music-api.mubert.com/api/v3/public";

  if (!apiKey) {
    return {
      trackUrl: null,
      status: "demo",
      duration,
      message: "No MUSIC_API_KEY configured. Using demo mode.",
    };
  }

  try {
    const tags = extractTags(enhancedPrompt);

    // Step 1: Request track generation
    const generateResponse = await fetch(`${baseUrl}/track/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "TrackGenerate",
        params: {
          pat: apiKey,
          duration: Math.min(duration, 180), // Mubert max ~180s on free
          tags: tags,
          mode: "track", // "track" for full generation
          mapikey: apiKey,
        },
      }),
    });

    if (!generateResponse.ok) {
      throw new Error(`Mubert API error: ${generateResponse.status}`);
    }

    const generateData = await generateResponse.json();

    // Check if we got a direct URL (some Mubert responses are immediate)
    if (generateData?.data?.tasks?.[0]?.download_link) {
      return {
        trackUrl: generateData.data.tasks[0].download_link,
        status: "ready",
        duration,
      };
    }

    // Step 2: If we got a task ID, poll for completion
    const taskId = generateData?.data?.tasks?.[0]?.task_id;

    if (!taskId) {
      // If response includes a stream URL directly
      if (generateData?.data?.stream_url) {
        return {
          trackUrl: generateData.data.stream_url,
          status: "ready",
          duration,
        };
      }
      throw new Error("No task ID or stream URL returned from Mubert");
    }

    // Poll for track status (up to 30 seconds)
    for (let attempt = 0; attempt < 15; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const statusResponse = await fetch(`${baseUrl}/track/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "TrackStatus",
          params: {
            pat: apiKey,
            task_id: taskId,
          },
        }),
      });

      if (!statusResponse.ok) continue;

      const statusData = await statusResponse.json();
      const task = statusData?.data?.tasks?.[0];

      if (task?.download_link) {
        return {
          trackUrl: task.download_link,
          status: "ready",
          duration,
        };
      }

      if (task?.error) {
        throw new Error(`Mubert generation failed: ${task.error}`);
      }
    }

    // Timeout - return generating status
    return {
      trackUrl: null,
      status: "generating",
      duration,
      message:
        "Track is still generating. Check back in a moment.",
    };
  } catch (error) {
    console.error("Mubert API error:", error);
    return {
      trackUrl: null,
      status: "failed",
      duration,
      message:
        error instanceof Error
          ? error.message
          : "Music generation failed. Try again.",
    };
  }
}

/**
 * Demo mode: provides sample lo-fi tracks from free sources
 * These are royalty-free lo-fi samples for demonstration purposes
 */
function getDemoTrack(enhancedPrompt: string, duration: number): MusicGenerationResult {
  // In demo mode, we don't have actual generated music
  // The app will show the enhanced prompt for the user to paste into Suno/Udio
  return {
    trackUrl: null,
    status: "demo",
    duration,
    message:
      "Demo mode: Copy the enhanced prompt above and paste it into Suno.com, Udio.com, or Mubert.com to generate your track. Set MUSIC_API_KEY in .env.local for direct generation.",
  };
}

/**
 * Main entry point: generate music from an enhanced prompt
 */
export async function generateMusic(
  enhancedPrompt: string,
  duration: number = 120
): Promise<MusicGenerationResult> {
  // Try Mubert if API key is configured
  if (process.env.MUSIC_API_KEY) {
    return generateWithMubert(enhancedPrompt, duration);
  }

  // Fallback to demo mode
  return getDemoTrack(enhancedPrompt, duration);
}
