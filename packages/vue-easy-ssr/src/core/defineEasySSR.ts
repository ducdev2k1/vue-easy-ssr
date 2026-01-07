import { createHead } from "@vueuse/head";
import type { Pinia } from "pinia";
import type { App, Component } from "vue";
import { createSSRApp } from "vue";
import type { Router } from "vue-router";
import { renderToString as vueRenderToString } from "vue/server-renderer";
import type { IEasySSROptions, ISSRContext, ISSRRenderResult } from "../types";
import { SSR_CONTEXT_KEY, createSSRContext } from "./context";

/**
 * Internal interface - used by Vite plugin
 * Không export ra ngoài
 */
interface IEasySSRInternal {
  /** Client-side hydration */
  _hydrate(el?: string): Promise<void>;

  /** Server-side rendering */
  _render(url: string): Promise<ISSRRenderResult>;

  /** Access to options */
  _options: IEasySSROptions;
}

/**
 * Legacy interface để backward compatible
 * @deprecated Use new simplified API
 */
export interface IEasySSRInstance {
  createClientApp: () => Promise<{
    app: App;
    router: Router;
    pinia?: Pinia;
  }>;

  createServerApp: (url: string) => Promise<{
    app: App;
    router: Router;
    pinia?: Pinia;
    ctx: ISSRContext;
  }>;
}

/**
 * defineEasySSR - Zero-Config SSR for Vue 3
 *
 * New simplified API - user just passes component and factory functions.
 * Plugin handles entry file generation automatically.
 *
 * @example
 * ```ts
 * // main.ts
 * import { defineEasySSR } from 'vue-easy-ssr';
 * import App from './App.vue';
 * import { createRouter } from './router';
 * import { createPinia } from 'pinia';
 *
 * export default defineEasySSR({
 *   app: App,
 *   router: createRouter,
 *   pinia: createPinia,
 * });
 * ```
 */
export function defineEasySSR(
  options: IEasySSROptions
): IEasySSRInternal & IEasySSRInstance {
  const {
    app: AppComponent,
    router: createRouter,
    pinia: createPinia,
    head: globalHead,
    el = "#app",
  } = options;

  /**
   * Internal factory to create app instance
   * Called fresh for each SSR request or once on client
   */
  async function createAppInstance() {
    const app = createSSRApp(AppComponent as Component);
    const router = createRouter();
    const pinia = createPinia?.();
    const head = createHead();

    // Install plugins
    app.use(router);
    if (pinia) app.use(pinia);
    app.use(head);

    // Call setup hook for additional plugins (Vuetify, i18n, etc.)
    if (options.setup) {
      await options.setup(app);
    }

    return { app, router, pinia, head };
  }

  return {
    // Store options for plugin access
    _options: options,

    /**
     * Client-side hydration
     * Called by virtual:vue-easy-ssr/entry-client
     */
    async _hydrate(mountEl?: string) {
      const { app, router, pinia } = await createAppInstance();

      // Hydrate Pinia state from window.__INITIAL_STATE__
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

      // Wait for router
      await router.isReady();

      // Mount app
      app.mount(mountEl || el);
    },

    /**
     * Server-side rendering
     * Called by virtual:vue-easy-ssr/entry-server
     */
    async _render(url: string): Promise<ISSRRenderResult> {
      const { app, router, pinia, head } = await createAppInstance();

      // Create SSR context
      const ctx = createSSRContext(url);
      ctx.head = head;

      // Provide context to app
      app.provide(SSR_CONTEXT_KEY, ctx);

      // Navigate to URL
      await router.push(url);
      await router.isReady();

      // Check for 404
      const matchedRoute = router.currentRoute.value.matched;
      if (matchedRoute.length === 0) {
        ctx.error = new Error("Page not found");
      }

      // Store Pinia state for hydration
      if (pinia) {
        ctx.piniaState = pinia.state.value as Record<string, unknown>;
      }

      // Render app to HTML
      const html = await vueRenderToString(
        app,
        ctx as unknown as Record<string, unknown>
      );

      return { html, ctx };
    },

    // ========================================
    // Legacy API (backward compatibility)
    // ========================================

    /**
     * @deprecated Use new simplified API with Vite plugin
     */
    async createClientApp() {
      const { app, router, pinia } = await createAppInstance();

      // Hydrate Pinia state
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

      await router.isReady();
      return { app, router, pinia };
    },

    /**
     * @deprecated Use new simplified API with Vite plugin
     */
    async createServerApp(url: string) {
      const { app, router, pinia, head } = await createAppInstance();

      const ctx = createSSRContext(url);
      ctx.head = head;
      app.provide(SSR_CONTEXT_KEY, ctx);

      await router.push(url);
      await router.isReady();

      if (pinia) {
        ctx.piniaState = pinia.state.value as Record<string, unknown>;
      }

      return { app, router, pinia, ctx };
    },
  };
}

export default defineEasySSR;
