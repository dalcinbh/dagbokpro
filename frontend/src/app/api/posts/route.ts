/**
 * API Route para gerenciar posts
 * Fornece operações CRUD para posts usando MongoDB
 */

import { NextRequest, NextResponse } from 'next/server';
import { Post, PostModel } from '@/models/Post';
import { getUserEmail } from '@/lib/auth';

/**
 * Lista ou busca posts
 * @param request Solicitação HTTP
 * @returns Lista de posts
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '10');
    const published = searchParams.get('published') === 'true';
    
    const skip = (page - 1) * limit;
    
    // Constrói os filtros com base nos parâmetros da consulta
    const filters: Record<string, any> = {};
    if (category) filters.category = category;
    if (search) filters.search = search;
    filters.published = published;
    
    // Busca posts e total
    const [posts, total] = await Promise.all([
      PostModel.findAll(filters, limit, skip),
      PostModel.count(filters)
    ]);
    
    // Calcula informações de paginação
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages
      }
    });
  } catch (error: any) {
    console.error('Erro ao buscar posts:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar posts', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Cria um novo post
 * @param request Solicitação HTTP com dados do post
 * @returns Post criado
 */
export async function POST(request: NextRequest) {
  try {
    // Verifica se o usuário está autenticado
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para criar posts.' },
        { status: 401 }
      );
    }
    
    // Lê o corpo da requisição
    const body = await request.json();
    
    // Valida campos obrigatórios
    const requiredFields = ['title', 'content', 'category'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes', fields: missingFields },
        { status: 400 }
      );
    }
    
    // Prepara os dados do post
    const postData: Omit<Post, '_id' | 'createdAt' | 'updatedAt'> = {
      title: body.title,
      content: body.content,
      category: body.category,
      slug: body.slug || generateSlug(body.title),
      author: body.author || 'Usuário',
      authorEmail: userEmail,
      published: body.published === true,
      tags: body.tags || [],
      featuredImage: body.featuredImage
    };
    
    // Cria o post
    const post = await PostModel.create(postData);
    
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar post:', error);
    return NextResponse.json(
      { error: 'Erro ao criar post', details: error.message },
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