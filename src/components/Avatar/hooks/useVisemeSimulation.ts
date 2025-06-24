
import { VoiceEmotion } from '../AvatarAPI';

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
    
    // Calculate timing based on emotion with bounds checking
    const getWordsPerMinute = (emotionType: string) => {
      switch (emotionType) {
        case 'excited': return 180;
        case 'sad':
        case 'whisper': return 120;
        case 'angry': return 200;
        case 'surprised': return 160;
        default: return 150;
      }
    };

    const baseWordsPerMinute = getWordsPerMinute(emotion.type);
    const msPerWord = Math.max(50, (60 * 1000) / baseWordsPerMinute); // Minimum 50ms per word
    
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
        
        // Enhanced emotional viseme mapping with error handling
        let viseme = 'sil';
        
        try {
          if (emotion.type === 'laugh' && Math.random() > 0.7) {
            viseme = 'LAUGH';
          } else if (/[ou]/i.test(word)) {
            viseme = emotion.type === 'surprised' ? 'OH' : 'OW';
          } else if (/[aeiæ]/i.test(word)) {
            viseme = 'AH';
          } else if (/[eiy]/i.test(word)) {
            viseme = 'IY';
          } else if (/[bp]/i.test(word)) {
            viseme = 'P';
          } else if (/[fv]/i.test(word)) {
            viseme = 'F';
          } else {
            viseme = 'AE';
          }
          
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
