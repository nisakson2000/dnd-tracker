import { useState, useRef, useCallback, useEffect } from 'react';

export function useLevelUp() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState({ name: '', level: 1, className: '' });
  const audioRef = useRef(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const triggerLevelUp = useCallback((name, newLevel, className) => {
    setLevelUpInfo({ name, level: newLevel, className });
    setShowOverlay(true);

    // Play audio as a nice-to-have — overlay stays until user clicks to dismiss
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio('/audio/levelup.flac');
      audioRef.current = audio;
      audio.play().catch(() => { /* audio unsupported — overlay still shows */ });
    } catch {
      // audio failed — overlay still shows
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
