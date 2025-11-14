
import React from 'react';
import type { AnalysisResult } from '../types';
import Loader from './Loader';

interface ResultDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading, error }) => {
  const getVerdictClasses = (verdict: string) => {
    switch (verdict) {
      case 'Real':
        return 'bg-brand-green/20 text-brand-green border-brand-green/50';
      case 'AI-Generated':
        return 'bg-brand-red/20 text-brand-red border-brand-red/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-brand-red bg-brand-red/10 rounded-lg">
        <h3 className="text-xl font-bold">Analysis Failed</h3>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }
  
  if (!result) {
    return (
        <div className="p-8 text-center text-gray-400 border-2 border-dashed rounded-lg border-gray-700">
            <h3 className="text-lg font-semibold text-brand-light">Awaiting Analysis</h3>
            <p className="mt-2 text-sm">Upload an image or video and click "Detect" to see the results here.</p>
        </div>
    );
  }


  return (
    <div className="w-full p-6 space-y-4 bg-brand-secondary rounded-lg animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-brand-light">Analysis Report</h2>
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <span className="text-lg font-medium text-gray-300">Verdict:</span>
            <span className={`px-4 py-2 text-xl font-bold rounded-full border ${getVerdictClasses(result.verdict)}`}>
                {result.verdict}
            </span>
        </div>
        <div className="pt-4 border-t border-gray-700">
            <h3 className="text-xl font-semibold text-brand-light">Reasoning</h3>
            <p className="mt-2 text-base text-gray-300 whitespace-pre-wrap">{result.reasoning}</p>
        </div>
    </div>
  );
};

export default ResultDisplay;
