import { FrameworkTransformer, FrameworkId } from "./framework-transformer";

class FrameworkTransformerFactory {
  private transformers = new Map<string, FrameworkTransformer>();

  constructor() {}

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
