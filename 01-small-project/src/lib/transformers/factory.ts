import { FrameworkTransformer, FrameworkId } from "./framework-transformer";
import { ReactTransformer } from "./react-transformer";
import { VueTransformer } from "./vue-transformer";
import { SvelteTransformer } from "./svelte-transformer";
import { AngularTransformer } from "./angular-transformer";
import { VanillaTransformer } from "./vanilla-transformer";
import { CustomTransformer } from "./custom-transformer";

class FrameworkTransformerFactory {
  private transformers = new Map<string, FrameworkTransformer>();

  constructor() {
    this.register(new ReactTransformer());
    this.register(new VueTransformer());
    this.register(new SvelteTransformer());
    this.register(new AngularTransformer());
    this.register(new VanillaTransformer());
    this.register(new CustomTransformer());
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
