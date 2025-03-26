/**
 * Homepage component
 * Displays welcome message and main features in user's selected language
 */

'use client';

import { useTranslation } from '@/i18n';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarDays, Edit, Globe, Users } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

export default function HomePage() {
  const { t } = useTranslation('common');

  const features = [
    {
      icon: <Edit className="h-10 w-10 text-primary" />,
      title: t('features.blog.title'),
      description: t('features.blog.description'),
    },
    {
      icon: <CalendarDays className="h-10 w-10 text-primary" />,
      title: t('features.journal.title'),
      description: t('features.journal.description'),
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: t('features.multilingual.title'),
      description: t('features.multilingual.description'),
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: t('features.social.title'),
      description: t('features.social.description'),
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <section className="relative">
        <div className="container mx-auto px-4 py-16 text-center lg:py-32">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t('appName')}
          </h1>
          <p className="mt-4 text-xl text-muted-foreground sm:text-2xl">
            {t('homepage.welcome')} - {t('homepage.subtitle')}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">{t('nav.dashboard')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/api/auth/signin">{t('auth.login')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            {t('homepage.features')}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm"
              >
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-medium">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multilingual section */}
      <section className="py-16">
        <div className="container mx-auto flex flex-col items-center px-4 text-center">
          <h2 className="mb-8 text-3xl font-bold tracking-tight">
            {t('homepage.multipleLanguages')}
          </h2>
          <p className="mb-10 max-w-2xl text-xl text-muted-foreground">
            {t('homepage.languageDescription')}
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center space-x-2">
              <div className="relative h-12 w-16 overflow-hidden rounded">
                <Image
                  src="/flags/us.svg"
                  alt="US Flag"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <span className="text-lg font-medium">{t('language.english')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative h-12 w-16 overflow-hidden rounded">
                <Image
                  src="/flags/br.svg"
                  alt="Brazil Flag"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <span className="text-lg font-medium">{t('language.portuguese')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative h-12 w-16 overflow-hidden rounded">
                <Image
                  src="/flags/se.svg"
                  alt="Sweden Flag"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <span className="text-lg font-medium">{t('language.swedish')}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}