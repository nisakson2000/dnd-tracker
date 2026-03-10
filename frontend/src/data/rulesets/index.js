// Ruleset Registry
// Central registry for all D&D edition rulesets.
// Each ruleset module exports a standard shape with all rules data.

import ruleset5e2014 from './5e-2014';
import ruleset5e2024 from './5e-2024';

const RULESETS = {
  '5e-2014': ruleset5e2014,
  '5e-2024': ruleset5e2024,
};

export const RULESET_OPTIONS = [
  { id: '5e-2014', name: 'D&D 5e (2014 PHB)' },
  { id: '5e-2024', name: 'D&D 5e (2024 PHB)' },
];

export function getRuleset(id) {
  return RULESETS[id] || RULESETS['5e-2014'];
}

export default RULESETS;
