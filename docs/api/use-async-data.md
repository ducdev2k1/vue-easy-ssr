# useAsyncData

A composable for fetching data on the server and hydrating it on the client. This is the recommended way to fetch data in SSR applications.

## Usage

```vue
<script setup lang="ts">
import { useAsyncData } from "vue-easy-ssr";

const { data, pending, error, refresh } = useAsyncData({
  key: "users",
  handler: async () => {
    const response = await fetch("/api/users");
    return response.json();
  },
});
</script>
```

## Options

### `IAsyncDataOptions<T>`

| Property    | Type               | Required | Description                                       |
| ----------- | ------------------ | -------- | ------------------------------------------------- |
| `key`       | `string`           | ✅       | Unique key for caching and hydration              |
| `handler`   | `() => Promise<T>` | ✅       | Async function that fetches the data              |
| `default`   | `() => T`          | ❌       | Factory function for default value                |
| `lazy`      | `boolean`          | ❌       | If true, don't fetch on server (default: `false`) |
| `immediate` | `boolean`          | ❌       | If false, don't fetch on mount (default: `true`)  |

## Return Value

### `IAsyncDataReturn<T>`

| Property  | Type                  | Description                 |
| --------- | --------------------- | --------------------------- |
| `data`    | `Ref<T>`              | The fetched data (reactive) |
| `pending` | `Ref<boolean>`        | Loading state               |
| `error`   | `Ref<Error \| null>`  | Error if fetch failed       |
| `refresh` | `() => Promise<void>` | Function to re-fetch data   |

## How It Works

```
┌─────────────────┐     ┌─────────────────┐
│   Server Side   │     │   Client Side   │
├─────────────────┤     ├─────────────────┤
│ 1. Call handler │     │ 1. Check cache  │
│ 2. Store result │────▶│ 2. Hydrate data │
│ 3. Serialize    │     │ 3. Skip fetch   │
└─────────────────┘     └─────────────────┘
```

1. **Server**: Calls the handler, stores result in SSR context
2. **HTML**: Result is serialized into `window.__INITIAL_STATE__`
3. **Client**: Reads from initial state, skips the fetch

## Examples

### Basic Fetch

```vue
<script setup lang="ts">
const { data: posts } = useAsyncData({
  key: "posts",
  handler: () => fetch("/api/posts").then((r) => r.json()),
  default: () => [],
});
</script>

<template>
  <div v-for="post in posts" :key="post.id">
    {{ post.title }}
  </div>
</template>
```

### With TypeScript

```vue
<script setup lang="ts">
interface IUser {
  id: number;
  name: string;
  email: string;
}

const {
  data: users,
  pending,
  error,
} = useAsyncData<IUser[]>({
  key: "users",
  handler: async () => {
    const res = await fetch("https://api.example.com/users");
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  },
  default: () => [],
});
</script>
```

### Lazy Loading

```vue
<script setup lang="ts">
// Won't fetch on server, only on client
const { data, refresh } = useAsyncData({
  key: "lazy-data",
  handler: () => fetchExpensiveData(),
  lazy: true,
});
</script>

<template>
  <button @click="refresh">Load Data</button>
</template>
```

### With Route Params

```vue
<script setup lang="ts">
import { useRoute, watch } from "vue-router";

const route = useRoute();

const { data: user, refresh } = useAsyncData({
  key: `user-${route.params.id}`,
  handler: () => fetch(`/api/users/${route.params.id}`).then((r) => r.json()),
});

// Refresh when route changes
watch(() => route.params.id, refresh);
</script>
```

## Best Practices

::: tip Unique Keys
Always use unique keys for each data source. Keys are used for caching and hydration matching.
:::

::: warning Avoid Side Effects
Don't perform side effects in the handler. It should only fetch and return data.
:::
