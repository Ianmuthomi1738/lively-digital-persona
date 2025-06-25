
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
    
    // More natural voice settings with subtle variations
    switch (emotion.type) {
      case 'happy':
        return {
          rate: 0.8 + (intensity * 0.15), // Slower, more natural
          pitch: 1.0 + (intensity * 0.2), // Less extreme pitch
          volume: 0.85 + (intensity * 0.1),
          pauseDuration: 200 // Longer pauses for naturalness
        };
      case 'excited':
        return {
          rate: 0.9 + (intensity * 0.2),
          pitch: 1.1 + (intensity * 0.25),
          volume: 0.9 + (intensity * 0.1),
          pauseDuration: 150
        };
      case 'sad':
        return {
          rate: 0.6 - (intensity * 0.15),
          pitch: 0.85 - (intensity * 0.15),
          volume: 0.75 + (intensity * 0.1),
          pauseDuration: 400 // Longer pauses for sadness
        };
      case 'whisper':
        return {
          rate: 0.5 - (intensity * 0.1),
          pitch: 0.95,
          volume: 0.4 + (intensity * 0.15),
          pauseDuration: 300
        };
      case 'laugh':
        return {
          rate: 0.75,
          pitch: 1.2,
          volume: 0.8,
          pauseDuration: 250
        };
      case 'angry':
        return {
          rate: 1.0 + (intensity * 0.2),
          pitch: 0.9 - (intensity * 0.15),
          volume: 0.9 + (intensity * 0.1),
          pauseDuration: 100
        };
      case 'surprised':
        return {
          rate: 1.1,
          pitch: 1.3,
          volume: 0.9,
          pauseDuration: 250
        };
      default: // neutral - most natural settings
        return {
          rate: 0.75, // Slower for naturalness
          pitch: 1.0, // Natural pitch
          volume: 0.85,
          pauseDuration: 250 // Natural pause length
        };
    }
  };

  const processTextForEmotion = (text: string, emotion: VoiceEmotion): string => {
    // Add natural pauses and breathing for more human-like speech
    let processedText = text;
    
    // Add subtle pauses after punctuation for naturalness
    processedText = processedText.replace(/\./g, '.');
    processedText = processedText.replace(/,/g, ', ');
    processedText = processedText.replace(/;/g, '; ');
    
    if (emotion.type === 'laugh') {
      const laughs = ['hehe', 'haha', 'ha ha'];
      const randomLaugh = laughs[Math.floor(Math.random() * laughs.length)];
      return `${randomLaugh}... ${processedText}`;
    }
    
    if (emotion.type === 'whisper') {
      return processedText.replace(/[.!?]/g, '$&...');
    }
    
    if (emotion.type === 'excited') {
      return processedText.replace(/\b(amazing|great|wonderful|fantastic|awesome|incredible)\b/gi, '$1!');
    }
    
    // Add natural breathing pauses for longer text
    if (processedText.length > 100) {
      const sentences = processedText.split(/([.!?]+)/);
      const processedSentences = sentences.map((sentence, index) => {
        if (index % 4 === 0 && index > 0 && sentence.trim().length > 0) {
          return ' ' + sentence; // Add slight pause every few sentences
        }
        return sentence;
      });
      processedText = processedSentences.join('');
    }
    
    return processedText;
  };

  return {
    getEmotionalSettings,
    processTextForEmotion
  };
};
