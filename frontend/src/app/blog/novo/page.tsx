'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';

const categories = [
  'Carta de Apresentação',
  'Experiências Profissionais',
  'Projetos Open Source',
  'Formação Acadêmica',
  'Habilidades Técnicas',
  'Certificações',
  'Idiomas',
  'Trabalho Voluntário',
  'Premiações',
  'Cursos Livres',
  'Publicações',
  'Participações em Eventos',
  'Startups Fundadas',
  'Atuação como Mentor',
  'Participação em Comunidades',
  'Portfólio Visual',
  'Soft Skills',
  'Ferramentas e Tecnologias',
  'Interesses Profissionais',
  'Objetivos de Carreira'
];

const postSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  category: z.enum(categories as [string, ...string[]]),
  content: z.string().min(10, 'O conteúdo deve ter pelo menos 10 caracteres')
});

type PostFormData = z.infer<typeof postSchema>;

export default function NewPostPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema)
  });
  const { t } = useTranslation();

  const onSubmit = async (data: PostFormData) => {
    try {
      const response = await fetch('/apidjango/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId: session?.user?.email
        }),
      });

      if (response.ok) {
        router.push('/blog');
      } else {
        throw new Error('Erro ao criar post');
      }
    } catch (error) {
      console.error('Erro ao criar post:', error);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-semibold tracking-tight">{t('blog:createPost')}</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('blog:title')}
            </label>
            <input
              {...register('title')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={t('blog:enterTitle')}
            />
            {errors.title && (
              <p className="text-sm font-medium text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('blog:category')}
            </label>
            <select
              {...register('category')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{t('blog:selectCategory')}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm font-medium text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('blog:postContent')}
            </label>
            <textarea
              {...register('content')}
              rows={10}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={t('blog:writeContent')}
            />
            {errors.content && (
              <p className="text-sm font-medium text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {t('blog:publish')}
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
} 