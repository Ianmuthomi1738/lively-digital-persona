
import { useCallback } from 'react';

export const useSpeechInterruption = (
  isSpeaking: boolean,
  isInterruptedRef: React.MutableRefObject<boolean>,
  isMobileRef: React.MutableRefObject<boolean>,
  isCleaningUpRef: React.MutableRefObject<boolean>,
  cleanup: () => void
) => {
  const interrupt = useCallback(() => {
    if (!isSpeaking || isCleaningUpRef.current) return;

    console.log('Interrupting speech synthesis');
    isInterruptedRef.current = true;
    
    try {
      if (isMobileRef.current) {
        if (speechSynthesis.speaking) {
          speechSynthesis.pause();
          setTimeout(() => {
            if (speechSynthesis.paused) {
              speechSynthesis.cancel();
            }
            cleanup();
          }, 100);
        } else {
          cleanup();
        }
      } else {
        if (speechSynthesis.speaking || speechSynthesis.pending) {
          speechSynthesis.cancel();
        }
        setTimeout(cleanup, 50);
      }
      
    } catch (error) {
      console.error('Error interrupting speech synthesis:', error);
      cleanup();
    }
  }, [isSpeaking, isInterruptedRef, isMobileRef, isCleaningUpRef, cleanup]);

  return { interrupt };
};
