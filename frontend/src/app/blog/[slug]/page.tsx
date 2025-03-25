'use client';

import { useEffect, useState } from 'react';
import { IPost } from '@/models/Post';
import { useParams } from 'next/navigation';

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<IPost | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/apidjango/posts/${slug}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Erro ao carregar post:', error);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (!post) {
    return <div>Carregando...</div>;
  }

  return (
    <article className="container mx-auto px-4 py-8 prose lg:prose-xl">
      <h1>{post.title}</h1>
      <div className="text-gray-600 mb-4">
        <span>Categoria: {post.category}</span>
        <span className="mx-2">•</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
} 