import { Card, CardContent } from '@/components/ui/card';
import { ResultProps } from './ResultBox.types';
import { VerdictBadge } from './ResultBox/VerdictBadge';
import { ConfidenceBar } from './ResultBox/ConfidenceBar';
import { ExplanationBox } from './ResultBox/ExplanationBox';
import { SourcesList } from './ResultBox/SourcesList';
import { ShareButton } from './ResultBox/ShareButton';
import Spinner from './ResultBox/Spinner';

export default function ResultBox({ verdict, confidence, explanation, sources, loading, claim, loadingMessage }: ResultProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center min-h-[220px] p-8 gap-4">
          <div className="flex flex-col items-center gap-2">
            <Spinner />
            <span className="text-base font-medium text-muted-foreground text-center">
              {loadingMessage || 'Gathering information and analyzing your claim...'}
            </span>
          </div>
          <div className="w-full mt-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border border-gray-100 relative">
      <ShareButton claim={claim} verdict={verdict} confidence={confidence} explanation={explanation} sources={sources} />
      <CardContent className="space-y-6 p-6">
        {claim && (
          <div className="mb-2">
            <h2 className="text-xl font-bold text-gray-900 break-words">{claim}</h2>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <VerdictBadge verdict={verdict} />
          <ConfidenceBar confidence={confidence} />
        </div>
        <ExplanationBox explanation={explanation} />
        <SourcesList sources={sources} />
      </CardContent>
    </Card>
  );
}
