import { render, screen } from '@testing-library/react';
import { VerdictBadge } from './VerdictBadge';

describe('VerdictBadge', () => {
  it('renders True verdict with correct label and color', () => {
    render(<VerdictBadge verdict="True" />);
    const badge = screen.getByLabelText(/verdict/i);
    expect(badge).toHaveTextContent('True');
    expect(badge.className).toMatch(/green/);
  });

  it('renders False verdict with correct label and color', () => {
    render(<VerdictBadge verdict="False" />);
    const badge = screen.getByLabelText(/verdict/i);
    expect(badge).toHaveTextContent('False');
    expect(badge.className).toMatch(/red/);
  });

  it('renders Unclear verdict with correct label and color', () => {
    render(<VerdictBadge verdict="Unclear" />);
    const badge = screen.getByLabelText(/verdict/i);
    expect(badge).toHaveTextContent('Unclear');
    expect(badge.className).toMatch(/gray/);
  });
}); 