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
