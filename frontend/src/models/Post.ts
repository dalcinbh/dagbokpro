/**
 * Modelo de Post para MongoDB
 * Define a estrutura e métodos relacionados aos posts do blog
 */

import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/mongodb';

/**
 * Interface para definir a estrutura de um post
 */
export interface Post {
  _id?: ObjectId;
  title: string;
  content: string;
  slug: string;
  category: string;
  author: string;
  authorEmail: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  tags?: string[];
  featuredImage?: string;
}

/**
 * Interface para filtros utilizados em consultas
 */
export interface PostFilters {
  published?: boolean;
  category?: string;
  author?: string;
  tags?: string[];
  search?: string;
}

/**
 * Classe para gerenciar operações relacionadas a posts
 */
export class PostModel {
  /**
   * Nome da coleção no MongoDB
   */
  private static collectionName = 'posts';

  /**
   * Cria um novo post
   * @param post Dados do post a ser criado
   * @returns O post criado com ID gerado
   */
  static async create(post: Omit<Post, '_id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const collection = await getCollection(this.collectionName);
    
    const now = new Date();
    const newPost: Post = {
      ...post,
      createdAt: now,
      updatedAt: now,
      published: post.published ?? false,
    };
    
    const result = await collection.insertOne(newPost as any);
    return { ...newPost, _id: result.insertedId };
  }

  /**
   * Busca um post pelo seu ID
   * @param id ID do post
   * @returns O post encontrado ou null
   */
  static async findById(id: string): Promise<Post | null> {
    const collection = await getCollection(this.collectionName);
    return collection.findOne({ _id: new ObjectId(id) }) as Promise<Post | null>;
  }

  /**
   * Busca um post pelo seu slug
   * @param slug Slug do post
   * @returns O post encontrado ou null
   */
  static async findBySlug(slug: string): Promise<Post | null> {
    const collection = await getCollection(this.collectionName);
    return collection.findOne({ slug }) as Promise<Post | null>;
  }

  /**
   * Lista posts com filtros opcionais
   * @param filters Filtros para a consulta
   * @param limit Limite de resultados
   * @param skip Quantidade de resultados para pular (paginação)
   * @returns Lista de posts que atendem aos filtros
   */
  static async findAll(filters: PostFilters = {}, limit = 10, skip = 0): Promise<Post[]> {
    const collection = await getCollection(this.collectionName);
    
    // Constrói o query com base nos filtros
    const query: any = {};
    
    if (filters.published !== undefined) {
      query.published = filters.published;
    }
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.author) {
      query.author = filters.author;
    }
    
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { content: { $regex: filters.search, $options: 'i' } },
      ];
    }
    
    return collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray() as Promise<Post[]>;
  }

  /**
   * Atualiza um post existente
   * @param id ID do post
   * @param post Dados atualizados
   * @returns O post atualizado
   */
  static async update(id: string, post: Partial<Post>): Promise<Post | null> {
    const collection = await getCollection(this.collectionName);
    
    const updates = {
      ...post,
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
   * Remove um post
   * @param id ID do post
   * @returns true se removido com sucesso
   */
  static async delete(id: string): Promise<boolean> {
    const collection = await getCollection(this.collectionName);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  /**
   * Conta o número de posts que correspondem aos filtros
   * @param filters Filtros para a consulta
   * @returns Total de posts
   */
  static async count(filters: PostFilters = {}): Promise<number> {
    const collection = await getCollection(this.collectionName);
    
    const query: any = {};
    
    if (filters.published !== undefined) {
      query.published = filters.published;
    }
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.author) {
      query.author = filters.author;
    }
    
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { content: { $regex: filters.search, $options: 'i' } },
      ];
    }
    
    return collection.countDocuments(query);
  }
} 