
import React, { useCallback, useRef } from 'react';
import type { MediaType } from '../types';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  mediaType: MediaType;
  previewUrl: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, mediaType, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onFileSelect(event.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const acceptType = mediaType === 'image' ? 'image/*' : 'video/*';
  const capitalMediaType = mediaType.charAt(0).toUpperCase() + mediaType.slice(1);

  return (
    <div 
      className="w-full p-4 transition-all duration-300 border-2 border-dashed rounded-lg bg-brand-secondary/50 border-gray-600 hover:border-brand-accent hover:bg-brand-secondary"
      onClick={() => fileInputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptType}
        onChange={handleFileChange}
      />
      {previewUrl ? (
        <div className="flex items-center justify-center max-h-80">
          {mediaType === 'image' ? (
            <img src={previewUrl} alt="Preview" className="object-contain w-full h-full max-h-80 rounded-md" />
          ) : (
            <video src={previewUrl} controls className="object-contain w-full h-full max-h-80 rounded-md" />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 cursor-pointer text-brand-light">
          <UploadIcon className="w-12 h-12 text-gray-500" />
          <p className="mt-4 text-lg font-semibold">Drop your {mediaType} here or <span className="text-brand-accent">browse</span></p>
          <p className="mt-1 text-sm text-gray-400">Maximum file size: 50MB</p>
          <p className="mt-1 text-xs text-gray-500">(For videos, shorter clips provide faster results)</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
