
import React, { useEffect, useState, useRef } from 'react';

interface SiriAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
}

export const SiriAvatar: React.FC<SiriAvatarProps> = ({ isSpeaking, isListening }) => {
  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>(new Array(12).fill(0.1));
  const animationRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      setWaveAmplitudes(prev => prev.map((_, index) => {
        if (isSpeaking) {
          // Create dynamic wave animation when speaking
          const time = Date.now() * 0.005;
          const baseAmplitude = 0.3 + Math.sin(time + index * 0.5) * 0.4;
          const randomVariation = Math.random() * 0.3;
          return Math.max(0.1, Math.min(1, baseAmplitude + randomVariation));
        } else if (isListening) {
          // Gentle pulse when listening
          const time = Date.now() * 0.003;
          return 0.2 + Math.sin(time + index * 0.3) * 0.15;
        } else {
          // Idle state - minimal movement
          const time = Date.now() * 0.001;
          return 0.1 + Math.sin(time + index * 0.2) * 0.05;
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
  }, [isSpeaking, isListening]);

  const getGlowColor = () => {
    if (isSpeaking) return 'shadow-purple-500/50';
    if (isListening) return 'shadow-blue-500/50';
    return 'shadow-gray-400/30';
  };

  const getBarColor = () => {
    if (isSpeaking) return 'bg-gradient-to-t from-purple-600 via-purple-400 to-purple-200';
    if (isListening) return 'bg-gradient-to-t from-blue-600 via-blue-400 to-blue-200';
    return 'bg-gradient-to-t from-gray-600 via-gray-400 to-gray-200';
  };

  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      {/* Main container with glow effect */}
      <div className={`relative w-80 h-80 rounded-full bg-black/10 backdrop-blur-xl border border-white/20 ${getGlowColor()} shadow-2xl`}>
        
        {/* Outer ring */}
        <div className="absolute inset-4 rounded-full border border-white/10" />
        
        {/* Inner visualization area */}
        <div className="absolute inset-12 rounded-full bg-black/5 backdrop-blur-sm overflow-hidden">
          
          {/* Wave bars container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-end justify-center space-x-1.5 h-32">
              {waveAmplitudes.map((amplitude, index) => (
                <div
                  key={index}
                  className={`w-2 rounded-full ${getBarColor()} transition-all duration-75 ease-out`}
                  style={{
                    height: `${amplitude * 100}%`,
                    minHeight: '8px',
                    opacity: 0.8 + amplitude * 0.2,
                    transform: `scaleY(${0.5 + amplitude * 0.5})`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Central glow orb */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={`w-8 h-8 rounded-full transition-all duration-300 ${
                isSpeaking 
                  ? 'bg-purple-400 shadow-purple-400/50 shadow-lg scale-110' 
                  : isListening 
                    ? 'bg-blue-400 shadow-blue-400/50 shadow-lg scale-105'
                    : 'bg-gray-300 shadow-gray-300/30 shadow-md scale-100'
              }`}
              style={{
                boxShadow: isSpeaking 
                  ? '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)' 
                  : isListening
                    ? '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'
                    : '0 0 10px rgba(156, 163, 175, 0.3)'
              }}
            />
          </div>

          {/* Animated rings */}
          {(isSpeaking || isListening) && (
            <>
              <div className={`absolute inset-0 rounded-full border-2 ${
                isSpeaking ? 'border-purple-400/30' : 'border-blue-400/30'
              } animate-ping`} />
              <div className={`absolute inset-4 rounded-full border ${
                isSpeaking ? 'border-purple-400/20' : 'border-blue-400/20'
              } animate-pulse`} />
            </>
          )}
        </div>

        {/* Status indicator */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className={`px-4 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20 ${
            isSpeaking 
              ? 'bg-purple-500/20 text-purple-200' 
              : isListening 
                ? 'bg-blue-500/20 text-blue-200'
                : 'bg-gray-500/20 text-gray-300'
          }`}>
            {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready'}
          </div>
        </div>
      </div>
    </div>
  );
};
