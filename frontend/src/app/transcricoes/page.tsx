/**
 * Página de Transcrições
 * Interface para adicionar e gerenciar transcrições
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import { Transcription } from '@/models/Transcription';

/**
 * Interface para resposta da API
 */
interface TranscriptionResponse {
  transcriptions: Transcription[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Componente de Card de Transcrição
 */
function TranscriptionCard({ transcription }: { transcription: Transcription }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{transcription.title}</h3>
        <span className={`
          px-2 py-1 text-xs rounded-full
          ${transcription.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
          ${transcription.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${transcription.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
          ${transcription.status === 'error' ? 'bg-red-100 text-red-800' : ''}
        `}>
          {transcription.status === 'completed' ? 'Concluído' : ''}
          {transcription.status === 'pending' ? 'Pendente' : ''}
          {transcription.status === 'processing' ? 'Processando' : ''}
          {transcription.status === 'error' ? 'Erro' : ''}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm line-clamp-3">
        {transcription.text}
      </p>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Criado em: {new Date(transcription.createdAt).toLocaleDateString('pt-BR')}</span>
        {transcription.postId && (
          <a 
            href={`/blog/${transcription.postId}`}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Ver post gerado
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * Componente de formulário para nova transcrição
 */
function TranscriptionForm({ onSubmit }: { onSubmit: (data: { title: string, text: string }) => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!text.trim() || text.trim().length < 10) {
      setError('O texto deve ter pelo menos 10 caracteres');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({ title: title || 'Nova Transcrição', text });
      
      // Limpa o formulário após envio bem-sucedido
      setTitle('');
      setText('');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao enviar a transcrição');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Nova Transcrição</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título (opcional)
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da transcrição"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
          Texto para transcrição *
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole aqui o texto a ser transcrito..."
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Mínimo de 10 caracteres.
        </p>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Transcrição'}
      </button>
    </form>
  );
}

/**
 * Página principal de Transcrições
 */
export default function TranscricoesPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transcriptionsData, setTranscriptionsData] = useState<TranscriptionResponse | null>(null);
  
  // Carrega as transcrições do usuário
  const fetchTranscriptions = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/transcriptions');
      
      if (!response.ok) {
        throw new Error('Falha ao carregar as transcrições');
      }
      
      const data = await response.json();
      setTranscriptionsData(data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar transcrições:', err);
      setError('Não foi possível carregar as transcrições. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Carrega as transcrições ao montar o componente
  useEffect(() => {
    if (session?.user) {
      fetchTranscriptions();
    }
  }, [session]);
  
  // Função para enviar nova transcrição
  const handleSubmitTranscription = async (data: { title: string, text: string }) => {
    try {
      const response = await fetch('/api/transcriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar transcrição');
      }
      
      // Recarrega as transcrições após adicionar uma nova
      await fetchTranscriptions();
    } catch (err: any) {
      console.error('Erro ao enviar transcrição:', err);
      throw err;
    }
  };
  
  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
        {/* Cabeçalho da página */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transcrições</h1>
          <p className="text-gray-600">Gerencie suas transcrições e crie posts automaticamente</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna esquerda: Formulário */}
          <div className="lg:col-span-1">
            <TranscriptionForm onSubmit={handleSubmitTranscription} />
          </div>
          
          {/* Coluna direita: Lista de transcrições */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Suas Transcrições</h2>
              
              {/* Estado de carregamento */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-solid rounded-full border-t-transparent animate-spin"></div>
                </div>
              )}
              
              {/* Mensagem de erro */}
              {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-md">
                  {error}
                </div>
              )}
              
              {/* Lista de transcrições */}
              {!loading && !error && transcriptionsData && (
                <>
                  {transcriptionsData.transcriptions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Você ainda não tem transcrições</p>
                      <p className="text-gray-600 mt-2">Use o formulário ao lado para criar sua primeira transcrição</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transcriptionsData.transcriptions.map((transcription) => (
                        <TranscriptionCard 
                          key={transcription._id?.toString()} 
                          transcription={transcription} 
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 