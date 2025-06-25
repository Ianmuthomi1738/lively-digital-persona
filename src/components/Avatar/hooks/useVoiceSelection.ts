
import { VoiceEmotion } from '../AvatarAPI';

// Cache voices for better performance
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

const loadVoices = (): SpeechSynthesisVoice[] => {
  if (!voicesLoaded || cachedVoices.length === 0) {
    cachedVoices = speechSynthesis.getVoices();
    voicesLoaded = true;
  }
  return cachedVoices;
};

export const useVoiceSelection = () => {
  const selectVoice = (emotion: VoiceEmotion, utterance: SpeechSynthesisUtterance) => {
    try {
      const voices = loadVoices();
      
      if (voices.length === 0) {
        console.warn('No voices available for selection');
        return;
      }
      
      // Enhanced voice preferences for more natural speech
      const getPreferredVoices = (emotionType: string) => {
        switch (emotionType) {
          case 'whisper':
          case 'sad':
            return [
              'Samantha', 'Fiona', 'Victoria', 'Susan', 'Karen', 
              'Microsoft Zira', 'Google US English Female',
              'Alex', 'Allison', 'Ava', 'Serena'
            ];
          case 'happy':
          case 'excited':
            return [
              'Karen', 'Samantha', 'Tessa', 'Victoria', 'Moira', 
              'Google US English Female', 'Microsoft Zira',
              'Ava', 'Serena', 'Allison'
            ];
          default:
            return [
              'Samantha', 'Karen', 'Victoria', 'Susan', 'Alex',
              'Microsoft Zira', 'Google US English Female',
              'Ava', 'Serena', 'Allison', 'Tessa'
            ];
        }
      };

      const preferredVoices = getPreferredVoices(emotion.type);
      let selectedVoice = null;

      // Try to find the most natural voices first
      for (const preferredName of preferredVoices) {
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes(preferredName.toLowerCase()) &&
          voice.lang.startsWith('en')
        );
        if (selectedVoice) break;
      }

      // Enhanced fallback selection for more natural voices
      if (!selectedVoice) {
        // Prioritize non-robotic voices
        const naturalVoices = voices.filter(voice => 
          voice.lang.startsWith('en') && 
          !voice.name.toLowerCase().includes('robotic') &&
          !voice.name.toLowerCase().includes('synthetic') &&
          !voice.name.toLowerCase().includes('male')
        );
        
        if (naturalVoices.length > 0) {
          selectedVoice = naturalVoices[0];
        } else {
          selectedVoice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        }
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`Selected voice: ${selectedVoice.name} (${selectedVoice.lang}) for emotion: ${emotion.type}`);
      } else {
        console.warn('No suitable voice found, using browser default');
      }
      
    } catch (error) {
      console.error('Error selecting voice:', error);
    }
  };

  return { selectVoice };
};

// Update voice cache when voices change with better error handling
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => {
    try {
      voicesLoaded = false;
      loadVoices();
    } catch (error) {
      console.warn('Error loading voices:', error);
    }
  };
}
