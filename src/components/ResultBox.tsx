import { ResultProps } from './ResultBox.types';
import { VerdictBadge } from './ResultBox/VerdictBadge';
import { ConfidenceBar } from './ResultBox/ConfidenceBar';
import { ExplanationBox } from './ResultBox/ExplanationBox';
import { SourcesList } from './ResultBox/SourcesList';
import { ShareButton } from './ResultBox/ShareButton';
import Spinner from './ResultBox/Spinner';

export default function ResultBox({ verdict, confidence, explanation, tldr, sources, loading, claim, loadingMessage }: ResultProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-4 lg:p-6 gap-4">
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <span className="text-sm lg:text-base font-medium text-gray-600 text-center">
            {loadingMessage || 'Gathering information and analyzing your claim...'}
          </span>
        </div>
        <div className="w-full mt-4 space-y-3">
          <div className="h-3 lg:h-4 bg-gray-200 rounded w-1/4 mx-auto animate-pulse"></div>
          <div className="h-3 lg:h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          <div className="h-3 lg:h-4 bg-gray-200 rounded w-5/6 mx-auto animate-pulse"></div>
          <div className="h-3 lg:h-4 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ShareButton claim={claim} verdict={verdict} confidence={confidence} explanation={explanation} sources={sources} />
      <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        {claim && (
          <div className="mb-2">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 break-words leading-tight">{claim}</h2>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <VerdictBadge verdict={verdict} />
          <ConfidenceBar confidence={confidence} />
        </div>

        {/* TL;DR Section */}
        {tldr && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm">TL;DR</h3>
            <p className="text-blue-800 text-sm leading-relaxed">{tldr}</p>
          </div>
        )}

        <ExplanationBox explanation={explanation} />
        <SourcesList sources={sources} />
      </div>
    </div>
  );
}
