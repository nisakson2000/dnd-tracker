# DM Live Session Dashboard — Complete Design Specification

## Overview

The DM Live Session Dashboard is a full-screen, multi-panel view that replaces the current DM-mode `CharacterView` sidebar+section layout during active play. It gives the DM everything they need at a glance: party vitals, combat state, quick reference, and session management — all updating in real-time over the existing Party Connect WebSocket.

Entry point: a new **"Go Live"** button in Campaign Hub or the sidebar. Exits back to normal DM view via an **"End Session"** button.

---

## Architecture

### New Files

```
src/
  pages/
    DMSessionDashboard.jsx        ← top-level page component (new route)
  components/dm-session/
    SessionTopBar.jsx             ← timer, round counter, connected players, quick actions
    PartyVitalsPanel.jsx          ← left panel — all player HP/AC/conditions
    PlayerDetailDrawer.jsx        ← expand-on-click overlay for a single player
    ActiveContentPanel.jsx        ← center panel — encounter/exploration/roleplay switcher
    CombatTracker.jsx             ← initiative order, turn, enemy HP (used inside ActiveContentPanel)
    ExplorationView.jsx           ← location, NPCs, hazards
    RoleplayView.jsx              ← active NPC card with motivations
    QuickReferencePanel.jsx       ← right panel — DC table, conditions, scratchpad
    SessionNotesWidget.jsx        ← DM private scratchpad (auto-saved to localStorage)
    PlotChecklistWidget.jsx       ← upcoming plot points with checkboxes
    SessionBottomBar.jsx          ← chat/whisper, inline dice roller, (future) music controls
    DMWhisperChat.jsx             ← chat messages + whisper-to-player dropdown
    InlineDiceRoller.jsx          ← compact dice roller for the bottom bar
  hooks/
    useSessionTimer.js            ← real-world elapsed time hook
    useSessionState.js            ← orchestrates all dashboard state + WS sync
  contexts/
    SessionContext.jsx            ← provides session state to all dashboard children
```

### Modified Files

```
App.jsx                           ← add route: /dm-session/:characterId
Sidebar.jsx                       ← add "Go Live" button for DM mode
contexts/PartyContext.jsx          ← extend WS protocol with new DM message types
src-tauri/src/party.rs            ← extend server to handle new message types
```

### Route

```jsx
<Route path="/dm-session/:characterId" element={<DMSessionDashboard />} />
```

---

## Layout — CSS Grid

```
+------------------------------------------------------------------+
|                        SESSION TOP BAR                            |  48px fixed
+------------------------------------------------------------------+
| PARTY VITALS  |         ACTIVE CONTENT           | QUICK REF     |
| (left panel)  |         (center panel)           | (right panel) |
|    280px       |           flex: 1                |   300px       |
|               |                                   |               |
|               |                                   |               |
+------------------------------------------------------------------+
|                        SESSION BOTTOM BAR                         |  52px fixed
+------------------------------------------------------------------+
```

```css
.dm-session-grid {
  display: grid;
  grid-template-rows: 48px 1fr 52px;
  grid-template-columns: 280px 1fr 300px;
  grid-template-areas:
    "top    top    top"
    "left   center right"
    "bottom bottom bottom";
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
}
```

---

## Component Specifications

### 1. SessionTopBar (`top` area)

**Always visible. No clicks needed for core info.**

| Element | Data Source | Update Trigger |
|---------|-----------|----------------|
| Session Timer | `useSessionTimer()` — starts on mount, pauses if DM pauses | Every second (local) |
| Round Counter | `sessionState.roundNumber` | DM clicks "Next Round" or advances turn past last combatant |
| Connected Players | `party.members` from PartyContext | WS `player_joined` / `player_disconnected` events |
| Player Status Dots | `member.character.last_activity` (timestamp delta) | WS `update` events — if no update in 5 min, show AFK |
| Quick Action: "Start Combat" | Toggles `sessionState.phase` to `'combat'` | Click — broadcasts `dm_phase_change` over WS |
| Quick Action: "Call for Rest" | Opens rest type selector (short/long) | Click — broadcasts `dm_rest_call` over WS |
| Quick Action: "Award XP" | Opens XP input modal, distributes evenly | Click — broadcasts `dm_award_xp` over WS |
| "End Session" | Navigates back to `/character/:id` | Click |

**Component props:**
```ts
interface SessionTopBarProps {
  sessionStartTime: number;        // Date.now() at mount
  isPaused: boolean;
  roundNumber: number;
  phase: 'exploration' | 'combat' | 'roleplay';
  connectedPlayers: PartyMember[];
  onStartCombat: () => void;
  onCallRest: (type: 'short' | 'long') => void;
  onAwardXP: (amount: number) => void;
  onEndSession: () => void;
  onTogglePause: () => void;
}
```

---

### 2. PartyVitalsPanel (`left` area)

**At-a-glance HP for every connected player. Color-coded. Click to expand.**

For each player, show a **compact card** (roughly 80px tall):
- Avatar initial + accent color (reuse existing `AVATAR_COLORS`)
- Name, Class, Level
- HP bar: percentage width, color-coded:
  - `> 50%` → green `#4ade80`
  - `25-50%` → yellow `#eab308` (bloodied)
  - `1-25%` → red `#f87171` (critical)
  - `0` → dark red `#dc2626` + skull icon (unconscious/dying)
- HP numbers: `currentHP / maxHP`
- AC badge
- Active conditions as small colored pills (max 3 visible, "+N more" overflow)
- Concentration indicator: glowing purple dot + spell name if concentrating

**Click a card** → slides open `PlayerDetailDrawer` (an overlay/slide-in from the left, 400px wide):
- Full ability scores (STR through CHA with modifiers)
- Spell slot usage: filled/empty pips per level
- Feature charges: "Channel Divinity 0/1", "Action Surge 1/1"
- Death saves (if unconscious): success/fail pips
- All conditions with full mechanical text
- Close button returns to compact view

**Data requirements per player:**
```ts
interface PlayerVital {
  clientId: string;
  name: string;
  race: string;
  primaryClass: string;
  level: number;
  hp: number;
  maxHp: number;
  tempHp: number;
  ac: number;
  conditions: string[];              // ['Blinded', 'Poisoned']
  concentratingOn: string | null;    // spell name
  spellSlots: { level: number; used: number; max: number }[];
  featureCharges: { name: string; used: number; max: number }[];
  deathSaves: { successes: number; failures: number };
  abilities: { STR: number; DEX: number; CON: number; INT: number; WIS: number; CHA: number };
  lastActivity: number;              // timestamp — for AFK detection
}
```

**Real-time updates:** Every time a player's character data changes, their client sends a WS `update` message (already implemented in `PartyContext.sendUpdate`). The dashboard listens to `members` from `useParty()` and diffs for changes.

---

### 3. ActiveContentPanel (`center` area)

**The main workspace. Switches based on session phase.**

Three modes, switchable via tabs at the top of the center panel AND auto-switched by DM quick actions:

#### 3a. Combat Mode (`phase === 'combat'`)

Uses the existing initiative/combatant data model from `Combat.jsx` but in a dashboard-optimized layout.

**Initiative Tracker (top of center):**
- Horizontal strip of combatant tokens, sorted by initiative
- Current turn highlighted with glowing border
- "Next Turn" / "Previous Turn" buttons
- Round counter synced with top bar
- Click combatant to select — shows detail below

**Selected Combatant Detail (below tracker):**
- If player: shows their vitals (mirrored from left panel, but editable by DM)
- If enemy/NPC: shows HP (editable), AC, attacks, conditions
- DM can adjust HP directly (damage/heal input)
- DM can add/remove conditions

**Enemy HP Trackers (grid below):**
- Grid of enemy cards with name, HP bar, AC, conditions
- Quick damage/heal buttons (5, 10, custom)
- "Kill" button sets HP to 0

**Data model extension for combat state:**
```ts
interface CombatState {
  active: boolean;
  round: number;
  currentTurnIndex: number;
  combatants: Combatant[];          // sorted by initiative
}

interface Combatant {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  ac: number;
  isEnemy: boolean;
  isPlayer: boolean;                // if true, linked to a connected player
  playerId?: string;                // client_id of linked player
  conditions: string[];
  notes: string;
}
```

#### 3b. Exploration Mode (`phase === 'exploration'`)

- **Active Location** card: name, description, environmental notes
- **Available NPCs** at this location (pulled from NPC list, filtered by location tag)
- **Environmental Hazards**: DM-editable list of active hazards with DCs
- **Map Notes**: freeform text area for DM spatial notes
- All stored in `sessionStorage` keyed by characterId (ephemeral per session)

#### 3c. Roleplay Mode (`phase === 'roleplay'`)

- **Active NPC Card**: large card with NPC portrait placeholder, name, role, location
  - **Motivations** (from NPC data)
  - **Secrets** (DM-only, never broadcast)
  - **Personality traits** / voice notes
  - **Relationship to party** (editable dropdown: friendly/neutral/hostile)
- **NPC Selector**: dropdown or search to switch active NPC (from existing NPC data via `get_npcs`)
- **Dialogue Notes**: scratchpad for this conversation

---

### 4. QuickReferencePanel (`right` area)

**Always available regardless of phase. Scrollable. Three collapsible sections.**

#### 4a. DC Table & Common Rules (collapsed by default for space)
Reuse data from `CampaignHub.jsx`'s `DMQuickReference` component:
- DC guidelines table
- Common damage by level
- Condition effects summary (from `conditionEffects.js`)

#### 4b. Session Notes (expanded by default)
- Auto-saved to `localStorage` key `codex_dm_session_notes_{characterId}`
- Textarea with timestamp of last edit
- DM's private scratchpad — never broadcast to players
- Keyboard shortcut: `Ctrl+N` to focus

#### 4c. Plot Checklist (expanded by default)
- Editable list of upcoming plot points/reminders
- Checkbox to mark as done
- Drag to reorder (stretch)
- Persisted to `localStorage` key `codex_dm_plot_checklist_{characterId}`
- "Add item" input at bottom

```ts
interface PlotItem {
  id: string;
  text: string;
  done: boolean;
  order: number;
}
```

---

### 5. SessionBottomBar (`bottom` area)

**Persistent utility strip.**

#### 5a. Chat/Whisper System (left 60% of bottom bar)
- Compact message input + send button
- Messages broadcast to all connected players via WS
- **Whisper mode**: dropdown to select a specific player — message only sent to them
- Message types: `dm_chat` (public) and `dm_whisper` (private, includes target `clientId`)
- Chat history scrollable (max 50 messages in memory)

**WS message format (new types):**
```json
{ "type": "dm_chat", "room": "ABCD", "message": "Roll perception!", "timestamp": "..." }
{ "type": "dm_whisper", "room": "ABCD", "target": "client-id", "message": "You notice...", "timestamp": "..." }
```

#### 5b. Inline Dice Roller (center 25%)
- Compact row of d4/d6/d8/d10/d12/d20/d100 buttons
- Click to roll — result appears inline (fades after 5 seconds)
- Option to broadcast roll to players or keep it secret (toggle)

#### 5c. Music/Ambiance Placeholder (right 15%)
- Placeholder with "Coming Soon" badge
- Future: ambient sound controls via system audio or Spotify API

---

## WebSocket Protocol Extensions

New message types the DM client sends (added to `PartyContext`):

| Type | Direction | Payload | Purpose |
|------|-----------|---------|---------|
| `dm_phase_change` | DM → Server → All | `{ phase: 'combat'|'exploration'|'roleplay' }` | Notify players of mode switch |
| `dm_combat_state` | DM → Server → All | `{ round, currentTurn, combatants[] }` | Sync initiative/turn state |
| `dm_rest_call` | DM → Server → All | `{ restType: 'short'|'long' }` | Prompt players to rest |
| `dm_award_xp` | DM → Server → All | `{ xpPerPlayer: number, reason?: string }` | Award XP notification |
| `dm_chat` | DM → Server → All | `{ message: string }` | Public DM message |
| `dm_whisper` | DM → Server → Target | `{ target: string, message: string }` | Private message to one player |
| `dm_hp_adjust` | DM → Server → Target | `{ target: string, delta: number }` | DM adjusts a player's HP |
| `dm_condition_toggle` | DM → Server → Target | `{ target: string, condition: string, active: boolean }` | DM toggles condition on player |
| `player_vital_update` | Player → Server → DM | Full vital snapshot (extended) | Players send richer data for DM view |

### Backend Changes (`party.rs`)

The Rust server currently forwards most messages to all room members. For `dm_whisper` and `dm_hp_adjust`, add targeted routing:

```rust
// In handle_client_message, add:
"dm_whisper" => {
    // Send only to target client_id + echo back to sender
    let target_id = msg["target"].as_str().unwrap_or("");
    send_to_client(&state, target_id, &response).await;
    send_to_client(&state, &client_id, &response).await;
}
```

For `dm_phase_change`, `dm_combat_state`, `dm_rest_call`, `dm_award_xp`, and `dm_chat` — broadcast to all room members (existing behavior, just new type strings).

---

## State Management

### SessionContext

A new React context that wraps the entire dashboard and combines:
- Party Connect state (from `useParty()`)
- Local session state (timer, phase, combat state, notes, plot checklist)
- Derived data (AFK detection, sorted combatants, player vitals)

```tsx
interface SessionState {
  // Time
  sessionStart: number;
  elapsed: number;                   // seconds
  isPaused: boolean;

  // Phase
  phase: 'exploration' | 'combat' | 'roleplay';

  // Combat (only relevant when phase === 'combat')
  combat: CombatState;

  // Party (derived from PartyContext.members)
  playerVitals: PlayerVital[];

  // DM-local
  sessionNotes: string;
  plotChecklist: PlotItem[];
  chatHistory: ChatMessage[];

  // Exploration
  activeLocation: string;
  environmentNotes: string;
  activeHazards: { name: string; dc: number; effect: string }[];

  // Roleplay
  activeNpcId: string | null;
}
```

### Data Flow

```
Player Client                    WS Server                    DM Dashboard
     |                              |                              |
     |--- update (character) ------>|--- broadcast --------------->|
     |                              |                              | updates playerVitals[]
     |                              |                              |
     |                              |<--- dm_phase_change ---------|
     |<--- dm_phase_change ---------|                              |
     |   (player sees notification) |                              |
     |                              |                              |
     |                              |<--- dm_combat_state ---------|
     |<--- dm_combat_state ---------|                              |
     |   (player sees initiative)   |                              |
     |                              |                              |
     |                              |<--- dm_whisper (target=me) --|
     |<--- dm_whisper --------------|                              |
     |   (only target receives)     |                              |
```

---

## What the DM Sees INSTANTLY vs Click-to-Expand

### INSTANT (always visible, zero clicks)
- Every player's HP bar with color coding
- Every player's AC number
- Active conditions as pills on each player card
- Session elapsed time
- Current round number (in combat)
- Who's connected / AFK
- Current turn in initiative order
- Session notes (right panel, already open)

### ONE CLICK to reveal
- Full player stats (click card → drawer)
- Spell slot breakdown (inside drawer)
- Feature charge usage (inside drawer)
- Condition mechanical effects (click condition pill → tooltip)
- NPC detail card (click NPC in list)
- DM Quick Reference tables (expand in right panel)

### TWO CLICKS to reach
- Adjust a player's HP remotely
- Toggle a condition on a player
- Send a whisper to a specific player

---

## Persistence Strategy

| Data | Storage | Lifetime |
|------|---------|----------|
| Session timer start | `sessionStorage` | Until tab closes |
| Combat state (initiative, combatants, round) | `sessionStorage` | Until tab closes |
| Session notes | `localStorage` | Permanent (per character) |
| Plot checklist | `localStorage` | Permanent (per character) |
| Chat history | In-memory (state) | Until navigation away |
| Phase (combat/exploration/roleplay) | `sessionStorage` | Until tab closes |
| Exploration/roleplay working notes | `sessionStorage` | Until tab closes |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Next turn (in combat) |
| `Ctrl+N` | Focus session notes |
| `Ctrl+Enter` | Send chat message |
| `Ctrl+1/2/3` | Switch phase: combat/exploration/roleplay |
| `Escape` | Close any open drawer/modal |
| `Ctrl+D` | Quick dice roll (focuses inline roller) |

---

## Implementation Order (Suggested Phases)

### Phase 1 — Core Layout + Party Vitals
1. `DMSessionDashboard.jsx` — grid layout, route, navigation
2. `SessionContext.jsx` + `useSessionTimer.js` + `useSessionState.js`
3. `SessionTopBar.jsx` — timer, phase indicator, End Session
4. `PartyVitalsPanel.jsx` — player cards from existing `party.members`
5. Wire into `App.jsx` route and sidebar "Go Live" button

### Phase 2 — Combat Mode
6. `CombatTracker.jsx` — initiative strip, turn management
7. Enemy HP tracker grid
8. `PlayerDetailDrawer.jsx` — expandable player stats
9. Round counter sync with top bar

### Phase 3 — Quick Reference + Notes
10. `QuickReferencePanel.jsx` — DC table (reuse DMQuickReference)
11. `SessionNotesWidget.jsx` — localStorage-persisted scratchpad
12. `PlotChecklistWidget.jsx` — persistent checklist

### Phase 4 — Communication
13. `SessionBottomBar.jsx` — layout
14. `DMWhisperChat.jsx` — chat + whisper with new WS message types
15. `InlineDiceRoller.jsx` — compact roller with broadcast toggle
16. Backend: add `dm_whisper` targeted routing in `party.rs`

### Phase 5 — Exploration & Roleplay Modes
17. `ExplorationView.jsx` — location, hazards, map notes
18. `RoleplayView.jsx` — active NPC card with motivations
19. Phase switching with DM quick actions + WS broadcast

### Phase 6 — Polish
20. Keyboard shortcuts
21. Responsive tweaks (min-width handling)
22. Animations (framer-motion transitions between phases)
23. AFK detection refinement
24. Music/ambiance placeholder

---

## Player-Side Impact

When the DM is in Live Session mode, connected players will receive new message types. The player client should:

1. **`dm_phase_change`**: Show a toast notification ("The DM has started combat!" / "Exploration time" / "Roleplay scene"). Optionally auto-navigate to their Combat section.

2. **`dm_combat_state`**: Show a minimal "Initiative Order" widget at the top of their view with the current turn highlighted and their position in order.

3. **`dm_rest_call`**: Show a prominent notification prompting them to use their short/long rest button.

4. **`dm_award_xp`**: Show a toast with XP amount. (Auto-apply is a stretch goal.)

5. **`dm_chat`**: Show in a chat widget (new small component in the player sidebar or a floating button).

6. **`dm_whisper`**: Show as a private notification only to the targeted player.

7. **`dm_hp_adjust`**: Auto-update the player's current HP in their local state + backend. Show a toast ("The DM adjusted your HP by -5").

8. **`dm_condition_toggle`**: Auto-update the player's conditions. Show a toast ("The DM applied Blinded to you").

These player-side changes are lightweight — mostly toast notifications and small UI additions that can be layered in incrementally.

---

## Styling Notes

- Follow existing design system: `var(--bg)`, `var(--accent)`, `var(--font-display)`, `var(--font-ui)`, glassmorphism panels
- Panel backgrounds: `rgba(11,9,20,0.8)` with `backdrop-filter: blur(var(--panel-blur))`
- Borders: `1px solid rgba(255,255,255,0.06)`
- HP bar colors: reuse `hpColor()` and `hpBarColor()` from `Party.jsx`
- Condition pills: match `CONDITION_ICONS` from `Combat.jsx`
- All text sizes respect `var(--font-scale)`
- Dark theme only (consistent with app)
