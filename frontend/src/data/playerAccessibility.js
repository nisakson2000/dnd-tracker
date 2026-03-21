/**
 * playerAccessibility.js
 * Player Mode Improvements 156-170 (accessibility & notes subset): Accessibility helpers
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// COLOR BLIND MODES
// ---------------------------------------------------------------------------

export const COLOR_BLIND_PALETTES = {
  default: {
    label: 'Default',
    hp_high: '#4ade80',
    hp_mid: '#fbbf24',
    hp_low: '#f97316',
    hp_crit: '#ef4444',
    advantage: '#4ade80',
    disadvantage: '#ef4444',
    success: '#4ade80',
    failure: '#ef4444',
  },
  deuteranopia: {
    label: 'Deuteranopia (Red-Green)',
    hp_high: '#56b4e9',
    hp_mid: '#e69f00',
    hp_low: '#cc79a7',
    hp_crit: '#d55e00',
    advantage: '#56b4e9',
    disadvantage: '#d55e00',
    success: '#56b4e9',
    failure: '#d55e00',
  },
  protanopia: {
    label: 'Protanopia (Red-Green)',
    hp_high: '#56b4e9',
    hp_mid: '#e69f00',
    hp_low: '#cc79a7',
    hp_crit: '#d55e00',
    advantage: '#56b4e9',
    disadvantage: '#d55e00',
    success: '#56b4e9',
    failure: '#d55e00',
  },
  tritanopia: {
    label: 'Tritanopia (Blue-Yellow)',
    hp_high: '#009e73',
    hp_mid: '#f0e442',
    hp_low: '#cc79a7',
    hp_crit: '#d55e00',
    advantage: '#009e73',
    disadvantage: '#d55e00',
    success: '#009e73',
    failure: '#d55e00',
  },
};

// ---------------------------------------------------------------------------
// FONT SIZE PRESETS
// ---------------------------------------------------------------------------

export const FONT_SIZE_PRESETS = {
  compact: { label: 'Compact', scale: 0.85, description: 'Smaller text, more info on screen' },
  default: { label: 'Default', scale: 1.0, description: 'Standard text size' },
  large: { label: 'Large', scale: 1.15, description: 'Larger text for readability' },
  xl: { label: 'Extra Large', scale: 1.3, description: 'Maximum readability' },
};

// ---------------------------------------------------------------------------
// TOOLTIP DELAY PRESETS
// ---------------------------------------------------------------------------

export const TOOLTIP_DELAYS = {
  instant: { label: 'Instant', delayMs: 0 },
  fast: { label: 'Fast', delayMs: 200 },
  default: { label: 'Default', delayMs: 500 },
  slow: { label: 'Slow', delayMs: 1000 },
};

// ---------------------------------------------------------------------------
// SCREEN READER LABELS
// ---------------------------------------------------------------------------

export const ARIA_LABELS = {
  hp_bar: (current, max) => `Hit points: ${current} out of ${max}`,
  spell_slot: (level, remaining, max) => `Level ${level} spell slots: ${remaining} of ${max} remaining`,
  death_save_success: (count) => `Death save successes: ${count} of 3`,
  death_save_failure: (count) => `Death save failures: ${count} of 3`,
  action_used: (used) => `Action: ${used ? 'used' : 'available'}`,
  condition: (name) => `Active condition: ${name}`,
  initiative_position: (name, position, total) => `${name}: initiative position ${position} of ${total}`,
};

// ---------------------------------------------------------------------------
// ANIMATION PREFERENCES
// ---------------------------------------------------------------------------

export const ANIMATION_PREFERENCES = {
  full: { label: 'Full Animations', transitions: true, particles: true, flashes: true },
  reduced: { label: 'Reduced', transitions: true, particles: false, flashes: false },
  minimal: { label: 'Minimal', transitions: false, particles: false, flashes: false },
  none: { label: 'No Animations', transitions: false, particles: false, flashes: false },
};
