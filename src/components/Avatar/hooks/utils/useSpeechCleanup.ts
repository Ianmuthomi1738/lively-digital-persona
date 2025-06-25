
import { useCallback, useRef } from 'react';

export const useSpeechCleanup = (
  setIsSpeaking: (speaking: boolean) => void,
  visemeIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>,
  currentUtteranceRef: React.MutableRefObject<SpeechSynthesisUtterance | null>
) => {
  const isCleaningUpRef = useRef(false);

  const cleanup = useCallback(() => {
    if (isCleaningUpRef.current) return;
    
    isCleaningUpRef.current = true;
    
    try {
      console.log('Starting speech synthesis cleanup');
      
      if (visemeIntervalRef.current) {
        clearInterval(visemeIntervalRef.current);
        visemeIntervalRef.current = null;
      }
      
      if (currentUtteranceRef.current) {
        const utterance = currentUtteranceRef.current;
        
        try {
          utterance.onstart = null;
          utterance.onend = null;
          utterance.onerror = null;
        } catch (e) {
          console.warn('Could not clear utterance listeners:', e);
        }
        
        currentUtteranceRef.current = null;
      }
      
      setIsSpeaking(false);
      console.log('Speech synthesis cleanup completed');
      
    } catch (error) {
      console.error('Error during speech synthesis cleanup:', error);
    } finally {
      isCleaningUpRef.current = false;
    }
  }, [setIsSpeaking, visemeIntervalRef, currentUtteranceRef]);

  return { cleanup, isCleaningUpRef };
};
