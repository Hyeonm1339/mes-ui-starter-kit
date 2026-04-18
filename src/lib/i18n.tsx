import i18n, { type Resource } from 'i18next'
import { initReactI18next, I18nextProvider } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import type { ReactNode } from 'react'

const koModules = import.meta.glob('../locales/ko/*.json', { eager: true })
const enModules = import.meta.glob('../locales/en/*.json', { eager: true })

const resources: Resource = { ko: {}, en: {} }

Object.entries(koModules).forEach(([path, mod]) => {
  const ns = path.match(/\/([^/]+)\.json$/)?.[1] ?? 'common'
  resources.ko[ns] = (mod as { default: Record<string, unknown> }).default
})

Object.entries(enModules).forEach(([path, mod]) => {
  const ns = path.match(/\/([^/]+)\.json$/)?.[1] ?? 'common'
  resources.en[ns] = (mod as { default: Record<string, unknown> }).default
})

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: 'common',
    fallbackLng: 'ko',
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'i18n-lang',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export const I18nProvider = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)

export default i18n
