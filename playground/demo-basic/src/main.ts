/**
 * Main App Entry - Zero-Config SSR
 *
 * Với vue-easy-ssr mới, chỉ cần 1 file này.
 * Plugin tự động generate entry-client và entry-server.
 */

import { createPinia } from "pinia";
import { defineEasySSR } from "vue-easy-ssr";
import App from "./App.vue";
import { createRouter } from "./router";

/**
 * Zero-config SSR instance
 * Plugin sẽ tự động:
 * - Generate entry-client (hydration)
 * - Generate entry-server (SSR render)
 * - Configure Vite SSR
 */
export default defineEasySSR({
  // Root component
  app: App,

  // Router factory - called fresh for each SSR request
  router: createRouter,

  // Pinia factory - called fresh for each SSR request
  pinia: createPinia,

  // Global head config (optional)
  head: {
    titleTemplate: "%s | Vue Easy SSR",
  },
});
