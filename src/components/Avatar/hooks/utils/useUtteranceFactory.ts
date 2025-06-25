
import { VoiceEmotion, SpeechOptions } from '../../AvatarAPI';
import { useVoiceSelection } from '../useVoiceSelection';

export const useUtteranceFactory = () => {
  const { selectVoice } = useVoiceSelection();

  const createUtterance = (
    processedText: string,
    emotion: VoiceEmotion,
    emotionalSettings: any,
    isMobileRef: React.MutableRefObject<boolean>
  ): SpeechSynthesisUtterance => {
    const utterance = new SpeechSynthesisUtterance(processedText);
    
    const mobileRateAdjust = isMobileRef.current ? 0.9 : 1.0;
    utterance.rate = Math.max(0.3, Math.min(2.0, emotionalSettings.rate * mobileRateAdjust));
    utterance.pitch = Math.max(0.5, Math.min(1.5, emotionalSettings.pitch));
    utterance.volume = Math.max(0.3, Math.min(1, emotionalSettings.volume));

    try {
      selectVoice(emotion, utterance);
    } catch (error) {
      console.error('Error selecting voice, using default:', error);
    }

    return utterance;
  };

  return { createUtterance };
};
