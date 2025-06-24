
import { VoiceEmotion } from '../AvatarAPI';

export const useVisemeSimulation = () => {
  const simulateVisemes = (
    text: string, 
    emotion: VoiceEmotion, 
    onViseme: (viseme: string) => void,
    isInterruptedRef: React.MutableRefObject<boolean>
  ) => {
    const words = text.split(' ');
    let wordIndex = 0;
    const baseWordsPerMinute = emotion.type === 'excited' ? 180 : 
                             emotion.type === 'sad' || emotion.type === 'whisper' ? 120 : 150;
    const msPerWord = (60 * 1000) / baseWordsPerMinute;
    
    const visemeInterval = setInterval(() => {
      if (isInterruptedRef.current || wordIndex >= words.length) {
        clearInterval(visemeInterval);
        onViseme('sil');
        return;
      }

      const word = words[wordIndex];
      
      // Enhanced emotional viseme mapping
      if (emotion.type === 'laugh' && Math.random() > 0.7) {
        onViseme('LAUGH');
      } else if (/[ou]/i.test(word)) {
        onViseme(emotion.type === 'surprised' ? 'OH' : 'OW');
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
    }, msPerWord);

    return visemeInterval;
  };

  return { simulateVisemes };
};
