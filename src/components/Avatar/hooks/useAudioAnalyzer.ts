
import { useState, useEffect, useRef, useCallback } from 'react';

interface AudioAnalyzerData {
  frequencies: Float32Array;
  volume: number;
  dominantFrequency: number;
  rhythm: number;
}

export const useAudioAnalyzer = (isActive: boolean) => {
  const [audioData, setAudioData] = useState<AudioAnalyzerData>({
    frequencies: new Float32Array(32),
    volume: 0,
    dominantFrequency: 0,
    rhythm: 0
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  const rhythmHistory = useRef<number[]>([]);

  const initializeAudioContext = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        // Handle webkit prefix properly
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        analyzerRef.current = audioContextRef.current.createAnalyser();
        analyzerRef.current.fftSize = 64;
        analyzerRef.current.smoothingTimeConstant = 0.8;
      }

      // Try to capture microphone for listening mode
      if (isActive) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyzerRef.current);
      }
    } catch (error) {
      console.log('Microphone access not available, using simulated data');
    }
  }, [isActive]);

  const analyzeAudio = useCallback(() => {
    if (!analyzerRef.current) return;

    const frequencies = new Float32Array(analyzerRef.current.frequencyBinCount);
    const timeDomain = new Float32Array(analyzerRef.current.fftSize);
    
    // Use correct Web Audio API method names
    analyzerRef.current.getByteFrequencyData(frequencies);
    analyzerRef.current.getByteTimeDomainData(timeDomain);

    // Calculate volume (RMS)
    let sum = 0;
    for (let i = 0; i < timeDomain.length; i++) {
      const normalized = (timeDomain[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const volume = Math.sqrt(sum / timeDomain.length);

    // Find dominant frequency
    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 0; i < frequencies.length; i++) {
      if (frequencies[i] > maxValue) {
        maxValue = frequencies[i];
        maxIndex = i;
      }
    }
    const dominantFrequency = maxIndex / frequencies.length;

    // Calculate rhythm (beat detection)
    rhythmHistory.current.push(volume);
    if (rhythmHistory.current.length > 20) {
      rhythmHistory.current.shift();
    }
    
    const avgVolume = rhythmHistory.current.reduce((a, b) => a + b, 0) / rhythmHistory.current.length;
    const rhythm = volume > avgVolume * 1.2 ? 1 : 0;

    setAudioData({
      frequencies,
      volume: volume * 100,
      dominantFrequency,
      rhythm
    });

    animationRef.current = requestAnimationFrame(analyzeAudio);
  }, []);

  useEffect(() => {
    if (isActive) {
      initializeAudioContext();
      analyzeAudio();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, initializeAudioContext, analyzeAudio]);

  return audioData;
};
