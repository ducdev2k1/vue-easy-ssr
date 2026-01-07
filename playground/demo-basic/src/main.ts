/**
 * Main app factory
 *
 * Shared logic để tạo Vue app cho cả client và server.
 * Sử dụng defineEasySSR từ vue-easy-ssr.
 */

import { createPinia } from "pinia";
import { createSSRApp } from "vue";
import { defineEasySSR } from "vue-easy-ssr";
import App from "./App.vue";
import { createRouter } from "./router";

/**
 * SSR instance được export để sử dụng trong entry-client và entry-server
 */
export const ssr = defineEasySSR({
  createApp: () => {
    // Create Vue app với SSR mode
    const app = createSSRApp(App);

    // Create router instance mới cho mỗi request
    const router = createRouter();

    // Create Pinia instance mới cho mỗi request
    const pinia = createPinia();

    // Install plugins
    app.use(router);
    app.use(pinia);

    return { app, router, pinia };
  },
});
