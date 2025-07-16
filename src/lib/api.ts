import axios from 'axios';

// API service for communicating with the backend

// Use the local Next.js API route instead of calling backend directly
const API_BASE_URL = '/api';

// Create a centralized API client with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
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
  verdict: 'True' | 'False' | 'Unclear' | 'Disputed' | 'Rejected';
  confidence: number;
  reasoning: string;
  tldr?: string;
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
    const response = await apiClient.post('/factcheck', {
      claim
    });

    return response.data;
  } catch (error: unknown) {
    // Error is already handled by the interceptor, but we need to re-throw it
    throw error;
  }
}
