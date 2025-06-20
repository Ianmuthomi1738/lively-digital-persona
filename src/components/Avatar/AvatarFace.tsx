
import React from 'react';

interface AvatarFaceProps {
  expression: 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised';
  blinkState: 'open' | 'closing' | 'closed' | 'opening';
  mouthState: 'closed' | 'small' | 'open' | 'wide' | 'rounded' | 'smile';
  eyebrowRaise: number;
  isSpeaking: boolean;
}

export const AvatarFace: React.FC<AvatarFaceProps> = ({
  expression,
  blinkState,
  mouthState,
  eyebrowRaise,
  isSpeaking
}) => {
  const getEyeStyle = () => {
    const baseStyle = "absolute w-12 h-8 bg-white rounded-full shadow-lg border border-pink-100";
    switch (blinkState) {
      case 'closed':
        return `${baseStyle} h-1 border-pink-200`;
      case 'closing':
        return `${baseStyle} h-4`;
      case 'opening':
        return `${baseStyle} h-6`;
      default:
        return baseStyle;
    }
  };

  const getMouthStyle = () => {
    const baseStyle = "absolute transition-all duration-100";
    switch (mouthState) {
      case 'closed':
        return `${baseStyle} w-8 h-1 bg-pink-400 rounded-full`;
      case 'small':
        return `${baseStyle} w-6 h-6 bg-gradient-to-b from-pink-300 to-red-400 rounded-full border border-pink-400`;
      case 'open':
        return `${baseStyle} w-8 h-10 bg-gradient-to-b from-pink-300 to-red-500 rounded-full border border-pink-400`;
      case 'wide':
        return `${baseStyle} w-12 h-8 bg-gradient-to-b from-pink-300 to-red-500 rounded-full border border-pink-400`;
      case 'rounded':
        return `${baseStyle} w-7 h-8 bg-gradient-to-b from-pink-300 to-red-400 rounded-full border border-pink-400`;
      case 'smile':
        return `${baseStyle} w-10 h-4 bg-pink-400 rounded-full border border-pink-500`;
      default:
        return `${baseStyle} w-8 h-2 bg-pink-400 rounded-full`;
    }
  };

  const getExpressionStyles = () => {
    switch (expression) {
      case 'happy':
        return {
          eyebrows: 'translate-y-0',
          cheeks: 'bg-pink-200 opacity-80',
          mouthCorners: 'rotate-0'
        };
      case 'sad':
        return {
          eyebrows: 'translate-y-1',
          cheeks: 'bg-blue-100 opacity-60',
          mouthCorners: 'rotate-0'
        };
      case 'thinking':
        return {
          eyebrows: 'translate-y-0',
          cheeks: 'bg-purple-100 opacity-50',
          mouthCorners: 'rotate-0'
        };
      case 'surprised':
        return {
          eyebrows: '-translate-y-2',
          cheeks: 'bg-yellow-100 opacity-70',
          mouthCorners: 'rotate-0'
        };
      default:
        return {
          eyebrows: 'translate-y-0',
          cheeks: 'bg-pink-100 opacity-60',
          mouthCorners: 'rotate-0'
        };
    }
  };

  const expressionStyles = getExpressionStyles();

  return (
    <div className="relative w-full h-full">
      {/* Head shape with realistic proportions */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 rounded-full overflow-hidden">
        
        {/* Hair - more realistic styling */}
        <div className="absolute -top-6 -left-4 -right-4 h-32 bg-gradient-to-b from-amber-600 via-amber-500 to-amber-400 rounded-t-full">
          {/* Hair texture and highlights */}
          <div className="absolute top-4 left-8 w-20 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full opacity-80 transform -rotate-12"></div>
          <div className="absolute top-4 right-8 w-20 h-24 bg-gradient-to-bl from-amber-400 to-amber-600 rounded-full opacity-80 transform rotate-12"></div>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-20 bg-gradient-to-b from-amber-300 to-amber-500 rounded-full opacity-90"></div>
          
          {/* Hair strands for texture */}
          <div className="absolute top-8 left-12 w-2 h-16 bg-amber-700 rounded-full opacity-60 transform rotate-12"></div>
          <div className="absolute top-8 right-12 w-2 h-16 bg-amber-700 rounded-full opacity-60 transform -rotate-12"></div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-2 h-18 bg-amber-700 rounded-full opacity-60"></div>
        </div>

        {/* Face base with realistic skin tone */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-56 h-72 bg-gradient-to-b from-orange-100 via-peach-200 to-peach-300 rounded-full shadow-2xl border border-orange-200">
          
          {/* Forehead highlighting */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-gradient-to-b from-orange-50 to-transparent rounded-full opacity-60"></div>
          
          {/* Eyebrows - more realistic shape and color */}
          <div 
            className={`absolute top-16 left-16 w-12 h-3 bg-gradient-to-r from-amber-800 to-amber-700 rounded-full transform transition-transform duration-300 ${expressionStyles.eyebrows}`}
            style={{ 
              transform: `translateY(${eyebrowRaise}px) rotate(-8deg)`,
              clipPath: 'polygon(0% 100%, 100% 100%, 85% 0%, 15% 0%)'
            }}
          ></div>
          <div 
            className={`absolute top-16 right-16 w-12 h-3 bg-gradient-to-l from-amber-800 to-amber-700 rounded-full transform transition-transform duration-300 ${expressionStyles.eyebrows}`}
            style={{ 
              transform: `translateY(${eyebrowRaise}px) rotate(8deg)`,
              clipPath: 'polygon(0% 100%, 100% 100%, 85% 0%, 15% 0%)'
            }}
          ></div>

          {/* Eyes with more realistic appearance */}
          <div className="absolute top-20 left-12">
            <div className={getEyeStyle()}>
              {blinkState === 'open' && (
                <>
                  {/* Eye socket shadow */}
                  <div className="absolute -top-1 -left-1 w-14 h-10 bg-orange-200 rounded-full opacity-50"></div>
                  {/* Iris */}
                  <div className="absolute top-1 left-2 w-8 h-6 bg-gradient-radial from-emerald-400 via-emerald-600 to-emerald-800 rounded-full shadow-inner">
                    {/* Pupil */}
                    <div className="absolute top-1 left-2 w-4 h-4 bg-black rounded-full">
                      {/* Light reflection */}
                      <div className="absolute top-0.5 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-90"></div>
                      <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-white rounded-full opacity-60"></div>
                    </div>
                  </div>
                  {/* Lower eyelid */}
                  <div className="absolute bottom-0 left-0 w-full h-2 bg-peach-300 rounded-b-full opacity-80"></div>
                </>
              )}
            </div>
          </div>
          
          <div className="absolute top-20 right-12">
            <div className={getEyeStyle()}>
              {blinkState === 'open' && (
                <>
                  {/* Eye socket shadow */}
                  <div className="absolute -top-1 -left-1 w-14 h-10 bg-orange-200 rounded-full opacity-50"></div>
                  {/* Iris */}
                  <div className="absolute top-1 left-2 w-8 h-6 bg-gradient-radial from-emerald-400 via-emerald-600 to-emerald-800 rounded-full shadow-inner">
                    {/* Pupil */}
                    <div className="absolute top-1 left-2 w-4 h-4 bg-black rounded-full">
                      {/* Light reflection */}
                      <div className="absolute top-0.5 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-90"></div>
                      <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-white rounded-full opacity-60"></div>
                    </div>
                  </div>
                  {/* Lower eyelid */}
                  <div className="absolute bottom-0 left-0 w-full h-2 bg-peach-300 rounded-b-full opacity-80"></div>
                </>
              )}
            </div>
          </div>

          {/* Nose with more realistic 3D appearance */}
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2">
            {/* Nose bridge */}
            <div className="w-4 h-8 bg-gradient-to-b from-peach-200 to-peach-400 rounded-full shadow-md"></div>
            {/* Nose tip */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-gradient-to-b from-peach-300 to-peach-400 rounded-full shadow-sm"></div>
            {/* Nostrils */}
            <div className="absolute bottom-0 left-0 w-1.5 h-2 bg-peach-500 rounded-full shadow-inner"></div>
            <div className="absolute bottom-0 right-0 w-1.5 h-2 bg-peach-500 rounded-full shadow-inner"></div>
          </div>

          {/* Cheeks with realistic blush */}
          <div className={`absolute top-28 left-8 w-12 h-10 ${expressionStyles.cheeks} rounded-full transition-all duration-300 blur-sm`}></div>
          <div className={`absolute top-28 right-8 w-12 h-10 ${expressionStyles.cheeks} rounded-full transition-all duration-300 blur-sm`}></div>

          {/* Lips with more realistic appearance */}
          <div className="absolute top-44 left-1/2 transform -translate-x-1/2">
            {/* Upper lip */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-pink-400 rounded-full opacity-80"></div>
            {/* Main mouth */}
            <div className={`${getMouthStyle()} ${expressionStyles.mouthCorners} shadow-lg`}>
              {mouthState !== 'closed' && (
                <>
                  {/* Inner mouth */}
                  <div className="absolute inset-1 bg-gradient-to-b from-red-400 to-red-600 rounded-full shadow-inner"></div>
                  {/* Teeth for open mouth states */}
                  {(mouthState === 'open' || mouthState === 'wide') && (
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-white rounded-sm opacity-90"></div>
                  )}
                </>
              )}
              {mouthState === 'smile' && (
                <div className="absolute -top-1 left-0 w-full h-3 bg-white rounded-full opacity-70"></div>
              )}
            </div>
            {/* Lower lip */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-pink-500 rounded-full opacity-70"></div>
          </div>

          {/* Chin definition */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-transparent to-peach-400 rounded-full opacity-40"></div>

          {/* Facial contours and shadows */}
          <div className="absolute top-8 left-4 w-8 h-32 bg-gradient-to-r from-orange-300 to-transparent rounded-full opacity-30"></div>
          <div className="absolute top-8 right-4 w-8 h-32 bg-gradient-to-l from-orange-300 to-transparent rounded-full opacity-30"></div>

          {/* Speaking indicator */}
          {isSpeaking && (
            <div className="absolute top-40 left-1/2 transform -translate-x-1/2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-blue-300 rounded-full animate-ping opacity-50"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
