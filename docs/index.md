---
layout: home

hero:
  name: Vue Easy SSR
  text: SSR in 15 Minutes
  tagline: The simplest way to add Server-Side Rendering to your Vue 3 + Vite application
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/ducdev2k1/vue-easy-ssr

features:
  - icon: 🎯
    title: Simple API
    details: Just use defineEasySSR() to configure your app. No complex setup required.
  - icon: ⚡
    title: Vite Plugin
    details: Seamless integration with Vite for the best development experience.
  - icon: 📡
    title: useAsyncData
    details: Server-side data fetching with automatic client hydration.
  - icon: 🏷️
    title: SEO Ready
    details: Built-in useHead() for meta tag management.
  - icon: 📦
    title: Framework Agnostic
    details: Works with Vuetify, Element Plus, PrimeVue and more.
  - icon: 🪶
    title: Lightweight
    details: Minimal dependencies, no magic, just works.
---

## Quick Example

```ts
import { defineEasySSR } from "vue-easy-ssr";

export const ssr = defineEasySSR({
  createApp: () => {
    const app = createSSRApp(App);
    const router = createRouter();
    const pinia = createPinia();

    app.use(router).use(pinia);
    return { app, router, pinia };
  },
});
```

## Why Vue Easy SSR?

| Feature        | Vue Easy SSR      | Nuxt                |
| -------------- | ----------------- | ------------------- |
| Setup Time     | ~15 minutes       | Hours               |
| Learning Curve | Minimal           | Steep               |
| Existing SPA   | ✅ Easy migration | ❌ Requires rewrite |
| Bundle Size    | ~5KB              | ~100KB+             |
| SSR Control    | Full control      | Abstracted          |
