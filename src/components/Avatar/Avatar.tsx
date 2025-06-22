
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { AvatarAPI, SpeechOptions } from './AvatarAPI';
import { SiriAvatar } from './SiriAvatar';
import { VoiceSettings } from './VoiceSettings';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

interface AvatarProps {
  expression?: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised';
  onSpeakingStateChange?: (isSpeaking: boolean) => void;
  onInterrupted?: () => void;
}

export const Avatar = forwardRef<AvatarAPI, AvatarProps>(({ 
  expression = 'neutral',
  onSpeakingStateChange,
  onInterrupted
}, ref) => {
  const { speak, isSpeaking, interrupt, canInterrupt } = useSpeechSynthesis();
  const { listen } = useSpeechRecognition();
  const [isListening, setIsListening] = React.useState(false);
  const [voiceStyle, setVoiceStyle] = React.useState('natural');

  useEffect(() => {
    onSpeakingStateChange?.(isSpeaking);
  }, [isSpeaking, onSpeakingStateChange]);

  const handleSpeak = async (text: string, options: SpeechOptions = {}): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        await speak(text, {
          ...options,
          onInterrupted: () => {
            onInterrupted?.();
            options.onInterrupted?.();
          }
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleListen = async (callback: (transcript: string) => void): Promise<void> => {
    setIsListening(true);
    try {
      await listen(callback);
    } finally {
      setIsListening(false);
    }
  };

  const handleSetExpression = (expr: typeof expression): void => {
    console.log('Expression changed to:', expr);
  };

  const handleInterrupt = (): void => {
    interrupt();
  };

  useImperativeHandle(ref, () => ({
    speak: handleSpeak,
    listen: handleListen,
    setExpression: handleSetExpression,
    interrupt: handleInterrupt,
    canInterrupt
  }));

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Enhanced mobile-optimized background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden">
        {/* Responsive animated background patterns */}
        <div className="absolute inset-0 opacity-20 sm:opacity-30">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 sm:w-32 sm:h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-40 sm:h-40 bg-gradient-radial from-white/5 to-transparent rounded-full" />
        </div>
      </div>

      {/* Settings button - positioned for mobile accessibility */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
        <VoiceSettings 
          currentVoice={voiceStyle}
          onVoiceChange={setVoiceStyle}
        />
      </div>

      {/* Interrupt button when speaking */}
      {canInterrupt && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
          <button
            onClick={handleInterrupt}
            className="bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 shadow-lg"
          >
            Stop
          </button>
        </div>
      )}

      {/* Enhanced Siri-style avatar with mobile optimization */}
      <div className="relative z-0 flex items-center justify-center">
        <SiriAvatar 
          isSpeaking={isSpeaking} 
          isListening={isListening}
          voiceStyle={voiceStyle}
        />
      </div>
    </div>
  );
});

Avatar.displayName = 'Avatar';
