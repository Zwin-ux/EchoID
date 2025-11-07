"use client"

import { useCallback, useRef, useEffect } from 'react';

type SoundType = 'click' | 'success' | 'error' | 'levelUp' | 'coin' | 'achievement';

interface SoundConfig {
  frequency: number;
  duration: number;
  volume: number;
  type: OscillatorType;
}

const soundConfigs: Record<SoundType, SoundConfig> = {
  click: {
    frequency: 800,
    duration: 50,
    volume: 0.1,
    type: 'sine',
  },
  success: {
    frequency: 1200,
    duration: 150,
    volume: 0.15,
    type: 'sine',
  },
  error: {
    frequency: 300,
    duration: 200,
    volume: 0.15,
    type: 'sawtooth',
  },
  levelUp: {
    frequency: 1500,
    duration: 400,
    volume: 0.2,
    type: 'triangle',
  },
  coin: {
    frequency: 1000,
    duration: 100,
    volume: 0.12,
    type: 'square',
  },
  achievement: {
    frequency: 1400,
    duration: 300,
    volume: 0.18,
    type: 'sine',
  },
};

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  useEffect(() => {
    // Only create AudioContext on client-side
    if (typeof window !== 'undefined') {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!enabledRef.current || !audioContextRef.current) return;

    const config = soundConfigs[type];
    const ctx = audioContextRef.current;

    try {
      // Create oscillator
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = config.type;
      oscillator.frequency.value = config.frequency;

      // Create envelope for smooth sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(config.volume, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration / 1000);

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Play
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + config.duration / 1000);
    } catch (e) {
      console.warn('Failed to play sound:', e);
    }
  }, []);

  const playSequence = useCallback((types: SoundType[], interval: number = 100) => {
    types.forEach((type, index) => {
      setTimeout(() => playSound(type), index * interval);
    });
  }, [playSound]);

  const toggleSounds = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    return enabledRef.current;
  }, []);

  const isSoundsEnabled = useCallback(() => enabledRef.current, []);

  return {
    playSound,
    playSequence,
    toggleSounds,
    isSoundsEnabled,
  };
}
