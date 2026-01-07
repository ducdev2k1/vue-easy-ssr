import type { Ref } from "vue";
import { getCurrentInstance, onServerPrefetch, ref } from "vue";
import type {
  IAsyncDataOptions,
  IAsyncDataReturn,
  ISSRContext,
} from "../types";

/**
 * useAsyncData - Composable for async data fetching with SSR support
 *
 * Fetches data on server and hydrates on client.
 * Data được fetch một lần trên server, serialize vào HTML,
 * và client sẽ sử dụng data đã có sẵn thay vì fetch lại.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useAsyncData } from 'vue-easy-ssr'
 *
 * // Fetch user data - runs on server, hydrates on client
 * const { data: user, pending, error } = await useAsyncData({
 *   key: 'user',
 *   handler: () => fetch('/api/user').then(r => r.json())
 * })
 * </script>
 * ```
 *
 * @param options - Configuration options
 * @returns Reactive data, pending state, error, and refresh function
 */
export const useAsyncData = <T>(
  options: IAsyncDataOptions<T>
): IAsyncDataReturn<T> => {
  const {
    key,
    handler,
    default: defaultValue,
    server = true,
    lazy = false,
    transform,
  } = options;

  // Reactive state
  const data: Ref<T | null> = ref(defaultValue?.() ?? null) as Ref<T | null>;
  const pending = ref(false);
  const error: Ref<Error | null> = ref(null);

  // Get current Vue instance
  const instance = getCurrentInstance();

  // Get SSR context if available (server-side)
  const ssrContext = instance?.appContext.app.runWithContext(() => {
    try {
      return instance.appContext.config.globalProperties.$ssrContext as
        | ISSRContext
        | undefined;
    } catch {
      return undefined;
    }
  });

  // Check if we're on the server
  const isServer = typeof window === "undefined";

  // Check if data is already hydrated (client-side)
  const getHydratedData = (): T | undefined => {
    if (isServer) return undefined;

    const initialState = (
      window as Window & {
        __INITIAL_STATE__?: { asyncData?: Record<string, unknown> };
      }
    ).__INITIAL_STATE__;
    if (initialState?.asyncData?.[key] !== undefined) {
      return initialState.asyncData[key] as T;
    }
    return undefined;
  };

  // Fetch function
  const fetchData = async (): Promise<void> => {
    pending.value = true;
    error.value = null;

    try {
      let result: Awaited<T> = await handler();

      // Apply transform if provided
      if (transform) {
        result = transform(result);
      }

      data.value = result as T;

      // Store in SSR context for hydration
      if (isServer && ssrContext) {
        ssrContext.asyncData[key] = result;
      }
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));

      // Store error in SSR context
      if (isServer && ssrContext) {
        ssrContext.error = error.value;
      }
    } finally {
      pending.value = false;
    }
  };

  // Refresh function (for client-side refetching)
  const refresh = async (): Promise<void> => {
    await fetchData();
  };

  // Server-side: fetch during SSR
  if (isServer && server) {
    onServerPrefetch(async () => {
      await fetchData();
    });
  }

  // Client-side: check for hydrated data or fetch
  if (!isServer) {
    const hydratedData = getHydratedData();

    if (hydratedData !== undefined) {
      // Use hydrated data from SSR
      data.value = hydratedData;
    } else if (!lazy) {
      // No hydrated data and not lazy, fetch immediately
      // Note: This will be async, caller should await if needed
      fetchData();
    }
  }

  return {
    data,
    pending,
    error,
    refresh,
  };
};
