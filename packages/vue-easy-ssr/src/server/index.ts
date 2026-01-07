/**
 * vue-easy-ssr/server
 *
 * Server-side utilities for SSR rendering.
 */

import { renderHeadToString } from "@vueuse/head";
import type { App } from "vue";
import { renderToString as vueRenderToString } from "vue/server-renderer";
import type { ISSRContext, ISSRRenderResult } from "../types";

export { createSSRContext, SSR_CONTEXT_KEY } from "../core/context";

/**
 * Serialize SSR context for client hydration
 */
export const serializeSSRContext = (ctx: ISSRContext): string => {
  const serializable = {
    asyncData: ctx.asyncData,
    piniaState: ctx.piniaState,
  };

  // Escape để tránh XSS
  return JSON.stringify(serializable)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/'/g, "\\u0027");
};

/**
 * Render Vue app to HTML string
 */
export const renderToString = async (
  app: App,
  ctx: ISSRContext
): Promise<ISSRRenderResult> => {
  const appHtml = await vueRenderToString(app, ctx);
  return { html: appHtml, ctx };
};

/**
 * Generate full HTML page (for production with manifest)
 *
 * @param manifest - Vite manifest for preload links
 * @param result - SSR render result
 * @param template - Optional HTML template (for production)
 */
export const generateHtml = async (
  manifestOrTemplate: Record<string, unknown> | string | null,
  result: ISSRRenderResult,
  template?: string
): Promise<string> => {
  const { html: appHtml, ctx } = result;

  // Determine if first arg is manifest or template
  let manifest: Record<string, unknown> | null = null;
  let htmlTemplate = template || "";

  if (typeof manifestOrTemplate === "string") {
    htmlTemplate = manifestOrTemplate;
  } else {
    manifest = manifestOrTemplate;
  }

  // If no template, generate minimal HTML
  if (!htmlTemplate) {
    htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div id="app"><!--ssr-outlet--></div>
</body>
</html>`;
  }

  // Serialize state for hydration
  const stateScript = `<script>window.__INITIAL_STATE__ = ${serializeSSRContext(
    ctx
  )}</script>`;

  let finalHtml = htmlTemplate;

  // Inject head tags if head instance provided
  if (ctx.head) {
    try {
      const headResult = await renderHeadToString(
        ctx.head as Parameters<typeof renderHeadToString>[0]
      );
      if (headResult.headTags) {
        finalHtml = finalHtml.replace(
          "</head>",
          `${headResult.headTags}\n</head>`
        );
      }
    } catch (e) {
      console.warn("[vue-easy-ssr] Failed to render head:", e);
    }
  }

  // Inject app HTML
  if (finalHtml.includes("<!--ssr-outlet-->")) {
    finalHtml = finalHtml.replace("<!--ssr-outlet-->", appHtml);
  } else {
    finalHtml = finalHtml.replace(
      /<div id="app"[^>]*>[\s\S]*?<\/div>/,
      `<div id="app">${appHtml}</div>`
    );
  }

  // Inject state script before </body>
  finalHtml = finalHtml.replace("</body>", `${stateScript}\n</body>`);

  return finalHtml;
};
