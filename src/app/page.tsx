'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ResultBox, { ResultProps } from '@/components/ResultBox';

export default function HomePage() {
  const [claim, setClaim] = useState('');
  const [result, setResult] = useState<ResultProps | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Replace this with actual API call
    setResult({
      verdict: 'Unclear',
      confidence: 55,
      explanation: 'This is a placeholder explanation while we wire the backend.',
    });
  };

  return (
    <main className="max-w-xl mx-auto mt-20 p-4 space-y-6">
      <h1 className="text-3xl font-semibold">🧠 FactCheck AI</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Paste a claim to check..."
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          className="h-32"
          required
        />
        <Button type="submit" className="w-full">
          Check Claim
        </Button>
      </form>

      {result && <ResultBox {...result} />}
    </main>
  );
}
