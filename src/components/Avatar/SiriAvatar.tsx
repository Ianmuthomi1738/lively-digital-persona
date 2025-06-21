import React, { useEffect, useState, useRef } from 'react';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';

interface SiriAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  voiceStyle?: string;
}

export const SiriAvatar: React.FC<SiriAvatarProps> = ({ 
  isSpeaking, 
  isListening, 
  voiceStyle = 'natural' 
}) => {
  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>(new Array(20).fill(0.1));
  const [particles, setParticles] = useState<Array<{x: number, y: number, opacity: number, scale: number, velocity: {x: number, y: number}}>>([]);
  const animationRef = useRef<number>();
  const audioData = useAudioAnalyzer(isListening || isSpeaking);

  // Voice style configurations
  const voiceStyles = {
    natural: { intensity: 1, speed: 1, color: 'purple' },
    expressive: { intensity: 1.5, speed: 1.3, color: 'blue' },
    professional: { intensity: 0.8, speed: 0.8, color: 'indigo' },
    friendly: { intensity: 1.2, speed: 1.1, color: 'green' },
    energetic: { intensity: 1.8, speed: 1.5, color: 'orange' }
  };

  const currentStyle = voiceStyles[voiceStyle as keyof typeof voiceStyles] || voiceStyles.natural;

  useEffect(() => {
    const animate = () => {
      setWaveAmplitudes(prev => prev.map((_, index) => {
        const time = Date.now() * 0.001 * currentStyle.speed;
        const audioInfluence = audioData.volume * 0.02;
        const rhythmBoost = audioData.rhythm * 0.3;
        
        if (isSpeaking) {
          // Enhanced speaking animation with audio responsiveness
          const baseWave = Math.sin(time * 3 + index * 0.5) * 0.4;
          const harmonicWave = Math.sin(time * 6 + index * 0.8) * 0.2;
          const audioWave = audioInfluence * Math.sin(time * 8 + index * 0.3);
          const frequencyWave = audioData.dominantFrequency * Math.sin(time * 4 + index * 0.6) * 0.3;
          
          return Math.max(0.15, Math.min(1.5, 
            (0.5 + baseWave + harmonicWave + audioWave + frequencyWave + rhythmBoost) * currentStyle.intensity
          ));
        } else if (isListening) {
          // Dynamic listening animation
          const pulse = 0.3 + Math.sin(time * 2 + index * 0.3) * 0.25;
          const ripple = Math.sin(time * 4 + index * 0.7) * 0.15;
          const audioResponse = audioInfluence * 2;
          
          return Math.max(0.2, Math.min(1.2, 
            pulse + ripple + audioResponse + rhythmBoost * 0.5
          ));
        } else {
          // Subtle idle breathing
          return 0.12 + Math.sin(time * 0.5 + index * 0.2) * 0.08;
        }
      }));

      // Enhanced particle system
      if (isSpeaking || isListening) {
        setParticles(prev => {
          const time = Date.now() * 0.001;
          const intensity = isSpeaking ? currentStyle.intensity : 0.5;
          
          return prev.map((particle, i) => {
            const audioBoost = audioData.volume * 0.1;
            const rhythmPush = audioData.rhythm * 5;
            
            return {
              x: 50 + Math.sin(time + i * 0.8) * (25 + audioBoost) + particle.velocity.x,
              y: 50 + Math.cos(time * 0.6 + i * 1.2) * (20 + audioBoost) + particle.velocity.y,
              opacity: (0.2 + Math.sin(time * 3 + i) * 0.3 + audioBoost * 0.02) * intensity,
              scale: (0.4 + Math.sin(time * 2 + i) * 0.4 + rhythmPush * 0.1) * intensity,
              velocity: {
                x: particle.velocity.x + (Math.random() - 0.5) * 0.5,
                y: particle.velocity.y + (Math.random() - 0.5) * 0.5
              }
            };
          });
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize particles
    if (particles.length === 0) {
      setParticles(Array.from({ length: 12 }, (_, i) => ({
        x: 50 + Math.random() * 40 - 20,
        y: 50 + Math.random() * 40 - 20,
        opacity: 0.2,
        scale: 0.5,
        velocity: { x: 0, y: 0 }
      })));
    }

    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpeaking, isListening, currentStyle, audioData, particles.length]);

  const getColorClasses = () => {
    const colors = {
      purple: {
        main: 'from-purple-600 via-purple-400 to-purple-200',
        glow: 'shadow-purple-400/60',
        orb: 'bg-purple-400',
        particle: 'bg-purple-400/40',
        status: 'bg-purple-500/30 text-purple-100 border-purple-400/40'
      },
      blue: {
        main: 'from-blue-600 via-blue-400 to-blue-200',
        glow: 'shadow-blue-400/60',
        orb: 'bg-blue-400',
        particle: 'bg-blue-400/40',
        status: 'bg-blue-500/30 text-blue-100 border-blue-400/40'
      },
      indigo: {
        main: 'from-indigo-600 via-indigo-400 to-indigo-200',
        glow: 'shadow-indigo-400/60',
        orb: 'bg-indigo-400',
        particle: 'bg-indigo-400/40',
        status: 'bg-indigo-500/30 text-indigo-100 border-indigo-400/40'
      },
      green: {
        main: 'from-green-600 via-green-400 to-green-200',
        glow: 'shadow-green-400/60',
        orb: 'bg-green-400',
        particle: 'bg-green-400/40',
        status: 'bg-green-500/30 text-green-100 border-green-400/40'
      },
      orange: {
        main: 'from-orange-600 via-orange-400 to-orange-200',
        glow: 'shadow-orange-400/60',
        orb: 'bg-orange-400',
        particle: 'bg-orange-400/40',
        status: 'bg-orange-500/30 text-orange-100 border-orange-400/40'
      }
    };
    
    return colors[currentStyle.color as keyof typeof colors] || colors.purple;
  };

  const colorClasses = getColorClasses();

  return (
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center touch-manipulation">
      {/* Enhanced responsive container */}
      <div className={`relative w-64 h-64 sm:w-80 sm:h-80 rounded-full transition-all duration-500 ${
        isSpeaking ? colorClasses.glow + ' shadow-2xl' : 
        isListening ? colorClasses.glow + ' shadow-xl' : 'shadow-lg shadow-gray-300/40'
      }`}
           style={{
             background: isSpeaking 
               ? `radial-gradient(circle, ${currentStyle.color === 'purple' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(59, 130, 246, 0.15)'} 0%, transparent 70%)`
               : isListening 
                 ? `radial-gradient(circle, ${currentStyle.color === 'blue' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)'} 0%, transparent 70%)`
                 : 'radial-gradient(circle, rgba(156, 163, 175, 0.05) 0%, transparent 70%)'
           }}>
        
        {/* Responsive animated rings */}
        {(isSpeaking || isListening) && (
          <>
            <div className={`absolute inset-0 rounded-full border-2 opacity-30 animate-ping ${
              isSpeaking ? `border-${currentStyle.color}-400` : `border-${currentStyle.color}-400`
            }`} />
            <div className={`absolute inset-4 sm:inset-8 rounded-full border opacity-20 animate-pulse ${
              isSpeaking ? `border-${currentStyle.color}-300` : `border-${currentStyle.color}-300`
            }`} />
          </>
        )}

        {/* Enhanced floating particles */}
        {(isSpeaking || isListening) && particles.map((particle, index) => (
          <div
            key={index}
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

        {/* Main visualization container - responsive */}
        <div className="absolute inset-8 sm:inset-12 rounded-full bg-black/10 backdrop-blur-xl border border-white/20 overflow-hidden">
          
          {/* Enhanced wave bars with audio responsiveness */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-end justify-center space-x-0.5 sm:space-x-1 h-32 sm:h-40">
              {waveAmplitudes.map((amplitude, index) => (
                <div
                  key={index}
                  className={`w-1 sm:w-1.5 rounded-full bg-gradient-to-t ${colorClasses.main} transition-all duration-75 ease-out`}
                  style={{
                    height: `${Math.min(amplitude * 100, 140)}px`,
                    minHeight: '4px',
                    opacity: 0.6 + amplitude * 0.4,
                    transform: `scaleY(${0.5 + amplitude * 0.5}) scaleX(${1 + amplitude * 0.3})`,
                    filter: `blur(${amplitude > 0.8 ? '0.5px' : '0px'})`,
                    boxShadow: amplitude > 0.7 
                      ? `0 0 6px rgba(${currentStyle.color === 'purple' ? '168, 85, 247' : '59, 130, 246'}, 0.6)` 
                      : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Responsive central orb */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full ${colorClasses.orb} transition-all duration-300`}
              style={{
                transform: isSpeaking 
                  ? `scale(${1.2 + audioData.volume * 0.01})` 
                  : isListening 
                    ? `scale(${1.1 + audioData.volume * 0.005})`
                    : 'scale(1)',
                boxShadow: isSpeaking 
                  ? `0 0 20px rgba(${currentStyle.color === 'purple' ? '168, 85, 247' : '59, 130, 246'}, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.2)` 
                  : isListening
                    ? `0 0 15px rgba(${currentStyle.color === 'blue' ? '59, 130, 246' : '168, 85, 247'}, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2)`
                    : '0 0 10px rgba(156, 163, 175, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.1)'
              }}
            />
          </div>
        </div>

        {/* Mobile-optimized status indicator */}
        <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2">
          <div className={`px-3 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-medium backdrop-blur-md border transition-all duration-300 ${
            isSpeaking 
              ? colorClasses.status + ' shadow-lg' 
              : isListening 
                ? colorClasses.status + ' shadow-lg'
                : 'bg-gray-500/20 text-gray-200 border-gray-400/30'
          }`}>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              {(isSpeaking || isListening) && (
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${
                  isSpeaking ? `bg-${currentStyle.color}-300` : `bg-${currentStyle.color}-300`
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
