# The Codex — Master Update List

Complete version history from initial release to current. The in-app Updates tab shows the 8 most recent versions — this file contains everything.

---

## V0.3.9 — Wiki Magic Items & Equipment Expansion
**Released:** March 12, 2026

### Arcane Encyclopedia — Items & Equipment Update
- **302 new wiki articles** — total now 1,680 (up from 1,378)
- **206 new magic items** by rarity — total now 303 (up from 97)
- **103 new equipment entries** — mounts, vehicles, adventuring gear, trade goods
- **483 new cross-references** (943 total) — variant chains, spell links, class connections, equipment-to-magic-item links

### New Magic Items (by rarity)
- **Common** (3): Potion of Climbing, Spell Scroll (Cantrip), Spell Scroll (1st Level)
- **Uncommon** (50): Ammunition +1, Bag of Tricks, Bracers of Archery, Brooch of Shielding, Circlet of Blasting, Decanter of Endless Water, Dust of Disappearance, Elemental Gem, Eversmoking Bottle, Javelin of Lightning, Medallion of Thoughts, Pipes of Haunting, Ring of Jumping, Ring of Mind Shielding, Slippers of Spider Climbing, Wand of Web, and more
- **Rare** (74): All Figurines of Wondrous Power, Feather Tokens, Ioun Stones (Awareness/Protection/Reserve/Sustenance), Belt of Dwarvenkind, Berserker Axe, Dagger of Venom, Elven Chain, Glamoured Studded Leather, Helm of Teleportation, Horn of Blasting, Instant Fortress, Mace of Smiting, Wand of Wonder, Wings of Flying, and more
- **Very Rare** (46): All Tomes & Manuals, Arrow of Slaying, Candle of Invocation, Demon Armor, Efreeti Bottle, Mirror of Life Trapping, Nine Lives Stealer, Ring of Shooting Stars, Robe of Stars, Staff of Frost, Staff of Thunder and Lightning, Sword of Sharpness, and more
- **Legendary** (25): Apparatus of the Crab, Armor of Invulnerability, Belt of Giant Strength (Storm), Crystal Ball variants, Cubic Gate, Defender, Hammer of Thunderbolts, Iron Flask, Ring of Djinni Summoning, Ring of Elemental Command, Robe of the Archmagi, Scarab of Protection, Well of Many Worlds, and more
- **Artifacts** (8): Axe of the Dwarvish Lords, Book of Exalted Deeds, Book of Vile Darkness, Eye of Vecna, Hand of Vecna, Orb of Dragonkind, Sword of Kas, Wand of Orcus

### New Equipment
- **Adventuring Gear** (52): Ball bearings, caltrops, chalk, climber's kit, fishing tackle, hunting trap, manacles, spyglass, and more
- **Mounts & Vehicles** (22): Camel, elephant, warhorse, carriage, galley, longship, warship, barding, saddles
- **Trade Goods** (11): Wheat, flour, salt, iron, silver, gold, platinum by weight
- **Special Materials** (4): Silvered weapons/ammunition rules, adamantine weapon/armor crafting

### Version Sync
- All version files bumped to 0.3.9: VERSION, version.json, version.js, package.json (root + frontend), tauri.conf.json, Cargo.toml

---

## V0.3.8 — Wiki Races & Subclasses Expansion
**Released:** March 12, 2026

### Arcane Encyclopedia — Character Options Update
- **154 new wiki articles** — total now 1,378 (up from 1,235)
- **48 new playable races/species** — total now 61 (up from 13)
- **106 new subclasses** — total now 118 (up from 12, covering all 12 classes)
- **237 new cross-references** (460 total) — subclass-to-class links, subrace-to-race links, related race connections
- Updated article count in UI to 1,350+

### New Races & Species
- **PHB 2014 missing subraces** (6): Mountain Dwarf, Wood Elf, Dark Elf (Drow), Stout Halfling, Forest Gnome, Variant Human
- **PHB 2024 species** (3): Aasimar, Goliath, Orc (with 2024 flexible ability score rules)
- **Volo's Guide races** (12): Aarakocra, Firbolg, Kenku, Lizardfolk, Tabaxi, Triton, Bugbear, Goblin, Hobgoblin, Kobold, Yuan-ti Pureblood, Grung
- **Eberron races** (4): Changeling, Kalashtar, Shifter, Warforged
- **Genasi** (5): Base + Air, Earth, Fire, Water subraces
- **Gothic lineages** (3): Dhampir, Hexblood, Reborn
- **Spelljammer races** (6): Astral Elf, Autognome, Giff, Plasmoid, Thri-kreen, Kender
- **Other supplement races** (9): Centaur, Minotaur, Satyr, Leonin, Fairy, Harengon, Owlin, Tortle, Custom Lineage

### New Subclasses (by source)
- **PHB 2014** (28): All missing PHB subclasses including Totem Warrior, College of Valor, all Cleric domains, Circle of the Moon, Battle Master, Eldritch Knight, and all Wizard schools
- **Xanathar's Guide** (31): Ancestral Guardian, Glamour, Forge Domain, Gloom Stalker, Hexblade, Swashbuckler, Divine Soul, and more
- **SCAG** (5): Battlerager, Banneret, Long Death, Crown, Undying
- **Tasha's Cauldron** (26): Beast, Wild Magic, Creation, Eloquence, Peace/Twilight Domain, Stars, Wildfire, Psi Warrior, Rune Knight, Mercy, Soulknife, Aberrant Mind, Clockwork Soul, Genie, and more
- **Other supplements** (8): Echo Knight (EGtW), College of Spirits (VRGtR), The Undead (VRGtR), Ascendant Dragon (FToD), Drakewarden (FToD), Path of the Giant (BGG), Lunar Sorcery (SotDQ), Oathbreaker (DMG)
- **2024 PHB new** (4): Wild Heart, World Tree, College of Dance, Circle of the Sea
- **Additional** (6): Chronurgy Magic, Graviturgy Magic, Bladesinging, Order of Scribes, Death Domain, Arcana Domain

### Version Sync
- All version files bumped to 0.3.8: VERSION, version.json, version.js, package.json (root + frontend), tauri.conf.json, Cargo.toml

---

## V0.3.7 — Auto-Pull Updates
**Released:** March 11, 2026

### Automatic Update Pull & Reload
- **Auto-pull on detection** — when `check_git_updates` detects a new remote commit, the app automatically pulls it and reloads within ~7 seconds (5s poll + 2s delay)
- **No manual interaction** — removed the "Pull & Reload" button workflow; updates are fully automatic
- **Toast notification** — shows "Auto-pulling update: <commit message>" before pulling
- **Auto-reload** — `window.location.reload()` fires after successful pull; `tauri dev` handles Rust recompilation automatically
- **Peer broadcast auto-pull** — when a LAN peer pushes and broadcasts via UDP, the app immediately checks and auto-pulls instead of just showing a notification

### Bug Fix
- **Trailing-space directory name fix** — `repo_root()` used `.trim()` which stripped the trailing space from the directory name `dnd-tracker-main `, making the path invalid and silently breaking every git command. Changed to `.trim_end_matches('\n')` to preserve directory name spaces.

### Cleanup
- Removed `isEnabled('auto-pull')` feature flag check — auto-pull is now always on
- Removed `fetchDiffPreview` and `fetchConflictInfo` from update check flow (not needed for auto-pull)
- Simplified `pullUpdates` — always reloads after pull

### Version Sync
- All version files bumped to 0.3.7: VERSION, version.json, version.js, package.json (root + frontend), tauri.conf.json, Cargo.toml

---

## V0.3.6 — Dev Sync Diagnostics & UX Fixes
**Released:** March 11, 2026

### Git Sync Diagnostic Logging
- **Verbose `check_git_updates` logging** — every 5s poll now prints to stderr: repo root path, origin URL, branch, fetch result, local SHA, remote SHA, whether they match, ancestor direction, and final `has_update` decision
- **Lock contention visibility** — if `GitLockGuard` blocks a check, the error is logged instead of silently swallowed
- **`repo_root()` CWD logging** — prints the working directory used to find the git repo, helping debug cases where the binary runs from a different directory
- **Frontend `console.warn` on check failure** — `checkForUpdates` catch block now logs `[dev-sync] git check failed: <error>` to the browser console instead of silently ignoring

### UX Improvements
- **Mode selection on every app open** — `ModeContext` no longer reads persisted mode from localStorage; users always see the Player/DM picker on launch or reload
- **Dev settings gear icon** — dev dashboard moved from a mode on the ModeSelect screen to a gear icon button in the top-left of the dev banner, opening as a fullscreen overlay
- **Error message fix** — "Failed to load characters: undefined" fixed by using `err?.message || err` instead of `err.message` (Tauri IPC errors are strings, not Error objects)

### Polling
- **5-second git polling** — `GIT_POLL_INTERVAL` reduced from 15s to 5s for faster update detection between devs

### Version Sync
- All version files bumped to 0.3.6: VERSION, version.json, version.js, package.json (root + frontend), tauri.conf.json, Cargo.toml

---

## V0.3.5 — Wiki Bestiary Expansion
**Released:** March 12, 2026

### Arcane Encyclopedia — Massive Bestiary Update
- **266 new monster entries** — full SRD 5.1 bestiary now covered, from CR 0 (Cat, Bat, Frog) through CR 30 (Tarrasque)
- **Total wiki articles: 1,235** (up from 964)
- **Total monsters: 315** (up from 51) — every SRD creature with full stat blocks, traits, and actions
- **All 10 chromatic & metallic dragon age chains** — Wyrmling → Young → Adult → Ancient for all 10 dragon types
- **Complete CR coverage** — no gaps from CR 0 through CR 30, including fractional CRs (1/8, 1/4, 1/2)
- **114 new cross-references** (223 total) — dragon age chains, creature variants, fiend hierarchies, undead progressions, elemental connections, giant ordning, NPC progressions, lycanthrope links, hag covens, golem types, naga types
- **Accuracy fix** — corrected Incapacitated condition: now correctly states concentration IS broken by incapacitation (per PHB p.203)
- **Updated article count** in UI, meta tags, and changelog to reflect 1,200+ articles

### New Monster Categories
- **Beasts** (34 new) — all common animals, dire variants, swarms, giant variants
- **Humanoids** (15 new) — NPCs (Acolyte, Scout, Spy, Thug, Bandit Captain, Gladiator, Archmage), goblinoids, lizardfolk, sahuagin
- **Fiends** (14 new) — complete devil hierarchy (Lemure → Pit Fiend), demon hierarchy (Dretch → Balor)
- **Dragons** (30 new) — all wyrmlings, young, adult, and ancient dragons for brass, copper, bronze, silver, gold, black, blue, green, red, white
- **Undead** (8 new) — Ghast, Specter, Vampire Spawn, Mummy Lord, and more
- **Monstrosities** (18 new) — Basilisk, Bulette, Behir, Remorhaz, Purple Worm, and more
- **Elementals** (10 new) — all mephits, Invisible Stalker, Salamander, Azer, Magmin, Xorn
- **Giants** (2 new) — Hill Giant, Ettin
- **Oozes** (3 new) — Gray Ooze, Ochre Jelly, Black Pudding
- **Constructs** (5 new) — Flesh/Clay/Stone Golem, Flying Sword, Shield Guardian, Rug of Smothering
- **Celestials** (4 new) — Couatl, Deva, Pegasus, Unicorn, Planetar
- **Fey** (3 new) — Dryad, Satyr, Sprite
- **Plants** (3 new) — Awakened Shrub, Shrieker, Awakened Tree, Shambling Mound, Violet Fungus
- **Aberrations** (4 new) — Aboleth, Chuul, Gibbering Mouther, Otyugh

### Legendary Creatures Added
- Aboleth, Unicorn, Gynosphinx, Androsphinx, Mummy Lord, Kraken, Tarrasque
- All Adult and Ancient dragons (20 entries with legendary actions)

### Version Sync
- All version files bumped to 0.3.5: VERSION, version.json, version.js, package.json (root + frontend), tauri.conf.json, Cargo.toml

---

## V0.3.4 — Dev Presence Reliability Fix
**Released:** March 11, 2026

### Peer Detection Fixes
- **Direct unicast to known peers** — heartbeats now sent directly to each known peer's IP in addition to broadcast, bypassing firewalls and routers that silently drop `255.255.255.255` packets
- **Subnet-directed broadcast** — computes actual subnet broadcast address (e.g., `192.168.1.255`) and sends to it alongside limited broadcast for better LAN coverage
- **Source IP fallback for peer identification** — if a peer's self-reported IP is a hostname fallback (`host-*`), uses the actual UDP source address instead for reliable identification
- **Shared peer list with heartbeat sender** — sender task now reads the peer map to unicast directly to all known peers every heartbeat cycle
- **Faster heartbeat interval** — reduced from 5s to 3s for quicker peer detection
- **Increased peer timeout** — extended from 15s to 20s to prevent premature peer expiry during brief network hiccups

### Diagnostic Logging
- **Startup logging** — logs bound port, local name, and IP on presence start
- **Heartbeat logging** — logs every 10th heartbeat with peer count (every 30s) to keep terminal readable
- **Receive logging** — logs first 3 received heartbeats and every 20th thereafter, showing peer name, IP, and version
- **Error logging** — recv errors now logged instead of silently swallowed

### Refactored Send Path
- **`send_to_all()` helper** — consolidated broadcast + subnet + unicast sending into a single method used by `broadcast_update_pushed()` and `send_chat()`, eliminating code duplication
- **Listen port in beacon messages** — beacons now include `listen_port` field so peers know which port the sender is actually on

### Version Sync
- All version files bumped to 0.3.4: VERSION, version.json, version.js, package.json (root + frontend), tauri.conf.json, Cargo.toml

---

## V0.3.3 — Arcane Advisor Overhaul + Dev Dashboard & Sync Improvements
**Released:** March 12, 2026

### Dev Settings Dashboard (Dev Builds Only)
- **New "Dev Settings" mode** — third option on ModeSelect screen (purple, wrench icon), only visible in dev builds
- **13-section Dev Dashboard** with sidebar navigation: Overview, Player Settings, DM Settings, Feature Flags, Git Panel, Dev Chat, DB Inspector, Environment, IPC Logger, Performance, Log Viewer, Schema Diff, Bug Report
- **Player/DM Settings tabs** — access character management from both Player and DM contexts in one place

### Dev Sync Improvements
- **15-second git polling** — reduced from 60s for faster update detection across WiFi/internet
- **Sequential diff/conflict fetches** — fixed race condition where concurrent `fetchDiffPreview()` and `fetchConflictInfo()` both tried to acquire the git lock
- **Removed redundant locks** — `dev_preview_incoming` and `dev_check_conflicts` no longer acquire GitLockGuard (read-only operations)
- **Removed redundant git fetch** — `dev_preview_incoming` no longer runs its own fetch (already done by `check_git_updates`)
- **"Builds synced" indicator** — green badge in dev banner when all peers are on the same version; yellow "version mismatch" when not
- **Active section broadcasting** — CharacterView broadcasts which section the dev is editing to peers via `dev_set_active_section`

### Dev Presence Resilience (V0.3.3)
- **Fallback port binding** — if port 8799 is in use (stale process), automatically tries port 8800
- **Dual-port broadcasting** — heartbeats sent to both 8799 and 8800 so peers on either port receive
- **Hostname-based IP fallback** — if real IP can't be detected (no internet), uses `host-{hostname}` instead of 127.0.0.1 to prevent self-filtering issues
- **Combo self-filter** — skips own messages using `dev_name + dev_ip` instead of just IP

### Security
- **DB inspector allowlist** — `dev_query_db` now only allows SELECT, PRAGMA, and EXPLAIN queries (was denylist, could be bypassed)
- **Dead code cleanup** — removed unused `enabled` function property from feature flags

### Rust-Side Ollama Proxy
- **All Ollama communication routed through Rust backend** — WebKitGTK CSP blocks frontend `fetch()` to localhost on Linux; moved all HTTP calls to three new Rust commands (`check_ollama`, `ollama_chat`, `ollama_pull`) using `reqwest` with `rustls-tls`
- **Streaming via Tauri Channel API** — `ollama_chat` and `ollama_pull` use `tauri::ipc::Channel<T>` to stream NDJSON chunks to the frontend in real-time
- **Async generator pattern on frontend** — `streamChat()` bridges Channel callbacks to an `async function*` using a queue + resolveWait pattern for clean token-by-token rendering

### Wiki-Powered Responses
- **SRD context injection** — every chat query first calls `wiki_search` to find up to 3 relevant wiki articles, injecting their summaries into the system prompt so the model gives accurate D&D 5e answers
- **Grounded responses** — model answers are based on the app's 964-article encyclopedia rather than relying solely on its training data

### Simplified AI Configuration
- **Single hardcoded model (phi3.5)** — removed model selector dropdown; phi3.5 is the only supported model, chosen for its balance of D&D knowledge and speed
- **Auto-download on enable** — toggling AI on in Settings automatically pulls phi3.5 if not already installed, with a progress bar
- **Removed Test Connection button** — was unreliable due to WebKitGTK restrictions; status is now checked automatically
- **Removed connection status panel** — simplified Settings AI tab to just an enable toggle and setup guide

### Brief, Focused Responses
- **Token cap (128) and low temperature (0.3)** — prevents long-winded responses; model answers in 1-3 sentences
- **Minimal system prompt** — stripped to essential rules only, preventing the model from echoing instructions or outputting JSON
- **Response cleaning** — `cleanResponse()` strips any JSON, code blocks, or action blocks from streamed output before display

### Floating AI Widget (ArcaneWidget)
- **Context-aware mini-chat** — floating widget available on all sections (CharacterView, WikiPage, WikiArticlePage), aware of current section context
- **Smart auto-scroll** — only scrolls to bottom when user is already near the bottom of the chat

### Removed Features
- **Action blocks removed** — the model no longer attempts to add spells/features/items/NPCs via structured action blocks (was unreliable with small models)
- **Model selection removed** — no more dropdown; single model simplifies setup and support
- **Test Connection removed** — replaced by automatic status checking

---

## V0.3.2 — Dev Sync System, Dev Tools Panel & Robust Auto-Update
**Released:** March 11, 2026

### Dev Sync System
- **Instant peer notifications** — when a dev pushes code, other devs on LAN get notified within seconds via UDP broadcast + Tauri events (no more waiting for 60s poll)
- **Version-aware peer discovery** — beacon messages now include app version, shown when devs come online ("evan came online (v0.3.2)")
- **Dev count in banner** — always shows "X devs in app" (including yourself) in the dev banner
- **Unpushed commit indicator** — banner shows "(you have unpushed commits)" when local is ahead of remote
- **Local changes warning** — shows "(local changes will be stashed)" before pulling when you have uncommitted work

### Robust Auto-Update
- **Dynamic repo detection** — `repo_root()` now uses `git rev-parse --show-toplevel` at runtime instead of hardcoded compile-time path — works on any dev's machine regardless of where they clone the repo
- **Async git operations** — all git commands now use `tokio::process::Command` with 30-second timeouts, preventing UI freezes
- **Git operation locking** — atomic lock prevents concurrent fetch/pull from corrupting state
- **Rebase fallback** — if `--ff-only` fails (local commits diverge), automatically tries `pull --rebase` to put local commits on top; aborts cleanly on conflict
- **Stash safety** — stash pop now runs before pull result check, with explicit conflict warnings if pop fails
- **Post-reload notifications** — success/failure messages survive the page reload via localStorage
- **Correct ahead/behind detection** — uses `git merge-base --is-ancestor` to distinguish "remote is ahead" from "local is ahead", preventing false update banners

### Dev Tools Panel (Ctrl+Shift+D)
- **DB Inspector** — browse all SQLite tables for any character or the wiki DB, run raw SELECT queries, see row counts and schema
- **IPC Logger** — intercepts every `invoke()` call with timing, payload, response, and error tracking; shows avg/p95/max latency stats
- **Performance Overlay** — FPS counter, JS heap usage, IPC latency stats
- **Log Viewer** — streams both Rust backend log buffer and frontend console.log/warn output
- **Environment Check** — shows app version, git SHA, branch, Node/Rust/npm versions, OS, arch, DB schema hash
- **Schema Diff & Migration Runner** — compares character DB against expected schema, lists missing tables/columns, one-click migration
- **Feature Flags** — toggle dev features on/off from the panel, stored in localStorage
- **Enhanced Bug Report** — collects git state, system info, recent IPC calls, log buffer, and character summary into a copyable/savable JSON report

### Test Character Generator
- **One-click fully populated character** — random name, race, class, level, ability scores, spells, inventory, currency, features, attacks, NPCs, quests with objectives, journal entries, lore notes, backstory
- Accessible from Dev Tools panel

### Hot Reload Indicator
- Shows green "HMR" flash on hot module replacement, orange "Full Reload" flash on full page reload
- Bottom-left corner, auto-fades

### Production Safety
- All dev features gated behind `import.meta.env.DEV` — Vite tree-shakes them out of production builds
- Dev components lazy-loaded so they don't affect production bundle size
- Dev tools panel, banner, presence system, and all dev Rust commands are completely absent in release builds

---

## V0.3.1 — Party Connect Overhaul, Dev Build Banner & Auto-Update System
**Released:** March 11, 2026

### Party Connect
- **Moved to sidebar** — Party Connect is now its own section under Tools (both Player and DM modes) instead of being buried inside the Settings tab
- **Persistent WebSocket connection** — party state lifted to a React context (`PartyContext`) so navigating between sections no longer unmounts the component or kills the WebSocket — no more accidental disbanding
- **Stale snapshot fix** — reconnect timer now reads fresh character data via `charSnapshotRef` instead of using the stale closure from the initial connection
- **Race condition guard** — `connectingRef` flag prevents multiple simultaneous WebSocket connections from racing during rapid navigation
- **sendUpdate keeps snapshot fresh** — every stat sync also updates `charSnapshotRef` so reconnect always has the latest HP, AC, level, etc.

### Dev Build Banner
- **"DEV BUILD" banner** — fixed purple banner at the top of the screen, only visible when running `npm run tauri dev` (uses `import.meta.env.DEV`)
- **Completely hidden in production** — `import.meta.env.DEV` is false in production builds, so the banner and all dev update code is tree-shaken out
- **Dynamic height** — banner is 24px normally, expands to 36px when an update is available; content padding adjusts automatically to prevent overlap

### GitHub Auto-Update System (Dev Builds Only)
- **Automatic polling** — checks GitHub for new commits on launch and every 60 seconds thereafter
- **Toast notification** — when a new commit is detected, shows a toast with the commit message
- **Orange update banner** — "DEV BUILD" banner turns orange with the commit message and a "Pull & Reload" button
- **Pull & Reload** — one-click: auto-stashes dirty working tree, runs `git pull --ff-only`, pops stash, reloads the app window
- **Rust commands** — `check_git_updates` (fetch + compare HEAD vs origin) and `pull_git_updates` (stash + pull + pop)
- **Edge case handling:**
  - Validates `.git/` directory exists before running any git commands
  - Checks `origin` remote exists before fetching
  - Auto-detects `main` vs `master` branch on origin
  - Dirty working tree auto-stashed before pull, popped after
  - Fast-forward failures return clear error message instead of raw git output
  - Safe string slicing with `.get(..7)` to prevent panics on empty SHA

### Version Sync
- All version files bumped to 0.3.1: VERSION, version.json, version.js, package.json (root + frontend), tauri.conf.json, Cargo.toml

---

## V0.3.0 — Arcane Advisor (AI Assistant)
**Released:** March 12, 2026

### New Feature: Arcane Advisor
- **AI-powered D&D companion** running entirely locally via Ollama — no internet, no API keys, no data leaves your machine
- **Context-aware conversations** — system prompt includes full character data (stats, spells, inventory, features, conditions) and D&D 5e rules reference (glossary, conditions, mechanics)
- **Character actions** — assistant can add spells, features, items, NPCs, and update overview fields via structured action blocks with user confirmation
- **Streaming responses** — tokens appear word-by-word as the model generates them via Ollama's NDJSON streaming API
- **Markdown rendering** — assistant messages render headers, bold, code, and bullet points
- **Conversation history** — persisted per character in sessionStorage, capped at 20 messages
- **Example prompts** — "What can I ask?" panel with 10 clickable example queries
- **Error handling** — graceful messages for Ollama offline, model not found, and timeout states

### Settings Integration
- **New "AI Assistant" tab** in Settings with enable/disable toggle, model selector, connection tester, and setup guide
- **Model selector** — auto-detects installed Ollama models; recommended phi3.5 (3.8B, ~2.2GB) or qwen2.5:1.5b (~1GB) for low-end hardware
- **Setup guide** — step-by-step instructions shown when Ollama is not detected or model not installed
- **Test Connection** button re-checks Ollama status on demand

### Feature Flag
- **Completely invisible when disabled** — no sidebar entry, no section loaded, no API calls, no Ollama connection attempts
- **Sidebar entry** appears only when enabled (conditional rendering in both Player and DM mode)
- **Lazy-loaded** — assistant section only imported when first navigated to

### Architecture
- Frontend calls Ollama REST API directly at `http://localhost:11434` (allowed by Tauri CSP)
- No Rust backend changes needed — uses existing `export_character` command for character context
- Settings stored in localStorage (`codex-assistant-settings`) matching existing pattern
- System prompt kept under ~4000 tokens: app summary + character snapshot + condensed rules glossary

---

## V0.2.9 — Import Character & Error Logging
**Released:** March 12, 2026

### Dashboard
- **Import Existing Character** — new "Import Character" card in player Dashboard grid and empty state
- Users can import a previously exported JSON character file as a brand-new character entry
- File picker opens on click, validates JSON structure, creates character and populates all data

### Developer / Stability
- **Frontend error logging** — `console.error`, unhandled exceptions (`window.error`), and unhandled promise rejections captured and forwarded to Rust backend via `frontend_log` IPC command
- Errors logged to stderr (visible in Tauri dev terminal) and to `frontend.log` in app data directory
- Log file auto-truncates at 500KB to prevent unbounded growth
- `logger.error()`, `logger.warn()`, `logger.info()` utility available for explicit logging from any component

### Misc
- Added placeholder `icon.png` for Tauri build
- Version sync across all config files (was out of sync: VERSION at 0.2.3, version.json at 0.2.1)

---

## V0.2.8 — The Big 50: Comprehensive Feature & QOL Overhaul
**Released:** March 11, 2026

### Overview / Character Sheet
- Death Saving Throw UI — visual tracker with 3 success/3 failure clickable circles, auto-stabilize/death toasts
- Proficiency Bonus display — prominent gold-accented card showing calculated proficiency bonus
- Passive Skills display — shows Passive Perception, Investigation, and Insight (10 + skill mod)
- Initiative Modifier display — DEX mod shown prominently with breakdown tooltip
- AC Breakdown tooltip — hover AC to see base 10 + DEX mod calculation
- Concentration Save helper — toast reminder with DC calculation when HP drops while concentrating
- Feature restore reminder — toast after short/long rest reminding to restore feature charges
- Encumbrance Speed warning — badges showing -10 ft (encumbered) or -20 ft (heavily encumbered) on speed display

### Combat
- Full Initiative Round Manager — round counter, current turn highlighting, Next/Previous Turn buttons, auto-round increment
- Action Economy Tracker — Action, Bonus Action, Reaction checkboxes that reset each turn
- Enhanced Crit Detection — gold shimmer animation on nat 20, red flash on nat 1 with CSS keyframes
- Flanking Bonus toggle — +2 to all attack rolls when enabled, persisted to sessionStorage
- Combat Log — auto-logs attacks, condition changes, round/turn changes; last 50 entries, color-coded by type

### Spellbook
- Ritual Casting enhancement — prominent "Ritual" badge with tooltip, blue-tinted left border on ritual spells
- Always-Prepared Spells — lock icon, cannot be unprepared, for domain/oath spells
- Cantrip Scaling display — shows damage scaling tiers (levels 5, 11, 17) with current tier highlighted
- Material Component Cost warning — gold coin icon with cost for spells requiring expensive materials

### Dice Roller
- Saved Roll Macros — save up to 20 frequently used rolls (stored in localStorage), one-click re-roll
- Enhanced Crit visuals — "CRITICAL HIT!" / "CRITICAL MISS!" with glow animations and shake effects

### Inventory
- Currency Auto-Conversion — "Convert All to GP" button consolidates all denominations
- Encumbrance Speed Penalties — detailed penalty display below carry weight bar
- Enhanced Consumable Tracking — red "LOW" warning for items with quantity ≤ 3
- Item description always visible for equipped items (no truncation)

### Features & Traits
- Rest-Based Restore — separate "Short Rest" and "Long Rest" restore buttons with feature counts
- Feature Category Summary — stat pills showing class features, racial traits, feats, and charge counts
- Low Charges Warning — amber pulsing border on features with only 1 use remaining

### NPCs
- NPC Relationship Tracker — Friendly/Neutral/Hostile/Rival/Patron/Unknown with colored badges
- NPC Quest Hooks — optional quest hook field with scroll icon display
- NPC initials avatars already present, enhanced with relationship display

### Quests
- Quest Reward Tracking — XP, Gold, and Item rewards with icons; summary bar showing totals across active quests
- Quest Giver field — displayed with user icon
- Quest Location field — displayed with map-pin icon
- Quest Priority — Low/Medium/High/Critical with color-coded dots (Critical pulses red)

### Journal
- Session Summary Stats — entry count, session count, date range pills at top
- NPC Mentions — tag NPCs in journal entries, shown as blue badges
- Pin Important Entries — star toggle to pin entries to top of list regardless of sort

### Lore & World Notes
- Category Presets — clickable chips (Location, Faction, Deity, History, Magic, Creature, Item)
- Related Entries — link-style cross-references between lore entries
- Entry Type Icons — category-aware icons (MapPin, Users, Star, Clock, Sparkles, etc.)

### Sidebar
- Pinned Sections — star icon to pin up to 5 favorite sections to top of sidebar
- Section Search — filter sidebar sections by typing

### Dashboard
- Character Duplicate — copy a character with same race/class/ruleset as a template
- Quick Stats Bar — total characters, average level, most played class
- Character Search — filter characters by name, race, or class

### DM Mode — Campaign Hub
- DM Quick Reference — collapsible card with DC guidelines, damage by level, cover rules, lighting, travel pace
- Encounter Difficulty Calculator — input party size/level, see Easy/Medium/Hard/Deadly XP thresholds
- Session Planning Checklist — 6 common prep items with checkboxes (sessionStorage)

### DM Mode — Party
- Party Stats Overview — aggregate HP %, lowest HP member, level range, party size for DM hosts

### Backend
- Journal entries: added `npcs_mentioned`, `pinned` columns with migration
- Lore notes: added `related_to` column with migration
- Export/Import updated to include new fields with backward compatibility

---

## V0.2.7 — Player/DM Mode System & Character Setup
**Released:** March 11, 2026

### Added
- **Player/DM Mode System** — choose Player or DM mode on launch; mode persists across sessions via localStorage
- **Mode Select screen** — full-screen role picker with animated rune particles, gold Player card and purple DM card
- **DM Beta Warning modal** — warns users that DM Mode is V0.0.1 BETA before entering
- **DM Campaign Hub** — dedicated campaign overview section with session/NPC/quest/lore stats and quick-start actions
- **DM-specific sidebar** — separate navigation groups for Campaign, Combat, Party, and Tools when in DM mode
- **Campaign creation flow** — DMs create "campaigns" instead of "characters" with simplified 2-step modal (name + ruleset)
- **Campaign cards on Dashboard** — purple-themed cards with campaign badge instead of HP/class display
- **Character Setup wizard** — new full-screen post-creation setup at `/character/:id/setup` with step-by-step flow:
  - Ability Scores (Point Buy / Standard Array / Roll 4d6 drop lowest)
  - Background selection (2024 edition only)
  - Auto-apply race/class defaults (HP, speed, AC, saves, proficiencies)
  - Skill selection with class choices and background skill locks
  - Full review card before finishing
- **Find Improvements tab in DevTools** — mode-aware audit: Player mode checks 12 character completeness areas, DM mode suggests useful tools and feature improvements
- **ModeContext** — React Context providing `mode`, `setMode`, `clearMode` app-wide

### Fixed
- **Character Setup save bug** — `get_overview` returns nested `{ overview: {...} }` but setup was reading flat; now correctly extracts `.overview` so name, race, class, and ability scores all save properly
- Mode-aware default sections — CharacterView defaults to `campaign-hub` for DM, `overview` for Player
- Party Connect is mode-aware — DM sees "Host a Session", Player sees "Join Your DM's Session"

---

## V0.2.6 — Code Review Fixes: Security, Stability & Bug Fixes
**Released:** March 11, 2026

### Security
- XSS vulnerability fixed in WikiPage.jsx — HTML content now sanitized (strips script, iframe, object, embed elements and on* event attributes) before rendering with dangerouslySetInnerHTML
- CORS middleware restricted from wildcard (`*`) to explicit localhost and Tauri origins

### Stability
- React Error Boundaries added — each section wrapped in `SectionErrorBoundary` component; a crash in one section no longer takes down the entire app
- Party.py WebSocket race conditions fixed — `asyncio.Lock()` protects all room dictionary mutations
- Journal stale closure fixed — keyboard save handler uses refs to always capture current state
- Autosave retry mechanism — failed IPC saves are queued and retried on the next autosave interval
- Overview setTimeout memory leak fixed — subclass modal timeout properly cleaned up on unmount

### Bug Fixes
- Overview expertise calculation corrected — expertise now doubles proficiency bonus (`profBonus * 2`) instead of stacking additively
- Combat condition timer clamped with `Math.max(0, ...)` to prevent negative durations on rapid clicks
- combat.rs column-order comments added to verify SELECT/get() alignment

### Performance
- Quests.rs N+1 query eliminated — objectives fetched in one bulk query and grouped by quest_id in a HashMap
- Dashboard character cards wrapped in `React.memo()` to prevent unnecessary re-renders on sort/filter changes
- DiceRoller roll history capped at 200 entries to prevent unbounded sessionStorage growth

---

## V0.2.5 — Batch 5: Combat, Spellbook, Journal & Section Upgrades
**Released:** March 11, 2026

### Combat
- Resistance/vulnerability toggles per damage type
- Reaction tracker with sessionStorage persistence across tabs
- Clear all conditions button (appears when 3+ conditions active)
- Temp HP bar shown separately from main HP
- Legendary action counter with configurable max
- Initiative persistence via sessionStorage

### Spellbook
- V/S/M component badges on spell cards
- Range and duration display on each spell
- Inline description expand/collapse
- Cantrip section separated from leveled spells
- Spell level filter persists between tab switches

### Journal
- Export entries to text file download
- Mood/tone tagging stored in tags field
- Fullscreen reading mode modal

### Features
- Recharge condition display (short rest / long rest / dawn)
- Source level badge on each feature
- Search now includes feature description text
- Compact usage pill (e.g., "2/3 uses")
- Restore All / Use All bulk action buttons

### NPCs
- Role-based colored left borders (green=ally, red=enemy, amber=neutral)
- Markdown notes rendering with MDEditor
- Duplicate NPC button for quick cloning

### Quests
- Difficulty rating badges (Easy/Medium/Hard/Deadly)
- Markdown notes rendering
- Failed quest status with separate collapsed section

### Lore
- Word count and reading time estimate on entries
- MDEditor.Markdown rendering for note display

### Inventory
- Item rarity color coding on card borders (common→legendary)
- Low stock warning indicator on consumables (≤5 remaining)

### Dice Roller
- 4d6 drop lowest stat roller for character creation
- Copy roll history to clipboard
- Roll statistics panel (total rolls, average, nat 20/1 counts)

### Dashboard
- Last played date with "X days ago" relative display
- Sort characters by name, level, or recently played
- Avatar ring color by HP percentage (green→yellow→red)

### Character View
- Breadcrumb navigation showing section path
- Session timer tracking play time
- Unsaved changes warning on window close

### Overview
- Spell save DC display
- Character traits quick-reference chips

### Bug Fixes
- Fixed bug_reporter.py version mismatch (was 0.2.3, now 0.2.5)

---

## V0.2.4 — QOL Overhaul: Performance, Accessibility & Bug Reporter V3
**Released:** March 11, 2026

### Bug Reporter V3
- Rich error context capture — section, character, screen resolution, user agent attached to every error
- Console.error interception — catches errors that bypass window.onerror
- Duplicate suppression — fingerprints errors and collapses repeats with count + time range
- React warning noise filter — React DevMode warnings downgraded to low-priority issues, not errors
- Bug report modal upgraded — numbered step builder (Enter to add step), "What did you expect?" required field
- Auto-detected environment — OS, browser, screen size auto-populated in every report
- Report IDs — every submission gets a unique `USR-YYYYMMDD-NNN` identifier
- Character context chip — name, class, level, race, ruleset auto-attached to reports
- Recent auto-errors (last 5 min) auto-appended to user reports
- Python backend: HTTP error/slow request middleware with rich context (client IP, query params, response body, elapsed time)
- Python backend: `/dev/status` endpoint shows live session state (error counts, recent entries)
- Python backend: Session summary on shutdown with duration, counts, and top errors
- Python backend: Fingerprint-based deduplication in middleware
- Python backend: Party WebSocket bug reports now include generated report IDs

### Performance
- Memoization pass — `useMemo` added across all 10 section components (Overview, Spellbook, Combat, Inventory, Journal, Features, NPCs, Quests, Lore, Party)
- Bundle optimization — all 16 sections now lazy-loaded (was only 4), item catalog extracted to separate data file
- Main bundle reduced 33% (2,496 KB to 1,682 KB gzipped: 822 KB to 583 KB)
- SQLite tuning — `busy_timeout(5s)`, `synchronous=NORMAL`, 8MB cache, `temp_store=MEMORY`
- CSS GPU acceleration — `will-change` hints on animated elements, `contain: layout style` on cards
- Text overflow safety — `overflow: hidden` / `text-overflow: ellipsis` on identity values and headers

### Reliability
- Null safety pass — guards added across 9 files (Inventory, Overview, Spellbook, Combat, Features, Quests, Dashboard, useAutosave)
- Rust backend hardening — party.rs error logging, rate limiting (10 msg/s), room limits (50 max)
- db.rs connection pool capped at 100 with eviction, user-friendly error messages
- main.rs replaced all `.expect()` with `.map_err()` + `eprintln!` logging
- Party WebSocket creation wrapped in try-catch
- ExportImport safe reload after import
- Update check timeout reduced from 8s to 5s
- AbortSignal.timeout polyfill for older browsers
- Settings localStorage wrapped in try-catch with toast on failure

### Accessibility
- Keyboard navigation — 19 interactive elements fixed with `tabIndex`, `role`, `onKeyDown` (Settings theme swatches, toggles, font pickers, density buttons, Overview saving throws, Dashboard new character card, Party auto-sync toggle)
- ARIA labels on icon-only buttons across 10 files (delete, edit, close, toggle, copy buttons)
- `aria-live="polite"` on dice roll results and combat roll results for screen reader announcements
- `role="progressbar"` with `aria-valuenow/min/max` on HP bar, carry weight bar, quest progress bars, party member HP bars
- Toast screen reader support via `ariaProps` configuration
- `prefers-reduced-motion` media query disables animations
- ConfirmDialog: `role="alertdialog"`, `aria-modal`, auto-focus cancel button, focus trapping
- Sidebar: `role="navigation"`, `aria-label`, `aria-current="page"` on active section

### QOL Improvements
- Sorting added to 5 sections: Journal (date/session/title), NPCs (name/role/status), Quests (status/name/progress), Lore (name/category), Features (name/type/uses)
- Search added to 7 sections: Spellbook, Inventory, NPCs, Journal, Lore, Rules Reference, Combat conditions
- Input validation with red border feedback on all forms (Spellbook, Combat, Features, Journal, NPCs, Quests, Lore, Inventory)
- Toast notifications across all sections for add/remove/update actions
- Empty state cards with icons and guidance text for all list sections
- Escape key closes modals in Spellbook, Combat, Journal, NPCs, Quests, Lore
- Ctrl+Enter saves in Journal
- Dice roller: roll ID collision fix (random suffix), custom expression placeholder, aria-labels, history count
- Combat: roll results auto-clear fix (Date.now() comparison bug), manual dismiss button, timeout cleanup on unmount
- Backstory: word/character count below textarea
- Dashboard: character count display
- Overview: ability score clamping (1-30), HP clamping (0-999), AC clamping (0-30), proficiency bonus tooltip
- Spellbook: level filter pills, prepared/unprepared filter, parseInt radix fix, spell save DC tooltip
- Rules Reference: search match highlighting with `<mark>` tags
- DiceRoller: roll history persistence across tab switches

### Bug Fixes
- Fixed "Rendered more hooks than during the previous render" — `useMemo` calls moved before early return in Overview.jsx
- Fixed combat roll results never clearing — stored timestamp comparison instead of re-calling Date.now()
- Fixed DiceRoller roll ID collisions — added random suffix to Date.now()
- Fixed combat setTimeout memory leak — ref tracking + cleanup on unmount
- Fixed Party WebSocket creation crash — wrapped in try-catch
- Fixed Settings reset — added confirmation dialog (was missing)
- Fixed Lore.jsx syntax error — missing closing brace in JSX conditional

---

## V0.2.3 — The Big 10: Roll Buttons, Concentration, Uses, XP & More
**Released:** March 10, 2026 11:45 PM

- Attack Roll Buttons — click the dice icon on any weapon to instantly roll attack + damage with crit detection
- Dice Roll Labels — add context like "Stealth check" or "Longsword attack" so your roll history tells a story
- Dice History Persistence — roll history now survives tab switches (no more lost rolls)
- XP Progress Bar — experience_points field now visible with a level-up progress bar and XP-to-next-level display
- Concentration Tracking — click the C badge on a spell to concentrate; warns when switching, shows active banner with CON save reminder
- Feature Uses/Charges — track Rage 2/day, Action Surge 1/short rest, etc. with visual charge circles and recharge type
- Multiclass Display — multiclass_data JSON now rendered as class/subclass/level badges in the Identity card
- NPC Role Avatars — NPCs now show colored circle avatars (green=ally, red=enemy, amber=neutral, blue=party) with initials
- Condition Duration Timers — set rounds on active conditions, "Next Round" button auto-decrements and auto-expires
- NPC cards now have role-colored borders and backgrounds for instant visual scanning
- Portrait upload confirmed working with drag-and-drop in Backstory section

---

## V0.2.2 — Automatic Condition Effects & Bug Fixes
**Released:** March 10, 2026 8:30 PM

- Automatic Condition Effects — active conditions now apply their D&D 5e mechanical effects automatically
- Conditions modify speed (Grappled/Restrained/Paralyzed = Speed 0), saving throws (auto-fail STR/DEX), and attack rolls
- Overview shows condition effects banner with all active penalties at a glance
- Saving throws display AUTO-FAIL and DIS badges when conditions apply
- Dice Roller auto-sets advantage/disadvantage based on active conditions
- Condition buttons now have stronger red highlighting with glow effect when active
- Combat section shows full mechanical effects summary for active conditions
- Update check now shows toast notification — confirms up-to-date, update available, or offline
- Fixed Party Connect — join/leave messages now match between Python backend and frontend (was silently broken)
- Fixed character creation — race, class, and subclass now saved by Python backend
- Fixed ability score white outline — inputs now blend seamlessly into dark cards
- Fixed missing skill/save creation on update endpoints
- Fixed Party MemberCard null crash on malformed member data
- Update manifest URL now points to real GitHub Gist
- Version badge in Updates panel handles v-prefix mismatches

---

## V0.2.1 — Connection Hardening & Stability
**Released:** March 10, 2026 6:00 PM

- Party Connect — auto-reconnect with exponential backoff on WiFi drops
- Party Connect — 8-second connection timeout with clear error toasts instead of silent hangs
- Party Connect — host reassignment when original host disconnects (no more lost rooms)
- Party Connect — graceful shutdown notifies all players when host ends session
- Party Connect — zombie client cleanup (removes inactive clients after 90s)
- Party Connect — bounded message channels prevent memory leaks from slow clients
- Party Connect — IP validation on join, proper clipboard error handling
- Party Connect — auto-sync now tracks name, race, and class changes (not just HP/AC)
- Update system — removed hardcoded GitHub repo from JS bundle (private repo stays private)
- Update system — switched to neutral version manifest for update checks
- Fixed stale WebSocket closures via callback refs (prevents party desync)
- Fixed ping interval leak on reconnect (no more stacking intervals)
- Fixed silent error swallowing in backend file operations and reload triggers
- Fixed React key warnings across Journal tags, Quest objectives, Wiki tables, LevelUp features
- Added alt text to character portrait images for accessibility
- Version sync — all config files now at 0.2.1 (was 0.1.7 in package.json files)

---

## V0.2.0 — LAN Party & Auto-Updates
**Released:** March 10, 2026 3:00 PM

- LAN Party Connect — host shows IP, joiners enter IP + room code for reliable cross-device play
- Dev builds and production builds can connect to each other seamlessly
- Auto-update check on launch — checks GitHub releases, downloads installer directly
- Update screen shown at startup with animated progress and version comparison
- Midnight Glass V3 UI — glassmorphism panels, 6 preset themes, per-ability colors
- Settings overhaul — 4-tab panel with font/density/layout controls
- Subclass selection moved to level-up at the appropriate class level
- Version sync across all config files (VERSION, version.js, tauri.conf.json, Cargo.toml)

---

## V0.1.9 — Midnight Glass V3 UI, Auto-Updates & Subclass Selection
**Released:** March 10, 2026 12:00 PM

- Midnight Glass V3 theme — full glassmorphism redesign with frosted panels, ambient glow, and depth layers
- 6 preset themes: Midnight Glass, Dragon Fire, Arcane Violet, Forest Shadow, Blood Moon, Frost Giant
- Custom accent color picker with 12 preset swatches
- UI scale slider (80% to 120%) for different monitor sizes
- Font size controls for body and display text
- Layout density options (compact, normal, spacious)
- Sidebar collapsible to icon-only mode
- Auto-update checker on app launch
- Subclass selection prompt on level-up at the appropriate class level (e.g., level 3 for most classes)

---

## V0.1.8 — Character Creation & Auto-Backup
**Released:** March 10, 2026

- Expanded character creation — choose race, class, and optional subclass during setup
- Identity fields (name, race, class, subclass) locked after creation
- Race traits and class features displayed on character sheet by level
- Auto-backup every 5 minutes to a single overwriting JSON file
- Fixed drag-and-drop portrait upload in Tauri
- Expanded 5e 2014 ruleset — 30+ races, all 12 classes with full feature lists
- Party UI rework with color-coded member cards

---

## V0.1.7 — Party Connect Improvements
**Released:** March 2026

- Room code system for Party Connect
- Member cards showing HP, AC, level, race, class
- Auto-sync character stats to party members
- Copy room code to clipboard
- Connection status indicators

---

## V0.1.6 — Settings Reorganization
**Released:** March 2026

- Party Connect moved under Settings (tabbed layout)
- Settings tabs: Appearance and Party Connect
- Party Connect removed from sidebar nav — only accessible via Settings
- Theme customization improvements

---

## V0.1.5 — Tauri Migration
**Released:** February 20, 2026

- Migrated from Python/FastAPI to native Tauri 2 desktop app (Rust backend)
- Frontend communicates via Tauri IPC instead of REST API
- Single-command launch with `npm run tauri dev`
- Data stored in OS app data directory
- Bundled wiki.db as a Tauri resource — auto-copied on first launch
- Production build creates native installer/executable

---

## V0.1.4 — Wiki & Rules Reference
**Released:** February 2026

- Arcane Encyclopedia — 964-article searchable wiki with full-text search
- Rules Reference section with searchable D&D 5e rules
- Wiki articles linked with cross-references
- Category browsing for wiki (spells, monsters, items, classes, etc.)

---

## V0.1.3 — Campaign Tools
**Released:** February 2026

- Campaign Journal with session logging, real-date and in-game date tracking
- Quest Tracker with objectives, progress bars, and status tracking
- NPC Tracker with roles (ally/enemy/neutral), locations, and status
- Lore & World Notes with categories and markdown support

---

## V0.1.2 — Combat & Spellbook
**Released:** January 2026

- Combat section with attack tracking, damage dice, and attack bonuses
- 15 D&D 5e conditions with toggle activation
- Action economy reference (actions, bonus actions, reactions)
- Spellbook with spell slot tracking and prepared spell management
- Warlock Pact Magic support with short rest slot recovery
- Spell search and filtering

---

## V0.1.1 — Inventory & Features
**Released:** January 2026

- Inventory with 40+ PHB weapons, armor, and gear catalog
- Currency tracker (cp, sp, ep, gp, pp) with total GP value
- Encumbrance calculation based on Strength score
- Attunement tracking (3 max)
- Equipment slots and equip/unequip toggling
- Features & Traits section for class features, racial traits, and feats
- Dice Roller with d4/d6/d8/d10/d12/d20 buttons and custom expressions

---

## V0.1.0 — Initial Release
**Released:** January 15, 2026

- Full character sheet with ability scores, saving throws, skills, HP tracking, and death saves
- Spellbook with slot tracking, prepared spells, and Warlock pact magic
- Inventory with 40+ weapons/armor, currency, encumbrance, and attunement
- Combat tracker with 15 conditions, action economy, and combat notes
- Campaign journal, quest tracker, NPC tracker, and lore notes
- Arcane Encyclopedia — 964-article searchable wiki
- Party Connect — LAN sync with room codes
- Dice roller with standard dice and custom expressions
- Level-up system with class feature unlocks
- 5 UI themes with dark mode design
- Beginner tutorial/wizard for new users
- Export/Import character data as JSON
