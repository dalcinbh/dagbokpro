/**
 * Modelo de Transcrição para MongoDB
 * Define a estrutura e métodos relacionados às transcrições
 */

import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';

/**
 * Interface para definir a estrutura de uma transcrição
 */
export interface Transcription {
  _id?: ObjectId;
  text: string;
  title: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
  postId?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  language?: string;
}

/**
 * Interface para filtros utilizados em consultas
 */
export interface TranscriptionFilters {
  userEmail?: string;
  status?: 'pending' | 'processing' | 'completed' | 'error';
  search?: string;
}

/**
 * Classe para gerenciar operações relacionadas a transcrições
 */
export class TranscriptionModel {
  /**
   * Nome da coleção no MongoDB
   */
  private static collectionName = 'transcriptions';

  /**
   * Cria uma nova transcrição
   * @param transcription Dados da transcrição a ser criada
   * @returns A transcrição criada com ID gerado
   */
  static async create(transcription: Omit<Transcription, '_id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Transcription> {
    const collection = await getCollection(this.collectionName);
    
    const now = new Date();
    const newTranscription: Transcription = {
      ...transcription,
      createdAt: now,
      updatedAt: now,
      status: 'pending',
    };
    
    const result = await collection.insertOne(newTranscription as any);
    return { ...newTranscription, _id: result.insertedId };
  }

  /**
   * Busca uma transcrição pelo seu ID
   * @param id ID da transcrição
   * @returns A transcrição encontrada ou null
   */
  static async findById(id: string): Promise<Transcription | null> {
    const collection = await getCollection(this.collectionName);
    return collection.findOne({ _id: new ObjectId(id) }) as Promise<Transcription | null>;
  }

  /**
   * Lista transcrições com filtros opcionais
   * @param filters Filtros para a consulta
   * @param limit Limite de resultados
   * @param skip Quantidade de resultados para pular (paginação)
   * @returns Lista de transcrições que atendem aos filtros
   */
  static async findAll(filters: TranscriptionFilters = {}, limit = 10, skip = 0): Promise<Transcription[]> {
    const collection = await getCollection(this.collectionName);
    
    // Constrói o query com base nos filtros
    const query: any = {};
    
    if (filters.userEmail) {
      query.userEmail = filters.userEmail;
    }
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { text: { $regex: filters.search, $options: 'i' } },
      ];
    }
    
    return collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray() as Promise<Transcription[]>;
  }

  /**
   * Atualiza uma transcrição existente
   * @param id ID da transcrição
   * @param transcription Dados atualizados
   * @returns A transcrição atualizada
   */
  static async update(id: string, transcription: Partial<Transcription>): Promise<Transcription | null> {
    const collection = await getCollection(this.collectionName);
    
    const updates = {
      ...transcription,
      updatedAt: new Date(),
    };
    
    // Remove campos que não devem ser atualizados
    delete updates._id;
    delete updates.createdAt;
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    
    return this.findById(id);
  }

  /**
   * Atualiza o status de uma transcrição
   * @param id ID da transcrição
   * @param status Novo status
   * @param error Mensagem de erro (opcional)
   * @returns A transcrição atualizada
   */
  static async updateStatus(id: string, status: Transcription['status'], error?: string): Promise<Transcription | null> {
    const updates: Partial<Transcription> = { status };
    
    if (error) {
      updates.error = error;
    }
    
    return this.update(id, updates);
  }

  /**
   * Remove uma transcrição
   * @param id ID da transcrição
   * @returns true se removida com sucesso
   */
  static async delete(id: string): Promise<boolean> {
    const collection = await getCollection(this.collectionName);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  /**
   * Conta o número de transcrições que correspondem aos filtros
   * @param filters Filtros para a consulta
   * @returns Total de transcrições
   */
  static async count(filters: TranscriptionFilters = {}): Promise<number> {
    const collection = await getCollection(this.collectionName);
    
    const query: any = {};
    
    if (filters.userEmail) {
      query.userEmail = filters.userEmail;
    }
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { text: { $regex: filters.search, $options: 'i' } },
      ];
    }
    
    return collection.countDocuments(query);
  }

  /**
   * Busca as próximas transcrições pendentes
   * @param limit Número máximo de transcrições a retornar
   * @returns Lista de transcrições pendentes
   */
  static async findNextPending(limit = 5): Promise<Transcription[]> {
    return this.findAll({ status: 'pending' }, limit, 0);
  }
} 