import { CheckCircle, XCircle, HelpCircle, Scale, AlertTriangle } from 'lucide-react';

export function VerdictBadge({ verdict }: { verdict: string }) {
  let color = 'bg-gray-200 text-gray-800';
  let icon = <HelpCircle className="w-4 h-4 mr-1" />;
  let label = 'Unclear';
  if (verdict.toLowerCase() === 'true') {
    color = 'bg-green-100 text-green-800 border border-green-300';
    icon = <CheckCircle className="w-4 h-4 mr-1 text-green-600" />;
    label = 'True';
  } else if (verdict.toLowerCase() === 'false') {
    color = 'bg-red-100 text-red-800 border border-red-300';
    icon = <XCircle className="w-4 h-4 mr-1 text-red-600" />;
    label = 'False';
  } else if (verdict.toLowerCase() === 'disputed') {
    color = 'bg-yellow-100 text-yellow-900 border border-yellow-300';
    icon = <Scale className="w-4 h-4 mr-1 text-yellow-700" />;
    label = 'Disputed';
  } else if (verdict.toLowerCase() === 'rejected') {
    color = 'bg-red-100 text-red-800 border border-red-300';
    icon = <AlertTriangle className="w-4 h-4 mr-1 text-red-600" />;
    label = 'Rejected';
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-semibold ${color}`} aria-label={`Verdict: ${label}`}>
      {icon}
      {label}
    </span>
  );
} 