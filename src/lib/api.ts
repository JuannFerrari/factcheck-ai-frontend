import axios from 'axios';

// API service for communicating with the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create a centralized API client with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.NEXT_PUBLIC_FACTCHECK_API_KEY,
  },
});

// Add response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.data?.error || error.message,
        error.response?.status,
        error.response?.data
      );
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0,
      error
    );
  }
);

export interface FactCheckRequest {
  claim: string;
}

export interface Source {
  title: string;
  url: string;
  snippet?: string;
}

export interface FactCheckResponse {
  verdict: 'True' | 'False' | 'Unclear';
  confidence: number;
  reasoning: string;
  sources: Source[];
  claim: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function factCheck(claim: string): Promise<FactCheckResponse> {
  try {
    const response = await apiClient.post('/api/v1/factcheck', {
      claim
    });
    return response.data;
  } catch (error: unknown) {
    // Error is already handled by the interceptor, but we need to re-throw it
    throw error;
  }
}
