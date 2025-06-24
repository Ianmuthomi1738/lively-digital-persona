
import { useState, useCallback, useRef, useMemo } from 'react';
import { VoiceEmotion, SpeechOptions } from '../AvatarAPI';
import { useVoiceEmotions } from './useVoiceEmotions';
import { useVoiceSelection } from './useVoiceSelection';
import { useVisemeSimulation } from './useVisemeSimulation';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isInterruptedRef = useRef(false);
  const visemeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { getEmotionalSettings, processTextForEmotion } = useVoiceEmotions();
  const { selectVoice } = useVoiceSelection();
  const { simulateVisemes } = useVisemeSimulation();

  // Memoized cleanup function for better performance
  const cleanup = useCallback(() => {
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }
    
    if (visemeIntervalRef.current) {
      clearInterval(visemeIntervalRef.current);
      visemeIntervalRef.current = null;
    }
    currentUtteranceRef.current = null;
    setIsSpeaking(false);
  }, []);

  // Optimized interrupt function
  const interrupt = useCallback(() => {
    if (currentUtteranceRef.current && isSpeaking) {
      console.log('Interrupting speech synthesis');
      isInterruptedRef.current = true;
      
      try {
        // Cancel speech immediately
        speechSynthesis.cancel();
      } catch (error) {
        console.error('Error canceling speech:', error);
      }
      
      // Immediate cleanup
      cleanup();
    }
  }, [isSpeaking, cleanup]);

  // Check if speech synthesis is supported
  const isSupported = useMemo(() => {
    return 'speechSynthesis' in window;
  }, []);

  // Optimized speak function with better error handling and performance
  const speak = useCallback(async (
    text: string, 
    options: SpeechOptions = {}
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Early validation
        if (!isSupported) {
          reject(new Error('Speech synthesis not supported in this browser'));
          return;
        }

        if (!text || text.trim().length === 0) {
          reject(new Error('No text provided for speech synthesis'));
          return;
        }

        // Cancel any ongoing speech immediately
        if (isSpeaking) {
          speechSynthesis.cancel();
          cleanup();
        }

        // Reset state
        isInterruptedRef.current = false;
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
        
        // Create utterance with optimized settings
        const utterance = new SpeechSynthesisUtterance(processedText);
        currentUtteranceRef.current = utterance;
        
        // Apply settings with validation
        utterance.rate = Math.max(0.1, Math.min(10, emotionalSettings.rate));
        utterance.pitch = Math.max(0, Math.min(2, emotionalSettings.pitch));
        utterance.volume = Math.max(0, Math.min(1, emotionalSettings.volume));

        // Optimized voice selection
        try {
          selectVoice(emotion, utterance);
        } catch (error) {
          console.error('Error selecting voice:', error);
        }

        // Event handlers with improved error handling
        utterance.onstart = () => {
          if (isInterruptedRef.current) return;
          
          console.log('Speech synthesis started');
          setIsSpeaking(true);
          options.onStart?.();
          
          // Start viseme simulation
          if (options.onViseme) {
            try {
              visemeIntervalRef.current = simulateVisemes(text, emotion, options.onViseme, isInterruptedRef);
            } catch (error) {
              console.error('Error starting viseme simulation:', error);
            }
          }
        };

        utterance.onend = () => {
          console.log('Speech synthesis ended');
          cleanup();
          
          if (isInterruptedRef.current) {
            options.onInterrupted?.();
          } else {
            options.onEnd?.();
          }
          resolve();
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error);
          cleanup();
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        // Start speaking with minimal delay for better performance
        const startSpeaking = () => {
          if (!isInterruptedRef.current) {
            try {
              speechSynthesis.speak(utterance);
            } catch (error) {
              console.error('Error starting speech synthesis:', error);
              cleanup();
              reject(error);
            }
          }
        };

        // Reduced pause for better responsiveness
        const pauseDelay = Math.min(emotionalSettings.pauseDuration, 100);
        cleanupTimeoutRef.current = setTimeout(startSpeaking, pauseDelay);

      } catch (error) {
        console.error('Speech synthesis setup error:', error);
        cleanup();
        reject(error);
      }
    });
  }, [getEmotionalSettings, processTextForEmotion, selectVoice, simulateVisemes, isSpeaking, cleanup, isSupported]);

  return { 
    speak, 
    isSpeaking, 
    interrupt,
    canInterrupt: isSpeaking
  };
};
