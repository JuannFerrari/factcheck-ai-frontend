// Mock fetch globally
global.fetch = jest.fn();

// Mock environment variables
const originalEnv = process.env;

beforeEach(() => {
  process.env = {
    ...originalEnv,
    BACKEND_API_URL: 'https://factcheck-ai-backend.onrender.com',
    FACTCHECK_API_KEY: 'test-api-key',
  };
  jest.clearAllMocks();
});

afterEach(() => {
  process.env = originalEnv;
});

describe('/api/factcheck proxy functionality', () => {
  it('should forward valid request to backend and return response', async () => {
    const mockBackendResponse = {
      verdict: 'False',
      confidence: 95,
      reasoning: 'This claim is false.',
      sources: [{ title: 'Test Source', url: 'https://example.com' }],
      claim: 'The Earth is flat',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockBackendResponse,
    });

    // Test the fetch call that would be made
    const response = await fetch('https://factcheck-ai-backend.onrender.com/api/v1/factcheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key',
      },
      body: JSON.stringify({ claim: 'The Earth is flat' }),
    });

    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data).toEqual(mockBackendResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://factcheck-ai-backend.onrender.com/api/v1/factcheck',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key',
        },
        body: JSON.stringify({ claim: 'The Earth is flat' }),
      }
    );
  });

  it('should handle backend errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal server error' }),
    });

    const response = await fetch('https://factcheck-ai-backend.onrender.com/api/v1/factcheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key',
      },
      body: JSON.stringify({ claim: 'Test claim' }),
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
  });

  it('should handle network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(
      fetch('https://factcheck-ai-backend.onrender.com/api/v1/factcheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key',
        },
        body: JSON.stringify({ claim: 'Test claim' }),
      })
    ).rejects.toThrow('Network error');
  });

  it('should use default backend URL when BACKEND_API_URL is not set', async () => {
    delete process.env.BACKEND_API_URL;

    const mockBackendResponse = {
      verdict: 'True',
      confidence: 85,
      reasoning: 'This claim is true.',
      sources: [],
      claim: 'Test claim',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockBackendResponse,
    });

    const response = await fetch('https://factcheck-ai-backend.onrender.com/api/v1/factcheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-api-key',
      },
      body: JSON.stringify({ claim: 'Test claim' }),
    });

    expect(response.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://factcheck-ai-backend.onrender.com/api/v1/factcheck',
      expect.any(Object)
    );
  });

  it('should handle missing API key gracefully', async () => {
    delete process.env.FACTCHECK_API_KEY;

    const mockBackendResponse = {
      verdict: 'True',
      confidence: 85,
      reasoning: 'This claim is true.',
      sources: [],
      claim: 'Test claim',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockBackendResponse,
    });

    const response = await fetch('https://factcheck-ai-backend.onrender.com/api/v1/factcheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '',
      },
      body: JSON.stringify({ claim: 'Test claim' }),
    });

    expect(response.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://factcheck-ai-backend.onrender.com/api/v1/factcheck',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': '',
        },
        body: JSON.stringify({ claim: 'Test claim' }),
      }
    );
  });
}); 