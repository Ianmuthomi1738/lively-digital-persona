
import { useState, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(async (
    text: string, 
    onViseme?: (viseme: string) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      // Try to use a female voice
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Woman') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen') ||
        voice.name.includes('Victoria')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        // Simple viseme simulation based on speech timing
        if (onViseme) {
          const words = text.split(' ');
          let wordIndex = 0;
          const visemeInterval = setInterval(() => {
            if (wordIndex < words.length) {
              const word = words[wordIndex];
              // Simple viseme mapping based on word characteristics
              if (word.toLowerCase().includes('o') || word.toLowerCase().includes('u')) {
                onViseme('OW');
              } else if (word.toLowerCase().includes('a')) {
                onViseme('AH');
              } else if (word.toLowerCase().includes('e') || word.toLowerCase().includes('i')) {
                onViseme('IY');
              } else {
                onViseme('AE');
              }
              wordIndex++;
            } else {
              clearInterval(visemeInterval);
              onViseme('sil');
            }
          }, 300);
        }
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      speechSynthesis.speak(utterance);
    });
  }, []);

  return { speak, isSpeaking };
};
