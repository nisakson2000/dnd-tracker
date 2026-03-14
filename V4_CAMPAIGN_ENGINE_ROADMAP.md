# V4 Campaign Engine Roadmap

> Synthesized from the 56-issue deep audit of the entire multiplayer campaign engine.
> 8 phases, ordered by impact and dependency chain.

---

## Phase 1: Prompt & Response Pipeline Fix

**Goal:** Make prompts fully functional end-to-end with correct identity, evaluation, and persistence.

### Issues
- **CRITICAL:** `PlayerPromptPopup.jsx` hardcodes `name: 'Me'` in all responses — DM sees every response labeled "Me" instead of the player's character name
- **CRITICAL:** Roll results have no modifier/proficiency support — raw d20 only, no ability modifier or proficiency bonus applied
- **CRITICAL:** DC evaluation is client-side only — DM has no pass/fail summary, must manually compare each result
- No prompt history — prompts vanish after response, no way to review past checks
- No "re-prompt" — DM can't resend a failed prompt or ask for a reroll (e.g., inspiration reroll)
- Quick Checks don't specify which ability modifier to use — players don't know what to add
- No advantage/disadvantage support in prompt rolls

### Implementation
1. Fix `PlayerPromptPopup` to send `name: character.name` from PartyContext member data
2. Add `modifier` field to prompt responses — player's app calculates ability mod + proficiency
3. Add `pass`/`fail` auto-evaluation on DM side based on DC
4. Add prompt history panel (DM-side) showing all sent prompts with aggregated results
5. Add advantage/disadvantage toggle to Quick Checks
6. Store prompt history in session log for post-session review

---

## Phase 2: Gold, Currency & Loot System

**Goal:** Track party and individual wealth, award gold from quests/encounters, and manage loot distribution.

### New Features
- **Party Gold Tracker** — shared party fund visible to DM and all players
- **Individual Gold** — each player tracks personal gold (cp/sp/gp/pp with auto-conversion)
- **Quest Rewards** — DM can attach gold rewards to quests, auto-awarded on completion
- **Encounter Loot** — loot tables per encounter, rolled on monster kill or encounter end
- **Loot Distribution** — DM broadcasts loot and players claim/split items
- **Treasure Hoard Generator** — CR-based random treasure per DMG tables
- **Shop System** — DM creates shops with inventory, players browse and buy during session

### Implementation
1. New DB table: `party_gold` (party_id, cp, sp, gp, pp, last_updated)
2. New DB table: `loot_drops` (encounter_id, items JSON, gold, claimed_by)
3. Quest schema: add `gold_reward` and `item_rewards` fields
4. New sync events: `gold_update`, `loot_dropped`, `loot_claimed`
5. Player-side gold display in Overview section
6. DM-side gold management in Campaign panel

---

## Phase 3: Combat Sync & Visibility Improvements

**Goal:** Full combat transparency between DM and players, with proper state sync.

### Issues
- **CRITICAL:** Monster HP not visible to players — they have no idea how hurt enemies are (should show health tier: Healthy/Bloodied/Near Death)
- **CRITICAL:** Conditions applied to monsters don't sync to players — only DM sees them
- Turn notifications don't alert the active player (no sound/visual pulse)
- Initiative order not visible to players
- Monster names may spoil encounters — need "revealed vs hidden" name toggle
- No "delay turn" or "ready action" support
- Death saving throws not synced to DM

### Implementation
1. New sync event: `combat_state` — broadcasts full combat state (initiative order, monster health tiers, conditions, round, turn)
2. Player combat bar: show initiative order, current turn highlight, monster health tiers (not exact HP)
3. Active turn notification: visual pulse + optional sound for "It's your turn!"
4. Condition sync: broadcast monster conditions so players can strategize
5. "Reveal/Hide" monster name toggle — DM controls what players see
6. Player death save sync: `death_save_update` event so DM sees player death saves in real-time
7. Ready/delay action support in initiative tracker

---

## Phase 4: Random Encounters & Dynamic Events

**Goal:** DM can trigger random encounters from tables, and dynamic events can fire based on conditions.

### New Features
- **Random Encounter Tables** — per-region/biome encounter lists with CR ranges and weights
- **Roll Random Encounter** — one-click generates a balanced encounter from the active table
- **Travel Encounters** — auto-roll for encounters during travel segments based on danger level
- **Dynamic Events** — timed or conditional events (e.g., "after 3 rounds, reinforcements arrive")
- **Lair Actions** — automated lair action prompts on initiative count 20
- **Wandering Monsters** — background timer for dungeon crawl encounter checks

### Implementation
1. New DB table: `encounter_tables` (campaign_id, name, region, entries JSON with monster_id, weight, min_cr, max_cr)
2. Encounter generator: picks from table, scales to party level, auto-populates combat
3. Travel mode UI: set distance, terrain, danger level → auto-rolls encounter checks
4. Dynamic event scheduler: DM sets triggers (round X, HP threshold, timer) → auto-fires
5. Lair action template system with auto-prompt on initiative 20

---

## Phase 5: Session Persistence & Recovery

**Goal:** Sessions survive crashes, disconnects, and app restarts. Full session history for review.

### Issues
- **CRITICAL:** No session recovery — if DM's app crashes, entire session state is lost
- No reconnect handling — if a player disconnects and reconnects, they miss all state
- Session timer doesn't persist — restarting resets to 0:00
- Combat state is in-memory only — crash = lost encounter
- No session summary/recap generation

### Implementation
1. Periodic session state snapshot to DB (every 30s): combat state, scene, timer, XP, prompts
2. On DM reconnect: detect active session, offer "Resume Session" with full state restore
3. On player reconnect: send full state catch-up (current scene, combat state, active prompts, broadcasts)
4. Session history table: store completed sessions with duration, XP awarded, scenes visited, encounters fought
5. Post-session summary: auto-generate recap with key events, XP breakdown, loot awarded
6. "Session Notes" — DM can add timestamped notes during play, saved to session record

---

## Phase 6: Player-Side Content (Quest Journal, NPC Directory, Handouts)

**Goal:** Players get persistent, searchable access to all DM-revealed content.

### Issues
- Players receive NPC/quest reveals as one-time broadcasts — no persistent storage
- No quest journal on player side — they can't review active quests
- No NPC directory — players forget NPC names and roles
- Handouts are fire-and-forget — no archive to re-read them
- No map sharing — DM can't send map images to players

### Implementation
1. Player-side `discovered_npcs` state: populated by `npc_updated` events, persisted to localStorage
2. Player-side `active_quests` state: populated by `quest_updated` events, with objective tracking
3. Player-side `handout_archive`: all received handouts stored and browsable
4. New player sections (or tabs within existing): "Quest Journal", "NPCs", "Handouts"
5. Map sharing: DM sends map image URL via broadcast, players can zoom/pan
6. Searchable across all player-side content

---

## Phase 7: Advanced DM Tools

**Goal:** Power-user DM features for complex campaigns.

### New Features
- **Initiative Roller** — auto-roll initiative for all monsters with DEX mods from SRD data
- **Encounter Difficulty Calculator** — shows Easy/Medium/Hard/Deadly based on party level and monster XP
- **Condition Reference** — inline tooltips explaining each condition's mechanical effects
- **NPC Stat Blocks** — quick-view monster/NPC stats during combat without leaving the panel
- **Session Prep Checklist** — DM pre-session todo list (review NPCs, prep encounters, set scenes)
- **Music/Ambiance Cues** — tag scenes with soundboard presets, auto-switch on scene change
- **Multi-encounter Chains** — link encounters in sequence (defeat goblins → boss appears)

### Implementation
1. Auto-initiative: pull monster DEX from SRD data, roll d20+DEX for each
2. Difficulty calc: sum monster XP, compare to DMG XP thresholds for party size/level
3. Condition tooltips: 5e SRD condition text in hover/popover
4. Inline stat blocks: modal or slide-out with monster stats from SRD database
5. Prep checklist: simple todo list per session, persisted to campaign data
6. Encounter chaining: `next_encounter_id` field, auto-triggers on current encounter completion

---

## Phase 8: Polish, Performance & Edge Cases

**Goal:** Harden the entire system for reliability and smooth UX.

### Issues
- WebSocket message ordering not guaranteed — out-of-order events can corrupt state
- No rate limiting on broadcasts — DM spam could overwhelm players
- Large party (6+ players) untested — prompt responses may flood DM panel
- No "typing indicator" or "player online" status beyond connection
- Error toasts can stack and overwhelm the screen
- No dark/light theme support for DM panels (currently hardcoded dark)
- Campaign export doesn't include session history or encounter data
- No undo for DM actions (accidentally ended session, killed wrong monster)

### Implementation
1. Message sequence numbers: each event gets a monotonic ID, client reorders if needed
2. Broadcast rate limiter: max 1 broadcast per 2 seconds, queue excess
3. Prompt response pagination: group by prompt, collapse when >4 responses
4. Player presence: periodic heartbeat, show "online/idle/disconnected" per player
5. Toast manager: max 3 visible, auto-dismiss, priority queue
6. DM panel theme: inherit from app theme settings
7. Campaign export V2: include sessions, encounters, logs
8. Undo stack: last 5 DM actions reversible (monster kill, session end, scene change)

---

## Priority Order

| Phase | Impact | Effort | Priority |
|-------|--------|--------|----------|
| 1. Prompt Pipeline | CRITICAL | Medium | P0 — blocks all prompt features |
| 3. Combat Sync | CRITICAL | Medium | P0 — players are blind during combat |
| 5. Session Recovery | CRITICAL | High | P1 — data loss on crash |
| 2. Gold & Loot | HIGH | High | P1 — core D&D loop |
| 6. Player Content | HIGH | Medium | P1 — retention and engagement |
| 4. Random Encounters | MEDIUM | Medium | P2 — nice-to-have |
| 7. Advanced DM Tools | MEDIUM | High | P2 — power users |
| 8. Polish & Edge Cases | LOW-MED | Medium | P3 — ongoing |

---

*Generated from the V3 deep audit of the campaign multiplayer engine.*
*56 issues identified, categorized, and organized into actionable phases.*
