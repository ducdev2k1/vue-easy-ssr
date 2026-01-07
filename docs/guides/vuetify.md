# Vuetify Integration

This guide shows how to integrate Vue Easy SSR with Vuetify 3.

## Installation

```bash
pnpm add vuetify @mdi/font
pnpm add -D vite-plugin-vuetify
```

## Setup

### 1. Create Vuetify Plugin

```ts
// src/plugins/vuetify.ts
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export function createVuetifyInstance() {
  return createVuetify({
    components,
    directives,
    ssr: true, // Enable SSR mode
    theme: {
      defaultTheme: "dark",
    },
  });
}
```

### 2. Update main.ts

```ts
// src/main.ts
import { createSSRApp } from "vue";
import { createPinia } from "pinia";
import { defineEasySSR } from "vue-easy-ssr";
import App from "./App.vue";
import { createRouter } from "./router";
import { createVuetifyInstance } from "./plugins/vuetify";

export const ssr = defineEasySSR({
  createApp: () => {
    const app = createSSRApp(App);
    const router = createRouter();
    const pinia = createPinia();
    const vuetify = createVuetifyInstance();

    app.use(router);
    app.use(pinia);
    app.use(vuetify);

    return { app, router, pinia };
  },
});
```

### 3. Update Vite Config

```ts
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
});
```

### 4. Update entry-server.ts

For Vuetify SSR, you need to collect and inject styles:

```ts
// src/entry-server.ts
import { ssr } from "./main";
import { renderToString, generateHtml } from "vue-easy-ssr/server";
import { useSSRContext } from "vue";

export async function render(url: string, template: string): Promise<string> {
  const { app, router, ctx } = await ssr.createServerApp(url);

  await router.isReady();

  const result = await renderToString(app, ctx);

  // Vuetify styles are automatically handled by vite-plugin-vuetify
  return generateHtml(template, result);
}
```

## Example Component

```vue
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>SSR with Vuetify</v-card-title>
          <v-card-text>
            This content is server-rendered with Vuetify styles!
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="count++"> Count: {{ count }} </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
const count = ref(0);
</script>
```

## Dark Theme

Vuetify's dark theme works seamlessly with SSR:

```ts
// src/plugins/vuetify.ts
export function createVuetifyInstance() {
  return createVuetify({
    ssr: true,
    theme: {
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            primary: "#667eea",
            secondary: "#764ba2",
          },
        },
      },
    },
  });
}
```

## Known Issues

::: warning Hydration Mismatch
If you see hydration mismatch warnings, ensure:

1. `createVuetify()` is called fresh for each request (not cached)
2. Server and client use the same theme configuration
   :::

::: tip Performance
Use `vite-plugin-vuetify` with `autoImport: true` to automatically tree-shake unused components.
:::
