
export type MediaType = 'image' | 'video';

export type Verdict = 'Real' | 'AI-Generated' | 'Inconclusive';

export interface AnalysisResult {
  verdict: Verdict;
  reasoning: string;
}
