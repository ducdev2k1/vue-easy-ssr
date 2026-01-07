/**
 * vue-easy-ssr
 *
 * Zero-Config SSR for Vue 3 applications.
 * Build once → Deploy → Run immediately.
 *
 * @packageDocumentation
 */

// Core API
export { defineEasySSR } from "./core/defineEasySSR";
export type { IEasySSRInstance } from "./core/defineEasySSR";

// Composables
export { useAsyncData } from "./composables/useAsyncData";

// Re-export @vueuse/head
export { createHead, useHead } from "@vueuse/head";

// Types
export type {
  IAsyncDataOptions,
  IAsyncDataReturn,
  IEasySSROptions,
  IHeadConfig,
  IPluginOptions,
  ISSRContext,
  ISSRRenderResult,
} from "./types";

// Context utilities (for advanced usage)
export { createSSRContext, SSR_CONTEXT_KEY } from "./core/context";
