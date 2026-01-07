# useHead

A composable for managing document head and meta tags. Essential for SEO in SSR applications.

::: info
Vue Easy SSR re-exports `useHead` from [@vueuse/head](https://github.com/vueuse/head). All features from that library are available.
:::

## Usage

```vue
<script setup lang="ts">
import { useHead } from "vue-easy-ssr";

useHead({
  title: "My Page Title",
  meta: [
    { name: "description", content: "Page description for SEO" },
    { property: "og:title", content: "My Page Title" },
  ],
});
</script>
```

## Options

### Basic Properties

| Property        | Type                                    | Description                   |
| --------------- | --------------------------------------- | ----------------------------- | ----------- |
| `title`         | `string`                                | Document title                |
| `titleTemplate` | `string \| ((title: string) => string)` | Template for title (e.g., `%s | Site Name`) |
| `meta`          | `MetaObject[]`                          | Array of meta tags            |
| `link`          | `LinkObject[]`                          | Array of link tags            |
| `script`        | `ScriptObject[]`                        | Array of script tags          |
| `style`         | `StyleObject[]`                         | Array of style tags           |

### Meta Object

```ts
interface MetaObject {
  name?: string;
  property?: string;
  content?: string;
  charset?: string;
  httpEquiv?: string;
}
```

## Examples

### Basic SEO

```vue
<script setup lang="ts">
useHead({
  title: "Product Details",
  meta: [
    { name: "description", content: "Buy this amazing product..." },
    { name: "keywords", content: "product, shop, buy" },
  ],
});
</script>
```

### Open Graph (Social Sharing)

```vue
<script setup lang="ts">
useHead({
  title: "My Blog Post",
  meta: [
    { property: "og:title", content: "My Blog Post" },
    { property: "og:description", content: "An interesting article about..." },
    { property: "og:image", content: "https://example.com/image.jpg" },
    { property: "og:url", content: "https://example.com/blog/post" },
    { property: "og:type", content: "article" },
  ],
});
</script>
```

### Twitter Cards

```vue
<script setup lang="ts">
useHead({
  meta: [
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "My Page" },
    { name: "twitter:description", content: "Description here" },
    { name: "twitter:image", content: "https://example.com/image.jpg" },
  ],
});
</script>
```

### Title Template

```vue
<script setup lang="ts">
// In App.vue or layout
useHead({
  titleTemplate: "%s | Vue Easy SSR",
});

// In page component
useHead({
  title: "Home", // Renders as "Home | Vue Easy SSR"
});
</script>
```

### Dynamic/Reactive Head

```vue
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ product: IProduct }>();

useHead({
  title: computed(() => props.product.name),
  meta: [
    {
      name: "description",
      content: computed(() => props.product.description),
    },
  ],
});
</script>
```

### Canonical URL

```vue
<script setup lang="ts">
useHead({
  link: [{ rel: "canonical", href: "https://example.com/page" }],
});
</script>
```

## SEO Patterns

### Product Page

```vue
<script setup lang="ts">
const product = {
  /* from API */
};

useHead({
  title: product.name,
  titleTemplate: "%s | MyShop",
  meta: [
    { name: "description", content: product.shortDescription },
    // Open Graph
    { property: "og:title", content: product.name },
    { property: "og:description", content: product.shortDescription },
    { property: "og:image", content: product.image },
    { property: "og:type", content: "product" },
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    // Product price (optional)
    { property: "product:price:amount", content: product.price },
    { property: "product:price:currency", content: "USD" },
  ],
});
</script>
```

### Blog Article

```vue
<script setup lang="ts">
const article = {
  /* from API */
};

useHead({
  title: article.title,
  meta: [
    { name: "description", content: article.excerpt },
    { name: "author", content: article.author.name },
    { property: "og:type", content: "article" },
    { property: "article:published_time", content: article.publishedAt },
    { property: "article:author", content: article.author.name },
    { property: "article:tag", content: article.tags.join(", ") },
  ],
});
</script>
```

## Verify SSR Rendering

To verify your meta tags are server-rendered:

1. Open your page in browser
2. Right-click → **View Page Source** (Ctrl+U)
3. Check the `<head>` section for your meta tags

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page | Vue Easy SSR</title>
    <meta name="description" content="..." />
    <meta property="og:title" content="..." />
    <!-- Your tags should appear here! -->
  </head>
</html>
```
