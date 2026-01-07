import type { Pinia } from "pinia";
import type { App } from "vue";
import type { Router } from "vue-router";

/**
 * SSR Context - Shared state between server and client during SSR
 * Chứa toàn bộ dữ liệu cần thiết để hydrate app phía client
 */
export interface ISSRContext {
  // Async data fetched during SSR
  asyncData: Record<string, unknown>;

  // Head instance from @vueuse/head
  head?: unknown;

  // Pinia state for hydration
  piniaState?: Record<string, unknown>;

  // Current route path
  url: string;

  // Any SSR errors
  error?: Error | null;
}

/**
 * Head configuration for SEO meta tags (compatible with @vueuse/head)
 */
export interface IHeadConfig {
  title?: string;
  titleTemplate?: string;
  meta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  link?: Array<{
    rel: string;
    href: string;
  }>;
}

/**
 * Options for defineEasySSR
 * Cấu hình chính cho vue-easy-ssr
 */
export interface IEasySSROptions {
  // Function to create the Vue app
  createApp: () => {
    app: App;
    router: Router;
    pinia?: Pinia;
  };

  // Base URL for the app
  baseUrl?: string;

  // Transform HTML before sending to client
  transformHtml?: (html: string, ctx: ISSRContext) => string | Promise<string>;
}

/**
 * Options for useAsyncData composable
 */
export interface IAsyncDataOptions<T> {
  // Unique key for caching the data
  key: string;

  // Function to fetch the data
  handler: () => T | Promise<T>;

  // Default value while loading
  default?: () => T;

  // Whether to fetch on server (default: true)
  server?: boolean;

  // Whether to fetch on client if not cached (default: true)
  lazy?: boolean;

  // Transform the data after fetching
  transform?: (data: Awaited<T>) => Awaited<T>;

  // Watch sources to re-fetch
  watch?: unknown[];
}

/**
 * Return type of useAsyncData
 */
export interface IAsyncDataReturn<T> {
  data: import("vue").Ref<T | null>;
  pending: import("vue").Ref<boolean>;
  error: import("vue").Ref<Error | null>;
  refresh: () => Promise<void>;
}

/**
 * Render result from SSR
 */
export interface ISSRRenderResult {
  html: string;
  ctx: ISSRContext;
}
