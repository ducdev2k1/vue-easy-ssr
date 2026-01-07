/**
 * Server Entry Point
 *
 * Entry point cho SSR. Được gọi bởi server.js cho mỗi request.
 */

import { generateHtml, renderToString } from "vue-easy-ssr/server";
import { ssr } from "./main";

/**
 * Render function được export để server.js sử dụng
 *
 * @param url - URL path để render
 * @param template - HTML template content
 * @returns Rendered HTML string
 */
export async function render(url: string, template: string): Promise<string> {
  // Create app for this request
  const { app, router, ctx } = await ssr.createServerApp(url);

  // Wait for router to be ready
  await router.isReady();

  // Check for 404
  const matchedRoute = router.currentRoute.value.matched;
  if (matchedRoute.length === 0) {
    ctx.error = new Error("Page not found");
  }

  // Render app to HTML string
  const result = await renderToString(app, ctx);

  // Generate full HTML page
  const html = generateHtml(template, result);

  return html;
}
