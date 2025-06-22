
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

      // Enhanced female voice selection with better priority
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        // First priority: explicitly named female voices
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('susan') ||
        voice.name.toLowerCase().includes('alice') ||
        voice.name.toLowerCase().includes('emma') ||
        voice.name.toLowerCase().includes('sophia') ||
        voice.name.toLowerCase().includes('sara') ||
        voice.name.toLowerCase().includes('sarah')
      ) || voices.find(voice => 
        // Second priority: voices that are typically female based on language/region
        (voice.lang.startsWith('en') && voice.name.toLowerCase().includes('default') && voice.gender === 'female')
      ) || voices.find(voice => 
        // Third priority: any voice with female gender property
        voice.gender === 'female'
      ) || voices.find(voice => 
        // Fourth priority: common female voice patterns
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('cortana') ||
        voice.name.toLowerCase().includes('kate') ||
        voice.name.toLowerCase().includes('hazel')
      );
      
      // Set the female voice as default, fallback to system default if none found
      if (femaleVoice) {
        utterance.voice = femaleVoice;
        console.log('Selected female voice:', femaleVoice.name);
      } else {
        console.log('No female voice found, using system default');
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
