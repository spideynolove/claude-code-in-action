# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Initial setup: install deps, generate Prisma client, run migrations
npm run setup

# Development (requires node-compat.cjs for bcrypt)
npm run dev

# Run tests
npm test

# Lint
npm run lint

# Build
npm run build

# Reset database
npm run db:reset
```

## Architecture

### Virtual File System
The app uses a `VirtualFileSystem` class (`src/lib/file-system.ts`) - no files are written to disk. All file operations (create, update, delete, rename) happen in memory. The file system serializes to JSON for persistence in the database.

### Multi-Framework Support
The app generates code for multiple frameworks via a transformer pattern:
- `src/lib/transformers/framework-transformer.ts` - base interface
- `src/lib/transformers/factory.ts` - transformer factory
- Individual transformers: react, vue, svelte, angular, vanilla, custom

Each transformer:
- Converts framework code to browser-executable JavaScript
- Generates import maps for dependencies
- Produces preview HTML with proper entry points

### AI Chat Flow
1. User sends message via `ChatProvider` (`src/lib/contexts/chat-context.tsx`)
2. Request goes to `/api/chat/route.ts`
3. System prompt is injected based on selected framework (`src/lib/prompts/generation.tsx`)
4. AI uses tools (`str_replace_editor`, `file_manager`) to manipulate virtual files
5. Tool results are streamed back and applied to the virtual file system

### Context Providers
- `FileSystemProvider` - manages virtual file system and framework selection
- `ChatProvider` - wraps Vercel AI SDK's `useChat`, handles tool calls

### Framework Selection
Framework is stored in `FileSystemProvider` and passed to:
- API route for system prompt generation
- Preview frame for code transformation
- Affects file extensions and code patterns

### Tech Stack
- Next.js 15 App Router + React 19 + TypeScript
- Tailwind CSS v4 (PostCSS-based)
- Prisma with SQLite
- Anthropic Claude AI via Vercel AI SDK
- Shadcn/ui components (Radix UI primitives)
- Monaco Editor for code editing
