// In-app changelog — last 3 versions shown in the Updates panel.
// Bump this when releasing a new version.
export const CHANGELOG = [
  {
    version: 'V0.1.8',
    date: '2026-03-10',
    title: 'Character Creation & Auto-Backup',
    changes: [
      'Expanded character creation — choose race, class, and optional subclass during setup',
      'Identity fields (name, race, class, subclass) locked after creation',
      'Race traits and class features displayed on character sheet by level',
      'Auto-backup every 5 minutes to a single overwriting JSON file',
      'Fixed drag-and-drop portrait upload in Tauri',
      'Expanded 5e 2014 ruleset — 30+ races, all 12 classes with full feature lists',
      'Party UI rework with color-coded member cards',
    ],
  },
  {
    version: 'V0.1.5',
    date: '2026-02-20',
    title: 'Tauri Migration',
    changes: [
      'Migrated from Python/FastAPI to native Tauri 2 desktop app (Rust backend)',
      'Frontend communicates via Tauri IPC instead of REST API',
      'Single-command launch with npm run tauri dev',
      'Data stored in OS app data directory',
      'Bundled wiki.db as a Tauri resource — auto-copied on first launch',
      'Production build creates native installer/executable',
    ],
  },
  {
    version: 'V0.1.0',
    date: '2026-01-15',
    title: 'Initial Release',
    changes: [
      'Full character sheet with ability scores, saves, skills, HP, death saves',
      'Spellbook with slot tracking, prepared spells, Warlock pact magic',
      'Inventory with 40+ weapons/armor, currency, encumbrance, attunement',
      'Combat tracker with 15 conditions, action economy, combat notes',
      'Campaign journal, quest tracker, NPC tracker, lore notes',
      'Arcane Encyclopedia — 964-article searchable wiki',
      'Party Connect — LAN sync with room codes',
      'Dice roller, level-up system, 5 UI themes, beginner tutorial',
    ],
  },
];
