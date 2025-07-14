import { render, screen } from '@testing-library/react';
import { SourcesList } from './SourcesList';

describe('SourcesList', () => {
  const sources = [
    { title: 'Source 1', url: 'https://example.com/1', snippet: 'Snippet 1' },
    { title: 'Source 2', url: 'https://example.com/2', snippet: 'Snippet 2' },
  ];

  it('renders all sources with title and snippet', () => {
    render(<SourcesList sources={sources} />);
    for (const src of sources) {
      expect(screen.getByText(src.title)).toBeInTheDocument();
      expect(screen.getByText(src.snippet!)).toBeInTheDocument();
    }
  });

  it('renders nothing if sources is empty', () => {
    const { container } = render(<SourcesList sources={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing if sources is undefined', () => {
    const { container } = render(<SourcesList />);
    expect(container).toBeEmptyDOMElement();
  });
}); 