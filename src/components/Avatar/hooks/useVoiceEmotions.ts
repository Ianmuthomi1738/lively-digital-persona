
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
    
    // Much more natural voice settings - closer to human speech patterns
    switch (emotion.type) {
      case 'happy':
        return {
          rate: 0.9 + (intensity * 0.1), // Slightly faster but natural
          pitch: 1.05 + (intensity * 0.1), // Very subtle pitch increase
          volume: 0.8 + (intensity * 0.1),
          pauseDuration: 180
        };
      case 'excited':
        return {
          rate: 0.95 + (intensity * 0.15),
          pitch: 1.08 + (intensity * 0.12),
          volume: 0.85 + (intensity * 0.1),
          pauseDuration: 140
        };
      case 'sad':
        return {
          rate: 0.7 - (intensity * 0.1), // Slower for sadness
          pitch: 0.92 - (intensity * 0.08), // Slightly lower pitch
          volume: 0.75 + (intensity * 0.05),
          pauseDuration: 320
        };
      case 'whisper':
        return {
          rate: 0.65 - (intensity * 0.05),
          pitch: 0.98, // Almost natural pitch
          volume: 0.45 + (intensity * 0.1),
          pauseDuration: 280
        };
      case 'laugh':
        return {
          rate: 0.85,
          pitch: 1.1,
          volume: 0.8,
          pauseDuration: 200
        };
      case 'angry':
        return {
          rate: 1.0 + (intensity * 0.15),
          pitch: 0.95 - (intensity * 0.08),
          volume: 0.85 + (intensity * 0.1),
          pauseDuration: 120
        };
      case 'surprised':
        return {
          rate: 1.05,
          pitch: 1.15,
          volume: 0.85,
          pauseDuration: 200
        };
      default: // neutral - most natural human-like settings
        return {
          rate: 0.85, // Natural conversational speed
          pitch: 1.0, // Completely natural pitch
          volume: 0.8, // Comfortable volume
          pauseDuration: 200 // Natural pause length
        };
    }
  };

  const processTextForEmotion = (text: string, emotion: VoiceEmotion): string => {
    // More natural text processing with breathing patterns
    let processedText = text;
    
    // Add natural breathing pauses and rhythm
    processedText = processedText.replace(/\./g, '. '); // Space after periods
    processedText = processedText.replace(/,/g, ', '); // Space after commas
    processedText = processedText.replace(/;/g, '; '); // Space after semicolons
    processedText = processedText.replace(/:/g, ': '); // Space after colons
    
    // Remove excessive spaces
    processedText = processedText.replace(/\s+/g, ' ').trim();
    
    // Add natural pauses for longer sentences
    if (processedText.length > 80) {
      processedText = processedText.replace(/(\w+[.!?])\s+(\w+)/g, '$1 $2');
    }
    
    // Emotion-specific processing with subtle changes
    if (emotion.type === 'laugh') {
      const laughs = ['heh', 'ha', 'hehe'];
      const randomLaugh = laughs[Math.floor(Math.random() * laughs.length)];
      return `${randomLaugh}. ${processedText}`;
    }
    
    if (emotion.type === 'whisper') {
      // Add subtle pauses for whispers
      return processedText.replace(/([.!?])/g, '$1..');
    }
    
    if (emotion.type === 'excited') {
      // Subtle emphasis on positive words
      return processedText.replace(/\b(amazing|great|wonderful|fantastic|awesome|incredible|brilliant|excellent)\b/gi, '$1');
    }
    
    // Natural sentence flow for longer text
    if (processedText.length > 120) {
      const sentences = processedText.split(/([.!?]+\s*)/);
      let result = '';
      for (let i = 0; i < sentences.length; i += 2) {
        if (sentences[i] && sentences[i].trim()) {
          result += sentences[i];
          if (sentences[i + 1]) {
            result += sentences[i + 1];
          }
          // Add subtle pause every 2-3 sentences
          if (i > 0 && i % 4 === 0 && i < sentences.length - 2) {
            result += ' ';
          }
        }
      }
      processedText = result;
    }
    
    return processedText;
  };

  return {
    getEmotionalSettings,
    processTextForEmotion
  };
};
