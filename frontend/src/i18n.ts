/**
 * i18n configuration for App Router
 * Uses a client-side only approach with cookies
 */

import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import { useEffect, useState } from 'react';

// Cookie name for storing locale (must match middleware)
export const COOKIE_NAME = 'NEXT_LOCALE';

// Default language
export const DEFAULT_LOCALE = 'en';

// Supported languages
export const LOCALES = ['en', 'pt', 'sv'];

// Default namespaces
const defaultNS = 'common';
const allNamespaces = ['common', 'dashboard', 'blog', 'transcriptions'];

/**
 * Get current language from cookie or localStorage
 */
function getLanguage(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }
  
  // First try cookie
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${COOKIE_NAME}=`))
    ?.split('=')[1];
    
  if (cookieValue && LOCALES.includes(cookieValue)) {
    return cookieValue;
  }
  
  // Then try localStorage
  const localStorageValue = localStorage.getItem(COOKIE_NAME);
  if (localStorageValue && LOCALES.includes(localStorageValue)) {
    return localStorageValue;
  }
  
  // Fallback to browser language if supported
  const browserLang = navigator.language.split('-')[0];
  if (LOCALES.includes(browserLang)) {
    return browserLang;
  }
  
  // Default fallback
  return DEFAULT_LOCALE;
}

// Initialize i18next instances cache
const i18nInstancesCache = new Map();

/**
 * Initialize i18next instance on client
 */
export async function initI18next(ns: string | string[] = defaultNS) {
  if (typeof window === 'undefined') 
    return { 
      t: (key: string) => key, 
      i18n: {
        language: DEFAULT_LOCALE,
        changeLanguage: () => Promise.resolve(),
      }
    };
  
  const lng = getLanguage();
  
  // Build a cache key based on language and namespace
  const cacheKey = `${lng}|${Array.isArray(ns) ? ns.join(',') : ns}`;
  
  // Check if we already have this instance in cache
  if (i18nInstancesCache.has(cacheKey)) {
    return i18nInstancesCache.get(cacheKey);
  }
  
  // Create new instance
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      debug: process.env.NODE_ENV === 'development',
      lng,
      ns: Array.isArray(ns) ? ns : [ns],
      defaultNS,
      fallbackNS: defaultNS,
      fallbackLng: DEFAULT_LOCALE,
      interpolation: {
        escapeValue: false,
      },
      load: 'languageOnly',
      react: {
        useSuspense: false,
      },
      // Ensure resources are loaded before initialization
      initImmediate: false,
    });

  // Wait for translations to be loaded
  await Promise.all(
    (Array.isArray(ns) ? ns : [ns]).map(namespace =>
      i18nInstance.loadNamespaces(namespace)
    )
  );

  const instance = {
    t: i18nInstance.getFixedT(lng, ns),
    i18n: i18nInstance,
  };
  
  // Cache the instance
  i18nInstancesCache.set(cacheKey, instance);
  
  return instance;
}

/**
 * Hook to use translations in client components
 */
export function useTranslation(ns: string | string[] = defaultNS) {
  const [instance, setInstance] = useState<any>({
    t: (key: string) => key,
    i18n: {
      language: DEFAULT_LOCALE,
      changeLanguage: () => Promise.resolve(),
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const i18nInstance = await initI18next(ns);
        if (isMounted) {
          setInstance(i18nInstance);
        }
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [ns]);

  return { ...instance, isLoading };
} 