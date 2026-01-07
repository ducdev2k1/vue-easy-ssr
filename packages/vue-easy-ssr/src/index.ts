/**
 * vue-easy-ssr
 *
 * Easy SSR for Vue 3 applications.
 * Enable Server-Side Rendering in under 15 minutes.
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
  ISSRContext,
  ISSRRenderResult,
} from "./types";

// Context utilities (for advanced usage)
export { SSR_CONTEXT_KEY, createSSRContext } from "./core/context";
