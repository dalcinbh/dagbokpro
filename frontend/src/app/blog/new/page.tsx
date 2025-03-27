'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * New Post Page
 * Allows the user to create a new post with title, category and formatted content
 */
export default function NewPost() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t, i18n } = useTranslation(['blog', 'common']);

  useEffect(() => {
    // Wait for both session and translations to be ready
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  // Available categories for the post
  const categories = [
    { id: 'technology', name: t('categories.technology', { ns: 'blog' }) },
    { id: 'health', name: t('categories.health', { ns: 'blog' }) },
    { id: 'business', name: t('categories.business', { ns: 'blog' }) },
    { id: 'lifestyle', name: t('categories.lifestyle', { ns: 'blog' }) },
    { id: 'education', name: t('categories.education', { ns: 'blog' }) }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !content) {
      alert('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          category,
          content,
          published: true,
        }),
      });
      
      if (!res.ok) {
        throw new Error('Error creating post');
      }
      
      router.push('/blog');
      router.refresh();
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Could not publish the post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check authentication
  if (!session && !isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('restrictedAccess', { ns: 'common' })}</h1>
          <p className="mb-4">{t('loginRequired', { ns: 'blog' })}</p>
          <Button onClick={() => router.push('/login')}>{t('login', { ns: 'common' })}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 flex flex-col items-center ml-9">
      <h1 className="text-3xl font-bold mb-6">{t('createPost', { ns: 'blog' })}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="space-y-2">
          <Label htmlFor="title">{t('title', { ns: 'blog' })}</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('enterTitle', { ns: 'blog' })}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">{t('category', { ns: 'blog' })}</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('selectCategory', { ns: 'blog' })} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">{t('postContent', { ns: 'blog' })}</Label>
          <div className="relative">
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder={t('writeContent', { ns: 'blog' })}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6"
          >
            {isSubmitting ? t('publishing', { ns: 'blog' }) : t('publish', { ns: 'blog' })}
          </Button>
        </div>
      </form>
    </div>
  );
} 