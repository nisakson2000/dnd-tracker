import { useState, useCallback } from 'react';
import { User, MapPin, Zap, Copy, RefreshCw, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { pick } from '../../utils/dndHelpers';

/* ─────────────────────── DATA TABLES ─────────────────────── */

const FIRST_NAMES = [
  'Aldric','Brenna','Caspian','Dahlia','Edric','Fiona','Gareth','Helena',
  'Idris','Jorin','Kaelith','Lyra','Maelis','Nyx','Orin','Petra',
  'Quinlan','Roswen','Seren','Thalric','Ulric','Vesper','Wren','Xara',
  'Yorick','Zephyra','Arden','Blythe','Cedric','Dagny','Emeric','Freya',
  'Gideon','Hale','Isolde','Jasper','Kael','Linnea','Maren','Niall',
  'Odessa','Pike','Rael','Sable','Theron','Ursa','Vex','Wynne',
  'Ashwin','Bramble','Corvin','Dessa','Eira','Flint','Greyson','Hadria',
];

const LAST_NAMES = [
  'Ashford','Blackthorn','Copperfield','Dunmore','Elderwood','Fairwind',
  'Greymane','Holloway','Ironforge','Jasperstone','Kestrel','Larkspur',
  'Moonvale','Nethercroft','Oakenshield','Proudfoot','Quillthorn',
  'Ravenscroft','Stormwind','Thistledown','Underhill','Voss','Whitmore',
  'Yarrow','Zinderfel','Brightwater','Coldbrook','Duskwalker','Emberheart',
  'Frostborne','Galehaven','Hawkridge','Ivywood','Silvermark',
];

const RACES = [
  { name: 'Human', weight: 40 },
  { name: 'Elf', weight: 12 },
  { name: 'Dwarf', weight: 12 },
  { name: 'Halfling', weight: 10 },
  { name: 'Half-Elf', weight: 8 },
  { name: 'Gnome', weight: 6 },
  { name: 'Tiefling', weight: 5 },
  { name: 'Dragonborn', weight: 4 },
  { name: 'Half-Orc', weight: 3 },
];

const OCCUPATIONS = [
  'Blacksmith','Tavern Keeper','Farmer','Merchant','Guard','Scholar','Healer',
  'Thief','Noble','Priest','Herbalist','Cartographer','Bard','Ranger',
  'Bounty Hunter','Alchemist','Jeweler','Stable Hand','Miller','Baker',
  'Fisherman','Hunter','Tanner','Cobbler','Woodcutter','Miner','Sailor',
  'Scribe','Librarian','Apothecary','Undertaker','Brewer','Candlemaker',
  'Weaver','Mason','Courier','Tax Collector','Fortune Teller','Smuggler',
  'Fence','Spy','Retired Adventurer','Town Crier','Rat Catcher','Gravedigger',
];

const TRAITS = [
  'Nervous and fidgety','Jovial and loud','Secretive and evasive',
  'Boisterous and confident','Melancholy and wistful','Suspicious of strangers',
  'Kind to a fault','Greedy and opportunistic','Honorable and rigid',
  'Sarcastic and dry','Painfully shy','Aggressively friendly',
  'Philosophically detached','Relentlessly optimistic','Paranoid',
  'Fiercely loyal','Cunning and manipulative','Gentle and soft-spoken',
  'Recklessly brave','Perpetually worried','Disturbingly calm',
  'Quick to anger','Annoyingly cheerful','Deeply superstitious',
];

const QUIRKS = [
  'Always taps fingers on surfaces','Speaks in rhymes when stressed',
  'Never makes eye contact','Collects strange trinkets','Hums constantly',
  'Ends sentences with a question','Talks to an invisible companion',
  'Always eating or chewing something','Laughs at inappropriate moments',
  'Gives everyone a nickname','Whistles before speaking','Counts things compulsively',
  'Quotes old proverbs nobody has heard of','Has a tic when lying',
  'Refuses to sit down','Always smells like cinnamon','Talks with hands excessively',
  'Stares at one person for too long','Carries a lucky rock',
  'Apologizes constantly','Speaks only in whispers after dark',
  'Challenges strangers to games of chance','Scratches a scar when thinking',
  'Insists on shaking hands with everyone','Refers to self in third person',
];

const SECRETS = [
  'Owes a dangerous amount of money to the wrong people',
  'Is actually a spy for a rival faction',
  'Has a hidden family nobody knows about',
  'Knows forbidden magic and fears discovery',
  'Witnessed a murder and has told no one',
  'Is secretly of noble blood in hiding',
  'Stole their identity from a dead person',
  'Made a pact with a fiend years ago',
  'Knows the location of a hidden treasure',
  'Is slowly being corrupted by a cursed item',
  'Poisoned someone and got away with it',
  'Is a werewolf trying to keep it contained',
  'Has been dead before and was brought back',
  'Is planning to betray their employer',
  'Carries a sealed letter they were told never to open',
  'Has a bounty on their head in another kingdom',
  'Secretly worships a forbidden deity',
  'Knows a secret passage out of the city',
  'Is the sole survivor of a destroyed village',
  'Has a twin they pretend does not exist',
];

const APPEARANCES = [
  'Tall and gaunt with hollow cheeks',
  'Stocky, barrel-chested with powerful arms',
  'Slender with sharp features and quick eyes',
  'Weathered face with deep laugh lines',
  'Scarred across the left cheek, wiry build',
  'Round-faced with a warm, infectious smile',
  'Angular features, unnervingly pale',
  'Sun-darkened skin, calloused hands',
  'Towering figure with a shaved head',
  'Slight build, moves with feline grace',
  'Missing two fingers on the left hand',
  'Wild unkempt hair, paint-stained clothes',
  'Immaculate appearance, not a hair out of place',
  'Hunched posture, darting nervous eyes',
  'Broad-shouldered with a booming presence',
];

const CLOTHING = [
  'worn traveling leathers',
  'a fine embroidered doublet',
  'a patched wool cloak over simple clothes',
  'mud-splattered work clothes',
  'layered robes with arcane symbols',
  'polished half-plate with a unit insignia',
  'a hooded cloak that conceals most features',
  'colorful mismatched fabrics',
  'a bloodstained apron',
  'dark formal attire with silver buttons',
  'furs and bone jewelry',
  'a merchant\'s vest with many pockets',
  'priestly vestments',
  'a sea-worn captain\'s coat',
  'nondescript peasant garb',
];

const MOTIVATIONS = [
  'Seeking revenge for a past wrong',
  'Trying to pay off a massive debt',
  'Searching for a missing loved one',
  'Protecting a dangerous secret',
  'Gathering information for a patron',
  'Running from their past',
  'Attempting to prove their innocence',
  'Building a new life after exile',
  'Pursuing forbidden knowledge',
  'Trying to broker peace between factions',
  'Hoarding wealth for retirement',
  'Testing adventurers for a powerful sponsor',
  'Hiding their true noble identity',
  'Atoning for a terrible mistake',
  'Waiting for a signal to act',
];

const VOICE_HINTS = [
  'Gruff and raspy','High-pitched and fast','Whispered and cautious',
  'Thick rural accent','Booming and theatrical','Nasally and whiny',
  'Smooth and measured','Stuttering and uncertain','Monotone and flat',
  'Sing-song and lilting','Gravelly and slow','Sharp and clipped',
  'Breathy and dramatic','Mumbling and quiet','Loud and commanding',
  'Squeaky and excited','Deep and resonant','Drawling and lazy',
  'Posh and articulate','Hoarse from yelling',
];

/* ── Location tables ── */

const LOCATION_TYPES = [
  'Tavern','Shop','Temple','Ruins','Camp','Crossroads','Tower','Grove',
  'Market Square','Warehouse','Sewer Entrance','Bridge','Cave','Manor',
  'Graveyard','Docks','Library','Arena','Bathhouse','Shrine',
];

const LOCATION_PREFIXES = [
  'The Gilded','The Rusty','The Silent','The Crimson','The Broken',
  'The Laughing','The Silver','The Hollow','The Iron','The Crooked',
  'The Whispering','The Burning','The Frozen','The Hidden','The Golden',
  'The Black','The Emerald','The Last','The Old','The Wandering',
];

const LOCATION_SUFFIXES = [
  'Serpent','Dragon','Crow','Stag','Wolf','Fox','Lantern','Anchor',
  'Chalice','Compass','Barrel','Thorn','Gate','Helm','Shield',
  'Arrow','Tankard','Raven','Hound','Oak',
];

const LOCATION_FEATURES = [
  'A massive fireplace that never goes out',
  'Walls covered in old wanted posters',
  'A suspiciously deep well in the center',
  'Strange runes carved into the doorframe',
  'A mounted beast head that seems to watch you',
  'An enormous iron chandelier with dozens of candles',
  'A floor mosaic depicting an unknown battle',
  'Vines growing through the walls from inside',
  'A faint hum that comes from below the floor',
  'Shelves of unlabeled jars with strange contents',
  'A chained book on the counter that radiates cold',
  'Windows that show a different landscape than outside',
  'A clock that runs backward',
  'Scorch marks across the ceiling in a pattern',
  'A beautiful mural half-destroyed by water damage',
];

const ATMOSPHERES = [
  'Busy and loud — voices overlap, hard to hear',
  'Deserted and too quiet — something feels wrong',
  'Tense — people speak in low voices, watching the door',
  'Festive — music, laughter, someone just got married',
  'Eerie — shadows move on their own, candles flicker',
  'Cozy and warm — smells of bread, fire crackles',
  'Chaotic — an argument just broke out',
  'Somber — someone important just died',
  'Suspicious — newcomers are not welcome here',
  'Lazy afternoon — half the patrons are dozing',
  'Anticipatory — everyone is waiting for something',
  'Oppressive — guards everywhere, nobody smiles',
];

const HIDDEN_DETAILS = [
  'A trapdoor behind the bar leads somewhere deep',
  'The barkeep signals someone every time a stranger enters',
  'One of the paintings hides a peephole',
  'The building is slowly sinking into the ground',
  'Scratch marks on the walls suggest something was imprisoned here',
  'A false wall conceals a smuggling tunnel',
  'The water supply has been tainted with a mild sedative',
  'The floorboards in the back room are bloodstained',
  'There is a coded message carved under one of the tables',
  'The owner has been dead for weeks — someone else is running things',
  'A ghost appears at the same table every midnight',
  'The cellar connects to an abandoned mine network',
];

/* ── Event tables ── */

const EVENT_CATEGORIES = ['Combat', 'Social', 'Exploration', 'Mystery'];
const EVENT_URGENCIES = ['Immediate', 'Soon', 'Background'];

const EVENTS = [
  {
    desc: 'A building nearby collapses — screams from inside',
    cat: 'Combat', urgency: 'Immediate',
    complication: 'The rubble is unstable and may trap rescuers',
    outcomes: ['Save survivors and earn gratitude','Discover the collapse was sabotage','Find a hidden chamber beneath the rubble'],
  },
  {
    desc: 'A merchant accuses a child of stealing — a crowd gathers',
    cat: 'Social', urgency: 'Immediate',
    complication: 'The merchant is actually hiding stolen goods himself',
    outcomes: ['Mediate peacefully','The child escapes and becomes a recurring contact','The crowd turns into a mob'],
  },
  {
    desc: 'A wanted poster with one of the party members\' descriptions appears',
    cat: 'Mystery', urgency: 'Soon',
    complication: 'The poster was placed by someone who knows the party',
    outcomes: ['Track down who posted it','Confront the local authorities','Discover a case of mistaken identity'],
  },
  {
    desc: 'Thick fog rolls in unnaturally fast — visibility drops to five feet',
    cat: 'Exploration', urgency: 'Immediate',
    complication: 'Creatures move within the fog, herding the party somewhere',
    outcomes: ['Navigate through and find the source','Get separated and regroup','Discover the fog hides a fey crossing'],
  },
  {
    desc: 'A courier staggers into view, wounded, clutching a sealed letter',
    cat: 'Mystery', urgency: 'Immediate',
    complication: 'The letter is written in a cipher and the courier dies before explaining',
    outcomes: ['Decode the letter and uncover a conspiracy','Deliver the letter to the intended recipient','The sender comes looking for it'],
  },
  {
    desc: 'Two rival factions confront each other in the street, weapons drawn',
    cat: 'Social', urgency: 'Immediate',
    complication: 'Both sides try to recruit the party',
    outcomes: ['Defuse the standoff','Pick a side and make enemies','Let them fight and deal with the aftermath'],
  },
  {
    desc: 'Strange lights are seen coming from an abandoned tower at night',
    cat: 'Exploration', urgency: 'Soon',
    complication: 'The tower is warded with magical traps',
    outcomes: ['Investigate and find a wizard in hiding','Discover a portal opening','The lights stop and nothing seems amiss — for now'],
  },
  {
    desc: 'A local festival is underway — games, prizes, and suspicious NPCs',
    cat: 'Social', urgency: 'Background',
    complication: 'A pickpocket ring is working the crowd',
    outcomes: ['Win prizes and make allies','Catch the pickpockets for a reward','A contest goes wrong and someone gets hurt'],
  },
  {
    desc: 'Earthquake tremors shake the area — something stirs underground',
    cat: 'Combat', urgency: 'Soon',
    complication: 'The tremors are getting stronger and more frequent',
    outcomes: ['Find and seal the source','A creature emerges that must be fought','The tremors reveal a buried structure'],
  },
  {
    desc: 'Animals in the area are behaving strangely — birds fly in circles, dogs howl',
    cat: 'Mystery', urgency: 'Background',
    complication: 'The effect is spreading and will reach town by nightfall',
    outcomes: ['Trace it to a corrupted ley line','A druid asks for help dealing with the cause','The aberrant behavior is a warning of something worse'],
  },
  {
    desc: 'A caravan has been attacked on the road — survivors need help',
    cat: 'Combat', urgency: 'Immediate',
    complication: 'The attackers are still nearby and may return',
    outcomes: ['Rescue survivors and earn a reward','Track the attackers to their hideout','Discover the cargo was dangerous contraband'],
  },
  {
    desc: 'A sudden downpour floods the lower streets — people are trapped',
    cat: 'Exploration', urgency: 'Immediate',
    complication: 'The flooding is washing away evidence of a crime',
    outcomes: ['Rescue the trapped civilians','Recover the evidence before it is lost','Discover the flood was magically caused'],
  },
  {
    desc: 'A traveling bard tells a tale that seems to describe the party\'s recent actions',
    cat: 'Social', urgency: 'Background',
    complication: 'The bard knows more than they should',
    outcomes: ['Confront the bard and learn their source','Ignore it and later find the tale spreading','The bard offers to join or trade information'],
  },
  {
    desc: 'Graffiti appears overnight — a symbol nobody recognizes',
    cat: 'Mystery', urgency: 'Background',
    complication: 'The same symbol appears in multiple locations simultaneously',
    outcomes: ['Research the symbol and uncover a cult','A scholar recognizes it as an ancient warning','Whoever painted it is watching to see who investigates'],
  },
  {
    desc: 'A duel is about to take place in the town square — one duelist looks terrified',
    cat: 'Social', urgency: 'Immediate',
    complication: 'The terrified duelist was forced into it by a debt',
    outcomes: ['Intervene and take their place','Help them win through clever means','The duel reveals a deeper conflict'],
  },
  {
    desc: 'Smoke rises from the forest — not a campfire, something larger',
    cat: 'Exploration', urgency: 'Soon',
    complication: 'The fire is spreading toward a settlement',
    outcomes: ['Put out the fire and find its source','Evacuate the settlement','Discover the fire was set to flush something out'],
  },
];

/* ─────────────────────── HELPERS ─────────────────────── */

function pickWeighted(items) {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item.name;
  }
  return items[items.length - 1].name;
}

function generateNPC() {
  return {
    name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    race: pickWeighted(RACES),
    occupation: pick(OCCUPATIONS),
    appearance: pick(APPEARANCES),
    clothing: pick(CLOTHING),
    trait: pick(TRAITS),
    quirk: pick(QUIRKS),
    motivation: pick(MOTIVATIONS),
    secret: pick(SECRETS),
    voice: pick(VOICE_HINTS),
  };
}

function generateLocation() {
  const type = pick(LOCATION_TYPES);
  const name = `${pick(LOCATION_PREFIXES)} ${pick(LOCATION_SUFFIXES)} ${type}`;
  return {
    name,
    type,
    feature: pick(LOCATION_FEATURES),
    atmosphere: pick(ATMOSPHERES),
    hidden: pick(HIDDEN_DETAILS),
    npc: `${pick(FIRST_NAMES)} — ${pick(OCCUPATIONS).toLowerCase()}`,
  };
}

function generateEvent() {
  const event = pick(EVENTS);
  return { ...event };
}

/* ─────────────────────── STYLES ─────────────────────── */

const S = {
  wrapper: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 16,
    fontFamily: 'var(--font-ui)',
  },
  tabBar: {
    display: 'flex',
    gap: 4,
    marginBottom: 14,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: 8,
  },
  tab: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    background: active ? 'rgba(168,130,255,0.15)' : 'transparent',
    border: active ? '1px solid rgba(168,130,255,0.3)' : '1px solid transparent',
    borderRadius: 6,
    color: active ? '#a882ff' : 'var(--text-dim)',
    fontSize: 12,
    fontWeight: 600,
    fontFamily: 'var(--font-ui)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  }),
  generateBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '10px 0',
    background: 'linear-gradient(135deg, rgba(168,130,255,0.2), rgba(120,80,220,0.2))',
    border: '1px solid rgba(168,130,255,0.3)',
    borderRadius: 8,
    color: '#a882ff',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'var(--font-ui)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  card: {
    marginTop: 12,
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(168,130,255,0.15)',
    borderRadius: 8,
    padding: 14,
  },
  field: {
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#a882ff',
    marginBottom: 3,
  },
  value: {
    fontSize: 13,
    color: 'var(--text)',
    lineHeight: 1.5,
  },
  actionBar: {
    display: 'flex',
    gap: 6,
    marginTop: 12,
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: 10,
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '5px 12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6,
    color: 'var(--text-dim)',
    fontSize: 11,
    fontWeight: 600,
    fontFamily: 'var(--font-ui)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  urgencyBadge: (urgency) => {
    const colors = {
      Immediate: { bg: 'rgba(255,80,80,0.15)', border: 'rgba(255,80,80,0.3)', text: '#ff6b6b' },
      Soon: { bg: 'rgba(255,200,60,0.15)', border: 'rgba(255,200,60,0.3)', text: '#ffc83d' },
      Background: { bg: 'rgba(100,200,255,0.15)', border: 'rgba(100,200,255,0.3)', text: '#64c8ff' },
    };
    const c = colors[urgency] || colors.Background;
    return {
      display: 'inline-block',
      padding: '2px 8px',
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 4,
      color: c.text,
      fontSize: 10,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    };
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    background: 'rgba(168,130,255,0.12)',
    border: '1px solid rgba(168,130,255,0.25)',
    borderRadius: 4,
    color: '#a882ff',
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginRight: 6,
  },
};

/* ─────────────────── FIELD RENDERER ─────────────────── */

function Field({ label, children }) {
  return (
    <div style={S.field}>
      <div style={S.label}>{label}</div>
      <div style={S.value}>{children}</div>
    </div>
  );
}

/* ─────────────────── RESULT CARDS ─────────────────── */

function NPCCard({ data }) {
  return (
    <>
      <Field label="Name">{data.name}</Field>
      <Field label="Race">{data.race}</Field>
      <Field label="Occupation">{data.occupation}</Field>
      <Field label="Appearance">{data.appearance}</Field>
      <Field label="Clothing">{data.clothing}</Field>
      <Field label="Personality">{data.trait}</Field>
      <Field label="Quirk">{data.quirk}</Field>
      <Field label="Motivation">{data.motivation}</Field>
      <Field label="Secret">{data.secret}</Field>
      <Field label="Voice Hint">{data.voice}</Field>
    </>
  );
}

function LocationCard({ data }) {
  return (
    <>
      <Field label="Name">{data.name}</Field>
      <Field label="Type">{data.type}</Field>
      <Field label="Notable Feature">{data.feature}</Field>
      <Field label="Atmosphere">{data.atmosphere}</Field>
      <Field label="Hidden Detail">{data.hidden}</Field>
      <Field label="NPC Present">{data.npc}</Field>
    </>
  );
}

function EventCard({ data }) {
  return (
    <>
      <Field label="Event">{data.desc}</Field>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <span style={S.categoryBadge}>{data.cat}</span>
        <span style={S.urgencyBadge(data.urgency)}>{data.urgency}</span>
      </div>
      <Field label="Complication">{data.complication}</Field>
      <Field label="Possible Outcomes">
        <ul style={{ margin: 0, paddingLeft: 18, listStyleType: 'disc' }}>
          {data.outcomes.map((o, i) => (
            <li key={i} style={{ marginBottom: 2 }}>{o}</li>
          ))}
        </ul>
      </Field>
    </>
  );
}

/* ─────────────────── FORMAT FOR CLIPBOARD ─────────────────── */

function formatNPC(d) {
  return `NPC: ${d.name}\nRace: ${d.race}\nOccupation: ${d.occupation}\nAppearance: ${d.appearance}\nClothing: ${d.clothing}\nPersonality: ${d.trait}\nQuirk: ${d.quirk}\nMotivation: ${d.motivation}\nSecret: ${d.secret}\nVoice: ${d.voice}`;
}

function formatLocation(d) {
  return `Location: ${d.name}\nType: ${d.type}\nFeature: ${d.feature}\nAtmosphere: ${d.atmosphere}\nHidden Detail: ${d.hidden}\nNPC Present: ${d.npc}`;
}

function formatEvent(d) {
  return `Event: ${d.desc}\nCategory: ${d.cat} | Urgency: ${d.urgency}\nComplication: ${d.complication}\nOutcomes:\n${d.outcomes.map(o => `  - ${o}`).join('\n')}`;
}

/* ─────────────────── MAIN COMPONENT ─────────────────── */

const TABS = [
  { key: 'npc', label: 'NPC', icon: User },
  { key: 'location', label: 'Location', icon: MapPin },
  { key: 'event', label: 'Event', icon: Zap },
];

export default function ImprovAssistant() {
  const [tab, setTab] = useState('npc');
  const [results, setResults] = useState({ npc: null, location: null, event: null });
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setResults(prev => {
      const next = { ...prev };
      if (tab === 'npc') next.npc = generateNPC();
      else if (tab === 'location') next.location = generateLocation();
      else next.event = generateEvent();
      return next;
    });
    setCopied(false);
  }, [tab]);

  const currentResult = results[tab];

  const getText = useCallback(() => {
    if (!currentResult) return '';
    if (tab === 'npc') return formatNPC(currentResult);
    if (tab === 'location') return formatLocation(currentResult);
    return formatEvent(currentResult);
  }, [tab, currentResult]);

  const handleCopy = useCallback(async () => {
    const text = getText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  }, [getText]);

  const handleSaveToNotes = useCallback(async () => {
    const text = getText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Saved to clipboard — paste into your notes');
    } catch {
      toast.error('Failed to copy');
    }
  }, [getText]);

  return (
    <div style={S.wrapper}>
      {/* Tab bar */}
      <div style={S.tabBar}>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              style={S.tab(tab === t.key)}
              onClick={() => setTab(t.key)}
              onMouseEnter={e => {
                if (tab !== t.key) e.currentTarget.style.color = 'var(--text)';
              }}
              onMouseLeave={e => {
                if (tab !== t.key) e.currentTarget.style.color = 'var(--text-dim)';
              }}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Generate button */}
      <button
        style={S.generateBtn}
        onClick={generate}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168,130,255,0.3), rgba(120,80,220,0.3))';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168,130,255,0.2), rgba(120,80,220,0.2))';
        }}
      >
        <Zap size={14} />
        Generate {tab === 'npc' ? 'NPC' : tab === 'location' ? 'Location' : 'Event'}
      </button>

      {/* Result card */}
      {currentResult && (
        <div style={S.card}>
          {tab === 'npc' && <NPCCard data={currentResult} />}
          {tab === 'location' && <LocationCard data={currentResult} />}
          {tab === 'event' && <EventCard data={currentResult} />}

          {/* Action bar */}
          <div style={S.actionBar}>
            <button
              style={S.actionBtn}
              onClick={handleCopy}
              onMouseEnter={e => { e.currentTarget.style.color = '#a882ff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              style={S.actionBtn}
              onClick={generate}
              onMouseEnter={e => { e.currentTarget.style.color = '#a882ff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; }}
            >
              <RefreshCw size={12} />
              Regenerate
            </button>
            <button
              style={S.actionBtn}
              onClick={handleSaveToNotes}
              onMouseEnter={e => { e.currentTarget.style.color = '#a882ff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; }}
            >
              <Copy size={12} />
              Save to Notes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
