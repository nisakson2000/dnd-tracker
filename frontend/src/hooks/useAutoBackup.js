import { useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Automatically backs up the character to a single JSON file every 5 minutes.
 * Overwrites the same file each time so it doesn't accumulate.
 */
export function useAutoBackup(characterId, characterName) {
  const idRef = useRef(characterId);
  const nameRef = useRef(characterName);

  useEffect(() => { idRef.current = characterId; }, [characterId]);
  useEffect(() => { nameRef.current = characterName; }, [characterName]);

  useEffect(() => {
    if (!characterId) return;

    const doBackup = async () => {
      try {
        await invoke('autosave_character', {
          characterId: idRef.current,
          characterName: nameRef.current || 'character',
        });
      } catch {
        // Silent fail — autosave shouldn't interrupt the user
      }
    };

    // Run first backup shortly after load, then every 5 minutes
    const initialTimeout = setTimeout(doBackup, 10_000);
    const interval = setInterval(doBackup, INTERVAL_MS);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [characterId]);
}
