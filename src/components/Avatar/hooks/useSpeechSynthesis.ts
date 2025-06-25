
import { useState, useCallback, useRef, useMemo } from 'react';
import { VoiceEmotion, SpeechOptions } from '../AvatarAPI';
import { useVoiceEmotions } from './useVoiceEmotions';
import { useMobileDetection } from './utils/useMobileDetection';
import { useSpeechCleanup } from './utils/useSpeechCleanup';
import { useSpeechInterruption } from './utils/useSpeechInterruption';
import { useUtteranceFactory } from './utils/useUtteranceFactory';
import { useSpeechHandlers } from './utils/useSpeechHandlers';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isInterruptedRef = useRef(false);
  const visemeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { getEmotionalSettings, processTextForEmotion } = useVoiceEmotions();
  const { isMobile, isMobileRef } = useMobileDetection();
  const { cleanup, isCleaningUpRef } = useSpeechCleanup(setIsSpeaking, visemeIntervalRef, currentUtteranceRef);
  const { interrupt } = useSpeechInterruption(isSpeaking, isInterruptedRef, isMobileRef, isCleaningUpRef, cleanup);
  const { createUtterance } = useUtteranceFactory();
  const { createEventHandlers } = useSpeechHandlers(setIsSpeaking, isInterruptedRef, isCleaningUpRef, visemeIntervalRef, isMobileRef, cleanup);

  const isSupported = useMemo(() => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }, []);

  const speak = useCallback(async (
    text: string, 
    options: SpeechOptions = {}
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (!isSupported) {
          reject(new Error('Speech synthesis not supported in this browser'));
          return;
        }

        if (!text || text.trim().length === 0) {
          reject(new Error('No text provided for speech synthesis'));
          return;
        }

        // Better mobile handling
        if (isSpeaking) {
          console.log('Canceling existing speech for new request');
          try {
            if (isMobileRef.current) {
              // More gentle cancellation for mobile
              if (speechSynthesis.speaking) {
                speechSynthesis.pause();
                setTimeout(() => {
                  if (speechSynthesis.paused || speechSynthesis.speaking) {
                    speechSynthesis.cancel();
                  }
                }, 100);
              }
            } else {
              speechSynthesis.cancel();
            }
            cleanup();
          } catch (error) {
            console.warn('Error during speech cancellation:', error);
          }
        }

        isInterruptedRef.current = false;
        isCleaningUpRef.current = false;
        const emotion = options.emotion || { type: 'neutral' };
        
        let emotionalSettings;
        let processedText;
        
        try {
          emotionalSettings = getEmotionalSettings(emotion);
          processedText = processTextForEmotion(text, emotion);
        } catch (error) {
          console.error('Error processing emotion:', error);
          emotionalSettings = getEmotionalSettings({ type: 'neutral' });
          processedText = text;
        }
        
        const utterance = createUtterance(processedText, emotion, emotionalSettings, isMobileRef);
        currentUtteranceRef.current = utterance;

        const { onStart, onEnd, onError } = createEventHandlers(text, emotion, options, resolve, reject);
        
        utterance.onstart = onStart;
        utterance.onend = onEnd;
        utterance.onerror = onError;

        const startSpeaking = () => {
          if (isInterruptedRef.current || isCleaningUpRef.current) {
            cleanup();
            resolve();
            return;
          }
          
          try {
            if (!speechSynthesis) {
              throw new Error('Speech synthesis not available');
            }
            
            console.log('Starting speech synthesis...');
            
            // Better mobile compatibility
            if (isMobileRef.current) {
              // Ensure speech synthesis is ready on mobile
              if (speechSynthesis.paused) {
                speechSynthesis.resume();
              }
              
              // Add small delay for mobile stability
              setTimeout(() => {
                if (!isInterruptedRef.current && !isCleaningUpRef.current) {
                  speechSynthesis.speak(utterance);
                }
              }, 50);
            } else {
              speechSynthesis.speak(utterance);
            }
            
          } catch (error) {
            console.error('Error starting speech synthesis:', error);
            cleanup();
            reject(error instanceof Error ? error : new Error('Unknown error'));
          }
        };

        // Shorter delay for better responsiveness
        const delay = isMobileRef.current ? 100 : 50;
        setTimeout(startSpeaking, delay);

      } catch (error) {
        console.error('Speech synthesis setup error:', error);
        cleanup();
        reject(error instanceof Error ? error : new Error('Unknown error'));
      }
    });
  }, [getEmotionalSettings, processTextForEmotion, isSpeaking, cleanup, isSupported, createUtterance, createEventHandlers, isMobileRef, isCleaningUpRef]);

  return { 
    speak, 
    isSpeaking, 
    interrupt,
    canInterrupt: isSpeaking && !isCleaningUpRef.current,
    isMobile
  };
};
