/**
 * API Route para gerenciar transcrições
 * Fornece operações CRUD para transcrições usando MongoDB
 */

import { NextRequest, NextResponse } from 'next/server';
import { Transcription, TranscriptionModel } from '@/models/Transcription';
import { getUserEmail } from '@/lib/auth';

/**
 * Lista ou busca transcrições
 * @param request Solicitação HTTP
 * @returns Lista de transcrições
 */
export async function GET(request: NextRequest) {
  try {
    // Verifica se o usuário está autenticado
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para ver suas transcrições.' },
        { status: 401 }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const status = searchParams.get('status') as Transcription['status'] | null;
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '10');
    
    const skip = (page - 1) * limit;
    
    // Constrói os filtros com base nos parâmetros da consulta
    const filters: Record<string, any> = {
      userEmail // Filtra apenas as transcrições do usuário logado
    };
    
    if (search) filters.search = search;
    if (status) filters.status = status;
    
    // Busca transcrições e total
    const [transcriptions, total] = await Promise.all([
      TranscriptionModel.findAll(filters, limit, skip),
      TranscriptionModel.count(filters)
    ]);
    
    // Calcula informações de paginação
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      transcriptions,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages
      }
    });
  } catch (error: any) {
    console.error('Erro ao buscar transcrições:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar transcrições', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Cria uma nova transcrição
 * @param request Solicitação HTTP com dados da transcrição
 * @returns Transcrição criada
 */
export async function POST(request: NextRequest) {
  try {
    // Verifica se o usuário está autenticado
    const userEmail = await getUserEmail();
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para criar transcrições.' },
        { status: 401 }
      );
    }
    
    // Lê o corpo da requisição
    const body = await request.json();
    
    // Valida campos obrigatórios
    if (!body.text || typeof body.text !== 'string' || body.text.trim().length < 10) {
      return NextResponse.json(
        { error: 'O texto da transcrição é obrigatório e deve ter pelo menos 10 caracteres.' },
        { status: 400 }
      );
    }
    
    // Prepara os dados da transcrição
    const transcriptionData: Omit<Transcription, '_id' | 'createdAt' | 'updatedAt' | 'status'> = {
      text: body.text.trim(),
      title: body.title || 'Nova Transcrição',
      userEmail: userEmail,
      language: body.language || 'pt-BR'
    };
    
    // Cria a transcrição
    const transcription = await TranscriptionModel.create(transcriptionData);
    
    // Aqui poderia disparar um processamento assíncrono para gerar o post
    // No exemplo, apenas atualizamos o status para 'completed'
    await TranscriptionModel.updateStatus(transcription._id!.toString(), 'completed');
    
    return NextResponse.json(transcription, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar transcrição:', error);
    return NextResponse.json(
      { error: 'Erro ao criar transcrição', details: error.message },
      { status: 500 }
    );
  }
} 