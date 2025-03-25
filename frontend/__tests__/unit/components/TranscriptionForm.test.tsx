import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TranscriptionsPage from '@/app/transcricoes/page';

const mockPush = jest.fn();

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    _location: { pathname: '/transcricoes' }
  }),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { email: 'test@example.com' } },
    status: 'authenticated'
  })
}));

describe('TranscriptionsPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the transcription form', () => {
    render(<TranscriptionsPage />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Gerar post' })).toBeInTheDocument();
  });

  it('shows validation error for short text', async () => {
    render(<TranscriptionsPage />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Gerar post' });

    fireEvent.change(input, { target: { value: 'short' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/texto deve ter pelo menos 10 caracteres/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<TranscriptionsPage />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: 'Gerar post' });

    fireEvent.change(input, { target: { value: 'This is a valid transcription text' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByText(/texto deve ter pelo menos 10 caracteres/i)).not.toBeInTheDocument();
      expect(mockPush).toHaveBeenCalledWith('/blog/generated-post');
    });
  });
});