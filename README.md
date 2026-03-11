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
- **Attack Roll Buttons** — click the dice icon on any weapon to instantly roll d20 + attack bonus and damage with crit detection (nat 20 doubles damage dice)
- **Dice Roll Labels** — add context like "Stealth check" or "Longsword attack" that appears in your roll history
- **Dice History Persistence** — roll history now survives tab switches so you never lose past rolls
- **XP Progress Bar** — visual progress bar showing XP toward next level using official D&D 5e thresholds (levels 1-20)
- **Concentration Tracking** — click the C badge on any concentration spell to track it; warns when switching spells, shows active banner with CON save DC reminder
- **Feature Uses/Charges** — track limited-use abilities (Rage 2/day, Action Surge 1/short rest) with visual charge circles, spend/restore on click, recharge type badges
- **Multiclass Display** — multiclass_data JSON now renders as class/subclass/level badges in the Identity card
- **NPC Role Avatars** — NPCs show colored circle avatars with initials (green=ally, red=enemy, amber=neutral, blue=party) and role-colored card borders
- **Condition Duration Timers** — set rounds on active conditions, "Next Round" button auto-decrements all timers and auto-expires conditions at 0
- **NPC Card Styling** — cards have role-colored borders and subtle background tints for instant visual scanning

### V0.2.2 — Automatic Condition Effects
- **Condition Mechanical Effects** — active conditions now auto-apply their D&D 5e effects: Grappled/Restrained/Paralyzed set speed to 0, Paralyzed/Stunned auto-fail STR/DEX saves, Blinded/Poisoned/Restrained impose disadvantage on attacks
- **Effects Summary Banner** — Overview and Combat sections show all active penalties at a glance (speed, saves, attacks, checks)
- **Saving Throw Badges** — AUTO-FAIL and DIS badges appear on saving throws when relevant conditions are active
- **Dice Roller Integration** — advantage/disadvantage auto-set based on active conditions
- **Condition Button Styling** — active conditions have stronger red highlighting with glow effect
- **Update Check Toast** — confirms up-to-date, update available, or offline status via toast notification
- **Bug Fixes** — Party Connect join/leave messages, character creation race/class/subclass saving, ability score input styling, missing skill/save creation on updates, Party MemberCard null crash

### V0.2.1 — Connection Hardening
- **Auto-Reconnect** — Party Connect reconnects automatically with exponential backoff (1s, 2s, 4s, 8s) on WiFi drops
- **Connection Timeout** — 8-second timeout with clear error toasts instead of silent hangs
- **Host Reassignment** — when the original host disconnects, a new host is assigned so the room stays alive
- **Graceful Shutdown** — host ending session notifies all connected players
- **Zombie Cleanup** — inactive clients automatically removed after 90 seconds of no ping
- **Bounded Channels** — message channels capped to prevent memory leaks from slow clients
- **Sync Improvements** — auto-sync now tracks name, race, and class changes (not just HP/AC)
- **Security** — removed hardcoded GitHub repo URL from JS bundle, switched to neutral version manifest
- **Bug Fixes** — stale WebSocket closures via callback refs, ping interval leak on reconnect, silent error swallowing in file operations, React key warnings across multiple components

### V0.2.0 — LAN Party & Auto-Updates
- **Party Connect** — host shows your local IP, joiners enter IP + room code for reliable cross-device LAN play
- **Cross-Build Compatibility** — dev builds and production builds can connect to each other seamlessly
- **Auto-Update Check** — checks GitHub releases on launch, downloads installer directly if update available
- **Update Screen** — startup screen with animated progress bar and version comparison
- **Midnight Glass V3 UI** — glassmorphism panels, 6 preset themes (Midnight Glass, Ember Forge, Blood Pact, Arcane Sea, Fey Wild, Void Walker), per-ability score colors
- **Settings Overhaul** — 4-tab settings panel with font family, font scale, UI density, and layout controls
- **Subclass Selection** — moved to level-up flow at the appropriate class level instead of character creation
- **Version Sync** — VERSION, version.js, tauri.conf.json, Cargo.toml all kept in sync

### V0.1.8 — Character Creation & Auto-Backup
- **Expanded Character Creation** — choose race, class, and optional subclass during setup; identity fields locked after creation
- **Race & Class Display** — race traits and class features shown on character sheet by level
- **Auto-Backup** — automatic backup every 5 minutes to a single overwriting JSON file with crash recovery
- **Expanded Ruleset** — 30+ races, all 12 classes with full feature lists for D&D 5e 2014
- **Portrait Upload** — drag-and-drop character portrait support in Tauri (PNG/JPEG/WebP/GIF, max 2 MB)
- **Party UI Rework** — color-coded member cards with role indicators

### V0.1.5 — Tauri Migration
- **Native Desktop App** — migrated from Python/FastAPI backend to Tauri 2 (Rust) for a single-binary native app
- **IPC Communication** — frontend communicates via Tauri IPC commands instead of REST API
- **Single-Command Launch** — `npm run tauri dev` starts everything
- **OS App Data** — character data stored in the OS-standard app data directory
- **Bundled Wiki** — wiki.db shipped as a Tauri resource, auto-copied on first launch
- **Native Installer** — production build creates .msi/.exe (Windows) or .deb/.AppImage (Linux)

### V0.1.0 — Initial Release
- Full character sheet with ability scores, saving throws, skills, HP tracking, death saves, inspiration, exhaustion
- Spellbook with spell slot tracking, prepared spells, Warlock pact magic support
- Inventory with 40+ preloaded weapons/armor, currency tracking, encumbrance, attunement (max 3)
- Combat tracker with 15 D&D 5e conditions, action economy reference, combat notes
- Campaign journal with markdown editor, session numbering, tags, full-text search
- Quest tracker with objectives, checkboxes, progress tracking, status management
- NPC tracker with roles, status, descriptions, notes, locations
- Lore & World Notes with categories and search
- Arcane Encyclopedia — 964-article searchable wiki with SQLite FTS5
- Party Connect — LAN sync with room codes for real-time character sharing
- Dice roller with d4-d100, custom expressions, advantage/disadvantage, nat 20/1 detection
- Level-up system with animated overlay and class-specific stat gains
- 5 UI themes, beginner tutorial wizard, contextual help tooltips
