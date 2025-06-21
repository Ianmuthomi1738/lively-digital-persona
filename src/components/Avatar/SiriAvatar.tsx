
import React from 'react';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import { SiriVisualEffects } from './SiriVisualEffects';
import { SiriWaveVisualization } from './SiriWaveVisualization';

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
  const audioData = useAudioAnalyzer(isListening || isSpeaking);

  const voiceStyles = {
    natural: { intensity: 1, speed: 1, color: 'purple' },
    expressive: { intensity: 1.5, speed: 1.3, color: 'blue' },
    professional: { intensity: 0.8, speed: 0.8, color: 'indigo' },
    friendly: { intensity: 1.2, speed: 1.1, color: 'green' },
    energetic: { intensity: 1.8, speed: 1.5, color: 'orange' }
  };

  const currentStyle = voiceStyles[voiceStyle as keyof typeof voiceStyles] || voiceStyles.natural;

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
      <div className={`relative w-64 h-64 sm:w-80 sm:h-80 rounded-full transition-all duration-500 ${
        isSpeaking ? colorClasses.glow + ' shadow-2xl' : 
        isListening ? colorClasses.glow + ' shadow-xl' : 'shadow-lg shadow-gray-300/40'
      }`}
           style={{
             background: isSpeaking 
               ? `radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)`
               : isListening 
                 ? `radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)`
                 : 'radial-gradient(circle, rgba(156, 163, 175, 0.05) 0%, transparent 70%)'
           }}>
        
        <SiriVisualEffects
          isSpeaking={isSpeaking}
          isListening={isListening}
          audioVolume={audioData.volume}
          rhythm={audioData.rhythm}
          intensity={currentStyle.intensity}
          colorClasses={colorClasses}
        />

        <div className="absolute inset-8 sm:inset-12 rounded-full bg-black/10 backdrop-blur-xl border border-white/20 overflow-hidden">
          <SiriWaveVisualization
            isSpeaking={isSpeaking}
            isListening={isListening}
            audioVolume={audioData.volume}
            dominantFrequency={audioData.dominantFrequency}
            rhythm={audioData.rhythm}
            styleConfig={currentStyle}
          />

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
                  ? `0 0 20px rgba(168, 85, 247, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.2)` 
                  : isListening
                    ? `0 0 15px rgba(59, 130, 246, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2)`
                    : '0 0 10px rgba(156, 163, 175, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.1)'
              }}
            />
          </div>
        </div>

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
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse bg-purple-300`} />
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
