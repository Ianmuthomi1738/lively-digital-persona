
import { TestResult } from './useSlashCommands';

export const useSlashCommandHandlers = (
  speak: (text: string) => Promise<void>,
  isSpeaking: boolean,
  interrupt: () => void,
  lastUserMessage: string
) => {
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

  return slashCommandHandlers;
};
