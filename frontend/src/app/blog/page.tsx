/**
 * Página de listagem de Posts do Blog
 * Exibe todos os posts com paginação e filtros
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import { Post } from '@/models/Post';

/**
 * Interface para resposta da API
 */
interface PostsResponse {
  posts: Post[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Componente de Card de Post
 */
function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {post.featuredImage && (
        <div className="relative h-48 w-full">
          <img 
            src={post.featuredImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
            {post.category}
          </span>
          {post.published ? (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Publicado
            </span>
          ) : (
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              Rascunho
            </span>
          )}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
            {post.title}
          </h2>
        </Link>
        <p className="text-gray-700 text-sm mb-4">
          {post.content.length > 120 
            ? post.content.substring(0, 120) + '...' 
            : post.content}
        </p>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Por: {post.author}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente de paginação
 */
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="flex justify-center items-center mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mr-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 mx-1 rounded-md ${
            currentPage === page 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white border border-gray-300'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 ml-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próxima
      </button>
    </div>
  );
}

/**
 * Página principal de Blog
 */
export default function BlogPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postsData, setPostsData] = useState<PostsResponse | null>(null);
  
  const searchParams = useSearchParams();
  const page = Number(searchParams?.get('page') || '1');
  const category = searchParams?.get('category') || '';
  const search = searchParams?.get('search') || '';
  
  // Carrega os posts ao montar o componente e quando as dependências mudam
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        
        // Constrói a URL com parâmetros de consulta
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '9',
          published: 'true'
        });
        
        if (category) queryParams.append('category', category);
        if (search) queryParams.append('search', search);
        
        const response = await fetch(`/api/posts?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Falha ao carregar os posts');
        }
        
        const data = await response.json();
        setPostsData(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar posts:', err);
        setError('Não foi possível carregar os posts. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, [page, category, search]);
  
  // Função para atualizar o URL quando a página mudar
  const handlePageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage.toString());
    window.history.pushState({}, '', url);
    
    // Atualiza a página atual (o useEffect será acionado devido à mudança na URL)
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  
  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
        {/* Cabeçalho da página */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
            <p className="text-gray-600">Explore nossos artigos e tutoriais</p>
          </div>
          <Link
            href="/blog/novo"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Novo Post
          </Link>
        </div>
        
        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow">
          <form className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar posts..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                defaultValue={search}
              />
            </div>
            <div className="w-full md:w-48">
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                defaultValue={category}
              >
                <option value="">Todas categorias</option>
                <option value="tutorial">Tutorial</option>
                <option value="artigo">Artigo</option>
                <option value="noticia">Notícia</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Filtrar
            </button>
          </form>
        </div>
        
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
        
        {/* Lista de posts */}
        {!loading && !error && postsData && (
          <>
            {postsData.posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">Nenhum post encontrado</p>
                <Link
                  href="/blog/novo"
                  className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Criar o primeiro post
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postsData.posts.map((post) => (
                  <PostCard key={post._id?.toString()} post={post} />
                ))}
              </div>
            )}
            
            {/* Paginação */}
            {postsData.pagination.totalPages > 1 && (
              <Pagination
                currentPage={postsData.pagination.page}
                totalPages={postsData.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
} 