declare module "unbuild" {
  export function defineBuildConfig(config: {
    entries: Array<{ input: string; name: string }>;
    declaration?: boolean;
    clean?: boolean;
    rollup?: {
      emitCJS?: boolean;
    };
    externals?: string[];
  }): unknown;
}
