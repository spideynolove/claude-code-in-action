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
