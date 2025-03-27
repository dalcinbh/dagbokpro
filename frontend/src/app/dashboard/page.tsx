/**
 * Dashboard Page
 * Displays logged-in user information and statistics
 */

'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, Users, FileText, Calendar } from 'lucide-react';

/**
 * Main Dashboard Page
 */
export default function DashboardPage() {
  const { data: session } = useSession();
  const { t, isLoading } = useTranslation(['dashboard', 'common']);
  const user = session?.user;

  // Stats data (in a real app, this would come from an API)
  const stats = {
    totalPosts: 0,
    totalDrafts: 0,
    totalPublished: 0,
    totalTranscriptions: 0,
  };

  // Show loading state while translations are loading
  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4">Loading...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('dashboard:greeting', { name: user?.name || user?.email?.split('@')[0] || t('dashboard:user') })}
            </h1>
            <p className="text-muted-foreground">
              {t('dashboard:subtitle')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/blog/new">
                <FilePlus className="mr-2 h-4 w-4" />
                {t('dashboard:createNewPost')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard:totalPosts')}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard:totalDrafts')}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDrafts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard:totalPublished')}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPublished}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard:totalTranscriptions')}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTranscriptions}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard:quickActions')}</CardTitle>
              <CardDescription>
                {t('dashboard:quickActionsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/blog/new" className="flex items-center">
                    <FilePlus className="mr-2 h-4 w-4" />
                    {t('dashboard:createNewPost')}
                  </Link>
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/transcriptions/new" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    {t('dashboard:createNewTranscription')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 