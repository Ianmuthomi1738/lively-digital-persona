
import { useState, useEffect, useCallback } from 'react';

type BlinkState = 'open' | 'closing' | 'closed' | 'opening';
type MouthState = 'closed' | 'small' | 'open' | 'wide' | 'rounded' | 'smile';
type Expression = 'neutral' | 'happy' | 'sad' | 'thinking' | 'surprised';

export const useAnimations = (initialExpression: Expression = 'neutral') => {
  const [blinkState, setBlinkState] = useState<BlinkState>('open');
  const [mouthState, setMouthState] = useState<MouthState>('closed');
  const [headTilt, setHeadTilt] = useState(0);
  const [eyebrowRaise, setEyebrowRaise] = useState(0);
  const [currentExpression, setCurrentExpression] = useState<Expression>(initialExpression);

  // Blinking animation
  useEffect(() => {
    const blink = () => {
      setBlinkState('closing');
      setTimeout(() => setBlinkState('closed'), 50);
      setTimeout(() => setBlinkState('opening'), 100);
      setTimeout(() => setBlinkState('open'), 150);
    };

    const scheduleNextBlink = () => {
      const delay = Math.random() * 4000 + 3000; // 3-7 seconds
      setTimeout(() => {
        blink();
        scheduleNextBlink();
      }, delay);
    };

    scheduleNextBlink();
  }, []);

  // Head movement animation
  useEffect(() => {
    const moveHead = () => {
      const newTilt = (Math.random() - 0.5) * 6; // -3 to +3 degrees
      setHeadTilt(newTilt);
    };

    const interval = setInterval(moveHead, 8000);
    return () => clearInterval(interval);
  }, []);

  // Eyebrow animation
  useEffect(() => {
    const moveEyebrows = () => {
      const raise = Math.random() > 0.7 ? Math.random() * 3 : 0;
      setEyebrowRaise(raise);
      setTimeout(() => setEyebrowRaise(0), 1000);
    };

    const interval = setInterval(moveEyebrows, 12000);
    return () => clearInterval(interval);
  }, []);

  // Expression-based animations
  useEffect(() => {
    switch (currentExpression) {
      case 'happy':
        setMouthState('smile');
        setEyebrowRaise(0);
        break;
      case 'sad':
        setMouthState('closed');
        setEyebrowRaise(2);
        break;
      case 'thinking':
        setMouthState('small');
        setEyebrowRaise(1);
        break;
      case 'surprised':
        setMouthState('open');
        setEyebrowRaise(-2);
        break;
      default:
        setMouthState('closed');
        setEyebrowRaise(0);
    }
  }, [currentExpression]);

  const setExpression = useCallback((expression: Expression) => {
    setCurrentExpression(expression);
  }, []);

  return {
    blinkState,
    mouthState,
    headTilt,
    eyebrowRaise,
    currentExpression,
    setExpression,
    setMouthState
  };
};
