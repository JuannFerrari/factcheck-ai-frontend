import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Source } from '@/lib/api';

export function ShareButton({ claim, verdict, confidence, explanation, sources }: {
  claim?: string;
  verdict: string;
  confidence: number;
  explanation: string;
  sources?: Source[];
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    let text = `🧠 FactCheck AI\n\nClaim: ${claim || ''}\nVerdict: ${verdict}\nConfidence: ${confidence}%\n\nExplanation:\n${explanation}`;
    if (sources && sources.length > 0) {
      text += `\n\nSources:`;
      for (const src of sources) {
        text += `\n- ${src.title} (${src.url})`;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="absolute top-3 right-3 flex items-center">
      <button
        onClick={handleShare}
        className="p-1 rounded hover:bg-gray-100 transition-colors"
        title="Copy result to clipboard"
        aria-label="Share result"
        type="button"
      >
        <Share2 className="w-5 h-5 text-gray-400 hover:text-gray-700" />
      </button>
      {copied && (
        <span className="ml-2 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow z-10">Copied!</span>
      )}
    </div>
  );
} 