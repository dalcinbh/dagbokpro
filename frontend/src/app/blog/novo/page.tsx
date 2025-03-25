'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

  const onSubmit = async (data: PostFormData) => {
    try {
      const response = await fetch('/apidjango/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId: session?.user?.id
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Novo Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Título
          </label>
          <input
            {...register('title')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.title && (
            <p className="text-red-500 text-xs italic">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Categoria
          </label>
          <select
            {...register('category')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs italic">{errors.category.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Conteúdo
          </label>
          <textarea
            {...register('content')}
            rows={10}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.content && (
            <p className="text-red-500 text-xs italic">{errors.content.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Publicar
        </button>
      </form>
    </div>
  );
} 