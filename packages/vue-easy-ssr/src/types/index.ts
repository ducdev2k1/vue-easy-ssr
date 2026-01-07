import type { Pinia } from "pinia";
import type { Component } from "vue";
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
  titleTemplate?: string | ((title: string) => string);
  meta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  link?: Array<{
    rel: string;
    href: string;
  }>;
  script?: Array<{
    src?: string;
    innerHTML?: string;
    type?: string;
  }>;
}

/**
 * NEW: Simplified options for defineEasySSR (Zero-Config API)
 * User chỉ cần pass component và factory functions
 */
export interface IEasySSROptions {
  /** Root Vue component */
  app: Component;

  /** Router factory - được gọi mới cho mỗi request */
  router: () => Router;

  /** Optional Pinia factory - được gọi mới cho mỗi request */
  pinia?: () => Pinia;

  /** Hook to install additional plugins (e.g. Vuetify, i18n) */
  setup?: (app: import("vue").App) => void | Promise<void>;

  /** Optional global head config */
  head?: IHeadConfig;

  /** Mount element selector (default: '#app') */
  el?: string;
}

/**
 * LEGACY: Options for old defineEasySSR API (backward compatibility)
 * @deprecated Use new simplified API instead
 */
export interface IEasySSROptionsLegacy {
  createApp: () => {
    app: import("vue").App;
    router: Router;
    pinia?: Pinia;
  };
  baseUrl?: string;
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

/**
 * Vite Plugin Options
 */
export interface IPluginOptions {
  /** Path to main.ts (auto-detected if not specified) */
  entry?: string;

  /** SSR entry path override */
  ssrEntry?: string;

  /** Output directory for build */
  outDir?: string;

  /** Mount element selector (default: '#app') */
  el?: string;
}
