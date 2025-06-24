
import { VoiceEmotion } from '../AvatarAPI';

export const useVoiceSelection = () => {
  const selectVoice = (emotion: VoiceEmotion, utterance: SpeechSynthesisUtterance) => {
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

  return { selectVoice };
};
