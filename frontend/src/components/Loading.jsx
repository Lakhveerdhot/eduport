import React from 'react';

export default function Loading(){
  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-10 h-10 border-4 border-blue-400 border-dashed rounded-full animate-spin" />
    </div>
  );
}
