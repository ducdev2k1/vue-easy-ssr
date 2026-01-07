/**
 * Client Entry Point
 *
 * Entry point cho browser. Hydrates app từ server-rendered HTML.
 */

import { ssr } from "./main";

// Hydrate app khi DOM ready
async function bootstrap() {
  const { app, router } = await ssr.createClientApp();

  // Wait for router to be ready (ensures async components are resolved)
  await router.isReady();

  // Mount app - Vue 3 automatically hydrates when content exists
  app.mount("#app");

  console.log("[vue-easy-ssr] App hydrated successfully");
}

bootstrap().catch(console.error);
