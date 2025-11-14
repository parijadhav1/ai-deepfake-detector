
import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-brand-light">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-accent"></div>
      <p className="mt-4 text-lg font-semibold">Analyzing Media...</p>
      <p className="mt-2 text-sm text-gray-400">Our AI is scrutinizing the details. This may take a moment.</p>
    </div>
  );
};

export default Loader;
