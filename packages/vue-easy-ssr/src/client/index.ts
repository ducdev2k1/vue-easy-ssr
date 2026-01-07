/**
 * vue-easy-ssr/client
 *
 * Client-side utilities for SSR hydration.
 * Import này chỉ nên được sử dụng trong entry-client.ts.
 */

import type { App } from "vue";

/**
 * Get initial state from SSR
 * Lấy state đã được serialize từ server
 */
export const getInitialState = <T = Record<string, unknown>>(): T | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    (window as Window & { __INITIAL_STATE__?: T }).__INITIAL_STATE__ ?? null
  );
};

/**
 * Hydrate the Vue app
 *
 * Mounts the app with hydration mode, connecting to server-rendered HTML.
 *
 * @param app - Vue app instance
 * @param container - DOM container selector or element
 */
export const hydrateApp = (
  app: App,
  container: string | Element = "#app"
): void => {
  // Get container element
  const el =
    typeof container === "string"
      ? document.querySelector(container)
      : container;

  if (!el) {
    console.error(`[vue-easy-ssr] Container "${container}" not found`);
    return;
  }

  // Mount with hydration
  // Vue 3 automatically hydrates when mounting to a container with SSR content
  app.mount(el);
};

/**
 * Wait for router to be ready before hydration
 *
 * Đảm bảo router đã resolve route hiện tại trước khi mount app.
 * Điều này tránh hydration mismatch khi có async components.
 *
 * @example
 * ```ts
 * // entry-client.ts
 * import { hydrateApp, waitForRouter } from 'vue-easy-ssr/client'
 *
 * const { app, router } = createApp()
 *
 * await waitForRouter(router)
 * hydrateApp(app)
 * ```
 */
export const waitForRouter = async (router: {
  isReady: () => Promise<void>;
}): Promise<void> => {
  await router.isReady();
};

/**
 * Safe client-only execution
 *
 * Chạy callback chỉ khi ở phía client.
 * Hữu ích cho code chỉ chạy được trên browser.
 *
 * @example
 * ```ts
 * import { onClient } from 'vue-easy-ssr/client'
 *
 * onClient(() => {
 *   // This only runs on the client
 *   localStorage.setItem('visited', 'true')
 * })
 * ```
 */
export const onClient = <T>(fn: () => T): T | undefined => {
  if (typeof window !== "undefined") {
    return fn();
  }
  return undefined;
};
