# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Infigenie OS is a React-based AI Operating System built with Vite and TypeScript. It provides two modes: **AIOS** (Personal OS) and **BIOS** (Business OS), each with specialized modules for productivity, content creation, and business intelligence powered by Google's Gemini API.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Set `GEMINI_API_KEY` in `.env.local` before running the app. The key is accessed via `process.env.API_KEY` in the Gemini service (vite.config.ts:14).

## Architecture

### Two-Mode System

The app operates in two distinct modes controlled by `OSMode` enum (types.ts:2-5):
- **AIOS (Personal OS)**: LifeOS, MemoryOS, FinanceOS, HealthOS, LearnOS, MediaOS, WorkflowOS, GIOS
- **BIOS (Business OS)**: Brand Intel, Competitor Intel, Creator Studio, CIOS, DIOS, EIOS

Mode switching happens via `toggleMode()` in App.tsx:81-85 and affects both the sidebar navigation and available views.

### View System

Views are managed through the `View` enum (types.ts:7-25) and rendered in `App.tsx:renderContent()`. The current view state is stored in `App.tsx:23` and navigation is triggered through the Sidebar component.

### Gemini Service Architecture (services/geminiService.ts)

All AI functionality is centralized in the Gemini service layer:

- **Client Management**: `getClient()` (line 6) creates GoogleGenAI instances with API key from environment
- **Model Selection Strategy**:
  - `gemini-2.5-flash-lite`: Fast responses (daily briefs, subtasks, summaries)
  - `gemini-2.5-flash`: Standard tasks (search, analysis, content generation)
  - `gemini-3-pro-preview`: Advanced features (competitor analysis with thinking, chat, image analysis)
  - `gemini-2.5-flash-preview-tts`: Text-to-speech
  - `gemini-3-pro-image-preview`: Image generation
  - `veo-3.1-fast-generate-preview`: Video generation

- **Key Features**:
  - **Grounding**: Web search (`googleSearch` tool) and Maps (`googleMaps` tool) integration for Copilot
  - **Thinking Mode**: Available for Gemini 3 Pro (competitor analysis uses 2048 budget, chat uses 32768 max)
  - **Multimodal**: Audio transcription, image analysis, video analysis (requires File API upload)
  - **Structured Output**: Most generation functions use `responseMimeType: "application/json"` for type-safe parsing

### Component Structure

- **App.tsx**: Root component managing mode, view state, API key gate, command palette, and dashboard rendering
- **Sidebar.tsx**: Navigation component that adapts based on current OSMode
- **Copilot.tsx**: Global AI chat assistant with web/maps grounding, deep thinking toggle, and LiveSession integration
- **BIOS.tsx**: Dual-purpose component handling both Brand Intel and Competitor Intel tabs (controlled via `activeTab` prop)
- **LifeOS.tsx** and other OS modules: Self-contained feature components with local state and Gemini service integration

### API Key Handling

The app checks for API keys via `window.aistudio` (App.tsx:40-56) for AI Studio deployment, with a fallback to `true` for local development. When no key is detected, a gate screen prompts the user to connect their API key.

### Type System

Core types are defined in `types.ts`:
- Domain models: Task, Note, Transaction, HealthMetric, Course, MediaItem, Workflow, SocialPost, etc.
- Each includes comprehensive fields for UI state and AI integration
- ChatMessage includes `groundingMetadata` for web/maps sources

## Common Patterns

### Adding AI-Powered Features

1. Define the function in `services/geminiService.ts`
2. Select appropriate model based on speed/capability needs
3. Use `responseMimeType: "application/json"` for structured data
4. Add error handling with fallback responses
5. Import and call from component with loading states

### Creating New Views

1. Add View enum value in `types.ts`
2. Create component in `components/` directory
3. Import in `App.tsx` and add to `renderContent()` switch statement
4. Add navigation item in `Sidebar.tsx` under appropriate mode (AIOS/BIOS)

### Gemini API Patterns

- Always check if client exists before API calls (`if (!client) return fallback`)
- Use try/catch with console.error for all API calls
- Parse JSON responses with fallback to empty arrays/objects
- For grounding, extract from `response.candidates[0].groundingMetadata.groundingChunks`
- Maps grounding uses `c.maps` (not `c.map`)

## Important Implementation Details

- Command Palette: Global keyboard shortcut (Cmd/Ctrl+K) handled in App.tsx:71-79
- Daily Brief: Generated from mock task data in App.tsx:87-96
- Video Generation: Long-running operation requiring polling (geminiService.ts:630-634)
- Image Generation: Returns base64 data URL from inlineData part
- Thinking Config: Only available on Gemini 3 Pro models with budget limits
