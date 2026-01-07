# Vue Easy SSR

🚀 **Enable Server-Side Rendering for Vue 3 in under 15 minutes**

Vue Easy SSR is a lightweight, zero-config SSR solution for Vue 3 + Vite applications. It provides a simple API to add SSR to your existing SPA with minimal configuration.

## ✨ Features

- 🎯 **Simple API** - `defineEasySSR()` to configure your app
- ⚡ **Vite Plugin** - Seamless integration with Vite
- 📡 **useAsyncData** - Server-side data fetching with client hydration
- 🏷️ **useHead** - SEO meta tag management
- 🔌 **Framework Agnostic** - Works with Vuetify, Element Plus, and more
- 🪶 **Lightweight** - Minimal dependencies, no magic

## 📦 Installation

```bash
pnpm add vue-easy-ssr
```

## 🚀 Quick Start

### 1. Create your main.ts

```ts
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

### 2. Create entry files

**entry-client.ts**

```ts
import { ssr } from "./main";

async function bootstrap() {
  const { app, router } = await ssr.createClientApp();
  await router.isReady();
  app.mount("#app");
}

bootstrap();
```

**entry-server.ts**

```ts
import { ssr } from "./main";
import { renderToString, generateHtml } from "vue-easy-ssr/server";

export async function render(url: string, template: string) {
  const { app, router, ctx } = await ssr.createServerApp(url);
  await router.isReady();
  const result = await renderToString(app, ctx);
  return generateHtml(template, result);
}
```

### 3. Use composables in your components

```vue
<script setup lang="ts">
import { useAsyncData, useHead } from "vue-easy-ssr";

// SEO meta tags
useHead({
  title: "My Page",
  meta: [{ name: "description", content: "Page description" }],
});

// Server-side data fetching
const { data, pending, error } = useAsyncData({
  key: "users",
  handler: () => fetch("/api/users").then((r) => r.json()),
});
</script>
```

## 📖 Documentation

See the [docs](./docs) folder for complete documentation:

- [Getting Started](./docs/getting-started.md)
- [Deployment Guide](./docs/deployment.md)

## 🎮 Demo

Check out the [demo app](./playground/demo-basic) for a complete example.

```bash
# Clone and run
git clone https://github.com/ducdev2k1/vue-easy-ssr
cd vue-easy-ssr
pnpm install
pnpm dev:ssr
```

## 📄 License

MIT © Nguyễn Đăng Đức
