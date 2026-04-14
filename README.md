<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,12,20&height=160&section=header&text=The%20Codex&fontSize=52&fontColor=fff&animation=twinkling&fontAlignY=32&desc=D%26D%205e%20Companion%20App&descSize=18&descAlignY=54"/>

<div align="center">

![Version](https://img.shields.io/badge/Version-0.8.6-A855F7?style=for-the-badge)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tauri](https://img.shields.io/badge/Tauri_2-FFC131?style=for-the-badge&logo=tauri&logoColor=black)
![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

A native desktop app for managing D&D 5e characters, running campaigns, and playing sessions — with real-time multiplayer, a 2,000+ article encyclopedia, and full 5e ruleset support. No account, no internet, no subscriptions.

**Built with [Claude Code](https://claude.ai/claude-code)**

</div>

---

## Highlights

| | |
|---|---|
| **Player + DM Modes** | Full character sheets for players, complete campaign engine for DMs |
| **Real-Time Multiplayer** | WebSocket-based sessions — DM and players sync combat, rolls, loot, and conditions live over LAN |
| **154 Recipes of D&D** | 2,000+ article wiki with full-text search, monster stat blocks, spells, items, and more |
| **Everything Offline** | All data stored locally in SQLite. Optional AI assistant via Ollama runs on your machine too |
| **Two Rulesets** | Supports both 5e-2014 and 5e-2024 rules |

---

## Quick Start

```bash
git clone https://github.com/nisakson2000/dnd-tracker.git
cd dnd-tracker
npm install
cd frontend && npm install && cd ..
npm run tauri dev
```

> **Requirements:** Node.js 18+, Rust (stable). See [full setup instructions](#installation) below for platform-specific dependencies.

---

## Features

<details>
<summary><strong>Player Mode</strong></summary>

- **Character Sheet** — ability scores, saves, skills, HP, AC, proficiency, conditions, inspiration, exhaustion, multiclass
- **Dice Rolling** — animated dice with crit effects, saved macros, advantage/disadvantage, custom expressions
- **Spellbook** — slot tracking, prepared spells, concentration, ritual casting, cantrip scaling, third-caster and pact magic support
- **Combat Tracker** — initiative, action economy (action/bonus/reaction), attack rolls with full modifier math, flanking, conditions with auto-applied effects
- **Inventory** — 40+ preloaded items, magic item properties (+1/+2/+3, extra dice, save bonuses), currency, encumbrance, attunement
- **Features & Traits** — uses/charges with recharge tracking, rest-based restore, low-charge warnings
- **Journal** — markdown editor, session tagging, NPC mentions, pinned entries, export
- **Backstory** — portrait upload, personality traits, bonds, flaws, ideals, goals, allies
- **Level-Up System** — animated overlay with class-specific gains and auto-detection
- **D&D Beyond Import** — multi-step wizard for importing character JSON exports

</details>

<details>
<summary><strong>DM Mode & Campaign Engine</strong></summary>

- **Campaign Builder** — create Homebrew or Premade campaigns with scenes, encounters, and handouts
- **Live Session Runner** — initiative tracker, round manager, action log, chat, timer, scene management
- **NPC Intelligence** — 8 personality archetypes, 34 traits, trust system (-100 to +100), memory with decay, behavior prediction
- **Combat AI** — intelligence-tiered tactics (Mindless to Genius), 7 monster behavior profiles, boss phase system
- **Story Engine** — story threads with branching outcomes, villain profiles, campaign arcs, secrets with reveal conditions
- **World Systems** — factions, weather, economy, investigation clues, rumor propagation, world crises, artifact evolution
- **Session Tools** — quest generator, session recap, world state manager, travel calculator, random encounters, mood/music sync
- **Monster Panel** — SRD monster search, HP/condition tracking, legendary and lair actions
- **Handouts** — create and reveal handouts to players with visibility toggle
- **Cover System** — half/three-quarter/full cover with AC modifiers synced to players

</details>

<details>
<summary><strong>Multiplayer (DM↔Player Sync)</strong></summary>

- **WebSocket Sessions** — real-time sync over LAN with room codes and auto-reconnect
- **22+ Synced Event Types** — conditions, HP, rest, loot, XP, spell slots, combat state, and more
- **Player Combat HUD** — tabbed interface (Attack, Spell, Items, Features) during combat turns
- **Turn Notifications** — audio chime, window flash, gold banner when it's your turn
- **Death Saves** — dramatic d20 roll overlay with nat 1/nat 20 handling
- **Concentration Tracking** — auto-sends CON save on damage, auto-drops on fail
- **Shared Combat Log** — all players see attacks, damage, kills, and spell casts live
- **Equipment Selection** — players choose weapons/armor before combat starts
- **Mood & Music Sync** — DM sets scene mood with ambient audio and visual overlays for all players
- **Offline Queue** — actions queue when disconnected and replay on reconnect
- **Crash Recovery** — periodic snapshots with recovery banner on reconnect

</details>

<details>
<summary><strong>Encyclopedia & Reference</strong></summary>

- **2,000+ Articles** — searchable wiki with FTS5 full-text search
- **Grid & List Views** — browse by category or search
- **Cross-Reference Previews** — hover links to preview related articles
- **Keyboard Navigation** — arrow keys, Enter to open, Escape to close

</details>

<details>
<summary><strong>Additional Tools</strong></summary>

- **Encounter Builder** — design balanced encounters by CR, party level, and difficulty
- **Homebrew Builder** — create custom monsters, spells, and magic items
- **Party Analyzer** — composition analysis, role coverage, encounter difficulty recommendations
- **Party Loot** — shared treasure tracking with distribution and audit log
- **Soundboard** — procedural ambient audio (tavern, combat, forest, dungeon, storm, ocean, camp, city)
- **Calendar** — Forgotten Realms Harptos calendar with festivals and seasons
- **Downtime Activities** — crafting, training, research, business, carousing
- **PDF Export** — print-ready character sheets
- **In-Character Chat** — IC/OOC modes with `/roll` commands and class-colored names
- **Keyboard Shortcuts** — Ctrl+1–9 section navigation, Ctrl+R quick roll, `?` for help

</details>

<details>
<summary><strong>AI Assistant (Optional)</strong></summary>

An optional D&D companion that runs entirely on your machine via [Ollama](https://ollama.ai).

- Searches the 2,000+ article wiki before every query for accurate 5e answers
- Brief responses (1–3 sentences) with low temperature for accuracy
- Floating widget available on all sections
- Uses phi3.5 (~2.2GB) — auto-downloads when enabled
- **Requires:** Ollama installed, 4GB free RAM
- **Privacy:** All data stays local. Nothing leaves your machine.

To enable: Settings → AI Assistant → Enable

</details>

<details>
<summary><strong>Dev Tools (Ctrl+Shift+D)</strong></summary>

- DB Inspector with raw SQL queries
- Git panel (status, commit, push, pull, diff, stash)
- LAN dev chat via UDP broadcast
- IPC logger for Tauri invokes
- Performance overlay (FPS, render timing)
- Feature flags, schema migration runner
- Test character generator
- Bug report generator

</details>

---

## Installation

### Prerequisites

| Dependency | Version | |
|---|---|---|
| **Node.js** | 18+ LTS | [nodejs.org](https://nodejs.org/) |
| **Rust** | stable | [rustup.rs](https://rustup.rs/) |

### Platform Dependencies

<details>
<summary><strong>Windows</strong></summary>

- **VS Build Tools** with "Desktop development with C++" workload — [Download](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- **WebView2** — pre-installed on Windows 10/11 ([Download](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) if missing)

</details>

<details>
<summary><strong>Linux (Ubuntu / Debian)</strong></summary>

```bash
sudo apt update && sudo apt install -y \
  libwebkit2gtk-4.1-dev build-essential curl wget file \
  libssl-dev libayatana-appindicator3-dev librsvg2-dev \
  libgtk-3-dev libsoup-3.0-dev libjavascriptcoregtk-4.1-dev
```

</details>

<details>
<summary><strong>Linux (Fedora)</strong></summary>

```bash
sudo dnf install -y \
  webkit2gtk4.1-devel openssl-devel curl wget file \
  libappindicator-gtk3-devel librsvg2-devel \
  gtk3-devel libsoup3-devel javascriptcoregtk4.1-devel
```

</details>

### Build & Run

```bash
# Development (hot reload)
npm run tauri dev

# Production build
npm run tauri build
# Output: src-tauri/target/release/bundle/
# Windows: .msi / .exe    Linux: .deb / .AppImage    macOS: .dmg
```

---

## Architecture

```
Frontend                Backend                  Storage
─────────               ───────                  ───────
React 19 + Vite 7       Tauri 2 (Rust)           SQLite per-character
TailwindCSS v4          rusqlite via IPC          campaigns.db
Framer Motion           warp + tokio WebSocket    wiki.db (FTS5)
React Router v7         UDP LAN presence          Local filesystem
```

- **Multiplayer:** WebSocket on port 7878 for real-time DM↔Player sessions
- **Dev Sync:** UDP broadcast on port 8799 for LAN dev presence
- **Rulesets:** Pluggable 5e-2014 / 5e-2024 via React Context
- **Auto-Save:** Debounced 800ms with backup every 5 minutes

---

<div align="center">

*Built with [Claude Code](https://claude.ai/claude-code)*

</div>

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,12,20&height=100&section=footer"/>
