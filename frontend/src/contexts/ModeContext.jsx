import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ModeContext = createContext(null);

const STORAGE_KEY = 'codex-app-mode'; // 'player' | 'dm'

export function ModeProvider({ children }) {
  // Always start with no mode — user picks player/dm on every app open
  const [mode, setModeState] = useState(null);

  const setMode = useCallback((m) => {
    localStorage.setItem(STORAGE_KEY, m);
    setModeState(m);
  }, []);

  const clearMode = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setModeState(null);
  }, []);

  const value = useMemo(() => ({ mode, setMode, clearMode }), [mode, setMode, clearMode]);

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
}

export function useAppMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useAppMode must be inside ModeProvider');
  return ctx;
}
