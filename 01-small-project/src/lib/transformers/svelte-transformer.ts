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
