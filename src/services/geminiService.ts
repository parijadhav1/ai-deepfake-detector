
import { GoogleGenAI } from "@google/genai";
import type { MediaType, AnalysisResult, Verdict } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. Please provide a valid API key for the app to function.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseAnalysisResponse = (responseText: string): AnalysisResult => {
  const verdictMatch = responseText.match(/Verdict:\s*(Real|AI-Generated|Inconclusive)/i);
  const reasoningMatch = responseText.match(/Reasoning:\s*([\s\S]*)/i);

  const verdict = verdictMatch ? verdictMatch[1] as Verdict : 'Inconclusive';
  const reasoning = reasoningMatch ? reasoningMatch[1].trim() : 'No detailed reasoning provided.';

  return { verdict, reasoning };
};


export const analyzeMedia = async (file: File, mediaType: MediaType): Promise<AnalysisResult> => {
  try {
    const base64Data = await fileToBase64(file);
    const model = ai.models;

    const prompt = `You are a world-class digital forensics expert specializing in deepfake detection. Your task is to analyze the provided ${mediaType} with extreme scrutiny. Look for any artifacts, inconsistencies, or tell-tale signs of AI generation. 

    Provide your response in the following format, and nothing else:
    Verdict: [Real/AI-Generated/Inconclusive]
    Reasoning: [A detailed, point-by-point explanation for your conclusion. Be specific about the visual evidence you found.]
    
    Examine elements such as:
    - For images: Unnatural skin texture, inconsistent lighting/shadows, background distortions, asymmetrical features, strange details in eyes, hair, or teeth.
    - For videos: Unnatural facial movements, weird blinking patterns, lack of emotion, poor lip-syncing, audio-visual mismatches.`;

    const response = await model.generateContent({
        model: 'gemini-2.5-pro',
        contents: {
            parts: [
                { text: prompt },
                {
                    inlineData: {
                        mimeType: file.type,
                        data: base64Data,
                    },
                },
            ],
        }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Received an empty response from the API.");
    }

    return parseAnalysisResponse(responseText);

  } catch (error) {
    console.error("Error analyzing media:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze the media. Details: ${error.message}`);
    }
    throw new Error("An unknown error occurred during media analysis.");
  }
};
