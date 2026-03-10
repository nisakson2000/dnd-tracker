import { useState, useRef, useCallback } from 'react';

export function useLevelUp() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState({ name: '', level: 1, className: '' });
  const audioRef = useRef(null);

  const triggerLevelUp = useCallback((name, newLevel, className) => {
    setLevelUpInfo({ name, level: newLevel, className });
    setShowOverlay(true);

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio('/audio/levelup.flac');
      audioRef.current = audio;
      audio.play().catch(() => {});
      audio.onended = () => setShowOverlay(false);
    } catch {
      setTimeout(() => setShowOverlay(false), 5000);
    }
  }, []);

  const dismiss = useCallback(() => {
    setShowOverlay(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { showOverlay, levelUpInfo, triggerLevelUp, dismiss };
}
