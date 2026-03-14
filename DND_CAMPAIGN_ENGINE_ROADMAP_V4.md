# D&D Campaign Engine — V4 Roadmap

## Philosophy: Migrate → Wire → Automate → Extend → Innovate → Polish

The V0.5.9 codebase already has ~60% of proposed features built as localStorage implementations (calendar, battle map, homebrew, legendary actions, condition effects data, whispers, battle map sync, mood/ambient sync). The real work is **migrating** localStorage to database, **wiring** existing data into combat resolution, **automating** remaining combat bookkeeping, then **extending**, **innovating**, and **polishing**.

### Guiding Principles

1. **Never lose campaign data.** Every migration preserves existing data. Every new feature stores to DB, not localStorage.
2. **Ship playable increments.** Each layer produces a usable improvement — no 6-week gaps between visible progress.
3. **DM cognitive load is the bottleneck.** Features that reduce mid-session mental overhead get priority over prep tools.
4. **Existing code is an asset.** Refactor and connect before rewriting. Dozens of partially-built features just need wiring.
5. **Multiplayer correctness over features.** A synced feature that works is worth more than two unsynced features.

---

## Architecture Baseline — What Already Exists

### Fully Built (localStorage, needs DB migration only)

| Feature | File | Storage Key | UI Code |
|---------|------|-------------|---------|
| Harptos Calendar (moon phases, festivals, seasons, events, timeline, day advance) | `Calendar.jsx` | `codex-calendar-${characterId}` | ~500 lines |
| Battle Map (tokens, fog, hex/square grids, pan/zoom, drawings, bg images, measurement) | `BattleMap.jsx` | `codex_battle_map_state` | ~800 lines |
| Homebrew Builder (monster/spell/item creation, CR balance checking, DMG tables) | `HomebrewBuilder.jsx` | `codex_homebrew_library` | ~600 lines |
| DM Session Notes | DmCombatPanel refs | `codex_dm_session_notes_${id}` | inline |

### Partially Built (state/data exists, logic incomplete)

| Feature | Where | Exists | Missing |
|---------|-------|--------|---------|
| Legendary action pips | `DmCombatPanel.jsx:77-78` | Pip counter, reset on turn, use action | DB persistence, player sync |
| Lair action reminder | `DmCombatPanel.jsx:101-107,391` | Detection from stat block, round reminder | Auto-insert at initiative 20 |
| Concentration saves | `DmCombatPanel.jsx:215-246` | Auto-prompt CON save on damage, DC calc | Auto-drop on failed save |
| Condition effects data | `conditionEffects.js` | All 15 conditions with mechanical effects | Not wired into combat resolution |
| Battle map sync | `CampaignSyncContext.jsx:46,234-259` | State slot + 5 event handlers | DM broadcast calls need completing |
| Mood/ambient sync | `CampaignSyncContext.jsx:50-51,262-268` | State slots + event handlers | No DM trigger UI, no audio playback |
| Whisper system | `CampaignSyncContext.jsx` + party protocol | `dm_whisper` event, `sendTargetedEvent` | No player→DM, no history UI |
| Cover system | `DmCombatPanel.jsx:80-81,348-376` | Full cover cycling, AC bonus calc, sync | Not integrated with damage automation |
| Exhaustion tracking | `DmCombatPanel.jsx:378-386` | Color scale for 6 levels | No mechanical effect automation |
| Turn timer | `DmCombatPanel.jsx:66-68,162-172` | Per-turn countdown, enable/disable | No pacing alerts, no averages |
| Keyboard shortcuts help | `KeyboardShortcutsHelp.jsx` | Visual overlay component | No configurable bindings |
| Monster HP tiers | `CampaignSyncContext.jsx:45,113-118` | Tiered HP display for players | Working correctly |
| Incoming player attacks | `CampaignSyncContext.jsx:49,177-183` | DM receives attack data with damage rolls | Target selection + auto-apply works |
| Death saves | `DmCombatPanel.jsx:63` | State tracking `{ clientId: { successes, failures } }`, DM prompt, party event | No rule automation (nat 20, 3 fails = death, etc.) |
| Spell slot events | `CampaignSyncContext.jsx:213` | `spell_slot_update` event listener exists | Handler is empty comment |
| Session recap | `SessionRecap.jsx` | AI recap via Ollama | No fallback when Ollama is unavailable |
| Auto backup | `useAutoBackup.js` | Character backup | No campaign backup |
| Crash recovery | `useCrashRecovery.js` | Session snapshot every 30s | Doesn't cover new combat state |

### Not Built (genuinely new)

Factions, locations, NPC relationships, dialogue system, calendar DB tables, weather, environmental hazards, AoE calculator, map layers, analytics, party inventory, voting, campaign-wide search, encounter duplication, monster variants, loot generation, projector view, mobile responsive player view, token auras.

---

## Release Milestones

| Release | Layers | Theme | Key Deliverable |
|---------|--------|-------|-----------------|
| **v0.6.0** | Layer 1 (Migrate) | Data Safety | All campaign data in DB, survives cache clears |
| **v0.7.0** | Layer 2 (Wire) | Combat Works | Conditions, damage types, legendary actions mechanically enforced |
| **v0.8.0** | Layer 3 (Automate) | Zero Bookkeeping | Death saves, multiattack, readied actions, spell slot visibility automated |
| **v0.9.0** | Layer 4 (Extend) | World Building | Factions, locations, NPC relationships, calendar weather, hazards |
| **v1.0.0** | Layer 5 (Innovate) | Full VTT | Fog of war, AoE, map layers, analytics, party inventory |
| **v1.1.0** | Layer 6 (Polish) | Production Ready | Mobile support, projector view, backups, validation, performance |

---

## Layer 1: MIGRATE — localStorage → Database

**Goal:** Eliminate all campaign-data-in-localStorage. Every migration: new table → Rust CRUD commands → swap localStorage calls to invoke() → delete old storage code.

**Total effort: ~10 days**

**Risk:** Data loss during migration. **Mitigation:** Every M-item includes auto-migration logic that reads from localStorage on first load, writes to DB, then clears the localStorage key. Manual "Export Campaign" before migration available as safety net.

---

### ~~M1: Schema Migration Runner~~ ✅ COMPLETE

Versioned migration system replacing ad-hoc schema management.

- `src-tauri/src/migrations.rs` — New. `run_migrations()` runner with `schema_versions` tracking table. `CAMPAIGN_MIGRATIONS` array with baseline schema as migration #1. Future migrations append to this array.
- `src-tauri/src/campaign_db.rs` — Reduced from 205 → 16 lines. Opens DB and calls `run_migrations()`.
- `src-tauri/src/main.rs` — Added `mod migrations;`

---

### M2: Calendar → Database (2 days)

**Problem:** Calendar is per-character via localStorage. Should be per-campaign via DB. A cache clear or browser migration wipes all calendar events — DMs have lost session-planned festivals and plot dates.

**Migration SQL (#4):**

```sql
CREATE TABLE IF NOT EXISTS campaign_calendar (
    campaign_id TEXT PRIMARY KEY REFERENCES campaigns(id),
    current_year INTEGER NOT NULL DEFAULT 1492,
    current_month INTEGER NOT NULL DEFAULT 0,
    current_day INTEGER NOT NULL DEFAULT 1,
    calendar_system TEXT NOT NULL DEFAULT 'harptos',
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS calendar_events (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id),
    date_key TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    event_type TEXT DEFAULT 'custom',
    session_label TEXT DEFAULT '',
    recurrence_rule TEXT,
    created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_calendar_events_campaign ON calendar_events(campaign_id, date_key);
```

**New Rust file:** `src-tauri/src/commands/calendar.rs`
- `get_campaign_calendar(state) → { year, month, day, system }`
- `advance_campaign_date(state, days: i32) → { year, month, day }` — handles month/year rollover using Harptos rules (12 months of 30 days + 5 intercalary holidays)
- `set_campaign_date(state, year, month, day)`
- `get_calendar_events(state, year, month) → Vec<Event>`
- `add_calendar_event(state, date_key, title, description, event_type) → Event`
- `remove_calendar_event(state, event_id)`
- `set_calendar_system(state, system: String)` — "harptos" | "greyhawk" | "custom"

**Frontend changes to `Calendar.jsx`:**
- Replace `loadCalendarData(characterId)` (line 101) with `invoke('get_campaign_calendar')`
- Replace `saveCalendarData(characterId, data)` (line 108) with individual invoke calls
- Change prop from `characterId` to campaign context
- Keep ALL existing UI (grid, festivals, moon phases, timeline, advance controls)

**Sync:** `calendar_advance` party event → players see date changes in real time.

**Auto-migration:** On first load with no DB row, scan localStorage for any `codex-calendar-*` keys, import the most recent one, then clear all matching keys.

**Validation:**
1. Create campaign → calendar shows default 1492 Hammer 1
2. Add event → close app → reopen → event persists
3. Advance 5 days → player sees date change via party event
4. Export campaign → import on fresh install → calendar + events intact
5. `localStorage.getItem('codex-calendar-*')` returns null after migration
6. Advance through month boundary (Hammer 30 → Alturiak 1) → correct rollover

---

### M3: Battle Map → Database (2 days)

**Problem:** Single global localStorage key `codex_battle_map_state`. Not encounter-linked (all encounters share one map). Data lost on cache clear. Background images stored as base64 data URLs in localStorage, eating the ~5MB quota.

**Migration SQL (#3):**

```sql
CREATE TABLE IF NOT EXISTS battle_maps (
    id TEXT PRIMARY KEY,
    encounter_id TEXT REFERENCES encounters(id),
    campaign_id TEXT NOT NULL REFERENCES campaigns(id),
    name TEXT DEFAULT 'Untitled Map',
    state_json TEXT NOT NULL DEFAULT '{}',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_battle_maps_encounter ON battle_maps(encounter_id);
CREATE INDEX IF NOT EXISTS idx_battle_maps_campaign ON battle_maps(campaign_id);
```

**Why `state_json`:** Map state is opaque canvas data (token positions, fog bitmask, drawing point arrays). Always loaded/saved atomically. No query benefit from normalization — you never query "all tokens at position 3,4 across all maps."

**New Rust file:** `src-tauri/src/commands/battle_maps.rs`
- `save_battle_map(state, encounter_id: Option<String>, name: Option<String>, state_json: String) → { id }`
- `load_battle_map(state, map_id: String) → { id, state_json, name }`
- `load_battle_map_for_encounter(state, encounter_id: String) → Option<{ id, state_json }>`
- `list_campaign_maps(state) → Vec<{ id, name, encounter_id, updated_at }>`
- `delete_battle_map(state, map_id: String)`

**Background images:** Extract from base64 data URLs and save as files to `{data_dir}/maps/{uuid}.png`. Store the file path in `state_json` instead of the data URL. This alone may recover 3-4MB of localStorage quota for existing users.

**Frontend changes to `BattleMap.jsx`:**
- Replace `loadState()` (line 70-76) with `invoke('load_battle_map_for_encounter', { encounterId })`
- Replace `saveState()` (line 78-79) with debounced `invoke('save_battle_map', ...)` (500ms debounce to avoid DB thrashing during drag operations)
- Add encounter linking: auto-load encounter's map on start, auto-save on end
- Add "Map Library" dropdown: list all campaign maps, load any map into current encounter
- Keep ALL canvas/token/fog/drawing/hex code untouched

**Auto-migration:** On first load, if `localStorage.getItem('codex_battle_map_state')` exists, save it as an unlinked campaign map, then clear the key.

**Validation:**
1. Start encounter → place tokens → end encounter → restart same encounter → tokens restored exactly
2. Different encounter → different (or no) map
3. Background image persists across app restarts (no re-upload needed)
4. Player sees map via existing sync handlers
5. Map library shows all saved maps with names and last-modified dates

---

### M4: Homebrew → Database (1.5 days)

**Problem:** localStorage has ~5MB limit — a DM with 30+ homebrew monsters can hit it. No campaign linking (homebrew is global). No sharing between campaigns. No export/import for sharing with other DMs.

**Migration SQL (#5):**

```sql
CREATE TABLE IF NOT EXISTS homebrew_items (
    id TEXT PRIMARY KEY,
    campaign_id TEXT REFERENCES campaigns(id),
    item_type TEXT NOT NULL CHECK(item_type IN ('monster', 'spell', 'item')),
    name TEXT NOT NULL,
    data_json TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_homebrew_campaign ON homebrew_items(campaign_id, item_type);
```

**`campaign_id` nullable:** Homebrew can be global (available in all campaigns) or campaign-specific (only appears in that campaign's lists). Default is global.

**New Rust file:** `src-tauri/src/commands/homebrew.rs`
- `list_homebrew(state, item_type: Option<String>, campaign_id: Option<String>) → Vec<Item>` — returns global + campaign-specific items
- `save_homebrew_item(state, item_type, name, data_json, campaign_id: Option<String>) → { id }`
- `update_homebrew_item(state, item_id, data_json)`
- `delete_homebrew_item(state, item_id)`
- `export_homebrew_pack(state, item_ids: Vec<String>) → String` (JSON blob with version metadata)
- `import_homebrew_pack(state, json_str: String, campaign_id: Option<String>) → Vec<{ id, name }>` — deduplicates by name

**Frontend changes to `HomebrewBuilder.jsx`:**
- Swap all localStorage reads/writes to invoke calls
- Add scope toggle: "Global" / "This Campaign Only"
- Add export/import buttons (JSON file download/upload)
- Keep ALL builder UI, CR balance checking, and DMG reference tables

**Auto-migration:** On first load, parse `localStorage.getItem('codex_homebrew_library')`, create DB entries for each item as global homebrew, then clear the key.

**Validation:**
1. Create homebrew monster → close app → reopen → still there
2. Set monster as campaign-specific → switch campaigns → monster not visible
3. Export 5 homebrew items → import in different campaign → all 5 appear
4. localStorage key cleared after migration

---

### M5: DM Notes → Database (1 day)

**Problem:** DM session notes are scattered across multiple localStorage keys (`codex_dm_session_notes_${id}`). Not searchable, not exportable, not linked to scenes or encounters. Lost on cache clear — DMs have lost mid-campaign plot notes.

**Migration SQL (#2):**

```sql
CREATE TABLE IF NOT EXISTS dm_notes (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id),
    scene_id TEXT REFERENCES scenes(id),
    title TEXT DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    pinned_initiative_idx INTEGER,
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_dm_notes_scene ON dm_notes(campaign_id, scene_id);
```

**New Rust file:** `src-tauri/src/commands/dm_notes.rs`
- `list_dm_notes(state, scene_id: Option<String>) → Vec<Note>` — if scene_id is None, returns all campaign notes
- `save_dm_note(state, scene_id, title, content, pinned_initiative_idx) → { id }`
- `update_dm_note(state, note_id, content, title)`
- `delete_dm_note(state, note_id)`
- `reorder_dm_notes(state, note_ids: Vec<String>)` — updates sort_order

**Auto-migration:** Scan localStorage for `codex_dm_session_notes_*` keys, create a DB note for each, then clear.

**Validation:**
1. Create note linked to scene → close app → reopen → note persists
2. Notes appear in campaign export
3. Search DM notes by content (used later by Q1 campaign search)

---

### M6: Combat State Consolidation (2 days)

**Problem:** Combat state is split between sessionStorage (`Combat.jsx`), component state (`DmCombatPanel.jsx`), and the database (`encounters` table). During multiplayer, the DB is the source of truth but component state drifts. If the DM refreshes mid-combat, legendary action counters, cover state, and turn position are lost.

**Extend `encounters` table (migration #6):**

```sql
ALTER TABLE encounters ADD COLUMN turn_index INTEGER DEFAULT 0;
ALTER TABLE encounters ADD COLUMN combat_stats_json TEXT DEFAULT '{}';
ALTER TABLE encounters ADD COLUMN legendary_state_json TEXT DEFAULT '{}';
```

**Extend `monsters` table (migration #6):**

```sql
ALTER TABLE monsters ADD COLUMN legendary_actions_used INTEGER DEFAULT 0;
ALTER TABLE monsters ADD COLUMN legendary_actions_max INTEGER DEFAULT 0;
ALTER TABLE monsters ADD COLUMN legendary_resistances_used INTEGER DEFAULT 0;
ALTER TABLE monsters ADD COLUMN legendary_resistances_max INTEGER DEFAULT 0;
ALTER TABLE monsters ADD COLUMN cover TEXT DEFAULT 'none';
```

**Changes to `encounters.rs`:**
- `advance_turn`: also updates `turn_index` column in DB
- New command: `update_combat_stats(state, encounter_id, stats_json)` — for round count, total damage, etc.

**New commands for monster combat state:**
- `use_legendary_action(state, monster_id) → { used, max }` — increment used, error if used >= max
- `reset_legendary_actions(state, monster_id)` — called automatically on monster's turn start
- `use_legendary_resistance(state, monster_id) → { used, max }` — spend one resistance on a failed save
- `set_monster_cover(state, monster_id, cover: String)` — "none" | "half" | "three_quarters" | "full"

**Frontend changes:**
- `DmCombatPanel.jsx`: legendary state loads from DB columns instead of component state; cover state from DB
- `Combat.jsx` (solo play): creates a local encounter in DB, removes sessionStorage dependency
- On DM page refresh: full combat state reconstructed from DB (turn position, legendary counters, cover)

**Validation:**
1. Advance 3 turns → close app → reopen → resumes at correct turn with correct round count
2. Use 2/3 legendary actions → refresh page → counter shows 2/3 used
3. Set half cover on goblin → refresh → cover indicator still shows
4. Solo combat persists across page refreshes (no sessionStorage)

---

## Layer 2: WIRE — Connect Existing Dots

**Goal:** Every feature here uses data/state that already exists in the codebase but isn't connected. Zero or minimal backend changes — this is about making existing code talk to each other.

**Total effort: ~10 days**

**Risk:** Condition automation changes combat feel. **Mitigation:** All automation shows indicators ("Advantage from Prone") but doesn't force the roll — DM can always override. Add a "Manual Mode" toggle per feature if needed.

---

### W1: Condition Automation (3 days)

**What exists:** `conditionEffects.js` has structured data for all 15 conditions with mechanical effects (advantage/disadvantage sources, speed overrides, auto-fail saves, auto-crit melee, can't-act flags). `DmCombatPanel.jsx` already applies/removes conditions with backend persistence and sync.

**What's missing:** The mechanical effects in `conditionEffects.js` are never read during combat. Conditions are cosmetic labels — the DM still has to remember that Prone gives advantage on melee attacks against the target.

**New utility:** `frontend/src/utils/conditionLogic.js`

```javascript
import { CONDITION_EFFECTS } from '../data/conditionEffects';

export function getAttackModifiers(attackerConditions, targetConditions, isMelee) {
    let advantages = 0, disadvantages = 0;
    for (const c of attackerConditions) {
        const fx = CONDITION_EFFECTS[c];
        if (!fx) continue;
        if (fx.attackRolls === 'advantage') advantages++;
        if (fx.attackRolls === 'disadvantage') disadvantages++;
        if (fx.cantAct) return { canAttack: false, reason: `${c}: can't take actions` };
    }
    for (const c of targetConditions) {
        const fx = CONDITION_EFFECTS[c];
        if (!fx) continue;
        if (fx.attacksAgainstYou === 'advantage') advantages++;
        if (fx.attacksAgainstYou === 'disadvantage') disadvantages++;
    }
    if (targetConditions.includes('Prone')) {
        if (isMelee) advantages++; else disadvantages++;
    }
    const net = advantages > 0 && disadvantages > 0 ? 'normal'
        : advantages > 0 ? 'advantage'
        : disadvantages > 0 ? 'disadvantage' : 'normal';
    return { canAttack: true, net, advantages, disadvantages };
}

export function getConditionChains(conditionName) {
    // 5e rules: some conditions automatically impose other conditions
    const chains = {
        'Unconscious': ['Prone', 'Incapacitated'],
        'Petrified': ['Incapacitated'],
        'Paralyzed': ['Incapacitated'],
        'Stunned': ['Incapacitated'],
    };
    return chains[conditionName] || [];
}

export function getSaveModifiers(conditions) {
    const autoFail = [];
    for (const c of conditions) {
        const fx = CONDITION_EFFECTS[c];
        if (fx?.autoFailSaves) autoFail.push(...fx.autoFailSaves);
    }
    return { autoFail: [...new Set(autoFail)] };
}

export function getSpeedModifier(conditions) {
    for (const c of conditions) {
        const fx = CONDITION_EFFECTS[c];
        if (fx?.speed === 0) return { speed: 0, reason: `${c}: speed is 0` };
        if (fx?.speed === 'halved') return { speed: 'halved', reason: `${c}: speed halved` };
    }
    return { speed: 'normal', reason: null };
}

export function isAutoCrit(targetConditions, isMelee) {
    // Paralyzed and Unconscious: attacks within 5ft are automatic crits
    if (!isMelee) return false;
    return targetConditions.some(c => ['Paralyzed', 'Unconscious'].includes(c));
}
```

**DmCombatPanel.jsx changes:**
1. **`toggleCondition`**: When applying a condition, auto-apply chain conditions (Unconscious → also apply Prone + Incapacitated). When removing a parent condition, prompt: "Also remove Prone and Incapacitated?"
2. **Damage inputs**: Show advantage/disadvantage indicator badge based on attacker + target conditions. Color-coded: green "ADV", red "DISADV", gray "NORMAL (adv+disadv cancel)".
3. **Concentration**: When a concentrating creature takes damage, auto-prompt CON save with calculated DC (max of 10 or half damage). On failed save, auto-drop the concentration condition and show which spell ended.
4. **Auto-crit indicator**: When target is Paralyzed or Unconscious, show "AUTO-CRIT (melee)" badge on damage inputs. If DM enters damage, double the dice automatically.
5. **Speed indicator**: When a creature's turn starts and they have a speed-affecting condition, show "Speed: 0 (Grappled)" or "Speed: halved (Exhaustion 2)" in the turn banner.
6. **Can't-act warning**: When advancing to a Stunned/Paralyzed/Unconscious creature's turn, show "Cannot take actions or reactions" banner. Offer "Skip Turn" button.

**Validation:**
1. Apply Unconscious → Prone + Incapacitated auto-applied, all three shown in condition list
2. Prone monster → "ADV (melee)" indicator on melee damage input, "DISADV (ranged)" on ranged
3. Concentration creature takes 22 damage → CON save prompt with DC 11 → fail → concentration removed
4. Paralyzed monster → "AUTO-CRIT" label on melee attacks → damage dice doubled
5. Remove Unconscious → prompt asks about removing chained conditions
6. Stunned creature's turn → "Cannot act" banner with "Skip Turn" button

---

### W2: Damage Type Processing (2 days)

**What exists:** Monster `stat_block_json` contains resistance/immunity/vulnerability arrays. `parseStatBlock()` at `DmCombatPanel.jsx:30-37` already parses the full stat block into structured data.

**What's missing:** No damage type selector on damage inputs. No automatic half/double/zero calculation. The DM has to remember that Fire Elementals are immune to fire and manually enter 0.

**DmCombatPanel.jsx changes:**

1. **Damage type dropdown** next to each monster's damage input field. 13 standard D&D 5e damage types: Acid, Bludgeoning, Cold, Fire, Force, Lightning, Necrotic, Piercing, Poison, Psychic, Radiant, Slashing, Thunder. Default: "Untyped" (no modification).

2. **In `applyDamage` function**: After DM enters raw damage number, before applying:
   ```javascript
   function calculateEffectiveDamage(rawDamage, damageType, statBlock) {
       if (damageType === 'untyped') return { effective: rawDamage, modifier: 'none' };
       const immunities = statBlock.damage_immunities || [];
       const resistances = statBlock.damage_resistances || [];
       const vulnerabilities = statBlock.damage_vulnerabilities || [];

       if (immunities.some(i => damageType.toLowerCase().includes(i.toLowerCase())))
           return { effective: 0, modifier: 'immune' };
       if (vulnerabilities.some(v => damageType.toLowerCase().includes(v.toLowerCase())))
           return { effective: rawDamage * 2, modifier: 'vulnerable' };
       if (resistances.some(r => damageType.toLowerCase().includes(r.toLowerCase())))
           return { effective: Math.floor(rawDamage / 2), modifier: 'resistant' };
       return { effective: rawDamage, modifier: 'none' };
   }
   ```

3. **Visual badges** on the damage input after type selection:
   - Red badge: "IMMUNE" (0 damage)
   - Yellow badge: "RESIST ½" (halved, rounded down)
   - Green badge: "VULN ×2" (doubled)
   - No badge for normal damage

4. **Combat log** shows modified amounts with explanation: "8 fire → 4 (Fire Resistant)" or "10 cold → 20 (Cold Vulnerable)"

5. **Handle special resistances**: "bludgeoning, piercing, and slashing from nonmagical attacks" — add a "Magical" checkbox next to damage type. If unchecked and monster has nonmagical resistance, apply resistance.

**No backend changes.** All stat block data is already in the DB.

**Validation:**
1. Fire Elemental + "fire" damage type → "IMMUNE" badge → 0 applied
2. Fire Elemental + "cold" damage → "VULN ×2" badge → 10 → 20
3. Skeleton + "bludgeoning" → "VULN ×2" → 6 → 12
4. Werewolf + "slashing" (nonmagical) → "RESIST ½" → 10 → 5
5. Werewolf + "slashing" (magical checkbox) → no resistance → 10 → 10
6. Combat log shows "10 slashing → 5 (Resistant to nonmagical)"

---

### W3: Battle Map Sync Completion (1.5 days)

**What exists:** `CampaignSyncContext.jsx:234-259` has 5 receive handlers for map events. `BattleMap.jsx:136-140` destructures send functions from the sync context.

**What's missing:** The send-side functions may not fully broadcast all map changes. Need to audit each interaction and ensure the round-trip works.

**Audit and complete in `CampaignSyncContext.jsx`:**
```javascript
const sendBattleMapSync = useCallback((mapState) => {
    sendEvent('battle_map_sync', mapState);
}, [sendEvent]);

const sendBattleMapTokenMove = useCallback((tokenId, col, row) => {
    sendEvent('battle_map_token_move', { token_id: tokenId, col, row });
}, [sendEvent]);

const sendBattleMapFogUpdate = useCallback((fog) => {
    sendEvent('battle_map_fog_update', { fog });
}, [sendEvent]);

const sendBattleMapDrawingUpdate = useCallback((drawings) => {
    sendEvent('battle_map_drawing_update', { drawings });
}, [sendEvent]);

const sendBattleMapClear = useCallback(() => {
    sendEvent('battle_map_clear', {});
}, [sendEvent]);
```

**BattleMap.jsx send-side wiring:**
- Token drag end → `sendBattleMapTokenMove(token.id, newCol, newRow)`
- Fog cell toggle → debounced `sendBattleMapFogUpdate(updatedFog)` (200ms debounce — fog painting is rapid)
- Drawing stroke complete → `sendBattleMapDrawingUpdate(drawings)`
- Grid type / background change → debounced `sendBattleMapSync(fullState)` (500ms debounce)
- Clear map → `sendBattleMapClear()`

**PlayerBattleMap.jsx verification:**
- Renders from `syncedBattleMap` state as read-only view
- Verify: tokens render at correct positions, fog cells are opaque, drawings visible
- Player cannot move tokens (view-only unless "player token movement" feature added later)

**Validation:**
1. DM moves token → player sees token move within 200ms
2. DM reveals fog cells → player sees revealed area
3. DM draws on map → player sees drawing
4. DM clears map → player map resets
5. Player disconnects → reconnects → gets current map state (full sync on rejoin)

---

### W4: Mood/Ambient System Completion (1 day)

**What exists:** `CampaignSyncContext.jsx:50-51` has `mood` and `ambientSound` state slots. Lines 262-268 have receive handlers for `mood_change` and `ambient_change` events. `MoodOverlay.jsx` renders a visual mood overlay on the player side.

**What's missing:** No DM-side UI to trigger mood changes. No ambient audio playback. The receive handlers exist but nothing sends to them.

**DM Toolbar additions:**

1. **Mood selector** — dropdown or button group in DM toolbar:
   - Presets: Dark, Mysterious, Triumphant, Tense, Peaceful, Combat, Neutral
   - Each mood maps to: overlay color/gradient, opacity, optional particle effect
   - On select: `sendEvent('mood_change', { mood: selectedMood })`
   - Current mood shown as small indicator in DM toolbar

2. **Ambient sound controls** — collapsible section in DM toolbar:
   - Preset buttons: Tavern, Forest, Rain, Dungeon, Battle, Ocean, Market, Cave, Campfire, Silence
   - Custom URL input for DM's own audio files
   - Volume slider (0-100%, default 30%)
   - On select: `sendEvent('ambient_change', { url: presetUrl, volume: 0.3 })`

**Player-side `AmbientAudioPlayer.jsx`** — new component:
```javascript
export default function AmbientAudioPlayer({ url, volume = 0.3 }) {
    const audioRef = useRef(null);

    useEffect(() => {
        if (!url) {
            if (audioRef.current) audioRef.current.pause();
            return;
        }
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = volume;
        audio.play().catch(() => {}); // browsers may block autoplay until user interaction
        audioRef.current = audio;
        return () => { audio.pause(); audio.src = ''; };
    }, [url, volume]);

    if (!url) return null;
    return (
        <div className="ambient-player">
            <span>♫ Ambient</span>
            <input type="range" min={0} max={100} value={volume * 100}
                onChange={e => { if (audioRef.current) audioRef.current.volume = e.target.value / 100; }} />
            <button onClick={() => audioRef.current?.paused ? audioRef.current.play() : audioRef.current.pause()}>
                {audioRef.current?.paused ? '▶' : '⏸'}
            </button>
        </div>
    );
}
```

**Note on autoplay:** Browsers block audio autoplay until the user has interacted with the page. The player session already requires clicking "Join" — so autoplay should work after that initial interaction. Add a fallback "Click to enable audio" button if autoplay is blocked.

**Validation:**
1. DM selects "Tense" mood → all players see tense overlay (dark red gradient)
2. DM selects "Tavern" ambient → all players hear tavern sounds (after click-to-enable if needed)
3. DM adjusts volume → player audio updates
4. DM selects "Silence" → audio stops on all players
5. Player can independently mute/adjust their local volume without affecting others

---

### W5: Whisper System Completion (1 day)

**What exists:** `dm_whisper` event type in party protocol. `sendTargetedEvent` function for sending to a specific player. DM can send whispers to individual players.

**What's missing:** Players can't whisper back to the DM. No whisper history. No indication that a whisper was sent/received.

**Implementation:**

1. **Player → DM whisper:** Add "Whisper to DM" button in player combat HUD:
   - Text input modal (simple textarea, no markdown)
   - On send: `sendEvent('player_whisper', { text, playerName })`
   - DM receives via new handler in `CampaignSyncContext.jsx`

2. **DM whisper inbox** — new UI section in DM panel:
   - Notification badge when new whisper arrives (red dot + count)
   - Whisper list: player name, message, timestamp
   - "Reply" button → opens targeted whisper to that player
   - "Broadcast" button → share the whisper content with all players (with confirmation)

3. **Player whisper display:**
   - Incoming DM whispers show as a dismissible popup overlay (similar to `PlayerPromptPopup.jsx`)
   - Subtle notification sound (optional, respects player audio settings)
   - Whisper text persists in a collapsible "Messages" section until dismissed

4. **Session-only history** — whispers are ephemeral, stored in component state only. Not persisted to DB (whispers are private by nature and shouldn't appear in exports or recaps).

**Validation:**
1. DM whispers "You notice a hidden door" to Rogue → Rogue sees popup, other players don't
2. Rogue whispers "I want to steal from the merchant" to DM → DM sees in inbox
3. DM replies to Rogue's whisper → Rogue sees reply popup
4. Refresh page → whisper history cleared (session-only)

---

### W6: Legendary/Lair Action Completion (2 days)

**What exists:** Legendary action pips (`DmCombatPanel.jsx:77-78`), auto-reset on turn start (lines 122-138), use action button (lines 336-344), lair action detection from stat block (lines 101-107), lair round reminder (line 391).

**What's missing:** Legendary Resistance counter (separate from legendary actions). Lair actions not inserted into initiative order at 20. State not persisted (lost on refresh — fixed by M6).

**Implementation:**

1. **Legendary Resistance counter** — separate from action pips:
   - Display: "LR: ●●● (3/3)" next to the monster in initiative order
   - Trigger: When a monster fails a saving throw, show "Use Legendary Resistance?" prompt
   - On use: save automatically succeeds, counter decrements, combat log entry, sync to players
   - Visual: filled circles deplete as resistances are spent

2. **Lair action at initiative 20** — auto-insert into initiative:
   ```javascript
   if (hasLairActions) {
       initiative.push({
           id: `lair_${monsterId}`,
           name: `Lair Action (${monsterName})`,
           initiative: 20,
           is_lair: true,
           is_monster: true,
       });
       initiative.sort((a, b) => b.initiative - a.initiative);
   }
   ```
   - When lair action's turn arrives: show reminder panel with lair action options from stat block
   - DM selects which lair action to use (or skip)
   - Lair actions don't consume legendary actions (per 5e rules)

3. **Legendary action timing** — reminder between other turns:
   - After each non-legendary creature's turn ends, if a legendary creature has remaining actions, show subtle indicator: "Dragon has 2 legendary actions remaining"
   - DM can click to use one or dismiss

4. **Persistence** — uses M6 monster columns (`legendary_actions_used/max`, `legendary_resistances_used/max`). On encounter start, parse max values from stat block and set DB columns.

**Validation:**
1. Add Ancient Red Dragon to encounter → 3 legendary actions + 3 legendary resistances shown
2. Dragon fails WIS save → "Use Legendary Resistance?" → yes → save succeeds, LR counter 2/3
3. Lair action entry appears at initiative 20 in turn order
4. Between turns, "2 legendary actions remaining" indicator shows
5. Dragon's turn starts → legendary actions auto-reset to 3/3
6. Page refresh (after M6) → all counters preserved

---

## Layer 3: AUTOMATE — Complete Combat Automation

**Goal:** Eliminate every remaining manual bookkeeping step in combat. After this layer, the DM should never have to remember a 5e combat rule — the system handles it.

**Total effort: ~2 weeks**

**Risk:** Over-automation annoys experienced DMs. **Mitigation:** Every automation is an indicator + prompt, never a forced action. DM always has final say. Add per-feature toggles in campaign settings.

---

### A1: Death Save Automation (2 days)

**Current state:** `DmCombatPanel.jsx:63` has `deathSaves` state as `{ clientId: { successes: 0, failures: 0 } }`. The DM manually prompts death saves via `triggerDeathSave` (line 253) and tracks results via `death_save_result` party event. But the actual 5e death save rules aren't automated.

**What's missing:**
- 3 successes = auto-stabilize (notify DM + player, clear death saves)
- 3 failures = death (notify DM + player, mark character)
- Natural 20 = regain 1 HP, conscious, reset saves
- Natural 1 = two failures
- Damage at 0 HP = automatic death save failure (2 failures if critical hit)
- Healing at 0 HP = conscious, reset saves
- Massive damage: if remaining damage ≥ max HP, instant death

**Implementation:**

```javascript
function processDeathSave(clientId, roll, currentSaves) {
    const saves = { ...currentSaves };

    if (roll === 20) {
        return { result: 'nat20_recover', saves: { successes: 0, failures: 0 }, hpDelta: 1 };
    }
    if (roll === 1) {
        saves.failures += 2;
    } else if (roll >= 10) {
        saves.successes += 1;
    } else {
        saves.failures += 1;
    }

    if (saves.successes >= 3) {
        return { result: 'stabilized', saves: { successes: 3, failures: saves.failures } };
    }
    if (saves.failures >= 3) {
        return { result: 'dead', saves: { successes: saves.successes, failures: 3 } };
    }
    return { result: 'ongoing', saves };
}
```

**DmCombatPanel.jsx changes:**
- Handle `death_save_result` party event: parse roll value, run `processDeathSave`, update state
- On stabilize: toast "Player stabilized!", clear death save UI, mark as stable in initiative
- On death: toast "Player has died!", skull icon in initiative, option to remove from initiative order
- On nat 20: auto-send `hp_change` event (+1 HP), clear death saves, toast "Miraculous recovery!"
- On damage to 0-HP player: auto-increment failure count (skip the roll prompt). 2 failures if damage was a critical hit.
- On healing to 0-HP player: auto-clear death saves, player regains consciousness
- Massive damage check: if a single hit would bring a player below 0 by more than their max HP, show "INSTANT DEATH" warning

**Sync events:** Extend `death_save_result` payload:
```javascript
sendEvent('death_save_result', {
    player_name: name, roll: diceResult, success: roll >= 10,
    total_successes: saves.successes, total_failures: saves.failures,
    outcome: result // 'ongoing' | 'stabilized' | 'dead' | 'nat20_recover'
});
```

**Visual UI:** Death save tracker in initiative order:
- Successes: `●●○` (2 of 3) — green circles
- Failures: `●○○` (1 of 3) — red circles
- Pulse animation on change (green flash for success, red flash for failure)
- Skull overlay on portrait for dead characters

**Validation:**
1. Player drops to 0 HP → death save tracker appears in initiative for DM
2. Roll 15 → success circle fills → "1/3 successes"
3. Roll 1 → two failure circles fill → "2/3 failures"
4. Roll 20 → player regains 1 HP, saves reset, "Miraculous recovery!" toast
5. 3 failures → "Player has died" notification with skull indicator
6. Heal player at 0 HP → saves auto-clear, conscious
7. Massive damage exceeding max HP → "INSTANT DEATH" warning

---

### A2: Multi-Attack Sequencing (2 days)

**Current state:** Monsters with Multiattack have stat blocks listing "The dragon makes three attacks: one with its bite and two with its claws" but the DM manually enters each attack's damage with no structure, no target tracking, and no auto-application.

**Implementation:**

**Parse multiattack from `stat_block_json`:**
```javascript
function parseMultiattack(statBlock) {
    if (!statBlock?.actions) return null;
    const multiattack = statBlock.actions.find(a =>
        a.name?.toLowerCase() === 'multiattack' || a.name?.toLowerCase() === 'multi attack'
    );
    if (!multiattack) return null;

    const attacks = statBlock.actions.filter(a =>
        a.name?.toLowerCase() !== 'multiattack' &&
        multiattack.desc?.toLowerCase().includes(a.name?.toLowerCase())
    );

    // Parse attack count from description ("two with its claws" → 2)
    const countWords = { one: 1, two: 2, three: 3, four: 4, five: 5 };
    const attackSequence = [];
    for (const atk of attacks) {
        const regex = new RegExp(`(\\w+)\\s+(?:with\\s+(?:its\\s+)?)?${atk.name.toLowerCase()}`, 'i');
        const match = multiattack.desc.match(regex);
        const count = match ? (countWords[match[1].toLowerCase()] || 1) : 1;
        for (let i = 0; i < count; i++) attackSequence.push(atk);
    }
    return { description: multiattack.desc, attacks: attackSequence };
}
```

**Parse individual attack details:**
```javascript
function parseAttack(action) {
    // Parse "+7 to hit" from action description
    const hitMatch = action.desc?.match(/([+-]\d+)\s+to hit/);
    // Parse damage dice "2d6 + 4 slashing"
    const dmgMatch = action.desc?.match(/(\d+d\d+(?:\s*\+\s*\d+)?)\s+(\w+)\s+damage/);
    return {
        name: action.name,
        attackBonus: hitMatch ? parseInt(hitMatch[1]) : 0,
        damageDice: dmgMatch ? dmgMatch[1] : null,
        damageType: dmgMatch ? dmgMatch[2] : 'untyped',
    };
}
```

**UI in DmCombatPanel monster section:**
- When monster's turn starts and has Multiattack: show "Multiattack Sequence" panel
- Each attack row shows: attack name, attack bonus, damage dice, target selector dropdown (all players + other monsters)
- **"Roll All" button**: rolls each attack against target AC, shows hit/miss per attack, totals damage per target
- **Individual "Roll" button** per attack for manual sequencing
- Damage auto-applied to selected targets using W2 damage type processing
- Completed attacks get checkmark (✓), remaining shown as pending (○)
- DM can skip individual attacks or change targets mid-sequence

**Validation:**
1. Ancient Red Dragon's turn → "Multiattack: 1 Bite + 2 Claws" panel with 3 attack rows
2. Select targets for each → "Roll All" → 3 d20 rolls shown with hit/miss against each target's AC
3. Hit attacks auto-apply damage (doubled for crits)
4. Damage type processing applies (e.g., fire resistance reduces fire damage hits)
5. DM can override any individual roll or damage amount

---

### A3: Readied Actions (1.5 days)

**No new tables.** Extends initiative tracking in component state.

**Implementation:**

Add `readiedActions` state to `DmCombatPanel.jsx`:
```javascript
const [readiedActions, setReadiedActions] = useState({});
// { combatantId: { description: "Attack when goblin moves", trigger: "movement", active: true, setOnRound: 3 } }
```

**UI in initiative order:**
- **"Ready Action" button** next to each combatant on their turn
- Click → modal with:
  - Description text input: "What are you readying?"
  - Trigger type dropdown: Movement, Attack, Spell Cast, Damage Taken, Custom
  - Optional: reaction spell (e.g., Shield, Counterspell)
- Readied combatant shows ⏳ hourglass icon in initiative order
- Combatant's position in initiative grayed out (they've deferred)

**Trigger flow:**
- When the trigger condition occurs (DM's judgment), "⚡ Trigger Readied Action" button appears next to the readied combatant
- Clicking it: combatant takes their readied action immediately (out of turn order), then readied state clears
- Combat log: "Fighter triggers readied action: Attack when goblin moves"

**Expiration:**
- If combatant's next turn arrives without triggering: readied action expires automatically
- Toast notification: "Fighter's readied action expired (unused)"
- Combatant takes their turn normally

**Sync:** `readied_action` party event → player sees:
- "Your readied action is set: Attack when goblin moves"
- "Your readied action triggered!"
- "Your readied action expired (not triggered)"

**Validation:**
1. Fighter readies "Attack when goblin moves" → ⏳ icon in initiative
2. Goblin's turn → DM clicks "Trigger" on Fighter → Fighter's action resolves
3. Fighter's next turn arrives without trigger → "Readied action expired" toast
4. Player sees readied status on their combat HUD

---

### A4: HP Undo/Redo (1.5 days)

**No new tables.** Undo stack in component state.

**Problem:** DM misclicks and deals 50 damage to the wrong monster, or enters damage before the player says "Wait, I have Shield." Currently the only fix is manually healing the amount back, which is error-prone and clutters the combat log.

**Implementation:**

```javascript
const [hpHistory, setHpHistory] = useState([]);
// [{ id, target, targetName, isMonster, previousHp, newHp, delta, damageType, timestamp }]
const MAX_UNDO_STACK = 20;
```

**Changes to `applyDamage` and `applyPlayerDamage`:**
- Before applying: push `{ target, targetName, isMonster, previousHp, newHp: previousHp + delta, delta }` to stack
- After applying: show toast with "Undo" button (visible for 5 seconds)

**Undo function:**
```javascript
const undoLastHpChange = () => {
    const last = hpHistory[hpHistory.length - 1];
    if (!last) return;
    if (last.isMonster) {
        // Directly set HP back to previous value
        invoke('update_monster_hp', { monsterId: last.target, hp: last.previousHp });
    } else {
        sendHpChange(last.previousHp - last.newHp, 'Undo', [last.target]);
    }
    setHpHistory(prev => prev.slice(0, -1));
    sendCombatLogEntry('undo', `Undo: ${last.targetName} HP ${last.newHp} → ${last.previousHp}`);
};
```

**Keyboard shortcut:** `Ctrl+Z` triggers undo (integrates with configurable hotkeys in E1c).

**Visual:** Undo button in DM toolbar shows stack depth: "Undo (3)" when 3 actions can be undone.

**Validation:**
1. Deal 50 damage to goblin → goblin at 0 HP → click "Undo" → goblin back to 50 HP
2. Combat log shows "Undo: Goblin HP 0 → 50"
3. Undo stack limited to last 20 changes (oldest entries dropped)
4. Undo a player damage → player's HP restored on their screen via sync

---

### A5: Spell Slot Visibility for DM (1 day)

**Current state:** `spell_slot_update` event exists in `CampaignSyncContext.jsx:213` but the handler is an empty comment: `// DM can track player spell slot usage`. The event type is registered but does nothing.

**Implementation:**

**Complete the handler in `CampaignSyncContext.jsx`:**
```javascript
const [playerSpellSlots, setPlayerSpellSlots] = useState({});

unsubs.push(onPartyEvent('spell_slot_update', (msg) => {
    setPlayerSpellSlots(prev => ({
        ...prev,
        [msg.client_id]: {
            name: msg.data.player_name,
            slots: msg.data.slots // { 1: { used: 2, max: 4 }, 2: { used: 1, max: 3 }, ... }
        }
    }));
}));
```

Expose `playerSpellSlots` through the sync context provider.

**DmCombatPanel changes:** In the player cards section, show spell slot indicators below HP:
```
Wizard (Lv 5)  HP: 28/32  AC: 14
Slots: ●●○○ | ●○○ | ○○
       Lv1    Lv2   Lv3
```

- Filled circles (●) = available, empty circles (○) = spent
- Color-code by spell level tier: Lv1-2 blue, Lv3-4 purple, Lv5-6 gold, Lv7+ red
- Tooltip on hover: "Level 2: 2/3 remaining"
- Update in real-time as player casts

**Player side:** Verify that `Spellbook.jsx` or `Combat.jsx` sends `spell_slot_update` event when slots change. The event type exists in the listener, so check if the send-side code exists. If not, add:
```javascript
// In spell casting flow, after slot consumed:
sendEvent('spell_slot_update', {
    player_name: characterName,
    slots: currentSlotState
});
```

**Validation:**
1. Player casts a level 2 spell → DM sees slot 2 indicator update from ●●● to ●●○
2. Long rest → all slots refill → DM sees full indicators
3. Sorcerer uses sorcery points to create a slot → DM sees slot count change
4. Non-caster players show no slot display (graceful absence)

---

## Layer 4: EXTEND — Genuine New Features

**Goal:** Build new systems that don't exist yet but enhance campaign management beyond combat.

**Total effort: ~5 weeks**

**Risk:** Scope creep — each system could absorb weeks of polish. **Mitigation:** Ship MVP for each, mark enhancement ideas as future work. Every feature has a "done" definition in its validation section.

---

### E1: Session Flow Tools (1 week total)

#### E1a: DM Scratchpad (2 days)

**Uses M5 `dm_notes` table.** New component `DmScratchpad.jsx`:
- Floating, draggable panel (absolute positioned, remembers position in localStorage)
- Loads notes for current scene via `invoke('list_dm_notes', { sceneId })`
- Markdown rendering (using existing markdown renderer if available, otherwise plain text with bold/italic)
- Auto-save via `useAutosave` hook (debounced 2s after last keystroke)
- "Pin to initiative" — note highlights/pulses when combat reaches that initiative index (e.g., "Remind players about the trap at the goblin's turn")
- Collapse/expand, minimize to icon
- Multiple notes per scene with tabs
- Keyboard shortcut: `Ctrl+N` to toggle

**Validation:**
1. Open scratchpad → type note → close scratchpad → reopen → note persists
2. Pin note to initiative index 3 → when turn 3 arrives, note highlights
3. Switch scenes → notes change to match current scene
4. Minimize → small icon in corner → click to restore

#### E1b: Action Templates (2 days)

**Extend `action_buttons` table (migration #7):**
```sql
ALTER TABLE action_buttons ADD COLUMN template_json TEXT;
ALTER TABLE action_buttons ADD COLUMN campaign_id TEXT REFERENCES campaigns(id);
```

`template_json` structure:
```json
{
    "type": "damage",
    "dice": "8d6",
    "damage_type": "fire",
    "save": { "ability": "DEX", "dc": 17 },
    "area": { "shape": "cone", "size": 30 },
    "description": "Dragon breathes fire in a 30-foot cone",
    "recharge": "5-6"
}
```

**New Rust file:** `commands/action_templates.rs`
- `list_action_templates(state, campaign_id) → Vec<Template>`
- `save_action_template(state, name, template_json, campaign_id) → { id }`
- `delete_action_template(state, template_id)`

**Frontend:** "Templates" tab in DM combat panel sidebar:
- Saved templates listed with name + damage summary
- Click → auto-fill damage dice + damage type + save DC into the current damage input
- "Quick Roll" button: rolls damage dice immediately and shows result
- "Create Template" from any monster action: right-click monster action → "Save as Template"
- Common presets included: Fireball (8d6 fire, DEX 15), Lightning Bolt (8d6 lightning, DEX 15), etc.

#### E1c: Configurable Hotkeys (1.5 days)

Hotkey map stored in campaign `settings` table:
```json
{
    "advance_turn": "Space",
    "roll_initiative": "Ctrl+I",
    "apply_damage": "Ctrl+D",
    "broadcast": "Ctrl+B",
    "toggle_fog": "Ctrl+F",
    "end_encounter": "Ctrl+E",
    "open_scratchpad": "Ctrl+N",
    "next_scene": "Ctrl+Right",
    "toggle_timer": "Ctrl+T",
    "quick_roll": "Ctrl+R",
    "undo": "Ctrl+Z",
    "search": "Ctrl+K"
}
```

New `KeyboardShortcutManager.jsx`:
- Context provider wrapping DM session
- Listens for keydown events, maps to registered callback functions
- Prevents conflicts with browser defaults (Ctrl+S, Ctrl+P, etc.)
- Settings modal to remap: click action → press new key combo → save
- `?` key shows overlay (extends existing `KeyboardShortcutsHelp.jsx`) with current bindings

#### E1d: Pacing Timer Enhancement (1 day)

Extends existing turn timer (`DmCombatPanel.jsx:66-68,162-172`):
- **Running average**: "Avg: 2:15 / This turn: 3:40" — shows average turn time across all turns this encounter
- **Alert threshold**: configurable (default 3min), visual pulse + color change when exceeded
- **Scene-level timer**: total time in current scene/encounter phase
- **Session pace widget**: horizontal stacked bar showing combat% / roleplay% / exploration% based on time spent in each mode

---

### E2: Faction & Reputation System (5 days)

**Migration SQL (#8):**

```sql
CREATE TABLE IF NOT EXISTS factions (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id),
    name TEXT NOT NULL,
    alignment TEXT DEFAULT 'neutral',
    description TEXT DEFAULT '',
    territory TEXT DEFAULT '',
    leader_npc_id TEXT REFERENCES campaign_npcs(id),
    symbol_emoji TEXT DEFAULT '',
    color TEXT DEFAULT '#6b7280',
    status TEXT DEFAULT 'active',
    dm_notes TEXT DEFAULT '',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_factions_campaign ON factions(campaign_id);

CREATE TABLE IF NOT EXISTS faction_reputation (
    id TEXT PRIMARY KEY,
    faction_id TEXT NOT NULL REFERENCES factions(id),
    campaign_id TEXT NOT NULL,
    reputation INTEGER NOT NULL DEFAULT 0,
    tier TEXT NOT NULL DEFAULT 'Neutral',
    updated_at INTEGER NOT NULL,
    UNIQUE(faction_id, campaign_id)
);

CREATE TABLE IF NOT EXISTS faction_reputation_log (
    id TEXT PRIMARY KEY,
    faction_id TEXT NOT NULL REFERENCES factions(id),
    campaign_id TEXT NOT NULL,
    delta INTEGER NOT NULL,
    reason TEXT NOT NULL,
    session_id TEXT,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS faction_relationships (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    faction_a_id TEXT NOT NULL REFERENCES factions(id),
    faction_b_id TEXT NOT NULL REFERENCES factions(id),
    relationship TEXT NOT NULL DEFAULT 'neutral',
    notes TEXT DEFAULT '',
    UNIQUE(campaign_id, faction_a_id, faction_b_id)
);
```

**Reputation tiers (auto-calculated from score):**

| Score | Tier | Color | Mechanical Suggestion |
|-------|------|-------|-----------------------|
| -100 to -60 | Hostile | #dc2626 | Faction members attack on sight |
| -59 to -20 | Unfriendly | #f97316 | No services, higher prices, may report party |
| -19 to 19 | Neutral | #6b7280 | Standard interactions |
| 20 to 59 | Friendly | #3b82f6 | Discounts, information, minor favors |
| 60 to 100 | Allied | #22c55e | Safe houses, military aid, political backing |

**New Rust file:** `commands/factions.rs`
- Full CRUD for factions
- `change_faction_reputation(state, faction_id, delta, reason) → { new_score, new_tier, old_tier }` — auto-calculates tier, logs the change
- `get_reputation_log(state, faction_id) → Vec<LogEntry>` — full history of reputation changes with reasons
- `set_faction_relationship(state, faction_a_id, faction_b_id, relationship)` — ally, rival, neutral, enemy, vassal
- `get_faction_relationships(state) → Vec<Relationship>` — all inter-faction relationships

**New frontend:** `Factions.jsx`:
- **List view**: Faction cards with name, color, symbol, current reputation bar, tier badge
- **Detail panel**: Description, territory, leader (linked to NPC), DM notes, full reputation log
- **Reputation adjustment**: "+5 / -5" quick buttons + custom delta with reason input
- **Relationship matrix**: Grid showing all faction pairs with relationship type (color-coded edges)
- **Player view**: Players see faction names, tiers, and descriptions but NOT DM notes or exact scores

**Sync:** `FactionRepChanged` party event → players see "Your reputation with the Zhentarim has increased to Friendly."

---

### E3: Location Registry (5 days)

**Migration SQL (#9):**

```sql
CREATE TABLE IF NOT EXISTS locations (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id),
    parent_id TEXT REFERENCES locations(id),
    name TEXT NOT NULL,
    location_type TEXT DEFAULT 'area',
    description TEXT DEFAULT '',
    dm_notes TEXT DEFAULT '',
    map_image_path TEXT,
    linked_npc_ids_json TEXT DEFAULT '[]',
    linked_quest_ids_json TEXT DEFAULT '[]',
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_locations_campaign ON locations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_locations_parent ON locations(parent_id);

-- Link scenes to locations
ALTER TABLE scenes ADD COLUMN location_id TEXT REFERENCES locations(id);
```

`location_type` options: `region`, `city`, `district`, `building`, `room`, `wilderness`, `dungeon`, `area`

**New Rust file:** `commands/locations.rs`
- `list_locations(state) → Vec<Location>` — flat list
- `get_location_tree(state) → Tree<Location>` — recursive CTE query building parent→child hierarchy
- `create_location(state, parent_id, name, location_type, description) → { id }`
- `update_location(state, location_id, ...fields)`
- `delete_location(state, location_id)` — cascade option for children or re-parent to grandparent
- `link_scene_to_location(state, scene_id, location_id)`
- `get_locations_by_type(state, location_type) → Vec<Location>`

**New frontend:** `LocationPanel.jsx`:
- **Tree view**: Expand/collapse hierarchy with indentation. Icons per type (🏔️ region, 🏙️ city, 🏛️ building, etc.)
- **Breadcrumbs**: "Sword Coast > Waterdeep > Dock Ward > The Yawning Portal"
- **Detail panel**: Description, DM notes, map image (upload/display), linked NPCs (clickable), linked quests (clickable), linked scenes
- **Quick-link**: When creating a scene, dropdown to select location
- **Map image**: Upload image for location, display with zoom/pan

---

### E4: NPC Relationship Map (5 days)

**Migration SQL (#10):**

```sql
CREATE TABLE IF NOT EXISTS npc_relationships (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    source_npc_id TEXT NOT NULL REFERENCES campaign_npcs(id),
    target_npc_id TEXT NOT NULL REFERENCES campaign_npcs(id),
    relationship_type TEXT NOT NULL DEFAULT 'ally',
    notes TEXT DEFAULT '',
    bidirectional INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    UNIQUE(campaign_id, source_npc_id, target_npc_id)
);
```

`relationship_type` options: `ally`, `rival`, `family`, `patron`, `enemy`, `romantic`, `business`, `servant`, `member`

**Dependency:** Install `@xyflow/react` (formerly reactflow) — MIT license, ~20KB gzipped. Used for the interactive graph.

**New Rust file:** `commands/npc_relationships.rs`
- `list_npc_relationships(state) → Vec<Relationship>`
- `create_npc_relationship(state, source_npc_id, target_npc_id, relationship_type, notes, bidirectional) → { id }`
- `update_npc_relationship(state, relationship_id, relationship_type, notes)`
- `delete_npc_relationship(state, relationship_id)`

**New frontend:** `NpcRelationshipMap.jsx`:
- **xyflow graph**: Nodes = NPCs (labeled with name, colored by status: alive/dead/missing), edges = relationships (colored by type, labeled with type name)
- **Drag-to-connect**: Drag from one NPC node to another to create a relationship
- **Faction grouping**: NPCs belonging to same faction visually grouped (background rectangle)
- **Click node**: Opens NPC detail panel in sidebar
- **Filter**: By relationship type, by faction, by status
- **Layout**: Auto-layout with manual drag override (positions saved per session)

---

### E5: Environmental Hazards (3 days)

**Migration SQL (#11):**

```sql
CREATE TABLE IF NOT EXISTS encounter_hazards (
    id TEXT PRIMARY KEY,
    encounter_id TEXT NOT NULL REFERENCES encounters(id),
    campaign_id TEXT NOT NULL,
    name TEXT NOT NULL,
    damage_dice TEXT,
    damage_type TEXT,
    save_ability TEXT,
    save_dc INTEGER,
    half_on_save INTEGER DEFAULT 1,
    trigger_on TEXT DEFAULT 'turn_start',
    area_description TEXT DEFAULT '',
    map_cells_json TEXT DEFAULT '[]',
    active INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL
);
```

`trigger_on` options: `turn_start`, `turn_end`, `on_enter`, `on_exit`, `manual`
`map_cells_json` format: `["3,4", "3,5", "4,4"]` — grid coordinates for battle map rendering

**New Rust file:** `commands/hazards.rs`
- `add_encounter_hazard(state, encounter_id, name, damage_dice, damage_type, save_ability, save_dc, trigger_on, map_cells) → { id }`
- `list_encounter_hazards(state, encounter_id) → Vec<Hazard>`
- `remove_encounter_hazard(state, hazard_id)`
- `toggle_hazard_active(state, hazard_id) → { active: bool }` — DM can enable/disable mid-combat

**Frontend in DmCombatPanel:**
- **"Hazards" section** below monster list
- **Quick-add presets**:
  - Lava: 2d10 fire, DC 15 DEX, turn_start
  - Pit Trap: 2d6 bludgeoning, DC 12 DEX, on_enter
  - Poison Cloud: 3d8 poison, DC 14 CON, turn_start
  - Spike Growth: 2d4 piercing, no save, on_enter (per 5ft)
  - Bonfire: 1d8 fire, DC 13 DEX, turn_end
- **Custom hazard**: All fields editable
- **Turn advance integration**: When a creature's turn starts/ends and they're in hazard cells, auto-prompt: "Goblin starts turn in Lava Zone. 2d10 fire damage, DC 15 DEX save?"
- **Battle map rendering**: Hazard cells render as colored semi-transparent overlay (red for fire, green for poison, brown for physical)
- **Toggle active**: Click hazard to enable/disable (e.g., trap triggered and disarmed)

**Validation:**
1. Add "Lava" hazard to encounter → lava cells highlighted on battle map
2. Goblin starts turn in lava cells → prompt "2d10 fire, DC 15 DEX?" → DM rolls → damage applied
3. Disable hazard → cells no longer highlighted, no more prompts
4. Player sees hazard cells on their battle map view (via sync)

---

### E6: Surprise & Initiative Variants (2 days)

**No new tables.** Extends initiative_json format and campaign settings.

**Surprise mechanics:**
- `surprised: true` flag on initiative entries
- During encounter setup: DM checks "Surprised" checkbox next to individual combatants
- Round 1: surprised creatures auto-skip their turn. Visual "!" icon and "SURPRISED" label.
- Surprised creatures can't take reactions in round 1
- After round 1: `surprised` flag auto-clears

**Initiative variant system (campaign setting):**
- **Standard** (current behavior): Individual d20 + DEX modifier
- **Side Initiative**: One roll per side. All players act (in any order), then all monsters (in any order). Faster for large combats.
- **Popcorn/Elective**: Current combatant picks who goes next from a dropdown. More cinematic but slower.

**Implementation:**
- Campaign settings: `initiative_variant` key — "standard" | "side" | "popcorn"
- `DmCombatPanel.jsx`: Branch on variant in initiative setup and turn advance
- Side initiative: Roll once for players, once for monsters. Group display.
- Popcorn: After turn ends, show "Who goes next?" dropdown. Remove turn advance button.

**Validation:**
1. Mark 2 goblins as surprised → round 1 they're skipped with "!" icon → round 2 they act normally
2. Set "Side Initiative" → one roll determines all players go first or all monsters
3. Set "Popcorn" → after each turn, DM picks next combatant from dropdown

---

### E7: Calendar Deep Integration (5 days)

**Requires M2 complete.**

#### E7a: Recurring Events (1 day)
Extend `calendar_events.recurrence_rule` column. Format:
```json
{ "type": "weekly", "interval": 1, "end_date": "1492-12-30" }
```
Types: `daily`, `weekly`, `monthly`, `yearly`. Calendar renders generated instances (not stored individually). Event shows "↻" icon for recurring.

#### E7b: Weather Generation (2 days)

**Migration SQL (#12):**
```sql
CREATE TABLE IF NOT EXISTS weather_state (
    campaign_id TEXT PRIMARY KEY REFERENCES campaigns(id),
    current_weather TEXT DEFAULT 'clear',
    temperature TEXT DEFAULT 'mild',
    wind TEXT DEFAULT 'calm',
    generated_at INTEGER NOT NULL
);
```

Weather tables by season (weighted random):
```javascript
const WEATHER_BY_SEASON = {
    winter: { clear: 15, overcast: 25, rain: 10, snow: 30, blizzard: 10, fog: 10 },
    spring: { clear: 30, overcast: 20, rain: 30, thunderstorm: 10, fog: 10 },
    summer: { clear: 40, overcast: 15, rain: 15, thunderstorm: 20, heatwave: 10 },
    autumn: { clear: 20, overcast: 30, rain: 25, fog: 15, wind: 10 },
};
```

**Season mapping** for Harptos calendar: Hammer-Ches = winter, Tarsakh-Kythorn = spring, Flamerule-Eleasis = summer, Eleint-Nightal = autumn.

**Gameplay suggestions** (displayed as DM hints, not enforced):
- Heavy rain → "Disadvantage on Perception (sight), extinguishes open flames"
- Blizzard → "Heavily obscured, difficult terrain, 1 level exhaustion per hour without shelter"
- Extreme heat → "DC 10 CON save per hour or 1 level exhaustion"
- Strong wind → "Disadvantage on ranged attacks, hearing-based Perception"

Weather persists between sessions, re-rolls when calendar day advances.

#### E7c: Travel Mode (2 days)
"Travel Mode" button in DM toolbar:
- Input: number of days traveling, terrain type (road/wilderness/mountain/swamp), party speed
- Auto-advance calendar by that many days
- Generate weather for each day of travel
- Optional random encounter checks (configurable frequency: none/rare/moderate/frequent)
- Travel log output: "Day 1: Clear, no encounters. Day 2: Rain, wolves spotted (encounter?)."
- If party inventory (I7) is built: track ration consumption

---

### E8-E10: AI Enrichment (3 days total)

**All AI features are Ollama-optional.** If Ollama is not running, features show "AI unavailable — start Ollama to enable" and fall back to non-AI alternatives where possible.

#### E8: Context-Aware AI System Prompt (1 day)
Replace generic Ollama prompt in `assistantContext.js` with auto-constructed context:
```
You are a D&D 5e assistant for this campaign.
Current scene: {sceneName} — {sceneDescription}
Present NPCs: {npcList with personalities}
Active quests: {questNames with status}
Party composition: {classLevelList}
Calendar: {currentDate}, {weather}
Factions: {factionNames with party reputation tiers}
Recent events: {last 5 event log entries}
DM notes for this scene: {sceneNotes}
```
This makes the AI chat contextually aware without the DM having to re-explain the situation.

#### E9: AI NPC Dialogue (1 day)
"Generate Dialogue" button on NPC detail panel:
- Constructs prompt from NPC personality, alignment, knowledge, current situation, and faction loyalties
- Tone slider: Formal / Casual / Threatening / Friendly / Cryptic
- Generates 3-5 dialogue lines the NPC might say in the current situation
- "Save to DM Notes" button to keep useful generations
- "Regenerate" button for different options

#### E10: Session Prep Generator (1 day)
One-click "Prepare Next Session" button:
- Feeds last recap + active quests + story arcs + calendar + NPCs to Ollama
- Output: scene outlines, NPC talking points, encounter suggestions, plot hooks, potential player questions
- "Create Scenes" button converts outline items directly into DB scene entries
- Non-AI fallback: generates a structured checklist from data (active quests, NPCs last seen, unresolved hooks) without narrative prose

---

## Layer 5: INNOVATE — Novel High-Effort Features

**Goal:** Features that require significant new code and provide the biggest "wow factor." These differentiate the engine from a simple combat tracker.

**Total effort: ~5.5 weeks**

**Risk:** Canvas-heavy features (fog, AoE, layers) are hard to debug across browsers. **Mitigation:** Build on existing BattleMap.jsx canvas code. Test in Chrome + Firefox. Keep rendering simple (2D canvas, no WebGL).

---

### I1: Fog of War with Player Sync (7 days)

**Simplified approach (80% value, 20% complexity):** DM-controlled reveal with shared fog state. All players see the same revealed areas — no per-player visibility (that would require server-side rendering).

**Implementation:**
- **DM "Reveal" tool** in battle map toolbar: radius slider (1-10 cells), click to reveal circle, click-drag to reveal path
- **"Hide" tool**: re-fog previously revealed areas
- **Broadcast**: `battle_map_fog_update` with changed cell list only (not full fog state — reduces payload)
- **All players see same revealed areas** — shared fog state
- **Optional darkvision**: Tokens with darkvision flag show a slightly brighter overlay in dim areas (client-side cosmetic only, doesn't reveal for other players)
- **`PlayerBattleMap.jsx`**: Render fog as opaque black squares over unrevealed cells. Fade-in animation on reveal (0.3s opacity transition).
- **Fog state in DB**: Stored as part of `battle_maps.state_json` (via M3), so fog persists between sessions

**Requires:** M3 (DB maps), W3 (map sync)

**Validation:**
1. DM reveals area → players see that area, rest is black
2. DM hides area → area goes black again for players
3. Close app → reopen encounter → fog state preserved
4. Player reconnects mid-session → gets current fog state

---

### I2: AoE Calculator (5 days)

New `AoEOverlay.jsx` rendered on battle map canvas:

**Shapes:** Cone, Sphere, Cube, Line, Cylinder — each with dimension inputs matching 5e rules

**Flow:**
1. DM selects shape from toolbar dropdown
2. Input size (radius/length/width in feet)
3. Click origin point on map + drag direction (for cone/line)
4. Highlighted cells show affected area (semi-transparent color overlay)
5. System auto-detects tokens within affected cells
6. Panel shows: "Affected: Goblin 1, Goblin 2, Fighter" with their saves/AC
7. "Apply Damage" button: input damage dice + type → rolls → applies to each affected target with W2 damage type processing
8. Save prompt: If spell requires a save, prompt for each target's save result

**Grid math:**
- 5ft per cell (configurable in map settings)
- Cone: 53° spread from origin (PHB rule, expands 1 cell per row at 45°)
- Sphere: All cells whose center is within radius of origin
- Cube: Square area starting from edge
- Line: Path with 5ft width from origin to length
- Cylinder: Same as sphere but labeled differently (vertical)

**Requires:** M3, W2, I3 (map layers)

**Validation:**
1. Select "Cone 30ft" → click origin → drag north → 6-cell cone highlighted
2. Two goblins inside cone → listed as affected
3. "Apply 8d6 fire, DEX DC 15" → goblin 1 fails (full damage), goblin 2 saves (half) → damage applied
4. Damage type processing: fire-resistant creature takes quarter damage on save

---

### I3: Map Layer System (3 days)

Formalize `BattleMap.jsx`'s existing render order into toggleable, named layers:

| Layer | Content | Visibility |
|-------|---------|------------|
| 1. Background | Image/color fill | Always |
| 2. Grid | Square/hex grid lines | Toggleable |
| 3. Hazard Zones | Colored overlays from E5 | Toggleable |
| 4. Drawings | DM freehand drawings | Toggleable |
| 5. Tokens | Creature tokens with HP bars | Always |
| 6. AoE Overlay | Spell area from I2 | Toggleable |
| 7. Fog | Opaque cells from I1 | Always for players |
| 8. DM Annotations | Text labels, arrows, circles (DM-only) | Never synced to players |

**Implementation:**
- Layer visibility toggles in map toolbar (checkboxes or eye icons)
- Canvas draw function iterates layers in order, skipping hidden ones
- Players always see layers 1-5, 7. Layer 6 shown during AoE placement. Layer 8 never synced.
- DM Annotations layer: text tool, arrow tool, circle tool. For marking traps, notes, planned movements. Persisted in map state but excluded from sync payload.

**Validation:**
1. Toggle off grid layer → grid lines disappear, tokens still visible
2. Toggle off hazard zones → hazard overlay hidden but hazards still trigger on turn advance
3. DM adds annotation "Secret Door" → player does not see it
4. Export map state → all layers preserved including hidden ones

---

### I4: Analytics Dashboard (5 days)

**Migration SQL (#13):**
```sql
CREATE TABLE IF NOT EXISTS campaign_milestones (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    milestone_type TEXT DEFAULT 'story',
    session_id TEXT,
    date_key TEXT,
    created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_milestones_campaign ON campaign_milestones(campaign_id);
CREATE INDEX IF NOT EXISTS idx_event_log_type ON event_log(campaign_id, event_type);
CREATE INDEX IF NOT EXISTS idx_event_log_ts ON event_log(campaign_id, ts);
```

**Extend `commands/session_mgmt.rs`:**
- `get_session_analytics(state) → { sessions: [...], avg_duration, total_sessions }`
- `get_combat_analytics(state) → { encounters, monsters_killed, total_damage, per_player_stats }`
- `get_event_type_breakdown(state) → { combat_pct, roleplay_pct, exploration_pct }`
- `add_campaign_milestone(state, title, description, milestone_type) → { id }`

**New frontend:** `Analytics.jsx` — lightweight SVG charts (no external chart library):
- **Session duration**: Horizontal bar chart (last 10 sessions)
- **Combat balance**: Combat% / roleplay% / exploration% stacked bar
- **Damage leaderboard**: Per-player damage dealt/taken (horizontal bars)
- **Monster bestiary**: Most-killed monsters ranked list with kill counts
- **XP progression**: Line chart showing party XP over sessions
- **Campaign timeline**: Scrollable SVG with milestones, session markers, and key events
- **Stat cards**: Total sessions, total encounters, total monsters killed, total player deaths, longest session

---

### I5: Enhanced Handouts (2 days)

**Extend `handouts` table (migration #14):**
```sql
ALTER TABLE handouts ADD COLUMN handout_type TEXT DEFAULT 'text';
ALTER TABLE handouts ADD COLUMN image_path TEXT;
ALTER TABLE handouts ADD COLUMN category TEXT DEFAULT 'general';
ALTER TABLE handouts ADD COLUMN read_by_json TEXT DEFAULT '[]';
```

**Enhancements:**
- **Image handouts**: Upload image files (maps, letters, item art), stored in `{data_dir}/handouts/`
- **Category tabs**: All / Maps / Letters / Items / Lore — filterable
- **Player "read" tracking**: When player opens a handout, their ID added to `read_by_json`. DM sees eye icon with count: "3/4 players viewed"
- **Inline image viewer**: Click image → fullscreen with zoom/pan
- **Reveal timing**: DM can mark handouts as "hidden" and reveal them during play (existing sync flow)

---

### I6: Player Voting (1.5 days)

**No new tables.** Ephemeral — uses party sync events only.

**Events:**
- `vote_poll`: DM broadcasts question + options
- `vote_response`: Player sends their choice
- `vote_results`: DM broadcasts tally

**DM UI:** "Create Poll" button in communication panel:
- Question text input
- 2-6 option inputs
- "Anonymous" checkbox (results don't show who voted what)
- "Send Poll" → broadcasts to all players

**Player UI:** Popup overlay (similar to `PlayerPromptPopup.jsx`):
- Question + option buttons
- Click to vote → disabled after voting
- "Waiting for results..." until DM reveals

**DM results view:**
- Real-time vote tally as responses arrive
- "Reveal Results" button → broadcasts to all players
- Bar chart showing vote distribution

---

### I7: Shared Party Inventory (2 days)

**Migration SQL (#15):**

```sql
CREATE TABLE IF NOT EXISTS party_inventory (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id),
    item_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    weight REAL DEFAULT 0,
    value_gp REAL DEFAULT 0,
    rarity TEXT DEFAULT 'common',
    held_by TEXT,
    notes TEXT DEFAULT '',
    created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_party_inv_campaign ON party_inventory(campaign_id);

CREATE TABLE IF NOT EXISTS party_treasury (
    campaign_id TEXT PRIMARY KEY REFERENCES campaigns(id),
    platinum INTEGER DEFAULT 0,
    gold INTEGER DEFAULT 0,
    electrum INTEGER DEFAULT 0,
    silver INTEGER DEFAULT 0,
    copper INTEGER DEFAULT 0,
    updated_at INTEGER NOT NULL
);
```

**New Rust file:** `commands/party_inventory.rs`
- `list_party_inventory(state) → Vec<Item>`
- `add_party_item(state, item_name, quantity, weight, value_gp, rarity, notes) → { id }`
- `update_party_item(state, item_id, ...fields)`
- `delete_party_item(state, item_id)`
- `assign_item_to_player(state, item_id, player_name)`
- `get_party_treasury(state) → { pp, gp, ep, sp, cp, total_gp }`
- `update_party_treasury(state, pp, gp, ep, sp, cp)`
- `split_currency(state, num_players) → { per_player: { pp, gp, ep, sp, cp }, remainder: { ... } }`

**Frontend:** `PartyInventoryPanel.jsx`:
- **Sortable table**: Name, Qty, Weight, Value, Rarity, Held By
- **DM adds loot**: Quick-add form, or "Add to Inventory" from loot generator (Q5)
- **Currency tracker**: PP/GP/EP/SP/CP inputs with running total in GP equivalent
- **"Split Evenly" button**: Divides currency among N players, shows remainder
- **Weight tracking**: Total weight, optional encumbrance warnings
- **Rarity color coding**: Common (gray), Uncommon (green), Rare (blue), Very Rare (purple), Legendary (orange)

---

### I8: Campaign Export Enhancements (2 days)

**Extend `commands/export.rs`:**

1. **ZIP archive export**: Bundle campaigns.db + all character DBs + map images + handout images + location images into a single .zip file. Portable between machines.

2. **Markdown wiki export**: Generate folder structure:
   ```
   campaign_export/
   ├── README.md (campaign name, creation date, session count)
   ├── sessions/ (one .md per session with recap)
   ├── npcs/ (one .md per NPC with description, personality, faction)
   ├── quests/ (one .md per quest with status, objectives, history)
   ├── factions/ (one .md per faction with reputation, relationships)
   ├── locations/ (one .md per location with hierarchy, linked NPCs)
   └── encounters/ (one .md per encounter with monsters, outcome)
   ```

3. **Homebrew package export**: Campaign homebrew_items as standalone JSON with version metadata, importable into other campaigns.

---

## Layer 6: POLISH — DM Quality of Life & Player Experience

**Goal:** Reduce friction, support all display scenarios, and ensure data safety.

**Total effort: ~4 weeks**

---

### Q1: Campaign-Wide Search (2 days)

**No new tables.** Query across all existing tables.

**New Rust command** in `commands/campaigns.rs`:
```rust
#[tauri::command]
pub fn search_campaign(
    query: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let campaign_id = require_active_campaign(&state)?;
    with_campaign_conn(&state, |conn| {
        let pattern = format!("%{}%", query);
        let mut results = vec![];

        // Search NPCs (name, description, dm_notes)
        // Search quests (title, description)
        // Search world_state (key, value)
        // Search scenes (name, description)
        // Search locations (name, description, dm_notes) — if E3 built
        // Search factions (name, description, dm_notes) — if E2 built
        // Search dm_notes (title, content) — if M5 built
        // Search handouts (title, content)
        // Search homebrew_items (name) — if M4 built

        // Each result: { id, name, type, snippet, relevance_score }
        Ok(serde_json::json!({ "results": results }))
    })
}
```

**Frontend:** `Ctrl+K` opens search palette (VS Code command palette style):
- Text input at top, debounced 300ms search
- Results grouped by type with icons (🧑 NPC, 📜 Quest, 🗺️ Location, etc.)
- Click result → navigate to that item (open NPC panel, quest detail, etc.)
- Recent searches remembered (session-only)
- Fuzzy matching on name, full-text on description/notes
- Keyboard navigation: arrow keys + Enter to select

**Validation:**
1. Search "ruby" → finds NPC with "ruby ring" in description, quest mentioning "ruby mines"
2. Click NPC result → NPC panel opens with that NPC selected
3. Empty query → shows recent items modified
4. No results → "No matches for 'xyz'"

---

### Q2: Encounter Duplication (1 day)

**New Rust command** in `commands/encounters.rs`:
```rust
#[tauri::command]
pub fn duplicate_encounter(
    encounter_id: String,
    target_scene_id: String,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    // Copy encounter row with new UUID, reset status to 'pending', round to 0
    // Copy all monsters with new UUIDs, linked to new encounter, full HP restored
    // Copy hazards if encounter_hazards table exists (E5)
    // Copy battle_map if battle_maps table exists (M3) with new map UUID
    // Do NOT copy combat history, event log, or initiative state
}
```

**Frontend:** "Duplicate" button (copy icon) on encounter cards in scene view. Context menu: "Duplicate to this scene" / "Duplicate to another scene" (scene picker dropdown).

**Use case:** DM prepared "Goblin Patrol" and wants to reuse it 3 times with minor tweaks. Currently has to recreate from scratch each time.

**Validation:**
1. Create encounter with 3 goblins → duplicate → new encounter with same 3 goblins at full HP
2. Original encounter's combat history not copied (clean slate for duplicate)
3. Duplicate to different scene → encounter appears in target scene

---

### Q3: Monster Variants (2 days)

**No new tables.** Extends the existing "add monster to encounter" flow.

When adding an SRD monster to an encounter, add a "Customize" button:

```javascript
const variant = {
    hp_delta: +10,
    ac_delta: +2,
    name_prefix: "Elite",
    extra_attacks: [{ name: "Fire Sword", bonus: 5, damage: "1d8+3 fire" }],
    extra_resistances: ["fire"],
    extra_conditions_immune: [],
    notes: "Carries a flame blade stolen from the wizard tower"
};
```

**Quick presets:**
- **Tougher** (+50% HP) — for when one goblin is the veteran
- **Armored** (+2 AC) — plate armor upgrade
- **Leader** (+HP, +damage, +1 to hit) — boss variant
- **Minion** (1 HP, same damage) — 4e-style minions for swarm encounters

**Storage:** Variant data merged into `stat_block_json` in the monster entry. Original base stat block preserved as `base_stat_block` key for reference.

**Visual:** "Elite Goblin (Variant)" with colored border in initiative list. Stat block shows modified values with delta indicators: "HP: 21 (+10)", "AC: 17 (+2)".

**Validation:**
1. Add Goblin → "Customize" → select "Leader" preset → HP and damage increase shown
2. Monster shows as "Goblin Leader (Variant)" in initiative
3. Stat block panel shows modified values with deltas
4. Damage type processing uses modified resistances

---

### Q4: Quick Rules Reference Panel (1.5 days)

**Current state:** `RulesReference.jsx` exists as a full-page section. `rules5e.js` has 25KB+ of structured rule data. But during live combat, the DM has to navigate away from combat to check rules.

**New component:** `FloatingRulesRef.jsx`
- Floating, draggable panel (same pattern as DM Scratchpad)
- Quick-access tabs: Conditions, Actions in Combat, Cover, Grappling, Suffocation, Fall Damage, Spellcasting, Object Interactions
- Search bar: type "grapple" → filtered to grapple rules
- Pinnable: keep open during combat, collapses to small icon when minimized
- Keyboard shortcut: `F1` to toggle
- Data: Reuse existing `rules5e.js` — just render in compact floating panel

**Validation:**
1. In combat → press F1 → floating rules panel appears over combat UI
2. Search "grapple" → grapple contest rules shown
3. Minimize → small 📖 icon in corner → click to expand
4. Drag panel to preferred position → stays there

---

### Q5: Loot/Treasure Generation (2 days)

**No new tables.** Uses DMG treasure tables as frontend data.

**New data file:** `frontend/src/data/treasureTables.js`

```javascript
export const INDIVIDUAL_TREASURE = {
    'CR 0-4': [
        { roll: [1, 30], cp: '5d6', sp: 0, gp: 0 },
        { roll: [31, 60], cp: 0, sp: '4d6', gp: 0 },
        { roll: [61, 70], cp: 0, sp: 0, ep: '3d6' },
        { roll: [71, 95], cp: 0, sp: 0, gp: '3d6' },
        { roll: [96, 100], cp: 0, sp: 0, gp: 0, pp: '1d6' },
    ],
    'CR 5-10': [ /* ... */ ],
    'CR 11-16': [ /* ... */ ],
    'CR 17+': [ /* ... */ ],
};

export const HOARD_TREASURE = {
    'CR 0-4': {
        coins: { cp: '6d6*100', sp: '3d6*100', gp: '2d6*10' },
        gems_art: [ /* gem/art tables by d100 roll */ ],
        magic_items: [ /* magic item table references A-I */ ],
    },
    // ... other CR ranges
};

export const MAGIC_ITEM_TABLES = {
    A: [ /* common consumables: potions, scrolls */ ],
    B: [ /* uncommon permanent items */ ],
    // ... through I (legendary items)
};
```

**Frontend:** "Generate Loot" button in DM toolbar + appears after encounter ends:
- Select CR range or enter specific CR
- Choose "Individual" (per creature) or "Hoard"
- Roll on tables → display results: coins, gems, art objects, magic items with descriptions
- "Add to Party Inventory" button (integrates with I7 if built)
- "Add to Party Treasury" button for coins
- "Reroll" button for different results
- History of generated loot (session-only)

---

### Q6: Session Scheduling (1 day)

**No new tables.** Uses existing `settings` KV table.

```json
{
    "next_session_date": "2026-03-19T19:00:00",
    "session_frequency": "weekly",
    "session_day": "thursday",
    "session_notes": "Picking up from the dungeon entrance"
}
```

**Frontend widget in campaign hub:**
- "Next Session: Thursday, March 19 (6 days away)"
- Countdown display
- Quick note field: "Picking up from..."
- Auto-set next session based on frequency after current session ends
- If calendar (M2) built: auto-create calendar event for session dates

---

### Q7: Theater of the Mind Toggle (0.5 days)

**No new tables.** UI toggle in DM toolbar.

"Theater of the Mind" / "Battle Map" toggle button:

When Theater of the Mind is active:
- Battle map panel hidden (not destroyed — state preserved)
- Initiative tracker expands to show more detail: descriptions, all conditions with effects, HP bars inline
- All combat mechanics (initiative, turns, damage, conditions, death saves) work identically
- No map sync events sent to players
- Players see expanded initiative-only combat view with their own conditions and HP

**This mostly already works** — the combat system is independent of the map. The toggle just hides the map panel and adjusts CSS layout.

---

### P1: Token Auras & Ranges on Map (2 days)

**No new tables.** Extends battle map canvas rendering.

Token aura data:
```javascript
token.auras = [
    { radius: 10, color: '#fbbf24', label: 'Aura of Protection', opacity: 0.15 },
    { radius: 30, color: '#3b82f6', label: 'Darkvision', opacity: 0.08 },
];
token.movementRange = 30; // feet
```

**Canvas rendering** (in BattleMap.jsx token layer):
- Selected token: dashed circle showing movement range
- Auras: semi-transparent filled circles, centered on token, rendered behind token sprite
- Spell range: when DM clicks "Cast Spell" + enters range, show range circle from caster

**DM UI:** Right-click token → "Set Aura" → radius (ft) + color picker + label. Presets:
- Paladin Aura of Protection (10ft / 30ft at Lv18)
- Light cantrip (20ft bright / 40ft dim, concentric circles)
- Spirit Guardians (15ft)

**Sync:** Aura data included in token state, synced to players via `battle_map_sync`.

---

### P2: Projector/TV Display Mode (2 days)

**New page:** `frontend/src/pages/ProjectorView.jsx`

Full-screen, chrome-free display for TV/projector at the physical game table:

**Content (DM controls what's shown):**
- Battle map (fills 75% of screen)
- Initiative order (vertical bar, right side, current turn highlighted with glow)
- Scene name + mood overlay
- Active conditions per combatant (icon row)
- Weather widget (if E7 built)

**NOT shown (DM-only information):**
- Exact monster HP (shows tier: Healthy/Bloodied/Critical only)
- DM notes, DM annotations
- Fog-hidden areas (shows fog)
- Whisper messages

**Design:**
- Black background, high contrast colors
- Minimum 24px text for readability at distance (10+ feet)
- No scrolling — everything visible at once
- Auto-scales to display resolution (CSS `vw`/`vh` units)

**Access:** "Open Projector View" button in DM toolbar → opens new browser window. Projector view connects to same party room as a read-only client. Receives all sync events but sends nothing.

---

### P3: Mobile/Tablet Responsive Player View (3 days)

**No new tables.** CSS and layout changes to player session components.

**Current state:** `PlayerSession.jsx`, `PlayerCombatHUD.jsx`, `PlayerBattleMap.jsx` are desktop-first with no responsive breakpoints.

**Responsive CSS:**
```css
@media (max-width: 768px) {
    .player-session-layout {
        flex-direction: column;
        padding: 8px;
    }
    .player-combat-hud { font-size: 14px; padding: 8px; }
    .player-battle-map {
        height: 50vh;
        touch-action: manipulation; /* prevent double-tap zoom */
    }
    .player-initiative-bar {
        flex-direction: row;
        overflow-x: auto; /* horizontal scroll */
    }
}

@media (max-width: 480px) {
    .player-hp-display { font-size: 24px; } /* large, tappable */
    /* Non-essential panels collapse to tabs */
}
```

**Touch interactions for battle map:**
- Pinch-to-zoom (verify touch events work with existing pan/zoom)
- Tap token to select (larger hit target: 44px minimum per Apple HIG)
- Swipe to pan

**Bottom tab bar on mobile:**
- Combat | Map | Inventory | Spells | Chat
- Only one visible at a time
- Badge indicators on tabs (e.g., red dot on Chat when new whisper)

---

### P5: Auto Session Recap from Event Log (1.5 days)

**Current state:** `SessionRecap.jsx` exists and generates AI recaps via Ollama. But if Ollama isn't running, there's no recap at all — the DM sees a blank page.

**Non-AI fallback** — structured recap from `event_log` data:

```javascript
export function generateStructuredRecap(events) {
    return {
        duration: calculateDuration(events),
        encounters: extractEncounters(events),
        npcsDiscovered: extractByType(events, 'npc_discovered'),
        questsUpdated: extractByType(events, 'quest_updated'),
        xpAwarded: sumByType(events, 'xp_awarded'),
        monstersKilled: extractByType(events, 'monster_killed'),
        playerStats: aggregatePlayerStats(events),
        keyMoments: extractKeyMoments(events), // crits, deaths, level-ups
    };
}
```

**Rendered output:**
```
Session #12 — 2h 45m

Encounters (2):
  - Goblin Ambush: 4 goblins, 3 rounds, 0 player deaths
  - Bugbear Chief: 1 bugbear + 2 wolves, 5 rounds, 1 player downed

Monsters Defeated: 4 Goblins, 2 Wolves, 1 Bugbear Chief
XP Awarded: 450

NPCs Met: Sildar Hallwinter
Quests Updated: "Rescue Sildar" → Active

Player Stats:
  Fighter: 45 dmg dealt, 12 dmg taken
  Wizard: 32 dmg dealt, 8 dmg taken, 15 healing done
  Rogue: 28 dmg dealt, 5 dmg taken

Key Moments:
  - Wizard critical hit with Fireball (32 damage)
  - Fighter dropped to 0 HP, stabilized by Cleric
```

**Two modes:** "Quick Recap" (structured data, always available) and "AI Recap" (narrative prose, requires Ollama).

**Export:** "Copy as Markdown" button for sharing in Discord/campaign journals.

---

### S1: Campaign Backup System (2 days)

**Current state:** `useAutoBackup.js` exists for character data. No campaign-level backup. A corrupted DB means total campaign loss.

**New Rust file:** `commands/backup.rs`
```rust
#[tauri::command]
pub fn backup_campaign(state: State<'_, AppState>) -> Result<String, String> {
    let campaign_id = require_active_campaign(&state)?;
    let backup_dir = state.data_dir.join("backups");
    fs::create_dir_all(&backup_dir).map_err(|e| e.to_string())?;

    let timestamp = chrono::Utc::now().format("%Y%m%d_%H%M%S");
    let backup_path = backup_dir.join(format!("campaign_{}_{}.db", campaign_id, timestamp));
    let source = state.data_dir.join("campaigns.db");
    fs::copy(&source, &backup_path).map_err(|e| e.to_string())?;

    prune_old_backups(&backup_dir, &campaign_id, 10)?; // keep last 10
    Ok(backup_path.to_string_lossy().to_string())
}

#[tauri::command]
pub fn list_backups(state: State<'_, AppState>) -> Result<Vec<serde_json::Value>, String> { ... }

#[tauri::command]
pub fn restore_backup(backup_path: String, state: State<'_, AppState>) -> Result<(), String> { ... }
```

**Auto-backup triggers:**
- On session start (before any changes — clean restore point)
- On session end (after all changes saved)
- On app close (if session was active)
- Manual "Backup Now" button in campaign settings

**Frontend:** Backup management UI in campaign settings:
- List of backups: timestamp, size, session label
- "Restore" button with confirmation dialog: "This will replace current campaign data. Are you sure?"
- "Backup Now" button
- Auto-backup toggle (default: on)

---

### S2: Input Validation Layer (2 days)

**Problem:** JSON payloads (`initiative_json`, `stat_block_json`, `template_json`, `state_json`) are not validated before storage. Malformed JSON could corrupt display or crash the frontend.

**New module:** `src-tauri/src/validation.rs`

```rust
pub fn validate_initiative_json(json: &str) -> Result<(), String> {
    let arr: Vec<Value> = serde_json::from_str(json)
        .map_err(|_| "Invalid initiative JSON: must be an array")?;
    for entry in &arr {
        if entry.get("name").and_then(|v| v.as_str()).is_none() {
            return Err("Initiative entry missing 'name' field".to_string());
        }
    }
    if arr.len() > 100 {
        return Err("Initiative order cannot exceed 100 entries".to_string());
    }
    Ok(())
}

pub fn validate_stat_block_json(json: &str) -> Result<(), String> {
    serde_json::from_str::<Value>(json).map_err(|_| "Invalid stat block JSON")?;
    if json.len() > 50_000 { return Err("Stat block exceeds 50KB limit".to_string()); }
    Ok(())
}

pub fn validate_battle_map_state(json: &str) -> Result<(), String> {
    serde_json::from_str::<Value>(json).map_err(|_| "Invalid battle map state")?;
    if json.len() > 5_000_000 { return Err("Map state exceeds 5MB limit".to_string()); }
    Ok(())
}
```

Apply validation in all commands that accept JSON payloads. Frontend shows specific error messages on validation failure.

---

### S3: WebSocket Rate Limiting (1 day)

**Problem:** `party.rs:19` has `RATE_LIMIT_MSGS: 10/sec` with warnings, but `session_ws.rs` has no rate limiting. A misbehaving client could flood the session.

**Add to `session_ws.rs`:**
- Rate limit: 20 msgs/sec (higher than party — combat is bursty with rapid damage/condition updates)
- Messages exceeding limit are silently dropped with server-side log
- Disconnection resilience: queue up to 50 undelivered events for 60s, replay on reconnect

---

### S4: Crash Recovery Enhancement (1 day)

**Extend `useCrashRecovery.js` snapshots to include:**
- Legendary action/resistance state (M6)
- Hazard state (E5)
- Death save state (A1)
- Readied actions (A3)
- Current battle map ID (M3)
- Active DM note ID being edited (M5)

**Enhanced recovery flow:**
- App crash → restart → detect orphaned snapshot → "Recovery Available" banner
- Show: campaign name, scene name, encounter status, time of snapshot
- "Resume Session" → restore all state
- "Discard" → delete snapshot, start fresh

---

### S5: Event Log Performance (1 day)

**Problem:** Event log has only one index. Filtering by event_type or timestamp range does full table scans. Campaigns with 10,000+ events see noticeable query lag.

**Migration SQL (#16):**
```sql
CREATE INDEX IF NOT EXISTS idx_event_log_type ON event_log(campaign_id, event_type);
CREATE INDEX IF NOT EXISTS idx_event_log_ts ON event_log(campaign_id, ts);
```

**Add aggregation command** to `session_mgmt.rs` for analytics (I4) and recap (P5):
```rust
#[tauri::command]
pub fn get_event_log_stats(
    session_id: Option<String>,
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    // Aggregated: event counts by type, total damage, monster kills, session duration
}
```

**Target:** Query 10,000+ event_log rows by type → <100ms response.

---

## Dependency Graph

```
M1 (migration runner) ───┬──→ M2 (calendar) ────→ E7 (weather/travel)
                          ├──→ M3 (battle map) ──→ W3 (sync) ──→ I1 (fog) ──→ I2 (AoE)
                          │                         ↑               ↑
                          │                      P1 (auras)      I3 (layers)
                          ├──→ M4 (homebrew)
                          ├──→ M5 (dm notes) ────→ E1a (scratchpad)
                          └──→ M6 (combat) ──────→ W6 (legendary)
                                                  → A1 (death saves)
                                                  → A2 (multi-attack)
                                                  → A5 (spell slots)

W1 (conditions) ──→ standalone (used by A2 for attack modifiers)
W2 (damage types) ─→ I2 (AoE damage), A2 (multi-attack damage)
W4 (mood sync) ────→ standalone (includes ambient audio)
W5 (whispers) ─────→ standalone

E1b (templates) ───→ standalone
E1c (hotkeys) ─────→ A4 (Ctrl+Z undo)
E1d (pacing) ──────→ standalone
E2 (factions) ─────→ E8 (AI context)
E3 (locations) ────→ E8 (AI context)
E4 (NPC map) ──────→ standalone
E5 (hazards) ──────→ I3 (map layers)
E6 (surprise) ─────→ standalone
E8 (AI context) ───→ E9 (NPC dialogue), E10 (session prep)

A3 (readied actions) ──→ standalone
A4 (HP undo) ──────────→ standalone
Q1 (search) ───────────→ standalone (queries all existing tables)
Q2 (encounter dupe) ───→ standalone
Q3 (monster variants) ──→ standalone
Q4 (floating rules) ───→ standalone
Q5 (loot tables) ──────→ I7 (party inventory)
Q6 (session schedule) ──→ M2 (calendar event)
Q7 (theater of mind) ──→ standalone

P2 (projector view) ───→ W3 (map sync)
P3 (mobile responsive) ─→ standalone
P5 (auto recap) ───────→ standalone (reads event_log)

S1 (backups) ──────────→ standalone
S2 (validation) ───────→ all new command files
S3 (WS rate limiting) ──→ standalone
S4 (crash recovery) ───→ M3, M5, M6, A1, A3, E5
S5 (event log perf) ───→ I4 (analytics)

I4 (analytics) ────→ S5 (needs indexes)
I5 (handouts) ─────→ standalone
I6 (voting) ───────→ standalone
I7 (inventory) ────→ standalone
I8 (export) ───────→ all migrations
```

---

## Optimal Build Sequence

```
Week 1-2:    ~~M1~~ ✅ → M2 → M3 → M4 → M5 → M6          (Layer 1: all DB migrations)
                                                            Release v0.6.0

Week 3:      W1 + W2 + W4 + W5                            (Layer 2: parallel wiring, independent)
Week 4:      W3 + W6                                       (Layer 2: sync + legendary completion)
                                                            Release v0.7.0

Week 5:      A1 + A3 + A4                                  (Layer 3: death saves, readied, undo)
Week 6:      A2 + A5 + E1d                                 (Layer 3: multi-attack, spell slots, pacing)
                                                            Release v0.8.0

Week 7:      E1a + E1b + E1c                               (Session flow tools)
Week 8:      E2 (factions)                                  (Full week — 4-table system)
Week 9:      E3 (locations) + Q6                            (Hierarchy system + scheduling)
Week 10:     E4 (NPC map) + E5 (hazards)                   (Parallel: graph viz + combat hazards)
Week 11:     E6 + E7                                        (Initiative variants + calendar deep)
Week 12:     E8 + E9 + E10 + Q7                            (AI enrichment + theater of mind)
                                                            Release v0.9.0

Week 13:     I3 (map layers) + P1 (auras)                  (Canvas work, same subsystem)
Week 14:     I1 (fog of war)                                (Dedicated week — complex sync)
Week 15:     I2 (AoE) + I4 (analytics)                     (Map calc + data viz, independent)
Week 16:     I5 + I6 + I7 + I8                             (Handouts, voting, inventory, export)
                                                            Release v1.0.0

Week 17:     Q1 + Q2 + Q3 + Q4 + Q5                       (DM QoL: search, dupe, variants, rules, loot)
Week 18:     P2 (projector) + P3 (mobile) + P5 (recap)    (Player experience polish)
Week 19:     S1 + S2 + S3 + S4 + S5                       (Infrastructure: backup, validation, perf)
                                                            Release v1.1.0
```

---

## Totals

| Metric | Count |
|--------|-------|
| New database tables | 20 |
| Altered tables | 5 (encounters, monsters, action_buttons, scenes, handouts) |
| New indexes | 4 |
| New Rust command files | 14 |
| New React components | ~20 |
| New utility/data files | 4 (conditionLogic.js, migrations.rs, validation.rs, treasureTables.js) |
| New sync event types | ~8 |
| Features already built (just need migration) | 6 |
| Features cut from original roadmap | 7 |
| Releases | 6 (v0.6.0 through v1.1.0) |
| **Total items** | **55 (1 complete, 54 remaining)** |
| **Total estimated time** | **~19 weeks (~18 remaining)** |

---

## Features Cut (and Why)

| Feature | Reason |
|---------|--------|
| Dialogue Tree Builder (visual node editor) | 3-6 weeks alone. Markdown dialogue in DM notes achieves 80% at 5% cost. |
| Roll20 Import | Undocumented, changing JSON format. Maintenance nightmare for low demand. |
| Foundry VTT Import | Same — complex, fragile, undocumented export format. |
| Session Recording & Replay | Massive engineering for niche use. Event log + recap covers 90%. |
| Co-DM Hosting | Complex permission model, edge case. Build only if 10+ users request. |
| Campaign Templates | Export/import with "strip player data" option covers this use case. |
| Player Approval Workflow | Over-engineered. DM whisper achieves the same goal. |

---

## Verification Checklist (applied to every item)

1. **Storage**: Data persists after app restart (no localStorage for campaign data)
2. **Campaign-linked**: Data travels with campaign export/import
3. **Sync**: Changes appear on player screens within 1 second
4. **Compile**: `cargo check` + `npx vite build` clean, zero warnings
5. **Round-trip**: Create → save → close → reopen → data intact
6. **Multiplayer**: DM change → player sees → player reconnects → state correct
7. **Migration safe**: Existing campaign data preserved during upgrade

---

## Registration Pattern (for all new Rust modules)

1. Add `pub mod <name>;` to `src-tauri/src/commands/mod.rs`
2. Add command functions to `.invoke_handler(tauri::generate_handler![...])` in `main.rs`
3. Follow existing pattern: `ensure_campaign_conn()`, `with_campaign_conn()`, `require_active_campaign()`
4. Return `Result<serde_json::Value, String>` for IPC compatibility
5. Use `uuid::Uuid::new_v4().to_string()` for primary keys
6. Use `chrono::Utc::now().timestamp()` for timestamps
7. Validate JSON inputs using `validation.rs` (after S2)

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| localStorage migration loses data | High | Medium | Auto-migration reads before clearing; manual export available as backup |
| Condition automation changes combat feel | Medium | Medium | All automation is advisory (indicators, not forced). Per-feature toggle in settings. |
| Canvas features (fog, AoE, layers) perform poorly | Medium | Low | 2D canvas only, no WebGL. Debounce heavy operations. Test at 100+ tokens. |
| Ollama unavailable for AI features | Low | High | Every AI feature has a non-AI fallback or graceful "unavailable" state |
| WebSocket sync lag during large combats | Medium | Low | Rate limiting (S3), message batching, delta-only updates for map state |
| DB file corruption | High | Low | Auto-backup system (S1), WAL mode for SQLite, validation layer (S2) |
| Scope creep on world-building features (factions, locations, NPCs) | Medium | High | Each feature has explicit MVP scope and "done" validation. Polish is future work. |
