---
layout: home

hero:
  name: Vue Easy SSR
  text: Zero-Config SSR
  tagline: The simplest way to add Server-Side Rendering to your Vue 3 + Vite application
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/ducdev2k1/vue-easy-ssr

features:
  - icon: ✨
    title: Zero Config
    details: No manual server file. No entry files. Just add the Vite plugin and go.
  - icon: ⚡
    title: Native Vite
    details: Works seamlessly with 'vite dev' and 'vite build'.
  - icon: 📡
    title: useAsyncData
    details: Server-side data fetching with automatic client hydration.
  - icon: 🏷️
    title: SEO Ready
    details: Built-in useHead() for meta tag management.
  - icon: 📦
    title: Framework Agnostic
    details: Works with Vuetify, Element Plus, PrimeVue and more.
  - icon: 🚀
    title: Production Ready
    details: Auto-generates an Express server ready for deployment.
---

## Quick Example

```ts
// src/main.ts
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

## Why Vue Easy SSR?

| Feature          | Vue Easy SSR      | Nuxt                | Manual SSR Setup     |
| ---------------- | ----------------- | ------------------- | -------------------- |
| **Setup**        | **Instant**       | Hours               | Days                 |
| **Config**       | **Zero**          | High                | Very High            |
| **Existing SPA** | ✅ Easy migration | ❌ Requires rewrite | ⚠️ Complex migration |
| **Bundle Size**  | ~5KB              | ~100KB+             | Varies               |
| **Control**      | Full control      | Abstracted          | Full control         |
