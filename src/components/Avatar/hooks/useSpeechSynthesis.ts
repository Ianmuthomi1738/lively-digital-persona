
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
  const isCleaningUpRef = useRef(false);
  const isMobileRef = useRef(false);

  const { getEmotionalSettings, processTextForEmotion } = useVoiceEmotions();
  const { selectVoice } = useVoiceSelection();
  const { simulateVisemes } = useVisemeSimulation();

  // Detect mobile browser
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    isMobileRef.current = mobile;
    return mobile;
  }, []);

  // Enhanced cleanup function with mobile-safe handling
  const cleanup = useCallback(() => {
    if (isCleaningUpRef.current) return;
    
    isCleaningUpRef.current = true;
    
    try {
      console.log('Starting speech synthesis cleanup');
      
      if (visemeIntervalRef.current) {
        clearInterval(visemeIntervalRef.current);
        visemeIntervalRef.current = null;
      }
      
      // Mobile-safe utterance cleanup
      if (currentUtteranceRef.current) {
        const utterance = currentUtteranceRef.current;
        
        // Only remove listeners if they exist (mobile browsers can be finicky)
        try {
          utterance.onstart = null;
          utterance.onend = null;
          utterance.onerror = null;
        } catch (e) {
          console.warn('Could not clear utterance listeners:', e);
        }
        
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

  // Mobile-safe interrupt function
  const interrupt = useCallback(() => {
    if (!isSpeaking || isCleaningUpRef.current) return;

    console.log('Interrupting speech synthesis');
    isInterruptedRef.current = true;
    
    try {
      // Mobile browsers need gentler cancellation
      if (isMobileRef.current) {
        // For mobile, just stop without aggressive cancellation
        if (speechSynthesis.speaking) {
          speechSynthesis.pause();
          setTimeout(() => {
            if (speechSynthesis.paused) {
              speechSynthesis.cancel();
            }
            cleanup();
          }, 100);
        } else {
          cleanup();
        }
      } else {
        // Desktop browsers can handle immediate cancellation
        if (speechSynthesis.speaking || speechSynthesis.pending) {
          speechSynthesis.cancel();
        }
        setTimeout(cleanup, 50);
      }
      
    } catch (error) {
      console.error('Error interrupting speech synthesis:', error);
      cleanup();
    }
  }, [isSpeaking, cleanup]);

  const isSupported = useMemo(() => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }, []);

  // Enhanced speak function with mobile optimizations and natural voice
  const speak = useCallback(async (
    text: string, 
    options: SpeechOptions = {}
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (!isSupported) {
          reject(new Error('Speech synthesis not supported in this browser'));
          return;
        }

        if (!text || text.trim().length === 0) {
          reject(new Error('No text provided for speech synthesis'));
          return;
        }

        // Cancel any ongoing speech with mobile-safe handling
        if (isSpeaking) {
          console.log('Canceling existing speech for new request');
          if (isMobileRef.current) {
            speechSynthesis.pause();
            setTimeout(() => speechSynthesis.cancel(), 50);
          } else {
            speechSynthesis.cancel();
          }
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
        
        // Create utterance with mobile-optimized settings
        const utterance = new SpeechSynthesisUtterance(processedText);
        currentUtteranceRef.current = utterance;
        
        // Apply natural voice settings with mobile optimization
        const mobileRateAdjust = isMobileRef.current ? 0.9 : 1.0; // Slightly slower on mobile
        utterance.rate = Math.max(0.3, Math.min(2.0, emotionalSettings.rate * mobileRateAdjust));
        utterance.pitch = Math.max(0.5, Math.min(1.5, emotionalSettings.pitch));
        utterance.volume = Math.max(0.3, Math.min(1, emotionalSettings.volume));

        // Enhanced voice selection for naturalness
        try {
          selectVoice(emotion, utterance);
        } catch (error) {
          console.error('Error selecting voice, using default:', error);
        }

        // Mobile-optimized event handlers
        utterance.onstart = () => {
          if (isInterruptedRef.current || isCleaningUpRef.current) return;
          
          try {
            console.log('Speech synthesis started successfully');
            setIsSpeaking(true);
            options.onStart?.();
            
            // Start viseme simulation with mobile optimization
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
            
            // Delayed cleanup for mobile stability
            if (isMobileRef.current) {
              setTimeout(cleanup, 100);
            } else {
              cleanup();
            }
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
            
            // Mobile browsers often throw errors during interruption - handle gracefully
            if (isInterruptedRef.current || (isMobileRef.current && event.error === 'interrupted')) {
              options.onInterrupted?.();
              cleanup();
              resolve();
            } else {
              cleanup();
              reject(new Error(`Speech synthesis error: ${event.error}`));
            }
          } catch (error) {
            console.error('Error in speech error handler:', error);
            cleanup();
            reject(error);
          }
        };

        // Mobile-optimized speech start with reduced delay
        const startSpeaking = () => {
          if (isInterruptedRef.current || isCleaningUpRef.current) {
            cleanup();
            resolve();
            return;
          }
          
          try {
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

        // Minimal delay for mobile optimization
        const delay = isMobileRef.current ? 50 : Math.min(emotionalSettings?.pauseDuration || 100, 30);
        setTimeout(startSpeaking, delay);

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
    canInterrupt: isSpeaking && !isCleaningUpRef.current,
    isMobile
  };
};
