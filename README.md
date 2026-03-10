# The Codex — D&D Companion App

**Current Version: V0.1.5**

A local desktop application for tracking D&D characters across multiple rulesets, with built-in rules reference, spellbook management, inventory tracking, campaign journaling, real-time party sync, and more. Built with React + Tauri 2 (Rust).

## Features

- **Multi-Ruleset Support** — Per-character ruleset selection (5e 2014 PHB, 5e 2024 PHB)
- **Full Character Sheet** — Ability scores, saving throws, skills, HP, death saves, inspiration, exhaustion
- **Spellbook** — Spell slot tracking, prepared spells, spellcasting stats (DC, attack bonus), third-caster subclass support
- **Inventory** — 40+ preloaded weapons/armor catalog, currency tracking (GP/SP/CP/EP), encumbrance, attunement slots
- **Combat Tracker** — Attacks/weapons, 15 trackable conditions with icons, action economy reference, per-action combat notes
- **Features & Traits** — Class features, racial traits, and feats with filtering (ruleset-aware)
- **Campaign Journal** — Session-by-session notes with markdown editor, full-text search, and tags
- **Quests** — Track objectives with completion checkboxes
- **NPCs** — Record allies, enemies, and neutral characters you encounter
- **Lore & World Notes** — Freeform world-building notes with categories
- **Backstory** — Personality traits, physical description, goals, allies, bonds, flaws, and ideals
- **Dice Roller** — All standard dice (d4–d100), custom expressions (e.g. `3d6+2`), advantage/disadvantage, natural 20/1 detection, roll history
- **Rules Reference** — Searchable glossary of D&D mechanics
- **Export & Import** — JSON export/import for character portability, printable ASCII text export
- **Arcane Encyclopedia** — 964-article wiki covering spells, monsters, classes, races, gods, items, rules, and more with FTS5 full-text search and cross-references
- **Party Connect** — LAN-based real-time party sync via WebSockets; host generates a 4-character room code, players join on the same WiFi to share HP, AC, class, level, and death status live
- **Rest Mechanics** — Long rest (full HP restore, spell slot reset, exhaustion reduction, hit dice recovery) and short rest (spend hit dice, Warlock pact magic recovery)
- **Level-Up System** — Dramatic fullscreen overlay with particle effects, class-specific gains (hit dice, spell slots, ASI, features), and Victory Fanfare audio
- **Autosave** — Debounced auto-save with visual save indicator across all sections
- **Themes & Settings** — 5 UI themes (Dungeon Dark, Aged Parchment, Frost Mage, Forest Druid, Infernal), adjustable UI scale (80–125%), font size options, collapsible sidebar
- **Beginner-Friendly** — Interactive tutorial wizard covering dice, ability scores, HP, proficiency, spells, and conditions; contextual help tooltips throughout the app
- **Tauri Desktop App** — Native desktop wrapper (1280x800 window), local SQLite storage, no account required

## Rulesets

Each character stores its own ruleset. Currently supported:

| Ruleset | Description |
|---|---|
| D&D 5e (2014 PHB) | Original 5th Edition Player's Handbook |
| D&D 5e (2024 PHB) | Revised 2024 Player's Handbook — species, revised classes, categorized feats, 10-level exhaustion |

Switching rulesets updates races/species, classes, spell slots, conditions, exhaustion, feats, and class features throughout the UI.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust toolchain](https://rustup.rs/) (includes `cargo`)
- [Tauri CLI](https://v2.tauri.app/start/prerequisites/) prerequisites for your OS

## Setup

```bash
# Install Tauri CLI and root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

### Level-Up Audio (optional)

Place the level-up audio file:

```bash
mkdir -p frontend/public/audio
cp "/path/to/Victory Fanfare.flac" frontend/public/audio/levelup.flac
```

## Running

### Development

```bash
npm run tauri dev
```

This starts the Vite dev server (with hot reload) and opens the Tauri desktop window automatically.

### Production Build

```bash
npm run tauri build
```

Creates a distributable installer/executable in `src-tauri/target/release/bundle/`.

## Creating Your First Character

1. Launch the app with `npm run tauri dev`
2. Click "New Character"
3. Choose a name and ruleset (5e 2014 or 5e 2024)
4. Click Create
5. Click "Enter" on the character card to open the full character sheet

## Architecture

- Each character gets its own SQLite `.db` file in `characters/`
- A shared `wiki.db` stores the encyclopedia (964 articles, FTS5 full-text search, auto-seeded on first startup)
- Frontend communicates with the Rust backend via Tauri commands (IPC)
- All data persists immediately to the database (debounced autosave)
- Ruleset data lives in pluggable frontend modules (`frontend/src/data/rulesets/`)
- A React Context (`RulesetContext`) provides the active ruleset to all components
- Existing character databases auto-migrate when new columns are added
- Data stored in the OS app data directory (e.g. `AppData/` on Windows, `~/Library/` on macOS)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), TailwindCSS, Framer Motion, Lucide Icons |
| Backend | Tauri 2 (Rust), rusqlite |
| Database | SQLite (one DB per character, shared wiki DB with FTS5) |
| Markdown | @uiw/react-md-editor |
| Audio | HTML5 Audio API |

---

## Changelog

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
- Full character sheet (ability scores, saving throws, skills, HP, death saves, inspiration, exhaustion)
- Spellbook with spell slot tracking, prepared spells, spellcasting stats, third-caster subclass support
- Inventory with 40+ preloaded weapons/armor, currency tracking, encumbrance, attunement
- Combat tracker with 15 conditions, action economy reference, per-action combat notes
- Features & traits with class features, racial traits, feats (ruleset-aware filtering)
- Campaign journal with markdown editor, full-text search, and tags
- Quest tracker with objectives and completion checkboxes
- NPC tracker for allies, enemies, and neutral characters
- Lore & world notes with categories
- Backstory editor (personality traits, physical description, goals, allies, bonds, flaws, ideals)
- Dice roller with all standard dice, custom expressions, advantage/disadvantage, nat 20/1 detection
- Searchable rules reference glossary
- JSON export/import and printable ASCII text export
- Arcane Encyclopedia — 964-article wiki with FTS5 full-text search and cross-references
- Party Connect — LAN-based real-time party sync via WebSockets with room codes
- Rest mechanics (long rest and short rest with proper D&D rules)
- Level-up system with animated overlay, class-specific gains, and Victory Fanfare audio
- Debounced autosave with visual save indicator
- 5 UI themes (Dungeon Dark, Aged Parchment, Frost Mage, Forest Druid, Infernal)
- Adjustable UI scale (80–125%) and font size options
- Interactive beginner tutorial wizard and contextual help tooltips
- Per-character SQLite databases with auto-migration
