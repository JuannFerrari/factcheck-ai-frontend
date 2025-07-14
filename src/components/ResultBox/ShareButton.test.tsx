import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareButton } from './ShareButton';

describe('ShareButton', () => {
  const baseProps = {
    claim: 'Test claim',
    verdict: 'True',
    confidence: 99,
    explanation: 'Test explanation',
    sources: [
      { title: 'Source 1', url: 'https://example.com/1', snippet: 'Snippet 1' },
      { title: 'Source 2', url: 'https://example.com/2', snippet: 'Snippet 2' },
    ],
  };

  it('copies the result to clipboard and shows Copied! message', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
    render(<ShareButton {...baseProps} />);
    fireEvent.click(screen.getByLabelText(/share result/i));
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(screen.getByText(/copied!/i)).toBeInTheDocument();
    });
  });

  it('includes sources in the copied text', async () => {
    let copiedText = '';
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn((text) => { copiedText = text; return Promise.resolve(); }),
      },
    });
    render(<ShareButton {...baseProps} />);
    fireEvent.click(screen.getByLabelText(/share result/i));
    await waitFor(() => {
      expect(copiedText).toMatch(/Sources:/);
      expect(copiedText).toMatch(/Source 1/);
      expect(copiedText).toMatch(/https:\/\/example.com\/1/);
    });
  });

  it('does not throw if clipboard copy fails', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockRejectedValue(new Error('fail')),
      },
    });
    render(<ShareButton {...baseProps} />);
    fireEvent.click(screen.getByLabelText(/share result/i));
    await waitFor(() => {
      expect(screen.queryByText(/copied!/i)).not.toBeInTheDocument();
    });
  });
}); 