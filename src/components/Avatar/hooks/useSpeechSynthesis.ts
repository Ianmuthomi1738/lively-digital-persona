
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
      
      // Enhanced voice settings for more realistic speech
      utterance.rate = 0.85; // Slightly slower for more natural pace
      utterance.pitch = 1.0; // More neutral pitch
      utterance.volume = 0.9; // Higher volume for clarity

      // Wait for voices to load before selecting
      const selectVoice = () => {
        const voices = speechSynthesis.getVoices();
        
        // Priority order for more natural female voices
        const preferredVoices = [
          'Samantha', 'Karen', 'Victoria', 'Susan', 'Zira',
          'Microsoft Zira', 'Google US English Female',
          'Alex', 'Fiona', 'Moira', 'Tessa'
        ];

        let selectedVoice = null;

        // First, try to find exact matches from preferred list
        for (const preferredName of preferredVoices) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes(preferredName.toLowerCase())
          );
          if (selectedVoice) break;
        }

        // If no preferred voice found, look for any female-sounding voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('woman') ||
            voice.name.toLowerCase().includes('emma') ||
            voice.name.toLowerCase().includes('sophia') ||
            voice.name.toLowerCase().includes('sara') ||
            voice.name.toLowerCase().includes('sarah') ||
            voice.name.toLowerCase().includes('alice') ||
            voice.name.toLowerCase().includes('kate') ||
            voice.name.toLowerCase().includes('hazel')
          );
        }

        // Fallback to any English voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang.includes('en') && !voice.name.toLowerCase().includes('male')
          );
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log('Selected voice:', selectedVoice.name, 'Language:', selectedVoice.lang);
        } else {
          console.log('Using system default voice');
        }
      };

      // Handle voice loading
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = () => {
          selectVoice();
          speechSynthesis.onvoiceschanged = null; // Remove listener
        };
      } else {
        selectVoice();
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        // Improved viseme simulation with more natural timing
        if (onViseme) {
          const words = text.split(' ');
          let wordIndex = 0;
          const avgWordsPerMinute = 150; // More realistic speaking pace
          const msPerWord = (60 * 1000) / avgWordsPerMinute;
          
          const visemeInterval = setInterval(() => {
            if (wordIndex < words.length) {
              const word = words[wordIndex];
              // Enhanced viseme mapping for more natural lip sync
              if (/[ou]/i.test(word)) {
                onViseme('OW');
              } else if (/[aeiæ]/i.test(word)) {
                onViseme('AH');
              } else if (/[eiy]/i.test(word)) {
                onViseme('IY');
              } else if (/[bp]/i.test(word)) {
                onViseme('P');
              } else if (/[fv]/i.test(word)) {
                onViseme('F');
              } else {
                onViseme('AE');
              }
              wordIndex++;
            } else {
              clearInterval(visemeInterval);
              onViseme('sil');
            }
          }, msPerWord);
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

      // Add pause before speaking for more natural flow
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 100);
    });
  }, []);

  return { speak, isSpeaking };
};
