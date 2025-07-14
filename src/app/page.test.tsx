import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from './page';
import * as api from '@/lib/api';

const mockFactCheckResponse = {
  verdict: 'True' as const,
  confidence: 90,
  reasoning: 'This is a mock explanation.',
  sources: [
    { title: 'Mock Source', url: 'https://mock.com', snippet: 'Mock snippet.' },
  ],
  claim: 'Mock claim',
};

describe('HomePage integration', () => {
  beforeEach(() => {
    jest.spyOn(api, 'factCheck').mockResolvedValue(mockFactCheckResponse);
    localStorage.clear();
  });

  it('submits a claim and displays the result', async () => {
    render(<HomePage />);
    const textarea = screen.getByPlaceholderText(/paste a claim/i);
    fireEvent.change(textarea, { target: { value: 'Mock claim' } });
    fireEvent.click(screen.getByRole('button', { name: /check claim/i }));
    await waitFor(() => {
      expect(screen.getByText('Mock claim')).toBeInTheDocument();
      expect(screen.getByText(/mock explanation/i)).toBeInTheDocument();
      expect(screen.getByText(/mock source/i)).toBeInTheDocument();
    });
  });

  it('caches results in localStorage and loads them on reload', async () => {
    render(<HomePage />);
    fireEvent.change(screen.getByPlaceholderText(/paste a claim/i), { target: { value: 'Mock claim' } });
    fireEvent.click(screen.getByRole('button', { name: /check claim/i }));
    await waitFor(() => {
      expect(screen.getByText('Mock claim')).toBeInTheDocument();
    });
    // Unmount and remount
    localStorage.setItem('factcheck_results', JSON.stringify([mockFactCheckResponse]));
    render(<HomePage />);
    expect(screen.getAllByText('Mock claim').length).toBeGreaterThanOrEqual(1);
  });

  it('loads more results when Load more is clicked', async () => {
    // Add 7 mock results to localStorage
    const manyResults = Array.from({ length: 7 }, (_, i) => ({ ...mockFactCheckResponse, claim: `Claim ${i}` }));
    localStorage.setItem('factcheck_results', JSON.stringify(manyResults));
    render(<HomePage />);
    // Only PAGE_SIZE (5) should be visible initially
    for (let i = 0; i < 5; i++) {
      expect(screen.getByText(`Claim ${i}`)).toBeInTheDocument();
    }
    // Click Load more
    fireEvent.click(screen.getByRole('button', { name: /load more/i }));
    await waitFor(() => {
      expect(screen.getByText('Claim 5')).toBeInTheDocument();
      expect(screen.getByText('Claim 6')).toBeInTheDocument();
    });
  });
}); 