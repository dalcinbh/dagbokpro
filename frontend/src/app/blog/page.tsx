'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IPost } from '@/models/Post';

export default function BlogPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (session?.user) {
        const response = await fetch('/apidjango/posts');
        const data = await response.json();
        setPosts(data);
      }
    };

    fetchPosts();
  }, [session]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meu Blog</h1>
        <Link 
          href="/blog/novo" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Novo Post
        </Link>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-500">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 text-sm">
                  Categoria: {post.category}
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link 
                href={`/blog/${post.slug}/editar`}
                className="text-blue-500 hover:text-blue-600"
              >
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 