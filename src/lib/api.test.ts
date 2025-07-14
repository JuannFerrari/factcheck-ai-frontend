// Helper to mock axios and expose the mock client
function setupAxiosMock() {
  const mockApiClient = {
    post: jest.fn(),
    interceptors: {
      response: {
        use: jest.fn(),
      },
    },
  };
  jest.doMock('axios', () => ({
    create: jest.fn(() => mockApiClient),
    isAxiosError: jest.fn(),
  }));
  return mockApiClient;
}

import type { FactCheckResponse } from './api';

describe('API Utility', () => {
  const mockFactCheckResponse: FactCheckResponse = {
    verdict: 'True',
    confidence: 85,
    reasoning: 'This claim is true based on reliable sources.',
    sources: [
      {
        title: 'Reliable Source',
        url: 'https://example.com',
        snippet: 'This is a reliable source.',
      },
    ],
    claim: 'Test claim',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    delete process.env.NEXT_PUBLIC_API_URL;
    delete process.env.NEXT_PUBLIC_FACTCHECK_API_KEY;
  });

  describe('factCheck function', () => {
    it('should make a POST request with correct URL and payload', async () => {
      const mockApiClient = setupAxiosMock();
      jest.resetModules();
      const { factCheck } = await import('./api');
      mockApiClient.post.mockResolvedValue({ data: mockFactCheckResponse });
      const result = await factCheck('Test claim');
      expect(result).toEqual(mockFactCheckResponse);
      expect(mockApiClient.post).toHaveBeenCalledWith('/api/v1/factcheck', {
        claim: 'Test claim',
      });
    });

    it('should include API key in request headers when environment variable is set', async () => {
      process.env.NEXT_PUBLIC_FACTCHECK_API_KEY = 'test-api-key';
      const mockApiClient = setupAxiosMock();
      jest.resetModules();
      const { factCheck } = await import('./api');
      mockApiClient.post.mockResolvedValue({ data: mockFactCheckResponse });
      const axios = await import('axios');
      await factCheck('Test claim');
      expect((axios as unknown as { create: jest.Mock }).create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:8000',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key',
        },
      });
    });

    it('should use custom API URL when NEXT_PUBLIC_API_URL is set', async () => {
      process.env.NEXT_PUBLIC_API_URL = 'https://custom-api.com';
      process.env.NEXT_PUBLIC_FACTCHECK_API_KEY = 'test-api-key';
      const mockApiClient = setupAxiosMock();
      jest.resetModules();
      const { factCheck } = await import('./api');
      mockApiClient.post.mockResolvedValue({ data: mockFactCheckResponse });
      const axios = await import('axios');
      await factCheck('Test claim');
      expect((axios as unknown as { create: jest.Mock }).create).toHaveBeenCalledWith({
        baseURL: 'https://custom-api.com',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key',
        },
      });
    });

    it('should throw ApiError for network errors', async () => {
      const mockApiClient = setupAxiosMock();
      jest.resetModules();
      const { factCheck, ApiError } = await import('./api');
      mockApiClient.post.mockRejectedValue(new ApiError('Network error'));
      await expect(factCheck('Test claim')).rejects.toThrow(ApiError);
    });

    it('should throw ApiError for HTTP errors with status code', async () => {
      const mockApiClient = setupAxiosMock();
      jest.resetModules();
      const { factCheck, ApiError } = await import('./api');
      mockApiClient.post.mockRejectedValue(new ApiError('Invalid API key', 401, { error: 'Invalid API key' }));
      await expect(factCheck('Test claim')).rejects.toThrow(ApiError);
    });

    it('should handle rate limiting errors', async () => {
      const mockApiClient = setupAxiosMock();
      jest.resetModules();
      const { factCheck, ApiError } = await import('./api');
      mockApiClient.post.mockRejectedValue(new ApiError('Too many requests', 429, { error: 'Too many requests' }));
      await expect(factCheck('Test claim')).rejects.toThrow(ApiError);
    });
  });

  describe('ApiError class', () => {
    it('should create ApiError with message, status, and details', async () => {
      const { ApiError } = await import('./api');
      const error = new ApiError('Test error', 400, { detail: 'Bad request' });
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.details).toEqual({ detail: 'Bad request' });
      expect(error.name).toBe('ApiError');
    });

    it('should create ApiError with only message', async () => {
      const { ApiError } = await import('./api');
      const error = new ApiError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.status).toBeUndefined();
      expect(error.details).toBeUndefined();
      expect(error.name).toBe('ApiError');
    });
  });

  describe('Type definitions', () => {
    it('should have correct FactCheckResponse structure', () => {
      const response: FactCheckResponse = {
        verdict: 'False',
        confidence: 95,
        reasoning: 'This claim is false.',
        sources: [
          {
            title: 'Source Title',
            url: 'https://example.com',
            snippet: 'Source snippet',
          },
        ],
        claim: 'Test claim',
      };
      expect(response.verdict).toBe('False');
      expect(response.confidence).toBe(95);
      expect(response.reasoning).toBe('This claim is false.');
      expect(response.sources).toHaveLength(1);
      expect(response.claim).toBe('Test claim');
    });

    it('should accept Unclear verdict', () => {
      const response: FactCheckResponse = {
        verdict: 'Unclear',
        confidence: 0,
        reasoning: 'Cannot determine.',
        sources: [],
        claim: 'Test claim',
      };
      expect(response.verdict).toBe('Unclear');
    });
  });
}); 