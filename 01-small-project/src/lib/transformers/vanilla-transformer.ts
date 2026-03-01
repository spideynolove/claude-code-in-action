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
