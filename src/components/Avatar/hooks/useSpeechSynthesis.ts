
import { useState, useCallback, useRef } from 'react';
import { VoiceEmotion, SpeechOptions } from '../AvatarAPI';
import { useVoiceEmotions } from './useVoiceEmotions';
import { useVoiceSelection } from './useVoiceSelection';
import { useVisemeSimulation } from './useVisemeSimulation';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isInterruptedRef = useRef(false);
  const visemeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { getEmotionalSettings, processTextForEmotion } = useVoiceEmotions();
  const { selectVoice } = useVoiceSelection();
  const { simulateVisemes } = useVisemeSimulation();

  const cleanup = useCallback(() => {
    if (visemeIntervalRef.current) {
      clearInterval(visemeIntervalRef.current);
      visemeIntervalRef.current = null;
    }
    currentUtteranceRef.current = null;
    setIsSpeaking(false);
  }, []);

  const interrupt = useCallback(() => {
    if (currentUtteranceRef.current && isSpeaking) {
      console.log('Interrupting speech synthesis');
      isInterruptedRef.current = true;
      
      try {
        speechSynthesis.cancel();
      } catch (error) {
        console.error('Error canceling speech:', error);
      }
      
      cleanup();
    }
  }, [isSpeaking, cleanup]);

  const speak = useCallback(async (
    text: string, 
    options: SpeechOptions = {}
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (!('speechSynthesis' in window)) {
          reject(new Error('Speech synthesis not supported in this browser'));
          return;
        }

        if (!text || text.trim().length === 0) {
          reject(new Error('No text provided for speech synthesis'));
          return;
        }

        // Cancel any ongoing speech
        if (isSpeaking) {
          speechSynthesis.cancel();
          cleanup();
        }

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
        
        const utterance = new SpeechSynthesisUtterance(processedText);
        currentUtteranceRef.current = utterance;
        
        // Apply emotional voice settings with bounds checking
        utterance.rate = Math.max(0.1, Math.min(10, emotionalSettings.rate));
        utterance.pitch = Math.max(0, Math.min(2, emotionalSettings.pitch));
        utterance.volume = Math.max(0, Math.min(1, emotionalSettings.volume));

        // Handle voice loading and selection
        const handleVoiceSelection = () => {
          try {
            const voices = speechSynthesis.getVoices();
            if (voices.length === 0) {
              console.warn('No voices available for speech synthesis');
            } else {
              selectVoice(emotion, utterance);
            }
          } catch (error) {
            console.error('Error selecting voice:', error);
          }
        };

        // Wait for voices to load if they're not ready
        if (speechSynthesis.getVoices().length === 0) {
          const voiceLoadTimeout = setTimeout(() => {
            console.warn('Voice loading timeout - proceeding with default voice');
            speechSynthesis.onvoiceschanged = null;
          }, 3000);

          speechSynthesis.onvoiceschanged = () => {
            clearTimeout(voiceLoadTimeout);
            handleVoiceSelection();
            speechSynthesis.onvoiceschanged = null;
          };
        } else {
          handleVoiceSelection();
        }

        utterance.onstart = () => {
          if (isInterruptedRef.current) return;
          
          console.log('Speech synthesis started');
          setIsSpeaking(true);
          options.onStart?.();
          
          // Enhanced viseme simulation with cleanup
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

        // Add natural pause before speaking based on emotion
        const pauseTimeout = setTimeout(() => {
          if (!isInterruptedRef.current) {
            try {
              speechSynthesis.speak(utterance);
            } catch (error) {
              console.error('Error starting speech synthesis:', error);
              cleanup();
              reject(error);
            }
          }
        }, emotionalSettings.pauseDuration);

        // Store timeout for cleanup
        const timeoutCleanup = () => clearTimeout(pauseTimeout);
        utterance.addEventListener('start', timeoutCleanup, { once: true });
        utterance.addEventListener('error', timeoutCleanup, { once: true });

      } catch (error) {
        console.error('Speech synthesis setup error:', error);
        cleanup();
        reject(error);
      }
    });
  }, [getEmotionalSettings, processTextForEmotion, selectVoice, simulateVisemes, isSpeaking, cleanup]);

  return { 
    speak, 
    isSpeaking, 
    interrupt,
    canInterrupt: isSpeaking
  };
};
