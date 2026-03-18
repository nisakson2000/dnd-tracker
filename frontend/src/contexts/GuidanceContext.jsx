import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useSession } from './SessionContext';
import { getTipsForStage } from '../data/guidanceTips';

const LS_TUTORIAL_ACTIVE_KEY = 'codex-tutorial-active';

const GuidanceContext = createContext(null);

const LS_MODE_KEY = 'codex-dm-guidance-mode';
const LS_DISMISSED_KEY = 'codex-dm-dismissed-tips';

function loadMode() {
  try {
    const stored = localStorage.getItem(LS_MODE_KEY);
    return stored === 'free' ? 'free' : 'guided';
  } catch { return 'guided'; }
}

function loadDismissed() {
  try {
    const stored = localStorage.getItem(LS_DISMISSED_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch { return new Set(); }
}

function persistDismissed(set) {
  try { localStorage.setItem(LS_DISMISSED_KEY, JSON.stringify([...set])); } catch { /* noop */ }
}

function deriveStage(sessionState, stageOverride) {
  if (stageOverride) return stageOverride;
  if (!sessionState?.campaignId) return 'creation';
  if (sessionState.sessionActive) return 'live-session';
  return 'campaign-prep';
}

function computeNextActions(stage, progress) {
  const actions = [];

  if (stage === 'campaign-prep') {
    if (progress.sceneCount === 0)
      actions.push({ id: 'add-scene', text: 'Create your first scene', section: 'campaign-hub', icon: 'map' });
    if (progress.npcCount === 0)
      actions.push({ id: 'add-npc', text: 'Add an NPC for players to interact with', section: 'npcs', icon: 'users' });
    if (progress.questCount === 0)
      actions.push({ id: 'add-quest', text: 'Write a quest to give players direction', section: 'quests', icon: 'scroll' });
    if (!progress.descriptionFilled)
      actions.push({ id: 'add-desc', text: 'Fill in your campaign description', section: 'campaign-hub', icon: 'pen' });
    if (progress.encountersPrepped === 0)
      actions.push({ id: 'add-encounter', text: 'Prep an encounter for combat', section: 'encounter-builder', icon: 'swords' });
  }

  if (stage === 'live-session') {
    actions.push({ id: 'check-quests', text: 'Check active quest progress', section: 'quests', icon: 'scroll' });
  }

  return actions.slice(0, 3);
}

export function GuidanceProvider({ children }) {
  const sessionState = useSession();
  const [guidanceMode, setGuidanceModeRaw] = useState(loadMode);
  const [dismissedTips, setDismissedTips] = useState(loadDismissed);
  const [stageOverride, setStageOverride] = useState(null);
  const [campaignProgress, setCampaignProgress] = useState({
    sceneCount: 0,
    npcCount: 0,
    questCount: 0,
    descriptionFilled: false,
    playersConnected: 0,
    encountersPrepped: 0,
  });

  const currentStage = useMemo(
    () => deriveStage(sessionState, stageOverride),
    [sessionState, stageOverride]
  );

  const nextActions = useMemo(
    () => computeNextActions(currentStage, campaignProgress),
    [currentStage, campaignProgress]
  );

  /* ── Persist & dispatch on mode change ── */

  const setGuidanceMode = useCallback((mode) => {
    setGuidanceModeRaw(mode);
    try { localStorage.setItem(LS_MODE_KEY, mode); } catch { /* noop */ }
    window.dispatchEvent(new CustomEvent('codex-guidance-mode-changed', { detail: mode }));
  }, []);

  /* ── Listen for external mode changes ── */

  useEffect(() => {
    function handleModeChange(e) {
      const mode = e.detail === 'free' ? 'free' : 'guided';
      setGuidanceModeRaw(mode);
      try { localStorage.setItem(LS_MODE_KEY, mode); } catch { /* noop */ }
    }
    window.addEventListener('codex-guidance-mode-changed', handleModeChange);
    return () => window.removeEventListener('codex-guidance-mode-changed', handleModeChange);
  }, []);

  /* ── Tutorial awareness: auto-set guided mode when tutorial active ── */

  const tutorialActive = useMemo(() => {
    try { return localStorage.getItem(LS_TUTORIAL_ACTIVE_KEY) === 'true'; } catch { return false; }
  }, [guidanceMode]); // re-check when mode changes

  useEffect(() => {
    if (tutorialActive && guidanceMode !== 'guided') {
      setGuidanceMode('guided');
    }
  }, [tutorialActive]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Dismiss a tip ── */

  const dismissTip = useCallback((tipId) => {
    setDismissedTips((prev) => {
      const next = new Set(prev);
      next.add(tipId);
      persistDismissed(next);
      return next;
    });
  }, []);

  /* ── Update campaign progress from external components ── */

  const updateCampaignProgress = useCallback((progress) => {
    setCampaignProgress((prev) => ({ ...prev, ...progress }));
  }, []);

  /* ── Get active tips for a given stage (or current stage) ── */

  const getActiveTips = useCallback((stage) => {
    return getTipsForStage(stage || currentStage, campaignProgress, dismissedTips);
  }, [currentStage, campaignProgress, dismissedTips]);

  /* ── Context value ── */

  const value = useMemo(() => ({
    guidanceMode,
    dismissedTips,
    currentStage,
    campaignProgress,
    nextActions,
    tutorialActive,
    setGuidanceMode,
    setStageOverride,
    dismissTip,
    updateCampaignProgress,
    getActiveTips,
  }), [
    guidanceMode,
    dismissedTips,
    currentStage,
    campaignProgress,
    nextActions,
    tutorialActive,
    setGuidanceMode,
    setStageOverride,
    dismissTip,
    updateCampaignProgress,
    getActiveTips,
  ]);

  return (
    <GuidanceContext.Provider value={value}>
      {children}
    </GuidanceContext.Provider>
  );
}

export function useGuidance() {
  return useContext(GuidanceContext);
}
