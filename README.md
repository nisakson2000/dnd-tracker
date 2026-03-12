# The Codex — D&D Companion App

**Current Version: V0.3.8**

A native desktop application for managing D&D 5e characters with full ruleset support, a 1,680+ article encyclopedia, real-time party sync, Player/DM modes, and everything you need to play — no account, no internet, no subscriptions. Built with React + Tauri 2 (Rust).

## Features

### Player/DM Mode System
- **Mode Selection** — choose Player or DM mode on launch with animated role picker
- **DM Campaign Hub** — dedicated overview with session/NPC/quest/lore stats and quick-start actions
- **DM Quick Reference** — DC guidelines, damage by level, cover, lighting, travel pace
- **Encounter Difficulty Calculator** — XP thresholds by party size and level
- **Session Planning Checklist** — prep items with checkboxes
- **Campaign creation** — DMs create campaigns (not characters) with simplified flow

### Character Sheet
- Ability Scores, Saving Throws, Skills (proficiency + expertise), HP tracking with color-coded bar
- **Death Saving Throw UI** — visual tracker with 3 success/3 failure clickable circles
- **Proficiency Bonus Display** — prominent gold-accented card
- **Passive Skills** — Perception, Investigation, Insight (10 + skill mod)
- **Initiative Modifier** — DEX mod shown with breakdown tooltip
- **AC Breakdown** — hover to see base 10 + DEX mod calculation
- **Concentration Save Helper** — auto-reminds DC when HP drops while concentrating
- **Encumbrance Speed Warning** — -10 ft / -20 ft badges on speed display
- Inspiration, Exhaustion (ruleset-aware: 6 or 10 levels), XP Progress Bar, Multiclass Display
- Automatic Condition Effects — active conditions auto-apply speed, save, and attack penalties

### Character Setup Wizard
- Guided post-creation setup: Ability Scores (Point Buy / Standard Array / Roll), Background, Auto-Apply, Skills, Review
- Supports both 5e-2014 and 5e-2024 rulesets

### Spellbook
- Spell Slot Tracking, Prepared Spells, Spellcasting Stats auto-calculated
- **Concentration Tracking** — click C badge to concentrate, warns on switch, CON save reminder
- **Ritual Casting** — prominent badge with tooltip, blue-tinted border on ritual spells
- **Always-Prepared Spells** — lock icon for domain/oath spells that can't be unprepared
- **Cantrip Scaling Display** — damage scaling tiers with current tier highlighted
- **Material Component Costs** — gold coin icon for expensive material components
- Third-Caster Support (Eldritch Knight, Arcane Trickster), Warlock Pact Magic

### Combat Tracker
- **Full Initiative Round Manager** — round counter, current turn highlighting, Next/Previous Turn
- **Action Economy Tracker** — Action, Bonus Action, Reaction checkboxes (reset each turn)
- **Attack Roll Buttons** — instant d20 + bonus + damage with crit detection and gold/red animations
- **Flanking Toggle** — +2 to attack rolls when enabled
- **Combat Log** — auto-logs attacks, conditions, rounds; 50 entries, color-coded
- **Condition Duration Timers** — "Next Round" auto-decrements and auto-expires
- 15 D&D conditions with automatic mechanical effects

### Features & Traits
- **Uses/Charges Tracking** — visual charge circles with recharge types
- **Rest-Based Restore** — separate Short Rest / Long Rest restore with feature counts
- **Category Summary** — class features, racial traits, feats, and charges at a glance
- **Low Charges Warning** — amber pulsing border at 1 use remaining

### Dice Roller
- **Saved Roll Macros** — save up to 20 frequently used rolls, one-click re-roll
- **Enhanced Crit Visuals** — "CRITICAL HIT!" / "CRITICAL MISS!" with glow and shake
- Quick-roll buttons (d4–d100), custom expressions, advantage/disadvantage
- Roll labels, persistent history, 4d6kh3 stat roller, statistics panel

### NPCs
- **Relationship Tracker** — Friendly/Neutral/Hostile/Rival/Patron/Unknown with colored badges
- **Quest Hooks** — optional quest hook field with scroll icon
- Role-colored avatars with initials, status tracking, descriptions, notes, locations

### Quests
- **Reward Tracking** — XP, Gold, Item rewards with icons and active-quest totals
- **Quest Giver & Location** — displayed with user/map-pin icons
- **Priority System** — Low/Medium/High/Critical with color-coded indicators
- Objectives with progress bars, difficulty ratings, failed quest section

### Inventory
- **Currency Auto-Conversion** — consolidate all denominations to GP
- **Encumbrance Speed Penalties** — detailed penalty display below carry weight
- **Consumable Warnings** — red "LOW" indicator at quantity ≤ 3
- 40+ preloaded weapons/armor, currency tracking, attunement (max 3)

### Journal
- **Session Summary Stats** — entry count, session count, date range
- **NPC Mentions** — tag NPCs in entries, shown as blue badges
- **Pin Important Entries** — star toggle to pin entries to top
- Markdown editor, mood tagging, fullscreen reading mode, export to TXT

### Lore & World Notes
- **Category Presets** — Location, Faction, Deity, History, Magic, Creature, Item
- **Related Entries** — cross-references between lore entries
- **Entry Type Icons** — category-aware icons (MapPin, Users, Star, etc.)

### Sidebar & Navigation
- **Pinned Sections** — star up to 5 favorite sections to top of sidebar
- **Section Search** — filter sidebar sections by typing
- Mode-aware navigation (Player vs DM section groups)

### Dashboard
- **Import Existing Character** — import a previously exported JSON character file as a new entry from the Dashboard
- **Character Duplicate** — copy a character as a template
- **Quick Stats Bar** — total characters, average level, most played class
- **Character Search** — filter by name, race, or class

### Backstory
- **Portrait Upload** — drag-and-drop character portrait (PNG/JPEG/WebP/GIF, max 2 MB)
- Personality Traits, Bonds, Flaws, Ideals, Physical Description, Goals, Allies

### AI Assistant (Optional)
- **Arcane Advisor** — AI-powered D&D companion running entirely on your machine via Ollama
- **Wiki-powered responses** — searches the 1,350+ article SRD encyclopedia before every query for accurate D&D 5e answers
- **Brief and focused** — answers in 1-3 sentences with token cap and low temperature
- **Floating ArcaneWidget** — context-aware mini-chat available on all sections, not just the AI tab
- **All communication through Rust backend** — bypasses WebKitGTK CSP restrictions on Linux
- Streaming responses with real-time token display via Tauri Channel API
- Completely optional — disabled by default, zero performance impact when off
- Uses phi3.5 model (~2.2GB) — auto-downloads when AI is enabled

### Additional Features
- Arcane Encyclopedia — 1,350+ article searchable wiki with FTS5
- Party Connect — LAN sync with room codes, auto-reconnect, DM party stats overview, persistent connection across navigation
- Dev Build Banner — "DEV BUILD" indicator with live dev count, hidden in production
- GitHub Auto-Update — dev builds poll for new commits every 5s, one-click Pull & Reload with auto-stash, rebase fallback, instant peer push notifications
- Dev Tools Panel (Ctrl+Shift+D) — DB inspector, IPC logger, performance overlay, log viewer, environment check, schema migration runner, feature flags, enhanced bug reports, test character generator
- LAN Dev Presence — UDP broadcast peer discovery, version-aware, instant update push notifications between devs
- Rest Mechanics (Long/Short Rest with proper D&D rules)
- Level-Up System with animated overlay and class-specific gains
- Frontend error logging — console errors, unhandled exceptions, and promise rejections captured to log file
- 6 UI Themes, font/density controls, auto-save, auto-backup, crash recovery
- Beginner Tutorial Wizard, contextual help tooltips
- DevTools with Find Improvements audit (Player + DM mode-aware)

## AI Assistant (Optional)

The app includes an optional AI assistant that runs entirely on your machine.

### Requirements
- [Ollama](https://ollama.ai) installed and running
- At least 4GB of free RAM
- Model: phi3.5 (~2.2GB RAM) — auto-downloaded when you enable AI

### Setup
1. Install Ollama from https://ollama.ai
2. Start Ollama (it runs as a background service)
3. In the app, go to Settings → AI Assistant → Enable
4. The app will automatically download phi3.5 if not already installed

### How It Works
- All Ollama communication is routed through the Rust backend (required for Linux/WebKitGTK compatibility)
- Before every query, the app searches its 1,350+ article wiki for relevant D&D 5e content and includes it in the prompt
- Responses are capped at 128 tokens with low temperature (0.3) for brief, accurate answers
- A floating chat widget (ArcaneWidget) is available on all sections for quick questions

### Performance Note
On CPU-only hardware (no dedicated GPU), expect response times of 5–15 seconds.
This is normal. The assistant runs fully offline — no data leaves your machine.

### Privacy
All conversation data stays on your machine. Nothing is sent to any external service.
The assistant uses the app's built-in wiki for D&D 5e reference.

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

### V0.3.7 — Auto-Pull Updates
- Automatic pull and reload when a new commit is detected — no manual interaction needed
- Both devs get updates within seconds of a push, app reloads automatically
- Fixed trailing-space directory name bug that silently broke all git sync commands

### V0.3.6 — Dev Sync Diagnostics & UX Fixes
- Diagnostic logging in git update checker — prints local/remote SHA, fetch result, and update decision to terminal for debugging sync issues
- Mode selection always shown on app open — no longer persists player/dm choice across reloads
- Git polling reduced to 5s with visible error logging (was silent catch)
- Dev settings accessible from gear icon in dev banner (moved out of dashboard)

### V0.3.5 — Wiki Bestiary Expansion
- 266 new monster entries — full SRD 5.1 bestiary (total 1,235 wiki articles, 315 monsters)
- All 10 chromatic & metallic dragon age chains, complete CR 0–30 coverage
- 114 new cross-references, legendary creatures, corrected Incapacitated condition

### V0.3.4 — Dev Presence Reliability Fix
- Direct unicast to known peers — bypasses firewalls/routers that drop 255.255.255.255 broadcast
- Subnet-directed broadcast, faster 3s heartbeat, 20s peer timeout
- Instance UUID self-filter — prevents false filtering when machines share same hostname
- Presence diagnostics command for debugging peer detection issues
- Git polling reduced to 5s, pre-commit hook auto-updates README + MASTERUPDATELIST
- Dev Settings dashboard with 13 sections, "builds synced" indicator

### V0.3.3 — Arcane Advisor Overhaul
- All Ollama communication routed through Rust backend via reqwest + Tauri Channel streaming (fixes WebKitGTK CSP)
- Wiki-powered responses — searches SRD encyclopedia before every query for grounded D&D 5e answers
- Single hardcoded model (phi3.5) with auto-download on enable — no model selector, no Test Connection button
- Brief responses: 128 token cap, temperature 0.3, minimal system prompt, response cleaning
- Floating ArcaneWidget mini-chat available on all sections (CharacterView, Wiki pages)
- Removed action blocks (add spells/items via AI) — unreliable with small models

### V0.3.2 — Dev Sync System, Dev Tools Panel & Robust Auto-Update
- Instant LAN peer notifications on push via UDP broadcast + Tauri events
- Version-aware peer discovery, dev count in banner, unpushed commit indicator
- Dynamic repo detection, async git operations with timeouts, rebase fallback
- Dev Tools Panel (Ctrl+Shift+D): DB inspector, IPC logger, performance overlay, log viewer, schema migration, test character generator

### V0.3.1 — Party Connect Overhaul, Dev Build Banner & Auto-Update System
- Party Connect moved from Settings tab to its own sidebar section under Tools (both modes)
- Party session now persists across navigation — WebSocket connection lifted to React context
- Fixed stale character data on reconnect and concurrent WebSocket race conditions
- Dev Build Banner — purple "DEV BUILD" banner at top of screen in dev mode, hidden in production
- GitHub Auto-Update for dev builds — polls every 60s, shows commit message, one-click Pull & Reload
- Auto-stashes dirty working tree before pulling, pops after; handles main vs master branch
- Version sync across all config files

### V0.3.0 — Arcane Advisor (AI Assistant)
- Optional AI Assistant powered by local Ollama (phi3.5) — no internet, no API keys
- Wiki-powered: searches 1,350+ article SRD encyclopedia for accurate D&D 5e answers
- Streaming responses via Rust backend (Tauri Channel API)
- Feature flag: completely invisible when disabled, zero overhead
- Sidebar entry appears only when enabled

### V0.2.9 — Import Character & Error Logging
- Import Existing Character from Dashboard — file picker for exported JSON, creates new character entry
- Import option shown in both empty state and character grid
- Frontend error capture pipeline — console.error, unhandled exceptions, and promise rejections forwarded to Rust backend
- Errors logged to stderr (dev terminal) and `frontend.log` file with auto-truncation at 500KB

### V0.2.8 — The Big 50: Comprehensive Feature & QOL Overhaul
- 50 improvements across every section of the app
- Death Saves UI, Proficiency Bonus, Passive Skills, Initiative, AC Breakdown on Overview
- Full Initiative Round Manager, Action Economy Tracker, Combat Log, Flanking Toggle
- Saved Roll Macros, Enhanced Crit Visuals on Dice Roller
- Ritual/Always-Prepared/Cantrip Scaling/Material Costs on Spellbook
- Currency Conversion, Encumbrance Penalties on Inventory
- Rest-Based Restore, Category Summary, Low Charges Warning on Features
- NPC Relationships, Quest Hooks, Quest Rewards/Priority/Location/Giver
- Journal Pinning, NPC Mentions, Session Stats; Lore Presets, Related Entries, Type Icons
- Sidebar Pinned Sections + Search; Dashboard Duplicate, Stats Bar, Search
- DM Quick Reference, Encounter Calculator, Session Checklist, Party Stats Overview

### V0.2.7 — Player/DM Mode System & Character Setup
- Player/DM mode selection with persistent localStorage
- DM Beta Warning modal, Campaign Hub, DM-specific sidebar
- Campaign creation flow (DMs create campaigns, not characters)
- Character Setup wizard with ability scores, skills, auto-apply, review
- Find Improvements audit tab in DevTools (mode-aware)
- Fixed Character Setup save bug (nested overview data)

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
- Arcane Encyclopedia — 1,350+ article searchable wiki with SQLite FTS5
- Party Connect — LAN sync with room codes for real-time character sharing
- Dice roller with d4-d100, custom expressions, advantage/disadvantage, nat 20/1 detection
- Level-up system with animated overlay and class-specific stat gains
- 5 UI themes, beginner tutorial wizard, contextual help tooltips
