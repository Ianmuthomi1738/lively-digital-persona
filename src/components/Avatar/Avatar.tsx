
import React, { useEffect, forwardRef } from 'react';
import { AvatarAPI, SpeechOptions } from './AvatarAPI';
import { SiriAvatar } from './SiriAvatar';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useRealTimeInterruption } from './hooks/useRealTimeInterruption';
import { useSlashCommands } from './hooks/useSlashCommands';
import { useAvatarState } from './hooks/useAvatarState';
import { useSlashCommandHandlers } from './hooks/useSlashCommandHandlers';
import { useAvatarAPI } from './hooks/useAvatarAPI';
import { AvatarBackground } from './components/AvatarBackground';
import { AvatarControls } from './components/AvatarControls';

interface AvatarProps {
  expression?: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised';
  onSpeakingStateChange?: (isSpeaking: boolean) => void;
  onInterrupted?: () => void;
  enableRealTimeInterruption?: boolean;
}

export const Avatar = forwardRef<AvatarAPI, AvatarProps>(({ 
  expression = 'neutral',
  onSpeakingStateChange,
  onInterrupted,
  enableRealTimeInterruption = true
}, ref) => {
  const { speak, isSpeaking, interrupt, canInterrupt, isMobile } = useSpeechSynthesis();
  const { listen } = useSpeechRecognition();
  const {
    isListening,
    setIsListening,
    voiceStyle,
    setVoiceStyle,
    lastUserMessage,
    setLastUserMessage
  } = useAvatarState();

  const { startListening: startInterruptionDetection, stopListening: stopInterruptionDetection } = useRealTimeInterruption({
    onInterrupted: () => {
      if (isSpeaking) {
        console.log('Real-time interruption detected, stopping speech');
        interrupt();
        onInterrupted?.();
      }
    }
  });

  const slashCommandHandlers = useSlashCommandHandlers(speak, isSpeaking, interrupt, lastUserMessage);
  const { processCommand, formatTestResult, formatMultipleResults } = useSlashCommands(slashCommandHandlers);

  useEffect(() => {
    if (enableRealTimeInterruption && !isMobile) {
      if (isSpeaking) {
        startInterruptionDetection();
      } else {
        stopInterruptionDetection();
      }
    }
  }, [isSpeaking, enableRealTimeInterruption, isMobile, startInterruptionDetection, stopInterruptionDetection]);

  useEffect(() => {
    onSpeakingStateChange?.(isSpeaking);
  }, [isSpeaking, onSpeakingStateChange]);

  const handleSpeak = async (text: string, options: SpeechOptions = {}): Promise<void> => {
    try {
      const commandResult = await processCommand(text);
      
      if (commandResult !== null) {
        if (typeof commandResult === 'string') {
          return speak(commandResult, options);
        } else if (Array.isArray(commandResult)) {
          const formatted = formatMultipleResults(commandResult);
          return speak(formatted, options);
        } else {
          const formatted = formatTestResult(commandResult);
          return speak(formatted, options);
        }
      }

      return speak(text, {
        ...options,
        onInterrupted: () => {
          console.log('Speech was interrupted');
          onInterrupted?.();
          options.onInterrupted?.();
        }
      });
    } catch (error) {
      console.error('Speech error in Avatar:', error);
    }
  };

  const handleListen = async (callback: (transcript: string) => void): Promise<void> => {
    setIsListening(true);
    try {
      await listen((transcript: string) => {
        setLastUserMessage(transcript);
        callback(transcript);
      });
    } catch (error) {
      console.error('Listen error:', error);
    } finally {
      setIsListening(false);
    }
  };

  const handleSetExpression = (expr: typeof expression): void => {
    console.log('Expression changed to:', expr);
  };

  const handleInterrupt = (): void => {
    try {
      console.log('Manual interrupt triggered');
      interrupt();
    } catch (error) {
      console.error('Error during manual interrupt:', error);
    }
  };

  const { createAvatarAPI } = useAvatarAPI(
    handleSpeak,
    handleListen,
    handleSetExpression,
    handleInterrupt,
    canInterrupt
  );

  createAvatarAPI(ref);

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center p-4 sm:p-6">
      <AvatarBackground />
      
      <AvatarControls
        voiceStyle={voiceStyle}
        onVoiceChange={setVoiceStyle}
        canInterrupt={canInterrupt}
        onInterrupt={handleInterrupt}
        isMobile={isMobile}
      />

      <div className="relative z-0 flex items-center justify-center">
        <SiriAvatar 
          isSpeaking={isSpeaking} 
          isListening={isListening}
          voiceStyle={voiceStyle}
        />
      </div>
    </div>
  );
});

Avatar.displayName = 'Avatar';
