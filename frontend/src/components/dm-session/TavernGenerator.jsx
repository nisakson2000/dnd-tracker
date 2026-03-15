import { useState } from 'react';
import {
  Wine, Copy, RefreshCw, ChevronDown, ChevronRight,
  User, Utensils, Sparkles, MessageCircle, Dices,
} from 'lucide-react';
import { pick, randBetween } from '../../utils/dndHelpers';

/* ── helpers ─────────────────────────────────────────── */
const roll = randBetween;
const pickN = (a, n) => {
  const s = [...a];
  for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; }
  return s.slice(0, Math.min(n, s.length));
};

/* ── style tokens ────────────────────────────────────── */
const AMBER = '#c9a84c';

const panelBg = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '12px', overflow: 'hidden',
};

const headerStyle = {
  padding: '10px 16px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  fontSize: '11px', fontWeight: 700,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: 'var(--text-mute)',
  fontFamily: 'var(--font-mono, monospace)',
  display: 'flex', alignItems: 'center', gap: '8px',
};

const btnBase = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  padding: '7px 14px', borderRadius: '8px', fontSize: '12px',
  fontWeight: 600, fontFamily: 'var(--font-ui)',
  cursor: 'pointer', border: 'none', transition: 'all 0.15s',
};

const primaryBtn = {
  ...btnBase,
  background: `${AMBER}22`, color: AMBER,
  border: `1px solid ${AMBER}44`,
};

const ghostBtn = {
  ...btnBase,
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text-mute)',
  border: '1px solid rgba(255,255,255,0.08)',
  fontSize: '11px', padding: '5px 10px',
};

const sectionHeadStyle = {
  display: 'flex', alignItems: 'center', gap: '6px',
  cursor: 'pointer', padding: '8px 12px', borderRadius: '8px',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.04)',
  color: 'var(--text)', fontSize: '12px', fontWeight: 600,
  fontFamily: 'var(--font-ui)', width: '100%',
  userSelect: 'none', transition: 'background 0.15s',
};

/* ── template data ───────────────────────────────────── */

const NAME_ADJ = [
  'Golden', 'Rusty', 'Prancing', 'Drunken', 'Silver', 'Crimson',
  'Wandering', 'Jolly', 'Gilded', 'Broken', 'Howling', 'Sleeping',
  'Laughing', 'Weeping', 'Roaring', 'Blind', 'Lucky', 'Forgotten',
  'Wicked', 'Merry', 'Sunken', 'Iron', 'Copper', 'Thorny',
];

const NAME_NOUN = [
  'Dragon', 'Stag', 'Pony', 'Serpent', 'Goblet', 'Tankard',
  'Sword', 'Rose', 'Crown', 'Anvil', 'Phoenix', 'Griffin',
  'Hound', 'Harpy', 'Boar', 'Raven', 'Barrel', 'Lantern',
  'Anchor', 'Helm', 'Chalice', 'Thorn', 'Owl', 'Fox',
];

const ATMOSPHERES = [
  'rowdy and packed — every table full, dice rolling, arms wrestling at the bar',
  'quiet and cozy — a crackling fire, the scent of pipe smoke, a bard softly strumming',
  'tense with hushed conversations — nervous eyes dart toward the door',
  'festive with music — a halfling band plays, patrons dance, mugs slam on tables',
  'nearly empty — just the barkeep polishing glasses and a lone figure in the corner',
  'smoky and dim — candles gutter in the draft, shadows hang thick as curtains',
  'elegant and refined — crystal chandeliers, velvet booths, expensive wines on display',
  'rough and dangerous — scarred faces, concealed weapons, a fight about to break out',
  'warm and welcoming — families dining, children running, the smell of fresh bread',
  'mysterious — strange trinkets on the walls, unusual patrons from distant lands, an odd hum from the basement',
  'raucous with a drinking contest underway — cheering crowds circle two red-faced dwarves',
  'serene and otherworldly — floating candles, faintly glowing drinks, an elven harpist on stage',
];

const BARKEEP_FIRST = [
  'Grim', 'Berta', 'Thom', 'Midge', 'Dorek', 'Elara', 'Voss',
  'Nessa', 'Brunt', 'Pip', 'Hilda', 'Korv', 'Sable', 'Dag',
  'Morna', 'Fenwick', 'Ula', 'Cedric', 'Tilda', 'Barnabus',
];

const BARKEEP_LAST = [
  'Ironfist', 'Copperkettle', 'Hearthstone', 'Ashbrew', 'Tallmug',
  'Blackbarrel', 'Oakheart', 'Redmantle', 'Goldbottom', 'Silvertap',
  'Stonehand', 'Brightale', 'Deepwell', 'Thornfield', 'Quickpour',
];

const BARKEEP_RACES = ['Human', 'Dwarf', 'Halfling', 'Half-Orc', 'Half-Elf', 'Gnome', 'Tiefling', 'Goliath', 'Dragonborn', 'Firbolg'];

const BARKEEP_APPEARANCES = [
  'one-eyed with an eyepatch',
  'burly with a magnificent braided beard',
  'surprisingly young with ink-stained fingers',
  'elderly with steady hands and sharp eyes',
  'scarred veteran who limps slightly',
  'tall and thin with a hawkish nose',
  'round and jolly with rosy cheeks',
  'muscular with tattoos covering both arms',
  'small and wiry with a gold tooth',
  'broad-shouldered with a missing ear',
  'immaculately groomed with a waxed mustache',
  'weathered and sun-beaten with calloused hands',
];

const BARKEEP_PERSONALITIES = [
  'gruff but secretly kind-hearted — grunts at compliments but sneaks extra portions to hungry travellers',
  'chatty and nosy — knows everyone\'s business and isn\'t shy about sharing',
  'stoic and watchful — speaks little, misses nothing, keeps a loaded crossbow under the bar',
  'jovial and loud — slaps backs, tells terrible jokes, gives nicknames to regulars',
  'motherly and warm — calls everyone "dear" and insists they eat before drinking',
  'suspicious and cautious — studies every new face, waters down drinks for strangers',
  'retired adventurer — covered in old scars, tells wild stories if you buy them a drink',
  'nervous and jittery — constantly cleaning, flinches at loud noises, hiding from something',
  'smooth and charming — flirts with everyone, always has the perfect drink recommendation',
  'stern and no-nonsense — runs a tight ship, bans troublemakers on the spot',
];

const BARKEEP_SECRETS = [
  'is actually a retired assassin hiding from their former guild',
  'is secretly a low-level warlock whose patron lives in the tavern basement',
  'waters down the expensive wines and pockets the difference',
  'is sitting on a hidden passage to the local thieves\' guild beneath the cellar',
  'lost their family to a dragon and donates all extra coin to a dragon-slaying order',
  'is polymorphed — actually a bronze dragon who enjoys the simple life',
  'has been slowly poisoning a local noble who wronged them years ago',
  'can\'t actually taste anything — lost their sense of taste in a magical accident',
  'is the true heir to the local lordship but has no interest in politics',
  'keeps a pet mimic disguised as a chest in the back room — feeds it troublesome patrons\' belongings',
  'has a deal with the local fey — free drinks in exchange for "favors" they\'d rather not discuss',
  'is being blackmailed by a local merchant and desperately needs help',
];

const DRINK_ADJ = ['Old', 'Dark', 'Honey', 'Spiced', 'Golden', 'Smoky', 'Bitter', 'Sweet', 'Dragon\'s', 'Goblin', 'Thunder', 'Moonlit', 'Crimson', 'Frost', 'Ember', 'Shadowdark', 'Sunrise'];
const DRINK_NOUN = ['Ale', 'Stout', 'Porter', 'Lager', 'Mead', 'Wine', 'Grog', 'Cider', 'Brandy', 'Whiskey', 'Draught', 'Brew', 'Reserve'];
const DRINK_DESC = [
  'smooth with notes of caramel', 'bracingly bitter with a hoppy finish',
  'dangerously strong — the room spins after one mug', 'sweet and deceptively potent',
  'thick and dark as a moonless night', 'refreshing with a hint of citrus',
  'warm and spiced — perfect for cold nights', 'fizzy and light with a golden hue',
  'rich and malty with an oaken aftertaste', 'aromatic with hints of cinnamon and clove',
  'sharp and dry — an acquired taste', 'glows faintly (harmlessly magical)',
];

const FOOD_NAMES = [
  'Hearty Venison Stew', 'Roasted Boar Haunch', 'Shepherd\'s Pie', 'Grilled River Trout',
  'Elven Herb Bread', 'Dwarven Cheese Wheel', 'Dragon Pepper Chili', 'Honey-Glazed Ham',
  'Mushroom and Barley Soup', 'Blackened Chicken Leg', 'Halfling Meat Pie',
  'Twice-Baked Potato with Gravy', 'Spiced Lamb Skewers', 'Forest Berry Tart',
  'Fried Owlbear Eggs', 'Smoked Sausage Platter', 'Bread Bowl of Clam Chowder',
  'Stuffed Peppers with Wild Rice', 'Traveller\'s Ration Plate', 'Grilled Corn with Herb Butter',
  'Giant Pretzel with Mustard', 'Baked Apple with Cinnamon Cream', 'Pan-Seared Quail',
  'Orc-Style Ribs (extra spicy)', 'Gnomish Cheese Fondue',
];

const FOOD_DESC = [
  'served piping hot in a clay bowl', 'a generous portion on a wooden platter',
  'arrives sizzling on a hot stone', 'the house specialty — regulars swear by it',
  'simple but deeply satisfying', 'comes with a side of fresh-baked bread',
  'seasoned with rare herbs from the nearby forest', 'a secret family recipe',
];

const PATRON_FIRST = [
  'Aldric', 'Brenna', 'Cael', 'Dara', 'Eldrin', 'Fenna', 'Garrick',
  'Hilde', 'Ivar', 'Jessa', 'Kael', 'Lyra', 'Morden', 'Nyx',
  'Orin', 'Phaedra', 'Quinn', 'Rhys', 'Senna', 'Theron',
  'Ulma', 'Vex', 'Wren', 'Xara', 'Yoren', 'Zara',
];

const PATRON_RACES = [
  'Human', 'Dwarf', 'Elf', 'Halfling', 'Half-Orc', 'Gnome',
  'Tiefling', 'Dragonborn', 'Half-Elf', 'Goliath', 'Tabaxi', 'Kenku',
];

const PATRON_OCCUPATIONS = [
  'merchant', 'soldier', 'farmer', 'noble', 'bard', 'blacksmith',
  'scholar', 'bounty hunter', 'priest', 'sailor', 'herbalist',
  'retired adventurer', 'courier', 'thief', 'guard off-duty',
  'cartographer', 'alchemist', 'woodcutter', 'traveling performer',
  'mercenary', 'pilgrim', 'scribe', 'hunter', 'apothecary',
];

const PATRON_ACTIVITIES = [
  'nursing a drink alone, staring at a crumpled letter',
  'arm-wrestling a much larger opponent — and winning',
  'loudly telling an embellished adventure story to a rapt audience',
  'quietly reading a worn leather-bound book',
  'playing cards with a suspiciously large pile of coins',
  'arguing with the barkeep about their tab',
  'sketching something in a journal, glancing around nervously',
  'eating an enormous meal as though they haven\'t eaten in days',
  'humming a melancholy tune and staring into the fire',
  'whittling a small wooden figurine with practiced hands',
  'talking to an empty chair as if someone were sitting there',
  'counting coins obsessively and muttering calculations',
  'examining a strange artifact pulled from a leather satchel',
  'flirting badly with anyone who makes eye contact',
  'sleeping face-down on the table, empty mugs scattered around',
  'watching the door intently, as if waiting for someone specific',
];

const PATRON_DIALOGUE = [
  '"You didn\'t hear this from me, but... the barkeep\'s been acting strange lately."',
  '"Buy me a drink and I\'ll tell you something worth ten times the price."',
  '"I wouldn\'t go down that road if I were you. Not after dark."',
  '"You look like the type who can handle themselves. I might have a job for you."',
  '"This? Oh, it\'s nothing. Just a scratch. You should see the other guy."',
  '"I\'ve been waiting here three days for someone who isn\'t coming."',
  '"That bard doesn\'t know the half of it. I was THERE when it happened."',
  '"Keep your voice down. See that one by the fire? They\'ve been watching us."',
  '"Best stew in the county, but don\'t ask about the meat. Trust me."',
  '"I used to be an adventurer too, you know. Funny how that works out."',
  '"If you\'re headed north, take the long way around. The bridge is... compromised."',
  '"Gold? I don\'t need gold. I need someone brave. Or stupid. Either works."',
  '"Last group that came through here asking questions? Never seen again."',
  '"Pull up a chair. You look like you could use a friend — or at least a drink."',
  '"That symbol on your gear... I\'ve seen it before. In a place I\'d rather forget."',
  '"Shh — act natural. I think we\'re being listened to."',
];

const PATRON_HOOKS = [
  'Needs an escort to a nearby town — the roads have become dangerous',
  'Has a treasure map but can\'t read the ancient script on it',
  'Is looking for a missing sibling who was last seen heading into the wilderness',
  'Wants someone to retrieve an heirloom from a haunted estate',
  'Overheard bandits planning a raid on a local farm — needs heroes to intervene',
  'Possesses a cursed item and desperately needs someone to lift the enchantment',
  'Knows the location of an abandoned mine rumored to hold dwarven gold',
  'Was double-crossed by a business partner and wants payback',
  'Has information about a cult operating in the sewers beneath the city',
  'Needs bodyguards for a dangerous diplomatic mission',
  'Found a strange egg in the forest and it\'s starting to hatch',
  'Is being followed by something invisible — needs help setting a trap',
  'Wants to hire adventurers to enter a locked wizard\'s tower and retrieve a specific book',
  'Knows where a legendary weapon is buried but the graveyard is cursed',
  'Has a bounty notice for a creature that\'s been terrorising the local farms',
  'Received a threatening letter signed with a symbol nobody in town recognizes',
];

const TAVERN_SPECIALTIES = [
  'Dragon\'s Breath Ale (spicy, glows faintly)',
  'Honeyed Mead from the Northern Reaches',
  'Mystery Stew (don\'t ask what\'s in it)',
  'Frostfire Whiskey — burns cold going down',
  'Elven Starlight Wine (shimmers like liquid silver)',
  'Dwarven Forge Stout — thick enough to stand a spoon in',
  'Pixie Dust Punch — mildly hallucinogenic, entirely legal',
  'Smoked Owlbear Brisket with pepper glaze',
  'Basilisk Eye Soup (no actual basilisk — probably)',
  'Halfling Honey Cakes with clotted cream',
  'The Barkeep\'s Secret Blend — changes flavor with each sip',
  'Wyrmwood Smoked Sausages with grainy mustard',
  'Celestial Cider — brewed under a full moon, faintly warm to the touch',
  'Infernal Hot Wings — a challenge posted on the wall for anyone who can finish them',
];

const FEATURES = [
  'A small stage where a bard is performing — tip jar overflowing with copper',
  'A dart board with a tournament bracket chalked on the wall beside it',
  'A fighting ring in the back, surrounded by cheering (and betting) patrons',
  'A gambling table where a high-stakes game of Three-Dragon Ante is in progress',
  'A secret room behind a bookcase — the barkeep charges 5 gold for access',
  'A roaring fireplace large enough to stand in, with a mantle covered in trophies',
  'A trophy wall displaying monster heads, rusted weapons, and framed bounty posters',
  'A board covered in wanted posters, job listings, and cryptic notes',
  'A mechanical music box that plays different songs depending on the coins inserted',
  'An enchanted mug that refills itself once per day — nailed to the bar to prevent theft',
  'A stuffed owlbear in the corner wearing a party hat — the tavern mascot',
  'A well in the basement that echoes with strange whispers at midnight',
  'A dueling scoreboard listing the names and win records of regular fighters',
  'A ceiling covered in pinned notes, IOUs, and bar tabs going back decades',
  'A magical painting that changes scenes — currently showing a stormy sea',
  'A resident cat that seems unnervingly intelligent and watches everyone',
];

const RUMORS = [
  'They say the old watchtower outside town glows with green light on moonless nights. Nobody who\'s gone to investigate has come back.',
  'A merchant caravan vanished on the north road last week. The guards found the wagons but no people — and no signs of a struggle.',
  'The local lord has been acting strangely ever since that new advisor arrived. Some say the advisor is a shapechanger.',
  'There\'s a dragon sleeping under the mountain. It\'s been there for centuries, but lately the ground has been trembling.',
  'Someone\'s been leaving strange symbols painted on doors around town. The houses marked have had terrible luck.',
  'The old well in the town square was sealed for a reason. The masons who sealed it refused to say why.',
  'A traveling fortune teller predicted a great calamity within the month. She disappeared the next morning.',
  'Pirates have been spotted off the coast, flying a flag nobody recognizes — black with a silver eye.',
  'The harvest festival is coming up, but the crops in the eastern fields have turned black overnight.',
  'Children in the village have been having the same nightmare — a tall figure standing at the edge of the forest, beckoning.',
  'The temple priests have gone silent. No services, no visitors. The doors are barred from the inside.',
  'A bounty of 500 gold has been posted for the "Pale Stranger" — but the poster gives no description, only a warning.',
  'Strange music has been heard coming from the abandoned mine at night. Those who follow it don\'t come back the same.',
  'The river has been running red for three days. Upstream, nobody can find the source.',
  'There\'s a new shop in town that wasn\'t there yesterday. The owner sells "memories" in glass vials.',
];

/* ── tavern generator ────────────────────────────────── */

function generateTavern() {
  const name = `The ${pick(NAME_ADJ)} ${pick(NAME_NOUN)}`;
  const atmosphere = pick(ATMOSPHERES);

  // barkeep
  const barkeep = {
    name: `${pick(BARKEEP_FIRST)} ${pick(BARKEEP_LAST)}`,
    race: pick(BARKEEP_RACES),
    appearance: pick(BARKEEP_APPEARANCES),
    personality: pick(BARKEEP_PERSONALITIES),
    secret: pick(BARKEEP_SECRETS),
  };

  // tavern specialty
  const specialty = pick(TAVERN_SPECIALTIES);

  // menu: 3-4 drinks + 3-4 foods
  const drinkCount = roll(3, 4);
  const foodCount = roll(3, 4);
  const drinks = Array.from({ length: drinkCount }, () => ({
    name: `${pick(DRINK_ADJ)} ${pick(DRINK_NOUN)}`,
    desc: pick(DRINK_DESC),
    price: `${roll(1, 5)} ${pick(['cp', 'cp', 'sp', 'sp', 'sp'])}`,
  }));
  const foods = Array.from({ length: foodCount }, () => ({
    name: pick(FOOD_NAMES),
    desc: pick(FOOD_DESC),
    price: `${roll(1, 8)} ${pick(['cp', 'sp', 'sp', 'sp'])}`,
  }));
  // deduplicate food names
  const seenFoods = new Set();
  const uniqueFoods = foods.filter(f => {
    if (seenFoods.has(f.name)) return false;
    seenFoods.add(f.name);
    return true;
  });

  // patrons
  const patronCount = roll(3, 5);
  const patrons = Array.from({ length: patronCount }, () => ({
    name: pick(PATRON_FIRST),
    race: pick(PATRON_RACES),
    occupation: pick(PATRON_OCCUPATIONS),
    activity: pick(PATRON_ACTIVITIES),
    dialogue: pick(PATRON_DIALOGUE),
    hook: pick(PATRON_HOOKS),
  }));

  const feature = pick(FEATURES);
  const rumor = pick(RUMORS);

  return { name, atmosphere, barkeep, specialty, drinks, foods: uniqueFoods, patrons, feature, rumor };
}

/* ── collapsible section ─────────────────────────────── */
function Section({ title, icon: Icon, iconColor, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: '6px' }}>
      <button onClick={() => setOpen(!open)} style={sectionHeadStyle}>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {Icon && <Icon size={13} style={{ color: iconColor || AMBER }} />}
        <span>{title}</span>
      </button>
      {open && (
        <div style={{
          padding: '10px 14px', fontSize: '13px', lineHeight: 1.6,
          color: 'var(--text)', fontFamily: 'var(--font-ui)',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── main component ──────────────────────────────────── */
export default function TavernGenerator() {
  const [tavern, setTavern] = useState(null);

  const generate = () => setTavern(generateTavern());

  const copyTavern = () => {
    if (!tavern) return;
    const text = [
      `# ${tavern.name}`,
      '',
      `**Atmosphere:** ${tavern.atmosphere}`,
      '',
      `**House Specialty:** ${tavern.specialty}`,
      '',
      `## Barkeep: ${tavern.barkeep.name}`,
      `- **Race:** ${tavern.barkeep.race}`,
      `- **Appearance:** ${tavern.barkeep.appearance}`,
      `- **Personality:** ${tavern.barkeep.personality}`,
      `- **Secret:** ${tavern.barkeep.secret}`,
      '',
      `## Menu`,
      '### Drinks',
      ...tavern.drinks.map(d => `- **${d.name}** (${d.price}) — ${d.desc}`),
      '### Food',
      ...tavern.foods.map(f => `- **${f.name}** (${f.price}) — ${f.desc}`),
      '',
      `## Notable Patrons`,
      ...tavern.patrons.map(p => [
        `### ${p.name} — ${p.race} ${p.occupation}`,
        `- ${p.activity}`,
        `- *${p.dialogue}*`,
        `- **Quest hook:** ${p.hook}`,
      ].join('\n')),
      '',
      `## Special Feature`,
      tavern.feature,
      '',
      `## Rumor`,
      `"${tavern.rumor}"`,
    ].join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div style={panelBg}>
      {/* header */}
      <div style={headerStyle}>
        <Wine size={12} style={{ color: AMBER }} />
        Tavern Generator
      </div>

      {/* controls */}
      <div style={{ padding: '12px' }}>
        <button onClick={generate} style={primaryBtn}>
          <Dices size={14} /> Generate Tavern
        </button>
      </div>

      {/* generated tavern */}
      {tavern && (
        <div style={{
          margin: '0 12px 12px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px', padding: '12px',
        }}>
          {/* title bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '10px', flexWrap: 'wrap', gap: '6px',
          }}>
            <span style={{
              fontSize: '16px', fontWeight: 700, color: AMBER,
              fontFamily: 'var(--font-ui)',
            }}>{tavern.name}</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={copyTavern} style={ghostBtn} title="Copy to clipboard">
                <Copy size={12} /> Copy
              </button>
              <button onClick={generate} style={ghostBtn} title="Regenerate">
                <RefreshCw size={12} /> New
              </button>
            </div>
          </div>

          {/* atmosphere */}
          <div style={{
            padding: '8px 12px', borderRadius: '8px', marginBottom: '10px',
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.15)',
            fontSize: '13px', fontStyle: 'italic', color: 'var(--text)',
            lineHeight: 1.6,
          }}>
            The atmosphere is {tavern.atmosphere}.
          </div>

          {/* house specialty */}
          <div style={{
            padding: '8px 12px', borderRadius: '8px', marginBottom: '10px',
            background: 'rgba(167,139,250,0.06)',
            border: '1px solid rgba(167,139,250,0.15)',
            fontSize: '13px', color: 'var(--text)',
            lineHeight: 1.6,
          }}>
            <strong style={{ color: '#a78bfa' }}>House Specialty:</strong> {tavern.specialty}
          </div>

          {/* barkeep */}
          <Section title={`Barkeep: ${tavern.barkeep.name}`} icon={User} iconColor="#60a5fa" defaultOpen>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><strong style={{ color: '#60a5fa' }}>Race:</strong> {tavern.barkeep.race}</div>
              <div><strong style={{ color: '#60a5fa' }}>Appearance:</strong> {tavern.barkeep.appearance}</div>
              <div><strong style={{ color: '#60a5fa' }}>Personality:</strong> {tavern.barkeep.personality}</div>
              <div style={{
                marginTop: '4px', padding: '6px 10px', borderRadius: '6px',
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.15)',
                fontSize: '12px',
              }}>
                <strong style={{ color: '#ef4444' }}>Secret:</strong> {tavern.barkeep.secret}
              </div>
            </div>
          </Section>

          {/* menu */}
          <Section title="Menu" icon={Utensils} iconColor={AMBER} defaultOpen>
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: AMBER, marginBottom: '6px',
                fontFamily: 'var(--font-mono, monospace)',
              }}>Drinks</div>
              {tavern.drinks.map((d, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)',
                  gap: '8px',
                }}>
                  <div>
                    <strong style={{ color: 'var(--text)' }}>{d.name}</strong>
                    <span style={{ color: 'var(--text-mute)', fontSize: '11px', marginLeft: '6px' }}>— {d.desc}</span>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, color: AMBER,
                    whiteSpace: 'nowrap', fontFamily: 'var(--font-mono, monospace)',
                  }}>{d.price}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{
                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: AMBER, marginBottom: '6px',
                fontFamily: 'var(--font-mono, monospace)',
              }}>Food</div>
              {tavern.foods.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)',
                  gap: '8px',
                }}>
                  <div>
                    <strong style={{ color: 'var(--text)' }}>{f.name}</strong>
                    <span style={{ color: 'var(--text-mute)', fontSize: '11px', marginLeft: '6px' }}>— {f.desc}</span>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, color: AMBER,
                    whiteSpace: 'nowrap', fontFamily: 'var(--font-mono, monospace)',
                  }}>{f.price}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* patrons */}
          <Section title={`Notable Patrons (${tavern.patrons.length})`} icon={User} defaultOpen>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tavern.patrons.map((p, i) => (
                <div key={i} style={{
                  padding: '8px 12px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong style={{ color: 'var(--text)' }}>{p.name}</strong>
                    <span style={{
                      fontSize: '10px', fontWeight: 600, marginLeft: '6px',
                      padding: '1px 6px', borderRadius: '4px',
                      background: 'rgba(167,139,250,0.15)', color: '#a78bfa',
                      border: '1px solid rgba(167,139,250,0.3)',
                    }}>{p.race} {p.occupation}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-mute)', marginBottom: '4px' }}>
                    {p.activity}
                  </div>
                  <div style={{
                    fontSize: '11px', fontStyle: 'italic', color: 'var(--text-mute)',
                    marginBottom: '4px', paddingLeft: '8px',
                    borderLeft: '2px solid rgba(255,255,255,0.08)',
                  }}>
                    {p.dialogue}
                  </div>
                  <div style={{
                    fontSize: '11px', padding: '4px 8px', borderRadius: '4px',
                    background: 'rgba(201,168,76,0.06)',
                    border: '1px solid rgba(201,168,76,0.12)',
                    color: '#c9a84c',
                  }}>
                    <strong>Quest hook:</strong> {p.hook}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* special feature */}
          <Section title="Special Feature" icon={Sparkles} iconColor="#a78bfa">
            {tavern.feature}
          </Section>

          {/* rumor */}
          <Section title="Rumor Being Whispered" icon={MessageCircle} iconColor="#ef4444">
            <div style={{
              fontStyle: 'italic', padding: '8px 12px', borderRadius: '6px',
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.12)',
            }}>
              "{tavern.rumor}"
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
