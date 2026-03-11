# The Codex — D&D Companion App

**Current Version: V0.2.3**

A native desktop application for managing D&D 5e characters with full ruleset support, a 964-article encyclopedia, real-time party sync, and everything you need to play — no account, no internet, no subscriptions. Built with React + Tauri 2 (Rust).

## Features

### Character Sheet
- Ability Scores, Saving Throws, Skills (proficiency + expertise), HP tracking with color-coded bar
- Death Saves, Inspiration, Exhaustion (ruleset-aware: 6 or 10 levels)
- **XP Progress Bar** — visual progress to next level with D&D 5e XP thresholds
- **Multiclass Display** — shows all classes/subclasses/levels from multiclass_data
- Proficiencies (armor, weapons, tools, languages), Movement, Senses
- Automatic Condition Effects — active conditions auto-apply speed, save, and attack penalties

### Spellbook
- Spell Slot Tracking with visual circles, Prepared Spells, Spellcasting Stats auto-calculated
- **Concentration Tracking** — click C badge to concentrate, warns on switch, shows CON save reminder banner
- Third-Caster Support (Eldritch Knight, Arcane Trickster), Warlock Pact Magic
- Search, ritual/concentration badges, upcasting notes

### Combat Tracker
- **Attack Roll Buttons** — click dice icon to instantly roll d20 + bonus and damage with crit detection
- **Condition Duration Timers** — set rounds on conditions, "Next Round" auto-decrements and auto-expires
- 15 D&D conditions with automatic mechanical effects (speed, saves, attacks, checks)
- Action Economy Reference, Combat Notes (Actions/Bonus/Reactions/Legendary)

### Features & Traits
- **Uses/Charges Tracking** — visual charge circles for limited-use abilities (Rage 2/day, Action Surge, etc.)
- Recharge type (Short Rest, Long Rest, Dawn, Manual), one-click restore
- Class Features, Racial Traits, Feats with filtering

### Dice Roller
- **Roll Labels** — add context ("Stealth check", "Longsword attack") that appears in history
- **Persistent History** — roll history survives tab switches (no more lost rolls)
- Quick-roll buttons (d4–d100), custom expressions, advantage/disadvantage, nat 20/1 detection

### NPCs
- **Role-Colored Avatars** — colored circle avatars with initials (green=ally, red=enemy, amber=neutral, blue=party)
- Role-colored card borders and backgrounds for instant visual scanning
- Status tracking (alive/dead/unknown), descriptions, notes, locations

### Inventory
- 40+ preloaded weapons/armor with full stats, currency tracking, encumbrance, attunement

### Backstory
- **Portrait Upload** — drag-and-drop character portrait (PNG/JPEG/WebP/GIF, max 2 MB)
- Personality Traits, Bonds, Flaws, Ideals, Physical Description, Goals, Allies

### Additional Features
- Campaign Journal with markdown editor, full-text search, tags
- Quest Tracker with objectives, progress bars, status
- Lore & World Notes with categories
- Arcane Encyclopedia — 964-article searchable wiki with FTS5
- Party Connect — LAN sync with room codes, auto-reconnect, zombie cleanup
- Rest Mechanics (Long/Short Rest with proper D&D rules)
- Level-Up System with animated overlay and class-specific gains
- 6 UI Themes, font/density controls, auto-save, auto-backup, crash recovery
- Beginner Tutorial Wizard, contextual help tooltips

## Installation

### Windows

1. **Install Node.js** — [nodejs.org](https://nodejs.org/) (LTS, 18+)
2. **Install Rust** — `winget install Rustlang.Rustup` or [rustup.rs](https://rustup.rs/)
3. **Install VS Build Tools** — [Download](https://visualstudio.microsoft.com/visual-cpp-build-tools/), check "Desktop development with C++"
4. **WebView2** — Pre-installed on Windows 10/11. If not: [Microsoft](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
5. **Clone and install:**
   ```powershell
   git clone https://github.com/nisakson2000/dnd-tracker.git
   cd dnd-tracker
   npm install
   cd frontend && npm install && cd ..
   ```
6. **Run:** `npm run tauri dev`

### Linux (Ubuntu/Debian)

1. **System dependencies:**
   ```bash
   sudo apt update && sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file \
     libssl-dev libayatana-appindicator3-dev librsvg2-dev \
     libgtk-3-dev libsoup-3.0-dev libjavascriptcoregtk-4.1-dev
   ```
2. **Node.js 18+:** `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs`
3. **Rust:** `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh && source "$HOME/.cargo/env"`
4. **Clone and install:**
   ```bash
   git clone https://github.com/nisakson2000/dnd-tracker.git
   cd dnd-tracker && npm install && cd frontend && npm install && cd ..
   ```
5. **Run:** `npm run tauri dev`

## Running

```bash
# Development (hot reload)
npm run tauri dev

# Production build
npm run tauri build
# Output: src-tauri/target/release/bundle/ (.msi/.exe on Windows, .deb/.AppImage on Linux)
```

## Architecture

- Per-character SQLite databases with auto-migration
- Shared wiki.db (964 articles, FTS5 full-text search)
- Frontend: React 19 + Vite + TailwindCSS v4 + Framer Motion
- Backend: Tauri 2 (Rust) + rusqlite via IPC commands
- Pluggable rulesets (5e-2014 / 5e-2024) via React Context
- Auto-save (debounced 800ms), auto-backup every 5 minutes

## Changelog Summary

### V0.2.3 — The Big 10
Attack roll buttons, dice roll labels, persistent dice history, XP progress bar, concentration tracking, feature uses/charges, multiclass display, NPC role avatars, condition duration timers, NPC card styling.

### V0.2.2 — Automatic Condition Effects
Conditions auto-apply D&D 5e mechanical effects (speed, saves, attacks). Update check toast notifications. Party Connect + character creation bug fixes.

### V0.2.1 — Connection Hardening
Auto-reconnect, connection timeout, host reassignment, zombie cleanup, bounded channels.

### V0.2.0 — LAN Party & Auto-Updates
Party Connect over LAN, auto-update check, Midnight Glass V3 UI, settings overhaul.

### V0.1.8 — Character Creation & Auto-Backup
Expanded creation flow, race traits/class features display, auto-backup, crash recovery.

### V0.1.5 — Tauri Migration
Migrated from Python/FastAPI to native Tauri 2 desktop app.

### V0.1.0 — Initial Release
Full character sheet, spellbook, inventory, combat, journal, quests, NPCs, lore, dice roller, wiki, party sync, level-up system.
