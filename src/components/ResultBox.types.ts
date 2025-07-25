import { Source } from '@/lib/api';

export type ResultProps = {
  verdict: string;
  confidence: number;
  explanation: string;
  tldr?: string;
  sources?: Source[];
  loading?: boolean;
  claim?: string;
  loadingMessage?: string;
}; 