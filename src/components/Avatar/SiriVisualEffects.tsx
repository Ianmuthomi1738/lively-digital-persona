
import React from 'react';
import { useParticles } from './hooks/useParticles';

interface SiriVisualEffectsProps {
  isSpeaking: boolean;
  isListening: boolean;
  audioVolume: number;
  rhythm: number;
  intensity: number;
  colorClasses: {
    main: string;
    glow: string;
    orb: string;
    particle: string;
    status: string;
  };
}

export const SiriVisualEffects: React.FC<SiriVisualEffectsProps> = ({
  isSpeaking,
  isListening,
  audioVolume,
  rhythm,
  intensity,
  colorClasses
}) => {
  const particles = useParticles({
    isActive: isSpeaking || isListening,
    audioVolume,
    rhythm,
    intensity
  });

  return (
    <>
      {/* Animated rings */}
      {(isSpeaking || isListening) && (
        <>
          <div className={`absolute inset-0 rounded-full border-2 opacity-30 animate-ping border-purple-400`} />
          <div className={`absolute inset-4 sm:inset-8 rounded-full border opacity-20 animate-pulse border-purple-300`} />
        </>
      )}

      {/* Floating particles */}
      {(isSpeaking || isListening) && particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${colorClasses.particle} blur-sm`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            transform: `scale(${particle.scale})`,
            transition: 'all 0.1s ease-out'
          }}
        />
      ))}
    </>
  );
};
