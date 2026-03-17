# The Codex — Master Update List

Complete version history from initial release to current. The in-app Updates tab shows the 8 most recent versions — this file contains everything.

---

## V0.8.3 — Encounter Runner Overhaul, Player QoL & Campaign Wizard
**Released:** March 16, 2026

### Encounter Runner
- **Custom Damage Input** — type exact damage amounts per monster instead of fixed +5/-5 buttons
- **HP Bars** — visual health bars on each monster card with percentage-based coloring
- **Inline Stat Blocks** — expand any monster card to view full stat block (abilities, AC, speed, attacks)
- **Condition System** — apply/remove D&D 5e conditions on monsters with badge display
- **SRD Monster Search** — search and add monsters to active encounters on the fly
- **Kill/Remove Buttons** — quickly remove defeated monsters from the encounter

### Player Sidebar QoL
- **Clickable HP Bar** — click to open damage/heal popup with preset buttons (-1/-5/-10/+1/+5/+10)
- **Combat Stats Row** — AC (blue), Speed (green), Proficiency Bonus (gold), Initiative (purple) always visible
- **Death Save Tracker** — appears at 0 HP with 3 success (green) and 3 failure (red) dots
- **Temp HP Overlay** — blue segment on HP bar showing temporary hit points
- **Quick Dice Roller** — d4/d6/d8/d10/d12/d20 buttons with toast notifications, nat 20/1 callouts

### Spellbook
- **Spell Slot Color Coding** — purple (healthy), amber (≤34% remaining), red (empty) for both dots and text

### Campaign Creation Wizard
- **3-Step Guided Flow** — Campaign Details → Template Selection → Review & Generate
- **Quick Create Toggle** — single-step form for fast campaign creation (preserves old UX)
- **Template Selection** — One-Shot, Short Campaign, Full Campaign, or Blank with content previews
- **Preview & Re-roll** — review generated content before creating, re-roll individual items

### New Content
- **6 New Premade Campaigns** (12 total) — Plague of Shadows, Carnival of Lost Souls, Heist of the Golden Vault, Isle of the Storm King, Tomb of the Serpent Queen, The Frozen Throne

### Changes
- DM Guide trimmed to running sessions only (campaign building content moved to Campaign Builder)
- All campaigns now route to Campaign Builder instead of DM Lobby
- Removed Quick Actions (Quick Roll d20, Long Rest All, Random Table) from player Dashboard

### Bug Fixes
- Fixed stale state in encounter condition handler (used old closure instead of fresh data)
- Fixed spell slot text color mismatch (green text with purple dots → matching purple)
- Added missing transitions on sidebar combat stat badges
- Fixed death save skull icon sizing (was 10px, now 12px to match other sidebar icons)

---

## V0.8.2 — Auto-Update Test Patch
**Released:** March 16, 2026

- Test patch to verify auto-update pipeline

---

## V0.8.1 — Auto-Update Fix
**Released:** March 16, 2026

- **Tauri Native Updater** — "Update Now" button now uses Tauri's built-in updater to download, install, and relaunch automatically
- **Removed Fake Progress** — old flow just opened a browser page with a simulated progress bar; replaced with real download/install tracking
- **Unified Update Banners** — merged duplicate gold and green update banners into a single flow

---

## V0.8.0 — Player Mode Overhaul: Decomposed Architecture, Combat Animations & Polish
**Released:** March 15, 2026

### Architecture
- **PlayerSession Decomposition** — monolithic PlayerSession.jsx broken into focused modules (usePlayerSessionEvents, usePlayerCharacterData, PlayerSessionHeader, PlayerSessionSidebar)
- **WebSocket Heartbeat** — 15-second ping/pong with automatic disconnect detection
- **Message Acknowledgment** — critical events (HpDelta, TurnAdvance, etc.) require ACK for reliability
- **Reconnection Replay** — event buffer replays missed events on seamless rejoin
- **PlayerHpRequest** — DM-authority HP changes and CharDelta for efficient sync

### New Features
- **Interactive Battle Map** — players can drag their own token, distance measurement tool
- **Damage/Healing Animations** — floating number animations with critical hit effects (PlayerDamageOverlay)
- **Audio Feedback System** — Web Audio API sounds for damage, heal, crit, roll, and turn chime
- **Enhanced Chat** — /roll dice commands, /me emotes, sender colors, timestamps
- **Session Transcript Export** — export session transcript to markdown with Tauri file dialog
- **Keyboard Shortcuts** — Space (end turn), R (quick roll), Tab (cycle tabs), Escape (dismiss)

### Changes
- Removed standalone Dice Roller section from navigation (still available in character sheet)

---

## V0.7.1 — Combat Sync, Bug Fixes, QoL & UI Polish
**Released:** March 15, 2026

### Major Features
- **Combat State Bar** — players see initiative order, current turn, and round counter during combat
- **Monster HP Tiers** — monster health status shown as colored dots on initiative bar for players
- **Monster Conditions** — conditions (poisoned, prone, etc.) displayed as badges on initiative bar
- **Turn Notification** — audio chime + golden flash banner when it becomes your turn
- **Death Save Sync** — structured death save tracking synced between DM and players
- **HP Visibility Modes** — DM can toggle monster HP display: Tier / Percentage / Exact / Hidden
- **Condition Tooltips** — hover over conditions to see full 5e SRD mechanical descriptions
- **Prompt History** — DM can view and resend previous prompts from a collapsible history panel

### Bug Fixes
- Combat state (initiative, HP tiers, conditions) restored on player reconnect
- Combat state persists in crash-recovery snapshots
- Session timer persists across app restarts
- Fixed missing useMemo import in CharacterView causing crash

### QoL
- Empty state placeholders for combat lists when no creatures or initiative order exists

---

## V0.7.0 — Accurate Dice Modifiers, Magic Items & Polish
**Released:** March 14, 2026

### Dice & Roll System
- **Accurate Dice Modifiers** — all roll types (ability checks, saving throws, skills, attacks) correctly chain ability modifier + proficiency + item bonuses + condition effects per 5e RAW
- **Advantage/Disadvantage** — proper 5e cancellation rules (advantage + disadvantage = straight roll)
- **Multiplayer Roll Accuracy** — item bonuses synced in character snapshot for accurate remote rolls

### Magic Items
- **Magic Weapon Bonus** — equipped +1/+2/+3 weapons auto-add magic bonus to attack AND damage rolls
- **Magic Armor Bonus** — equipped +1/+2/+3 armor/shields auto-add magic bonus to AC with breakdown tooltip
- **Extra Damage Display** — weapons with extra damage (e.g., "2d6 fire") shown in attack roll results
- **Item Save Bonuses** — items like Cloak of Protection add save bonus to all saving throw rolls
- **Item Stat Bonuses** — items like Gauntlets of Ogre Power apply ability score bonuses to rolls
- **Magic Item Properties Form** — set magic bonus, extra damage, save bonus, and special properties on items

### QoL & Fixes
- **HP Undo** — 10-second undo window after damage or healing with one-click restore
- **Enter Key Submit** — press Enter to submit item forms and attack forms
- **Quest Search & Filter** — search quests by name, filter by status (active/completed/failed)
- **Form Validation** — empty item/combatant/NPC names blocked with error feedback
- **Negative Currency Prevention** — currency fields clamped to 0 minimum
- **NaN Weight Fix** — null/undefined weight no longer breaks encumbrance calculation

---

## V0.6.5 — NPC Intelligence, Story Engines & Advanced World Systems
**Released:** March 14, 2026

### Phase 6: NPC Intelligence & Decision Engines
- **NPC Personality System** — 8 archetypes (Schemer, Guardian, Merchant, Zealot, Outcast, Sage, Trickster, Noble) with auto-populated trait sets
- **34 Personality Traits** — toggleable traits that drive NPC behavior predictions in real-time
- **Trust Score System** — -100 to +100 trust with 7 labeled tiers (Sworn Enemy → Unbreakable Bond), 16 action types affect trust
- **NPC Memory System** — memories with intensity (1-10), emotional impact, decay rate; traumatic memories (8+) never decay
- **Behavior Prediction Engine** — live preview showing how NPCs respond to 7 situations (ask help, threaten, haggle, etc.)
- **Combat AI System** — intelligence-tiered suggestions (Mindless/Beast/Low/Average/Smart/Genius) with 6 personality combat styles
- **Monster AI Profiles** — 7 creature behavior profiles (Pack Hunter, Ambush Predator, Territorial, Mindless, Intelligent, Swarm, Boss)
- **Boss Phase System** — 3 HP-based phases (Testing → Escalation → Desperate) with escalating tactics
- **Consequence Engine** — 12 action templates (kill NPC, betray ally, steal, etc.) generating consequences with DM approval workflow
- **Dynamic Merchant Pricing** — multiplicative modifiers for location (9 types), trust, faction, demand, economy; haggling with DC adjustments
- **NPC Form Overhaul** — 3-tab NPC editor in campaign builder: Basics, Intelligence & Behavior, Combat
- **Difficulty Scaling** — real-time combat assessment (emergency/too hard/balanced/too easy) with tactical suggestions
- **Skill Check Resolver** — full engine with proficiency, expertise, advantage/disadvantage, conditions, contested checks

### Phase 7: Dynamic Story & Memory Systems
- **Story Threads** — major plotlines with 5 states (Dormant → Discovered → Investigating → Confrontation → Resolved)
- **Story Branches** — decision points with branching outcomes, consequence tracking, and session logging
- **Villain Profiles** — phase-based villain behavior, adaptations countering party tactics, master plans with power levels
- **Campaign Arcs** — high-level narrative arcs linking quests, NPCs, and story threads together
- **Campaign History Archive** — unified event log with category filtering, session grouping, bookmarking, and narrative significance
- **Campaign Secrets** — secret tracking with reveal conditions, known-by lists, narrative impact, and urgency levels

### Phase 8-9: Advanced Systems
- **Investigation Clues** — clue networks with red herrings, discovery DCs, mystery grouping, and solution requirements
- **Rumor Propagation** — rumors that spread between locations, distort over time, and auto-expire
- **World Crises** — escalating crises with severity (1-10), affected regions, resolution conditions, and auto-escalation
- **Artifact Evolution** — sentient items that absorb XP, level up, gain abilities, develop personality and curses
- **Session Replay Logging** — event sequence capture for session replay and audit
- **Roll Verification** — server-side roll verification infrastructure for multiplayer integrity
- **Shop/Merchant System** — full shop table with inventory, gold, location type, restock intervals, and NPC links

### Infrastructure & Bug Fixes
- **Migration Runner Hardened** — statements now execute individually; duplicate column and already-exists errors skipped gracefully on retry
- **Shops Table Created** — migration 6 now properly creates the shops table instead of altering a nonexistent one
- **Comment-Stripping Fix** — SQL comments no longer cause CREATE TABLE statements to be silently skipped
- **57 New Rust Commands** — NPC memory (7), consequences (6), story engine (25), advanced systems (19)
- **7 New Frontend Utilities** — npcBehavior, combatAI, merchantPricing, consequenceTemplates, difficultyScaling, monsterAI, skillCheckResolver

---

## V0.5.9 — Campaign Engine, Combat Automation & Polish
**Released:** March 13, 2026

### V4 Campaign Engine (DM↔Player Full Sync)
- Full data sync pipeline — conditions, HP, rest, loot, XP, spell slots now flow between DM and players
- 22+ new sync event types (hp_change, rest_sync, xp_award, death_save, concentration, reactions, etc.)
- Expanded character snapshots with equipped weapons, spell slots, features, currency, death saves
- Player Combat HUD — tabbed interface (Attack/Spell/Items/Features) with action economy bar
- Death Save system — dramatic d20 overlay, nat 1/nat 20 handling, 3 success/failure tracking
- Concentration tracking — auto CON save on damage, auto-drop on fail
- Shared combat log — all players see attacks, damage, kills, and spell casts in real-time
- Turn notifications — audio chime, window title flash, gold banner on your turn
- Equipment selection overlay before combat starts
- Loot persistence — accepted loot writes items and gold to player inventory
- XP auto-distribution on encounter end with level-up detection
- Rest sync — DM triggers long/short rest, all players reset HP/slots/features
- Warlock Pact Magic slots recover on short rest
- Condition tick on turn advance — expired conditions auto-removed
- Reaction system — DM sends reaction prompts (Opportunity Attack, Counterspell, Shield) with 5s timer
- Player-to-player healing — healers target allies, HP auto-applies
- Inspiration sync — DM grants, player spends for advantage
- Monster condition persistence to DB and sync to players
- Quest completion rewards — pre-filled XP/gold/items auto-distributed
- Consequence system — one-click damage, conditions, item/gold loss on failed checks

### V5 Features (12)
- Player presence & connection status — green/yellow/red dots, disconnect toasts
- Condition auto-effects in combat — advantage/disadvantage applied based on active conditions
- Encounter difficulty live tracker — Easy/Medium/Hard/Deadly meter in DM combat panel
- Monster HP tiers for players — "Healthy/Bloodied/Critical" instead of exact numbers
- Initiative auto-roll — d20 + DEX mod for players and monsters
- Player quest journal & NPC directory — floating journal panel with localStorage persistence
- Multiclass support — editable secondary class with combined spell slot computation
- Session crash recovery — 30-second periodic snapshots with recovery banner
- Battle map token sync — DM token moves, fog, drawings sync to player view
- Shop & trading system — DM creates shops, players browse and buy

### Combat Automation
- Auto-damage application — incoming player attacks shown with "Apply to monster" dropdown
- Auto-concentration saves — damage to concentrating player auto-sends CON save prompt
- Legendary & lair actions — pip tracking, crown icons, lair action reminders
- Travel calculator — distance/speed/terrain inputs with encounter rolls per day
- Smart loot tables — CR-based treasure generation (individual vs hoard)
- Session recap generator — compiles action log into markdown recap
- Quick NPC generator — random name, race, occupation, personality, voice
- Auto-encumbrance warnings — weight checks after adding items
- One-click monster import — full stat blocks from SRD search
- Auto-populate character stats — fills HP, saves, speed from class/race
- Auto-level detection — XP threshold checking with level-up notification
- Enhanced rest summaries — detailed itemized rest effects

### Polish & New Features
- Animated dice roller — tumbling animation, d6 pip faces, gold particle burst on nat 20, red shatter on nat 1
- Keyboard shortcuts — Ctrl+1-9 for sections, Ctrl+R quick roll, `?` for help overlay, hints in sidebar
- In-character chat — floating panel with IC/OOC modes, /roll commands, class-colored names
- Mood/music sync — 7 scene moods + 9 ambient sounds with colored vignette overlays and Web Audio
- Cover system — half/three-quarter/full cover toggles with AC modifiers synced to players
- Grapple & shove mechanics — special combat actions with contested Athletics checks
- Exhaustion auto-effects — levels 1-6 with auto penalties, color-coded badges, warning banners
- Combat stats dashboard — damage dealt/taken, hit rate %, crits, kills, healing, session duration
- Mobile responsive CSS — touch-friendly breakpoints at 768px/480px, stacking grids
- Print-friendly stylesheet — clean B&W print layout, hides UI chrome
- PDF character export — generates print-ready character sheet with ExportButton component
- Offline action queue — queues actions when disconnected, replays on reconnect
- Community campaigns show quest count + estimated completion time/sessions
- DM name collected on campaign creation, shown to joining players with campaign name
- Campaign auto-select for DM sessions (removed unnecessary dropdown)
- Player/campaign caps — max 20 players per room, max 20 campaigns
- Attunement limit enforcement — max 3 attuned items

---

## V0.5.5 — OTA Live Updates, UX Improvements & Report System
**Released:** March 13, 2026

### OTA Live Updates (No Reinstall Required)
- Installed apps now auto-download the latest frontend from GitHub on launch
- Custom `codex://` protocol serves updated files from app data directory
- Falls back to embedded frontend if no update available
- Polls every 30 seconds for new versions and auto-applies
- No need to rebuild or reinstall the Tauri app for frontend changes

### Dice Roller Improvements
- Removed floating dice roller button — now accessible from sidebar under Tools
- Added 12 premade roll label chips: Attack Roll, Damage, Initiative, Saving Throw, Ability Check, Skill Check, Death Save, Concentration, Wild Magic, Hit Dice, Sneak Attack, Smite
- Enhanced roll mode display — advantage/disadvantage shows color-coded badges, glowing card borders, and icons

### Settings Enhancements
- Brightness slider — adjustable from 40% to 130% under Appearance
- Compact density reduced to 0.6 for better fit on ≤24" screens

### Bug Reports & Feature Requests
- Reports now save to app data directory (not desktop/repo)
- Files saved as `.txt` with human-readable names: "March 13 2026 11-45 PM.txt"
- Reports always return "submitted" instead of "queued"

### Cleanup
- Removed floating dice roller button (bottom-left)
- Removed quick journal note button and all keyboard shortcuts
- Removed `gh` CLI dependency for report submission

---

## V0.5.4 — Session Monitor, Community Campaigns Fix & Feature Request
**Released:** March 13, 2026

### Session Monitor (Background Error Reporter)
- **Automatic crash reporting** — captures uncaught errors, unhandled promise rejections, and console errors in the background
- **Batched uploads** — errors are queued and submitted to GitHub Issues every 5 minutes or when 50+ errors accumulate
- **Rate limiting** — max 1 auto-report per 10 minutes to avoid spam
- **Deduplication** — identical errors within 30 seconds are merged
- **Session tracking** — each report includes session ID, app version, OS, screen size, and timestamps
- Reports are submitted via the existing `submit_bug_report` system (uses `gh` CLI or offline queue)

### Community Campaigns Fix
- **CSP policy updated** — added `api.github.com` and `raw.githubusercontent.com` to allowed origins
- Community/premade campaigns from 5etools homebrew repository now load correctly in production builds

### Feature Request
- Feature Request section is available in both Player and DM sidebar under Tools (was already there — confirmed working)

---

## V0.5.3 — DM Content Creation Tools & Update System
**Released:** March 13, 2026

### Quest Creation Improvements
- **8 Quick Templates** — Bounty Hunt, Rescue Mission, Fetch Quest, Escort Mission, Dungeon Delve, Investigation, Defense/Siege, Political Intrigue — pre-fill quest type, description, objectives, and difficulty
- **Suggested Objectives** — clickable chips below the objective input for common objectives (Defeat the enemy, Find the hidden item, Speak to the contact, etc.)

### NPC Creation Improvements
- **6 NPC Templates** — Tavern Keeper, Mysterious Stranger, Quest Giver, Rival Adventurer, Wise Sage, Shady Merchant — pre-fill role, race, class, disposition, and description
- **Random Name Generator** — button next to name input picks from 26 fantasy names
- **Race & Class Dropdowns** — autocomplete datalists for 16 races and 20 classes/occupations (still allows custom input)

### Lore Creation Improvements
- **6 Lore Templates** — Tavern/Inn, Town/City, Dungeon, Faction, Legend/Myth, Magic Item — pre-fill category and structured markdown body templates
- Templates provide formatted sections (Population, Government, Landmarks, etc.) for quick note creation

### Update Banner
- **Works in production** — update check now runs in both dev and production builds (was dev-only)
- **Check-only by default** — no longer auto-pulls; shows banner and lets user click "UPDATE NOW"
- **Dismiss button** — X button to close the banner if you don't want to update now
- **Failed state** — red-tinted banner with warning icon when update fails

---

## V0.5.2 — Character Sheet UX, Floating Dice & Campaign Management
**Released:** March 13, 2026

### Dice Rolling Visibility
- **Ability score cards** — hover reveals dice icon, click any ability to roll a check
- **Saving throw rows** — dice button appears on hover, rolls the save
- **Skill rows** — dice icon on hover, click skill name or icon to roll
- **Dismissible hint banner** — "Click any stat to roll!" shown once, persists via localStorage

### Floating Dice Roller
- **Floating panel** — dice roller removed from sidebar, now a floating gold button (bottom-right) accessible from any page
- **Minimize/expand** — panel state persisted to localStorage
- Standalone roller kept for custom expressions (2d6+3, 4d8), damage rolls, and macros

### Starting Equipment
- **Auto-equip on character creation** — each of the 12 PHB classes now has starting equipment and starting gold defined in `rules5e.js`
- Equipment auto-added to inventory during `finishSetup()` along with class-appropriate starting gold

### Campaign Type System
- **Homebrew vs Premade** — new campaign type selector on creation (stored in DB with migration)
- **Sidebar filtering** — Homebrew Builder and Fantasy Calendar only show for homebrew campaigns
- **Campaign type badge** — displayed on campaign cards in the dashboard

### Campaign Export, Import & Archive
- **Export campaign** — download full campaign (scenes, NPCs, quests, handouts) as JSON
- **Import campaign** — upload exported JSON to create a new campaign with fresh UUIDs
- **Archive/unarchive** — soft-archive campaigns without deleting; toggle archived visibility on dashboard
- **Import card** — dashed-border import button in DM campaign grid

### Campaign Manager Consolidation
- Removed standalone Campaign Manager page — all campaign CRUD now lives on the Dashboard
- `/dm/campaigns` route redirects to `/`

### Expertise Color Fix
- Fixed mismatch between legend (purple) and actual diamond (was teal) — unified to purple

---

## V0.5.0 — Multiplayer Campaign Engine & Party Tools
**Released:** March 13, 2026

### DM Campaign Engine
- **Campaign List** — create, list, delete campaigns with ruleset selection (D&D 5e 2024/2014, PF2e, homebrew)
- **DM Lobby** — campaign headquarters with scene management, session recap, handouts, quest generator, and player connections
- **Live Session Runner** — initiative tracker, round counter, action log, real-time chat, session timer, and scene management
- **WebSocket Multiplayer** — real-time DM↔Player sync on port 7878; handles player rolls, character updates, concentration, and action approval

### Player Session
- **Player Join Flow** — enter DM's IP address + room code, select character, wait for DM approval
- **Player Session View** — see active scene, initiative order, chat, roll dice, receive handouts, and submit actions for DM approval

### DM Session Tools
- **Character Arc Manager** — track player character arcs through hooks, development, complications, climax, and resolution phases
- **Handouts Manager** — create handouts and reveal them to players with visibility toggle
- **Monster Panel** — search SRD monster database, add to encounters, track HP/damage/conditions/kills
- **Quest Generator** — AI-powered quest generation via Ollama based on party level, setting, and theme
- **Session Recap** — AI-powered session summary generation
- **World State Manager** — track world state entries by category (general, politics, geography, events, factions)

### D&D Beyond Import
- **DDBImportModal** — multi-step import wizard (input → preview → importing → done) for D&D Beyond JSON character exports
- **ddbImport parser** — converts D&D Beyond character export format to Codex internal format

### New Player Sections (9)
- **Battle Map** — interactive grid-based tactical map with token placement, conditions, and environmental drawing tools
- **Calendar (Harptos)** — full Forgotten Realms calendar with festivals, seasons, and day/year tracking
- **Downtime Activities** — track crafting, training, research, business operations, and carousing with skill checks and gold
- **Encounter Builder** — design balanced encounters by CR, party level, and difficulty using XP thresholds and SRD monster stat tables
- **Feature Request** — submit structured feature requests with category, title, description, and auto-generated request IDs
- **Homebrew Builder** — create and manage custom monsters, spells, and magic items with full stat blocks and validation
- **Party Analyzer** — analyze party composition for roles, abilities, darkvision, AC, HP, and encounter difficulty recommendations
- **Party Loot** — track shared party treasure, distribute coins/items, rarity sorting, and audit log
- **Soundboard** — procedural ambient audio (Web Audio API) with tavern, combat, forest, dungeon, storm, ocean, camp, and city channels

### Campaign Database (Rust)
- **campaign_db.rs** — dedicated campaigns.db with tables for campaigns, scenes, encounters, monsters, handouts, character arcs, and world state
- **session_ws.rs** — WebSocket server for real-time multiplayer sync with GameEvent enum handling
- **25+ new Tauri commands** — campaign management, session management, encounters, monsters, handouts, character arcs, world state, concentration, XP, level-up, rest, conditions, scenes, and WebSocket control

### Premade Campaigns
- 6 premade campaigns updated with new scene/encounter structure for DM mode (Cursed Village, Dragon Coast, Feywild Crossing, Goblin Mine, Shadow Academy, Siege of Ironhold)

### Sidebar & Navigation
- Player mode: new sections — Downtime, Party Loot, Homebrew Builder, Calendar, Party Analyzer, Soundboard, Feature Request
- DM mode: new sections — World Building (NPCs, Homebrew, Calendar), Encounter Builder, Battle Map
- New routes: `/dm/campaigns`, `/dm/campaigns/:id`, `/dm/campaigns/:id/session`, `/player/join`, `/player/session`

### Resources
- **SRD Monsters** — bundled `srd_monsters.json` (SRD monster stat blocks for encounter builder)
- **Multi-resolution icons** — added `icon_128.png`, `icon_256.png`, `icon_512.png`

### Technical
- **SessionContext** — Redux-style reducer for real-time session state (initiative, players, chat, action queue)
- **CampaignOverview** — campaign info display for player sessions
- Mode selection no longer persists — always shows ModeSelect on launch
- **NavigationBridge** — connects react-router navigate to ModeContext for cross-context routing
- Lazy-loaded DM/Player routes to keep main bundle lean

---

## V0.4.7 — Arcane Encyclopedia Redesign Phase 4: Power Features & Polish
**Released:** March 12, 2026

### Grid/List View Toggle
- **ViewToggle component** — switch between list and card grid layout when browsing or searching articles
- Grid view renders 2/3/4 column responsive cards with category-colored top borders, icons, and truncated summaries
- Preference persisted to localStorage (`codex-wiki-view`) so it survives navigation

### Keyboard Shortcuts
- **KeyboardShortcuts overlay** — press `?` or click the floating `?` button (bottom-left) to see all wiki shortcuts
- Shortcuts: `/` search, `?` help, `b` bookmark, `n` next article, `p` previous article, `Esc` close, `↑↓` navigate, `Enter` select
- AnimatePresence entry/exit animations, click-outside to dismiss

### Back to Top
- **BackToTop button** — floating scroll-to-top button appears when scrollY > 400px
- Positioned at `bottom-20 right-6` to avoid overlapping the ArcaneWidget AI assistant button

### Cross-Reference Hover Previews
- **CrossRefPreview component** — hover over any inline cross-reference link to see a tooltip card
- 400ms hover delay to avoid accidental triggers, lazy-fetches article data on first hover
- Shows article title, category badge, and summary (3-line clamp)

### Typography Enhancements
- **Drop Cap** — first paragraph of each article uses a decorative 4xl first letter in amber with float-left layout
- **Ornamental Section Dividers** — `##` headings render centered with gradient lines on either side

### Article Keyboard Navigation
- `n` key navigates to next article in category, `p` to previous
- `b` key toggles bookmark on current article
- All shortcuts disabled when input/textarea is focused

### Technical
- **4 new components**: `KeyboardShortcuts.jsx`, `BackToTop.jsx`, `CrossRefPreview.jsx`, `ViewToggle.jsx`
- **WikiPage.jsx** — added grid view, view toggle, keyboard shortcuts, back-to-top
- **WikiArticlePage.jsx** — added cross-ref hover previews, keyboard nav, drop cap, ornamental dividers, back-to-top, keyboard shortcuts

---

## V0.4.6 — Arcane Encyclopedia Redesign Phase 3: Article Experience
**Released:** March 12, 2026

### Reading Progress
- **Reading Progress Bar** — gold gradient bar fixed at the top of the viewport, fills as you scroll through an article
- Positioned below the dev banner in dev builds via `--dev-banner-h` CSS variable
- Amber glow shadow for visual impact, smooth width transitions

### Active Table of Contents
- **Scroll Spy** — IntersectionObserver tracks which heading is in view and highlights it in the sidebar TOC
- Active heading gets amber left border and subtle background highlight
- Inactive headings get hover effects with border reveal

### Inline Cross-Reference Links
- **Auto-linking** — article body text automatically detects mentions of related articles and renders them as clickable links
- Bold text matching a cross-reference becomes a gold link; plain text matches get dotted underlines colored by category
- Uses greedy longest-match-first algorithm to avoid partial matches on short titles
- Only titles with 3+ characters are eligible to prevent false positives

### Article Navigation
- **Next/Previous** — navigation arrows at the bottom of each article to move to adjacent articles within the same category (alphabetical order)
- Cards show article title and category badge
- **New backend command** — `wiki_adjacent_articles(category, slug)` queries prev/next by title within category

### Article Footer
- **Metadata display** — word count, estimated reading time (225 wpm), source book, and ruleset shown below content
- Uses lucide-react icons for visual consistency

### Enhanced Related Articles
- **Card layout** — related articles in sidebar rendered as cards with colored left borders instead of plain text links
- Category icon and label badge on each card
- Hover effects with border and background transitions

### Utility
- **Copy Link Button** — click the copy icon next to the article title to copy the URL; shows green checkmark for 2 seconds
- **Cross-Reference Count** — small indicator in sidebar showing how many articles are linked within the text

### Technical
- **4 new components**: `TableOfContents.jsx`, `ReadingProgress.jsx`, `ArticleFooter.jsx`, `ArticleNav.jsx`
- **1 new Rust command**: `wiki_adjacent_articles` registered in Tauri invoke handler
- **1 new API function**: `getAdjacentArticles()` in `wiki.js`
- **WikiArticlePage.jsx** — full rewrite integrating all new features, inline cross-reference engine

---

## V0.4.5 — Arcane Encyclopedia Redesign Phase 2: Search & Discovery
**Released:** March 12, 2026

### Command Palette Search
- **Instant Search Overlay** — press `/` anywhere to open a full command-palette with 200ms debounced search
- **Keyboard Navigation** — ↑↓ to navigate results, Enter to select, Esc to close
- **Recent Searches** — last 8 searches saved to localStorage for quick re-access
- **Category-colored results** — each result displays its category icon in the matching accent color
- **Keyboard hints footer** — visual guide for available shortcuts

### Search Filters
- **Category Filter Pills** — colored by `wikiCategoryConfig`, toggle multiple categories
- **Ruleset Toggle** — filter by All / 2014 / 2024 / Universal editions
- **Sort Options** — Relevance or Alphabetical ordering
- **Active Filter Count** — badge shows number of active filters
- **Clear All** — one-click reset of all active filters
- **Collapsible Panel** — expand/collapse with smooth animation

### Bookmarks
- **Toggle Bookmark** — filled/unfilled star button on every article page
- **Bookmarks Rail** — grid of bookmarked articles on wiki landing page with category-colored left borders
- **Remove on Hover** — X button appears on hover to remove bookmarks
- **50 bookmark limit** — localStorage-backed with `codex-wiki-bookmarks` key

### Reading History
- **Auto-record** — visiting any article automatically records it to history
- **Recently Viewed Rail** — horizontal scroll of recent articles on landing page
- **Time-ago Display** — "just now", "Xm ago", "Xh ago", "Xd ago" relative timestamps
- **Category-colored top borders** — each card uses category accent colors
- **20 entry limit** — deduplicates by slug, most recent first

### Technical
- **6 new component/hook files**: `WikiSearchPalette.jsx`, `SearchFilters.jsx`, `BookmarksList.jsx`, `RecentlyViewed.jsx`, `useWikiBookmarks.js`, `useWikiHistory.js`
- **WikiPage.jsx** — integrated search palette, bookmarks rail, recently viewed rail, filter state management
- **WikiArticlePage.jsx** — bookmark toggle button, auto-record reading history on load

---

## V0.4.4 — Arcane Encyclopedia Redesign Phase 1
**Released:** March 12, 2026

### Wiki Landing Page
- **Hero Section** — animated count-up stat counters (2,018 Articles, 30 Categories, 1,204 Cross-References) with gold shimmer title
- **Discover Rail** — 6 random featured articles on each visit, color-coded by category with accent top borders
- **Category Cards** — 31 categories with unique accent colors, lucide-react icons, descriptions, and hover glow effects
- **Random Article Button** — navigate to a random entry from any of the 2,000+ articles
- **Skeleton Loading** — animated placeholder cards during data fetch
- **Pagination Upgrade** — numbered page buttons with ellipsis and total count display

### Category Browsing
- **Subcategory Tabs** — horizontal scrollable pill bar to filter within categories (e.g., Abjuration, Conjuration for spells)
- **Category Header** — icon, label, description, and article count when browsing a category
- **3 new backend commands** — `wiki_stats`, `wiki_subcategories`, `wiki_random_articles`

### Article Detail Page
- **Spell Stat Blocks** — school-colored card with casting time/range/components/duration grid, concentration/ritual badges, class pills, higher levels
- **Monster Stat Blocks** — classic crimson-bordered block with 6-column ability score row + modifiers, CR badge, AC/HP/Speed, legendary indicator
- **Class Stat Blocks** — hit die badge, saving throw pills, armor/weapon/tool proficiencies, spellcasting indicator, subclass level
- **Equipment Stat Blocks** — 6-tier rarity coloring (Common through Artifact), damage/AC display, attunement badge, weight/cost, property pills
- **Race Stat Blocks** — size/speed/darkvision quick stats, ability bonus pills, languages, racial traits, subraces
- **Generic Fallback** — categories without dedicated stat blocks still render metadata as clean key-value panels
- **Table of Contents** — auto-generated sticky sidebar from article headings with scroll-to-section navigation
- **Breadcrumb Fix** — proper `<Link>` navigation (Wiki > Category > Article) instead of fragile `navigate(-1)`
- **Category-colored badges** — article badges and summary borders use each category's accent color
- **Related articles** — now display category-colored icons next to each linked article

### Technical
- **`wikiCategoryConfig.js`** — single source of truth for 31 category colors, icons, labels, and descriptions
- **`StatBlockRouter.jsx`** — automatically routes to the correct stat block renderer based on article category
- **9 new component files** in `components/wiki/` and `components/wiki/statblocks/`
- **3 new Rust commands** registered in Tauri invoke handler
- **Frontend API** — 3 new functions: `getWikiStats()`, `getSubcategories()`, `getRandomArticles()`

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
- New standalone UpdatesPage wrapper

### Dev Tools
- Removed Developer section from Player and DM sidebars (accessible only via Ctrl+Shift+D wrench icon)
- Fixed dev chat duplicate messages (fingerprint-based deduplication for UDP broadcast)

### Changelog
- Fixed version mismatch — "What's New" now correctly shows entries for the running version
- Added missing V0.4.1, V0.4.2, V0.4.3 changelog entries

### Version Sync
- All version files set to 0.1.5 BETA: version.js, package.json (frontend), tauri.conf.json, Cargo.toml

---

## V0.4.3 — Wiki Phase 7: NPCs, Adventures, Edition History & DM Reference
**Released:** March 12, 2026

### Arcane Encyclopedia — 2,000+ Articles Milestone!
- **70 new articles** — total now **2,018** (up from 1,950) — surpassing 2,000 articles!
- **1,204 cross-references** linking articles across categories
- Wiki expansion complete: from 964 → 2,018 articles across 7 phases

### Notable NPCs & Villains (30)
- **Villains** (16): Strahd von Zarovich, Acererak, Vecna, Tiamat, Demogorgon, Orcus, Lolth, Asmodeus, Xanathar, Halaster Blackcloak, Manshoon, Szass Tam, Iggwilv/Tasha, Lord Soth, Azalin Rex, Arkhan the Cruel
- **Heroes & Neutral** (14): Elminster, Drizzt Do'Urden, Mordenkainen, Volo, Minsc & Boo, Jarlaxle, Bruenor Battlehammer, Laeral Silverhand, Fizban, Bigby, Tenser, Raistlin Majere, Tasslehoff Burrfoot, Acquisitions Inc.

### Famous Adventures (20)
- **Classic**: Tomb of Horrors, Keep on the Borderlands, Ravenloft, Temple of Elemental Evil, Against the Giants, Queen of the Demonweb Pits, White Plume Mountain, Expedition to the Barrier Peaks, Red Hand of Doom
- **5e**: Lost Mine of Phandelver, Curse of Strahd, Storm King's Thunder, Tomb of Annihilation, Dragon Heist, Dungeon of the Mad Mage, Descent into Avernus, Rime of the Frostmaiden, Wild Beyond the Witchlight, Vecna: Eve of Ruin, Shattered Obelisk

### Edition History & Adaptation Guides (10)
- Complete D&D edition history (OD&D through 5e 2024)
- Cross-edition adaptation guides: 1e/2e→5e, 3e→5e, 4e→5e, magic items across editions, monster design evolution

### DM Reference (10)
- Encounter Building, Treasure Hoards, Random Encounters, NPC Generation, Trap Design, Downtime Activities, Travel & Exploration, Social Interaction, Magic Item Pricing, Session Zero Guide

### Version Sync
- All version files bumped to 0.4.3: VERSION, version.json, version.js, package.json (root + frontend), tauri.conf.json, Cargo.toml

---

## V0.4.2 — Wiki 5e 2024 Edition Rules
**Released:** March 12, 2026

### Arcane Encyclopedia — 5e 2024 Rules Update
- **38 new articles** — total now 1,950 (up from 1,912)
- Complete coverage of all 5e 2024 PHB changes vs 2014

### 2024 Rules Changes (23)
- **Overview**: Rules overview, terminology changes (Race→Species, Bloodied, d20 Test), character creation overhaul
- **All 12 class revisions**: Barbarian (Brutal Strike), Bard (unrestricted Magical Secrets), Cleric (Divine Order), Druid (Wild Shape pool), Fighter (Weapon Mastery), Monk (major overhaul), Paladin (Smite as spell), Ranger (revised features), Rogue (Cunning Strike), Sorcerer (Innate Sorcery), Warlock (Pact Boon at 1), Wizard (minor changes)
- **Systems**: Combat changes, Weapon Mastery (8 properties), spellcasting changes, feat system overhaul, rest changes, condition changes
- **Migration**: Notable removals (Artificer, Half-Elf/Half-Orc), 2014→2024 migration guide

### 2024 Character Options (15)
- **Origin Feats** (8): Alert, Crafter, Healer, Lucky, Magic Initiate, Musician, Savage Attacker, Tough
- **Epic Boons** (5): Combat Prowess, Fate, Irresistible Offense, Spell Recall, Truesight
- **System Articles** (2): 2024 Backgrounds overview (all 16), Heroic Inspiration

### Version Sync
- All version files bumped to 0.4.2: VERSION, version.json, version.js, package.json (root + frontend), tauri.conf.json, Cargo.toml

---

## V0.4.1 — Wiki Homebrew, Cross-Edition & Settings Expansion
**Released:** March 12, 2026

### Arcane Encyclopedia — Homebrew, Cross-Edition & Settings Update
- **58 new articles** — total now 1,912 (up from 1,854)
- 19 popular homebrew rules with full implementation details
- 30 cross-edition creatures (1e/2e/3.5e) with 5e adaptation guides
- 9 new campaign settings (Mystara, Birthright, Al-Qadim, Blackmoor, and more)

### New Homebrew Rules (19)
- **Combat**: Flanking Bonus, Powerful Crits, Lingering Injuries, Hidden Death Saves, Bonus Action Potions, Exhaustion from 0 HP, Crit/Fumble Tables
- **Character**: Free Feat at Level 1, Critical Skill Checks, Help Requires Proficiency, Point Buy Above 15, Revised Ranger (UA)
- **Magic**: Expanded Reincarnation Table, Resurrection Rituals (Mercer-style), Spell Point Variant
- **Other**: Rule of Cool, Gritty Realism Resting, Milestone Leveling, Buying Magic Items (with price tables)

### Cross-Edition Creatures (30)
- Creatures from AD&D 1e/2e/3.5e not in 5e, each with lore and practical 5e adaptation notes
- Celestials: Archons, Guardinal, Lillend
- Fiends: Bebilith, Hellcat, Mohrg
- Aberrations: Aranea, Chaos Beast, Destrachan, Delver, Digester
- Elementals: Arrowhawk, Belker, Rast, Thoqqua, Tojanida
- Fey: Grig, Nixie | Giants: Athach, Formian, Jann
- Beasts: Dragonne, Krenshar, Shocker Lizard, Spider Eater
- Undead: Nightcrawler, Ravid | Plants: Tendriculos, Phasm

### New Campaign Settings (9)
- Mystara, Birthright, Al-Qadim, Kara-Tur, Council of Wyrms, Blackmoor, Nentir Vale, Strixhaven, Radiant Citadel

### Version Sync
- All version files bumped to 0.4.1: VERSION, version.json, version.js, package.json (root + frontend), tauri.conf.json, Cargo.toml

---

## V0.4.0 — Wiki Deities & Pantheons Expansion
**Released:** March 12, 2026

### Arcane Encyclopedia — Deities & Pantheons Update
- **175 new deity articles** — total now 227 deities, 1,854 articles overall (up from 1,680)
- **261 new cross-references** (1,204 total) — pantheon links, divine rivalries, race connections, plane associations
- Complete coverage of all major D&D pantheons

### New Deities (by pantheon)
- **Forgotten Realms missing** (13): Bhaal, Deneir, Eldath, Gond, Leira, Lliira, Loviatar, Malar, Milil, Myrkul, Savras, Talona, Talos
- **Dragonlance** (21): Complete pantheon — Paladine, Takhisis, Mishakal, Gilean, Reorx, and all Gods of Good/Neutrality/Evil
- **Eberron** (20): The Sovereign Host (9), The Dark Six (6), plus Silver Flame, Blood of Vol, Path of Light, Undying Court, Cults of the Dragon Below
- **Elven / Seldarine** (10): Aerdrie Faenya, Angharradh, Deep Sashelas, Hanali Celanil, Labelas Enoreth, Rillifane Rallathil, and more
- **Drow / Dark Seldarine** (5): Eilistraee, Ghaunadaur, Kiaransalee, Selvetarm, Vhaeraun
- **Dwarven / Morndinsamman** (9): Berronar Truesilver, Clangeddin Silverbeard, Dumathoin, Abbathor, and more
- **Halfling** (5): Arvoreen, Brandobaris, Cyrrollalee, Sheela Peryroyl, Urogalan
- **Gnome** (8): Baervan Wildwanderer, Baravar Cloakshadow, Nebelun, Urdlen, and more
- **Orc** (5): Bahgtru, Ilneval, Luthic, Shargaas, Yurtrus
- **Goblinoid** (3): Maglubiyet, Bargrivyek, Nomog-Geaya
- **Draconic** (2): Sardior, Io (the Ninefold Dragon)
- **Giant / Ordning** (6): Annam All-Father, Stronmaus, Skoraeus Stonebones, Surtur, Thrym, Grolantor
- **Celtic** (14): The Daghdha, Lugh, Morrigan, Nuada, and more
- **Greek** (19): Zeus, Athena, Apollo, Ares, Hades, Hecate, Poseidon, and more
- **Egyptian** (14): Re-Horakhty, Anubis, Isis, Osiris, Set, Thoth, and more
- **Norse** (21): Odin, Thor, Loki, Freya, Hel, Heimdall, and more

### Version Sync
- All version files bumped to 0.4.0: VERSION, version.json, version.js, package.json (root + frontend), tauri.conf.json, Cargo.toml

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
