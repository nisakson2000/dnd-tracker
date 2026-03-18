import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import TUTORIAL_STEPS from '../data/tutorialSteps';

const TutorialContext = createContext(null);

const LS_PROGRESS_KEY = 'codex-tutorial-progress';
const LS_ACTIVE_KEY = 'codex-tutorial-active';
const LS_COMPLETED_KEY = 'codex-tutorial-completed';

function loadProgress() {
  try {
    const step = parseInt(localStorage.getItem(LS_PROGRESS_KEY), 10);
    return isNaN(step) ? 0 : step;
  } catch { return 0; }
}

function loadActive() {
  try {
    return localStorage.getItem(LS_ACTIVE_KEY) === 'true';
  } catch { return false; }
}

export function TutorialProvider({ children }) {
  const [tutorialActive, setTutorialActiveRaw] = useState(loadActive);
  const [currentStepIndex, setCurrentStepIndex] = useState(loadProgress);
  const [completionFlags, setCompletionFlags] = useState({});

  const currentStep = TUTORIAL_STEPS[currentStepIndex] || TUTORIAL_STEPS[0];
  const tutorialPhase = currentStep?.phase || 'lobby';
  const totalSteps = TUTORIAL_STEPS.length;

  // Persist active state
  useEffect(() => {
    try { localStorage.setItem(LS_ACTIVE_KEY, tutorialActive ? 'true' : 'false'); } catch { /* noop */ }
  }, [tutorialActive]);

  // Persist step progress
  useEffect(() => {
    try { localStorage.setItem(LS_PROGRESS_KEY, String(currentStepIndex)); } catch { /* noop */ }
  }, [currentStepIndex]);

  const setTutorialActive = useCallback((active) => {
    setTutorialActiveRaw(active);
    if (active) {
      // When starting, set guidance mode to guided
      try {
        localStorage.setItem('codex-dm-guidance-mode', 'guided');
        window.dispatchEvent(new CustomEvent('codex-guidance-mode-changed', { detail: 'guided' }));
      } catch { /* noop */ }
    }
  }, []);

  const startTutorial = useCallback(() => {
    setCurrentStepIndex(0);
    setCompletionFlags({});
    setTutorialActive(true);
  }, [setTutorialActive]);

  const advanceStep = useCallback(() => {
    setCurrentStepIndex(prev => {
      const next = prev + 1;
      if (next >= totalSteps) return prev; // don't go past last
      return next;
    });
  }, [totalSteps]);

  const goBackStep = useCallback(() => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  }, []);

  const skipTutorial = useCallback(() => {
    setTutorialActiveRaw(false);
    setCurrentStepIndex(0);
    setCompletionFlags({});
    try {
      localStorage.setItem(LS_ACTIVE_KEY, 'false');
      localStorage.setItem(LS_PROGRESS_KEY, '0');
    } catch { /* noop */ }
  }, []);

  const completeTutorial = useCallback(() => {
    setTutorialActiveRaw(false);
    setCurrentStepIndex(0);
    setCompletionFlags({});
    try {
      localStorage.setItem(LS_ACTIVE_KEY, 'false');
      localStorage.setItem(LS_COMPLETED_KEY, 'true');
      localStorage.setItem(LS_PROGRESS_KEY, '0');
    } catch { /* noop */ }
  }, []);

  const markCompleted = useCallback((flagName) => {
    setCompletionFlags(prev => {
      if (prev[flagName]) return prev; // already set
      return { ...prev, [flagName]: true };
    });
  }, []);

  const isStepCompleted = useCallback((checkName) => {
    if (!checkName) return true; // no check needed
    return !!completionFlags[checkName];
  }, [completionFlags]);

  const isTutorialCompleted = useCallback(() => {
    try { return localStorage.getItem(LS_COMPLETED_KEY) === 'true'; } catch { return false; }
  }, []);

  const value = useMemo(() => ({
    tutorialActive,
    currentStep,
    currentStepIndex,
    tutorialPhase,
    totalSteps,
    completionFlags,
    startTutorial,
    advanceStep,
    goBackStep,
    skipTutorial,
    completeTutorial,
    setTutorialActive,
    markCompleted,
    isStepCompleted,
    isTutorialCompleted,
  }), [
    tutorialActive, currentStep, currentStepIndex, tutorialPhase, totalSteps,
    completionFlags, startTutorial, advanceStep, goBackStep, skipTutorial,
    completeTutorial, setTutorialActive, markCompleted, isStepCompleted, isTutorialCompleted,
  ]);

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  return useContext(TutorialContext);
}

export function isTutorialFakePlayer(playerId) {
  return playerId && typeof playerId === 'string' && playerId.startsWith('tutorial-fake-');
}
