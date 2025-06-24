
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
  const streamRef = useRef<MediaStream | null>(null);
  const isListeningRef = useRef(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const {
    silenceThreshold = 0.01,
    interruptionDelay = 300,
    onInterrupted
  } = config;

  const cleanup = useCallback(() => {
    console.log('Cleaning up real-time interruption resources');
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    analyserRef.current = null;
    isListeningRef.current = false;
  }, []);

  const startListening = useCallback(async () => {
    if (isListeningRef.current) {
      console.log('Already listening for interruptions');
      return;
    }

    try {
      console.log('Starting real-time interruption detection');
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('getUserMedia not supported');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
      // Setup audio analysis
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      source.connect(analyserRef.current);
      
      isListeningRef.current = true;
      
      // Monitor audio levels
      const checkAudioLevel = () => {
        if (!analyserRef.current || !isListeningRef.current) {
          return;
        }
        
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
            console.log('Interruption detected via audio level');
            onInterrupted?.();
          }, interruptionDelay);
        }
        
        if (isListeningRef.current) {
          animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
        }
      };
      
      checkAudioLevel();
      
    } catch (error) {
      console.error('Failed to start real-time interruption detection:', error);
      cleanup();
    }
  }, [silenceThreshold, interruptionDelay, onInterrupted, cleanup]);

  const stopListening = useCallback(() => {
    console.log('Stopping real-time interruption detection');
    cleanup();
  }, [cleanup]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    startListening,
    stopListening,
    isListening: isListeningRef.current
  };
};
