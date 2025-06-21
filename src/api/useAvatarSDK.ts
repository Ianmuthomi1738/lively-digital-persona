
import { useRef, useEffect, useState } from 'react';
import { AvatarSDK, AvatarConfig, AvatarEventHandlers, ConversationMessage } from './AvatarSDK';

export const useAvatarSDK = (config?: AvatarConfig, eventHandlers?: AvatarEventHandlers) => {
  const sdkRef = useRef<AvatarSDK | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);

  useEffect(() => {
    const enhancedHandlers = {
      ...eventHandlers,
      onSpeakStart: () => {
        setIsSpeaking(true);
        eventHandlers?.onSpeakStart?.();
      },
      onSpeakEnd: () => {
        setIsSpeaking(false);
        eventHandlers?.onSpeakEnd?.();
      },
      onListenStart: () => {
        setIsListening(true);
        eventHandlers?.onListenStart?.();
      },
      onListenEnd: () => {
        setIsListening(false);
        eventHandlers?.onListenEnd?.();
      },
      onTranscriptReceived: (transcript: string) => {
        setConversation(prev => [...prev]);
        eventHandlers?.onTranscriptReceived?.(transcript);
      }
    };

    sdkRef.current = new AvatarSDK(config, enhancedHandlers);
    
    return () => {
      sdkRef.current?.destroy();
    };
  }, []);

  const connectAvatar = (avatarRef: any) => {
    sdkRef.current?.setAvatarRef(avatarRef);
    setIsReady(true);
  };

  const speak = async (text: string) => {
    await sdkRef.current?.speak(text);
    setConversation(sdkRef.current?.getConversation() || []);
  };

  const listen = async () => {
    const transcript = await sdkRef.current?.listen();
    setConversation(sdkRef.current?.getConversation() || []);
    return transcript;
  };

  const setExpression = (expression: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised') => {
    sdkRef.current?.setExpression(expression);
  };

  const clearConversation = () => {
    sdkRef.current?.clearConversation();
    setConversation([]);
  };

  return {
    sdk: sdkRef.current,
    connectAvatar,
    speak,
    listen,
    setExpression,
    clearConversation,
    isReady,
    isSpeaking,
    isListening,
    conversation
  };
};
