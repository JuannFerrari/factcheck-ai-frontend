import { Source } from '@/lib/api';
import { Link as LinkIcon } from 'lucide-react';

export function SourcesList({ sources }: { sources?: Source[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-gray-900 mb-2">Sources:</h3>
      <div className="grid gap-3">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            aria-label={`Source: ${source.title}`}
          >
            <div className="flex items-center mb-1">
              <span className="text-gray-400 mr-2">{index + 1}.</span>
              <LinkIcon className="w-4 h-4 mr-2 text-blue-500 group-hover:text-blue-700" />
              <span className="text-blue-700 group-hover:underline font-medium">
                {source.title}
              </span>
            </div>
            {source.snippet && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {source.snippet}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
} 