import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewPostPage from '@/app/blog/novo/page';

const mockPush = jest.fn();

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    _location: { pathname: '/blog/novo' }
  }),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { email: 'test@example.com' } },
    status: 'authenticated'
  })
}));

describe('NewPostPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the new post form', () => {
    render(<NewPostPage />);
    expect(screen.getByText('Novo Post')).toBeInTheDocument();
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/conteúdo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar post/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<NewPostPage />);
    const submitButton = screen.getByRole('button', { name: /criar post/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/título é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/categoria é obrigatória/i)).toBeInTheDocument();
      expect(screen.getByText(/conteúdo é obrigatório/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<NewPostPage />);
    const titleInput = screen.getByLabelText(/título/i);
    const categoryInput = screen.getByLabelText(/categoria/i);
    const contentInput = screen.getByLabelText(/conteúdo/i);
    const submitButton = screen.getByRole('button', { name: /criar post/i });

    fireEvent.change(titleInput, { target: { value: 'Test Post' } });
    fireEvent.change(categoryInput, { target: { value: 'technology' } });
    fireEvent.change(contentInput, { target: { value: 'Test content' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/blog');
    });
  });
}); 