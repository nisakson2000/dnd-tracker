import { createContext, useContext, useState, useCallback } from 'react';

const ModeContext = createContext(null);

const STORAGE_KEY = 'codex-app-mode'; // 'player' | 'dm'

export function ModeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // 'dev' mode was removed — clear it so user picks player/dm
    if (stored === 'dev') {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return stored || null;
  });

  const setMode = useCallback((m) => {
    localStorage.setItem(STORAGE_KEY, m);
    setModeState(m);
  }, []);

  const clearMode = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setModeState(null);
  }, []);

  return (
    <ModeContext.Provider value={{ mode, setMode, clearMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useAppMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useAppMode must be inside ModeProvider');
  return ctx;
}
