# Getting Started

## Installation

```bash
# Install the package
pnpm add vue-easy-ssr

# Peer dependencies
pnpm add vue vue-router pinia
```

## Quick Setup

### 1. Update your `src/main.ts`

Use `defineEasySSR` to export your app factory.

```ts
import { defineEasySSR } from "vue-easy-ssr";
import { createPinia } from "pinia";
import App from "./App.vue";
import { createRouter } from "./router";

export default defineEasySSR({
  app: App,
  router: createRouter,
  pinia: createPinia,
});
```

### 2. Configure `vite.config.ts`

Add the `vueEasySSR` plugin.

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { vueEasySSR } from "vue-easy-ssr/vite";

export default defineConfig({
  plugins: [vue(), vueEasySSR()],
});
```

### 3. Add Scripts

Standard Vite commands work out of the box.

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "start": "node dist/server/server.js"
  }
}
```

## Running the App

### Development

```bash
pnpm dev
```

Starts the Vite development server with SSR middleware enabled.

### Production

```bash
pnpm build
pnpm start
```

`pnpm build` automatically builds both client and server bundles, and generates a production `server.js` file.

## Next Steps

- Learn about [useAsyncData](./api/use-async-data.md) for server-side data fetching
- Learn about [useHead](./api/use-head.md) for SEO meta management
- See the [Deployment Guide](./deployment.md) for production setup
