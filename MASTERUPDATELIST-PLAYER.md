# The Codex — Player Mode Update List

All updates relevant to **Player Mode**. For DM-specific changes, see `MASTERUPDATELIST-DM.md`. For the complete combined history, see `MASTERUPDATELIST.md`.

---

## V0.5.9 — Player Combat HUD, Automation & Polish
**Released:** March 13, 2026

### Player Combat HUD
- Full tabbed combat interface — Attack, Spell, Items, Features tabs during your turn
- Attack tab — equipped weapons with attack bonus + damage dice, Extra Attack support, crit detection
- Spell tab — prepared spells grouped by level, slot tracking, upcast selector, concentration enforcement
- Items tab — use consumable items (potions auto-heal, scrolls cast spells, quantity decrements)
- Features tab — class resource tracking (Ki, Rage, Bardic Inspiration, etc.) with use/spend buttons
- Action economy bar — Action, Bonus Action, Reaction toggles that reset each turn
- End Turn button — signals DM to advance initiative
- Grapple & shove — special combat actions with contested Athletics checks
- Exhaustion auto-effects — levels 1-6 with auto penalties and warning banners

### Player Session Experience
- Turn notifications — audio chime, window title flash, gold banner when it's your turn
- Death saves — dramatic d20 roll overlay with nat 1 (2 failures) and nat 20 (stabilize + 1 HP)
- Concentration tracking — active concentration spell shown, auto-dropped on failed CON save
- Shared combat log — see all attacks, damage, kills, spell casts from other players
- Equipment selection — choose weapons/armor before combat starts
- Reaction prompts — Opportunity Attack, Counterspell, Shield with 5-second countdown
- Player-to-player healing — healers target allies, HP auto-applies
- Cover indicator — see when DM applies cover bonuses to your AC
- Monster HP tiers — see "Healthy/Bloodied/Critical" instead of exact numbers
- Loot persistence — accepted loot writes items and gold to your inventory
- XP notifications — see XP awards with level-up prompt when threshold crossed
- Rest sync — HP, spell slots, features auto-reset when DM triggers rest
- Warlock short rest spell slot recovery
- Inspiration — DM grants, spend for advantage on next roll
- Quest journal — floating journal panel for tracking quests and NPCs during play
- Mood overlay — colored vignette and ambient audio matching DM's scene mood
- DM name & campaign name shown on session join

### Dice Roller
- Animated dice — tumbling animation on roll, d6 pip faces, shake-on-hover buttons
- Particle effects — gold sparkle burst on nat 20, red shatter on nat 1
- Idle rocking animation on floating dice button

### New Features
- Keyboard shortcuts — Ctrl+1-9 for sections, Ctrl+R quick roll, `?` for help overlay
- In-character chat — floating panel with IC/OOC modes, /roll commands, class-colored names
- Combat stats dashboard — damage dealt/taken, hit rate %, crits, kills, healing
- PDF character export — generates print-ready character sheet
- Print-friendly stylesheet — clean B&W print layout
- Offline action queue — queues actions when disconnected, replays on reconnect
- Mobile responsive CSS — touch-friendly breakpoints at 768px/480px
- Auto-populate character stats — one-click fill from class/race
- Multiclass support — editable secondary class
- Auto-encumbrance warnings — weight checks after adding items
- Consumable use system — potions auto-heal, attunement limit (max 3)
- Community campaigns show quest count + estimated completion time
- Player presence indicators — green/yellow/red connection status dots
- Session crash recovery — periodic snapshots with recovery banner
- Condition auto-effects — advantage/disadvantage applied based on active conditions

---

## V0.5.0 — Multiplayer Campaign Engine & Party Tools
**Released:** March 13, 2026

### Player Session (Multiplayer)
- **Player Join Flow** — enter DM's IP + room code, select character, wait for DM approval
- **Player Session View** — see active scene, initiative order, chat, roll dice, receive handouts, submit actions

### D&D Beyond Import
- **DDBImportModal** — multi-step import wizard for D&D Beyond JSON character exports
- Import button available on Dashboard empty state and character view

### New Sections (9)
- **Battle Map** — interactive grid-based tactical map with tokens, conditions, and drawing tools
- **Calendar (Harptos)** — full Forgotten Realms calendar with festivals, seasons, and day/year tracking
- **Downtime Activities** — crafting, training, research, business operations with skill checks and gold tracking
- **Encounter Builder** — design balanced encounters by CR, party level, and difficulty
- **Feature Request** — submit structured in-app feature requests with auto-generated IDs
- **Homebrew Builder** — create custom monsters, spells, and magic items with full stat blocks
- **Party Analyzer** — analyze party composition, roles, abilities, and encounter difficulty
- **Party Loot** — track shared treasure, distribute coins/items, rarity sorting, audit log
- **Soundboard** — procedural ambient audio: tavern, combat, forest, dungeon, storm, ocean, camp, city

### Sidebar
- New sections added: Downtime, Party Loot, Homebrew Builder, Calendar, Party Analyzer, Soundboard, Feature Request

---

## V0.1.5 BETA — Update System Overhaul, Campaign Map Fix, Dev Tools Cleanup
**Released:** March 12, 2026

### Update System
- Removed auto-update polling — updates now check once on app launch
- New manual download flow: version comparison badges, download → patching → complete phases
- Polished update UI with progress bar, spinner, and phase transitions

### Campaign Map
- Fixed black screen when clicking character (CampaignMap missing from SECTIONS registry)

### Updates Page
- Dashboard bell now navigates to dedicated `/updates` route instead of last-selected character

### Sidebar
- Removed Developer section from sidebar (accessible only via Ctrl+Shift+D wrench icon)

### Changelog
- Fixed version mismatch — "What's New" now correctly shows entries for the running version

---

## V0.4.3 — Wiki Phase 7: NPCs, Adventures, Edition History & DM Reference
**Released:** March 12, 2026

### Arcane Encyclopedia — 2,000+ Articles Milestone!
- **70 new articles** — total now **2,018** (up from 1,950)
- **1,204 cross-references** linking articles across categories
- Notable NPCs & Villains (30), Famous Adventures (20), Edition History & Adaptation Guides (10)

---

## V0.4.2 — Wiki 5e 2024 Edition Rules
**Released:** March 12, 2026

### Arcane Encyclopedia — 5e 2024 Rules Update
- **38 new articles** — total now 1,950 (up from 1,912)
- Complete coverage of all 5e 2024 PHB changes vs 2014
- All 12 class revisions, combat changes, Weapon Mastery, feat system overhaul
- 8 Origin Feats, 5 Epic Boons, 2024 Backgrounds overview, Heroic Inspiration

---

## V0.4.1 — Wiki Homebrew, Cross-Edition & Settings Expansion
**Released:** March 12, 2026

### Arcane Encyclopedia
- **58 new articles** — 19 homebrew rules, 30 cross-edition creatures, 9 new campaign settings

---

## V0.4.0 — Wiki Deities & Pantheons Expansion
**Released:** March 12, 2026

### Arcane Encyclopedia
- **175 new deity articles** — complete coverage of all major D&D pantheons (Forgotten Realms, Dragonlance, Eberron, Elven, Dwarven, and more)

---

## V0.3.9 — Wiki Magic Items & Equipment Expansion
**Released:** March 12, 2026

### Arcane Encyclopedia
- **302 new wiki articles** — 206 magic items by rarity, 103 equipment entries (mounts, vehicles, gear, trade goods)

---

## V0.3.8 — Wiki Races & Subclasses Expansion
**Released:** March 12, 2026

### Arcane Encyclopedia
- **154 new articles** — 48 new playable races/species, 106 new subclasses covering all 12 classes

---

## V0.3.5 — Wiki Bestiary Expansion
**Released:** March 12, 2026

### Arcane Encyclopedia
- **266 new monster entries** — full SRD 5.1 bestiary, CR 0 through CR 30
- All 10 chromatic & metallic dragon age chains, legendary creatures

---

## V0.3.3 — Arcane Advisor Overhaul
**Released:** March 12, 2026

### Arcane Advisor (AI)
- Rust-side Ollama proxy — all AI communication routed through backend (fixes Linux/WebKitGTK)
- Wiki-powered responses — searches 964+ articles before every query
- Single hardcoded model (phi3.5), auto-download on enable
- Token cap (128) and low temperature (0.3) for brief, accurate answers
- Floating ArcaneWidget available on all sections

---

## V0.3.1 — Party Connect Overhaul
**Released:** March 11, 2026

### Party Connect
- Moved to sidebar as its own section under Tools
- Persistent WebSocket connection — navigating sections no longer kills the connection
- Stale snapshot fix, race condition guard, sendUpdate keeps snapshot fresh

---

## V0.3.0 — Arcane Advisor (AI Assistant)
**Released:** March 12, 2026

### Arcane Advisor
- AI-powered D&D companion running locally via Ollama — no internet required
- Context-aware conversations with full character data
- Streaming responses, markdown rendering, conversation history
- Settings integration with enable/disable toggle and setup guide

---

## V0.2.9 — Import Character & Error Logging
**Released:** March 12, 2026

### Dashboard
- **Import Existing Character** — import a previously exported JSON character file as a new entry

---

## V0.2.8 — The Big 50: Comprehensive Feature & QOL Overhaul
**Released:** March 11, 2026

### Character Sheet
- Death Saving Throw UI, Proficiency Bonus display, Passive Skills, Initiative Modifier
- AC Breakdown tooltip, Concentration Save helper, Encumbrance Speed warning

### Combat
- Full Initiative Round Manager, Action Economy Tracker, Enhanced Crit Detection
- Flanking Bonus toggle, Combat Log (50 entries, color-coded)

### Spellbook
- Ritual Casting badges, Always-Prepared Spells, Cantrip Scaling display, Material Component Costs

### Dice Roller
- Saved Roll Macros (up to 20), Enhanced Crit visuals

### Inventory
- Currency Auto-Conversion, Encumbrance Speed Penalties, Consumable Warnings

### Features & Traits
- Rest-Based Restore, Category Summary, Low Charges Warning

### NPCs
- Relationship Tracker, Quest Hooks, Role-colored avatars

### Quests
- Reward Tracking (XP, Gold, Items), Quest Giver & Location, Priority System

### Journal
- Session Summary Stats, NPC Mentions, Pin Important Entries

### Lore & World Notes
- Category Presets, Related Entries, Entry Type Icons

### Sidebar
- Pinned Sections (up to 5), Section Search

### Dashboard
- Character Duplicate, Quick Stats Bar, Character Search

---

## V0.2.7 — Player/DM Mode System & Character Setup
**Released:** March 11, 2026

### Player Mode
- Mode Select screen with animated role picker
- Character Setup wizard (Ability Scores, Background, Skills, Review)
- Point Buy / Standard Array / Roll 4d6 drop lowest

---

## V0.2.6 — Security, Stability & Bug Fixes
**Released:** March 11, 2026

- XSS vulnerability fixed in WikiPage
- React Error Boundaries per section
- Expertise calculation fix, autosave retry, null safety pass

---

## V0.2.5 — Combat, Spellbook, Journal & Section Upgrades
**Released:** March 11, 2026

- Combat: resistance/vulnerability toggles, reaction tracker, temp HP bar, legendary actions
- Spellbook: V/S/M badges, range/duration display, cantrip separation, spell level filter
- Journal: export to text, mood tagging, fullscreen reading mode
- Features: recharge display, source level badge, compact usage pill
- NPCs: role-colored borders, markdown notes, duplicate button
- Quests: difficulty ratings, markdown notes, failed quest section
- Inventory: item rarity colors, low stock warnings
- Dice Roller: 4d6 stat roller, copy history, statistics panel

---

## V0.2.4 — QOL Overhaul: Performance, Accessibility & Bug Reporter
**Released:** March 11, 2026

- Sorting added to 5 sections, search added to 7 sections
- Input validation, toast notifications, empty state cards
- Keyboard navigation, ARIA labels, screen reader support
- Memoization pass, bundle reduced 33%, SQLite tuning

---

## V0.2.3 — Roll Buttons, Concentration, Uses, XP & More
**Released:** March 10, 2026

- Attack Roll Buttons, Dice Roll Labels, Dice History Persistence
- XP Progress Bar, Concentration Tracking, Feature Uses/Charges
- Multiclass Display, NPC Role Avatars, Condition Duration Timers

---

## V0.2.2 — Automatic Condition Effects & Bug Fixes
**Released:** March 10, 2026

- Active conditions auto-apply mechanical effects (speed, saves, attacks)
- Condition effects banner in Overview, AUTO-FAIL/DIS badges on saving throws
- Dice Roller auto-sets advantage/disadvantage based on conditions

---

## V0.2.1 — Connection Hardening & Stability
**Released:** March 10, 2026

- Party Connect: auto-reconnect, 8s timeout, host reassignment, zombie cleanup
- Auto-sync tracks name, race, class changes
- Fixed stale WebSocket closures, ping interval leak

---

## V0.2.0 — LAN Party & Auto-Updates
**Released:** March 10, 2026

- LAN Party Connect with IP + room code
- Midnight Glass V3 UI, 6 themes, font/density controls
- Subclass selection at appropriate class level

---

## V0.1.9 — UI Themes & Subclass Selection
**Released:** March 10, 2026

- Midnight Glass V3 glassmorphism redesign, 6 preset themes
- Custom accent color, UI scale slider, font/density controls
- Subclass selection prompt on level-up

---

## V0.1.8 — Character Creation & Auto-Backup
**Released:** March 10, 2026

- Expanded character creation (race, class, subclass)
- Race traits and class features by level
- Auto-backup every 5 minutes

---

## V0.1.7 — Party Connect Improvements
**Released:** March 2026

- Room codes, member cards, auto-sync stats, connection indicators

---

## V0.1.6 — Settings Reorganization
**Released:** March 2026

- Party Connect moved under Settings, theme customization improvements

---

## V0.1.5 — Tauri Migration
**Released:** February 20, 2026

- Migrated from Python/FastAPI to Tauri 2 (Rust backend)
- Frontend via Tauri IPC, bundled wiki.db, native installer

---

## V0.1.4 — Wiki & Rules Reference
**Released:** February 2026

- Arcane Encyclopedia (964 articles), Rules Reference section

---

## V0.1.3 — Campaign Tools
**Released:** February 2026

- Campaign Journal, Quest Tracker, NPC Tracker, Lore & World Notes

---

## V0.1.2 — Combat & Spellbook
**Released:** January 2026

- Combat with 15 conditions, action economy, attack tracking
- Spellbook with slot tracking, Warlock Pact Magic

---

## V0.1.1 — Inventory & Features
**Released:** January 2026

- Inventory (40+ items), currency tracker, encumbrance, attunement
- Features & Traits, Dice Roller

---

## V0.1.0 — Initial Release
**Released:** January 15, 2026

- Full character sheet, spellbook, inventory, combat tracker
- Campaign journal, quest tracker, NPC tracker, lore notes
- Arcane Encyclopedia (964 articles), Party Connect, Dice Roller
- Level-up system, 5 UI themes
