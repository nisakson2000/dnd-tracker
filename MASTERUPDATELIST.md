# The Codex — Master Update List

Complete version history from initial release to current. The in-app Updates tab shows the 8 most recent versions — this file contains everything.

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
