# Lo-Fi Music Generator - Agent Instructions

## Project Overview

This is a Next.js 15 (App Router) application that uses OpenAI GPT-4o-mini to generate optimized lo-fi music prompts. Users select a mood and/or describe their vibe, and the AI produces detailed prompts ready for Suno, Udio, Mubert, or other AI music generators.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **AI**: OpenAI SDK (`openai` package)
- **Package Manager**: npm
- **Node Version**: 18+

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/route.ts    # POST - GPT prompt enhancement
│   │   └── history/route.ts     # GET/POST - generation history
│   ├── globals.css              # Tailwind + custom animations
│   ├── layout.tsx               # Root layout, metadata
│   └── page.tsx                 # Main client page (state management)
├── components/
│   ├── History.tsx              # Past generations sidebar
│   ├── MoodSelector.tsx         # 10-mood grid selector
│   ├── MusicPlayer.tsx          # Result display + copy/regenerate
│   ├── PromptInput.tsx          # Form with textarea + advanced options
│   └── VisualizerBars.tsx       # Animated audio visualization
└── types/
    └── index.ts                 # Shared TypeScript interfaces
```

## Coding Conventions

- All components use `"use client"` directive (client-side interactivity)
- API routes use Next.js Route Handlers (app/api/*)
- TypeScript strict mode — no `any` types
- Tailwind for all styling — no CSS modules
- Use `@/` path alias for imports from `src/`
- Prefer `const` arrow functions for component definitions in non-page files
- Pages use `export default function` syntax

## Key Patterns

### API Routes
- Always validate request body
- Return proper HTTP status codes (400, 500, etc.)
- Catch OpenAI-specific errors with `instanceof OpenAI.APIError`
- Use `crypto.randomUUID()` for IDs

### Components
- Props interfaces defined above the component
- Use Tailwind classes with opacity modifiers (e.g., `text-purple-300/60`)
- Animations use CSS keyframes in globals.css
- Toast notifications via state in page.tsx

### State Management
- All app state lives in `page.tsx` (lifted state)
- No external state library needed at this scale
- History stored in React state (in-memory)

## Environment Variables

- `OPENAI_API_KEY` (required) — OpenAI API key
- `MUSIC_API_KEY` (optional) — For future music API integration
- `MUSIC_API_URL` (optional) — Music API endpoint

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

## Design System

- **Colors**: Purple/indigo palette on dark background (#0a0a0f)
- **Borders**: `border-white/10` or `border-purple-500/20`
- **Backgrounds**: `bg-white/5` with `backdrop-blur-sm`
- **Rounded**: `rounded-xl` or `rounded-2xl`
- **Shadows**: `shadow-lg shadow-purple-500/20`
- **Text**: Purple gradient headers, muted body text

## When Adding Features

1. Define types in `src/types/index.ts`
2. Create component in `src/components/`
3. Add API route in `src/app/api/` if backend needed
4. Wire into `page.tsx` state
5. Run `npm run build` to verify no errors
