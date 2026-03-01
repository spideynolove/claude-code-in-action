# Multi-Framework Support Design

## Overview

Extend UIGen to support multiple frontend frameworks (React, Vue, Svelte, Angular, Vanilla JS, Custom) instead of React-only.

## Requirements

| Requirement | Details |
|-------------|---------|
| Frameworks | React, Vue, Svelte, Angular, Vanilla JS, Custom |
| Selection | Dropdown UI selector |
| Custom Mode | Advanced: Babel presets, CDN URLs, HTML template |

## Architecture

```
FrameworkSelector (UI)
        ↓
FrameworkTransformerFactory
        ↓
FrameworkTransformer (interface)
        ↓
├── ReactTransformer
├── VueTransformer
├── SvelteTransformer
├── AngularTransformer
├── VanillaTransformer
└── CustomTransformer
```

## FrameworkTransformer Interface

```typescript
interface FrameworkTransformer {
  readonly id: string
  readonly name: string
  readonly fileExtensions: string[]

  transform(code: string, filename: string): TransformResult
  getImportMap(files: Map<string, string>): ImportMapResult
  getEntryPoints(): string[]
  generatePreviewHTML(entryPoint, importMap, styles, errors): string
}
```

## Data Flow

1. User selects framework from dropdown
2. Factory creates appropriate transformer
3. Transformer stored in FileSystemContext
4. AI generates code for selected framework
5. Transformer compiles and generates preview

## New Files

| File | Purpose |
|------|---------|
| `src/lib/transformers/framework-transformer.ts` | Interface + types |
| `src/lib/transformers/factory.ts` | Factory pattern |
| `src/lib/transformers/react-transformer.ts` | React implementation |
| `src/lib/transformers/vue-transformer.ts` | Vue implementation |
| `src/lib/transformers/svelte-transformer.ts` | Svelte implementation |
| `src/lib/transformers/angular-transformer.ts` | Angular implementation |
| `src/lib/transformers/vanilla-transformer.ts` | Vanilla JS implementation |
| `src/lib/transformers/custom-transformer.ts` | Custom mode implementation |
| `src/components/FrameworkSelector.tsx` | UI dropdown |

## Modified Files

| File | Changes |
|------|---------|
| `src/lib/transform/jsx-transformer.ts` | Migrate to react-transformer.ts |
| `src/components/preview/PreviewFrame.tsx` | Use factory.getTransformer() |
| `src/lib/contexts/file-system-context.tsx` | Add framework state |
| `src/lib/prompts/generation.tsx` | Framework-aware prompts |

## Implementation Phases

**Phase 1: Foundation** - Interface, factory
**Phase 2: React Migration** - Extract existing code
**Phase 3: New Frameworks** - Vue, Svelte, Angular, Vanilla
**Phase 4: Custom Mode** - Advanced options
**Phase 5: UI Integration** - FrameworkSelector component
**Phase 6: Wiring** - PreviewFrame, prompts

## Framework-Specific Notes

| Framework | Entry Points | CDN | Transform |
|-----------|--------------|-----|-----------|
| React | App.jsx, App.tsx | esm.sh/react@19 | Babel react preset |
| Vue | App.vue | esm.sh/vue@3 | Vue compiler |
| Svelte | App.svelte | esm.sh/svelte@4 | Svelte compiler |
| Angular | app.component.ts | unpkg/angular | TSC + Angular |
| Vanilla | index.html, index.js | (none) | (none) |
| Custom | User defined | User defined | User defined |
