<p align="center">
  <img src="./assets/logo.png" width="200" alt="Vue Easy SSR Logo">
</p>

# 🚀 Vue Easy SSR

> Enable Server-Side Rendering (SSR) for Vue 3 in under 5 minutes.
> **Zero Config. Native Vite. Production Ready.**

[![npm version](https://img.shields.io/npm/v/vue-easy-ssr.svg)](https://www.npmjs.com/package/vue-easy-ssr)
[![License](https://img.shields.io/npm/l/vue-easy-ssr.svg)](https://github.com/ducdev2k1/vue-easy-ssr/blob/master/LICENSE)

## ✨ Features

- **Zero Configuration**: Just add the Vite plugin and go.
- **No Boilerplate**: No manual `entry-client.ts`, `entry-server.ts`, or `server.js`.
- **Native Experience**: Use standard `vite dev` and `vite build` commands.
- **Production Ready**: Auto-generates a Node.js Express server on build.
- **Composable**: `useAsyncData`, `useHead` built-in.

---

## 📦 Installation

```bash
pnpm add vue-easy-ssr
# OR
npm install vue-easy-ssr
```

---

## 🛠️ Usage

### 1. Setup `main.ts`

Use `defineEasySSR` to export your app factory.

```ts
// src/main.ts
import { defineEasySSR } from "vue-easy-ssr";
import { createPinia } from "pinia";
import App from "./App.vue";
import { createRouter } from "./router";

export default defineEasySSR({
  app: App,
  router: createRouter,
  pinia: createPinia, // Optional
});
```

### 2. Configure `vite.config.ts`

Add the plugin.

```ts
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { vueEasySSR } from "vue-easy-ssr/vite";

export default defineConfig({
  plugins: [vue(), vueEasySSR()],
});
```

### 3. Add Scripts

Use standard Vite commands.

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "start": "node dist/server/server.js"
  }
}
```

---

## 🚀 Development & Build

### Development

```bash
pnpm dev
```

Starts Vite dev server with SSR middleware. HMR enabled.

### Production Build

```bash
pnpm build
```

Automatically orchestrates:

1. **Client Build** (`dist/client`)
2. **Server Build** (`dist/server`)
3. **Server Gen**: Creates `dist/server/server.js`

### Run Production

```bash
node dist/server/server.js
```

Starts the production server at `http://localhost:3000`.

---

## 🧩 API Reference

### `defineEasySSR(options)`

Main entry point.

- `app`: Root Vue component.
- `router`: Router factory function.
- `pinia`: (Optional) Pinia factory function.
- `el`: (Optional) Mount selector (default: `#app`).

### `useAsyncData(key, fetcher)`

Fetch data on server, dehydrate to client.

```ts
const { data, pending, error } = await useAsyncData("users", () =>
  fetch("/api/users")
);
```

### `useHead(config)`

Manage head tags (title, meta, etc.). Powered by `@vueuse/head`.

---

## 📄 License

MIT
