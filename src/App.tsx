import React, { useState, useEffect } from 'react';
import { detectDeepfake } from './services/geminiService';   // FIXED
import type { MediaType, AnalysisResult } from './types';
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';
import { ImageIcon, VideoIcon } from './components/icons';

const App: React.FC = () => {
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetState = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  const handleMediaTypeChange = (type: MediaType) => {
    setMediaType(type);
    resetState();
  };

  const handleFileSelect = (selectedFile: File) => {
    resetState();
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };
  
  const handleClear = () => {
    resetState();
  };

  const handleDetect = async () => {
  if (!file) {
    setError("Please select a file first.");
    return;
  }

  setIsLoading(true);
  setError(null);
  setResult(null);

  try {
    const analysisResult = await detectDeepfake(file);
    setResult(analysisResult);
  } catch (err) {
    setError("Error analyzing image.");
  } finally {
    setIsLoading(false);
  }
};


  const TabButton: React.FC<{type: MediaType; label: string; icon: React.ReactNode}> = ({type, label, icon}) => (
    <button
      onClick={() => handleMediaTypeChange(type)}
      className={`flex items-center justify-center w-full px-4 py-3 text-lg font-semibold transition-colors duration-300 rounded-t-lg focus:outline-none ${
        mediaType === type
          ? 'bg-brand-secondary text-brand-accent border-b-2 border-brand-accent'
          : 'text-gray-400 hover:bg-brand-secondary/50 hover:text-brand-light'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen p-4 text-brand-light bg-brand-primary sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
            AI Deepfake Detector
          </h1>
          <p className="mt-3 text-lg text-gray-300">
            Uncover the truth. Upload an image or video to check for AI manipulation.
          </p>
        </header>

        <main className="mt-8">
          <div className="p-6 space-y-6 bg-brand-secondary/70 backdrop-blur-sm rounded-xl shadow-2xl">
            <div className="flex border-b border-gray-700">
              <TabButton type="image" label="Image Detector" icon={<ImageIcon />} />
              <TabButton type="video" label="Video Detector" icon={<VideoIcon />} />
            </div>

            <FileUpload
              onFileSelect={handleFileSelect}
              mediaType={mediaType}
              previewUrl={previewUrl}
            />

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleDetect}
                disabled={!file || isLoading}
                className="w-full px-6 py-3 text-lg font-bold text-white transition-all duration-300 rounded-lg shadow-lg bg-brand-accent hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-blue-400/50"
              >
                {isLoading ? 'Analyzing...' : 'Detect'}
              </button>
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="w-full px-6 py-3 font-semibold text-gray-300 transition-colors duration-300 bg-gray-700 rounded-lg sm:w-auto hover:bg-gray-600 disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            <ResultDisplay result={result} isLoading={isLoading} error={error} />
          </div>
        </main>

        <footer className="py-8 mt-8 text-center text-gray-500 border-t border-gray-800">
          <p>&copy; {new Date().getFullYear()} AI Deepfake Detector. Powered by Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
