
import { useCallback } from 'react';

export interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  details?: string;
}

export interface SlashCommandHandlers {
  onTestInterruption: () => Promise<TestResult>;
  onTestMemory: () => Promise<TestResult>;
  onTestFormatting: () => Promise<TestResult>;
  onTestAll: () => Promise<TestResult[]>;
}

export const useSlashCommands = (handlers: SlashCommandHandlers) => {
  const processCommand = useCallback(async (input: string): Promise<string | TestResult | TestResult[] | null> => {
    const trimmed = input.trim();
    
    if (!trimmed.startsWith('/')) {
      return null; // Not a slash command
    }

    const command = trimmed.toLowerCase();

    switch (command) {
      case '/test interruption':
        return await handlers.onTestInterruption();
        
      case '/test memory':
        return await handlers.onTestMemory();
        
      case '/test formatting':
        return await handlers.onTestFormatting();
        
      case '/test all':
        return await handlers.onTestAll();
        
      default:
        return '❓ Unknown command. Available tests: /test interruption, /test memory, /test formatting, /test all.';
    }
  }, [handlers]);

  const formatTestResult = useCallback((result: TestResult): string => {
    const status = result.status === 'PASS' ? '✅' : '❌';
    return `${status} **${result.name}**: ${result.status}${result.details ? ` – ${result.details}` : ''}`;
  }, []);

  const formatMultipleResults = useCallback((results: TestResult[]): string => {
    const formatted = results.map(formatTestResult).join('\n');
    const passCount = results.filter(r => r.status === 'PASS').length;
    const totalCount = results.length;
    
    return `${formatted}\n\n**Summary**: ${passCount}/${totalCount} tests passed`;
  }, [formatTestResult]);

  return {
    processCommand,
    formatTestResult,
    formatMultipleResults
  };
};
