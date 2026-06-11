import { QueryClient } from '@tanstack/react-query';

export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,       // 5 min — don't re-fetch fresh data
      gcTime: 30 * 60 * 1000,          // 30 min — keep in memory
      refetchOnMount: false,            // don't re-fetch if data is still fresh
    },
  },
});