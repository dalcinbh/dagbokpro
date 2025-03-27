/**
 * Componente de Navegação Principal
 * Exibe menu de navegação para páginas autenticadas com opção de logout
 * Responsivo para desktop e mobile
 */

'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const { t } = useTranslation('common');

  /**
   * Toggle do menu mobile
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  /**
   * Toggle do menu dropdown de produto
   */
  const toggleProductMenu = () => {
    setProductMenuOpen(!productMenuOpen);
  };

  /**
   * Função para realizar logout
   */
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/dashboard" className="-m-1.5 p-1.5">
            <span className="sr-only">{t('appName')}</span>
            <Image 
              className="h-8 w-auto" 
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" 
              alt={`${t('appName')} Logo`}
              width={32}
              height={32}
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button 
            type="button" 
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">{t('toggleMenu')}</span>
            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <div className="relative">
            <button 
              type="button" 
              className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900" 
              aria-expanded={productMenuOpen}
              onClick={toggleProductMenu}
            >
              {t('nav.blog')}
              <svg className="size-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>

            {productMenuOpen && (
              <div className="absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white ring-1 shadow-lg ring-gray-900/5">
                <div className="p-4">
                  <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50">
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <svg className="size-6 text-gray-600 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                      </svg>
                    </div>
                    <div className="flex-auto">
                      <Link href="/blog" className="block font-semibold text-gray-900">
                        {t('nav.posts')}
                        <span className="absolute inset-0"></span>
                      </Link>
                      <p className="mt-1 text-gray-600">{t('navigation.viewAllPosts')}</p>
                    </div>
                  </div>

                  <div className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50">
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <svg className="size-6 text-gray-600 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <div className="flex-auto">
                      <Link href="/blog/novo" className="block font-semibold text-gray-900">
                        {t('nav.newPost')}
                        <span className="absolute inset-0"></span>
                      </Link>
                      <p className="mt-1 text-gray-600">{t('navigation.createNewPost')}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                  <Link href="/dashboard" className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100">
                    <svg className="size-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                      <path fillRule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm6.39-2.908a.75.75 0 0 1 .766.027l3.5 2.25a.75.75 0 0 1 0 1.262l-3.5 2.25A.75.75 0 0 1 8 12.25v-4.5a.75.75 0 0 1 .39-.658Z" clipRule="evenodd" />
                    </svg>
                    {t('nav.dashboard')}
                  </Link>
                  <Link href="/transcricoes" className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100">
                    <svg className="size-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                      <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
                    </svg>
                    {t('nav.transcriptions')}
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/transcricoes" className="text-sm/6 font-semibold text-gray-900">
            {t('nav.transcriptions')}
          </Link>
          <Link href="/dashboard" className="text-sm/6 font-semibold text-gray-900">
            {t('nav.dashboard')}
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button 
            onClick={handleLogout} 
            className="text-sm/6 font-semibold text-gray-900"
          >
            {t('common.logout')} <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </nav>
      
      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-10"></div>
          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="-m-1.5 p-1.5">
                <span className="sr-only">{t('appName')}</span>
                <Image 
                  className="h-8 w-auto" 
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" 
                  alt={`${t('appName')} Logo`}
                  width={32}
                  height={32}
                />
              </Link>
              <button 
                type="button" 
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">{t('common.close')}</span>
                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <div className="-mx-3">
                    <button 
                      type="button" 
                      className="flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      aria-controls="disclosure-1" 
                      aria-expanded={productMenuOpen}
                      onClick={toggleProductMenu}
                    >
                      {t('nav.blog')}
                      <svg 
                        className={`size-5 flex-none ${productMenuOpen ? 'rotate-180' : ''}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor" 
                        aria-hidden="true" 
                        data-slot="icon"
                      >
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {productMenuOpen && (
                      <div className="mt-2 space-y-2" id="disclosure-1">
                        <Link 
                          href="/blog" 
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t('nav.posts')}
                        </Link>
                        <Link 
                          href="/blog/novo" 
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t('nav.newPost')}
                        </Link>
                      </div>
                    )}
                  </div>
                  <Link 
                    href="/transcricoes" 
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.transcriptions')}
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.dashboard')}
                  </Link>
                </div>
                <div className="py-6">
                  <button 
                    onClick={handleLogout}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 w-full text-left"
                  >
                    {t('common.logout')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 