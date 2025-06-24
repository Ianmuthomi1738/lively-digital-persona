
import { useState, useCallback, useRef, useMemo } from 'react';
import { VoiceEmotion, SpeechOptions } from '../AvatarAPI';
import { useVoiceEmotions } from './useVoiceEmotions';
import { useVoiceSelection } from './useVoiceSelection';
import { useVisemeSimulation } from './useVisemeSimulation';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isInterruptedRef = useRef(false);
  const visemeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCleaningUpRef = useRef(false);

  const { getEmotionalSettings, processTextForEmotion } = useVoiceEmotions();
  const { selectVoice } = useVoiceSelection();
  const { simulateVisemes } = useVisemeSimulation();

  // Enhanced cleanup function with proper error handling
  const cleanup = useCallback(() => {
    if (isCleaningUpRef.current) {
      return; // Prevent recursive cleanup
    }
    
    isCleaningUpRef.current = true;
    
    try {
      console.log('Starting speech synthesis cleanup');
      
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }
      
      if (visemeIntervalRef.current) {
        clearInterval(visemeIntervalRef.current);
        visemeIntervalRef.current = null;
      }
      
      // Clear the current utterance reference
      if (currentUtteranceRef.current) {
        const utterance = currentUtteranceRef.current;
        
        // Remove event listeners to prevent callbacks after cleanup
        utterance.onstart = null;
        utterance.onend = null;
        utterance.onerror = null;
        utterance.onpause = null;
        utterance.onresume = null;
        utterance.onmark = null;
        utterance.onboundary = null;
        
        currentUtteranceRef.current = null;
      }
      
      setIsSpeaking(false);
      console.log('Speech synthesis cleanup completed');
      
    } catch (error) {
      console.error('Error during speech synthesis cleanup:', error);
    } finally {
      isCleaningUpRef.current = false;
    }
  }, []);

  // Improved interrupt function with better error handling
  const interrupt = useCallback(() => {
    if (!isSpeaking || isCleaningUpRef.current) {
      return;
    }

    console.log('Interrupting speech synthesis');
    isInterruptedRef.current = true;
    
    try {
      // First, cancel any pending speech
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
      }
      
      // Wait a moment for the cancel to take effect, then cleanup
      setTimeout(() => {
        cleanup();
      }, 50);
      
    } catch (error) {
      console.error('Error interrupting speech synthesis:', error);
      // Force cleanup even if cancel failed
      cleanup();
    }
  }, [isSpeaking, cleanup]);

  // Check if speech synthesis is supported
  const isSupported = useMemo(() => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }, []);

  // Enhanced speak function with better error handling and state management
  const speak = useCallback(async (
    text: string, 
    options: SpeechOptions = {}
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Early validation
        if (!isSupported) {
          reject(new Error('Speech synthesis not supported in this browser'));
          return;
        }

        if (!text || text.trim().length === 0) {
          reject(new Error('No text provided for speech synthesis'));
          return;
        }

        // Cancel any ongoing speech and cleanup
        if (isSpeaking) {
          console.log('Canceling existing speech for new request');
          speechSynthesis.cancel();
          cleanup();
        }

        // Reset state
        isInterruptedRef.current = false;
        isCleaningUpRef.current = false;
        const emotion = options.emotion || { type: 'neutral' };
        
        let emotionalSettings;
        let processedText;
        
        try {
          emotionalSettings = getEmotionalSettings(emotion);
          processedText = processTextForEmotion(text, emotion);
        } catch (error) {
          console.error('Error processing emotion:', error);
          emotionalSettings = getEmotionalSettings({ type: 'neutral' });
          processedText = text;
        }
        
        // Create utterance with error-safe settings
        const utterance = new SpeechSynthesisUtterance(processedText);
        currentUtteranceRef.current = utterance;
        
        // Apply settings with validation and bounds checking
        utterance.rate = Math.max(0.1, Math.min(10, emotionalSettings.rate));
        utterance.pitch = Math.max(0, Math.min(2, emotionalSettings.pitch));
        utterance.volume = Math.max(0, Math.min(1, emotionalSettings.volume));

        // Voice selection with error handling
        try {
          selectVoice(emotion, utterance);
        } catch (error) {
          console.error('Error selecting voice, using default:', error);
        }

        // Enhanced event handlers with proper error boundaries
        utterance.onstart = () => {
          if (isInterruptedRef.current || isCleaningUpRef.current) {
            return;
          }
          
          try {
            console.log('Speech synthesis started successfully');
            setIsSpeaking(true);
            options.onStart?.();
            
            // Start viseme simulation with error handling
            if (options.onViseme) {
              try {
                visemeIntervalRef.current = simulateVisemes(text, emotion, options.onViseme, isInterruptedRef);
              } catch (error) {
                console.error('Error starting viseme simulation:', error);
              }
            }
          } catch (error) {
            console.error('Error in speech start handler:', error);
          }
        };

        utterance.onend = () => {
          try {
            console.log('Speech synthesis ended normally');
            
            if (isInterruptedRef.current) {
              options.onInterrupted?.();
            } else {
              options.onEnd?.();
            }
            
            cleanup();
            resolve();
            
          } catch (error) {
            console.error('Error in speech end handler:', error);
            cleanup();
            resolve();
          }
        };

        utterance.onerror = (event) => {
          try {
            console.error('Speech synthesis error event:', event.error);
            cleanup();
            
            // Don't reject if we were interrupted, as that's expected
            if (isInterruptedRef.current) {
              options.onInterrupted?.();
              resolve();
            } else {
              reject(new Error(`Speech synthesis error: ${event.error}`));
            }
          } catch (error) {
            console.error('Error in speech error handler:', error);
            cleanup();
            reject(error);
          }
        };

        // Start speaking with enhanced error handling
        const startSpeaking = () => {
          if (isInterruptedRef.current || isCleaningUpRef.current) {
            cleanup();
            resolve();
            return;
          }
          
          try {
            // Double-check that speech synthesis is still available
            if (!speechSynthesis) {
              throw new Error('Speech synthesis not available');
            }
            
            console.log('Starting speech synthesis...');
            speechSynthesis.speak(utterance);
            
          } catch (error) {
            console.error('Error starting speech synthesis:', error);
            cleanup();
            reject(error);
          }
        };

        // Reduced delay for better responsiveness, with fallback
        const pauseDelay = Math.min(emotionalSettings?.pauseDuration || 100, 50);
        cleanupTimeoutRef.current = setTimeout(startSpeaking, pauseDelay);

      } catch (error) {
        console.error('Speech synthesis setup error:', error);
        cleanup();
        reject(error);
      }
    });
  }, [getEmotionalSettings, processTextForEmotion, selectVoice, simulateVisemes, isSpeaking, cleanup, isSupported]);

  return { 
    speak, 
    isSpeaking, 
    interrupt,
    canInterrupt: isSpeaking && !isCleaningUpRef.current
  };
};
