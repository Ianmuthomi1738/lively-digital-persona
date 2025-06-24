
import { VoiceEmotion } from '../AvatarAPI';

export const useVoiceSelection = () => {
  const selectVoice = (emotion: VoiceEmotion, utterance: SpeechSynthesisUtterance) => {
    try {
      const voices = speechSynthesis.getVoices();
      
      if (voices.length === 0) {
        console.warn('No voices available for selection');
        return;
      }
      
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

      // Try to find preferred voices
      for (const preferredName of preferredVoices) {
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes(preferredName.toLowerCase())
        );
        if (selectedVoice) break;
      }

      // Fallback voice selection with better filtering
      if (!selectedVoice) {
        // First try English voices
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en') && !voice.name.toLowerCase().includes('male')
        );
        
        // Then try any English voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
        }
        
        // Finally, just use the first available voice
        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices[0];
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
