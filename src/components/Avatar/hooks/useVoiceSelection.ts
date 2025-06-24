
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
      
      // Optimized voice preferences based on emotion
      const getPreferredVoices = (emotionType: string) => {
        switch (emotionType) {
          case 'whisper':
          case 'sad':
            return ['Samantha', 'Fiona', 'Victoria', 'Susan', 'Karen', 'Microsoft Zira', 'Google US English Female'];
          case 'happy':
          case 'excited':
            return ['Karen', 'Samantha', 'Tessa', 'Victoria', 'Moira', 'Google US English Female', 'Microsoft Zira'];
          default:
            return ['Samantha', 'Karen', 'Victoria', 'Susan', 'Zira', 'Microsoft Zira', 'Google US English Female'];
        }
      };

      const preferredVoices = getPreferredVoices(emotion.type);
      let selectedVoice = null;

      // Fast voice lookup using find
      for (const preferredName of preferredVoices) {
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes(preferredName.toLowerCase())
        );
        if (selectedVoice) break;
      }

      // Optimized fallback selection
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en') && !voice.name.toLowerCase().includes('male')
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
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

// Update voice cache when voices change
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = false;
    loadVoices();
  };
}
