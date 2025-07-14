import { render, screen } from '@testing-library/react';
import { ConfidenceBar } from './ConfidenceBar';

describe('ConfidenceBar', () => {
  it('renders the confidence label and value', () => {
    render(<ConfidenceBar confidence={80} />);
    expect(screen.getByText(/confidence/i)).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('sets the progress bar width according to confidence', () => {
    render(<ConfidenceBar confidence={42} />);
    const bar = screen.getByRole('progressbar', { hidden: true }) || document.querySelector('.bg-blue-500');
    // fallback: check style attribute
    expect(bar?.getAttribute('style')).toMatch(/width: 42%/);
  });
}); 