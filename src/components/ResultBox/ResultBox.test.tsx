import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResultBox from '../ResultBox';
import { ResultProps } from '../ResultBox.types';

const baseProps: ResultProps = {
  verdict: 'True',
  confidence: 95,
  explanation: 'This is a detailed explanation.',
  claim: 'The sky is blue.',
  sources: [
    { title: 'NASA', url: 'https://nasa.gov', snippet: 'Sky appears blue due to Rayleigh scattering.' },
    { title: 'Wikipedia', url: 'https://wikipedia.org', snippet: 'The blue color of the sky is caused by scattering.' },
  ],
};

describe('ResultBox', () => {
  it('renders the claim as a title', () => {
    render(<ResultBox {...baseProps} />);
    expect(screen.getByText(baseProps.claim!)).toBeInTheDocument();
  });

  it('renders the verdict badge', () => {
    render(<ResultBox {...baseProps} />);
    expect(screen.getByLabelText(/verdict/i)).toHaveTextContent('True');
  });

  it('renders the confidence bar and value', () => {
    render(<ResultBox {...baseProps} />);
    expect(screen.getByText(/confidence/i)).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('renders the explanation', () => {
    render(<ResultBox {...baseProps} />);
    expect(screen.getByText(baseProps.explanation)).toBeInTheDocument();
  });

  it('renders all sources with title and snippet', () => {
    render(<ResultBox {...baseProps} />);
    for (const src of baseProps.sources!) {
      expect(screen.getByText(src.title)).toBeInTheDocument();
      if (src.snippet) {
        expect(screen.getByText(src.snippet)).toBeInTheDocument();
      }
    }
  });

  it('copies the result to clipboard when share button is clicked', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
    render(<ResultBox {...baseProps} />);
    const shareBtn = screen.getByLabelText(/share result/i);
    fireEvent.click(shareBtn);
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(screen.getByText(/copied!/i)).toBeInTheDocument();
    });
  });

  it('shows loading skeleton when loading is true', () => {
    render(<ResultBox {...baseProps} loading={true} />);
    expect(screen.queryByText(/explanation/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/verdict/i)).not.toBeInTheDocument();
  });
}); 