
import { useState, useRef } from 'react';

export const useAvatarState = () => {
  const [isListening, setIsListening] = useState(false);
  const [voiceStyle, setVoiceStyle] = useState('natural');
  const [lastUserMessage, setLastUserMessage] = useState('');

  return {
    isListening,
    setIsListening,
    voiceStyle,
    setVoiceStyle,
    lastUserMessage,
    setLastUserMessage
  };
};
