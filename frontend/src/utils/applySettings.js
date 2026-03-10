const THEMES = {
  "dungeon-dark": {
    "--bg-deep": "#0d0d12",
    "--bg-panel": "rgba(20,18,28,0.9)",
    "--accent-gold": "#c9a84c",
    "--accent-crimson": "#8b2232",
    "--accent-purple": "#4a3d7a",
    "--text-parchment": "#d4c5a0",
  },
  "aged-parchment": {
    "--bg-deep": "#1a1408",
    "--bg-panel": "rgba(42,32,16,0.95)",
    "--accent-gold": "#d4a843",
    "--accent-crimson": "#7a1c28",
    "--accent-purple": "#5c3d6e",
    "--text-parchment": "#e8d5a3",
  },
  "frost-mage": {
    "--bg-deep": "#060d14",
    "--bg-panel": "rgba(10,20,35,0.95)",
    "--accent-gold": "#7ab8d4",
    "--accent-crimson": "#1a4a6b",
    "--accent-purple": "#2a5580",
    "--text-parchment": "#b8d4e8",
  },
  "forest-druid": {
    "--bg-deep": "#080f08",
    "--bg-panel": "rgba(12,22,12,0.95)",
    "--accent-gold": "#7ab84c",
    "--accent-crimson": "#2d5a1a",
    "--accent-purple": "#3d6b2a",
    "--text-parchment": "#c8e0a8",
  },
  "infernal": {
    "--bg-deep": "#0a0505",
    "--bg-panel": "rgba(22,10,10,0.95)",
    "--accent-gold": "#d44a2a",
    "--accent-crimson": "#8b1a0a",
    "--accent-purple": "#5a1a1a",
    "--text-parchment": "#e8c0a8",
  },
};

export { THEMES };

export function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem('codex-settings') || '{}');
  } catch { return {}; }
}

export function saveSettings(settings) {
  localStorage.setItem('codex-settings', JSON.stringify(settings));
}

export function applySettings(settings) {
  const root = document.documentElement;
  const theme = THEMES[settings.theme || 'dungeon-dark'];
  if (theme) Object.entries(theme).forEach(([k, v]) => root.style.setProperty(k, v));
  if (settings.uiScale) root.style.fontSize = `${(settings.uiScale / 100) * 16}px`;
  if (settings.fontSize) root.style.setProperty('--font-size-body', `${settings.fontSize}px`);
}
