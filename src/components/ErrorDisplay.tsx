import { AlertTriangle, Wifi, Clock, Shield, Server, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api';

export interface ErrorInfo {
  message: string;
  icon: React.ReactNode;
  suggestion?: string;
  retryable: boolean;
}

export function getErrorInfo(error: unknown): ErrorInfo {
  if (error instanceof ApiError) {
    const status = error.status;

    // Rate limiting
    if (status === 429) {
      return {
        message: 'Too many requests. Please wait a moment before trying again.',
        icon: <Clock className="w-5 h-5" />,
        suggestion: 'Rate limit: 2 requests per second, 10 per minute',
        retryable: true
      };
    }

    // Authentication errors
    if (status === 401) {
      return {
        message: 'Authentication failed. Please check your API configuration.',
        icon: <Shield className="w-5 h-5" />,
        suggestion: 'Contact support if this persists',
        retryable: false
      };
    }

    // Server errors
    if (status && status >= 500) {
      return {
        message: 'Server error. Our fact-checking service is temporarily unavailable.',
        icon: <Server className="w-5 h-5" />,
        suggestion: 'Please try again in a few minutes',
        retryable: true
      };
    }

    // Bad request
    if (status === 400) {
      return {
        message: `Invalid request: ${error.message}`,
        icon: <AlertTriangle className="w-5 h-5" />,
        suggestion: 'Please check your input and try again',
        retryable: true
      };
    }

    // Other API errors
    return {
      message: error.message || 'API error occurred',
      icon: <AlertTriangle className="w-5 h-5" />,
      retryable: true
    };
  }

  // Network errors
  if (error instanceof Error && error.message.includes('Network')) {
    return {
      message: 'Network error. Please check your internet connection.',
      icon: <Wifi className="w-5 h-5" />,
      suggestion: 'Try refreshing the page or check your connection',
      retryable: true
    };
  }

  // Generic error
  return {
    message: 'An unexpected error occurred. Please try again.',
    icon: <AlertTriangle className="w-5 h-5" />,
    suggestion: 'If this persists, please contact support',
    retryable: true
  };
}

export function getValidationError(message: string): ErrorInfo {
  return {
    message,
    icon: <AlertTriangle className="w-5 h-5" />,
    retryable: false
  };
}

interface ErrorDisplayProps {
  error: ErrorInfo;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="text-red-600 mt-0.5">
          {error.icon}
        </div>
        <div className="flex-1">
          <p className="text-red-700 font-medium">{error.message}</p>
          {error.suggestion && (
            <p className="text-red-600 text-sm mt-1">{error.suggestion}</p>
          )}
          {error.retryable && onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="mt-2 text-red-700 border-red-300 hover:bg-red-100"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 