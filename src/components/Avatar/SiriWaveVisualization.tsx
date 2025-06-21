
import React from 'react';
import { useWaveAnimation } from './hooks/useWaveAnimation';

interface SiriWaveVisualizationProps {
  isSpeaking: boolean;
  isListening: boolean;
  audioVolume: number;
  dominantFrequency: number;
  rhythm: number;
  styleConfig: {
    intensity: number;
    speed: number;
    color: string;
  };
}

export const SiriWaveVisualization: React.FC<SiriWaveVisualizationProps> = ({
  isSpeaking,
  isListening,
  audioVolume,
  dominantFrequency,
  rhythm,
  styleConfig
}) => {
  const waveAmplitudes = useWaveAnimation({
    isSpeaking,
    isListening,
    audioVolume,
    dominantFrequency,
    rhythm,
    styleConfig
  });

  const getColorClasses = () => {
    const colors = {
      purple: 'from-purple-600 via-purple-400 to-purple-200',
      blue: 'from-blue-600 via-blue-400 to-blue-200',
      indigo: 'from-indigo-600 via-indigo-400 to-indigo-200',
      green: 'from-green-600 via-green-400 to-green-200',
      orange: 'from-orange-600 via-orange-400 to-orange-200'
    };
    return colors[styleConfig.color as keyof typeof colors] || colors.purple;
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex items-end justify-center space-x-0.5 sm:space-x-1 h-32 sm:h-40">
        {waveAmplitudes.map((amplitude, index) => (
          <div
            key={index}
            className={`w-1 sm:w-1.5 rounded-full bg-gradient-to-t ${getColorClasses()} transition-all duration-75 ease-out`}
            style={{
              height: `${Math.min(amplitude * 100, 140)}px`,
              minHeight: '4px',
              opacity: 0.6 + amplitude * 0.4,
              transform: `scaleY(${0.5 + amplitude * 0.5}) scaleX(${1 + amplitude * 0.3})`,
              filter: `blur(${amplitude > 0.8 ? '0.5px' : '0px'})`,
              boxShadow: amplitude > 0.7 
                ? `0 0 6px rgba(168, 85, 247, 0.6)` 
                : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
};
