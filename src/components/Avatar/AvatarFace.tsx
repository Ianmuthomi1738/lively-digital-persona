
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
    const baseStyle = "absolute w-14 h-10 bg-white rounded-full shadow-inner";
    switch (blinkState) {
      case 'closed':
        return `${baseStyle} h-1`;
      case 'closing':
        return `${baseStyle} h-5`;
      case 'opening':
        return `${baseStyle} h-7`;
      default:
        return baseStyle;
    }
  };

  const getMouthStyle = () => {
    const baseStyle = "absolute transition-all duration-100";
    switch (mouthState) {
      case 'closed':
        return `${baseStyle} w-10 h-1 bg-rose-400 rounded-full`;
      case 'small':
        return `${baseStyle} w-8 h-6 bg-gradient-to-b from-rose-300 to-rose-500 rounded-full`;
      case 'open':
        return `${baseStyle} w-10 h-8 bg-gradient-to-b from-rose-300 to-rose-600 rounded-full`;
      case 'wide':
        return `${baseStyle} w-14 h-10 bg-gradient-to-b from-rose-300 to-rose-600 rounded-full`;
      case 'rounded':
        return `${baseStyle} w-9 h-10 bg-gradient-to-b from-rose-300 to-rose-500 rounded-full`;
      case 'smile':
        return `${baseStyle} w-12 h-4 bg-rose-400 rounded-full`;
      default:
        return `${baseStyle} w-10 h-2 bg-rose-400 rounded-full`;
    }
  };

  const getExpressionStyles = () => {
    switch (expression) {
      case 'happy':
        return {
          eyebrows: 'translate-y-0',
          cheeks: 'bg-rose-200 opacity-70',
        };
      case 'sad':
        return {
          eyebrows: 'translate-y-1',
          cheeks: 'bg-blue-100 opacity-50',
        };
      case 'thinking':
        return {
          eyebrows: 'translate-y-0',
          cheeks: 'bg-purple-100 opacity-40',
        };
      case 'surprised':
        return {
          eyebrows: '-translate-y-2',
          cheeks: 'bg-rose-100 opacity-60',
        };
      default:
        return {
          eyebrows: 'translate-y-0',
          cheeks: 'bg-rose-100 opacity-50',
        };
    }
  };

  const expressionStyles = getExpressionStyles();

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Main face container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-72 h-80 bg-gradient-to-b from-rose-50 via-orange-50 to-orange-100 rounded-full shadow-2xl border border-rose-100/30">
          
          {/* Hair - blonde wavy styling */}
          <div className="absolute -top-8 -left-12 -right-12 h-40 overflow-hidden">
            {/* Main hair mass */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400 rounded-t-full transform scale-110">
              {/* Hair highlights and shadows */}
              <div className="absolute top-4 left-8 w-16 h-28 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full opacity-80 transform -rotate-15"></div>
              <div className="absolute top-4 right-8 w-16 h-28 bg-gradient-to-bl from-yellow-100 to-yellow-300 rounded-full opacity-80 transform rotate-15"></div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-24 h-32 bg-gradient-to-b from-yellow-100 to-yellow-400 rounded-full opacity-90"></div>
              
              {/* Hair strands for texture */}
              <div className="absolute top-8 left-16 w-3 h-20 bg-yellow-500 rounded-full opacity-60 transform rotate-20"></div>
              <div className="absolute top-8 right-16 w-3 h-20 bg-yellow-500 rounded-full opacity-60 transform -rotate-20"></div>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-2 h-24 bg-yellow-500 rounded-full opacity-70"></div>
              
              {/* Wavy hair effect */}
              <div className="absolute top-12 left-12 w-20 h-16 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-full opacity-70 transform rotate-12"></div>
              <div className="absolute top-12 right-12 w-20 h-16 bg-gradient-to-l from-yellow-200 to-yellow-400 rounded-full opacity-70 transform -rotate-12"></div>
            </div>
          </div>

          {/* Face shape and skin */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-64 h-72 bg-gradient-to-b from-orange-50 via-rose-100 to-rose-200 rounded-full shadow-inner">
            
            {/* Forehead highlight */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-gradient-to-b from-white/40 to-transparent rounded-full"></div>
            
            {/* Eyebrows - refined and realistic */}
            <div 
              className={`absolute top-20 left-20 w-14 h-2 bg-gradient-to-r from-yellow-700 to-yellow-600 rounded-full transform transition-transform duration-300 ${expressionStyles.eyebrows}`}
              style={{ 
                transform: `translateY(${eyebrowRaise}px) rotate(-5deg)`,
                clipPath: 'polygon(0% 50%, 100% 50%, 90% 0%, 10% 0%)'
              }}
            ></div>
            <div 
              className={`absolute top-20 right-20 w-14 h-2 bg-gradient-to-l from-yellow-700 to-yellow-600 rounded-full transform transition-transform duration-300 ${expressionStyles.eyebrows}`}
              style={{ 
                transform: `translateY(${eyebrowRaise}px) rotate(5deg)`,
                clipPath: 'polygon(0% 50%, 100% 50%, 90% 0%, 10% 0%)'
              }}
            ></div>

            {/* Eyes - more realistic with detailed iris */}
            <div className="absolute top-24 left-16">
              <div className={getEyeStyle()}>
                {blinkState === 'open' && (
                  <>
                    {/* Eye socket depth */}
                    <div className="absolute -top-1 -left-1 w-16 h-12 bg-rose-200/30 rounded-full"></div>
                    {/* Iris - green hazel like reference */}
                    <div className="absolute top-2 left-3 w-8 h-6 bg-gradient-radial from-yellow-600 via-green-600 to-green-800 rounded-full shadow-inner">
                      {/* Pupil */}
                      <div className="absolute top-1 left-2 w-4 h-4 bg-black rounded-full">
                        {/* Light reflections */}
                        <div className="absolute top-0.5 left-1.5 w-1.5 h-1.5 bg-white rounded-full opacity-95"></div>
                        <div className="absolute bottom-1 right-0.5 w-1 h-1 bg-white rounded-full opacity-60"></div>
                      </div>
                      {/* Iris details */}
                      <div className="absolute top-0.5 left-1 w-6 h-1 bg-yellow-500/40 rounded-full"></div>
                      <div className="absolute bottom-0.5 left-2 w-4 h-1 bg-green-900/30 rounded-full"></div>
                    </div>
                    {/* Eyelashes */}
                    <div className="absolute top-0 left-2 w-10 h-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent rounded-full opacity-80"></div>
                    <div className="absolute bottom-0 left-3 w-8 h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent rounded-full opacity-60"></div>
                  </>
                )}
              </div>
            </div>
            
            <div className="absolute top-24 right-16">
              <div className={getEyeStyle()}>
                {blinkState === 'open' && (
                  <>
                    {/* Eye socket depth */}
                    <div className="absolute -top-1 -left-1 w-16 h-12 bg-rose-200/30 rounded-full"></div>
                    {/* Iris - green hazel like reference */}
                    <div className="absolute top-2 left-3 w-8 h-6 bg-gradient-radial from-yellow-600 via-green-600 to-green-800 rounded-full shadow-inner">
                      {/* Pupil */}
                      <div className="absolute top-1 left-2 w-4 h-4 bg-black rounded-full">
                        {/* Light reflections */}
                        <div className="absolute top-0.5 left-1.5 w-1.5 h-1.5 bg-white rounded-full opacity-95"></div>
                        <div className="absolute bottom-1 right-0.5 w-1 h-1 bg-white rounded-full opacity-60"></div>
                      </div>
                      {/* Iris details */}
                      <div className="absolute top-0.5 left-1 w-6 h-1 bg-yellow-500/40 rounded-full"></div>
                      <div className="absolute bottom-0.5 left-2 w-4 h-1 bg-green-900/30 rounded-full"></div>
                    </div>
                    {/* Eyelashes */}
                    <div className="absolute top-0 left-2 w-10 h-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent rounded-full opacity-80"></div>
                    <div className="absolute bottom-0 left-3 w-8 h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent rounded-full opacity-60"></div>
                  </>
                )}
              </div>
            </div>

            {/* Nose - refined and proportional */}
            <div className="absolute top-36 left-1/2 transform -translate-x-1/2">
              {/* Nose bridge */}
              <div className="w-3 h-10 bg-gradient-to-b from-rose-100 to-rose-300 rounded-full shadow-sm"></div>
              {/* Nose tip */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-3 bg-gradient-to-b from-rose-200 to-rose-300 rounded-full"></div>
              {/* Subtle nostrils */}
              <div className="absolute bottom-0 left-0.5 w-1 h-1.5 bg-rose-400/60 rounded-full"></div>
              <div className="absolute bottom-0 right-0.5 w-1 h-1.5 bg-rose-400/60 rounded-full"></div>
              {/* Nose highlight */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-white/30 rounded-full"></div>
            </div>

            {/* Cheeks with natural blush */}
            <div className={`absolute top-32 left-12 w-14 h-12 ${expressionStyles.cheeks} rounded-full transition-all duration-300 blur-sm`}></div>
            <div className={`absolute top-32 right-12 w-14 h-12 ${expressionStyles.cheeks} rounded-full transition-all duration-300 blur-sm`}></div>

            {/* Lips - more natural and detailed */}
            <div className="absolute top-48 left-1/2 transform -translate-x-1/2">
              {/* Upper lip shape */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-rose-400 rounded-full opacity-85">
                {/* Cupid's bow */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-rose-500"></div>
              </div>
              {/* Main mouth */}
              <div className={`${getMouthStyle()} shadow-lg`}>
                {mouthState !== 'closed' && (
                  <>
                    {/* Inner mouth depth */}
                    <div className="absolute inset-1 bg-gradient-to-b from-rose-500 to-red-700 rounded-full shadow-inner"></div>
                    {/* Teeth for wider mouth states */}
                    {(mouthState === 'open' || mouthState === 'wide') && (
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-white rounded-sm opacity-95 shadow-sm"></div>
                    )}
                  </>
                )}
                {mouthState === 'smile' && (
                  <div className="absolute -top-0.5 left-0 w-full h-2 bg-white/80 rounded-full"></div>
                )}
              </div>
              {/* Lower lip */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-rose-500 rounded-full opacity-80"></div>
              {/* Lip highlight */}
              <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white/40 rounded-full"></div>
            </div>

            {/* Facial contours and definition */}
            <div className="absolute top-12 left-6 w-6 h-40 bg-gradient-to-r from-rose-300/40 to-transparent rounded-full"></div>
            <div className="absolute top-12 right-6 w-6 h-40 bg-gradient-to-l from-rose-300/40 to-transparent rounded-full"></div>
            
            {/* Chin definition */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-gradient-to-b from-transparent to-rose-300/30 rounded-full"></div>

            {/* Speaking indicator */}
            {isSpeaking && (
              <div className="absolute top-44 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-blue-300 rounded-full animate-ping opacity-40"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
