import { render, screen } from '@testing-library/react';
import ResultBox from './ResultBox';
import { ResultProps } from './ResultBox.types';

describe('ResultBox', () => {
  const mockSources = [
    { title: 'Test Source 1', url: 'https://example1.com', snippet: 'Test snippet 1' },
    { title: 'Test Source 2', url: 'https://example2.com', snippet: 'Test snippet 2' },
  ];

  describe('Loading State', () => {
    it('renders loading state correctly', () => {
      const props: ResultProps = {
        loading: true,
        verdict: '',
        confidence: 0,
        explanation: '',
        claim: 'Test claim',
        loadingMessage: 'Custom loading message',
      };

      render(<ResultBox {...props} />);

      expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    });

    it('renders default loading message when not provided', () => {
      const props: ResultProps = {
        loading: true,
        verdict: '',
        confidence: 0,
        explanation: '',
        claim: 'Test claim',
      };

      render(<ResultBox {...props} />);

      expect(screen.getByText('Gathering information and analyzing your claim...')).toBeInTheDocument();
    });
  });

  describe('Result Display', () => {
    it('renders result with all components', () => {
      const props: ResultProps = {
        verdict: 'False',
        confidence: 95,
        explanation: 'This claim is false based on multiple sources.',
        claim: 'Test claim',
        sources: mockSources,
      };

      render(<ResultBox {...props} />);

      expect(screen.getByText('Test claim')).toBeInTheDocument();
      expect(screen.getByLabelText(/verdict/i)).toBeInTheDocument();
      expect(screen.getByText(/confidence/i)).toBeInTheDocument();
      expect(screen.getByText('This claim is false based on multiple sources.')).toBeInTheDocument();
      expect(screen.getByText('Test Source 1')).toBeInTheDocument();
      expect(screen.getByText('Test Source 2')).toBeInTheDocument();
    });

    it('renders result without claim', () => {
      const props: ResultProps = {
        verdict: 'True',
        confidence: 85,
        explanation: 'This claim is true.',
        sources: mockSources,
      };

      render(<ResultBox {...props} />);

      expect(screen.queryByText('Test claim')).not.toBeInTheDocument();
      expect(screen.getByLabelText(/verdict/i)).toBeInTheDocument();
      expect(screen.getByText(/confidence/i)).toBeInTheDocument();
    });

    it('renders result without sources', () => {
      const props: ResultProps = {
        verdict: 'Unclear',
        confidence: 50,
        explanation: 'This claim is unclear.',
        claim: 'Test claim',
      };

      render(<ResultBox {...props} />);

      expect(screen.getByText('Test claim')).toBeInTheDocument();
      expect(screen.getByText('This claim is unclear.')).toBeInTheDocument();
    });
  });

  describe('TL;DR Feature', () => {
    it('renders TL;DR section when provided', () => {
      const props: ResultProps = {
        verdict: 'False',
        confidence: 95,
        explanation: 'This claim is false based on multiple sources.',
        tldr: 'This claim is false. Multiple studies have debunked this theory.',
        claim: 'Test claim',
        sources: mockSources,
      };

      render(<ResultBox {...props} />);

      expect(screen.getByText('TL;DR')).toBeInTheDocument();
      expect(screen.getByText('This claim is false. Multiple studies have debunked this theory.')).toBeInTheDocument();
    });

    it('does not render TL;DR section when not provided', () => {
      const props: ResultProps = {
        verdict: 'True',
        confidence: 85,
        explanation: 'This claim is true.',
        claim: 'Test claim',
        sources: mockSources,
      };

      render(<ResultBox {...props} />);

      expect(screen.queryByText('TL;DR')).not.toBeInTheDocument();
    });

    it('does not render TL;DR section when empty string', () => {
      const props: ResultProps = {
        verdict: 'Disputed',
        confidence: 70,
        explanation: 'This claim is disputed.',
        tldr: '',
        claim: 'Test claim',
        sources: mockSources,
      };

      render(<ResultBox {...props} />);

      expect(screen.queryByText('TL;DR')).not.toBeInTheDocument();
    });

    it('renders TL;DR with multi-line content', () => {
      const multiLineTldr = 'This claim is disputed among experts. Some studies support it while others contradict it. The scientific community remains divided on this issue.';

      const props: ResultProps = {
        verdict: 'Disputed',
        confidence: 70,
        explanation: 'This claim is disputed.',
        tldr: multiLineTldr,
        claim: 'Test claim',
        sources: mockSources,
      };

      render(<ResultBox {...props} />);

      expect(screen.getByText('TL;DR')).toBeInTheDocument();
      expect(screen.getByText(multiLineTldr)).toBeInTheDocument();
    });

    it('renders TL;DR with proper styling classes', () => {
      const props: ResultProps = {
        verdict: 'False',
        confidence: 95,
        explanation: 'This claim is false.',
        tldr: 'This claim is false.',
        claim: 'Test claim',
        sources: mockSources,
      };

      render(<ResultBox {...props} />);

      const tldrSection = screen.getByText('TL;DR').closest('div');
      expect(tldrSection).toHaveClass('bg-blue-50', 'border', 'border-blue-200', 'rounded-lg', 'p-4');
    });

    it('renders TL;DR text with proper styling', () => {
      const props: ResultProps = {
        verdict: 'False',
        confidence: 95,
        explanation: 'This claim is false based on multiple sources.',
        tldr: 'This claim is false.',
        claim: 'Test claim',
        sources: mockSources,
      };

      render(<ResultBox {...props} />);

      // Find the TL;DR text specifically by looking for the text within the TL;DR section
      const tldrSection = screen.getByText('TL;DR').closest('div');
      const tldrText = tldrSection?.querySelector('p');
      expect(tldrText).toHaveClass('text-blue-800', 'text-sm', 'leading-relaxed');
    });
  });

  describe('Responsive Design', () => {
    it('renders with proper responsive classes', () => {
      const props: ResultProps = {
        verdict: 'False',
        confidence: 95,
        explanation: 'This claim is false.',
        tldr: 'This claim is false.',
        claim: 'Test claim',
        sources: mockSources,
      };

      const { container } = render(<ResultBox {...props} />);

      // Check for responsive classes
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('relative');

      const contentDiv = mainContainer.querySelector('div[class*="space-y-4"]');
      expect(contentDiv).toHaveClass('space-y-4', 'lg:space-y-6');
    });

    it('renders verdict and confidence with responsive layout', () => {
      const props: ResultProps = {
        verdict: 'False',
        confidence: 95,
        explanation: 'This claim is false.',
        claim: 'Test claim',
        sources: mockSources,
      };

      const { container } = render(<ResultBox {...props} />);

      const verdictConfidenceContainer = container.querySelector('div[class*="flex flex-col sm:flex-row"]');
      expect(verdictConfidenceContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'sm:items-center', 'gap-3', 'sm:gap-4');
    });
  });
}); 