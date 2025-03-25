'use client';

import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const transcriptionSchema = z.object({
  text: z.string().min(10, 'O texto deve ter pelo menos 10 caracteres'),
});

type TranscriptionFormData = z.infer<typeof transcriptionSchema>;

export default function TranscriptionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TranscriptionFormData>({
    resolver: zodResolver(transcriptionSchema)
  });

  const onSubmit = async (data: TranscriptionFormData) => {
    if (!session?.user) return;

    try {
      setIsGenerating(true);

      // Primeiro, salva a transcrição
      const transcriptionResponse = await fetch('/apidjango/transcricoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: data.text,
          userId: session.user.email,
        }),
      });

      if (!transcriptionResponse.ok) {
        throw new Error('Erro ao salvar transcrição');
      }

      const transcription = await transcriptionResponse.json();

      // Depois, gera o post usando IA
      const generationResponse = await fetch('/apidjango/gerar-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcriptionId: transcription._id,
        }),
      });

      if (!generationResponse.ok) {
        throw new Error('Erro ao gerar post');
      }

      const generatedPost = await generationResponse.json();

      // Redireciona para o post gerado
      router.push(`/blog/${generatedPost.slug}`);
      reset();
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Transcrições</h1>

      <div className="max-w-2xl">
        <p className="mb-4 text-gray-600">
          Cole aqui o texto da sua transcrição. Nossa IA irá analisar o conteúdo e gerar um post estruturado automaticamente.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <textarea
              {...register('text')}
              rows={10}
              placeholder="Cole sua transcrição aqui..."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.text && (
              <p className="text-red-500 text-xs italic">{errors.text.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isGenerating ? 'Gerando post...' : 'Gerar post'}
          </button>
        </form>
      </div>
    </div>
  );
} 