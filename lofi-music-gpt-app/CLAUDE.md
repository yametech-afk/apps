# CLAUDE.md - Lo-Fi Music Generator

## Quick Context

Next.js 15 app (TypeScript + Tailwind) that generates lo-fi music prompts via OpenAI GPT-4o-mini. User picks mood → GPT enhances → user copies prompt to Suno/Udio/Mubert.

## Build & Run

```bash
cd lofi-music-gpt-app
npm install
npm run dev      # Dev server at localhost:3000
npm run build    # Verify compilation
npm run lint     # Check linting
```

## Key Files

- `src/app/page.tsx` — Main page, all client state lives here
- `src/app/api/generate/route.ts` — OpenAI GPT integration endpoint
- `src/app/api/history/route.ts` — In-memory generation history
- `src/types/index.ts` — All TypeScript types
- `src/components/` — UI components (all "use client")

## Style Rules

- Dark theme only (bg #0a0a0f, purple/indigo accents)
- Tailwind only, no CSS modules
- Use opacity modifiers: `text-purple-300/60`, `bg-white/5`
- Rounded corners: `rounded-xl` or `rounded-2xl`
- Glass effect: `bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm`

## Code Rules

- TypeScript strict, no `any`
- Path alias: `@/` maps to `src/`
- API routes: validate input, handle OpenAI errors specifically
- Components: props interface above component, "use client" directive
- State: all in page.tsx, no external state library

## Environment

Required: `OPENAI_API_KEY` in `.env.local`
