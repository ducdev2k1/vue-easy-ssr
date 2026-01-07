/**
 * vue-easy-ssr/server
 *
 * Server-side utilities for SSR rendering.
 * Import này chỉ nên được sử dụng trong entry-server.ts hoặc server code.
 */

import { renderHeadToString } from "@vueuse/head";
import type { App } from "vue";
import { renderToString as vueRenderToString } from "vue/server-renderer";
import type { ISSRContext, ISSRRenderResult } from "../types";

export { createSSRContext, SSR_CONTEXT_KEY } from "../core/context";

/**
 * Serialize SSR context for client hydration
 * Serialize context thành JSON để inject vào HTML
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
 *
 * @param app - Vue app instance
 * @param ctx - SSR context
 * @returns Rendered HTML and context
 */
export const renderToString = async (
  app: App,
  ctx: ISSRContext
): Promise<ISSRRenderResult> => {
  // Render app to HTML
  const appHtml = await vueRenderToString(app, ctx);

  return {
    html: appHtml,
    ctx,
  };
};

/**
 * Generate full HTML page from template and SSR result
 *
 * Injects rendered app HTML, head tags, and initial state into template.
 *
 * @param template - HTML template (index.html content)
 * @param result - SSR render result
 * @param head - Optional head instance from @vueuse/head
 * @returns Complete HTML page
 */
export const generateHtml = async (
  template: string,
  result: ISSRRenderResult,
  head?: unknown
): Promise<string> => {
  const { html: appHtml, ctx } = result;

  // Serialize state for hydration
  const stateScript = `<script>window.__INITIAL_STATE__ = ${serializeSSRContext(
    ctx
  )}</script>`;

  // Inject into template
  let finalHtml = template;

  // Inject head tags if head instance provided
  if (head) {
    const headResult = await renderHeadToString(
      head as Parameters<typeof renderHeadToString>[0]
    );
    if (headResult.headTags) {
      finalHtml = finalHtml.replace(
        "</head>",
        `${headResult.headTags}\n  </head>`
      );
    }
  }

  // Inject app HTML into <!--ssr-outlet--> or div#app
  if (finalHtml.includes("<!--ssr-outlet-->")) {
    finalHtml = finalHtml.replace("<!--ssr-outlet-->", appHtml);
  } else {
    // Fallback: replace div#app content
    finalHtml = finalHtml.replace(
      /<div id="app"[^>]*>[\s\S]*?<\/div>/,
      `<div id="app">${appHtml}</div>`
    );
  }

  // Inject state script before </body>
  finalHtml = finalHtml.replace("</body>", `    ${stateScript}\n  </body>`);

  return finalHtml;
};
