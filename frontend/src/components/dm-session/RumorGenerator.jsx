import { useState, useCallback } from 'react';
import { MessageCircle, Copy, RefreshCw, Pin, PinOff } from 'lucide-react';

/* ─── template data ─────────────────────────────────────────────── */

const TEMPLATES = [
  'The {npc} in {location} has been {activity}.',
  "There's a {creature} lurking in the {place}.",
  'A {faction} has put a bounty on {target}.',
  'They say {npc} was seen near {location} {activity}.',
  'The {faction} and the {faction2} are on the verge of war.',
  'A strange light has been seen above {location} every midnight.',
  'The {npc} claims to have found a map leading to {location}.',
  '{npc} has been paying gold to anyone willing to enter {location}.',
  'The {faction} is secretly recruiting in {location}.',
  'Someone broke into the {faction} headquarters last night.',
  'A {creature} attacked a caravan heading toward {location}.',
  'The water in {location} has turned a strange color.',
  "People who visit {location} say they hear {npc}'s voice echoing inside.",
  'A {faction} courier was found dead near {location} carrying a sealed letter.',
  'The {npc} has been buying up every {item} in town.',
  '{npc} offered a fortune to anyone who can retrieve a {item} from {location}.',
  'A portal briefly opened in {location} — witnesses saw {creature} on the other side.',
  'The {faction} is hoarding supplies as if expecting a siege.',
  'Children in the {place} have been singing a nursery rhyme about {npc} that no one taught them.',
  'Livestock near {location} keep dying with no visible wounds.',
  "The {npc} hasn't been seen for three days. Their shop is locked tight.",
  'A {creature} was spotted wearing armor bearing the crest of {faction}.',
  'The {faction} offered pardons to anyone who brings them a {item}.',
  'A {npc} has been spreading leaflets predicting doom from {location}.',
  'Graves in {location} have been found empty — the bodies gone without a trace.',
  'Two members of the {faction} were arrested for smuggling a {item} through {location}.',
  'A traveling merchant sells trinkets that glow when brought near {location}.',
  '{npc} swears they saw a {creature} speaking Common in the {place}.',
  'The old well in {location} started producing salt water overnight.',
  'A masked figure has been leaving {item} on doorsteps in the {place}.',
  'There are tunnels beneath {location} that even the {faction} avoids.',
  '{npc} is looking for adventurers willing to escort a sealed chest — no questions asked.',
  'The {faction} has placed {location} under quarantine with no explanation.',
];

const NPCS = [
  'a merchant', 'an old hermit', 'the mayor', 'a traveling bard',
  'a mysterious stranger', 'a temple priest', 'a retired soldier',
  'a noblewoman', 'a thieves\' guild leader', 'a fortune teller',
  'a blacksmith', 'a dwarven prospector', 'an elven scholar',
  'a beggar known as "Three-Fingers"', 'the harbormaster',
];

const LOCATIONS = [
  'the old mines', 'the haunted forest', 'the sunken temple',
  'the abandoned keep', 'the thieves\' quarter', 'the noble district',
  'the underground tunnels', 'the cursed swamp', 'the mountain pass',
  'the harbor', 'the ruins beyond the ridge', 'the old cemetery',
  'the merchant district', 'the cathedral catacombs', 'the docks',
];

const PLACES = [
  'sewers', 'northern woods', 'market square', 'old quarter',
  'docks', 'temple grounds', 'graveyard', 'castle ruins',
  'river caves', 'abandoned mill',
];

const FACTIONS = [
  'the Thieves\' Guild', 'the City Watch', 'the Merchant\'s League',
  'the Arcane Order', 'the Temple of Light', 'a noble house',
  'the Ranger\'s Guild', 'a cult', 'a mercenary company', 'the Crown',
  'the Silver Circle', 'the Black Hand',
];

const ACTIVITIES = [
  'hoarding weapons', 'seen with a strange artifact',
  'making deals with dark forces', 'secretly plotting',
  'hiding treasure', 'collecting rare herbs', 'vanishing at night',
  'whispering to shadows', 'stockpiling alchemical reagents',
  'meeting cloaked figures after midnight',
];

const CREATURES = [
  'a basilisk', 'a wyvern', 'an owlbear', 'a troll',
  'a phase spider', 'a wraith', 'a displacer beast',
  'a manticore', 'a dire wolf pack', 'an undead knight',
];

const ITEMS = [
  'healing potion', 'black gemstone', 'silver dagger',
  'sealed scroll', 'strange idol', 'enchanted lantern',
  'vial of blood', 'unmarked map', 'iron lockbox', 'rune-etched bone',
];

const TARGETS = [
  'a rogue mage', 'an escaped prisoner', 'a deserter from the army',
  'a disgraced noble', 'an infamous smuggler', 'a heretic priest',
  'anyone carrying a certain sigil', 'a shapechanger in disguise',
];

const SOURCES = [
  'a tavern keeper', 'a street urchin', 'a drunken noble',
  'a traveling merchant', 'a nervous guardsman', 'a gossipy barmaid',
  'an old sailor', 'a temple acolyte', 'a retired adventurer',
  'a courier passing through', 'a suspicious peddler',
  'a chatty stablehand',
];

const TRUTH_LEVELS = [
  { label: 'True',         color: '#22c55e', weight: 10 },
  { label: 'Mostly True',  color: '#10b981', weight: 15 },
  { label: 'Half-Truth',   color: '#f59e0b', weight: 40 },
  { label: 'Mostly False', color: '#f97316', weight: 20 },
  { label: 'False',        color: '#ef4444', weight: 15 },
];

const CATEGORIES = ['Quest Hook', 'World Flavor', 'Misdirection', 'Warning', 'Gossip'];

const QUEST_HOOKS = {
  'Quest Hook': [
    'Investigate the source — someone is lying or something dangerous is happening.',
    'The party could be hired to verify the claim and deal with any threat.',
    'Following this lead could uncover a larger conspiracy.',
    'A patron might pay well for proof one way or the other.',
  ],
  'World Flavor': [
    'Use this to color NPC conversations and make the world feel lived-in.',
    'Drop this detail during a tavern scene for atmosphere.',
    'This builds tension without requiring immediate action.',
  ],
  'Misdirection': [
    'Plant this to distract the party from the real threat.',
    'A rival faction could be spreading this to sow confusion.',
    'The party may waste time chasing this — or uncover something unexpected.',
  ],
  'Warning': [
    'An NPC delivers this as a dire warning — up to the party whether to heed it.',
    'This could foreshadow a future encounter or boss fight.',
    'Ignoring this may have consequences later in the campaign.',
  ],
  'Gossip': [
    'Idle chatter that may or may not be useful — let the players decide.',
    'This can flesh out an NPC\'s personality or social standing.',
    'Players who follow up might find a grain of truth — or a dead end.',
  ],
};

/* ─── helpers ───────────────────────────────────────────────────── */

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeighted(items) {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

function fillTemplate(tpl) {
  // pick two different factions for {faction} / {faction2}
  let f1 = pick(FACTIONS);
  let f2 = pick(FACTIONS);
  while (f2 === f1) f2 = pick(FACTIONS);

  return tpl
    .replace('{npc}', pick(NPCS))
    .replace('{location}', pick(LOCATIONS))
    .replace('{place}', pick(PLACES))
    .replace('{activity}', pick(ACTIVITIES))
    .replace('{creature}', pick(CREATURES))
    .replace('{faction2}', f2)
    .replace('{faction}', f1)
    .replace('{target}', pick(TARGETS))
    .replace('{item}', pick(ITEMS));
}

function generateRumor() {
  const template = pick(TEMPLATES);
  const text = fillTemplate(template);
  const truth = pickWeighted(TRUTH_LEVELS);
  const category = pick(CATEGORIES);
  const hooks = QUEST_HOOKS[category] || QUEST_HOOKS['Quest Hook'];
  return {
    id: crypto.randomUUID(),
    text,
    truth,
    category,
    source: pick(SOURCES),
    questHook: pick(hooks),
    pinned: false,
  };
}

/* ─── styles ────────────────────────────────────────────────────── */

const PURPLE = '#a78bfa';

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '10px',
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const badgeBase = {
  fontSize: '9px',
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: '4px',
  fontFamily: 'var(--font-ui)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  whiteSpace: 'nowrap',
};

const btnBase = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '6px 12px',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)',
  fontSize: '12px',
  fontFamily: 'var(--font-ui)',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.15s, border-color 0.15s',
};

const labelStyle = {
  fontSize: '10px',
  color: 'var(--text-mute)',
  fontFamily: 'var(--font-ui)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontWeight: 600,
};

/* ─── component ─────────────────────────────────────────────────── */

export default function RumorGenerator() {
  const [count, setCount] = useState(3);
  const [rumors, setRumors] = useState([]);

  const generate = useCallback(() => {
    setRumors(Array.from({ length: count }, generateRumor));
  }, [count]);

  const regenerate = useCallback(() => {
    generate();
  }, [generate]);

  const togglePin = useCallback((id) => {
    setRumors((prev) =>
      prev.map((r) => (r.id === id ? { ...r, pinned: !r.pinned } : r)),
    );
  }, []);

  const copyAll = useCallback(() => {
    if (!rumors.length) return;
    const text = rumors
      .map(
        (r, i) =>
          `Rumor ${i + 1} [${r.truth.label}] (${r.category})\n` +
          `"${r.text}"\n` +
          `Source: ${r.source}\n` +
          `Hook: ${r.questHook}`,
      )
      .join('\n\n');
    navigator.clipboard.writeText(text).catch(() => {});
  }, [rumors]);

  const CATEGORY_COLORS = {
    'Quest Hook': '#c9a84c',
    'World Flavor': '#60a5fa',
    Misdirection: '#f472b6',
    Warning: '#f97316',
    Gossip: '#a78bfa',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ── controls ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={labelStyle}>Rumors</span>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text)',
              fontSize: '13px',
              fontFamily: 'var(--font-ui)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={generate}
          style={{
            ...btnBase,
            background: `${PURPLE}18`,
            borderColor: `${PURPLE}44`,
            color: PURPLE,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = `${PURPLE}30`)}
          onMouseLeave={(e) => (e.currentTarget.style.background = `${PURPLE}18`)}
        >
          <MessageCircle size={13} />
          Generate Rumors
        </button>

        {rumors.length > 0 && (
          <>
            <button
              onClick={regenerate}
              style={btnBase}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')
              }
            >
              <RefreshCw size={12} />
              Regenerate
            </button>

            <button
              onClick={copyAll}
              style={btnBase}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')
              }
            >
              <Copy size={12} />
              Copy All
            </button>
          </>
        )}
      </div>

      {/* ── rumor cards ── */}
      {rumors.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '32px 16px',
            color: 'var(--text-mute)',
            fontSize: '13px',
            fontFamily: 'var(--font-ui)',
            opacity: 0.6,
          }}
        >
          Select a count and hit Generate to create rumors.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {rumors.map((rumor) => {
          const catColor = CATEGORY_COLORS[rumor.category] || '#888';
          return (
            <div
              key={rumor.id}
              style={{
                ...cardStyle,
                borderColor: rumor.pinned
                  ? `${PURPLE}44`
                  : 'rgba(255,255,255,0.06)',
              }}
            >
              {/* badges + pin row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexWrap: 'wrap',
                }}
              >
                {/* truth badge */}
                <span
                  style={{
                    ...badgeBase,
                    background: `${rumor.truth.color}18`,
                    color: rumor.truth.color,
                    border: `1px solid ${rumor.truth.color}44`,
                  }}
                >
                  {rumor.truth.label}
                </span>

                {/* category badge */}
                <span
                  style={{
                    ...badgeBase,
                    background: `${catColor}18`,
                    color: catColor,
                    border: `1px solid ${catColor}44`,
                  }}
                >
                  {rumor.category}
                </span>

                <div style={{ flex: 1 }} />

                {/* pin button */}
                <button
                  onClick={() => togglePin(rumor.id)}
                  title={rumor.pinned ? 'Unpin' : 'Pin'}
                  style={{
                    background: rumor.pinned
                      ? `${PURPLE}22`
                      : 'transparent',
                    border: 'none',
                    color: rumor.pinned ? PURPLE : 'var(--text-mute)',
                    cursor: 'pointer',
                    padding: '3px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.15s',
                  }}
                >
                  {rumor.pinned ? <Pin size={14} /> : <PinOff size={14} />}
                </button>
              </div>

              {/* rumor text */}
              <p
                style={{
                  margin: 0,
                  fontSize: '13.5px',
                  lineHeight: 1.55,
                  color: 'var(--text)',
                  fontFamily: 'var(--font-ui)',
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{rumor.text}&rdquo;
              </p>

              {/* source */}
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-mute)',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                <span style={{ opacity: 0.6 }}>Heard from</span>{' '}
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                  {rumor.source}
                </span>
              </div>

              {/* quest hook suggestion */}
              <div
                style={{
                  fontSize: '11.5px',
                  color: 'var(--text-mute)',
                  fontFamily: 'var(--font-ui)',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: PURPLE,
                    marginRight: '6px',
                  }}
                >
                  Hook
                </span>
                {rumor.questHook}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
