
import React from 'react';

export const AvatarBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden">
      <div className="absolute inset-0 opacity-10 sm:opacity-30">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-32 sm:h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 sm:w-24 sm:h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-40 sm:h-40 bg-gradient-radial from-white/5 to-transparent rounded-full" />
      </div>
    </div>
  );
};
