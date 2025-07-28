'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { SWRConfig } from 'swr';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <SWRConfig
        value={{
          refreshInterval: 0,
          revalidateOnFocus: false,
          revalidateOnReconnect: true,
          shouldRetryOnError: false,
          errorRetryCount: 3,
          errorRetryInterval: 5000,
          onError: (error) => {
            console.error('SWR Error:', error);
          },
        }}
      >
        {children}
      </SWRConfig>
    </Provider>
  );
}
