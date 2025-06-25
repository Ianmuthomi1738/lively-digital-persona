
import { SpeechOptions } from '../../AvatarAPI';
import { useVisemeSimulation } from '../useVisemeSimulation';

export const useSpeechHandlers = (
  setIsSpeaking: (speaking: boolean) => void,
  isInterruptedRef: React.MutableRefObject<boolean>,
  isCleaningUpRef: React.MutableRefObject<boolean>,
  visemeIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>,
  isMobileRef: React.MutableRefObject<boolean>,
  cleanup: () => void
) => {
  const { simulateVisemes } = useVisemeSimulation();

  const createEventHandlers = (
    text: string,
    emotion: any,
    options: SpeechOptions,
    resolve: () => void,
    reject: (error: Error) => void
  ) => {
    const onStart = () => {
      if (isInterruptedRef.current || isCleaningUpRef.current) return;
      
      try {
        console.log('Speech synthesis started successfully');
        setIsSpeaking(true);
        options.onStart?.();
        
        if (options.onViseme) {
          try {
            visemeIntervalRef.current = simulateVisemes(text, emotion, options.onViseme, isInterruptedRef);
          } catch (error) {
            console.error('Error starting viseme simulation:', error);
          }
        }
      } catch (error) {
        console.error('Error in speech start handler:', error);
      }
    };

    const onEnd = () => {
      try {
        console.log('Speech synthesis ended normally');
        
        if (isInterruptedRef.current) {
          options.onInterrupted?.();
        } else {
          options.onEnd?.();
        }
        
        if (isMobileRef.current) {
          setTimeout(cleanup, 100);
        } else {
          cleanup();
        }
        resolve();
        
      } catch (error) {
        console.error('Error in speech end handler:', error);
        cleanup();
        resolve();
      }
    };

    const onError = (event: SpeechSynthesisErrorEvent) => {
      try {
        console.error('Speech synthesis error event:', event.error);
        
        if (isInterruptedRef.current || (isMobileRef.current && event.error === 'interrupted')) {
          options.onInterrupted?.();
          cleanup();
          resolve();
        } else {
          cleanup();
          reject(new Error(`Speech synthesis error: ${event.error}`));
        }
      } catch (error) {
        console.error('Error in speech error handler:', error);
        cleanup();
        reject(error instanceof Error ? error : new Error('Unknown error'));
      }
    };

    return { onStart, onEnd, onError };
  };

  return { createEventHandlers };
};
