
import { useRef, useCallback, useEffect } from 'react';

export interface InterruptionConfig {
  silenceThreshold?: number; // Audio level below which is considered silence
  interruptionDelay?: number; // Time to wait before considering speech as interruption
  onInterrupted?: () => void;
}

export const useRealTimeInterruption = (config: InterruptionConfig = {}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const isListeningRef = useRef(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    silenceThreshold = 0.01,
    interruptionDelay = 300,
    onInterrupted
  } = config;

  const startListening = useCallback(async () => {
    if (isListeningRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio analysis
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      source.connect(analyserRef.current);
      
      isListeningRef.current = true;
      
      // Monitor audio levels
      const checkAudioLevel = () => {
        if (!analyserRef.current || !isListeningRef.current) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedVolume = average / 255;
        
        if (normalizedVolume > silenceThreshold) {
          // Speech detected - potential interruption
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          
          silenceTimerRef.current = setTimeout(() => {
            onInterrupted?.();
          }, interruptionDelay);
        }
        
        if (isListeningRef.current) {
          requestAnimationFrame(checkAudioLevel);
        }
      };
      
      checkAudioLevel();
      
    } catch (error) {
      console.error('Failed to start real-time interruption detection:', error);
    }
  }, [silenceThreshold, interruptionDelay, onInterrupted]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    startListening,
    stopListening,
    isListening: isListeningRef.current
  };
};
