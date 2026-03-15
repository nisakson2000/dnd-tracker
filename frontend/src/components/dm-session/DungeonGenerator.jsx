import { useState, useCallback } from 'react';
import {
  DoorOpen, Skull, Gem, AlertTriangle, Copy, RefreshCw, Minus, Plus,
} from 'lucide-react';
import { pick, randBetween } from '../../utils/dndHelpers';

/* ─── template data ─────────────────────────────────────────────── */

const ROOM_TYPES = [
  { key: 'entrance',      label: 'Entrance',       icon: '🚪', weight: 1 },
  { key: 'corridor',      label: 'Corridor',       icon: '🔲', weight: 3 },
  { key: 'chamber',       label: 'Chamber',        icon: '🏛️', weight: 3 },
  { key: 'great_hall',    label: 'Great Hall',     icon: '👑', weight: 1 },
  { key: 'natural_cave',  label: 'Natural Cave',   icon: '🪨', weight: 2 },
  { key: 'shrine',        label: 'Shrine',         icon: '⛩️', weight: 1 },
  { key: 'library',       label: 'Library',        icon: '📚', weight: 1 },
  { key: 'armory',        label: 'Armory',         icon: '⚔️', weight: 1 },
  { key: 'prison',        label: 'Prison',         icon: '⛓️', weight: 1 },
  { key: 'throne_room',   label: 'Throne Room',    icon: '🪑', weight: 0.5 },
  { key: 'treasury',      label: 'Treasury',       icon: '💰', weight: 0.5 },
  { key: 'crypt',         label: 'Crypt',          icon: '💀', weight: 1.5 },
  { key: 'laboratory',    label: 'Laboratory',     icon: '⚗️', weight: 1 },
  { key: 'barracks',      label: 'Barracks',       icon: '🛡️', weight: 1.5 },
  { key: 'storage',       label: 'Storage',        icon: '📦', weight: 2 },
];

const ROOM_FEATURES = [
  'Fountain',  'Statue',  'Altar',  'Collapsed ceiling',  'Magic circle',
  'Pit',  'Pool',  'Fireplace',  'Throne',  'Bookshelf',
  'Cage',  'Well',  'Mosaic floor',
];

const TRAP_TYPES = [
  { name: 'Pit Trap',             severity: 1 },
  { name: 'Arrow Trap',           severity: 1 },
  { name: 'Poison Dart',          severity: 2 },
  { name: 'Swinging Blade',       severity: 2 },
  { name: 'Crushing Walls',       severity: 3 },
  { name: 'Fire Geyser',          severity: 3 },
  { name: 'Sleep Gas',            severity: 1 },
  { name: 'Alarm Glyph',          severity: 1 },
  { name: 'Teleportation Circle', severity: 2 },
  { name: 'Rolling Boulder',      severity: 3 },
];

const TREASURE_TYPES = [
  { name: 'Gold coins',    rarity: 1 },
  { name: 'Gems',          rarity: 1 },
  { name: 'Art objects',   rarity: 1 },
  { name: 'Magic weapon',  rarity: 3 },
  { name: 'Magic armor',   rarity: 3 },
  { name: 'Potion',        rarity: 2 },
  { name: 'Scroll',        rarity: 2 },
  { name: 'Ring',          rarity: 3 },
  { name: 'Wand',          rarity: 3 },
  { name: 'Amulet',        rarity: 3 },
];

const DIFFICULTIES = [
  { key: 'easy',   label: 'Easy',   trapChance: 0.15, treasureChance: 0.6, maxTrapSeverity: 1, crHint: 'CR 0–2' },
  { key: 'medium', label: 'Medium', trapChance: 0.3,  treasureChance: 0.5, maxTrapSeverity: 2, crHint: 'CR 3–6' },
  { key: 'hard',   label: 'Hard',   trapChance: 0.45, treasureChance: 0.4, maxTrapSeverity: 3, crHint: 'CR 7–12' },
  { key: 'deadly', label: 'Deadly', trapChance: 0.6,  treasureChance: 0.3, maxTrapSeverity: 3, crHint: 'CR 13+' },
];

const SIZES = ['Small', 'Medium', 'Large'];

const ROOM_DESCRIPTIONS = {
  entrance:     ['A heavy stone door leads into darkness.', 'Torchlight flickers from iron sconces.', 'The air shifts from fresh to damp as you cross the threshold.'],
  corridor:     ['A narrow passage stretches ahead, walls slick with moisture.', 'Footsteps echo endlessly down the stone hallway.', 'The corridor bends sharply, concealing what lies ahead.'],
  chamber:      ['A square room with vaulted ceilings.', 'Dust motes drift through faint light from above.', 'Rubble lines the edges of this abandoned chamber.'],
  great_hall:   ['A vast hall with towering pillars.', 'Banners hang in tatters from the ceiling.', 'The floor is an elaborate tile pattern, cracked with age.'],
  natural_cave: ['Stalactites drip water into shallow pools.', 'The cave walls glimmer with mineral deposits.', 'A cool breeze suggests another opening deeper within.'],
  shrine:       ['Candles burn around a stone altar, though no one tends them.', 'Religious iconography adorns every surface.', 'The air is thick with old incense.'],
  library:      ['Shelves of crumbling books line the walls.', 'A reading desk holds an open tome, its pages still turning.', 'Scroll cases are stacked floor to ceiling.'],
  armory:       ['Weapon racks line the walls, some still holding blades.', 'Armor stands display dented plate mail.', 'The scent of oil and rust fills the room.'],
  prison:       ['Iron cells line both walls, their doors rusted open.', 'Chains hang from the ceiling, some still bearing weight.', 'Scratched tally marks cover the cell walls.'],
  throne_room:  ['A grand seat sits atop a raised dais.', 'Threadbare carpet leads to an ornate throne.', 'The ceiling is painted with faded scenes of conquest.'],
  treasury:     ['Shelves and lockboxes fill this reinforced room.', 'A heavy iron door protects what remains inside.', 'Glittering dust clings to empty display cases.'],
  crypt:        ['Stone sarcophagi line the walls in recessed alcoves.', 'The chill here cuts deeper than the rest of the dungeon.', 'Names are carved above each burial niche, worn smooth by time.'],
  laboratory:   ['Glass apparatus and strange reagents cover the tables.', 'Alchemical stains discolor the stone floor.', 'A bubbling cauldron sits in the center, still warm.'],
  barracks:     ['Rows of wooden bunks fill the room, bedding in disarray.', 'Gear is scattered as if the occupants left in haste.', 'A weapons rack near the door holds a few remaining spears.'],
  storage:      ['Crates and barrels are stacked haphazardly.', 'The smell of grain and damp wood fills the air.', 'A broken cart blocks part of the room.'],
};

/* ─── helpers ───────────────────────────────────────────────────── */

const rand = randBetween;
function chance(pct)    { return Math.random() < pct; }

function weightedPick(items) {
  const total = items.reduce((s, i) => s + (i.weight || 1), 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.weight || 1;
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickUnique(arr, count) {
  return shuffle(arr).slice(0, Math.min(count, arr.length));
}

/* ─── dungeon generation ────────────────────────────────────────── */

function generateDungeon(roomCount, difficultyKey) {
  const diff = DIFFICULTIES.find(d => d.key === difficultyKey) || DIFFICULTIES[1];

  // Build room list — first room is always entrance
  const rooms = [];
  for (let i = 0; i < roomCount; i++) {
    const typeData = i === 0
      ? ROOM_TYPES.find(t => t.key === 'entrance')
      : weightedPick(ROOM_TYPES.filter(t => t.key !== 'entrance'));

    const size = pick(SIZES);
    const featureCount = rand(0, 2);
    const features = pickUnique(ROOM_FEATURES, featureCount);

    // Trap
    let trap = null;
    if (i > 0 && chance(diff.trapChance)) {
      const eligible = TRAP_TYPES.filter(t => t.severity <= diff.maxTrapSeverity);
      trap = pick(eligible);
    }

    // Treasure — higher chance in special rooms
    const specialBonus = ['treasury', 'throne_room', 'library', 'laboratory'].includes(typeData.key) ? 0.25 : 0;
    let treasure = null;
    if (chance(diff.treasureChance + specialBonus)) {
      // Easy dungeons get more common loot
      const maxRarity = diff.key === 'easy' ? 1 : diff.key === 'medium' ? 2 : 3;
      const eligible = TREASURE_TYPES.filter(t => t.rarity <= maxRarity);
      treasure = pick(eligible);
    }

    const desc = pick(ROOM_DESCRIPTIONS[typeData.key] || ROOM_DESCRIPTIONS.chamber);

    rooms.push({
      id: i + 1,
      name: `Room ${i + 1}: ${typeData.label}`,
      type: typeData,
      size,
      features,
      trap,
      treasure,
      description: desc,
      connections: [],
    });
  }

  // Build connections — main path plus some branches
  // Main spine: 1 → 2 → 3 → ... → N
  for (let i = 0; i < rooms.length - 1; i++) {
    rooms[i].connections.push(rooms[i + 1].id);
    rooms[i + 1].connections.push(rooms[i].id);
  }

  // Add 1-3 random side branches to make it non-linear
  const branchCount = rand(1, Math.min(3, Math.floor(roomCount / 2)));
  for (let b = 0; b < branchCount; b++) {
    const a = rand(0, rooms.length - 1);
    let bIdx = rand(0, rooms.length - 1);
    // Avoid self-connection and already-connected pairs
    if (bIdx === a) bIdx = (bIdx + 1) % rooms.length;
    if (!rooms[a].connections.includes(rooms[bIdx].id) && a !== bIdx) {
      rooms[a].connections.push(rooms[bIdx].id);
      rooms[bIdx].connections.push(rooms[a].id);
    }
  }

  // Encounter hints
  const encounterHint = diff.crHint;

  return { rooms, difficulty: diff, encounterHint };
}

/* ─── format as text (for clipboard) ────────────────────────────── */

function dungeonToText(dungeon) {
  const lines = [];
  lines.push('═══════════════════════════════════════');
  lines.push('         DUNGEON LAYOUT');
  lines.push(`   Difficulty: ${dungeon.difficulty.label}  |  Encounter: ${dungeon.encounterHint}`);
  lines.push('═══════════════════════════════════════');
  lines.push('');

  for (const room of dungeon.rooms) {
    lines.push(`── ${room.name} ──`);
    lines.push(`   Size: ${room.size}  |  Type: ${room.type.label}`);
    lines.push(`   ${room.description}`);
    if (room.features.length)  lines.push(`   Features: ${room.features.join(', ')}`);
    if (room.trap)             lines.push(`   ⚠ Trap: ${room.trap.name} (severity ${room.trap.severity})`);
    if (room.treasure)         lines.push(`   ★ Treasure: ${room.treasure.name}`);
    lines.push(`   Connects to: ${room.connections.map(c => `Room ${c}`).join(', ')}`);
    lines.push('');
  }

  lines.push('── Connection Map ──');
  const seen = new Set();
  for (const room of dungeon.rooms) {
    for (const cid of room.connections) {
      const pair = [Math.min(room.id, cid), Math.max(room.id, cid)].join('-');
      if (!seen.has(pair)) {
        seen.add(pair);
        lines.push(`   Room ${room.id} → Room ${cid}`);
      }
    }
  }

  return lines.join('\n');
}

/* ─── styles ────────────────────────────────────────────────────── */

const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '10px',
  padding: '14px 16px',
  marginBottom: '10px',
};

const labelStyle = {
  fontSize: '10px', color: 'var(--text-mute)',
  fontFamily: 'var(--font-ui)', display: 'block',
  marginBottom: '3px', textTransform: 'uppercase',
  letterSpacing: '0.06em', fontWeight: 600,
};

const headingStyle = {
  fontFamily: 'var(--font-display)', color: 'var(--text)',
  margin: 0, fontSize: '15px', fontWeight: 700,
};

const bodyStyle = {
  fontFamily: 'var(--font-ui)', color: 'var(--text-dim)',
  fontSize: '13px', lineHeight: 1.55, margin: 0,
};

const mutedStyle = {
  ...bodyStyle, color: 'var(--text-mute)', fontSize: '11px',
};

const accentPurple = '#c084fc';

const btnBase = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  border: 'none', borderRadius: '8px', cursor: 'pointer',
  fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '13px',
  transition: 'background 0.15s, transform 0.1s',
};

const btnPrimary = {
  ...btnBase,
  background: `linear-gradient(135deg, ${accentPurple}, #9b59b6)`,
  color: '#fff', padding: '10px 20px',
};

const btnSecondary = {
  ...btnBase,
  background: 'rgba(255,255,255,0.06)',
  color: 'var(--text-dim)', padding: '8px 14px',
  border: '1px solid rgba(255,255,255,0.08)',
};

const btnSmall = {
  ...btnBase,
  background: 'rgba(255,255,255,0.05)',
  color: 'var(--text-dim)', padding: '4px 10px',
  fontSize: '12px', borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.08)',
};

const badge = (color) => ({
  display: 'inline-block', fontSize: '10px', fontWeight: 700,
  padding: '2px 8px', borderRadius: '4px',
  background: `${color}22`, color,
  fontFamily: 'var(--font-ui)', letterSpacing: '0.04em',
  textTransform: 'uppercase',
});

const severityColor = (s) => s <= 1 ? '#facc15' : s <= 2 ? '#fb923c' : '#ef4444';

/* ─── component ─────────────────────────────────────────────────── */

export default function DungeonGenerator() {
  const [roomCount, setRoomCount] = useState(6);
  const [difficulty, setDifficulty] = useState('medium');
  const [dungeon, setDungeon] = useState(null);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setDungeon(generateDungeon(roomCount, difficulty));
    setCopied(false);
  }, [roomCount, difficulty]);

  const copyToClipboard = useCallback(() => {
    if (!dungeon) return;
    navigator.clipboard.writeText(dungeonToText(dungeon)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [dungeon]);

  const adjustRooms = (delta) => {
    setRoomCount(c => Math.max(3, Math.min(12, c + delta)));
  };

  /* ── connection map edges ── */
  const connectionEdges = dungeon ? (() => {
    const seen = new Set();
    const edges = [];
    for (const room of dungeon.rooms) {
      for (const cid of room.connections) {
        const pair = [Math.min(room.id, cid), Math.max(room.id, cid)].join('-');
        if (!seen.has(pair)) {
          seen.add(pair);
          edges.push({ from: room.id, to: cid });
        }
      }
    }
    return edges;
  })() : [];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>

      {/* ── Config panel ── */}
      <div style={{ ...card, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '20px', padding: '18px 20px' }}>

        {/* Room count */}
        <div style={{ flex: '1 1 160px' }}>
          <label style={labelStyle}>Rooms</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 4 }}>
            <button style={btnSmall} onClick={() => adjustRooms(-1)} aria-label="Decrease rooms">
              <Minus size={14} />
            </button>
            <span style={{ ...headingStyle, fontSize: '22px', minWidth: '28px', textAlign: 'center' }}>
              {roomCount}
            </span>
            <button style={btnSmall} onClick={() => adjustRooms(1)} aria-label="Increase rooms">
              <Plus size={14} />
            </button>
            <span style={{ ...mutedStyle, marginLeft: 4 }}>({roomCount === 3 ? 'min' : roomCount === 12 ? 'max' : `${roomCount} rooms`})</span>
          </div>
        </div>

        {/* Difficulty */}
        <div style={{ flex: '1 1 160px' }}>
          <label style={labelStyle}>Difficulty</label>
          <div style={{ display: 'flex', gap: '6px', marginTop: 4 }}>
            {DIFFICULTIES.map(d => (
              <button
                key={d.key}
                onClick={() => setDifficulty(d.key)}
                style={{
                  ...btnSmall,
                  background: difficulty === d.key
                    ? `linear-gradient(135deg, ${accentPurple}33, rgba(155,89,182,0.25))`
                    : 'rgba(255,255,255,0.04)',
                  border: difficulty === d.key
                    ? `1px solid ${accentPurple}66`
                    : '1px solid rgba(255,255,255,0.06)',
                  color: difficulty === d.key ? accentPurple : 'var(--text-mute)',
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <div style={{ flex: '0 0 auto' }}>
          <button style={btnPrimary} onClick={generate}>
            <DoorOpen size={16} /> Generate Dungeon
          </button>
        </div>
      </div>

      {/* ── Results ── */}
      {dungeon && (
        <>
          {/* Top bar with actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ ...headingStyle, fontSize: '14px' }}>
                Generated Dungeon
              </h3>
              <span style={badge(accentPurple)}>{dungeon.difficulty.label}</span>
              <span style={{ ...mutedStyle, fontSize: '10px' }}>
                Encounters: {dungeon.encounterHint}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={btnSecondary} onClick={copyToClipboard}>
                <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
              </button>
              <button style={btnSecondary} onClick={generate}>
                <RefreshCw size={14} /> Regenerate
              </button>
            </div>
          </div>

          {/* ── Connection map ── */}
          <div style={{ ...card, padding: '12px 16px', marginBottom: 14 }}>
            <p style={{ ...labelStyle, marginBottom: 8 }}>Connection Map</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
              {dungeon.rooms.map((room, idx) => {
                const hasExtra = room.connections.some(c => Math.abs(c - room.id) > 1);
                return (
                  <span key={room.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      background: idx === 0 ? `${accentPurple}22` : 'rgba(255,255,255,0.05)',
                      border: hasExtra ? `1px solid ${accentPurple}44` : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '6px', padding: '3px 8px',
                      fontSize: '12px', fontFamily: 'var(--font-ui)',
                      color: idx === 0 ? accentPurple : 'var(--text-dim)',
                      fontWeight: 600,
                    }}>
                      <span>{room.type.icon}</span> {room.id}
                    </span>
                    {idx < dungeon.rooms.length - 1 && (
                      <span style={{ color: 'var(--text-mute)', fontSize: '11px' }}>→</span>
                    )}
                  </span>
                );
              })}
            </div>
            {/* Branches */}
            {connectionEdges.filter(e => Math.abs(e.from - e.to) > 1).length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ ...mutedStyle, fontSize: '10px', marginRight: 2 }}>Branches:</span>
                {connectionEdges.filter(e => Math.abs(e.from - e.to) > 1).map((e, i) => (
                  <span key={i} style={{
                    fontSize: '11px', color: accentPurple,
                    fontFamily: 'var(--font-ui)',
                  }}>
                    Room {e.from} ↔ Room {e.to}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Room cards ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {dungeon.rooms.map(room => (
              <div key={room.id} style={{
                ...card,
                borderLeft: room.trap
                  ? `3px solid ${severityColor(room.trap.severity)}`
                  : room.treasure
                    ? `3px solid #facc15`
                    : `3px solid rgba(255,255,255,0.04)`,
              }}>
                {/* Room header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{room.type.icon}</span>
                    <div>
                      <h4 style={{ ...headingStyle, fontSize: '14px' }}>{room.name}</h4>
                      <p style={{ ...mutedStyle, fontSize: '10px', marginTop: 1 }}>
                        {room.size} {room.type.label}
                      </p>
                    </div>
                  </div>
                  <span style={badge(
                    room.size === 'Large' ? '#60a5fa' : room.size === 'Medium' ? '#a3a3a3' : '#78716c'
                  )}>
                    {room.size}
                  </span>
                </div>

                {/* Description */}
                <p style={{ ...bodyStyle, marginBottom: 8, fontStyle: 'italic', opacity: 0.85 }}>
                  {room.description}
                </p>

                {/* Details row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-start' }}>

                  {/* Features */}
                  {room.features.length > 0 && (
                    <div style={{ flex: '1 1 140px' }}>
                      <p style={labelStyle}>Features</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {room.features.map((f, i) => (
                          <span key={i} style={{
                            ...mutedStyle, fontSize: '11px',
                            background: 'rgba(255,255,255,0.04)',
                            padding: '2px 7px', borderRadius: '4px',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trap */}
                  {room.trap && (
                    <div style={{ flex: '1 1 120px' }}>
                      <p style={labelStyle}>
                        <AlertTriangle size={10} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                        Trap
                      </p>
                      <span style={{
                        ...bodyStyle, fontSize: '12px',
                        color: severityColor(room.trap.severity),
                        fontWeight: 600,
                      }}>
                        {room.trap.name}
                        <span style={{ ...mutedStyle, marginLeft: 4 }}>
                          sev. {room.trap.severity}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* Treasure */}
                  {room.treasure && (
                    <div style={{ flex: '1 1 120px' }}>
                      <p style={labelStyle}>
                        <Gem size={10} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                        Treasure
                      </p>
                      <span style={{
                        ...bodyStyle, fontSize: '12px',
                        color: '#facc15', fontWeight: 600,
                      }}>
                        {room.treasure.name}
                      </span>
                    </div>
                  )}

                  {/* Connections */}
                  <div style={{ flex: '1 1 120px' }}>
                    <p style={labelStyle}>
                      <DoorOpen size={10} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                      Connects To
                    </p>
                    <span style={{ ...bodyStyle, fontSize: '12px' }}>
                      {room.connections.map(c => `Room ${c}`).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Encounter hint footer ── */}
          <div style={{ ...card, marginTop: 10, display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px' }}>
            <Skull size={16} style={{ color: accentPurple, flexShrink: 0 }} />
            <div>
              <p style={{ ...mutedStyle, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 2 }}>
                Encounter Guidance
              </p>
              <p style={{ ...bodyStyle, fontSize: '12px' }}>
                This dungeon is tuned for <strong style={{ color: accentPurple }}>{dungeon.difficulty.label}</strong> difficulty.
                Stock encounters at <strong style={{ color: 'var(--text)' }}>{dungeon.encounterHint}</strong> for
                appropriate challenge. Traps are{' '}
                {dungeon.difficulty.trapChance <= 0.2 ? 'sparse' : dungeon.difficulty.trapChance <= 0.35 ? 'moderate' : 'frequent'} and
                treasure is{' '}
                {dungeon.difficulty.treasureChance >= 0.5 ? 'plentiful' : dungeon.difficulty.treasureChance >= 0.35 ? 'moderate' : 'scarce'}.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!dungeon && (
        <div style={{
          textAlign: 'center', padding: '48px 20px',
          color: 'var(--text-mute)', fontFamily: 'var(--font-ui)',
        }}>
          <DoorOpen size={36} style={{ opacity: 0.25, marginBottom: 12 }} />
          <p style={{ fontSize: '13px', margin: 0 }}>
            Configure room count and difficulty, then generate a dungeon.
          </p>
        </div>
      )}
    </div>
  );
}
