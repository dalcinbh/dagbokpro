/**
 * Dashboard page component
 * Shows user information and application stats
 */

import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, Users, FileText, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { t } = useTranslation(['common', 'dashboard']);
  const loading = status === 'loading';

  // Stats data (in a real app, this would come from an API)
  const stats = {
    totalPosts: 5,
    totalDrafts: 2,
    totalPublished: 3,
    totalTranscriptions: 8,
  };

  const recentPosts = []; // This would be populated from the API
  const recentTranscriptions = []; // This would be populated from the API

  if (loading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <p className="text-lg">{t('common:common.loading')}</p>
        </div>
      </Layout>
    );
  }

  // Get user's name or fallback to email username
  const userName = session?.user?.name || (session?.user?.email?.split('@')[0] || t('dashboard:user'));

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="mb-8 flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('dashboard:greeting', { name: userName })}
          </h1>
          <div className="flex space-x-2">
            <Button asChild>
              <Link href="/dashboard/posts/new" className="flex items-center space-x-2">
                <FilePlus className="h-4 w-4" />
                <span>{t('dashboard:createNewPost')}</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard:totalPosts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{stats.totalPosts}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard:totalDrafts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{stats.totalDrafts}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard:totalPublished')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{stats.totalPublished}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard:totalTranscriptions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">{stats.totalTranscriptions}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t('dashboard:recentPosts')}</h2>
            <Link href="/dashboard/posts" className="text-sm text-primary hover:underline">
              {t('dashboard:viewAll')}
            </Link>
          </div>
          <div className="rounded-lg border">
            {recentPosts.length > 0 ? (
              <div>
                {/* Post list would go here */}
                <p>Post list placeholder</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <FileText className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="mb-4 text-lg font-medium">{t('dashboard:noPosts')}</p>
                <Button asChild>
                  <Link href="/dashboard/posts/new">{t('dashboard:createNewPost')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transcriptions */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t('dashboard:recentTranscriptions')}</h2>
            <Link href="/dashboard/transcriptions" className="text-sm text-primary hover:underline">
              {t('dashboard:viewAll')}
            </Link>
          </div>
          <div className="rounded-lg border">
            {recentTranscriptions.length > 0 ? (
              <div>
                {/* Transcription list would go here */}
                <p>Transcription list placeholder</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Users className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="mb-4 text-lg font-medium">{t('dashboard:noTranscriptions')}</p>
                <Button asChild>
                  <Link href="/dashboard/transcriptions/new">{t('dashboard:createNewTranscription')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { locale } = context;

  // Redirect to login if no session exists
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      ...(await serverSideTranslations(locale || 'en', ['common', 'dashboard'])),
    },
  };
}; 