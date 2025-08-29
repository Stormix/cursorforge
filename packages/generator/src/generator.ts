// Code generation utilities
export class Generator {
  constructor(private readonly config: { name: string; version: string }) {}

  generate(): string {
    return `Generated code for ${this.config.name} v${this.config.version}`;
  }
}
