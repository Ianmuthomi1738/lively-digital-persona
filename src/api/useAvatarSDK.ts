
import { useRef, useEffect, useState } from 'react';
import { AvatarSDK, AvatarConfig, AvatarEventHandlers, ConversationMessage, SpeechOptions } from './AvatarSDK';

export const useAvatarSDK = (config?: AvatarConfig, eventHandlers?: AvatarEventHandlers) => {
  const sdkRef = useRef<AvatarSDK | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [canInterrupt, setCanInterrupt] = useState(false);

  useEffect(() => {
    const enhancedHandlers = {
      ...eventHandlers,
      onSpeakStart: () => {
        setIsSpeaking(true);
        setCanInterrupt(true);
        eventHandlers?.onSpeakStart?.();
      },
      onSpeakEnd: () => {
        setIsSpeaking(false);
        setCanInterrupt(false);
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
      },
      onInterrupted: () => {
        setIsSpeaking(false);
        setCanInterrupt(false);
        eventHandlers?.onInterrupted?.();
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

  const speak = async (text: string, options?: SpeechOptions) => {
    await sdkRef.current?.speak(text, options);
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

  const interrupt = () => {
    sdkRef.current?.interrupt();
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
    interrupt,
    isReady,
    isSpeaking,
    isListening,
    conversation,
    canInterrupt
  };
};
