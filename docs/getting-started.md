# Getting Started

## Installation

```bash
# Install the package
pnpm add vue-easy-ssr

# Peer dependencies (if not already installed)
pnpm add vue vue-router pinia
```

## Quick Setup

### 1. Update your main.ts

```ts
// src/main.ts
import { createSSRApp } from "vue";
import { createPinia } from "pinia";
import { defineEasySSR } from "vue-easy-ssr";
import App from "./App.vue";
import { createRouter } from "./router";

export const ssr = defineEasySSR({
  createApp: () => {
    const app = createSSRApp(App);
    const router = createRouter();
    const pinia = createPinia();

    app.use(router);
    app.use(pinia);

    return { app, router, pinia };
  },
});
```

### 2. Create entry-client.ts

```ts
// src/entry-client.ts
import { ssr } from "./main";

async function bootstrap() {
  const { app, router } = await ssr.createClientApp();
  await router.isReady();
  app.mount("#app");
}

bootstrap();
```

### 3. Create entry-server.ts

```ts
// src/entry-server.ts
import { ssr } from "./main";
import { renderToString, generateHtml } from "vue-easy-ssr/server";

export async function render(url: string, template: string): Promise<string> {
  const { app, router, ctx } = await ssr.createServerApp(url);
  await router.isReady();
  const result = await renderToString(app, ctx);
  return generateHtml(template, result);
}
```

### 4. Update index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="app"><!--ssr-outlet--></div>
    <script type="module" src="/src/entry-client.ts"></script>
  </body>
</html>
```

### 5. Create SSR server

See the [server.js example](../playground/demo-basic/server.js) for a complete Express SSR server.

## Next Steps

- Learn about [useAsyncData](./api/use-async-data.md) for server-side data fetching
- Learn about [useHead](./api/use-head.md) for SEO meta management
- See the [Deployment Guide](./deployment.md) for production setup
