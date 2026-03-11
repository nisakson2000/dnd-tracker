# The Codex — D&D Companion App

**Current Version: V0.2.2**

A native desktop application for managing D&D 5e characters with full ruleset support, a 964-article encyclopedia, real-time party sync, and everything you need to play — no account, no internet, no subscriptions. Built with React + Tauri 2 (Rust).

## Features

### Character Sheet
- **Ability Scores & Modifiers** — All six abilities with auto-calculated modifiers
- **Saving Throws** — Per-ability proficiency toggles with calculated bonuses
- **Skills** — All 18 skills with proficiency and expertise (double proficiency) support
- **Hit Points** — Current HP, max HP, temporary HP tracking
- **Death Saves** — Track successes and failures separately, auto-reset on long rest
- **Inspiration** — Toggle inspiration on/off
- **Exhaustion** — Ruleset-aware (6 levels in 2014, 10 levels in 2024)
- **Character Info** — Name, race/subrace, class/subclass, background, alignment, campaign name, level, XP
- **Proficiencies** — Separate tracking for armor, weapons, tools, and languages
- **Movement & Senses** — Speed and special senses (e.g. Darkvision 60 ft)
- **Multiclass Support** — Store and manage multiclass data

### Spellbook
- **Spell Slot Tracking** — Visual slot usage per spell level, reset on long rest
- **Prepared Spells** — Mark spells as prepared for the day
- **Spellcasting Stats** — Auto-calculated spell save DC (8 + proficiency + ability mod) and spell attack bonus
- **Spellcasting Ability** — Auto-determined from class (INT for Wizards, WIS for Clerics, CHA for Sorcerers, etc.)
- **Third-Caster Support** — Eldritch Knight and Arcane Trickster with INT-based casting
- **Warlock Pact Magic** — Separate pact slots that recover on short rest
- **Spell Details** — School, components (V/S/M), material descriptions, ritual casting, concentration, upcasting notes
- **Spell Source** — Track which book each spell comes from (PHB, XGtE, etc.)

### Inventory
- **Item Catalog** — 40+ preloaded weapons (simple/martial, melee/ranged) and armor with full stats
- **Weapon Properties** — Light, Heavy, Finesse, Versatile, Reach, Thrown, Two-Handed, etc.
- **Armor & AC Formulas** — Shows how AC is calculated per armor type (e.g. "11 + DEX" for leather)
- **Currency** — Gold (GP), Silver (SP), Copper (CP), Electrum (EP) with conversion rates
- **Encumbrance** — Weight tracking with carry capacity based on STR
- **Attunement** — Track attuned magic items (max 3)
- **Custom Items** — Add homebrew items beyond the catalog

### Combat Tracker
- **Attacks & Weapons** — Add custom attacks with damage dice, damage type, range, and properties
- **Conditions** — 15 D&D conditions with emoji icons and detailed info panels (Blinded, Charmed, Deafened, Frightened, Grappled, Incapacitated, Invisible, Paralyzed, Petrified, Poisoned, Prone, Restrained, Stunned, Unconscious, Exhaustion)
- **Automatic Condition Effects** — Active conditions automatically apply their D&D 5e mechanical effects:
  - Speed overrides (Grappled/Restrained/Paralyzed/Unconscious → Speed 0)
  - Attack roll modifiers (Blinded/Poisoned/Prone/Restrained → Disadvantage; Invisible → Advantage)
  - Saving throw effects (Paralyzed/Stunned/Unconscious → Auto-fail STR/DEX; Restrained → Disadvantage DEX)
  - Ability check penalties (Poisoned/Frightened → Disadvantage on all checks)
  - Dice Roller auto-sets advantage/disadvantage from conditions
  - Effects banner on Character Sheet shows all active penalties at a glance
  - D&D RAW: advantage + disadvantage from different sources cancel out
- **Action Economy Reference** — Quick reference for Actions, Bonus Actions, Reactions
- **Combat Notes** — Separate editable sections for Actions, Bonus Actions, Reactions, and Legendary Actions
- **Auto-save** — Changes persist immediately with visual save indicator

### Features & Traits
- **Class Features** — All features for your class with descriptions, tracked by source level
- **Racial Traits** — Race/species-specific abilities
- **Feats** — Searchable/filterable feat list
- **Ruleset-Aware** — Features update automatically when switching between 2014 and 2024 rulesets
- **Feature Source** — Track where each feature comes from and at what level it was gained

### Campaign Journal
- **Session Notes** — Create entries per session with markdown formatting
- **Full-Text Search** — Search across title, body, and tags
- **Tag System** — Categorize entries with tags for easy filtering
- **Markdown Editor** — Rich text editing with @uiw/react-md-editor

### Quests
- **Quest Tracking** — Create quests with title, description, and quest giver
- **Objectives** — Individual checkable objectives per quest with progress bars
- **Status** — Mark quests as active or completed

### NPCs
- **Role Classification** — Categorize as ally, enemy, neutral, or party member
- **Status Tracking** — Mark NPCs as alive, dead, or unknown
- **Descriptions** — Record appearance, personality, and notes

### Lore & World Notes
- **Categories** — Organize notes by category (locations, factions, history, etc.)
- **Search** — Filter notes by category and content
- **Freeform** — Write anything about your campaign world

### Backstory
- **Personality Traits, Bonds, Flaws, Ideals** — Structured fields for character personality
- **Physical Description** — Appearance details
- **Goals & Aspirations** — Character motivation
- **Allies & Enemies** — Key relationships

### Dice Roller
- **Standard Dice** — Quick-roll buttons for d4, d6, d8, d10, d12, d20, d100
- **Custom Expressions** — Parse and roll complex expressions like `3d6+2`, `2d8-1`
- **Advantage/Disadvantage** — Roll 2d20 and take the higher or lower result
- **Natural 20/1 Detection** — Visual feedback for crits and fumbles
- **Roll History** — Review past rolls with results and labels
- **Die Tips** — Contextual hints (e.g. "d4 — Dagger damage, Magic Missile")

### Rules Reference
- **Searchable Glossary** — D&D mechanics and terms
- **Action Economy Card** — Quick reference for action types

### Export & Import
- **JSON Export** — Full character data backup (stats, skills, spells, inventory, journal, quests, NPCs, lore, backstory)
- **JSON Import** — Restore characters from backup files
- **ASCII Text Export** — Printable formatted character sheet summary with detailed stats, proficiencies, attacks, spells, and inventory

### Arcane Encyclopedia
- **964 Articles** — Spells, monsters, classes, races, gods, items, rules, backgrounds, feats, conditions, planes, and more
- **FTS5 Full-Text Search** — Fast search across title, summary, and content using SQLite's FTS5 engine
- **Cross-References** — Articles link to related articles with relationship types
- **Metadata** — Articles store extensible JSON metadata
- **Auto-Seeded** — Wiki database bundles with the app and copies on first launch
- **Categories** — Browse by category (spells by level, monsters by CR, etc.)

### Party Connect
- **LAN Sync** — Real-time party sync over local WiFi, no internet required
- **Room Codes** — Host generates a 4-character code; players join by entering IP + code
- **Dev/Built Cross-Play** — Dev builds and production .exe connect to each other seamlessly
- **Live Data** — Syncs character name, race, class, level, HP, max HP, AC, and death status
- **HP Color Bars** — Color-coded health indicators (green 51%+, yellow 26–50%, red 1–25%, skull at 0)
- **Connection Status** — Visual indicators for Connected/Connecting/Disconnected
- **Auto-Reconnect** — Exponential backoff reconnect on WiFi drops (up to 10 retries)
- **Connection Timeout** — 8-second timeout with clear error messages instead of silent hangs
- **Host Reassignment** — If host disconnects, another player is automatically promoted
- **Graceful Shutdown** — All players notified when host ends the session
- **Zombie Cleanup** — Inactive clients removed after 90s of no activity
- **Auto-Sync** — Optionally auto-sync when HP, AC, name, race, or class changes
- **WebSocket Heartbeat** — 25-second ping interval to maintain connections
- **Bounded Channels** — Memory-safe message queues prevent slow clients from causing leaks

### Rest Mechanics
- **Long Rest** — Restores full HP, removes temporary HP, resets death saves, reduces exhaustion by 1, recovers half hit dice (rounded up), resets all spell slots
- **Short Rest** — Spend hit dice to recover HP, Warlock pact magic slots recover (other casters' slots do not)
- **Detailed Summary** — Shows exactly what was restored after each rest

### Level-Up System
- **Animated Overlay** — Fullscreen "LEVEL UP!" with gold shimmer gradient and 30 rising particle effects
- **Class-Specific Gains** — Hit die increase, proficiency bonus changes, new spell slots, ASI notifications, and class features with descriptions
- **Victory Fanfare** — Plays audio on level up (auto-dismisses when audio ends, 5-second fallback)
- **ASI Detection** — Alerts when you reach an Ability Score Improvement level (choose +2/+1 to abilities or take a Feat)

### Themes & Settings
- **5 UI Themes** — Dungeon Dark (default), Aged Parchment, Frost Mage, Forest Druid, Infernal — each with color palette preview
- **UI Scale** — Slider from 80–125% with labeled presets (Compact, Normal, Comfortable, Large, Huge)
- **Font Size** — 4 options: Small (16px), Normal (18px), Large (20px), XL (22px)
- **Sidebar** — Option to start with sidebar collapsed (persisted)
- **Reset to Defaults** — One-click reset button
- **Settings Persistence** — All settings saved to localStorage

### Beginner-Friendly
- **8-Step Tutorial Wizard** — Interactive walkthrough covering: Welcome to D&D, Dice Notation, Ability Scores, HP & Combat, Spellcasting, Skills & Saves, Resting & Recovery, Getting Started
- **Contextual Help Tooltips** — Hover tooltips explaining every major field and mechanic throughout the app
- **Dice Explainer** — Visual guide to dice types and their uses

### Keyboard Shortcuts
- **Ctrl+1–9** — Quick-switch between character sheet sections
- **Ctrl+S** — Prevented (auto-save handles everything)

### UI & UX
- **Toast Notifications** — Success, error, and info toasts via react-hot-toast
- **Framer Motion Animations** — Smooth transitions, particle effects, animated overlays
- **Sidebar Status Badges** — Quick-glance indicators for Low HP, Down, Inspired, Exhaustion level, active Conditions
- **Confirm Dialogs** — Type-to-confirm for destructive actions (e.g. "DELETE CHARACTER")
- **Noise/Grain Overlay** — Subtle background texture for atmosphere
- **Native Desktop Window** — 1280x800 resizable window, no browser required

## Rulesets

Each character stores its own ruleset. Currently supported:

| Ruleset | Description |
|---|---|
| D&D 5e (2014 PHB) | Original 5th Edition Player's Handbook |
| D&D 5e (2024 PHB) | Revised 2024 Player's Handbook — species, revised classes, categorized feats, 10-level exhaustion |

Switching rulesets updates races/species, classes, spell slots, conditions, exhaustion, feats, and class features throughout the UI.

## Installation

### Windows

1. **Install Node.js** — Download and run the installer from [nodejs.org](https://nodejs.org/) (LTS, 18+). Check "Add to PATH" during install.

2. **Install Rust** — Open PowerShell and run:
   ```powershell
   winget install Rustlang.Rustup
   ```
   Or download from [rustup.rs](https://rustup.rs/). Restart your terminal after install.

3. **Install Visual Studio Build Tools** — Required by Tauri on Windows:
   - Download [VS Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - In the installer, check **"Desktop development with C++"**
   - Install and restart

4. **Install WebView2** — Usually pre-installed on Windows 10/11. If not, download from [Microsoft](https://developer.microsoft.com/en-us/microsoft-edge/webview2/).

5. **Clone and install dependencies:**
   ```powershell
   git clone https://github.com/nisakson2000/dnd-tracker.git
   cd dnd-tracker
   npm install
   cd frontend
   npm install
   cd ..
   ```

6. **Run the app:**
   ```powershell
   npm run tauri dev
   ```

### Linux (Ubuntu/Debian)

1. **Install system dependencies:**
   ```bash
   sudo apt update
   sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file \
     libssl-dev libayatana-appindicator3-dev librsvg2-dev \
     libgtk-3-dev libsoup-3.0-dev libjavascriptcoregtk-4.1-dev
   ```

2. **Install Node.js 18+:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. **Install Rust:**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source "$HOME/.cargo/env"
   ```

4. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/nisakson2000/dnd-tracker.git
   cd dnd-tracker
   npm install
   cd frontend && npm install && cd ..
   ```

5. **Run the app:**
   ```bash
   npm run tauri dev
   ```

### Level-Up Audio (optional)

Place a level-up sound effect at:
```
frontend/public/audio/levelup.flac
```

## Running

### Development

```bash
npm run tauri dev
```

This starts the Vite dev server (with hot reload) and opens the Tauri desktop window automatically. First build takes a few minutes while Rust compiles; subsequent launches are fast.

### Production Build

```bash
npm run tauri build
```

Creates a distributable installer/executable in `src-tauri/target/release/bundle/`:
- **Windows:** `.msi` installer and `.exe`
- **Linux:** `.deb` and `.AppImage`

## Creating Your First Character

1. Launch the app with `npm run tauri dev`
2. Click "New Character"
3. Choose a name, ruleset (5e 2014 or 5e 2024), race, and class
4. Optionally select a subclass (can be chosen later)
5. Click Create
6. Click "Enter" on the character card to open the full character sheet

## Architecture

- Each character gets its own SQLite `.db` file in the app data directory
- A shared `wiki.db` stores the encyclopedia (964 articles, FTS5 full-text search, auto-seeded on first startup)
- Frontend communicates with the Rust backend via Tauri IPC commands
- All data persists immediately to the database (debounced 800ms autosave)
- Ruleset data lives in pluggable frontend modules (`frontend/src/data/rulesets/`)
- A React Context (`RulesetContext`) provides the active ruleset to all components
- Existing character databases auto-migrate when new columns are added
- Connection pooling via mutex-locked map for efficient multi-character DB access
- Data stored in the OS app data directory (e.g. `AppData/` on Windows, `~/Library/` on macOS)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TailwindCSS v4, Framer Motion, Lucide Icons, React Router v7 |
| Backend | Tauri 2 (Rust), rusqlite |
| Database | SQLite (one DB per character, shared wiki DB with FTS5) |
| Markdown | @uiw/react-md-editor |
| Notifications | react-hot-toast |
| Audio | HTML5 Audio API |

---

## Changelog

### V0.2.2 — Automatic Condition Effects & Bug Fixes

**Changes:**
- Automatic Condition Effects — active conditions now apply their D&D 5e mechanical effects automatically
- Conditions modify speed (Grappled/Restrained/Paralyzed → Speed 0), saving throws (auto-fail STR/DEX), and attack rolls
- Overview shows condition effects banner with all active penalties at a glance
- Saving throws display AUTO-FAIL and DIS badges when conditions apply
- Dice Roller auto-sets advantage/disadvantage based on active conditions
- Condition buttons now have stronger red highlighting with glow effect when active
- Combat section shows full mechanical effects summary for active conditions
- Update check now shows toast notification — confirms up-to-date, update available, or offline
- Confirm dialogs added to all 8 sections with delete operations (Combat, Spellbook, NPCs, Quests, Lore, Features, Inventory, Journal)
- Search bars added to Inventory and Spellbook for filtering large lists
- Escape key closes all modal forms
- Fixed Party Connect — join/leave messages now match between Python backend and frontend
- Fixed character creation — race, class, and subclass now saved by Python backend
- Fixed ability score input styling — inputs blend seamlessly into dark cards
- Fixed missing skill/save creation on update endpoints
- Fixed null crashes in search filters across Journal, Lore, Inventory, Spellbook
- Fixed missing toast import in DiceRoller (was crashing on invalid input)
- Fixed death save reset on short rest (Python backend)
- Fixed multiclass Warlock pact magic detection on short rest
- Fixed setState-after-unmount in useUpdateCheck and useLevelUp hooks

### V0.2.1 — Connection Hardening & Stability

**Changes:**
- Party Connect — auto-reconnect with exponential backoff on WiFi drops
- Party Connect — 8-second connection timeout with clear error toasts instead of silent hangs
- Party Connect — host reassignment when original host disconnects
- Party Connect — graceful shutdown notifies all players when host ends session
- Party Connect — zombie client cleanup removes inactive clients after 90s
- Party Connect — bounded message channels prevent memory leaks from slow clients
- Party Connect — IP validation on join, proper clipboard error handling
- Party Connect — auto-sync now tracks name, race, and class changes (not just HP/AC)
- Update system — removed hardcoded GitHub repo name from JS bundle (private repo stays private)
- Update system — switched to neutral version manifest URL for update checks
- Fixed stale WebSocket closures via callback refs (prevents party desync)
- Fixed ping interval leak on reconnect (no more stacking intervals)
- Fixed silent error swallowing in backend file operations and reload triggers
- Fixed React key warnings across Journal, Quests, Wiki, and LevelUp components
- Added alt text to character portrait images for accessibility
- Version sync — all config files now at 0.2.1 (package.json files were stuck at 0.1.7)

### V0.2.0 — LAN Party & Auto-Updates

**Changes:**
- LAN Party Connect — host shows IP, joiners enter IP + room code for reliable cross-device play
- Dev builds and production builds can connect to each other seamlessly
- Auto-update check on launch — checks for new versions, downloads installer directly
- Update screen shown at startup with animated progress and version comparison
- Midnight Glass V3 UI — glassmorphism panels, 6 preset themes, per-ability colors
- Settings overhaul — 4-tab panel with font/density/layout controls
- Subclass selection moved to level-up at the appropriate class level
- Version sync across all config files

### V0.1.8 — Character Creation, Auto-Backup & Accuracy

**Changes:**
- Expanded character creation — choose race, class, and optional subclass during setup (filtered by ruleset)
- Locked identity fields (name, race, class, subclass) on character sheet after creation
- Race traits and class features now displayed on the character sheet, filtered by level
- Class-filtered spell dropdown in spellbook — shows SRD 5.1 spells available to your class
- Auto-backup every 5 minutes — overwrites a single `{name}_autosave.json` file (no file bloat)
- Fixed drag-and-drop portrait upload (Tauri was intercepting file drops)
- Added crash recovery hook for unsaved data
- Expanded 5e 2014 ruleset data — 30+ races with subraces, all 12 classes with full feature lists
- Party UI rework with new card styles and color-coded member accents
- Accuracy improvements: proper rest mechanics, ruleset-aware features

### V0.1.5 — Tauri Migration

Migrated from a Python/FastAPI web app to a fully native Tauri 2 desktop application.

**Changes:**
- Replaced Python/FastAPI backend with Rust (Tauri 2) + rusqlite
- Replaced SQLAlchemy ORM with direct rusqlite queries
- Frontend now communicates via Tauri IPC commands instead of REST API
- Single-command launch (`npm run tauri dev`) replaces separate backend/frontend terminals
- Data stored in OS app data directory (`AppData/` on Windows, `~/Library/` on macOS) instead of project folder
- Bundled `wiki.db` as a Tauri resource — auto-copied on first launch
- Production build creates native installer/executable via `npm run tauri build`
- Removed Python dependency — only Node.js and Rust toolchain required
- Removed `run_servers.sh`, `setup_frontend.sh`, and tmux-based startup

### V0.1.0 — Initial Release

The original web-based version of The Codex, built with React + FastAPI.

**Features:**
- Multi-ruleset support (D&D 5e 2014 PHB & 2024 PHB)
- Full character sheet (ability scores, saving throws, skills with expertise, HP, temp HP, death saves, inspiration, exhaustion)
- Spellbook with spell slot tracking, prepared spells, spellcasting stats, third-caster support, Warlock pact magic
- Inventory with 40+ preloaded weapons/armor, weapon properties, AC formulas, currency tracking, encumbrance, attunement
- Combat tracker with 15 conditions (with emoji icons), action economy reference, per-action combat notes, legendary actions
- Features & traits with class features, racial traits, feats (ruleset-aware filtering, source tracking)
- Campaign journal with markdown editor, full-text search across title/body/tags
- Quest tracker with objectives, progress bars, quest givers, and status management
- NPC tracker with role classification (ally/enemy/neutral/party) and status (alive/dead/unknown)
- Lore & world notes with categories and search
- Backstory editor (personality traits, bonds, flaws, ideals, physical description, goals, allies)
- Dice roller with all standard dice, custom expressions, advantage/disadvantage, nat 20/1 detection
- Searchable rules reference glossary with action economy card
- JSON export/import and detailed ASCII text export
- Arcane Encyclopedia — 964-article wiki with FTS5 full-text search, cross-references, and metadata
- Party Connect — LAN-based real-time party sync via WebSockets with room codes, color-coded HP bars, class icons
- Rest mechanics (long rest and short rest with proper D&D rules, Warlock pact magic recovery)
- Level-up system with animated overlay, particle effects, class-specific gains, ASI detection, Victory Fanfare audio
- Debounced autosave with visual save indicator
- 5 UI themes, adjustable UI scale (80–125%), 4 font sizes, collapsible sidebar
- 8-step interactive beginner tutorial wizard and contextual help tooltips throughout
- Keyboard shortcuts (Ctrl+1–9 section switching)
- Toast notifications, Framer Motion animations, sidebar status badges, type-to-confirm dialogs
- Per-character SQLite databases with auto-migration and connection pooling
