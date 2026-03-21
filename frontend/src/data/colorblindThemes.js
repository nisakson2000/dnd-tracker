/**
 * Accessibility — Colorblind Modes & High Contrast Themes
 *
 * Covers roadmap items 491-494 (Colorblind modes, High contrast, Dyslexia font, Reduced motion).
 * CSS filter definitions and theme overrides for accessibility needs.
 */

// ── Colorblind Modes ──
export const COLORBLIND_MODES = {
  none: {
    label: 'Normal Vision',
    description: 'No color adjustment applied.',
    filter: 'none',
    prevalence: 'N/A',
  },
  protanopia: {
    label: 'Protanopia',
    description: 'Red-blind. Difficulty distinguishing red from green. Reds appear darker.',
    filter: 'url(#protanopia-filter)',
    prevalence: '~1% of males',
    svgFilter: `
      <filter id="protanopia-filter">
        <feColorMatrix type="matrix" values="
          0.567, 0.433, 0,     0, 0
          0.558, 0.442, 0,     0, 0
          0,     0.242, 0.758, 0, 0
          0,     0,     0,     1, 0
        "/>
      </filter>`,
    alternateColors: { red: '#c4a000', green: '#3465a4', danger: '#cc6600', success: '#0066cc' },
  },
  deuteranopia: {
    label: 'Deuteranopia',
    description: 'Green-blind. Most common form. Red and green appear similar.',
    filter: 'url(#deuteranopia-filter)',
    prevalence: '~6% of males',
    svgFilter: `
      <filter id="deuteranopia-filter">
        <feColorMatrix type="matrix" values="
          0.625, 0.375, 0,   0, 0
          0.7,   0.3,   0,   0, 0
          0,     0.3,   0.7, 0, 0
          0,     0,     0,   1, 0
        "/>
      </filter>`,
    alternateColors: { red: '#d4a017', green: '#2266cc', danger: '#cc6600', success: '#0066cc' },
  },
  tritanopia: {
    label: 'Tritanopia',
    description: 'Blue-blind. Difficulty distinguishing blue from green, yellow from violet.',
    filter: 'url(#tritanopia-filter)',
    prevalence: '~0.01% of population',
    svgFilter: `
      <filter id="tritanopia-filter">
        <feColorMatrix type="matrix" values="
          0.95, 0.05,  0,     0, 0
          0,    0.433,  0.567, 0, 0
          0,    0.475,  0.525, 0, 0
          0,    0,      0,     1, 0
        "/>
      </filter>`,
    alternateColors: { blue: '#cc3333', yellow: '#33cc33', danger: '#cc0000', success: '#009900' },
  },
  achromatopsia: {
    label: 'Achromatopsia',
    description: 'Complete color blindness. Sees only shades of grey.',
    filter: 'grayscale(100%)',
    prevalence: '~0.003% of population',
    alternateColors: { danger: '#000000', success: '#666666', warning: '#333333', info: '#999999' },
  },
};

// ── High Contrast Theme ──
export const HIGH_CONTRAST_THEME = {
  label: 'High Contrast',
  description: 'Maximum contrast for low vision users. Pure black background, bright text.',
  colors: {
    background: '#000000',
    surface: '#1a1a1a',
    surfaceHover: '#333333',
    text: '#ffffff',
    textSecondary: '#cccccc',
    border: '#ffffff',
    primary: '#00ff00',
    danger: '#ff0000',
    warning: '#ffff00',
    success: '#00ff00',
    info: '#00ffff',
    accent: '#ff00ff',
  },
  fontSizeMultiplier: 1.1,
  borderWidth: '2px',
  focusOutline: '3px solid #00ff00',
};

// ── Dyslexia-Friendly Settings ──
export const DYSLEXIA_SETTINGS = {
  label: 'Dyslexia-Friendly',
  description: 'Uses OpenDyslexic font with increased letter and line spacing.',
  fontFamily: "'OpenDyslexic', 'Comic Sans MS', sans-serif",
  fontUrl: 'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.woff2',
  letterSpacing: '0.05em',
  wordSpacing: '0.15em',
  lineHeight: 1.8,
  paragraphSpacing: '1.5em',
};

// ── Reduced Motion Settings ──
export const REDUCED_MOTION = {
  label: 'Reduced Motion',
  description: 'Disables or reduces animations for motion-sensitive users.',
  cssOverrides: {
    'transition-duration': '0.01ms !important',
    'animation-duration': '0.01ms !important',
    'animation-iteration-count': '1 !important',
    'scroll-behavior': 'auto !important',
  },
  disableFeatures: [
    'Dice rolling animations',
    'Combat transition effects',
    'Parallax scrolling',
    'Auto-scrolling',
    'Particle effects',
    'Toast slide-in animations',
  ],
};

// ── ARIA Landmarks ──
export const ARIA_LANDMARKS = {
  mainContent: { role: 'main', label: 'Main Content' },
  navigation: { role: 'navigation', label: 'Primary Navigation' },
  sidebar: { role: 'complementary', label: 'Sidebar' },
  combatTracker: { role: 'region', label: 'Combat Initiative Tracker' },
  chatPanel: { role: 'log', label: 'Chat Messages' },
  diceRoller: { role: 'region', label: 'Dice Roller' },
  characterSheet: { role: 'region', label: 'Character Sheet' },
};

// ── Keyboard Navigation ──
export const KEYBOARD_SHORTCUTS = {
  global: [
    { key: 'Tab', description: 'Move focus to next interactive element' },
    { key: 'Shift+Tab', description: 'Move focus to previous interactive element' },
    { key: 'Escape', description: 'Close modal or cancel action' },
    { key: 'Enter/Space', description: 'Activate focused button or link' },
  ],
  combat: [
    { key: 'N', description: 'Next turn' },
    { key: 'D', description: 'Open damage dialog' },
    { key: 'H', description: 'Open heal dialog' },
    { key: 'C', description: 'Open condition panel' },
    { key: 'R', description: 'Roll dice' },
  ],
};

/**
 * Get colorblind mode config.
 */
export function getColorblindMode(mode) {
  return COLORBLIND_MODES[mode] || COLORBLIND_MODES.none;
}

/**
 * Get all colorblind mode options for settings UI.
 */
export function getColorblindOptions() {
  return Object.entries(COLORBLIND_MODES).map(([key, mode]) => ({
    id: key,
    label: mode.label,
    description: mode.description,
    prevalence: mode.prevalence,
  }));
}

/**
 * Get CSS overrides for reduced motion.
 */
export function getReducedMotionCSS() {
  return Object.entries(REDUCED_MOTION.cssOverrides)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join(';\n');
}

/**
 * Get alternate color for colorblind mode.
 */
export function getAccessibleColor(colorName, mode) {
  const modeConfig = COLORBLIND_MODES[mode];
  if (!modeConfig || !modeConfig.alternateColors) return null;
  return modeConfig.alternateColors[colorName] || null;
}
