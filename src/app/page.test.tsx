import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './page';
import { factCheck, FactCheckResponse } from '@/lib/api';

// Mock the API module
jest.mock('@/lib/api');
const mockedFactCheck = factCheck as jest.MockedFunction<typeof factCheck>;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Initial Render', () => {
    it('renders the main components', () => {
      render(<HomePage />);

      expect(screen.getByText('FactCheck AI')).toBeInTheDocument();
      expect(screen.getByText('Check a Claim')).toBeInTheDocument();
      expect(screen.getByLabelText('Enter your claim')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /check claim/i })).toBeInTheDocument();
    });

    it('shows empty state when no results exist', () => {
      render(<HomePage />);

      expect(screen.getByText('No results yet')).toBeInTheDocument();
      expect(screen.getByText('Enter a claim above to start fact-checking')).toBeInTheDocument();
    });
  });

  describe('Form Submission with TL;DR', () => {
    it('submits claim successfully with TL;DR', async () => {
      const user = userEvent.setup();

      const mockResponse = {
        verdict: 'False' as const,
        confidence: 95,
        reasoning: 'This claim is false based on multiple sources.',
        tldr: 'This claim is false. Multiple studies have debunked this theory.',
        sources: [
          { title: 'Test Source', url: 'https://example.com', snippet: 'Test snippet' }
        ],
        claim: 'Test claim'
      };

      mockedFactCheck.mockResolvedValue(mockResponse);

      render(<HomePage />);

      const textarea = screen.getByLabelText('Enter your claim');
      const submitButton = screen.getByRole('button', { name: /check claim/i });

      await user.type(textarea, 'Test claim');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockedFactCheck).toHaveBeenCalledWith('Test claim');
      });

      await waitFor(() => {
        expect(screen.getByText('Test claim')).toBeInTheDocument();
        expect(screen.getByText('TL;DR')).toBeInTheDocument();
        expect(screen.getByText('This claim is false. Multiple studies have debunked this theory.')).toBeInTheDocument();
      });
    });

    it('submits claim successfully without TL;DR', async () => {
      const user = userEvent.setup();

      const mockResponse = {
        verdict: 'True' as const,
        confidence: 85,
        reasoning: 'This claim is true based on multiple sources.',
        sources: [
          { title: 'Test Source', url: 'https://example.com', snippet: 'Test snippet' }
        ],
        claim: 'Test claim'
      };

      mockedFactCheck.mockResolvedValue(mockResponse);

      render(<HomePage />);

      const textarea = screen.getByLabelText('Enter your claim');
      const submitButton = screen.getByRole('button', { name: /check claim/i });

      await user.type(textarea, 'Test claim');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockedFactCheck).toHaveBeenCalledWith('Test claim');
      });

      await waitFor(() => {
        expect(screen.getByText('Test claim')).toBeInTheDocument();
        expect(screen.queryByText('TL;DR')).not.toBeInTheDocument();
      });
    });

    it('shows loading state during submission', async () => {
      const user = userEvent.setup();

      // Create a promise that we can control
      let resolvePromise: (value: FactCheckResponse) => void;
      const promise = new Promise<FactCheckResponse>((resolve) => {
        resolvePromise = resolve;
      });

      mockedFactCheck.mockReturnValue(promise);

      render(<HomePage />);

      const textarea = screen.getByLabelText('Enter your claim');
      const submitButton = screen.getByRole('button', { name: /check claim/i });

      await user.type(textarea, 'Test claim');
      await user.click(submitButton);

      // Check loading state
      expect(screen.getByText('Analyzing...')).toBeInTheDocument();
      expect(screen.getByText('Gathering information and analyzing your claim...')).toBeInTheDocument();

      // Resolve the promise
      resolvePromise!({
        verdict: 'True',
        confidence: 85,
        reasoning: 'Test reasoning',
        sources: [],
        claim: 'Test claim'
      });

      await waitFor(() => {
        expect(screen.queryByText('Analyzing...')).not.toBeInTheDocument();
      });
    });

    it('handles API errors', async () => {
      const user = userEvent.setup();

      mockedFactCheck.mockRejectedValue(new Error('API Error'));

      render(<HomePage />);

      const textarea = screen.getByLabelText('Enter your claim');
      const submitButton = screen.getByRole('button', { name: /check claim/i });

      await user.type(textarea, 'Test claim');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
      });
    });
  });

  describe('Results Management with TL;DR', () => {
    it('loads results from localStorage on mount with TL;DR', () => {
      const storedResults = [
        {
          verdict: 'False',
          confidence: 95,
          explanation: 'Test explanation',
          tldr: 'Test TL;DR',
          sources: [],
          claim: 'Stored claim'
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedResults));

      render(<HomePage />);

      expect(screen.getByText('Stored claim')).toBeInTheDocument();
      expect(screen.getByText('TL;DR')).toBeInTheDocument();
      expect(screen.getByText('Test TL;DR')).toBeInTheDocument();
    });

    it('saves results to localStorage with TL;DR', async () => {
      const user = userEvent.setup();

      const mockResponse = {
        verdict: 'True' as const,
        confidence: 85,
        reasoning: 'Test reasoning',
        tldr: 'Test TL;DR',
        sources: [],
        claim: 'Test claim'
      };

      mockedFactCheck.mockResolvedValue(mockResponse);

      render(<HomePage />);

      const textarea = screen.getByLabelText('Enter your claim');
      const submitButton = screen.getByRole('button', { name: /check claim/i });

      await user.type(textarea, 'Test claim');
      await user.click(submitButton);

      // Wait for the result to be displayed first
      await waitFor(() => {
        expect(screen.getByText('Test claim')).toBeInTheDocument();
      });

      // Then check localStorage
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalled();

        // Find the call that contains our test data
        const calls = localStorageMock.setItem.mock.calls;
        let foundCall = null;

        for (let i = calls.length - 1; i >= 0; i--) {
          try {
            const data = JSON.parse(calls[i][1]);
            if (data.length > 0 && data[0].claim === 'Test claim') {
              foundCall = data;
              break;
            }
          } catch {
            // Skip invalid JSON
          }
        }

        expect(foundCall).toBeTruthy();
        expect(foundCall).toHaveLength(1);
        expect(foundCall[0].tldr).toBe('Test TL;DR');
      });
    });

    it('loads more results when button is clicked', async () => {
      const storedResults = Array.from({ length: 10 }, (_, i) => ({
        verdict: 'True' as const,
        confidence: 85,
        explanation: `Test explanation ${i}`,
        tldr: `Test TL;DR ${i}`,
        sources: [],
        claim: `Test claim ${i}`
      }));

      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedResults));

      render(<HomePage />);

      // Initially shows 5 results
      expect(screen.getByText('Test claim 0')).toBeInTheDocument();
      expect(screen.getByText('Test claim 4')).toBeInTheDocument();
      expect(screen.queryByText('Test claim 5')).not.toBeInTheDocument();

      // Click load more
      const loadMoreButton = screen.getByRole('button', { name: /load more results/i });
      await userEvent.click(loadMoreButton);

      // Should show more results
      expect(screen.getByText('Test claim 5')).toBeInTheDocument();
      expect(screen.getByText('Test claim 9')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders with responsive classes', () => {
      const { container } = render(<HomePage />);

      // Check for responsive grid classes
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('lg:grid-cols-5');

      // Check for responsive spacing
      const mainContainer = container.querySelector('main');
      expect(mainContainer).toHaveClass('min-h-screen');
    });
  });
}); 