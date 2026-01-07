/**
 * Main App Entry - Zero-Config SSR
 *
 * Với vue-easy-ssr mới, chỉ cần 1 file này.
 * Plugin tự động generate entry-client và entry-server.
 */

import { createPinia } from "pinia";
import { defineEasySSR } from "vue-easy-ssr";
import { createI18n } from "vue-i18n";
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

  // Setup plugins (i18n, etc.)
  setup(app) {
    const i18n = createI18n({
      legacy: false,
      locale: "en",
      messages: {
        en: {
          common: {
            hello: "Hello, World!",
            switchLang: "Switch Language",
            loading: "Loading",
          },
          home: {
            subtitle: "Zero-Config SSR. Native Vite. Production Ready.",
            getStarted: "Get Started",
            learnMore: "Learn More",
          },
        },
        vi: {
          common: {
            hello: "Xin chào thế giới!",
            switchLang: "Đổi ngôn ngữ",
            loading: "Đang tải",
          },
          home: {
            subtitle: "SSR Zero-Config. Chuẩn Vite. Sẵn sàng Production.",
            getStarted: "Bắt đầu ngay",
            learnMore: "Tìm hiểu thêm",
          },
        },
      },
    });
    app.use(i18n);
  },
});
