# defineEasySSR

The main configuration API for Vue Easy SSR. Use this function in your `main.ts` to define your application structure.

## Usage

```ts
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

## Options

### `IEasySSROptions`

| Property | Type                    | Required | Description                                         |
| -------- | ----------------------- | -------- | --------------------------------------------------- |
| `app`    | `Component`             | ✅       | The root Vue component (e.g. `App.vue`)             |
| `router` | `() => Router`          | ✅       | Factory function that returns a Vue Router instance |
| `pinia`  | `() => Pinia`           | ❌       | Factory function that returns a Pinia instance      |
| `setup`  | `(app) => void/Promise` | ❌       | Hook to install plugins (Vuetify, i18n, etc.)       |
| `el`     | `string`                | ❌       | Mount selector (default: `#app`)                    |

### Example: Using Plugins (Vuetify, i18n)

```ts
import { createVuetify } from 'vuetify';
import { createI18n } from 'vue-i18n';

export default defineEasySSR({
  app: App,
  router: createRouter,
  pinia: createPinia,
  setup(app) {
    // Install Vuetify
    const vuetify = createVuetify({ ssr: true });
    app.use(vuetify);

    // Install i18n
    const i18n = createI18n({ ... });
    app.use(i18n);
  }
});
```

## Internal Behavior

`defineEasySSR` returns an internal instance used by the `vue-easy-ssr` Vite plugin. You generally don't need to interact with the return value directly.

- **Client Side**: Automatically creating the app, restoring state from `window.__INITIAL_STATE__`, and mounting it.
- **Server Side**: Automatically creating the app, handling routing, and managing SSR context.
