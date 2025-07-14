import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorDisplay, ErrorInfo } from './ErrorDisplay';
import { AlertTriangle } from 'lucide-react';

describe('ErrorDisplay', () => {
  const baseError: ErrorInfo = {
    message: 'Something went wrong',
    icon: <AlertTriangle data-testid="icon" className="w-5 h-5" />,
    retryable: false,
  };

  it('renders the error message and icon', () => {
    render(<ErrorDisplay error={baseError} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders the suggestion if provided', () => {
    const error: ErrorInfo = {
      ...baseError,
      suggestion: 'Try again later',
    };
    render(<ErrorDisplay error={error} />);
    expect(screen.getByText('Try again later')).toBeInTheDocument();
  });

  it('renders the retry button if retryable and calls onRetry', () => {
    const error: ErrorInfo = {
      ...baseError,
      retryable: true,
    };
    const onRetry = jest.fn();
    render(<ErrorDisplay error={error} onRetry={onRetry} />);
    const button = screen.getByRole('button', { name: /try again/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalled();
  });

  it('does not render retry button if not retryable', () => {
    render(<ErrorDisplay error={baseError} onRetry={jest.fn()} />);
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });
}); 