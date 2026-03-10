# The Codex — D&D Companion App

A local desktop application for tracking D&D characters across multiple rulesets, with built-in rules reference, spellbook management, inventory tracking, campaign journaling, real-time party sync, and more. Built with React + FastAPI + Tauri.

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

- Python 3.11+
- Node.js 18+
- Rust toolchain (for Tauri desktop builds)

## Setup

### Backend

```bash
pip install -r backend/requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

### Level-Up Audio

Place the level-up audio file:

```bash
mkdir -p frontend/public/audio
cp "/path/to/Victory Fanfare.flac" frontend/public/audio/levelup.flac
```

## Running

### Quick Start (tmux)

```bash
bash run_servers.sh
```

### Manual Start

Terminal 1 — Backend:
```bash
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```

### Tauri Desktop App

```bash
cd src-tauri
cargo tauri dev
```

### Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Creating Your First Character

1. Open http://localhost:5173
2. Click "New Character"
3. Choose a name and ruleset (5e 2014 or 5e 2024)
4. Click Create
5. Click "Enter" on the character card to open the full character sheet

## Architecture

- Each character gets its own SQLite `.db` file in `characters/`
- A shared `wiki.db` stores the encyclopedia (964 articles, FTS5 full-text search, auto-seeded on first startup)
- Frontend communicates with the backend via REST API
- All data persists immediately to the database (debounced autosave)
- Ruleset data lives in pluggable frontend modules (`frontend/src/data/rulesets/`)
- A React Context (`RulesetContext`) provides the active ruleset to all components
- Existing character databases auto-migrate when new columns are added
- Tauri wraps the frontend + backend into a native desktop app with local data storage

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), TailwindCSS, Framer Motion, Lucide Icons |
| Backend | FastAPI (Python), WebSockets (Party Connect) |
| Desktop | Tauri 2 (Rust) |
| Database | SQLite via SQLAlchemy (one DB per character, shared wiki DB with FTS5) |
| Markdown | @uiw/react-md-editor |
| Audio | HTML5 Audio API |
