
import { useImperativeHandle } from 'react';
import { AvatarAPI, SpeechOptions } from '../AvatarAPI';

export const useAvatarAPI = (
  handleSpeak: (text: string, options?: SpeechOptions) => Promise<void>,
  handleListen: (callback: (transcript: string) => void) => Promise<void>,
  handleSetExpression: (expr: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised') => void,
  handleInterrupt: () => void,
  canInterrupt: boolean
) => {
  const createAvatarAPI = (ref: React.Ref<AvatarAPI>) => {
    useImperativeHandle(ref, () => ({
      speak: handleSpeak,
      listen: handleListen,
      setExpression: handleSetExpression,
      interrupt: handleInterrupt,
      canInterrupt
    }));
  };

  return { createAvatarAPI };
};
