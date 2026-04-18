import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { store } from '@/store'
import { I18nProvider } from '@/lib/i18n'
import { ThemeProvider } from '@/lib/theme'
import { ZoomProvider } from '@/lib/zoom'
import App from './App'
import '@hyeonm1339/mes-ui-kit/lib/style.css'
import './index.css'
import { installThemeOverride } from '@/lib/themeOverride'

installThemeOverride()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ZoomProvider>
            <I18nProvider>
              <App />
            </I18nProvider>
          </ZoomProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
