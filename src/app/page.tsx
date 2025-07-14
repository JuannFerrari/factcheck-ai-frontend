'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ResultBox from '@/components/ResultBox';
import { ResultProps } from '@/components/ResultBox.types';
import { factCheck } from '@/lib/api';
import { ErrorDisplay, getErrorInfo, getValidationError, ErrorInfo } from '@/components/ErrorDisplay';
import { AlertTriangle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'factcheck_results';
const PAGE_SIZE = 5;

const LOADING_MESSAGE = 'Gathering information and analyzing your claim...';

export default function HomePage() {
  const [claim, setClaim] = useState('');
  const [results, setResults] = useState<ResultProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Load results from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setResults(JSON.parse(stored));
      } catch {
        setResults([]);
      }
    }
  }, []);

  // Save results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(results));
  }, [results]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!claim.trim()) {
      setError(getValidationError('Please enter a claim to check'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await factCheck(claim);
      const newResult: ResultProps = {
        verdict: response.verdict,
        confidence: response.confidence,
        explanation: response.reasoning,
        sources: response.sources,
        claim: response.claim,
      };
      setResults(prev => [newResult, ...prev]);
      setClaim(''); // Clear the input after successful check
      setVisibleCount(PAGE_SIZE); // Reset visible count to show latest
    } catch (err) {
      setError(getErrorInfo(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (error?.retryable) {
      setError(null);
      handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(count => count + PAGE_SIZE);
  };

  return (
    <main className="max-w-xl mx-auto mt-5 p-4 space-y-6">
      <h1 className="text-3xl font-semibold">🧠 FactCheck AI</h1>

      <p className="text-muted-foreground text-sm mb-2">
        Enter a factual claim (e.g., “The Eiffel Tower is taller than the Statue of Liberty”) and click <span className="font-medium">Check Claim</span>. The AI will analyze your statement, search for supporting evidence, and provide a verdict with sources.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Paste a claim to check..."
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          className="h-32"
          required
          disabled={loading}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Checking...' : 'Check Claim'}
        </Button>
      </form>

      <div className="flex items-start gap-2 bg-yellow-100 text-yellow-800 rounded p-2 mb-1 text-xs italic">
        <AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-500" />
        <div>
          <span className="font-semibold">Disclaimer:</span> This is an experimental project. Always double-check the sources and do not rely solely on these results for important decisions.
        </div>
      </div>

      {error && <ErrorDisplay error={error} onRetry={handleRetry} />}

      <div className="max-h-[600px] overflow-y-auto space-y-6 mt-4">
        {loading && <ResultBox loading={true} verdict="" confidence={0} explanation="" claim={claim} loadingMessage={LOADING_MESSAGE} />}
        {results.slice(0, visibleCount).map((res, idx) => (
          <ResultBox key={idx + (res.claim || '')} {...res} />
        ))}
      </div>
      {visibleCount < results.length && (
        <Button onClick={handleLoadMore} className="w-full mt-2" variant="outline">
          Load more
        </Button>
      )}
    </main>
  );
}
