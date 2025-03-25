import { render, screen } from '@testing-library/react';
import BlogPage from '@/app/blog/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    _location: { pathname: '/blog' }
  }),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { email: 'test@example.com' } },
    status: 'authenticated'
  })
}));

// Mock allPosts data
jest.mock('contentlayer/generated', () => ({
  allPosts: [
    {
      title: 'Test Post 1',
      category: 'technology',
      slug: 'test-post-1',
      createdAt: '2024-03-25',
      body: { raw: 'Test content 1' }
    },
    {
      title: 'Test Post 2',
      category: 'education',
      slug: 'test-post-2',
      createdAt: '2024-03-26',
      body: { raw: 'Test content 2' }
    }
  ]
}));

describe('BlogPage', () => {
  it('renders the blog page title', () => {
    render(<BlogPage />);
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('renders the new post button', () => {
    render(<BlogPage />);
    expect(screen.getByRole('link', { name: /novo post/i })).toBeInTheDocument();
  });

  it('renders the list of posts', () => {
    render(<BlogPage />);
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
  });

  it('displays post categories', () => {
    render(<BlogPage />);
    expect(screen.getByText('technology')).toBeInTheDocument();
    expect(screen.getByText('education')).toBeInTheDocument();
  });
}); 