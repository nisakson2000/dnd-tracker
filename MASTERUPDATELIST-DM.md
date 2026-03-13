# The Codex — DM Mode Update List

All updates relevant to **DM Mode**. For Player-specific changes, see `MASTERUPDATELIST-PLAYER.md`. For the complete combined history, see `MASTERUPDATELIST.md`.

---

## V0.4.6 — Arcane Encyclopedia Redesign Phase 3: Article Experience
**Released:** March 12, 2026

### Article Reading Experience
- **Reading Progress Bar** — gold gradient bar at the top fills as you scroll
- **Active Table of Contents** — scroll-spy highlights current section in sidebar
- **Inline Cross-Reference Links** — article text auto-links related articles with category-colored underlines
- **Next/Previous Navigation** — arrows to navigate between articles in a category
- **Article Footer** — word count, reading time, source book
- **Copy Link Button** — copy article URL to clipboard
- **Enhanced Related Articles** — cards with category icons, colored borders, badge labels

---

## V0.4.5 — Arcane Encyclopedia Redesign Phase 2: Search & Discovery
**Released:** March 12, 2026

### Search & Discovery
- **Command Palette Search** — press `/` for instant search with keyboard navigation
- **Search Filters** — category pills, ruleset toggle, sort options
- **Bookmarks** — star articles, bookmark rail on landing page
- **Reading History** — auto-tracked recently viewed with time-ago display

---

## V0.4.4 — Arcane Encyclopedia Redesign Phase 1: Foundation & Visual Impact
**Released:** March 12, 2026

### Wiki Landing Page
- **Hero Section** — animated count-up stat counters with gold shimmer title
- **Category Cards** — 31 categories with unique colors, icons, hover glow
- **Discover Rail** — 6 random featured articles per visit
- **Subcategory Tabs** — filter pills within categories

### Article Detail Page
- **Stat Blocks** — Spell, Monster, Class, Equipment, Race category-specific renderers
- **Table of Contents** — auto-generated sticky sidebar
- **Breadcrumb Navigation** — proper linked breadcrumbs

### DM Reference
- DM tools and reference articles accessible through enhanced wiki search and filters

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
- Notable NPCs & Villains (30), Famous Adventures (20), Edition History & Adaptation Guides (10)

### DM Reference (10)
- Encounter Building, Treasure Hoards, Random Encounters, NPC Generation, Trap Design, Downtime Activities, Travel & Exploration, Social Interaction, Magic Item Pricing, Session Zero Guide

---

## V0.4.2 — Wiki 5e 2024 Edition Rules
**Released:** March 12, 2026

### Arcane Encyclopedia — 5e 2024 Rules Update
- **38 new articles** — complete coverage of all 5e 2024 PHB changes vs 2014
- All 12 class revisions, combat changes, Weapon Mastery, feat system overhaul
- Migration guide: 2014→2024 changes, notable removals

---

## V0.4.1 — Wiki Homebrew, Cross-Edition & Settings Expansion
**Released:** March 12, 2026

### Arcane Encyclopedia
- **58 new articles** — 19 homebrew rules, 30 cross-edition creatures, 9 new campaign settings
- Campaign settings: Mystara, Birthright, Al-Qadim, Kara-Tur, Council of Wyrms, Blackmoor, Nentir Vale, Strixhaven, Radiant Citadel

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
- Rust-side Ollama proxy — all AI communication routed through backend
- Wiki-powered responses — searches 964+ articles before every query
- Floating ArcaneWidget available on all sections

---

## V0.3.1 — Party Connect Overhaul
**Released:** March 11, 2026

### Party Connect
- Persistent WebSocket connection across section navigation
- DM sees "Host a Session" interface

---

## V0.3.0 — Arcane Advisor (AI Assistant)
**Released:** March 12, 2026

### Arcane Advisor
- AI-powered D&D companion running locally via Ollama
- Context-aware conversations, streaming responses

---

## V0.2.9 — Import Character & Error Logging
**Released:** March 12, 2026

### Dashboard
- **Import Existing Character** — import previously exported JSON files

---

## V0.2.8 — The Big 50: Comprehensive Feature & QOL Overhaul
**Released:** March 11, 2026

### DM Campaign Hub
- DM Quick Reference — DC guidelines, damage by level, cover, lighting, travel pace
- Encounter Difficulty Calculator — XP thresholds by party size and level
- Session Planning Checklist (6 prep items with checkboxes)

### DM Party
- Party Stats Overview — aggregate HP %, lowest HP member, level range, party size

### Shared Features (also in Player Mode)
- NPCs: Relationship Tracker, Quest Hooks, Role-colored avatars
- Quests: Reward Tracking, Priority System, Quest Giver & Location
- Journal: Session Summary Stats, NPC Mentions, Pin Important Entries
- Lore & World Notes: Category Presets, Related Entries, Entry Type Icons
- Sidebar: Pinned Sections, Section Search
- Dashboard: Character Duplicate, Quick Stats Bar, Character Search

---

## V0.2.7 — Player/DM Mode System & Character Setup
**Released:** March 11, 2026

### DM Mode
- Mode Select screen with animated role picker
- DM Campaign Hub — session/NPC/quest/lore stats and quick-start actions
- DM-specific sidebar with Campaign, Combat, Party, and Tools groups
- Campaign creation flow — DMs create campaigns with simplified 2-step modal
- Purple-themed campaign cards on Dashboard

---

## V0.2.6 — Security, Stability & Bug Fixes
**Released:** March 11, 2026

- XSS vulnerability fixed in WikiPage
- React Error Boundaries per section
- Party WebSocket race conditions fixed

---

## V0.2.5 — Combat, Spellbook, Journal & Section Upgrades
**Released:** March 11, 2026

- NPCs: role-colored borders, markdown notes, duplicate button
- Quests: difficulty ratings, markdown notes, failed quest section
- Lore: word count, reading time, markdown rendering
- Journal: export to text, mood tagging, fullscreen reading mode

---

## V0.2.4 — QOL Overhaul: Performance, Accessibility & Bug Reporter
**Released:** March 11, 2026

- Sorting and search across multiple sections
- Memoization pass, bundle reduced 33%, SQLite tuning
- Keyboard navigation, ARIA labels, screen reader support

---

## V0.2.1 — Connection Hardening & Stability
**Released:** March 10, 2026

- Party Connect: auto-reconnect, host reassignment, zombie cleanup

---

## V0.2.0 — LAN Party & Auto-Updates
**Released:** March 10, 2026

- LAN Party Connect with IP + room code
- Midnight Glass V3 UI, 6 themes

---

## V0.1.9 — UI Themes
**Released:** March 10, 2026

- Midnight Glass V3 glassmorphism redesign, 6 preset themes
- Custom accent color, UI scale, font/density controls

---

## V0.1.8 — Character Creation & Auto-Backup
**Released:** March 10, 2026

- Auto-backup every 5 minutes

---

## V0.1.7 — Party Connect Improvements
**Released:** March 2026

- Room codes, member cards, auto-sync stats

---

## V0.1.5 — Tauri Migration
**Released:** February 20, 2026

- Migrated from Python/FastAPI to Tauri 2 (Rust backend)

---

## V0.1.4 — Wiki & Rules Reference
**Released:** February 2026

- Arcane Encyclopedia (964 articles), Rules Reference section

---

## V0.1.3 — Campaign Tools
**Released:** February 2026

- Campaign Journal, Quest Tracker, NPC Tracker, Lore & World Notes

---

## V0.1.0 — Initial Release
**Released:** January 15, 2026

- Campaign journal, quest tracker, NPC tracker, lore notes
- Arcane Encyclopedia (964 articles), Party Connect
- 5 UI themes
