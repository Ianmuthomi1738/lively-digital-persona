
import React, { useEffect, useState, useRef } from 'react';

interface SiriAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
}

export const SiriAvatar: React.FC<SiriAvatarProps> = ({ isSpeaking, isListening }) => {
  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>(new Array(16).fill(0.1));
  const [particles, setParticles] = useState<Array<{x: number, y: number, opacity: number, scale: number}>>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      setWaveAmplitudes(prev => prev.map((_, index) => {
        if (isSpeaking) {
          // More dynamic wave animation when speaking
          const time = Date.now() * 0.008;
          const baseAmplitude = 0.4 + Math.sin(time + index * 0.4) * 0.5;
          const randomVariation = Math.random() * 0.4;
          const harmonic = Math.sin(time * 2 + index * 0.8) * 0.2;
          return Math.max(0.15, Math.min(1.2, baseAmplitude + randomVariation + harmonic));
        } else if (isListening) {
          // Rhythmic pulse when listening
          const time = Date.now() * 0.004;
          const pulse = 0.25 + Math.sin(time + index * 0.2) * 0.2;
          const ripple = Math.sin(time * 3 + index * 0.6) * 0.1;
          return pulse + ripple;
        } else {
          // Subtle breathing animation in idle
          const time = Date.now() * 0.002;
          return 0.12 + Math.sin(time + index * 0.15) * 0.08;
        }
      }));

      // Animate floating particles
      if (isSpeaking || isListening) {
        setParticles(prev => {
          const time = Date.now() * 0.001;
          return prev.map((particle, i) => ({
            x: 50 + Math.sin(time + i) * 30,
            y: 50 + Math.cos(time * 0.7 + i) * 25,
            opacity: 0.3 + Math.sin(time * 2 + i) * 0.3,
            scale: 0.5 + Math.sin(time * 1.5 + i) * 0.3
          }));
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize particles
    if (particles.length === 0) {
      setParticles(Array.from({ length: 8 }, (_, i) => ({
        x: 50 + Math.random() * 40 - 20,
        y: 50 + Math.random() * 40 - 20,
        opacity: 0.2,
        scale: 0.5
      })));
    }

    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpeaking, isListening, particles.length]);

  const getMainGlow = () => {
    if (isSpeaking) return 'shadow-purple-400/60 shadow-2xl';
    if (isListening) return 'shadow-blue-400/60 shadow-2xl';
    return 'shadow-gray-300/40 shadow-lg';
  };

  const getWaveColor = () => {
    if (isSpeaking) return 'from-purple-600 via-purple-400 to-purple-200';
    if (isListening) return 'from-blue-600 via-blue-400 to-blue-200';
    return 'from-gray-600 via-gray-400 to-gray-200';
  };

  const getCenterOrbColor = () => {
    if (isSpeaking) return 'bg-purple-400';
    if (isListening) return 'bg-blue-400';
    return 'bg-gray-300';
  };

  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      {/* Outer glow container */}
      <div className={`relative w-80 h-80 rounded-full transition-all duration-500 ${getMainGlow()}`}
           style={{
             background: isSpeaking 
               ? 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 50%, transparent 100%)'
               : isListening 
                 ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)'
                 : 'radial-gradient(circle, rgba(156, 163, 175, 0.05) 0%, transparent 70%)'
           }}>
        
        {/* Animated background rings */}
        {(isSpeaking || isListening) && (
          <>
            <div className={`absolute inset-0 rounded-full border-2 opacity-30 animate-ping ${
              isSpeaking ? 'border-purple-400' : 'border-blue-400'
            }`} />
            <div className={`absolute inset-8 rounded-full border opacity-20 animate-pulse ${
              isSpeaking ? 'border-purple-300' : 'border-blue-300'
            }`} />
            <div className={`absolute inset-16 rounded-full border opacity-10 ${
              isSpeaking ? 'border-purple-200' : 'border-blue-200'
            }`} 
                 style={{ animation: 'pulse 3s ease-in-out infinite' }} />
          </>
        )}

        {/* Floating particles */}
        {(isSpeaking || isListening) && particles.map((particle, index) => (
          <div
            key={index}
            className={`absolute w-2 h-2 rounded-full ${
              isSpeaking ? 'bg-purple-400/40' : 'bg-blue-400/40'
            } blur-sm`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              transform: `scale(${particle.scale})`,
              transition: 'all 0.1s ease-out'
            }}
          />
        ))}

        {/* Main visualization container */}
        <div className="absolute inset-12 rounded-full bg-black/10 backdrop-blur-xl border border-white/20 overflow-hidden">
          
          {/* Wave bars */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-end justify-center space-x-1 h-40">
              {waveAmplitudes.map((amplitude, index) => (
                <div
                  key={index}
                  className={`w-1.5 rounded-full bg-gradient-to-t ${getWaveColor()} transition-all duration-100 ease-out`}
                  style={{
                    height: `${Math.min(amplitude * 120, 160)}px`,
                    minHeight: '6px',
                    opacity: 0.7 + amplitude * 0.3,
                    transform: `scaleY(${0.6 + amplitude * 0.4}) scaleX(${1 + amplitude * 0.2})`,
                    filter: `blur(${amplitude > 0.8 ? '0.5px' : '0px'})`,
                    boxShadow: amplitude > 0.7 
                      ? isSpeaking 
                        ? '0 0 8px rgba(168, 85, 247, 0.6)' 
                        : '0 0 8px rgba(59, 130, 246, 0.6)'
                      : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Central orb with enhanced glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={`w-12 h-12 rounded-full ${getCenterOrbColor()} transition-all duration-300`}
              style={{
                transform: isSpeaking 
                  ? 'scale(1.3)' 
                  : isListening 
                    ? 'scale(1.15)'
                    : 'scale(1)',
                boxShadow: isSpeaking 
                  ? '0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2)' 
                  : isListening
                    ? '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2)'
                    : '0 0 15px rgba(156, 163, 175, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.1)',
                background: isSpeaking
                  ? 'radial-gradient(circle, #c084fc 0%, #a855f7 50%, #7c3aed 100%)'
                  : isListening
                    ? 'radial-gradient(circle, #60a5fa 0%, #3b82f6 50%, #1d4ed8 100%)'
                    : 'radial-gradient(circle, #d1d5db 0%, #9ca3af 50%, #6b7280 100%)'
              }}
            />
          </div>

          {/* Energy ripples */}
          {isSpeaking && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-ping" 
                   style={{ animationDuration: '1.5s' }} />
              <div className="absolute inset-4 rounded-full border border-purple-300/20 animate-ping" 
                   style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
            </>
          )}
        </div>

        {/* Enhanced status indicator */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <div className={`px-6 py-2 rounded-full text-sm font-medium backdrop-blur-md border transition-all duration-300 ${
            isSpeaking 
              ? 'bg-purple-500/30 text-purple-100 border-purple-400/40 shadow-purple-400/20 shadow-lg' 
              : isListening 
                ? 'bg-blue-500/30 text-blue-100 border-blue-400/40 shadow-blue-400/20 shadow-lg'
                : 'bg-gray-500/20 text-gray-200 border-gray-400/30'
          }`}>
            <div className="flex items-center space-x-2">
              {(isSpeaking || isListening) && (
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  isSpeaking ? 'bg-purple-300' : 'bg-blue-300'
                }`} />
              )}
              <span>
                {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
