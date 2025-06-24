
import { VoiceEmotion } from '../AvatarAPI';

// Optimized viseme mapping for better performance
const getVisemeForWord = (word: string, emotionType: string): string => {
  if (emotionType === 'laugh' && Math.random() > 0.7) {
    return 'LAUGH';
  }
  
  const lowerWord = word.toLowerCase();
  
  // Fast character-based viseme detection
  if (/[ou]/.test(lowerWord)) {
    return emotionType === 'surprised' ? 'OH' : 'OW';
  }
  if (/[aeiæ]/.test(lowerWord)) {
    return 'AH';
  }
  if (/[eiy]/.test(lowerWord)) {
    return 'IY';
  }
  if (/[bp]/.test(lowerWord)) {
    return 'P';
  }
  if (/[fv]/.test(lowerWord)) {
    return 'F';
  }
  
  return 'AE';
};

export const useVisemeSimulation = () => {
  const simulateVisemes = (
    text: string, 
    emotion: VoiceEmotion, 
    onViseme: (viseme: string) => void,
    isInterruptedRef: React.MutableRefObject<boolean>
  ): NodeJS.Timeout => {
    if (!text || text.trim().length === 0) {
      onViseme('sil');
      return setTimeout(() => {}, 0);
    }

    const words = text.split(' ').filter(word => word.length > 0);
    let wordIndex = 0;
    
    // Optimized timing calculation
    const getWordsPerMinute = (emotionType: string): number => {
      const wpmMap: Record<string, number> = {
        'excited': 180,
        'sad': 120,
        'whisper': 120,
        'angry': 200,
        'surprised': 160
      };
      return wpmMap[emotionType] || 150;
    };

    const baseWordsPerMinute = getWordsPerMinute(emotion.type);
    const msPerWord = Math.max(50, (60 * 1000) / baseWordsPerMinute);
    
    const visemeInterval = setInterval(() => {
      try {
        if (isInterruptedRef.current || wordIndex >= words.length) {
          clearInterval(visemeInterval);
          onViseme('sil');
          return;
        }

        const word = words[wordIndex];
        
        if (!word) {
          wordIndex++;
          return;
        }
        
        try {
          const viseme = getVisemeForWord(word, emotion.type);
          onViseme(viseme);
        } catch (error) {
          console.error('Error in viseme generation:', error);
          onViseme('sil');
        }
        
        wordIndex++;
      } catch (error) {
        console.error('Error in viseme simulation interval:', error);
        clearInterval(visemeInterval);
        onViseme('sil');
      }
    }, msPerWord);

    return visemeInterval;
  };

  return { simulateVisemes };
};
