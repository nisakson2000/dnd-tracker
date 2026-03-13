import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ModeContext = createContext(null);

const STORAGE_KEY = 'codex-app-mode'; // 'player' | 'dm'

export function ModeProvider({ children }) {
  // Always show mode selection on launch — never auto-persist
  const [mode, setModeState] = useState(null);

  // navigateTo is set by the NavigationBridge inside BrowserRouter
  const [navigateFn, setNavigateFn] = useState(null);

  const registerNavigate = useCallback((fn) => {
    setNavigateFn(() => fn);
  }, []);

  const setMode = useCallback((m) => {
    setModeState(m);

    // When DM mode is selected, navigate to /dm/campaigns
    // When Player mode is selected, navigate to /
    // navigateFn may not be available yet on first render (before BrowserRouter mounts)
    if (navigateFn) {
      // Both modes start at Dashboard — DM accesses campaigns from sidebar
      navigateFn('/');
    }
  }, [navigateFn]);

  const clearMode = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    if (navigateFn) navigateFn('/', { replace: true });
    setModeState(null);
  }, [navigateFn]);

  const value = useMemo(
    () => ({ mode, setMode, clearMode, registerNavigate }),
    [mode, setMode, clearMode, registerNavigate],
  );

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
