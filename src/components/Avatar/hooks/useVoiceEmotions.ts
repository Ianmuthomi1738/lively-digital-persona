
import { VoiceEmotion } from '../AvatarAPI';

export interface EmotionalSettings {
  rate: number;
  pitch: number;
  volume: number;
  pauseDuration: number;
}

export const useVoiceEmotions = () => {
  const getEmotionalSettings = (emotion: VoiceEmotion): EmotionalSettings => {
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
      const laughs = ['hehe', 'haha', 'ahahaha'];
      const randomLaugh = laughs[Math.floor(Math.random() * laughs.length)];
      return `${randomLaugh}... ${text}`;
    }
    
    if (emotion.type === 'whisper') {
      return text.replace(/[.!?]/g, '$&...');
    }
    
    if (emotion.type === 'excited') {
      return text.replace(/[.!]/g, '!').replace(/\b(amazing|great|wonderful|fantastic)\b/gi, '$1!');
    }
    
    return text;
  };

  return {
    getEmotionalSettings,
    processTextForEmotion
  };
};
