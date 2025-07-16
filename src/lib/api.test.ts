import axios from 'axios';
import { factCheck, FactCheckResponse, ApiError } from './api';

// Mock axios before importing the module
jest.mock('axios', () => {
  const mockApiClient = {
    post: jest.fn(),
    interceptors: {
      response: { use: jest.fn() }
    }
  };
  return {
    create: jest.fn(() => mockApiClient),
    isAxiosError: jest.fn(),
    __mockApiClient: mockApiClient // for test access if needed
  };
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockApiClient = (axios as any).__mockApiClient;

describe('API Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('factCheck()', () => {
    it('should make successful API call and return response', async () => {
      const mockResponse: FactCheckResponse = {
        verdict: 'False',
        confidence: 95,
        reasoning: 'This claim is false based on multiple sources.',
        tldr: 'This claim is false.',
        sources: [
          { title: 'Test Source', url: 'https://example.com', snippet: 'Test snippet' }
        ],
        claim: 'Test claim'
      };

      mockApiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await factCheck('Test claim');

      expect(result).toEqual(mockResponse);
      expect(mockApiClient.post).toHaveBeenCalledWith('/factcheck', {
        claim: 'Test claim'
      });
    });

    it('should handle response without TL;DR', async () => {
      const mockResponse: FactCheckResponse = {
        verdict: 'True',
        confidence: 85,
        reasoning: 'This claim is true.',
        sources: [{ title: 'Test Source', url: 'https://example.com' }],
        claim: 'Test claim'
      };

      mockApiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await factCheck('Test claim');

      expect(result).toEqual(mockResponse);
      expect(result.tldr).toBeUndefined();
    });

    it('should throw ApiError when API returns error response', async () => {
      const apiError = new ApiError('Internal server error', 500, { error: 'Internal server error' });
      mockApiClient.post.mockRejectedValueOnce(apiError);
      await expect(factCheck('Test claim')).rejects.toThrow(ApiError);
    });

    it('should throw ApiError on network error', async () => {
      const apiError = new ApiError('Network error');
      mockApiClient.post.mockRejectedValueOnce(apiError);
      await expect(factCheck('Test claim')).rejects.toThrow(ApiError);
    });

    it('should call correct endpoint with claim payload', async () => {
      mockApiClient.post.mockResolvedValueOnce({ data: {} });

      await factCheck('Some claim text');

      expect(mockApiClient.post).toHaveBeenCalledWith('/factcheck', {
        claim: 'Some claim text'
      });
    });
  });

  describe('FactCheckResponse interface', () => {
    it('should support all verdict types', () => {
      const verdicts: FactCheckResponse['verdict'][] = [
        'True', 'False', 'Unclear', 'Disputed', 'Rejected'
      ];

      verdicts.forEach(verdict => {
        const response: FactCheckResponse = {
          verdict,
          confidence: 80,
          reasoning: 'Test reasoning',
          sources: [],
          claim: 'Test claim'
        };
        expect(response.verdict).toBe(verdict);
      });
    });

    it('should allow optional TL;DR field', () => {
      const response: FactCheckResponse = {
        verdict: 'True',
        confidence: 90,
        reasoning: 'Test reasoning',
        sources: [],
        claim: 'Test claim'
      };

      expect(response.tldr).toBeUndefined();
    });
  });

  describe('ApiError class', () => {
    it('should create error with message, status, and details', () => {
      const error = new ApiError('Test error', 404, { error: 'Not found' });

      expect(error.message).toBe('Test error');
      expect(error.status).toBe(404);
      expect(error.details).toEqual({ error: 'Not found' });
      expect(error.name).toBe('ApiError');
    });

    it('should create error with only message', () => {
      const error = new ApiError('Simple error');

      expect(error.message).toBe('Simple error');
      expect(error.status).toBeUndefined();
      expect(error.details).toBeUndefined();
    });
  });
});
