
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { AvatarAPI } from './AvatarAPI';
import { SiriAvatar } from './SiriAvatar';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

interface AvatarProps {
  expression?: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised';
  onSpeakingStateChange?: (isSpeaking: boolean) => void;
}

export const Avatar = forwardRef<AvatarAPI, AvatarProps>(({ 
  expression = 'neutral',
  onSpeakingStateChange 
}, ref) => {
  const { speak, isSpeaking } = useSpeechSynthesis();
  const { listen } = useSpeechRecognition();
  const [isListening, setIsListening] = React.useState(false);

  useEffect(() => {
    onSpeakingStateChange?.(isSpeaking);
  }, [isSpeaking, onSpeakingStateChange]);

  const handleSpeak = async (text: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        await speak(text);
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
    // Expression changes are now handled through the Siri-style animation states
    console.log('Expression changed to:', expr);
  };

  useImperativeHandle(ref, () => ({
    speak: handleSpeak,
    listen: handleListen,
    setExpression: handleSetExpression
  }));

  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      {/* Beautiful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-radial from-white/5 to-transparent rounded-full" />
        </div>
      </div>

      {/* Siri-style avatar */}
      <SiriAvatar isSpeaking={isSpeaking} isListening={isListening} />
    </div>
  );
});

Avatar.displayName = 'Avatar';
