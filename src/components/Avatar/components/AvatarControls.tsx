
import React from 'react';
import { VoiceSettings } from '../VoiceSettings';

interface AvatarControlsProps {
  voiceStyle: string;
  onVoiceChange: (style: string) => void;
  canInterrupt: boolean;
  onInterrupt: () => void;
  isMobile: boolean;
}

export const AvatarControls: React.FC<AvatarControlsProps> = ({
  voiceStyle,
  onVoiceChange,
  canInterrupt,
  onInterrupt,
  isMobile
}) => {
  return (
    <>
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        <VoiceSettings 
          currentVoice={voiceStyle}
          onVoiceChange={onVoiceChange}
        />
      </div>

      {canInterrupt && (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
          <button
            onClick={onInterrupt}
            className="bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 shadow-lg touch-manipulation"
          >
            Stop
          </button>
        </div>
      )}

      {isMobile && (
        <div className="absolute bottom-2 left-2 text-xs text-white/50">
          Mobile Mode
        </div>
      )}
    </>
  );
};
