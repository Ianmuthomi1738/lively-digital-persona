
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
    const baseStyle = "absolute w-8 h-8 bg-white rounded-full shadow-inner";
    switch (blinkState) {
      case 'closed':
        return `${baseStyle} h-1`;
      case 'closing':
        return `${baseStyle} h-4`;
      case 'opening':
        return `${baseStyle} h-6`;
      default:
        return baseStyle;
    }
  };

  const getMouthStyle = () => {
    const baseStyle = "absolute bg-pink-200 rounded-full transition-all duration-100";
    switch (mouthState) {
      case 'closed':
        return `${baseStyle} w-6 h-1`;
      case 'small':
        return `${baseStyle} w-4 h-4 rounded-full`;
      case 'open':
        return `${baseStyle} w-6 h-8 rounded-full`;
      case 'wide':
        return `${baseStyle} w-10 h-6 rounded-full`;
      case 'rounded':
        return `${baseStyle} w-5 h-6 rounded-full`;
      case 'smile':
        return `${baseStyle} w-8 h-3 rounded-full`;
      default:
        return `${baseStyle} w-6 h-2`;
    }
  };

  const getExpressionStyles = () => {
    switch (expression) {
      case 'happy':
        return {
          eyebrows: 'translate-y-0',
          cheeks: 'bg-pink-300 opacity-60',
          mouthCorners: 'rotate-12'
        };
      case 'sad':
        return {
          eyebrows: 'translate-y-1',
          cheeks: 'bg-blue-200 opacity-40',
          mouthCorners: '-rotate-12'
        };
      case 'thinking':
        return {
          eyebrows: 'translate-y-0 rotate-3',
          cheeks: 'bg-purple-200 opacity-30',
          mouthCorners: 'rotate-6'
        };
      case 'surprised':
        return {
          eyebrows: '-translate-y-1',
          cheeks: 'bg-yellow-200 opacity-50',
          mouthCorners: 'rotate-0'
        };
      default:
        return {
          eyebrows: 'translate-y-0',
          cheeks: 'bg-pink-200 opacity-30',
          mouthCorners: 'rotate-0'
        };
    }
  };

  const expressionStyles = getExpressionStyles();

  return (
    <div className="relative w-full h-full">
      {/* Hair */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400 rounded-full">
        <div className="absolute inset-4 bg-gradient-to-b from-pink-100 to-peach-200 rounded-full">
          {/* Hair strands */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full opacity-90"></div>
          <div className="absolute top-0 left-8 w-24 h-16 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full opacity-80 transform -rotate-12"></div>
          <div className="absolute top-0 right-8 w-24 h-16 bg-gradient-to-bl from-yellow-200 to-yellow-400 rounded-full opacity-80 transform rotate-12"></div>
          
          {/* Face base */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-48 h-56 bg-gradient-to-b from-peach-100 to-peach-200 rounded-full shadow-lg">
            
            {/* Eyebrows */}
            <div 
              className={`absolute top-12 left-12 w-8 h-2 bg-amber-700 rounded-full transform transition-transform duration-300 ${expressionStyles.eyebrows}`}
              style={{ transform: `translateY(${eyebrowRaise}px) rotate(-5deg)` }}
            ></div>
            <div 
              className={`absolute top-12 right-12 w-8 h-2 bg-amber-700 rounded-full transform transition-transform duration-300 ${expressionStyles.eyebrows}`}
              style={{ transform: `translateY(${eyebrowRaise}px) rotate(5deg)` }}
            ></div>

            {/* Eyes */}
            <div className="absolute top-16 left-10">
              <div className={getEyeStyle()}>
                {blinkState === 'open' && (
                  <>
                    <div className="absolute top-1 left-1 w-6 h-6 bg-gradient-to-br from-green-300 to-green-600 rounded-full"></div>
                    <div className="absolute top-2 left-2 w-4 h-4 bg-gray-800 rounded-full"></div>
                    <div className="absolute top-2.5 left-3 w-2 h-2 bg-white rounded-full"></div>
                  </>
                )}
              </div>
            </div>
            
            <div className="absolute top-16 right-10">
              <div className={getEyeStyle()}>
                {blinkState === 'open' && (
                  <>
                    <div className="absolute top-1 left-1 w-6 h-6 bg-gradient-to-bl from-green-300 to-green-600 rounded-full"></div>
                    <div className="absolute top-2 left-2 w-4 h-4 bg-gray-800 rounded-full"></div>
                    <div className="absolute top-2.5 left-2.5 w-2 h-2 bg-white rounded-full"></div>
                  </>
                )}
              </div>
            </div>

            {/* Nose */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-peach-300 rounded-full shadow-sm"></div>
            <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-peach-400 rounded-full"></div>
            <div className="absolute top-28 left-1/2 transform -translate-x-1/2 translate-x-1 w-1 h-1 bg-peach-400 rounded-full"></div>

            {/* Cheeks */}
            <div className={`absolute top-20 left-6 w-8 h-8 ${expressionStyles.cheeks} rounded-full transition-all duration-300`}></div>
            <div className={`absolute top-20 right-6 w-8 h-8 ${expressionStyles.cheeks} rounded-full transition-all duration-300`}></div>

            {/* Mouth */}
            <div className="absolute top-36 left-1/2 transform -translate-x-1/2">
              <div className={`${getMouthStyle()} ${expressionStyles.mouthCorners}`}>
                {mouthState !== 'closed' && (
                  <div className="absolute inset-1 bg-red-300 rounded-full"></div>
                )}
                {mouthState === 'smile' && (
                  <div className="absolute -top-1 left-0 w-full h-2 bg-white rounded-full opacity-80"></div>
                )}
              </div>
            </div>

            {/* Speaking indicator */}
            {isSpeaking && (
              <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
