export function ExplanationBox({ explanation }: { explanation: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
      <h3 className="font-medium text-gray-900 mb-1">Explanation:</h3>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{explanation}</p>
    </div>
  );
} 