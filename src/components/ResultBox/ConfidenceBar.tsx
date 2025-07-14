export function ConfidenceBar({ confidence }: { confidence: number }) {
  return (
    <div className="w-full mt-1">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Confidence</span>
        <span className="text-sm font-semibold text-gray-900">{confidence}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${confidence}%` }}
          role="progressbar"
        ></div>
      </div>
    </div>
  );
} 