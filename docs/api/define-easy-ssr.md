# defineEasySSR

The main configuration API for Vue Easy SSR. This function creates an SSR instance that provides methods for both client and server rendering.

## Usage

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

## Options

### `IEasySSROptions`

| Property    | Type                     | Required | Description                                                    |
| ----------- | ------------------------ | -------- | -------------------------------------------------------------- |
| `createApp` | `() => ICreateAppReturn` | ✅       | Factory function that creates and returns the Vue app instance |

### `ICreateAppReturn`

| Property | Type           | Required | Description                                                |
| -------- | -------------- | -------- | ---------------------------------------------------------- |
| `app`    | `App<Element>` | ✅       | The Vue application instance (created with `createSSRApp`) |
| `router` | `Router`       | ✅       | The Vue Router instance                                    |
| `pinia`  | `Pinia`        | ❌       | Optional Pinia store instance                              |

## Return Value

### `IEasySSRInstance`

```ts
interface IEasySSRInstance {
  createClientApp(): Promise<ICreateAppReturn>;
  createServerApp(
    url: string
  ): Promise<ICreateAppReturn & { ctx: ISSRContext }>;
}
```

| Method                 | Description                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `createClientApp()`    | Creates the app for client-side hydration. Restores initial state from `window.__INITIAL_STATE__` |
| `createServerApp(url)` | Creates the app for server-side rendering. Navigates to the given URL and creates the SSR context |

## Example: Entry Files

### entry-client.ts

```ts
import { ssr } from "./main";

async function bootstrap() {
  const { app, router } = await ssr.createClientApp();

  // Wait for router to be ready
  await router.isReady();

  // Mount the app
  app.mount("#app");
}

bootstrap();
```

### entry-server.ts

```ts
import { ssr } from "./main";
import { renderToString, generateHtml } from "vue-easy-ssr/server";

export async function render(url: string, template: string): Promise<string> {
  const { app, router, ctx } = await ssr.createServerApp(url);

  await router.isReady();

  const result = await renderToString(app, ctx);
  return generateHtml(template, result);
}
```

## TypeScript

```ts
import type { IEasySSROptions, IEasySSRInstance } from "vue-easy-ssr";
```
