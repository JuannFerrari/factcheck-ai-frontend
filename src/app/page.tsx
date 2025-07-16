'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ResultBox from '@/components/ResultBox';
import { ResultProps } from '@/components/ResultBox.types';
import { factCheck } from '@/lib/api';
import { ErrorDisplay, getErrorInfo, getValidationError, ErrorInfo } from '@/components/ErrorDisplay';
import { AlertTriangle, Search, Brain, Zap } from 'lucide-react';

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
    e.stopPropagation();

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
        tldr: response.tldr,
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              FactCheck AI
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              BETA
            </span>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Verify factual claims using AI-powered analysis and real-time web search
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-8">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-600 text-xs leading-relaxed">
                <strong>Disclaimer:</strong> This is an experimental AI-powered tool for educational and research purposes only.
                Results are provided &quot;as is&quot; without any warranties. The AI may make errors, miss context,
                provide incomplete analysis, return unexpected results, or misunderstand sources. Users should independently
                verify all information through authoritative sources and consult qualified professionals for important decisions.
                This tool is not intended to replace professional fact-checking, legal advice, medical advice, or other expert consultation.
                <strong>Do not rely on this tool for medical, legal, financial, or safety-critical decisions. Use at your own risk.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-5">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 shadow-sm lg:sticky lg:top-8">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Check a Claim</h2>

              <form className="space-y-4" noValidate onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="claim" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your claim
                  </label>
                  <Textarea
                    id="claim"
                    placeholder="e.g., 'The Eiffel Tower is taller than the Statue of Liberty'"
                    value={claim}
                    onChange={(e) => setClaim(e.target.value)}
                    className="h-32 resize-none"
                    required
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Check Claim
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-3">
            <div className="space-y-4 lg:space-y-6">
              {/* Error Display */}
              {error && <ErrorDisplay error={error} onRetry={handleRetry} />}

              {/* Loading State */}
              {loading && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 shadow-sm">
                  <ResultBox
                    loading={true}
                    verdict=""
                    confidence={0}
                    explanation=""
                    claim={claim}
                    loadingMessage={LOADING_MESSAGE}
                  />
                </div>
              )}

              {/* Results */}
              <div className="space-y-4 lg:space-y-6">
                {results.slice(0, visibleCount).map((res, idx) => (
                  <div key={idx + (res.claim || '')} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <ResultBox {...res} />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < results.length && (
                <div className="text-center pt-2">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    size="lg"
                    className="px-8"
                  >
                    Load More Results
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {!loading && results.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">No results yet</h3>
                  <p className="text-gray-600 text-sm">
                    Enter a claim above to start fact-checking
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
