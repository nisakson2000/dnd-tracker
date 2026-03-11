import { useState, useRef, useCallback, useEffect } from 'react';

export function useLevelUp() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState({ name: '', level: 1, className: '' });
  const audioRef = useRef(null);
  const fallbackTimerRef = useRef(null);

  // Cleanup audio and timers on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current = null;
      }
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
    };
  }, []);

  const triggerLevelUp = useCallback((name, newLevel, className) => {
    setLevelUpInfo({ name, level: newLevel, className });
    setShowOverlay(true);

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio('/audio/levelup.flac');
      audioRef.current = audio;
      audio.play().catch(() => {});
      audio.onended = () => setShowOverlay(false);
    } catch {
      fallbackTimerRef.current = setTimeout(() => setShowOverlay(false), 5000);
    }
  }, []);

  const dismiss = useCallback(() => {
    setShowOverlay(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.currentTime = 0;
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }
  }, []);

  return { showOverlay, levelUpInfo, triggerLevelUp, dismiss };
}
