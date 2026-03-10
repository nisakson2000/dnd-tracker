import { createContext, useContext, useMemo } from 'react';
import { getRuleset } from '../data/rulesets';

const RulesetContext = createContext(null);

export function RulesetProvider({ rulesetId, children }) {
  const ruleset = useMemo(() => getRuleset(rulesetId), [rulesetId]);

  return (
    <RulesetContext.Provider value={ruleset}>
      {children}
    </RulesetContext.Provider>
  );
}

export function useRuleset() {
  const ctx = useContext(RulesetContext);
  if (!ctx) {
    // Fallback for components used outside a provider (e.g., Dashboard)
    return getRuleset('5e-2014');
  }
  return ctx;
}
