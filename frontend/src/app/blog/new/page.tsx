'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/RichTextEditor';

/**
 * New Post Page
 * Allows the user to create a new post with title, category and formatted content
 */
export default function NewPost() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Available categories for the post
  const categories = [
    { id: 'technology', name: 'Technology' },
    { id: 'health', name: 'Health' },
    { id: 'business', name: 'Business' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'education', name: 'Education' }
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

  // Check authentication
  if (!session) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Restricted Access</h1>
          <p className="mb-4">You need to be logged in to create a new post.</p>
          <Button onClick={() => router.push('/login')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">New Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
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
          <Label htmlFor="content">Content</Label>
          <div className="relative">
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Write your post content..."
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6"
          >
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </form>
    </div>
  );
} 