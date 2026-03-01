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
