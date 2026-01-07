import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        vite: resolve(__dirname, "src/vite/plugin.ts"),
        server: resolve(__dirname, "src/server/index.ts"),
        client: resolve(__dirname, "src/client/index.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        const ext = format === "es" ? "mjs" : "cjs";
        return `${entryName}.${ext}`;
      },
    },
    rollupOptions: {
      external: [
        // Vue ecosystem
        "vue",
        "vue-router",
        "pinia",
        "vue/server-renderer",
        "@vueuse/head",
        // Vite
        "vite",
        // Node.js builtins
        "fs",
        "path",
        "url",
        "child_process",
        "node:fs",
        "node:path",
        "node:url",
        "node:child_process",
        // Express (for generated server)
        "express",
      ],
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
  },
});
