/**
 * LanguageSelector component
 * Allows users to switch between available languages
 */

'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Loader2 } from 'lucide-react';
import { COOKIE_NAME, LOCALES } from '@/i18n';

// Language data with flag images
const languages = {
  en: {
    name: 'English',
    flag: '/flags/en.svg',
    alt: 'English flag',
  },
  pt: {
    name: 'Português',
    flag: '/flags/pt.svg',
    alt: 'Portuguese flag',
  },
  sv: {
    name: 'Svenska',
    flag: '/flags/sv.svg',
    alt: 'Swedish flag',
  },
};

export default function LanguageSelector() {
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize with the current language on mount
  useEffect(() => {
    // Get from cookie or localStorage
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };
    
    const cookieLang = getCookie(COOKIE_NAME);
    const localStorageLang = typeof localStorage !== 'undefined' ? localStorage.getItem(COOKIE_NAME) : null;
    
    const lang = (cookieLang || localStorageLang || 'en') as keyof typeof languages;
    setCurrentLocale(LOCALES.includes(lang as string) ? lang as string : 'en');
    setIsLoading(false);
  }, []);

  // Change language handler
  const changeLanguage = (locale: string) => {
    setIsLoading(true);
    
    // Set cookie
    document.cookie = `${COOKIE_NAME}=${locale}; path=/; max-age=31536000`; // 1 year
    
    // Also store in localStorage as backup
    if (typeof window !== 'undefined') {
      localStorage.setItem(COOKIE_NAME, locale);
    }
    
    // Update state
    setCurrentLocale(locale);
    
    // Reload the page to fully apply language change
    window.location.reload();
  };

  const currentLanguage = languages[currentLocale as keyof typeof languages] || languages.en;

  // Show loading state
  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="sr-only">Loading...</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <div className="relative h-5 w-5 overflow-hidden rounded-sm">
            <Image
              src={currentLanguage.flag}
              alt={currentLanguage.alt}
              width={20}
              height={20}
              className="object-cover"
              priority
            />
          </div>
          <span className="hidden md:inline">{currentLanguage.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="z-[60] bg-white" 
        sideOffset={8}
      >
        {LOCALES.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => changeLanguage(code)}
            className={`flex cursor-pointer items-center gap-2 p-2 ${
              currentLocale === code ? 'bg-accent' : ''
            }`}
          >
            <div className="relative h-5 w-5 overflow-hidden rounded-sm">
              <Image
                src={languages[code as keyof typeof languages].flag}
                alt={languages[code as keyof typeof languages].alt}
                width={20}
                height={20}
                className="object-cover"
                priority
              />
            </div>
            <span>{languages[code as keyof typeof languages].name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 