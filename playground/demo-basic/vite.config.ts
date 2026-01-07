import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vite";
import { vueEasySSR } from "vue-easy-ssr/vite";

export default defineConfig({
  plugins: [vue(), vueEasySSR()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
