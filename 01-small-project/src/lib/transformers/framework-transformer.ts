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
