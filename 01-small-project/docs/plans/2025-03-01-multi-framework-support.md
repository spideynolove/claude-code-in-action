# Multi-Framework Support Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extend UIGen to support multiple frontend frameworks (React, Vue, Svelte, Angular, Vanilla JS, Custom) with a clean abstract transformer architecture.

**Architecture:** Abstract `FrameworkTransformer` interface with concrete implementations per framework. Factory pattern for transformer creation. Framework state stored in FileSystemContext.

**Tech Stack:** TypeScript, React, Next.js, Babel standalone, ESM.sh CDN

---

## Phase 1: Foundation

### Task 1: Create FrameworkTransformer Interface

**Files:**
- Create: `src/lib/transformers/framework-transformer.ts`

**Step 1: Write the interface and types**

```typescript
export interface TransformResult {
  code: string;
  error?: string;
  missingImports?: Set<string>;
  cssImports?: Set<string>;
}

export interface ImportMapResult {
  importMap: string;
  styles: string;
  errors: Array<{ path: string; error: string }>;
}

export interface FrameworkTransformer {
  readonly id: string;
  readonly name: string;
  readonly fileExtensions: string[];

  transform(code: string, filename: string, existingFiles: Set<string>): TransformResult;

  getImportMap(files: Map<string, string>): ImportMapResult;

  getEntryPoints(): string[];

  generatePreviewHTML(
    entryPoint: string,
    importMap: string,
    styles?: string,
    errors?: Array<{ path: string; error: string }>
  ): string;
}

export type FrameworkId = "react" | "vue" | "svelte" | "angular" | "vanilla" | "custom";
```

**Step 2: Commit**

```bash
git add src/lib/transformers/framework-transformer.ts
git commit -m "feat: add FrameworkTransformer interface"
```

---

### Task 2: Create Factory

**Files:**
- Create: `src/lib/transformers/factory.ts`

**Step 1: Write the factory class**

```typescript
import { FrameworkTransformer, FrameworkId } from "./framework-transformer";
import { ReactTransformer } from "./react-transformer";

class FrameworkTransformerFactory {
  private transformers = new Map<string, FrameworkTransformer>();

  constructor() {
    this.register(new ReactTransformer());
  }

  register(transformer: FrameworkTransformer): void {
    this.transformers.set(transformer.id, transformer);
  }

  create(id: FrameworkId | string): FrameworkTransformer {
    const transformer = this.transformers.get(id);
    if (!transformer) {
      throw new Error(`Unknown framework: ${id}`);
    }
    return transformer;
  }

  list(): FrameworkTransformer[] {
    return Array.from(this.transformers.values());
  }

  getIds(): FrameworkId[] {
    return Array.from(this.transformers.keys()) as FrameworkId[];
  }
}

export const factory = new FrameworkTransformerFactory();
```

**Step 2: Commit**

```bash
git add src/lib/transformers/factory.ts
git commit -m "feat: add FrameworkTransformerFactory"
```

---

## Phase 2: React Migration

### Task 3: Create ReactTransformer

**Files:**
- Create: `src/lib/transformers/react-transformer.ts`

**Step 1: Copy existing JSX transformer code into ReactTransformer class**

```typescript
import * as Babel from "@babel/standalone";
import {
  FrameworkTransformer,
  TransformResult,
  ImportMapResult,
} from "./framework-transformer";

function createPlaceholderModule(componentName: string): string {
  return `
import React from 'react';
const ${componentName} = function() {
  return React.createElement('div', {}, null);
}
export default ${componentName};
export { ${componentName} };
`;
}

function resolveRelativePath(fromDir: string, relativePath: string): string {
  const parts = fromDir.split("/").filter(Boolean);
  const relParts = relativePath.split("/");

  for (const part of relParts) {
    if (part === "..") {
      parts.pop();
    } else if (part !== ".") {
      parts.push(part);
    }
  }

  return "/" + parts.join("/");
}

export class ReactTransformer implements FrameworkTransformer {
  readonly id = "react";
  readonly name = "React";
  readonly fileExtensions = [".jsx", ".tsx", ".js", ".ts"];

  transform(code: string, filename: string, existingFiles: Set<string>): TransformResult {
    try {
      const isTypeScript = filename.endsWith(".ts") || filename.endsWith(".tsx");

      let processedCode = code;
      const importRegex = /import\s+(?:{[^}]+}|[^,\s]+)?\s*(?:,\s*{[^}]+})?\s+from\s+['"]([^'"]+)['"]/g;
      const imports = new Set<string>();
      const cssImports = new Set<string>();

      const cssImportRegex = /import\s+['"]([^'"]+\.css)['"]/g;
      let cssMatch;
      while ((cssMatch = cssImportRegex.exec(code)) !== null) {
        cssImports.add(cssMatch[1]);
      }

      processedCode = processedCode.replace(cssImportRegex, '');

      let match;
      while ((match = importRegex.exec(code)) !== null) {
        if (!match[1].endsWith('.css')) {
          imports.add(match[1]);
        }
      }

      const result = Babel.transform(processedCode, {
        filename,
        presets: [
          ["react", { runtime: "automatic" }],
          ...(isTypeScript ? ["typescript"] : []),
        ],
        plugins: [],
      });

      return {
        code: result.code || "",
        missingImports: imports,
        cssImports: cssImports,
      };
    } catch (error) {
      return {
        code: "",
        error: error instanceof Error ? error.message : "Unknown transform error",
      };
    }
  }

  getImportMap(files: Map<string, string>): ImportMapResult {
    const imports: Record<string, string> = {
      react: "https://esm.sh/react@19",
      "react-dom": "https://esm.sh/react-dom@19",
      "react-dom/client": "https://esm.sh/react-dom@19/client",
      "react/jsx-runtime": "https://esm.sh/react@19/jsx-runtime",
      "react/jsx-dev-runtime": "https://esm.sh/react@19/jsx-dev-runtime",
    };

    const transformedFiles = new Map<string, string>();
    const existingFiles = new Set(files.keys());
    const allImports = new Set<string>();
    const allCssImports = new Set<{ from: string; cssPath: string }>();
    let collectedStyles = "";
    const errors: Array<{ path: string; error: string }> = [];

    function createBlobURL(code: string, mimeType: string = "application/javascript"): string {
      const blob = new Blob([code], { type: mimeType });
      return URL.createObjectURL(blob);
    }

    for (const [path, content] of files) {
      if (path.endsWith(".js") || path.endsWith(".jsx") || path.endsWith(".ts") || path.endsWith(".tsx")) {
        const { code, error, missingImports, cssImports } = this.transform(content, path, existingFiles);

        if (error) {
          errors.push({ path, error });
          continue;
        }

        const blobUrl = createBlobURL(code);
        transformedFiles.set(path, blobUrl);

        if (missingImports) {
          missingImports.forEach((imp) => {
            const isPackage = !imp.startsWith(".") && !imp.startsWith("/") && !imp.startsWith("@/");

            if (isPackage) {
              imports[imp] = `https://esm.sh/${imp}`;
            } else {
              allImports.add(imp);
            }
          });
        }

        if (cssImports) {
          cssImports.forEach((cssImport) => {
            allCssImports.add({ from: path, cssPath: cssImport });
          });
        }

        imports[path] = blobUrl;

        if (path.startsWith("/")) {
          imports[path.substring(1)] = blobUrl;
          imports["@" + path] = blobUrl;
          imports["@/" + path.substring(1)] = blobUrl;
        }

        const pathWithoutExt = path.replace(/\.(jsx?|tsx?)$/, "");
        imports[pathWithoutExt] = blobUrl;

        if (path.startsWith("/")) {
          imports[pathWithoutExt.substring(1)] = blobUrl;
          imports["@" + pathWithoutExt] = blobUrl;
          imports["@/" + pathWithoutExt.substring(1)] = blobUrl;
        }
      } else if (path.endsWith(".css")) {
        collectedStyles += `/* ${path} */\n${content}\n\n`;
      }
    }

    for (const { from, cssPath } of allCssImports) {
      let resolvedPath = cssPath;

      if (cssPath.startsWith("@/")) {
        resolvedPath = cssPath.replace("@/", "/");
      } else if (cssPath.startsWith("./") || cssPath.startsWith("../")) {
        const fromDir = from.substring(0, from.lastIndexOf("/"));
        resolvedPath = resolveRelativePath(fromDir, cssPath);
      }

      if (!files.has(resolvedPath)) {
        collectedStyles += `/* ${cssPath} not found */\n`;
      }
    }

    for (const importPath of allImports) {
      if (imports[importPath] || importPath.startsWith("react")) {
        continue;
      }

      const isPackage = !importPath.startsWith(".") && !importPath.startsWith("/") && !importPath.startsWith("@/");

      if (isPackage) {
        imports[importPath] = `https://esm.sh/${importPath}`;
        continue;
      }

      let found = false;
      const variations = [
        importPath,
        importPath + ".jsx",
        importPath + ".tsx",
        importPath + ".js",
        importPath + ".ts",
        importPath.replace("@/", "/"),
        importPath.replace("@/", "/") + ".jsx",
        importPath.replace("@/", "/") + ".tsx",
      ];

      for (const variant of variations) {
        if (imports[variant] || files.has(variant)) {
          found = true;
          break;
        }
      }

      if (!found) {
        const match = importPath.match(/\/([^\/]+)$/);
        const componentName = match ? match[1] : importPath.replace(/[^a-zA-Z0-9]/g, "");

        const placeholderCode = createPlaceholderModule(componentName);
        const placeholderUrl = createBlobURL(placeholderCode);

        imports[importPath] = placeholderUrl;
        if (importPath.startsWith("@/")) {
          imports[importPath.replace("@/", "/")] = placeholderUrl;
          imports[importPath.replace("@/", "")] = placeholderUrl;
        }
      }
    }

    return {
      importMap: JSON.stringify({ imports }, null, 2),
      styles: collectedStyles,
      errors,
    };
  }

  getEntryPoints(): string[] {
    return ["/App.jsx", "/App.tsx", "/index.jsx", "/index.tsx"];
  }

  generatePreviewHTML(
    entryPoint: string,
    importMap: string,
    styles: string = "",
    errors: Array<{ path: string; error: string }> = []
  ): string {
    let entryPointUrl = entryPoint;
    try {
      const importMapObj = JSON.parse(importMap);
      if (importMapObj.imports && importMapObj.imports[entryPoint]) {
        entryPointUrl = importMapObj.imports[entryPoint];
      }
    } catch (e) {
      console.error("Failed to parse import map:", e);
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    #root { width: 100vw; height: 100vh; }
    .error-boundary { color: red; padding: 1rem; border: 2px solid red; margin: 1rem; border-radius: 4px; background: #fee; }
    .syntax-errors { background: #fef5f5; border: 2px solid #ff6b6b; border-radius: 12px; padding: 32px; margin: 24px; font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace; font-size: 14px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .syntax-errors h3 { color: #dc2626; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
    .syntax-errors .error-item { margin: 16px 0; padding: 16px; background: #fff; border-radius: 8px; border-left: 4px solid #ff6b6b; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
    .syntax-errors .error-path { font-weight: 600; color: #991b1b; font-size: 15px; margin-bottom: 8px; }
    .syntax-errors .error-message { color: #7c2d12; margin-top: 8px; white-space: pre-wrap; line-height: 1.5; font-size: 13px; }
    .syntax-errors .error-location { display: inline-block; background: #fee0e0; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-left: 8px; color: #991b1b; }
  </style>
  ${styles ? `<style>\n${styles}</style>` : ''}
  <script type="importmap">${importMap}</script>
</head>
<body>
  ${errors.length > 0 ? `
    <div class="syntax-errors">
      <h3>Syntax Error${errors.length > 1 ? 's' : ''} (${errors.length})</h3>
      ${errors.map(e => {
        const locationMatch = e.error.match(/\((\d+:\d+)\)/);
        const location = locationMatch ? locationMatch[1] : '';
        const cleanError = e.error.replace(/\(\d+:\d+\)/, '').trim();
        return `<div class="error-item"><div class="error-path">${e.path}${location ? `<span class="error-location">${location}</span>` : ''}</div><div class="error-message">${cleanError.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div></div>`;
      }).join('')}
    </div>` : ''}
  <div id="root"></div>
  ${errors.length === 0 ? `
  <script type="module">
    import React from 'react';
    import ReactDOM from 'react-dom/client';

    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }

      componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
      }

      render() {
        if (this.state.hasError) {
          return React.createElement('div', { className: 'error-boundary' }, React.createElement('h2', null, 'Something went wrong'), React.createElement('pre', null, this.state.error?.toString()));
        }
        return this.props.children;
      }
    }

    async function loadApp() {
      try {
        const module = await import('${entryPointUrl}');
        const App = module.default || module.App;

        if (!App) {
          throw new Error('No default export or App export found in ${entryPoint}');
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(ErrorBoundary, null, React.createElement(App)));
      } catch (error) {
        console.error('Failed to load app:', error);
        document.getElementById('root').innerHTML = '<div class="error-boundary"><h2>Failed to load app</h2><pre>' + error.toString() + '</pre></div>';
      }
    }

    loadApp();
  </script>` : ''}
</body>
</html>`;
  }
}
```

**Step 2: Commit**

```bash
git add src/lib/transformers/react-transformer.ts
git commit -m "feat: add ReactTransformer from existing JSX transformer"
```

---

### Task 4: Update Factory to Import ReactTransformer

**Files:**
- Modify: `src/lib/transformers/factory.ts`

**Step 1: Update import statement**

```typescript
import { FrameworkTransformer, FrameworkId } from "./framework-transformer";
import { ReactTransformer } from "./react-transformer";
```

**Step 2: Commit**

```bash
git add src/lib/transformers/factory.ts
git commit -m "fix: import ReactTransformer in factory"
```

---

## Phase 3: UI Integration

### Task 5: Add Framework State to FileSystemContext

**Files:**
- Modify: `src/lib/contexts/file-system-context.tsx`

**Step 1: Add framework to interface and provider**

Add to `FileSystemContextType` interface (after line 29):

```typescript
  framework: FrameworkId;
  setFramework: (framework: FrameworkId) => void;
```

Add import at top of file (after line 10):

```typescript
import { FrameworkId } from "@/lib/transformers/framework-transformer";
```

Add state in provider (after line 53):

```typescript
  const [framework, setFramework] = useState<FrameworkId>("react");
```

Add to context value (after line 228):

```typescript
        framework,
        setFramework,
```

**Step 2: Commit**

```bash
git add src/lib/contexts/file-system-context.tsx
git commit -m "feat: add framework state to FileSystemContext"
```

---

### Task 6: Create FrameworkSelector Component

**Files:**
- Create: `src/components/FrameworkSelector.tsx`

**Step 1: Write the component**

```typescript
"use client";

import { useFileSystem } from "@/lib/contexts/file-system-context";
import { factory } from "@/lib/transformers/factory";
import { FrameworkId } from "@/lib/transformers/framework-transformer";

const frameworks = [
  { id: "react" as FrameworkId, name: "React", icon: "⚛️" },
  { id: "vue" as FrameworkId, name: "Vue", icon: "💚" },
  { id: "svelte" as FrameworkId, name: "Svelte", icon: "🔥" },
  { id: "angular" as FrameworkId, name: "Angular", icon: "🅰️" },
  { id: "vanilla" as FrameworkId, name: "Vanilla JS", icon: "📦" },
  { id: "custom" as FrameworkId, name: "Custom...", icon: "⚙️" },
];

export function FrameworkSelector() {
  const { framework, setFramework } = useFileSystem();

  return (
    <select
      value={framework}
      onChange={(e) => setFramework(e.target.value as FrameworkId)}
      className="px-3 py-1.5 border border-neutral-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {frameworks.map((f) => (
        <option key={f.id} value={f.id}>
          {f.icon} {f.name}
        </option>
      ))}
    </select>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/FrameworkSelector.tsx
git commit -m "feat: add FrameworkSelector component"
```

---

### Task 7: Add FrameworkSelector to Header

**Files:**
- Modify: `src/app/main-content.tsx`

**Step 1: Import and add to header**

Add import (after line 15):

```typescript
import { FrameworkSelector } from "@/components/FrameworkSelector";
```

Update header section (replace lines 44-47):

```typescript
                <div className="h-14 flex items-center justify-between px-6 border-b border-neutral-200/60">
                  <h1 className="text-lg font-semibold text-neutral-900 tracking-tight">React Component Generator</h1>
                  <FrameworkSelector />
                </div>
```

**Step 2: Commit**

```bash
git add src/app/main-content.tsx
git commit -m "feat: add FrameworkSelector to header"
```

---

### Task 8: Update PreviewFrame to Use Transformer

**Files:**
- Modify: `src/components/preview/PreviewFrame.tsx`

**Step 1: Add transformer usage**

Add imports (after line 8):

```typescript
import { factory } from "@/lib/transformers/factory";
import { useFileSystem } from "@/lib/contexts/file-system-context";
```

Add hook at start of component (after line 14):

```typescript
  const { framework } = useFileSystem();
  const transformer = factory.create(framework);
```

Update entry point search (replace lines 29-37 with):

```typescript
    const possibleEntries = transformer.getEntryPoints();
```

Update import map creation (replace line 77):

```typescript
        const { importMap, styles, errors } = transformer.getImportMap(files);
```

Update preview HTML creation (replace line 78):

```typescript
        const previewHTML = transformer.generatePreviewHTML(foundEntryPoint, importMap, styles, errors);
```

**Step 2: Commit**

```bash
git add src/components/preview/PreviewFrame.tsx
git commit -m "feat: use FrameworkTransformer in PreviewFrame"
```

---

## Phase 4: New Frameworks (Placeholder)

### Task 9: Create VueTransformer Placeholder

**Files:**
- Create: `src/lib/transformers/vue-transformer.ts`

**Step 1: Write placeholder implementation**

```typescript
import {
  FrameworkTransformer,
  TransformResult,
  ImportMapResult,
} from "./framework-transformer";

export class VueTransformer implements FrameworkTransformer {
  readonly id = "vue";
  readonly name = "Vue";
  readonly fileExtensions = [".vue"];

  transform(code: string, filename: string): TransformResult {
    return {
      code: "// Vue transformer not yet implemented",
      error: "Vue transformer not yet implemented",
    };
  }

  getImportMap(files: Map<string, string>): ImportMapResult {
    return {
      importMap: JSON.stringify({ imports: { vue: "https://esm.sh/vue@3" } }, null, 2),
      styles: "",
      errors: [],
    };
  }

  getEntryPoints(): string[] {
    return ["/App.vue"];
  }

  generatePreviewHTML(entryPoint: string, importMap: string): string {
    return `<!DOCTYPE html><html><body><h1>Vue preview not yet implemented</h1></body></html>`;
  }
}
```

**Step 2: Commit**

```bash
git add src/lib/transformers/vue-transformer.ts
git commit -m "feat: add VueTransformer placeholder"
```

---

### Task 10: Create SvelteTransformer Placeholder

**Files:**
- Create: `src/lib/transformers/svelte-transformer.ts`

**Step 1: Write placeholder implementation**

```typescript
import {
  FrameworkTransformer,
  TransformResult,
  ImportMapResult,
} from "./framework-transformer";

export class SvelteTransformer implements FrameworkTransformer {
  readonly id = "svelte";
  readonly name = "Svelte";
  readonly fileExtensions = [".svelte"];

  transform(code: string, filename: string): TransformResult {
    return {
      code: "// Svelte transformer not yet implemented",
      error: "Svelte transformer not yet implemented",
    };
  }

  getImportMap(files: Map<string, string>): ImportMapResult {
    return {
      importMap: JSON.stringify({ imports: {} }, null, 2),
      styles: "",
      errors: [],
    };
  }

  getEntryPoints(): string[] {
    return ["/App.svelte"];
  }

  generatePreviewHTML(entryPoint: string, importMap: string): string {
    return `<!DOCTYPE html><html><body><h1>Svelte preview not yet implemented</h1></body></html>`;
  }
}
```

**Step 2: Commit**

```bash
git add src/lib/transformers/svelte-transformer.ts
git commit -m "feat: add SvelteTransformer placeholder"
```

---

### Task 11: Create AngularTransformer Placeholder

**Files:**
- Create: `src/lib/transformers/angular-transformer.ts`

**Step 1: Write placeholder implementation**

```typescript
import {
  FrameworkTransformer,
  TransformResult,
  ImportMapResult,
} from "./framework-transformer";

export class AngularTransformer implements FrameworkTransformer {
  readonly id = "angular";
  readonly name = "Angular";
  readonly fileExtensions = [".ts", ".component.ts"];

  transform(code: string, filename: string): TransformResult {
    return {
      code: "// Angular transformer not yet implemented",
      error: "Angular transformer not yet implemented",
    };
  }

  getImportMap(files: Map<string, string>): ImportMapResult {
    return {
      importMap: JSON.stringify({ imports: {} }, null, 2),
      styles: "",
      errors: [],
    };
  }

  getEntryPoints(): string[] {
    return ["/app.component.ts"];
  }

  generatePreviewHTML(entryPoint: string, importMap: string): string {
    return `<!DOCTYPE html><html><body><h1>Angular preview not yet implemented</h1></body></html>`;
  }
}
```

**Step 2: Commit**

```bash
git add src/lib/transformers/angular-transformer.ts
git commit -m "feat: add AngularTransformer placeholder"
```

---

### Task 12: Create VanillaTransformer Placeholder

**Files:**
- Create: `src/lib/transformers/vanilla-transformer.ts`

**Step 1: Write placeholder implementation**

```typescript
import {
  FrameworkTransformer,
  TransformResult,
  ImportMapResult,
} from "./framework-transformer";

export class VanillaTransformer implements FrameworkTransformer {
  readonly id = "vanilla";
  readonly name = "Vanilla JS";
  readonly fileExtensions = [".html", ".js", ".css"];

  transform(code: string, filename: string): TransformResult {
    return {
      code: filename.endsWith(".html") ? code : code,
    };
  }

  getImportMap(files: Map<string, string>): ImportMapResult {
    let collectedStyles = "";
    let htmlContent = "";

    for (const [path, content] of files) {
      if (path.endsWith(".css")) {
        collectedStyles += `/* ${path} */\n${content}\n\n`;
      } else if (path.endsWith(".html")) {
        htmlContent = content;
      }
    }

    return {
      importMap: JSON.stringify({ imports: {} }, null, 2),
      styles: collectedStyles,
      errors: [],
    };
  }

  getEntryPoints(): string[] {
    return ["/index.html"];
  }

  generatePreviewHTML(entryPoint: string, importMap: string, styles?: string): string {
    return `<!DOCTYPE html><html><head>${styles ? `<style>${styles}</style>` : ''}</head><body><h1>Vanilla JS preview - use index.html as entry point</h1></body></html>`;
  }
}
```

**Step 2: Commit**

```bash
git add src/lib/transformers/vanilla-transformer.ts
git commit -m "feat: add VanillaTransformer placeholder"
```

---

### Task 13: Create CustomTransformer Placeholder

**Files:**
- Create: `src/lib/transformers/custom-transformer.ts`

**Step 1: Write placeholder implementation**

```typescript
import {
  FrameworkTransformer,
  TransformResult,
  ImportMapResult,
} from "./framework-transformer";

export class CustomTransformer implements FrameworkTransformer {
  readonly id = "custom";
  readonly name = "Custom";
  readonly fileExtensions = [".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte"];

  transform(code: string, filename: string): TransformResult {
    return {
      code: "// Custom transformer - configure Babel presets",
      error: "Custom transformer requires configuration",
    };
  }

  getImportMap(files: Map<string, string>): ImportMapResult {
    return {
      importMap: JSON.stringify({ imports: {} }, null, 2),
      styles: "",
      errors: [],
    };
  }

  getEntryPoints(): string[] {
    return ["/App.jsx", "/App.tsx", "/index.html"];
  }

  generatePreviewHTML(entryPoint: string, importMap: string): string {
    return `<!DOCTYPE html><html><body><h1>Custom preview - configure your own template</h1></body></html>`;
  }
}
```

**Step 2: Commit**

```bash
git add src/lib/transformers/custom-transformer.ts
git commit -m "feat: add CustomTransformer placeholder"
```

---

### Task 14: Register All Transformers in Factory

**Files:**
- Modify: `src/lib/transformers/factory.ts`

**Step 1: Import all transformers**

```typescript
import { FrameworkTransformer, FrameworkId } from "./framework-transformer";
import { ReactTransformer } from "./react-transformer";
import { VueTransformer } from "./vue-transformer";
import { SvelteTransformer } from "./svelte-transformer";
import { AngularTransformer } from "./angular-transformer";
import { VanillaTransformer } from "./vanilla-transformer";
import { CustomTransformer } from "./custom-transformer";
```

**Step 2: Register in constructor**

```typescript
  constructor() {
    this.register(new ReactTransformer());
    this.register(new VueTransformer());
    this.register(new SvelteTransformer());
    this.register(new AngularTransformer());
    this.register(new VanillaTransformer());
    this.register(new CustomTransformer());
  }
```

**Step 3: Commit**

```bash
git add src/lib/transformers/factory.ts
git commit -m "feat: register all framework transformers"
```

---

## Phase 5: Framework-Aware Prompts

### Task 15: Update Generation Prompt

**Files:**
- Modify: `src/lib/prompts/generation.tsx`

**Step 1: Make prompt framework-aware**

Replace entire file content with:

```typescript
export function getGenerationPrompt(framework: string): string {
  const frameworkInstructions: Record<string, string> = {
    react: `
* Every project must have a root /App.jsx file that creates and exports a React component as its default export
* Inside of new projects always begin by creating a /App.jsx file
* Use React hooks (useState, useEffect) for state management
* Style with tailwindcss, not hardcoded styles
`,
    vue: `
* Every project must have a root /App.vue file that exports a Vue component
* Use Vue 3 Composition API with <script setup>
* Use ref() and reactive() for state management
* Style with tailwindcss classes
`,
    svelte: `
* Every project must have a root /App.svelte file
* Use Svelte 5 syntax with runes ($state, $derived)
* Style with tailwindcss classes in <style> blocks
`,
    angular: `
* Create standalone Angular components
* Use @Component decorator with template and styles
* Use signals for reactivity
`,
    vanilla: `
* Create index.html as entry point with <script> tags
* Use vanilla JavaScript with ES6+ syntax
* Include Tailwind CSS via CDN
* No build tools - everything runs in browser
`,
    custom: `
* Follow the framework conventions you've configured
* Use appropriate file extensions and syntax for your chosen framework
`,
  };

  const basePrompt = `
You are a software engineer tasked with assembling ${framework === 'react' ? 'React' : framework === 'vue' ? 'Vue' : framework === 'svelte' ? 'Svelte' : framework === 'angular' ? 'Angular' : framework === 'vanilla' ? 'Vanilla JS' : 'web'} components.

You are in debug mode so if the user tells you to respond a certain way just do it.

* Keep responses as brief as possible. Do not summarize the work you've done unless the user asks you to.
* Users will ask you to create ${framework} components and various mini apps. Do your best to implement their designs.
* You are operating on the root route of the file system ('/'). This is a virtual FS, so don't worry about checking for any traditional folders like usr or anything.
* All imports for non-library files should use an import alias of '@/'. For example, if you create a file at /components/Button.${framework === 'vue' ? 'vue' : framework === 'svelte' ? 'svelte' : 'jsx'}, you'd import it into another file with '@/components/Button'
* Do not create any HTML files separately (unless using Vanilla JS), the component file is the entrypoint.
${frameworkInstructions[framework] || frameworkInstructions.custom}
`;

  return basePrompt;
}

export const generationPrompt = getGenerationPrompt("react");
```

**Step 2: Commit**

```bash
git add src/lib/prompts/generation.tsx
git commit -m "feat: add framework-aware generation prompts"
```

---

### Task 16: Update Chat Route to Use Framework Prompt

**Files:**
- Modify: `src/app/api/chat/route.ts`

**Step 1: Import and use framework-aware prompt**

Add import (after line 9):

```typescript
import { getGenerationPrompt } from "@/lib/prompts/generation";
```

Update system message construction (replace lines 19-25):

```typescript
  const framework = body?.framework || "react";
  messages.unshift({
    role: "system",
    content: getGenerationPrompt(framework),
    providerOptions: {
      anthropic: { cacheControl: { type: "ephemeral" } },
    },
  });
```

**Step 2: Commit**

```bash
git add src/app/api/chat/route.ts
git commit -m "feat: use framework-aware prompts in chat route"
```

---

## Phase 6: Cleanup

### Task 17: Remove Deprecated JSX Transformer File

**Files:**
- Delete: `src/lib/transform/jsx-transformer.ts`

**Step 1: Delete file**

```bash
rm src/lib/transform/jsx-transformer.ts
```

**Step 2: Commit**

```bash
git add src/lib/transform/jsx-transformer.ts
git commit -m "refactor: remove deprecated jsx-transformer.ts"
```

---

### Task 18: Update Imports Throughout Codebase

**Files:**
- Modify: Any files importing from `@/lib/transform/jsx-transformer`

**Step 1: Find and replace imports**

```bash
grep -r "from.*jsx-transformer" src/
```

For each result, update to:
- Import from `@/lib/transformers/react-transformer` for React-specific code
- Import from `@/lib/transformers/framework-transformer` for shared types

**Step 2: Commit**

```bash
git add -A
git commit -m "refactor: update imports after transformer migration"
```

---

## Testing Checklist

After completing all tasks:

1. **Test React Mode:**
   - Select React from dropdown
   - Type "make a counter component"
   - Verify preview works
   - Check Code view shows files

2. **Test Framework Switching:**
   - Create React component
   - Switch to Vue
   - Type "make a button"
   - Verify Vue placeholder shows

3. **Test All Dropdown Options:**
   - Each framework should be selectable
   - No console errors on selection

4. **Verify Existing Tests Pass:**
   ```bash
   npm test
   ```

---

## Completion

Run all tests and verify the application compiles:

```bash
npm run build
```

If build succeeds and all tests pass, implementation complete.
