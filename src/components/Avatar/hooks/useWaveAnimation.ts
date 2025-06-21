
import { useState, useEffect, useRef } from 'react';

interface UseWaveAnimationProps {
  isSpeaking: boolean;
  isListening: boolean;
  audioVolume: number;
  dominantFrequency: number;
  rhythm: number;
  styleConfig: {
    intensity: number;
    speed: number;
  };
}

export const useWaveAnimation = ({
  isSpeaking,
  isListening,
  audioVolume,
  dominantFrequency,
  rhythm,
  styleConfig
}: UseWaveAnimationProps) => {
  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>(new Array(20).fill(0.1));
  const animationRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      const time = Date.now() * 0.001 * styleConfig.speed;
      const audioInfluence = audioVolume * 0.02;
      const rhythmBoost = rhythm * 0.3;

      setWaveAmplitudes(prev => prev.map((_, index) => {
        if (isSpeaking) {
          const baseWave = Math.sin(time * 3 + index * 0.5) * 0.4;
          const harmonicWave = Math.sin(time * 6 + index * 0.8) * 0.2;
          const audioWave = audioInfluence * Math.sin(time * 8 + index * 0.3);
          const frequencyWave = dominantFrequency * Math.sin(time * 4 + index * 0.6) * 0.3;
          
          return Math.max(0.15, Math.min(1.5, 
            (0.5 + baseWave + harmonicWave + audioWave + frequencyWave + rhythmBoost) * styleConfig.intensity
          ));
        } else if (isListening) {
          const pulse = 0.3 + Math.sin(time * 2 + index * 0.3) * 0.25;
          const ripple = Math.sin(time * 4 + index * 0.7) * 0.15;
          const audioResponse = audioInfluence * 2;
          
          return Math.max(0.2, Math.min(1.2, 
            pulse + ripple + audioResponse + rhythmBoost * 0.5
          ));
        } else {
          return 0.12 + Math.sin(time * 0.5 + index * 0.2) * 0.08;
        }
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpeaking, isListening, audioVolume, dominantFrequency, rhythm, styleConfig.intensity, styleConfig.speed]);

  return waveAmplitudes;
};
