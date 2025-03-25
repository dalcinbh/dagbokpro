/**
 * API Route para gerenciar posts individuais
 * Fornece operações para buscar, atualizar e excluir posts pelo ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { PostModel } from '@/models/Post';
import { getUserEmail } from '@/lib/auth';

interface PathParams {
  params: {
    id: string;
  };
}

/**
 * Busca um post específico pelo ID
 * @param request Solicitação HTTP
 * @param params Parâmetros da URL
 * @returns Post encontrado
 */
export async function GET(_request: NextRequest, { params }: PathParams) {
  try {
    const post = await PostModel.findById(params.id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error: any) {
    console.error(`Erro ao buscar post ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro ao buscar post', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Atualiza um post específico pelo ID
 * @param request Solicitação HTTP com dados de atualização
 * @param params Parâmetros da URL
 * @returns Post atualizado
 */
export async function PUT(request: NextRequest, { params }: PathParams) {
  try {
    // Verifica se o usuário está autenticado
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para atualizar posts.' },
        { status: 401 }
      );
    }
    
    // Verifica se o post existe
    const existingPost = await PostModel.findById(params.id);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      );
    }
    
    // Verifica permissão (apenas o autor pode editar)
    if (existingPost.authorEmail !== userEmail) {
      return NextResponse.json(
        { error: 'Não autorizado. Apenas o autor pode editar este post.' },
        { status: 403 }
      );
    }
    
    // Lê o corpo da requisição
    const body = await request.json();
    
    // Atualiza o post
    const updatedPost = await PostModel.update(params.id, {
      title: body.title,
      content: body.content,
      category: body.category,
      // Atualiza o slug apenas se o título for alterado
      slug: body.title !== existingPost.title ? 
        body.slug || generateSlug(body.title) : 
        existingPost.slug,
      published: body.published,
      tags: body.tags,
      featuredImage: body.featuredImage,
    });
    
    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error(`Erro ao atualizar post ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro ao atualizar post', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Remove um post específico pelo ID
 * @param _request Solicitação HTTP
 * @param params Parâmetros da URL
 * @returns Confirmação de exclusão
 */
export async function DELETE(_request: NextRequest, { params }: PathParams) {
  try {
    // Verifica se o usuário está autenticado
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para excluir posts.' },
        { status: 401 }
      );
    }
    
    // Verifica se o post existe
    const existingPost = await PostModel.findById(params.id);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      );
    }
    
    // Verifica permissão (apenas o autor pode excluir)
    if (existingPost.authorEmail !== userEmail) {
      return NextResponse.json(
        { error: 'Não autorizado. Apenas o autor pode excluir este post.' },
        { status: 403 }
      );
    }
    
    // Exclui o post
    const deleted = await PostModel.delete(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Erro ao excluir post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Post excluído com sucesso' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Erro ao excluir post ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro ao excluir post', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Gera um slug a partir do título
 * @param title Título do post
 * @returns Slug gerado
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/--+/g, '-') // Remove hífens duplicados
    .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
} 