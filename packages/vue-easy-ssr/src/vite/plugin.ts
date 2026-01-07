import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import {
  Plugin,
  ResolvedConfig,
  build as viteBuild,
  ViteDevServer,
} from "vite";
import { getServerPackageJson, getServerTemplate } from "../server/template";
import type { IPluginOptions } from "../types";

// Virtual module IDs
export const VIRTUAL_CLIENT = "virtual:vue-easy-ssr/client";
export const VIRTUAL_SERVER = "virtual:vue-easy-ssr/server";
const RESOLVED_CLIENT = "\0" + VIRTUAL_CLIENT;
const RESOLVED_SERVER = "\0" + VIRTUAL_SERVER;

/**
 * Find main.ts/main.js entry file
 */
function findMainEntry(root: string): string {
  const candidates = [
    resolve(root, "src/main.ts"),
    resolve(root, "src/main.js"),
    resolve(root, "main.ts"),
    resolve(root, "main.js"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    "[vue-easy-ssr] Could not find main.ts or main.js. " +
      "Please specify entry in plugin options."
  );
}

/**
 * Generate virtual client entry code
 */
function generateClientCode(mainPath: string, el: string): string {
  return `
// Virtual module: vue-easy-ssr/client
import ssrInstance from '${mainPath}';

async function bootstrap() {
  try {
    await ssrInstance._hydrate('${el}');
    console.log('[vue-easy-ssr] ✓ App hydrated');
  } catch (error) {
    console.error('[vue-easy-ssr] ✗ Hydration failed:', error);
    throw error;
  }
}

bootstrap();
`;
}

/**
 * Generate virtual server entry code
 */
function generateServerCode(mainPath: string): string {
  return `
// Virtual module: vue-easy-ssr/server
import ssrInstance from '${mainPath}';
import { generateHtml } from 'vue-easy-ssr/server';

export async function render(url, manifest, template) {
  const result = await ssrInstance._render(url);
  return generateHtml(manifest, result, template);
}

export { ssrInstance };
`;
}

/**
 * Core Vite Plugin
 * - Virtual Modules
 * - Build Orchestration (Client -> Server -> Gen)
 */
export function vueEasySSRCore(options: IPluginOptions = {}): Plugin {
  let config: ResolvedConfig;
  let mainEntry: string;
  let isBuidlingServer = false;

  return {
    name: "vue-easy-ssr:core",
    enforce: "pre",

    // 1. Configure Build Output
    config(userConfig, { command, isSsrBuild }) {
      if (command === "build") {
        // If it's a Server Build (custom triggered)
        if (isSsrBuild || userConfig.build?.ssr) {
          return {
            build: {
              ssr: true, // Ensure SSR mode
              outDir: options.outDir
                ? `${options.outDir}/server`
                : "dist/server",
              emptyOutDir: true,
              rollupOptions: {
                input: VIRTUAL_SERVER, // Explicit input for server build
                output: {
                  entryFileNames: "entry.js",
                  format: "esm",
                },
              },
            },
          };
        }

        // Default: Client Build
        return {
          build: {
            outDir: options.outDir ? `${options.outDir}/client` : "dist/client",
            ssrManifest: true,
            emptyOutDir: true,
          },
          optimizeDeps: {
            exclude: [VIRTUAL_CLIENT, VIRTUAL_SERVER],
          },
        };
      }

      // For serve command (dev)
      if (command === "serve") {
        return {
          optimizeDeps: {
            exclude: [VIRTUAL_CLIENT, VIRTUAL_SERVER],
          },
        };
      }
    },

    configResolved(resolvedConfig) {
      config = resolvedConfig;
      // Detect if we are currently building server
      const input = config.build.rollupOptions?.input;
      isBuidlingServer = !!config.build.ssr || input === VIRTUAL_SERVER;

      mainEntry = options.entry || findMainEntry(config.root);
      mainEntry = mainEntry.replace(/\\/g, "/");
    },

    resolveId(id) {
      if (id === VIRTUAL_CLIENT || id === "/" + VIRTUAL_CLIENT)
        return RESOLVED_CLIENT;
      if (id === VIRTUAL_SERVER || id === "/" + VIRTUAL_SERVER)
        return RESOLVED_SERVER;
      return null;
    },

    load(id) {
      if (id === RESOLVED_CLIENT) {
        return generateClientCode(mainEntry, options.el || "#app");
      }
      if (id === RESOLVED_SERVER) {
        return generateServerCode(mainEntry);
      }
      return null;
    },

    // Inject client script into HTML
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        if (html.includes("<!--ssr-scripts-->")) {
          return html.replace(
            "<!--ssr-scripts-->",
            `<script type="module" src="/${VIRTUAL_CLIENT}"></script>`
          );
        }
        return html.replace(
          "</body>",
          `<script type="module" src="/${VIRTUAL_CLIENT}"></script>\n</body>`
        );
      },
    },

    // 2. Orchestrate Server Build after Client Build
    async closeBundle() {
      // Only proceed if:
      // - It's a build command
      // - It's the CLIENT build (not server build)
      // - Not skipped via env var
      if (
        config.command === "build" &&
        !isBuidlingServer &&
        !process.env.SKIP_SSR_BUILD
      ) {
        console.log("\n📦 Client build finished. Starting Server build...");

        const root = config.root;
        const outDir = options.outDir || "dist";

        try {
          // Trigger Server Build
          await viteBuild({
            root,
            configFile: config.configFile,
            mode: config.mode,
            build: {
              ssr: true, // This triggers the check in config() to set server options
            },
          });

          console.log("✓ Server build finished.");
          console.log("\n📄 Generating production server files...");

          // Generate server.js & package.json
          const serverDir = resolve(root, outDir, "server");
          if (!existsSync(serverDir)) {
            mkdirSync(serverDir, { recursive: true });
          }

          writeFileSync(
            resolve(serverDir, "server.js"),
            getServerTemplate(),
            "utf-8"
          );
          writeFileSync(
            resolve(serverDir, "package.json"),
            getServerPackageJson(),
            "utf-8"
          );

          console.log("✅ Zero-Config SSR Build Complete!");
          console.log(`
  dist/
  ├─ client/
  └─ server/
     ├─ server.js
     └─ entry.js

  Run: node dist/server/server.js
          `);
        } catch (error) {
          console.error("❌ SSR Build Failed:", error);
          process.exit(1);
        }
      }
    },
  };
}

/**
 * SSR Dev Server Middleware
 */
export function vueEasySSRDev(options: IPluginOptions = {}): Plugin {
  let server: ViteDevServer;

  return {
    name: "vue-easy-ssr:dev",
    enforce: "post",
    apply: "serve",

    configureServer(viteServer) {
      server = viteServer;
      return () => {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url || "/";
          if (url.includes(".") && !url.endsWith(".html")) return next();
          if (url.startsWith("/@") || url.startsWith("/__")) return next();

          try {
            const fs = await import("fs");
            const path = await import("path");
            let template = fs.readFileSync(
              path.resolve(server.config.root, "index.html"),
              "utf-8"
            );
            template = await server.transformIndexHtml(url, template);
            const { render } = await server.ssrLoadModule(VIRTUAL_SERVER);

            // In dev, manifest is null
            const html = await render(url, null, template);

            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (e: unknown) {
            server.ssrFixStacktrace(e as Error);
            console.error(e);
            next(e);
          }
        });
      };
    },
  };
}

export function vueEasySSR(options: IPluginOptions = {}): Plugin[] {
  return [vueEasySSRCore(options), vueEasySSRDev(options)];
}

export default vueEasySSR;
