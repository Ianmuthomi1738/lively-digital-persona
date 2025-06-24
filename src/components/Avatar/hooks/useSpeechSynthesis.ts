
import { useState, useCallback, useRef } from 'react';
import { VoiceEmotion, SpeechOptions } from '../AvatarAPI';
import { useVoiceEmotions } from './useVoiceEmotions';
import { useVoiceSelection } from './useVoiceSelection';
import { useVisemeSimulation } from './useVisemeSimulation';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isInterruptedRef = useRef(false);

  const { getEmotionalSettings, processTextForEmotion } = useVoiceEmotions();
  const { selectVoice } = useVoiceSelection();
  const { simulateVisemes } = useVisemeSimulation();

  const interrupt = useCallback(() => {
    if (currentUtteranceRef.current && isSpeaking) {
      isInterruptedRef.current = true;
      speechSynthesis.cancel();
      setIsSpeaking(false);
      console.log('Speech interrupted by user');
    }
  }, [isSpeaking]);

  const speak = useCallback(async (
    text: string, 
    options: SpeechOptions = {}
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      if (isSpeaking) {
        speechSynthesis.cancel();
      }

      isInterruptedRef.current = false;
      const emotion = options.emotion || { type: 'neutral' };
      const emotionalSettings = getEmotionalSettings(emotion);
      const processedText = processTextForEmotion(text, emotion);
      
      const utterance = new SpeechSynthesisUtterance(processedText);
      currentUtteranceRef.current = utterance;
      
      // Apply emotional voice settings
      utterance.rate = emotionalSettings.rate;
      utterance.pitch = emotionalSettings.pitch;
      utterance.volume = emotionalSettings.volume;

      // Handle voice loading and selection
      const handleVoiceSelection = () => {
        selectVoice(emotion, utterance);
      };

      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = () => {
          handleVoiceSelection();
          speechSynthesis.onvoiceschanged = null;
        };
      } else {
        handleVoiceSelection();
      }

      utterance.onstart = () => {
        if (isInterruptedRef.current) return;
        setIsSpeaking(true);
        options.onStart?.();
        
        // Enhanced viseme simulation
        if (options.onViseme) {
          simulateVisemes(text, emotion, options.onViseme, isInterruptedRef);
        }
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        
        if (isInterruptedRef.current) {
          options.onInterrupted?.();
        } else {
          options.onEnd?.();
        }
        resolve();
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      // Add natural pause before speaking based on emotion
      setTimeout(() => {
        if (!isInterruptedRef.current) {
          speechSynthesis.speak(utterance);
        }
      }, emotionalSettings.pauseDuration);
    });
  }, [getEmotionalSettings, processTextForEmotion, selectVoice, simulateVisemes]);

  return { 
    speak, 
    isSpeaking, 
    interrupt,
    canInterrupt: isSpeaking
  };
};
