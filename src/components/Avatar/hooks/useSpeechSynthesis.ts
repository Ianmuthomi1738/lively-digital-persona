
import { useState, useCallback, useRef } from 'react';

export interface VoiceEmotion {
  type: 'neutral' | 'happy' | 'sad' | 'excited' | 'whisper' | 'laugh' | 'angry' | 'surprised';
  intensity?: number; // 0.1 to 1.0
}

export interface SpeechOptions {
  emotion?: VoiceEmotion;
  onViseme?: (viseme: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onInterrupted?: () => void;
}

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isInterruptedRef = useRef(false);

  const interrupt = useCallback(() => {
    if (currentUtteranceRef.current && isSpeaking) {
      isInterruptedRef.current = true;
      speechSynthesis.cancel();
      setIsSpeaking(false);
      console.log('Speech interrupted by user');
    }
  }, [isSpeaking]);

  const getEmotionalSettings = (emotion: VoiceEmotion) => {
    const intensity = emotion.intensity || 0.7;
    
    switch (emotion.type) {
      case 'happy':
        return {
          rate: 0.9 + (intensity * 0.2),
          pitch: 1.1 + (intensity * 0.3),
          volume: 0.85 + (intensity * 0.15),
          pauseDuration: 150
        };
      case 'excited':
        return {
          rate: 1.0 + (intensity * 0.4),
          pitch: 1.2 + (intensity * 0.4),
          volume: 0.9 + (intensity * 0.1),
          pauseDuration: 100
        };
      case 'sad':
        return {
          rate: 0.7 - (intensity * 0.2),
          pitch: 0.8 - (intensity * 0.2),
          volume: 0.7 + (intensity * 0.1),
          pauseDuration: 300
        };
      case 'whisper':
        return {
          rate: 0.6 - (intensity * 0.1),
          pitch: 0.9,
          volume: 0.3 + (intensity * 0.2),
          pauseDuration: 200
        };
      case 'laugh':
        return {
          rate: 0.8,
          pitch: 1.3,
          volume: 0.8,
          pauseDuration: 100
        };
      case 'angry':
        return {
          rate: 1.1 + (intensity * 0.3),
          pitch: 0.9 - (intensity * 0.2),
          volume: 0.9 + (intensity * 0.1),
          pauseDuration: 50
        };
      case 'surprised':
        return {
          rate: 1.2,
          pitch: 1.4,
          volume: 0.9,
          pauseDuration: 200
        };
      default: // neutral
        return {
          rate: 0.85,
          pitch: 1.0,
          volume: 0.9,
          pauseDuration: 180
        };
    }
  };

  const processTextForEmotion = (text: string, emotion: VoiceEmotion): string => {
    if (emotion.type === 'laugh') {
      // Add natural laughter sounds
      const laughs = ['hehe', 'haha', 'ahahaha'];
      const randomLaugh = laughs[Math.floor(Math.random() * laughs.length)];
      return `${randomLaugh}... ${text}`;
    }
    
    if (emotion.type === 'whisper') {
      // Add subtle pauses for whisper effect
      return text.replace(/[.!?]/g, '$&...');
    }
    
    if (emotion.type === 'excited') {
      // Add emphasis and excitement markers
      return text.replace(/[.!]/g, '!').replace(/\b(amazing|great|wonderful|fantastic)\b/gi, '$1!');
    }
    
    return text;
  };

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

      // Enhanced voice selection with emotional preferences
      const selectVoice = () => {
        const voices = speechSynthesis.getVoices();
        
        let preferredVoices = [];
        
        // Different voice preferences based on emotion
        if (emotion.type === 'whisper' || emotion.type === 'sad') {
          preferredVoices = [
            'Samantha', 'Fiona', 'Victoria', 'Susan', 'Karen',
            'Microsoft Zira', 'Google US English Female'
          ];
        } else if (emotion.type === 'happy' || emotion.type === 'excited') {
          preferredVoices = [
            'Karen', 'Samantha', 'Tessa', 'Victoria', 'Moira',
            'Google US English Female', 'Microsoft Zira'
          ];
        } else {
          preferredVoices = [
            'Samantha', 'Karen', 'Victoria', 'Susan', 'Zira',
            'Microsoft Zira', 'Google US English Female',
            'Alex', 'Fiona', 'Moira', 'Tessa'
          ];
        }

        let selectedVoice = null;

        for (const preferredName of preferredVoices) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes(preferredName.toLowerCase())
          );
          if (selectedVoice) break;
        }

        // Fallback voice selection
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') ||
            voice.lang.includes('en')
          );
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log(`Selected voice: ${selectedVoice.name} for emotion: ${emotion.type}`);
        }
      };

      // Handle voice loading
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = () => {
          selectVoice();
          speechSynthesis.onvoiceschanged = null;
        };
      } else {
        selectVoice();
      }

      utterance.onstart = () => {
        if (isInterruptedRef.current) return;
        setIsSpeaking(true);
        options.onStart?.();
        
        // Enhanced viseme simulation with emotional timing
        if (options.onViseme) {
          const words = text.split(' ');
          let wordIndex = 0;
          const baseWordsPerMinute = emotion.type === 'excited' ? 180 : 
                                   emotion.type === 'sad' || emotion.type === 'whisper' ? 120 : 150;
          const msPerWord = (60 * 1000) / baseWordsPerMinute;
          
          const visemeInterval = setInterval(() => {
            if (isInterruptedRef.current || wordIndex >= words.length) {
              clearInterval(visemeInterval);
              options.onViseme?.('sil');
              return;
            }

            const word = words[wordIndex];
            
            // Enhanced emotional viseme mapping
            if (emotion.type === 'laugh' && Math.random() > 0.7) {
              options.onViseme?.('LAUGH');
            } else if (/[ou]/i.test(word)) {
              options.onViseme?.(emotion.type === 'surprised' ? 'OH' : 'OW');
            } else if (/[aeiæ]/i.test(word)) {
              options.onViseme?.('AH');
            } else if (/[eiy]/i.test(word)) {
              options.onViseme?.('IY');
            } else if (/[bp]/i.test(word)) {
              options.onViseme?.('P');
            } else if (/[fv]/i.test(word)) {
              options.onViseme?.('F');
            } else {
              options.onViseme?.('AE');
            }
            
            wordIndex++;
          }, msPerWord);
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
  }, []);

  return { 
    speak, 
    isSpeaking, 
    interrupt,
    canInterrupt: isSpeaking
  };
};
