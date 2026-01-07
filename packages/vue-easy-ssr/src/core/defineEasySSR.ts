import type { Pinia } from "pinia";
import type { App } from "vue";
import type { Router } from "vue-router";
import type { IEasySSROptions, ISSRContext } from "../types";
import { SSR_CONTEXT_KEY } from "./context";

/**
 * Return type của defineEasySSR
 */
export interface IEasySSRInstance {
  /**
   * Create app for client-side (hydration)
   * Tạo app cho client để hydrate
   */
  createClientApp: () => Promise<{
    app: App;
    router: Router;
    pinia?: Pinia;
  }>;

  /**
   * Create app for server-side rendering
   * Tạo app cho server để render
   */
  createServerApp: (url: string) => Promise<{
    app: App;
    router: Router;
    pinia?: Pinia;
    ctx: ISSRContext;
  }>;
}

/**
 * defineEasySSR - Main API for vue-easy-ssr
 *
 * Entry point chính để cấu hình SSR cho Vue app.
 * Cung cấp các factory functions để tạo app cho cả client và server.
 *
 * @example
 * ```ts
 * // main.ts
 * import { defineEasySSR } from 'vue-easy-ssr'
 * import App from './App.vue'
 * import { createRouter } from './router'
 * import { createPinia } from 'pinia'
 *
 * export const ssr = defineEasySSR({
 *   createApp: () => {
 *     const app = createSSRApp(App)
 *     const router = createRouter()
 *     const pinia = createPinia()
 *
 *     app.use(router)
 *     app.use(pinia)
 *
 *     return { app, router, pinia }
 *   }
 * })
 * ```
 */
export const defineEasySSR = (options: IEasySSROptions): IEasySSRInstance => {
  const { createApp: userCreateApp } = options;

  return {
    /**
     * Create app for client-side hydration
     * Được gọi từ entry-client.ts
     */
    createClientApp: async () => {
      const { app, router, pinia } = userCreateApp();

      // Hydrate Pinia state từ window.__INITIAL_STATE__
      if (pinia && typeof window !== "undefined") {
        const initialState = (
          window as Window & {
            __INITIAL_STATE__?: { piniaState?: Record<string, unknown> };
          }
        ).__INITIAL_STATE__;
        if (initialState?.piniaState) {
          pinia.state.value =
            initialState.piniaState as typeof pinia.state.value;
        }
      }

      // Wait for router to be ready
      await router.isReady();

      return { app, router, pinia };
    },

    /**
     * Create app for server-side rendering
     * Được gọi từ entry-server.ts cho mỗi request
     */
    createServerApp: async (url: string) => {
      const { app, router, pinia } = userCreateApp();

      // Create SSR context
      const ctx: ISSRContext = {
        asyncData: {},
        head: {
          title: "",
          meta: [],
          link: [],
          script: [],
        },
        piniaState: undefined,
        url,
        error: null,
      };

      // Provide SSR context to the app
      app.provide(SSR_CONTEXT_KEY, ctx);

      // Navigate to the requested URL
      await router.push(url);
      await router.isReady();

      // Store Pinia state for hydration
      if (pinia) {
        ctx.piniaState = pinia.state.value as Record<string, unknown>;
      }

      return { app, router, pinia, ctx };
    },
  };
};
