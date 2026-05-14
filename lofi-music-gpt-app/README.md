# Lo-Fi Generator - AI-Powered Music Prompts

A beautiful Next.js application that uses OpenAI's GPT-4o-mini to generate optimized lo-fi music prompts. Choose your mood, describe your vibe, and get AI-crafted prompts ready for Suno, Udio, Mubert, or any AI music generator.

## Features

- **Mood Selector** - 10 curated moods (Study, Sleep, Focus, Rainy, Cafe, Sunset, Night, Melancholy, Cozy, Dreamy)
- **AI Prompt Enhancement** - GPT-4o-mini transforms simple descriptions into rich, detailed music prompts
- **Advanced Controls** - Customize BPM (60-120) and duration (30-300s)
- **One-Click Copy** - Copy enhanced prompts directly to your clipboard
- **Generation History** - Browse and reuse past generations
- **Lo-Fi Aesthetic** - Beautiful purple/indigo UI with animated gradients and visualizer bars
- **Responsive Design** - Works great on mobile and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | OpenAI GPT-4o-mini |
| Deployment | Vercel-ready |

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd lofi-music-gpt-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `MUSIC_API_KEY` | No | Optional music generation API key |
| `MUSIC_API_URL` | No | Optional music generation API endpoint |

## How It Works

1. **User Input** - Select a mood and/or type a description (e.g., "chill study beats with rain")
2. **GPT Enhancement** - The app sends your input to GPT-4o-mini with a specialized system prompt
3. **Rich Prompt Output** - GPT returns a detailed prompt with genre, instruments, tempo, production style, and atmosphere
4. **Use Anywhere** - Copy the prompt and paste into Suno, Udio, Mubert, or any AI music generator

## Project Structure

```
lofi-music-gpt-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/route.ts    # GPT prompt enhancement endpoint
│   │   │   └── history/route.ts     # Generation history endpoint
│   │   ├── globals.css              # Custom styles & animations
│   │   ├── layout.tsx               # Root layout with metadata
│   │   └── page.tsx                 # Main app page
│   ├── components/
│   │   ├── History.tsx              # Past generations list
│   │   ├── MoodSelector.tsx         # Mood grid selector
│   │   ├── MusicPlayer.tsx          # Result display & actions
│   │   ├── PromptInput.tsx          # Input form with options
│   │   └── VisualizerBars.tsx       # Animated audio bars
│   └── types/
│       └── index.ts                 # TypeScript type definitions
├── .env.example                     # Environment template
├── package.json
└── README.md
```

## API Endpoints

### POST `/api/generate`

Generate an enhanced lo-fi music prompt.

**Request Body:**
```json
{
  "prompt": "chill study beats with rain",
  "mood": "study",
  "bpm": 75,
  "duration": 120
}
```

**Response:**
```json
{
  "id": "uuid",
  "originalPrompt": "chill study beats with rain",
  "enhancedPrompt": "Lo-fi hip hop with warm Rhodes piano chords...",
  "trackUrl": null,
  "status": "prompt_ready",
  "metadata": {
    "bpm": "75",
    "duration": "120",
    "model": "gpt-4o-mini",
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
}
```

### GET `/api/history`

Retrieve recent generations (last 20).

### POST `/api/history`

Save a generation to history.

## Extending the App

### Adding a Music Generation API

To integrate with Suno, Udio, or another music API, update the `/api/generate` route:

```typescript
// In src/app/api/generate/route.ts
import { callMusicAPI } from "@/services/musicService";

// After getting enhancedPrompt from GPT:
const musicResult = await callMusicAPI(enhancedPrompt);
// Set trackUrl in the response
```

### Adding a Database

Replace the in-memory history store with Supabase, SQLite, or any database:

```typescript
// In src/app/api/history/route.ts
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabase
    .from("generations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);
  return NextResponse.json({ generations: data });
}
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add `OPENAI_API_KEY` to environment variables
4. Deploy!

### Other Platforms

Works on any platform that supports Next.js: Netlify, Railway, Render, etc.

## Free Tier Considerations

- **OpenAI GPT-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens (very affordable)
- **Suno Free Plan**: ~10 songs/day
- **Vercel Free Tier**: 100GB bandwidth, serverless functions included

## License

MIT
