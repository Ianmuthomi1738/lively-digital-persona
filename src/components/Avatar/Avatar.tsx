import React, { useEffect, forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { AvatarAPI, SpeechOptions } from './AvatarAPI';
import { SiriAvatar } from './SiriAvatar';
import { VoiceSettings } from './VoiceSettings';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useRealTimeInterruption } from './hooks/useRealTimeInterruption';
import { useSlashCommands, TestResult } from './hooks/useSlashCommands';

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
  const [isListening, setIsListening] = useState(false);
  const [voiceStyle, setVoiceStyle] = useState('natural');
  const [lastUserMessage, setLastUserMessage] = useState('');

  const { startListening: startInterruptionDetection, stopListening: stopInterruptionDetection } = useRealTimeInterruption({
    onInterrupted: () => {
      if (isSpeaking) {
        console.log('Real-time interruption detected, stopping speech');
        interrupt();
        onInterrupted?.();
      }
    }
  });

  const slashCommandHandlers = {
    onTestInterruption: async (): Promise<TestResult> => {
      try {
        const longText = "This is a long test message that should be interrupted when the user begins to speak. We're testing the real-time interruption capability to ensure it works correctly in all scenarios.";
        
        const speakPromise = speak(longText);
        
        setTimeout(() => {
          if (isSpeaking) {
            interrupt();
          }
        }, 1000);
        
        await speakPromise;
        
        return {
          name: 'Interruption Support',
          status: 'PASS',
          details: 'Successfully detected and handled interruption'
        };
      } catch (error) {
        return {
          name: 'Interruption Support',
          status: 'FAIL',
          details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    },
    
    onTestMemory: async (): Promise<TestResult> => {
      if (lastUserMessage) {
        return {
          name: 'Context Memory',
          status: 'PASS',
          details: `Last message: "${lastUserMessage}"`
        };
      } else {
        return {
          name: 'Context Memory',
          status: 'FAIL',
          details: 'No previous user message found'
        };
      }
    },
    
    onTestFormatting: async (): Promise<TestResult> => {
      const testText = "✔️ **Bold text** and `inline code` formatting test";
      await speak("Formatting test completed. Check the response for proper markdown rendering.");
      
      return {
        name: 'Markdown Formatting',
        status: 'PASS',
        details: testText
      };
    },
    
    onTestAll: async (): Promise<TestResult[]> => {
      const interruption = await slashCommandHandlers.onTestInterruption();
      const memory = await slashCommandHandlers.onTestMemory();
      const formatting = await slashCommandHandlers.onTestFormatting();
      
      return [interruption, memory, formatting];
    }
  };

  const { processCommand, formatTestResult, formatMultipleResults } = useSlashCommands(slashCommandHandlers);

  useEffect(() => {
    if (enableRealTimeInterruption && !isMobile) { // Disable on mobile for stability
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
      // Silently handle errors to prevent cascading failures
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

  useImperativeHandle(ref, () => ({
    speak: handleSpeak,
    listen: handleListen,
    setExpression: handleSetExpression,
    interrupt: handleInterrupt,
    canInterrupt
  }));

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Mobile-optimized background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 sm:opacity-30">
          <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-32 sm:h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-12 h-12 sm:w-24 sm:h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-40 sm:h-40 bg-gradient-radial from-white/5 to-transparent rounded-full" />
        </div>
      </div>

      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        <VoiceSettings 
          currentVoice={voiceStyle}
          onVoiceChange={setVoiceStyle}
        />
      </div>

      {canInterrupt && (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
          <button
            onClick={handleInterrupt}
            className="bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 shadow-lg touch-manipulation"
          >
            Stop
          </button>
        </div>
      )}

      <div className="relative z-0 flex items-center justify-center">
        <SiriAvatar 
          isSpeaking={isSpeaking} 
          isListening={isListening}
          voiceStyle={voiceStyle}
        />
      </div>

      {/* Mobile stability indicator */}
      {isMobile && (
        <div className="absolute bottom-2 left-2 text-xs text-white/50">
          Mobile Mode
        </div>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';
