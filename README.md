# The Codex — D&D Companion App

**Current Version: V0.8.6**

A native desktop application for managing D&D 5e characters with full ruleset support, a 2,000+ article encyclopedia, real-time multiplayer sessions, Player/DM modes, and everything you need to play — no account, no internet, no subscriptions. Built with React + Tauri 2 (Rust).

## Features

### Player/DM Mode System
- **Mode Selection** — choose Player or DM mode on launch with animated role picker
- **DM Campaign Engine** — create campaigns, manage scenes, run live sessions with WebSocket multiplayer sync
- **Campaign Type System** — choose Homebrew or Premade on creation; sidebar filters tools accordingly
- **Campaign Export/Import/Archive** — download campaigns as JSON, import them back, or soft-archive without deleting
- **DM Lobby** — campaign HQ with scenes, session recap, handouts, quest generator, player connections
- **DM Live Session** — initiative tracker, round manager, action log, chat, timer, scene management
- **Player Join Flow** — enter DM IP + room code, select character, wait for approval
- **Player Session View** — see active scene, initiative, chat, roll dice, receive handouts, take actions
- **D&D Beyond Import** — multi-step import wizard for D&D Beyond JSON character exports

### V4 Campaign Engine (DM↔Player Sync)
- **Accurate Multiplayer Rolls** — player prompts auto-detect proficiency, expertise, ability modifiers, and item bonuses from character snapshot
- **Full Data Sync** — conditions, HP, rest, loot, XP, spell slots, and 22+ event types synced between DM and players in real-time
- **Player Combat HUD** — tabbed interface with Attack, Spell, Items, and Features tabs during combat turns
- **Death Save System** — dramatic d20 roll overlay with nat 1/nat 20 handling, 3 success/failure tracking
- **Concentration Tracking** — auto-sends CON save on damage to concentrating player, auto-drops on fail
- **Shared Combat Log** — all players see attacks, damage, kills, and spell casts in real-time feed
- **Turn Notifications** — audio chime, window title flash, gold banner when it's your turn
- **Equipment Selection** — players choose weapons/armor before combat starts
- **Expanded Snapshots** — equipped weapons, spell slots, features, currency, death saves, and more synced to DM

### NPC Intelligence & Decision Engines
- **Personality Archetypes** — 8 archetypes (Schemer, Guardian, Merchant, Zealot, Outcast, Sage, Trickster, Noble) with auto-populated traits
- **34 Personality Traits** — toggle traits that shape NPC behavior predictions
- **Trust System** — -100 to +100 trust score with 7 labeled tiers (Sworn Enemy to Unbreakable Bond)
- **NPC Memory** — memories with intensity, decay rate, and emotional impact; traumatic memories never fade
- **Behavior Prediction** — live preview of how NPCs respond to 7 situation types based on personality
- **Combat AI** — intelligence-tiered tactics (Mindless to Genius) with 6 personality combat styles
- **Monster AI Profiles** — 7 behavior profiles (Pack, Ambush, Territorial, Mindless, Intelligent, Swarm, Boss)
- **Boss Phase System** — 3 HP-based phases with escalating abilities and tactics
- **Consequence Engine** — action-to-consequence templates with DM approval workflow
- **Dynamic Merchant Pricing** — location, trust, faction, demand, and economy modifiers with haggling system
- **NPC Form Overhaul** — 3-tab NPC editor (Basics, Intelligence & Behavior, Combat) in campaign builder

### Story & Narrative Systems
- **Story Threads** — plotlines with states (Dormant, Discovered, Investigating, Confrontation, Resolved)
- **Story Branches** — decision points with branching outcomes and consequence tracking
- **Villain Profiles** — phase-based villain behavior, adaptations that counter party tactics, master plans
- **Campaign Arcs** — high-level narrative arcs linking quests, NPCs, and story threads
- **Campaign History Archive** — unified event log with category filtering, session grouping, and bookmarking
- **Campaign Secrets** — secret tracking with reveal conditions, known-by lists, and narrative impact ratings

### Advanced World Systems
- **Investigation Clues** — clue networks with red herrings, discovery DCs, and mystery grouping
- **Rumor Propagation** — rumors that spread, distort over time, and expire
- **World Crises** — escalating crises with severity levels and resolution conditions
- **Artifact Evolution** — sentient items that level up, gain abilities, and develop personality
- **Difficulty Scaling** — real-time combat assessment with DM suggestions when encounters are too easy/hard
- **Skill Check Resolver** — full skill check engine with proficiency, expertise, conditions, and advantage
- **Faction System** — faction relations, party reputation, military/wealth/influence tracking
- **Weather & Economy** — regional weather effects and dynamic economy with trade goods

### DM Session Tools
- **Character Arc Manager** — track character arcs (hooks, development, complications, climax, resolution)
- **Handouts Manager** — create and reveal handouts to players with visibility toggle
- **Monster Panel** — search SRD monsters, add to encounter, track HP/damage/conditions
- **Quest Generator** — AI-powered quest generation via Ollama (party level, setting, theme)
- **Session Recap** — AI-powered session summary generator + auto-generated recap from action log
- **World State Manager** — track world state by category (politics, geography, events, factions)
- **DM Name Display** — DM name collected on campaign creation, shown to joining players
- **Cover System** — half/three-quarter/full cover toggles per combatant with AC modifiers
- **Mood/Music Sync** — 7 scene moods + 9 ambient sounds synced to players with visual overlays
- **Consequence System** — one-click damage, conditions, item/gold loss on failed checks
- **Travel Calculator** — distance, speed, terrain inputs with encounter rolls per travel day
- **Random Encounter** — quick-start mid-scene encounters with monster picker
- **Legendary & Lair Actions** — pip tracking and lair action reminders for boss fights

### Character Sheet
- **Accurate Dice Modifiers** — all rolls include ability modifiers, proficiency, expertise, item stat bonuses, save bonuses, and condition effects per 5e RAW
- **Advantage/Disadvantage** — full support including 5e cancellation rule (both = normal roll)
- **Item Bonuses in Rolls** — equipped items with stat modifiers (e.g., Belt of Giant Strength +2 STR) auto-apply to all related rolls
- **Save Bonuses** — items like Cloak of Protection auto-add to all saving throws with "(+N from items)" indicator
- **Magic Item Properties** — weapons/armor track magic bonus (+1/+2/+3), extra damage dice, save bonuses, and special properties
- **HP Undo** — 10-second undo window after applying damage or healing to reverse accidental changes
- **Dice Rolling on Stats** — hover any ability score, saving throw, or skill to reveal dice icon; click to roll
- **Floating Dice Roller** — accessible from any page via floating button (bottom-right), no longer a sidebar section
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
- **Starting Equipment** — auto-adds class-appropriate gear and starting gold to inventory on character creation
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
- **Animated Dice** — tumbling animation on roll, d6 pip faces, shake-on-hover buttons
- **Particle Effects** — gold sparkle burst on nat 20, red shatter on nat 1
- **Saved Roll Macros** — save up to 20 frequently used rolls, one-click re-roll
- Quick-roll buttons (d4–d100), custom expressions, advantage/disadvantage
- Roll labels, persistent history, 4d6kh3 stat roller, statistics panel

### NPCs
- **Quick-Create Templates** — 6 archetype presets (Tavern Keeper, Wise Sage, Shady Merchant, etc.)
- **Random Name Generator** — one-click fantasy name picker from 26 names
- **Race & Class Dropdowns** — autocomplete suggestions for 16 races and 20 classes/occupations
- **Relationship Tracker** — Friendly/Neutral/Hostile/Rival/Patron/Unknown with colored badges
- **Quest Hooks** — optional quest hook field with scroll icon
- Role-colored avatars with initials, status tracking, descriptions, notes, locations

### Quests
- **Quick Templates** — 8 presets (Bounty Hunt, Rescue Mission, Dungeon Delve, Investigation, etc.) with pre-filled objectives
- **Suggested Objectives** — clickable chips for common quest objectives
- **Reward Tracking** — XP, Gold, Item rewards with icons and active-quest totals
- **Quest Giver & Location** — displayed with user/map-pin icons
- **Priority System** — Low/Medium/High/Critical with color-coded indicators
- Objectives with progress bars, difficulty ratings, failed quest section

### Inventory
- **Magic Item Properties** — track magic bonus (+1/+2/+3), extra damage dice, save bonuses, and special properties on weapons/armor/wondrous items
- **Currency Auto-Conversion** — consolidate all denominations to GP
- **Encumbrance Speed Penalties** — detailed penalty display below carry weight
- **Consumable Warnings** — red "LOW" indicator at quantity ≤ 3
- **Enter Key Submit** — press Enter to submit item forms quickly
- 40+ preloaded weapons/armor, currency tracking, attunement (max 3)

### Journal
- **Session Summary Stats** — entry count, session count, date range
- **NPC Mentions** — tag NPCs in entries, shown as blue badges
- **Pin Important Entries** — star toggle to pin entries to top
- Markdown editor, mood tagging, fullscreen reading mode, export to TXT

### Lore & World Notes
- **Quick Templates** — 6 structured note templates (Town/City, Dungeon, Faction, Legend/Myth, etc.) with markdown sections
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
- **Wiki-powered responses** — searches the 1,900+ article SRD encyclopedia before every query for accurate D&D 5e answers
- **Brief and focused** — answers in 1-3 sentences with token cap and low temperature
- **Floating ArcaneWidget** — context-aware mini-chat available on all sections, not just the AI tab
- **All communication through Rust backend** — bypasses WebKitGTK CSP restrictions on Linux
- Streaming responses with real-time token display via Tauri Channel API
- Completely optional — disabled by default, zero performance impact when off
- Uses phi3.5 model (~2.2GB) — auto-downloads when AI is enabled

### Dev Tools (Ctrl+Shift+D)
- **DB Inspector** — browse tables, run raw SQL queries
- **Git Panel** — status, stage, commit, push, pull, diff, branch info, stash, session summary
- **LAN Dev Chat** — real-time messaging between devs on the same network via UDP broadcast
- **IPC Logger** — monitor all Tauri invoke calls with timing
- **Environment Check** — verify system dependencies and config
- **Schema Migration Runner** — run DB migrations from the panel
- **Feature Flags** — 7 toggleable dev flags
- **Performance Overlay** — FPS and render timing
- **Log Viewer** — frontend error log stream
- **Bug Report Generator** — collect system info, logs, and DB state into a report
- **Test Character Generator** — create pre-filled characters for testing

### Battle Map
- **Interactive Tactical Grid** — grid-based map with token placement, conditions, and environmental drawing tools

### Calendar (Harptos)
- **Fantasy Calendar** — full Forgotten Realms Harptos calendar with festivals, seasons, and day/year tracking

### Downtime Activities
- **Activity Tracker** — crafting, training, research, business operations, and carousing with skill checks and gold tracking

### Encounter Builder
- **Balanced Encounters** — design encounters by CR, party level, and difficulty using XP thresholds and monster stat tables

### Homebrew Builder
- **Custom Content** — create and manage custom monsters, spells, and magic items with full stat blocks and validation

### Party Analyzer
- **Composition Analysis** — analyze party roles, abilities, darkvision, AC, HP, and encounter difficulty recommendations

### Party Loot
- **Shared Treasure** — track party gold, distribute coins/items, rarity sorting, and audit log

### Soundboard
- **Procedural Ambient Audio** — Web Audio API ambient channels: tavern, combat, forest, dungeon, storm, ocean, camp, and city

### Feature Request
- **In-App Feedback** — submit structured feature requests with category, title, description, and auto-generated request IDs

### Session Monitor (Background Error Reporter)
- **Automatic crash reporting** — captures uncaught errors, promise rejections, and console errors in the background
- **Batched GitHub uploads** — errors queued and submitted as GitHub Issues every 5 minutes
- **Rate-limited & deduplicated** — max 1 auto-report per 10 minutes, identical errors merged
- **Session context** — reports include app version, OS, screen size, stack traces, and timestamps

### In-Character Chat
- **Floating Chat Panel** — IC and OOC modes with class-colored names
- **/roll Command** — type `/roll 2d6+3` inline to roll and share results
- **Persistent History** — last 50 messages saved per room in localStorage

### Keyboard Shortcuts
- **Section Navigation** — Ctrl+1 through Ctrl+9 for quick section switching
- **Quick Actions** — Ctrl+R (quick roll d20), Ctrl+K (search sections), Ctrl+D (dice), Ctrl+S (save)
- **Shortcuts Help** — press `?` to see all available shortcuts
- **Sidebar Hints** — shortcut labels shown next to each section name

### Combat Stats Dashboard
- **Session Statistics** — damage dealt/taken, hit rate %, critical hits, kills, healing done
- **Highest Damage** — tracks your biggest single hit
- **Session Duration** — elapsed time since session start

### PDF & Print Export
- **PDF Character Export** — generates a print-ready character sheet in a new window
- **Print Stylesheet** — clean black & white print layout, hides UI chrome
- **Text Export** — plain text character sheet for clipboard

### Mobile & Responsive
- **Touch-Friendly** — 44px minimum touch targets, no sticky hover states
- **Responsive Breakpoints** — layouts adapt at 768px and 480px
- **Full-Screen Modals** — modals fill screen on mobile devices

### Additional Features
- Arcane Encyclopedia — 2,000+ article searchable wiki with FTS5, grid/list views, keyboard shortcuts, cross-ref hover previews, drop cap typography
- Community Campaigns — browse and import adventures from the 5etools homebrew repository with quest count and estimated completion time
- Party Connect — LAN sync with room codes, auto-reconnect, DM party stats overview, persistent connection across navigation
- In-Character Chat — floating IC/OOC chat with /roll commands and class-colored names
- Offline Action Queue — queues actions when disconnected, replays on reconnect
- Exhaustion Auto-Effects — levels 1-6 with auto-applied penalties and warning banners
- Grapple & Shove — special combat actions with contested Athletics checks
- Cover System — half/three-quarter/full cover with AC modifiers synced to players
- Mood & Music Sync — DM sets scene mood with colored vignette overlays and ambient audio for players
- Session Crash Recovery — periodic session snapshots with recovery banner on reconnect
- Auto-Encumbrance Warnings — weight checks after adding items
- Smart Loot Tables — CR-based treasure generation for encounters
- Quick NPC Generator — random name, race, occupation, and personality traits
- Auto-Populate Character Stats — one-click fill of HP, saves, speed from class and race
- Multiclass Support — editable secondary class with combined spell slot computation
- LAN Dev Presence — UDP broadcast peer discovery with version-aware sync
- Update Detection — checks for updates on launch, banner with one-click "UPDATE NOW" and reload
- Rest Mechanics (Long/Short Rest with proper D&D rules, Warlock short rest slot recovery)
- Level-Up System with animated overlay, class-specific gains, and auto-detection
- Frontend error logging — console errors, unhandled exceptions, and promise rejections captured to log file
- 6 UI Themes, font/density controls, auto-save, auto-backup, crash recovery
- Beginner Tutorial Wizard, contextual help tooltips

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
- Before every query, the app searches its 1,900+ article wiki for relevant D&D 5e content and includes it in the prompt
- Responses are capped at 128 tokens with low temperature (0.3) for brief, accurate answers
- A floating chat widget (ArcaneWidget) is available on all sections for quick questions

### Performance Note
On CPU-only hardware (no dedicated GPU), expect response times of 5–15 seconds.
This is normal. The assistant runs fully offline — no data leaves your machine.

### Privacy
All conversation data stays on your machine. Nothing is sent to any external service.
The assistant uses the app's built-in wiki for D&D 5e reference.

## Requirements

| Dependency | Version | Notes |
|---|---|---|
| **Node.js** | 18+ (LTS recommended) | [nodejs.org](https://nodejs.org/) |
| **Rust** | stable (latest) | [rustup.rs](https://rustup.rs/) |
| **Cargo** | comes with Rust | Package manager for Rust |

### Windows Additional
- **VS Build Tools** — "Desktop development with C++" workload ([Download](https://visualstudio.microsoft.com/visual-cpp-build-tools/))
- **WebView2** — pre-installed on Windows 10/11 ([Microsoft](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) if missing)

### Linux Additional (Ubuntu/Debian)
```bash
sudo apt update && sudo apt install -y \
  libwebkit2gtk-4.1-dev build-essential curl wget file \
  libssl-dev libayatana-appindicator3-dev librsvg2-dev \
  libgtk-3-dev libsoup-3.0-dev libjavascriptcoregtk-4.1-dev
```

### Linux Additional (Fedora)
```bash
sudo dnf install -y \
  webkit2gtk4.1-devel openssl-devel curl wget file \
  libappindicator-gtk3-devel librsvg2-devel \
  gtk3-devel libsoup3-devel javascriptcoregtk4.1-devel
```

## Installation

### Quick Start (All Platforms)

```bash
git clone https://github.com/nisakson2000/dnd-tracker.git
cd dnd-tracker
npm install
cd frontend && npm install && cd ..
npm run tauri dev
```

### Windows Step-by-Step

1. **Install Node.js** — [nodejs.org](https://nodejs.org/) (LTS, 18+)
2. **Install Rust** — `winget install Rustlang.Rustup` or [rustup.rs](https://rustup.rs/)
3. **Install VS Build Tools** — [Download](https://visualstudio.microsoft.com/visual-cpp-build-tools/), check "Desktop development with C++"
4. **Clone and install:**
   ```powershell
   git clone https://github.com/nisakson2000/dnd-tracker.git
   cd dnd-tracker
   npm install
   cd frontend && npm install && cd ..
   ```
5. **Run:** `npm run tauri dev`

### Linux (Ubuntu/Debian)

1. **System dependencies:**
   ```bash
   sudo apt update && sudo apt install -y \
     libwebkit2gtk-4.1-dev build-essential curl wget file \
     libssl-dev libayatana-appindicator3-dev librsvg2-dev \
     libgtk-3-dev libsoup-3.0-dev libjavascriptcoregtk-4.1-dev
   ```
2. **Node.js 18+:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
3. **Rust:**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source "$HOME/.cargo/env"
   ```
4. **Clone and install:**
   ```bash
   git clone https://github.com/nisakson2000/dnd-tracker.git
   cd dnd-tracker && npm install && cd frontend && npm install && cd ..
   ```
5. **Run:** `npm run tauri dev`

### Linux (Fedora)

1. **System dependencies:**
   ```bash
   sudo dnf install -y \
     webkit2gtk4.1-devel openssl-devel curl wget file \
     libappindicator-gtk3-devel librsvg2-devel \
     gtk3-devel libsoup3-devel javascriptcoregtk4.1-devel
   ```
2. **Node.js 18+:**
   ```bash
   sudo dnf install -y nodejs
   ```
3. **Rust:**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source "$HOME/.cargo/env"
   ```
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
- Campaign database (campaigns.db) — scenes, encounters, monsters, handouts, character arcs, world state
- Shared wiki.db (2,000+ articles, FTS5 full-text search)
- Frontend: React 19 + Vite 7 + TailwindCSS v4 + Framer Motion
- Backend: Tauri 2 (Rust) + rusqlite via IPC commands
- WebSocket multiplayer sync (port 7878) for real-time DM↔Player sessions
- LAN Dev Sync: UDP broadcast presence + chat on port 8799
- Pluggable rulesets (5e-2014 / 5e-2024) via React Context
- Auto-save (debounced 800ms), auto-backup every 5 minutes

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, TailwindCSS v4, Framer Motion |
| Backend | Tauri 2 (Rust), rusqlite, warp, tokio |
| Database | SQLite (per-character) + campaigns.db + wiki.db (FTS5) |
| Networking | WebSocket multiplayer sessions (warp), LAN party sync, UDP dev presence |
| AI (optional) | Ollama (phi3.5), reqwest streaming |
