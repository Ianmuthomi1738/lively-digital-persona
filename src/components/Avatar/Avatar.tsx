
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { AvatarAPI } from './AvatarAPI';
import { AvatarFace } from './AvatarFace';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useAnimations } from './hooks/useAnimations';

interface AvatarProps {
  expression?: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised';
  onSpeakingStateChange?: (isSpeaking: boolean) => void;
}

export const Avatar = forwardRef<AvatarAPI, AvatarProps>(({ 
  expression = 'neutral',
  onSpeakingStateChange 
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { speak, isSpeaking } = useSpeechSynthesis();
  const { listen } = useSpeechRecognition();
  const { 
    blinkState, 
    mouthState, 
    headTilt, 
    eyebrowRaise,
    currentExpression,
    setExpression,
    setMouthState
  } = useAnimations(expression);

  useEffect(() => {
    onSpeakingStateChange?.(isSpeaking);
  }, [isSpeaking, onSpeakingStateChange]);

  const handleSpeak = async (text: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        await speak(text, (viseme: string) => {
          // Map visemes to mouth shapes for lip-sync with proper typing
          const visemeMap: Record<string, 'closed' | 'small' | 'open' | 'wide' | 'rounded' | 'smile'> = {
            'sil': 'closed',
            'AE': 'open',
            'AH': 'wide',
            'AO': 'rounded',
            'EH': 'small',
            'ER': 'small',
            'IH': 'small',
            'IY': 'smile',
            'OW': 'rounded',
            'UH': 'small',
            'UW': 'rounded'
          };
          const mouthShape = visemeMap[viseme] || 'small';
          setMouthState(mouthShape);
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleListen = async (callback: (transcript: string) => void): Promise<void> => {
    return listen(callback);
  };

  const handleSetExpression = (expr: typeof expression): void => {
    setExpression(expr);
  };

  useImperativeHandle(ref, () => ({
    speak: handleSpeak,
    listen: handleListen,
    setExpression: handleSetExpression
  }));

  return (
    <div 
      ref={containerRef}
      className="relative w-96 h-[32rem] bg-gradient-to-b from-slate-100 via-white to-slate-50 rounded-3xl overflow-hidden shadow-xl border border-white/70"
      style={{
        transform: `rotate(${headTilt}deg)`,
        transition: 'transform 0.5s ease-out',
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.9) 0%, transparent 70%)'
      }}
    >
      <AvatarFace
        expression={currentExpression}
        blinkState={blinkState}
        mouthState={mouthState}
        eyebrowRaise={eyebrowRaise}
        isSpeaking={isSpeaking}
      />
    </div>
  );
});

Avatar.displayName = 'Avatar';
