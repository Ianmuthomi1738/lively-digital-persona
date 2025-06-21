
import { useState, useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  velocity: { x: number; y: number };
}

interface UseParticlesProps {
  isActive: boolean;
  audioVolume: number;
  rhythm: number;
  intensity: number;
}

export const useParticles = ({ isActive, audioVolume, rhythm, intensity }: UseParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();
  const particleIdRef = useRef(0);

  useEffect(() => {
    // Initialize particles only once
    if (particles.length === 0) {
      const newParticles = Array.from({ length: 12 }, () => ({
        id: particleIdRef.current++,
        x: 50 + Math.random() * 40 - 20,
        y: 50 + Math.random() * 40 - 20,
        opacity: 0.2,
        scale: 0.5,
        velocity: { x: 0, y: 0 }
      }));
      setParticles(newParticles);
    }
  }, [particles.length]);

  useEffect(() => {
    if (!isActive || particles.length === 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      const time = Date.now() * 0.001;
      const audioBoost = audioVolume * 0.1;
      const rhythmPush = rhythm * 5;

      setParticles(prevParticles => 
        prevParticles.map((particle, i) => ({
          ...particle,
          x: 50 + Math.sin(time + i * 0.8) * (25 + audioBoost) + particle.velocity.x,
          y: 50 + Math.cos(time * 0.6 + i * 1.2) * (20 + audioBoost) + particle.velocity.y,
          opacity: (0.2 + Math.sin(time * 3 + i) * 0.3 + audioBoost * 0.02) * intensity,
          scale: (0.4 + Math.sin(time * 2 + i) * 0.4 + rhythmPush * 0.1) * intensity,
          velocity: {
            x: particle.velocity.x + (Math.random() - 0.5) * 0.5,
            y: particle.velocity.y + (Math.random() - 0.5) * 0.5
          }
        }))
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, audioVolume, rhythm, intensity, particles.length]);

  return particles;
};
