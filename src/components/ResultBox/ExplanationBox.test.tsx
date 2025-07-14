import { render, screen } from '@testing-library/react';
import { ExplanationBox } from './ExplanationBox';

describe('ExplanationBox', () => {
  it('renders the explanation heading and text', () => {
    render(<ExplanationBox explanation="This is a test explanation." />);
    expect(screen.getByRole('heading', { name: /explanation/i })).toBeInTheDocument();
    expect(screen.getByText('This is a test explanation.')).toBeInTheDocument();
  });
}); 