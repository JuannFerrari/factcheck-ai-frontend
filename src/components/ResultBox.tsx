import { Card, CardContent } from '@/components/ui/card';

export type ResultProps = {
  verdict: string;
  confidence: number;
  explanation: string;
};

export default function ResultBox({ verdict, confidence, explanation }: ResultProps) {
  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <p className="text-lg font-medium">
          <strong>Verdict:</strong> {verdict}
        </p>
        <p className="text-muted-foreground">
          <strong>Confidence:</strong> {confidence}%
        </p>
        <p className="text-sm text-gray-700">{explanation}</p>
      </CardContent>
    </Card>
  );
}
