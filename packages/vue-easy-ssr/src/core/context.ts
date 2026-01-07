import type { ISSRContext } from "../types";

/**
 * SSR Context Manager
 * Quản lý SSR context cho cả server và client
 */

// Symbol key for SSR context injection
export const SSR_CONTEXT_KEY = Symbol("ssr-context");

/**
 * Create a new SSR context
 * Tạo context mới cho mỗi request SSR
 */
export const createSSRContext = (url: string): ISSRContext => ({
  asyncData: {},
  head: undefined,
  piniaState: undefined,
  url,
  error: null,
});
