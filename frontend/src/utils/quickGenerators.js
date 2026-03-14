/**
 * quickGenerators.js — Rich, interconnected D&D content generators
 *
 * Pure functions, no imports needed. Each generator returns a fully-formed
 * object ready for use in forms or display. Generators cross-reference
 * each other so quests reference NPCs, locations tie to lore, etc.
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Pick a random element from an array */
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Pick n unique random elements from an array */
export const pickN = (arr, n) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
};

/** Roll a die with the given number of sides (1-based) */
export const roll = (sides) => Math.floor(Math.random() * sides) + 1;

/** Roll a random integer in [min, max] inclusive */
export const rollRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ─── Shared Data Pools ───────────────────────────────────────────────────────

const RACES = [
  'Human','Elf','Half-Elf','Dwarf','Halfling','Gnome','Half-Orc','Tiefling',
  'Dragonborn','Aasimar','Goliath','Tabaxi','Firbolg','Kenku','Lizardfolk',
  'Tortle','Genasi','Changeling','Warforged','Harengon','Satyr','Goblin'
];

const CLASSES = [
  'Fighter','Wizard','Rogue','Cleric','Ranger','Paladin','Bard','Druid',
  'Sorcerer','Warlock','Monk','Barbarian','Artificer','Blood Hunter'
];

const OCCUPATIONS = [
  'Blacksmith','Merchant','Innkeeper','Scholar','Farmer','Sailor','Guard',
  'Herbalist','Scribe','Bounty Hunter','Spy','Diplomat','Alchemist',
  'Cartographer','Jeweler','Tanner','Baker','Brewer','Miner','Shepherd',
  'Fisher','Mason','Weaver','Chandler','Apothecary','Grave Digger',
  'Rat Catcher','Town Crier','Courier','Stable Hand','Fortune Teller',
  'Street Performer','Tax Collector'
];

const NAMES = {
  human_first: [
    'Aldric','Bran','Cedric','Dorin','Edric','Feron','Gareth','Hadrian',
    'Ivar','Jareth','Kael','Loren','Marcus','Nolan','Orin','Percival',
    'Quinn','Roland','Silas','Theron','Ulric','Vance','Wendell','Xavier',
    'Yorick','Zara','Alira','Brenna','Cara','Delia','Elara','Freya',
    'Gwen','Helena','Iris','Jessa','Kira','Lyra','Mira','Nessa',
    'Ophelia','Petra','Rowena','Sera','Talia','Una','Vira','Wren',
    'Yara','Zelda','Corwin','Desmond','Falken','Gunther','Hugo'
  ],
  elf_first: [
    'Aelindra','Caelynn','Drael','Erevan','Faelyn','Galadrien','Haelion',
    'Ithilwen','Jorath','Kaylessa','Lirael','Miriel','Naivara','Oreleth',
    'Paelias','Quillathe','Riardon','Sariel','Thialyn','Umiaren','Varis',
    'Wyrran','Xiloscient','Yaeldrin','Zylphia','Arannis','Berrian',
    'Cyrandil','Darunia','Elandril','Fierna','Galadhon','Heian','Ivellios',
    'Jhaal','Kethryllia','Laucian','Mindartis','Nerisys','Orianthe',
    'Phaeris','Quarion','Rythiel','Soveliss','Thamior','Ulesse','Valanthe',
    'Wylsin','Xanaphia','Yrlissa','Zandalar'
  ],
  dwarf_first: [
    'Adrik','Baern','Connerad','Dain','Eberk','Fargrim','Gardain','Harbek',
    'Ilvarra','Jorn','Kathra','Lysdra','Morgran','Nordak','Orsik','Pikel',
    'Rangrim','Storn','Torbera','Ulfgar','Vonbin','Whurdred','Yamtra',
    'Zaknafein','Amberline','Bardryn','Citrine','Dagnal','Eldeth','Finellen',
    'Gurdis','Hlin','Ilde','Jethra','Kristryd','Liftrasa','Mardred',
    'Nisstra','Orla','Perra','Riswynn','Sannl','Tordek','Ulrike','Vistra',
    'Wrenara','Yuldra','Bruenor','Cadderly','Drizara','Emerus','Flintara'
  ],
  halfling_first: [
    'Andry','Bree','Callie','Daro','Eldon','Finnan','Garret','Hilara',
    'Idra','Jillian','Kithri','Lavinia','Merric','Nedda','Osborn','Paela',
    'Qelline','Roscoe','Seraphina','Trym','Ulmo','Verna','Wellby','Xara',
    'Yondalla','Zook','Alton','Beau','Cade','Demi','Errich','Felix',
    'Gorbo','Havi','Ivy','Josie','Kerra','Lidda','Milo','Nix',
    'Olive','Pip','Questa','Rufus','Sam','Tansy','Ula','Vani',
    'Willow','Xeni','Yolanda','Zara'
  ],
  exotic_first: [
    'Akmenos','Baalzebul','Criella','Damakos','Ekemon','Fharlanghn',
    'Ghesh','Heskan','Iados','Jheri','Kallista','Leucis','Mehen','Nala',
    'Orianna','Pelaios','Quarathon','Rhogar','Shamash','Torinn',
    'Uadjit','Verthica','Weshtek','Xathanon','Yuriel','Zephyros',
    'Arjhan','Bharash','Cazimir','Donaar','Ember','Farideh','Gresh',
    'Havilar','Ilkan','Jezera','Kriv','Lorcan','Medrash','Naxene',
    'Ovak','Prexijandilin','Quelenna','Razaan','Sora','Tarhun',
    'Umara','Valorean','Wulfgar','Xorlarrin','Yasha','Zethrindor'
  ],
  human_last: [
    'Ashford','Blackwood','Crane','Dunbar','Everhart','Fairchild','Graves',
    'Holloway','Ironside','Jarvis','Kingsley','Lancaster','Mercer','Northwind',
    'Oakenshield','Pennywhistle','Quill','Ravenswood','Stormwind','Thornbury',
    'Underhill','Valorheim','Whitmore','Yarborough','Zephyr','Alderton',
    'Brightwater','Coldridge','Dawnforge','Eastmere'
  ],
  elf_last: [
    'Amakiir','Brightleaf','Crystalmere','Dawnwhisper','Evenstar','Feywild',
    'Galanodel','Holimion','Ilphelkiir','Joraleth','Koehlanna','Liadon',
    'Meliamne','Nailo','Oakenheel','Prestor','Quelessir','Raethran',
    'Siannodel','Teinithra','Ulondarr','Virmenor','Windrivver','Xiloscient',
    'Yaeldrin','Zinnaerris','Alenuath','Berevan','Caerdonel','Daelynn'
  ],
  dwarf_last: [
    'Battlehammer','Brawnanvil','Coppervein','Dankil','Fireforge','Gorunn',
    'Holderhek','Ironfist','Jundeth','Kettleblack','Loderr','Marthammor',
    'Narlagh','Onyxhammer','Prydain','Quartzshield','Rumnaheim','Strakeln',
    'Torunn','Ungart','Vignar','Wyvernshield','Xundorn','Yargrim',
    'Zandilar','Anvilthar','Bronzebeard','Coalheart','Deepdelver','Earthgrip'
  ],
  halfling_last: [
    'Brushgather','Copperkettle','Dawnfield','Elderberry','Fiddlewick',
    'Goodbarrel','Hilltopple','Ivybrook','Jambree','Kettleburn','Leagallow',
    'Moonsong','Nimblefingers','Overdale','Pebblebrook','Quickstep',
    'Rosehaven','Stoutheart','Tallstory','Underbough','Vinewalker',
    'Warmhearth','Yellowleaf','Bigheart','Clearwater','Dewdrop',
    'Fastfoot','Greenbottle','Honeydew','Littlefoot'
  ],
  exotic_last: [
    'Brimstone','Cinderfell','Duskwalker','Emberheart','Flamecrest',
    'Gloomfang','Hexblood','Infernus','Jadescale','Kragmaw','Lightsworn',
    'Moonshadow','Nightwhisper','Obsidian','Pyreclad','Quicksilver',
    'Ravenmask','Stormscale','Thornveil','Umbraforge','Voidtouched',
    'Wyrmblood','Ashmantle','Bloodfyre','Chaosborn','Dreadhollow',
    'Evernight','Fellgazer','Grimsorrow','Hellforged'
  ]
};

const PERSONALITY_COMBOS = [
  { traits: 'Generous but suspicious', desc: 'gives freely yet always watches for betrayal' },
  { traits: 'Cheerful but vengeful', desc: 'smiles warmly until crossed, then never forgets' },
  { traits: 'Scholarly but reckless', desc: 'brilliant mind that leaps before looking' },
  { traits: 'Kind-hearted but cowardly', desc: 'genuinely cares but flees at the first sign of danger' },
  { traits: 'Stoic but secretly romantic', desc: 'stone-faced exterior hiding a sentimental heart' },
  { traits: 'Boisterous but insecure', desc: 'loud bravado masking deep self-doubt' },
  { traits: 'Honest but tactless', desc: 'always tells the truth, often painfully' },
  { traits: 'Loyal but obsessive', desc: 'devotion that crosses into unhealthy fixation' },
  { traits: 'Humble but ambitious', desc: 'acts meek while quietly scheming to rise' },
  { traits: 'Devout but hypocritical', desc: 'preaches virtue while bending every rule' },
  { traits: 'Witty but cruel', desc: 'sharp humor that always cuts a little too deep' },
  { traits: 'Calm but explosive', desc: 'serene until a trigger unleashes fury' },
  { traits: 'Friendly but manipulative', desc: 'warm smiles hiding a calculating mind' },
  { traits: 'Brave but arrogant', desc: 'fearless to the point of dismissing all caution' },
  { traits: 'Curious but nosy', desc: 'thirst for knowledge that ignores all boundaries' },
  { traits: 'Protective but controlling', desc: 'guards loved ones by smothering them' },
  { traits: 'Patient but passive', desc: 'waits so long that opportunities slip away' },
  { traits: 'Creative but chaotic', desc: 'brilliant ideas wrapped in total disorder' },
  { traits: 'Disciplined but joyless', desc: 'perfect self-control at the cost of happiness' },
  { traits: 'Compassionate but naive', desc: 'believes the best in everyone, even villains' },
  { traits: 'Charming but unreliable', desc: 'wins hearts easily but never follows through' },
  { traits: 'Resourceful but amoral', desc: 'can solve any problem if ethics are optional' },
];

const VOICES = [
  'Whispers everything, forcing others to lean in close',
  'Speaks in rhyming couplets when nervous',
  'Booming voice that carries across any room',
  'Stutters on names but speaks fluently otherwise',
  'Dry, deadpan delivery — never laughs at own jokes',
  'Sing-song cadence, almost melodic',
  'Clipped military precision, no wasted words',
  'Slow and deliberate, pausing mid-sentence for effect',
  'Rapid-fire speech, barely pauses for breath',
  'Gravelly rasp, like gargling stones',
  'Formal and archaic, uses "thee" and "thou"',
  'Peppers speech with foreign phrases nobody understands',
  'Constantly trails off mid-sentence, distracted',
  'Speaks in the third person about themselves',
  'Warm and grandfatherly, calls everyone "dear"',
  'Sharp and cutting, every word chosen like a weapon',
  'Nervous laugh after every other sentence',
];

const MOTIVATIONS = [
  'Searching for a sibling who vanished ten years ago',
  'Repaying a life-debt to someone they secretly despise',
  'Collecting rare ingredients to cure a dying mentor',
  'Building enough wealth to buy their family out of serfdom',
  'Seeking the tomb of an ancestor to reclaim a birthright',
  'Atoning for accidentally causing a village fire',
  'Proving their worth to a parent who disowned them',
  'Hunting the shapeshifter that replaced their spouse',
  'Gathering evidence to overthrow a corrupt magistrate',
  'Deciphering a prophetic dream that haunts every night',
  'Protecting a secret that could start a war if revealed',
  'Earning enough glory to be accepted into a legendary order',
  'Finding the source of a curse slowly turning them to stone',
  'Recovering a stolen holy relic before their god notices',
  'Mapping uncharted territory to name a discovery after their dead child',
  'Sabotaging a rival who stole their life\'s work',
  'Escaping an arranged marriage to someone truly monstrous',
];

const APPEARANCES = [
  'A jagged scar running from temple to jaw',
  'Mismatched eyes — one blue, one amber',
  'Intricate tattoo sleeves depicting a coiling serpent',
  'Missing the tip of their left ear',
  'Shock of prematurely white hair despite a young face',
  'Calloused hands covered in ink stains',
  'A prominent nose that has been broken more than once',
  'Unnervingly perfect teeth, almost too white',
  'Deep crow\'s feet from a lifetime of squinting at the sea',
  'A burn mark in the shape of a holy symbol on their palm',
  'Wiry frame, all sinew and sharp angles',
  'Broad-shouldered and barrel-chested, imposing even seated',
  'Freckled skin and wild copper-red curls',
  'A thin, carefully groomed mustache they constantly stroke',
];

const SECRETS = [
  'Is actually a minor noble traveling in disguise',
  'Murdered someone in self-defense but the law doesn\'t know',
  'Has a second family in another city',
  'Stole the identity of a dead person years ago',
  'Knows the location of a hidden treasure but is too afraid to claim it',
  'Is slowly being corrupted by a cursed item they carry',
  'Was once a member of a cult and still bears their brand',
  'Can see ghosts but tells no one for fear of being called mad',
  'Owes a massive debt to a devil from a desperate bargain',
  'Is an informant for an enemy faction, but has grown to regret it',
  'Has a terminal illness they hide from everyone',
  'Witnessed a crime committed by a powerful noble and is being hunted for it',
];

const QUIRKS = [
  'Obsessively counts coins, even in casual conversation',
  'Refuses to sleep indoors, always finds a spot outside',
  'Carves small wooden animals and leaves them for strangers',
  'Hums a specific tune when concentrating — always the same one',
  'Collects teeth and keeps them in a pouch',
  'Compulsively straightens anything crooked or askew',
  'Talks to their weapon as if it were a person',
  'Always sits with their back to the wall, facing every exit',
  'Eats flowers and insists they are nutritious',
  'Keeps a detailed journal of every person they meet',
  'Flinches visibly whenever someone raises their voice',
  'Cannot resist petting any animal they see, even dangerous ones',
];

const FACTIONS = [
  'The Silver Hand','The Obsidian Circle','The Dawn Tribunal','The Emerald Enclave',
  'The Red Fangs','The Ashen Covenant','The Iron Oath','The Moonlit Path',
  'The Gilded Syndicate','The Thornwatch','The Stormcallers','The Silent Accord',
  'The Crimson Fleet','The Verdant Order','The Dusk Wardens'
];

const CREATURES = [
  'Owlbear','Displacer Beast','Basilisk','Manticore','Wyvern','Chimera',
  'Mimic','Gelatinous Cube','Beholder','Mind Flayer','Lich','Dragon Turtle',
  'Bulette','Rust Monster','Ankheg','Cockatrice','Griffon','Hippogriff',
  'Phase Spider','Shambling Mound','Troll','Hydra','Roper','Gibbering Mouther'
];

const ITEMS_POOL = [
  'Amulet of Whispers','Blade of the Eclipse','Crown of Forgotten Kings',
  'Dagger of Venom','Eye of the Storm','Flame Tongue Longsword',
  'Gauntlets of Ogre Power','Helm of Telepathy','Ioun Stone of Insight',
  'Javelin of Lightning','Keoghtom\'s Ointment','Lantern of Revealing',
  'Mantle of Spell Resistance','Necklace of Fireballs','Orb of Dragonkind',
  'Pearl of Power','Quiver of Ehlonna','Ring of Spell Storing',
  'Staff of the Woodlands','Talisman of Pure Good','Urn of Holding',
  'Vorpal Sword','Wand of Wonder','Bag of Tricks','Cape of the Mountebank',
  'Decanter of Endless Water','Eversmoking Bottle','Folding Boat'
];

const LOCATION_NAMES_POOL = [
  'Ravenhollow','Thornfield','Ashenmoor','Crystalvale','Duskreach',
  'Emberfall','Frosthaven','Gloomharbor','Ironpeak','Jadecrest',
  'Kingsbarrow','Lakewatch','Moonrise','Nightwell','Oakshade',
  'Pinecrest','Silverrun','Stormveil','Wraithmarsh','Goldmere',
  'Hollow Hill','Darkwater','Sunstone','Willowmere','Grimstone',
  'Starfall','Cinderpeak','Briarwood','Misthollow','Wolfden'
];

// ─── Race-to-name-pool mapping ───────────────────────────────────────────────

function _raceCategory(race) {
  if (['Human','Half-Orc','Goliath','Warforged'].includes(race)) return 'human';
  if (['Elf','Half-Elf','Firbolg','Satyr'].includes(race)) return 'elf';
  if (['Dwarf','Gnome'].includes(race)) return 'dwarf';
  if (['Halfling','Harengon','Goblin'].includes(race)) return 'halfling';
  return 'exotic';
}

function _nameForRace(race) {
  const cat = _raceCategory(race);
  const first = pick(NAMES[`${cat}_first`]);
  const last = pick(NAMES[`${cat}_last`]);
  return { first, last, full: `${first} ${last}` };
}

// ─── 1. NPC Generator ────────────────────────────────────────────────────────

/**
 * Generate a fully-formed NPC with name, race, class, personality, and more.
 * @param {Object} [options]
 * @param {'ally'|'enemy'|'neutral'} [options.role]
 * @param {'tavern'|'wilderness'|'city'|'dungeon'} [options.setting]
 * @param {'minor'|'major'|'boss'} [options.importance]
 * @returns {Object} Complete NPC object
 */
export function generateNPC(options = {}) {
  const { role, setting, importance } = options;

  const race = pick(RACES);
  const name = _nameForRace(race);
  const isAdventurer = Math.random() > 0.5;
  const occupation = isAdventurer ? pick(CLASSES) : pick(OCCUPATIONS);
  const personality = pick(PERSONALITY_COMBOS);
  const voice = pick(VOICES);
  const motivation = pick(MOTIVATIONS);
  const appearance = pickN(APPEARANCES, rollRange(1, 3));
  const secret = pick(SECRETS);
  const quirk = pick(QUIRKS);
  const faction = Math.random() > 0.6 ? pick(FACTIONS) : null;

  // Setting-aware flavor
  const settingHooks = {
    tavern: [
      `${name.first} is nursing a drink alone, clearly wanting to talk.`,
      `${name.first} challenges a party member to an arm-wrestling contest.`,
      `${name.first} slips a note under someone's mug and walks away.`,
    ],
    wilderness: [
      `The party finds ${name.first} wounded beside a collapsed horse.`,
      `${name.first} is tracking the same creature the party is hunting.`,
      `${name.first} appears at their campfire uninvited, asking for safe passage.`,
    ],
    city: [
      `${name.first} bumps into a party member and pickpockets them (or vice versa).`,
      `${name.first} is shouting at a merchant over a clearly fraudulent deal.`,
      `${name.first} posts a hand-written job notice on a board and looks around nervously.`,
    ],
    dungeon: [
      `${name.first} is trapped in a cage, claiming to be an adventurer like the party.`,
      `${name.first} emerges from the shadows offering to guide the party — for a price.`,
      `The party finds ${name.first}'s journal beside skeletal remains. Or are they really dead?`,
    ],
  };

  const roleLabels = {
    ally: 'Friendly and helpful, willing to aid the party',
    enemy: 'Hostile or opposed to the party\'s goals',
    neutral: 'Indifferent, could be swayed either way',
  };

  const importanceLevel = importance || pick(['minor', 'minor', 'major', 'major', 'boss']);
  const hpRange = { minor: [8, 30], major: [30, 80], boss: [80, 200] };
  const [hpMin, hpMax] = hpRange[importanceLevel];

  const questHook = setting && settingHooks[setting]
    ? pick(settingHooks[setting])
    : pick([
        `${name.first} needs someone to deliver a sealed package to ${pick(LOCATION_NAMES_POOL)}.`,
        `${name.first} is being followed and begs the party for protection.`,
        `${name.first} offers a map to a hidden ${pick(['tomb', 'vault', 'shrine', 'grove'])} in exchange for a favor.`,
        `${name.first} claims to know the true identity of a local villain.`,
      ]);

  const relationshipSuggestion = pick([
    `Old friend of a party member from before the campaign`,
    `Owes a debt to someone the party has met before`,
    `Sibling or cousin of a previously encountered NPC`,
    `Former rival turned reluctant ally`,
    `Shares a mutual enemy with the party`,
    `Was once saved by someone the party knows`,
    `Belongs to the same faction as a party member`,
  ]);

  return {
    name: name.full,
    firstName: name.first,
    lastName: name.last,
    race,
    class: occupation,
    isAdventurer,
    level: isAdventurer ? rollRange(1, 15) : null,
    hp: rollRange(hpMin, hpMax),
    ac: rollRange(10, 18),
    personality: personality.traits,
    personalityDescription: personality.desc,
    voice,
    motivation,
    appearance,
    secret,
    quirk,
    faction,
    importance: importanceLevel,
    role: role || pick(['ally', 'neutral', 'neutral', 'enemy']),
    roleDescription: roleLabels[role] || null,
    questHook,
    relationshipSuggestion,
  };
}

// ─── 2. Quest Generator ──────────────────────────────────────────────────────

const QUEST_ARCHETYPES = {
  heist: {
    titles: [
      'The {LOCATION} Job', 'Breaking Into {LOCATION}', 'The {ITEM} Heist',
      'Stealing from {NPC}', 'One Last Score in {LOCATION}',
    ],
    descTemplates: [
      'A daring plan to infiltrate {LOCATION} and steal {ITEM} from under the nose of {NPC}. The crew must be assembled, the layout studied, and every contingency planned.',
      '{NPC} hires the party to recover {ITEM} from {LOCATION}. The catch: it is guarded by magical wards, loyal soldiers, and at least one {CREATURE}.',
    ],
    objectives: [
      'Scout the target location and map entry points',
      'Recruit or neutralize the inside contact',
      'Disable the magical wards or alarm systems',
      'Execute the heist during the distraction',
      'Escape with the prize before reinforcements arrive',
      'Fence the goods or deliver to the client',
    ],
    complications: [
      'A rival thief crew is planning the same heist',
      'The inside contact is a double agent',
      'The item is cursed and fights back when moved',
    ],
    twists: [
      'The item was already stolen and replaced with a forgery',
      'The client plans to betray the party after delivery',
      'The vault contains something far more dangerous than expected',
    ],
  },
  rescue: {
    titles: [
      'The Prisoner of {LOCATION}', 'Saving {NPC}', 'Into the {CREATURE}\'s Lair',
      'No One Left Behind', 'The Captives of {LOCATION}',
    ],
    descTemplates: [
      '{NPC} has been captured and taken to {LOCATION}. Time is running out — the captors plan to execute them at dawn unless the party intervenes.',
      'Villagers have been disappearing near {LOCATION}. Investigation reveals a {CREATURE} has been hoarding them in its lair for unknown purposes.',
    ],
    objectives: [
      'Learn where the captive is being held',
      'Infiltrate or assault the holding location',
      'Defeat or bypass the captors',
      'Free the prisoner and ensure their safety',
      'Escape before reinforcements arrive',
    ],
    complications: [
      'The captive has been brainwashed and resists rescue',
      'The prison is rigged to collapse if breached',
      'A hostage situation develops mid-rescue',
    ],
    twists: [
      'The captive went willingly and does not want to be saved',
      'The real prisoner is someone else entirely',
      'The captors are actually protecting the prisoner from something worse',
    ],
  },
  tournament: {
    titles: [
      'The Grand Tournament of {LOCATION}', 'Trial of Champions', 'The {NPC} Invitational',
      'Blood and Glory in {LOCATION}', 'The Arena of {LOCATION}',
    ],
    descTemplates: [
      'A grand tournament is being held in {LOCATION}, drawing warriors, mages, and rogues from across the realm. The prize: {ITEM} and an audience with {NPC}.',
      '{NPC} has organized a series of trials to find worthy champions. But the competition is fierce and not everyone is playing fair.',
    ],
    objectives: [
      'Register for the tournament and pass qualifying rounds',
      'Win or survive the combat bracket',
      'Uncover the cheating scheme in the competition',
      'Navigate the social politics between competitors',
      'Face the reigning champion in the final bout',
    ],
    complications: [
      'The tournament is rigged in favor of a noble\'s champion',
      'A competitor is secretly an assassin targeting another contestant',
      'The arena contains hidden traps activated between rounds',
    ],
    twists: [
      'The tournament is a front for recruiting soldiers for an illegal war',
      'The prize item is stolen property and its owner wants it back',
      'The final opponent is an old ally turned bitter rival',
    ],
  },
  curse_breaking: {
    titles: [
      'The Curse of {LOCATION}', 'Lifting {NPC}\'s Affliction', 'The {CREATURE}\'s Hex',
      'Unraveling the Blight', 'The Withering of {LOCATION}',
    ],
    descTemplates: [
      'A terrible curse has befallen {LOCATION}. Crops wither, children sicken, and shadows move on their own. {NPC} believes the source lies in the old {LOCATION} ruins.',
      '{NPC} has been cursed by a dying {CREATURE} and will perish within seven days unless the party can find the cure — a rare component found only in {LOCATION}.',
    ],
    objectives: [
      'Research the nature and origin of the curse',
      'Locate the cursed object or site',
      'Gather the components needed to break the curse',
      'Perform the ritual or destroy the source',
      'Deal with the entity that placed the curse',
    ],
    complications: [
      'Breaking the curse will transfer it to someone else',
      'A faction benefits from the curse and will fight to preserve it',
      'Each day the curse grows stronger and spreads further',
    ],
    twists: [
      'The curse is actually protecting the area from something worse',
      'The cursed person placed it on themselves deliberately',
      'The "cure" will unleash the sealed evil the curse was containing',
    ],
  },
  diplomacy: {
    titles: [
      'The {LOCATION} Accords', 'Brokering Peace', 'The Treaty of {LOCATION}',
      'War and Words', 'The Summit at {LOCATION}',
    ],
    descTemplates: [
      'Two factions are on the brink of war. {NPC} tasks the party with mediating a peace summit at {LOCATION}, but both sides have hidden agendas.',
      'The alliance between {LOCATION} and a neighboring power is fracturing. The party must navigate political intrigue to prevent a devastating conflict.',
    ],
    objectives: [
      'Meet with both faction leaders to understand their demands',
      'Uncover the hidden agenda sabotaging negotiations',
      'Find common ground or leverage for compromise',
      'Protect the delegates from assassination attempts',
      'Secure the signed accord and ensure both sides honor it',
    ],
    complications: [
      'An assassin targets a key delegate during talks',
      'A third faction is secretly manipulating both sides',
      'One side is negotiating in bad faith to buy time for mobilization',
    ],
    twists: [
      'The war is being engineered by a merchant guild profiting from arms sales',
      'The two leaders are secretly allied against the party\'s patron',
      'Peace would actually empower a tyrant — war might be the lesser evil',
    ],
  },
  sabotage: {
    titles: [
      'Dismantling {NPC}\'s Operation', 'The {LOCATION} Conspiracy', 'Behind Enemy Lines',
      'Burning It Down', 'Operation {ITEM}',
    ],
    descTemplates: [
      '{NPC} has built a dangerous operation in {LOCATION} that must be dismantled from within. The party must infiltrate, gather intelligence, and destroy the operation without being detected.',
      'An enemy faction is constructing a weapon of terrible power in {LOCATION}. The party must sabotage the project before it reaches completion.',
    ],
    objectives: [
      'Infiltrate the enemy operation under cover',
      'Map the facility and identify critical weaknesses',
      'Plant sabotage devices or poison supplies',
      'Extract or eliminate key personnel',
      'Escape before the destruction is discovered',
    ],
    complications: [
      'The party\'s cover identity is questioned by a suspicious officer',
      'An innocent workforce would be harmed by the sabotage',
      'The target has a fail-safe that could cause collateral damage',
    ],
    twists: [
      'The operation is actually a humanitarian project the patron lied about',
      'A party member has personal ties to someone inside',
      'The weapon is being built to fight a greater threat the patron is hiding',
    ],
  },
  infiltration: {
    titles: [
      'Inside {LOCATION}', 'The Masquerade at {LOCATION}', 'Among the {FACTION}',
      'Wolves in Sheep\'s Clothing', 'The Long Con',
    ],
    descTemplates: [
      'The party must go undercover inside {LOCATION} to gather intelligence on the {FACTION}. One wrong step and their cover is blown — along with any chance of escape.',
      'A masked ball at {LOCATION} provides the perfect cover. The party must mingle with the elite, steal documents from {NPC}\'s study, and slip out before midnight.',
    ],
    objectives: [
      'Establish a believable cover identity',
      'Gain entry to the target location or social circle',
      'Build trust with key insiders',
      'Access the restricted area or information',
      'Extract without compromising the mission',
    ],
    complications: [
      'Someone at the event recognizes a party member',
      'The target information is in a language no one speaks',
      'A rival spy is running their own operation at the same event',
    ],
    twists: [
      'The party was expected — it\'s a trap designed to feed them false intel',
      'The insider they cultivated is actually loyal to the enemy',
      'The intelligence reveals the party\'s own patron is corrupt',
    ],
  },
  mystery: {
    titles: [
      'The {LOCATION} Murders', 'Who Killed {NPC}?', 'The Vanishing of {LOCATION}',
      'Shadows Over {LOCATION}', 'The Unsolvable Case',
    ],
    descTemplates: [
      'A string of murders has shaken {LOCATION}. Each victim was found with a strange symbol carved into their palm. {NPC} begs the party to find the killer before they strike again.',
      'People in {LOCATION} are vanishing without a trace. No bodies, no witnesses, no clues — until the party discovers a hidden passage beneath the old {LOCATION} chapel.',
    ],
    objectives: [
      'Examine the crime scene for clues',
      'Interview witnesses and suspects',
      'Research the mysterious symbol or pattern',
      'Set a trap to catch the perpetrator',
      'Confront the culprit and bring them to justice',
    ],
    complications: [
      'The local guard is corrupt and covering for the killer',
      'Key evidence is destroyed or tampered with',
      'The primary suspect has an ironclad alibi',
    ],
    twists: [
      'The killer is someone the party trusts or has helped',
      'The victims are not dead — they\'ve been transported to another plane',
      'The murders are a ritual that will summon something terrible if completed',
    ],
  },
  escort: {
    titles: [
      'The Road to {LOCATION}', 'Guarding {NPC}', 'Safe Passage Through {LOCATION}',
      'The Caravan Job', 'Delivering {ITEM} to {LOCATION}',
    ],
    descTemplates: [
      '{NPC} must reach {LOCATION} alive, but every faction from bandits to bounty hunters wants them dead. The party must protect their charge across dangerous territory.',
      'A valuable shipment of {ITEM} must reach {LOCATION} before the festival. The roads are dangerous and time is short.',
    ],
    objectives: [
      'Plan the safest route to the destination',
      'Defend against ambushes on the road',
      'Keep morale high among the travelers',
      'Solve resource shortages (food, water, medicine)',
      'Deliver the charge safely to the destination',
    ],
    complications: [
      'The person being escorted has a death wish or keeps wandering off',
      'A mole in the caravan is feeding information to attackers',
      'A bridge or pass is destroyed, forcing a dangerous detour',
    ],
    twists: [
      'The escort is carrying a concealed weapon or fugitive in their luggage',
      'The destination has already fallen to the enemy',
      'The real threat is not on the road but waiting at the destination',
    ],
  },
  exploration: {
    titles: [
      'The Uncharted Depths of {LOCATION}', 'Mapping {LOCATION}', 'Beyond the Edge',
      'The Lost Expedition', 'Into the Unknown',
    ],
    descTemplates: [
      'A newly discovered entrance to {LOCATION} beckons. {NPC} funds an expedition to explore its depths, but previous teams never returned.',
      'Ancient maps suggest {LOCATION} holds the ruins of a civilization predating all known history. The party must venture into the unknown.',
    ],
    objectives: [
      'Equip and prepare for the expedition',
      'Navigate treacherous terrain or passages',
      'Document discoveries and map the area',
      'Survive encounters with native creatures',
      'Return with proof of what lies within',
    ],
    complications: [
      'Supplies are dwindling faster than expected',
      'The environment itself is hostile — poisonous air, unstable ground',
      'Another expedition is already inside and desperate',
    ],
    twists: [
      'The ruins are not abandoned — something intelligent lives here',
      'The expedition was a cover to retrieve a specific artifact the patron wants',
      'The exit has sealed behind the party',
    ],
  },
  defense: {
    titles: [
      'The Siege of {LOCATION}', 'Holding the Line', '{LOCATION}\'s Last Stand',
      'They Come at Dawn', 'Fortifying {LOCATION}',
    ],
    descTemplates: [
      'A horde of {CREATURE}s is marching on {LOCATION}. The party has three days to prepare defenses, rally the townsfolk, and hold the walls against an overwhelming force.',
      '{NPC} warns that {LOCATION} will be attacked by nightfall. There is no time to flee — the party must organize the defense.',
    ],
    objectives: [
      'Scout the approaching enemy and assess their strength',
      'Fortify weak points in the defenses',
      'Rally and organize civilian defenders',
      'Hold the walls during the assault',
      'Eliminate or route the enemy commander',
    ],
    complications: [
      'A traitor inside the walls opens a gate for the enemy',
      'The defenders\' morale breaks and some try to flee',
      'A second wave arrives from an unexpected direction',
    ],
    twists: [
      'The attackers are refugees fleeing something even worse',
      'The town was built on the enemy\'s sacred ground — they want it back',
      'The siege is a distraction while the real attack happens elsewhere',
    ],
  },
  retrieval: {
    titles: [
      'The Lost {ITEM}', 'Recovering the {ITEM}', '{NPC}\'s Legacy',
      'Treasure of {LOCATION}', 'The {ITEM} of {LOCATION}',
    ],
    descTemplates: [
      'The legendary {ITEM} was last seen in {LOCATION} before it fell to ruin. {NPC} believes it still lies within, guarded by ancient traps and a {CREATURE}.',
      '{NPC} has traced {ITEM} to the black market in {LOCATION}. Buying it is impossible — the party must find another way to reclaim it.',
    ],
    objectives: [
      'Research the item\'s last known location',
      'Travel to the site and gain entry',
      'Navigate traps and guardians',
      'Locate and secure the item',
      'Return the item to its rightful owner',
    ],
    complications: [
      'Multiple parties are searching for the same item',
      'The item is in pieces, scattered across multiple locations',
      'The guardian considers itself the rightful owner',
    ],
    twists: [
      'The item is sentient and has its own agenda',
      'Returning the item triggers a long-dormant magical effect',
      'The "rightful owner" plans to use it for terrible purposes',
    ],
  },
  hunt: {
    titles: [
      'The Hunt for the {CREATURE}', 'Trophy of {LOCATION}', 'Monster of {LOCATION}',
      'The Beast Below', 'Tracking the {CREATURE}',
    ],
    descTemplates: [
      'A {CREATURE} has been terrorizing the area around {LOCATION}. Bounty: substantial. The party must track it through its territory and put it down before it kills again.',
      '{NPC} wants the {CREATURE} alive for research. Capturing a deadly monster is far harder than killing one.',
    ],
    objectives: [
      'Gather information from survivors and witnesses',
      'Track the creature to its lair',
      'Prepare appropriate weapons and traps',
      'Engage and defeat (or capture) the creature',
      'Collect proof and claim the bounty',
    ],
    complications: [
      'The creature is far more intelligent than expected',
      'Locals worship the creature and oppose the hunt',
      'The creature has young that complicate a clean kill',
    ],
    twists: [
      'The creature is a transformed humanoid who can be saved',
      'It was released deliberately by someone who wants the area depopulated',
      'Killing it breaks a seal that was holding something worse at bay',
    ],
  },
  corruption: {
    titles: [
      'The Rot in {LOCATION}', 'Unmasking {NPC}', 'Cleaning House',
      'The {FACTION} Conspiracy', 'Justice for {LOCATION}',
    ],
    descTemplates: [
      'Something is rotten in {LOCATION}. {NPC} runs the city with an iron fist while publicly playing the benevolent leader. The party must gather evidence without being silenced.',
      'The {FACTION} has infiltrated every level of {LOCATION}\'s government. Exposing them means trusting no one — not even the quest giver.',
    ],
    objectives: [
      'Identify the extent of the corruption',
      'Gather concrete evidence without alerting the corrupt officials',
      'Find and protect whistleblowers',
      'Present evidence to an authority that can act',
      'Survive the inevitable retaliation',
    ],
    complications: [
      'The evidence is locked in a magically warded vault',
      'A key witness is assassinated before they can testify',
      'The party\'s patron turns out to be compromised too',
    ],
    twists: [
      'The corruption is the only thing preventing a worse faction from taking over',
      'The corrupt leader knows the party is investigating and has been feeding them false leads',
      'Exposing the truth would devastate innocent people who depend on the corrupt system',
    ],
  },
  divine: {
    titles: [
      'The Trial of {NPC}', 'Heaven\'s Demand', 'The Fallen Shrine of {LOCATION}',
      'Wrath of the Gods', 'The Sacred {ITEM}',
    ],
    descTemplates: [
      'A divine entity has tasked the party through {NPC} with a sacred quest: restore the {ITEM} to the shrine at {LOCATION} before a celestial alignment unleashes calamity.',
      'The gods have gone silent. Prayers go unanswered, clerics lose their power. {NPC} believes the answer lies in {LOCATION}, where the first temples were built.',
    ],
    objectives: [
      'Receive and interpret the divine mandate',
      'Undertake a pilgrimage to the sacred site',
      'Pass the trials of faith or worthiness',
      'Confront the desecrator or usurper',
      'Complete the ritual to restore divine favor',
    ],
    complications: [
      'A rival faith sends agents to stop the party',
      'The divine mandate conflicts with the party\'s morals',
      'The sacred site has been claimed by an undead army',
    ],
    twists: [
      'The "divine" messenger is actually a fiend in disguise',
      'Completing the quest empowers one god at the cost of another',
      'The gods went silent on purpose to test mortal self-reliance',
    ],
  },
};

/**
 * Generate a fully-formed quest with title, objectives, complications, and twist.
 * @param {Object} [options]
 * @param {'easy'|'medium'|'hard'|'deadly'} [options.difficulty]
 * @param {'combat'|'social'|'exploration'|'mystery'} [options.theme]
 * @param {number} [options.party_level]
 * @returns {Object} Complete quest object
 */
export function generateQuest(options = {}) {
  const { difficulty, theme, party_level } = options;

  const themeMap = {
    combat: ['hunt', 'defense', 'rescue', 'tournament'],
    social: ['diplomacy', 'corruption', 'infiltration', 'mystery'],
    exploration: ['exploration', 'retrieval', 'escort', 'curse_breaking'],
    mystery: ['mystery', 'corruption', 'curse_breaking', 'infiltration'],
  };

  const archetypeKeys = theme && themeMap[theme]
    ? themeMap[theme]
    : Object.keys(QUEST_ARCHETYPES);

  const archetypeKey = pick(archetypeKeys);
  const archetype = QUEST_ARCHETYPES[archetypeKey];

  const npcName = _nameForRace(pick(RACES)).full;
  const location = pick(LOCATION_NAMES_POOL);
  const item = pick(ITEMS_POOL);
  const creature = pick(CREATURES);
  const faction = pick(FACTIONS);

  const replacePlaceholders = (str) =>
    str
      .replace(/\{NPC\}/g, npcName)
      .replace(/\{LOCATION\}/g, location)
      .replace(/\{ITEM\}/g, item)
      .replace(/\{CREATURE\}/g, creature)
      .replace(/\{FACTION\}/g, faction);

  const title = replacePlaceholders(pick(archetype.titles));
  const description = replacePlaceholders(pick(archetype.descTemplates));
  const objectives = pickN(archetype.objectives, rollRange(3, 5));
  const complication = pick(archetype.complications);
  const twist = pick(archetype.twists);

  const diff = difficulty || pick(['easy', 'medium', 'medium', 'hard', 'deadly']);
  const lvl = party_level || rollRange(1, 15);
  const diffMult = { easy: 1, medium: 1.5, hard: 2.5, deadly: 4 };
  const xpBase = lvl * 100 * (diffMult[diff] || 1.5);
  const goldBase = lvl * 50 * (diffMult[diff] || 1.5);

  return {
    title,
    type: archetypeKey,
    description,
    objectives,
    difficulty: diff,
    estimatedSessions: diff === 'easy' ? rollRange(1, 2) : diff === 'deadly' ? rollRange(3, 6) : rollRange(2, 4),
    partyLevel: lvl,
    rewards: {
      xp: Math.round(xpBase / 50) * 50,
      gold: Math.round(goldBase / 10) * 10,
      items: Math.random() > 0.4 ? [pick(ITEMS_POOL)] : [],
    },
    complication,
    twist,
    keyNPC: npcName,
    keyLocation: location,
    keyCreature: creature,
    faction: Math.random() > 0.5 ? faction : null,
  };
}

// ─── 3. Location Generator ───────────────────────────────────────────────────

const LOCATION_TYPES = {
  tavern: {
    nameTemplates: [
      'The {ADJ} {ANIMAL}', 'The {ANIMAL} & {ANIMAL}', '{NPC}\'s Rest',
      'The Last Pint', 'The {ADJ} Flagon', 'The Wanderer\'s Hearth',
    ],
    atmospheres: [
      'Warm and smoky, with a crackling hearth and the smell of roasting meat.',
      'Rowdy and loud, packed wall to wall with off-duty soldiers.',
      'Eerily quiet for a tavern — the few patrons whisper and avoid eye contact.',
      'Cozy and inviting, with a halfling bard playing softly in the corner.',
    ],
    features: [
      'A mounted dragon skull above the fireplace (probably fake)',
      'A secret back room accessible through a rotating bookcase',
      'A chalkboard listing banned patrons — the list is very long',
      'A fighting pit in the cellar that operates after midnight',
      'A preserved monster trophy from the owner\'s adventuring days',
      'An enchanted mug that refills once per day',
    ],
    encounters: [
      'A bar brawl breaks out between two rival mercenary companies',
      'A cloaked stranger offers the party a suspiciously well-paying job',
      'The innkeeper asks for help dealing with a rat king in the cellar',
    ],
    secrets: [
      'The tavern sits above a sealed entrance to the underdark',
      'The owner is a retired assassin hiding from their former guild',
      'The house ale contains a mild charm enchantment for repeat business',
    ],
  },
  temple: {
    nameTemplates: [
      'The Shrine of {DEITY}', 'Temple of the {ADJ} {ELEMENT}', 'The {ADJ} Cathedral',
      'Sanctuary of {DEITY}', 'The Hallowed Spire', 'Chapel of Eternal {ELEMENT}',
    ],
    atmospheres: [
      'Incense hangs thick in the air, and chanting echoes from unseen depths.',
      'Sunlight streams through stained glass, casting prismatic patterns across the nave.',
      'Cold and austere, every surface bare stone — a place of penance, not comfort.',
    ],
    features: [
      'A healing font that works once per person per moon cycle',
      'Frescoes depicting a prophecy yet to be fulfilled',
      'An eternal flame that has never been extinguished in three centuries',
      'A confessional that magically compels truth within its walls',
      'A locked reliquary containing a saint\'s finger bone',
    ],
    encounters: [
      'A desperate person seeks sanctuary from pursuing guards',
      'An acolyte warns that the high priest has been acting strangely',
      'A funeral procession arrives — but the body is missing from the coffin',
    ],
    secrets: [
      'The temple was built atop a much older, darker shrine',
      'The high priest has lost their faith and is faking divine magic with arcane tricks',
      'A hidden vault beneath the altar holds a weapon meant to fight a god',
    ],
  },
  marketplace: {
    nameTemplates: [
      'The Grand Bazaar of {LOCATION}', '{LOCATION} Market Square', 'The {ADJ} Exchange',
      'Merchant\'s Row', 'The Crossroads Market', 'The Hawkers\' Maze',
    ],
    atmospheres: [
      'A riot of color and noise — merchants shout over each other while exotic spices perfume the air.',
      'Orderly stalls arranged in neat rows, overseen by stern guild inspectors.',
      'A shadowy night market illuminated by lanterns, where anything can be bought for the right price.',
    ],
    features: [
      'A fountain at the center where disputes are traditionally settled',
      'An auction house that sells confiscated contraband once a month',
      'A stall run by a kenku that perfectly mimics any buyer\'s voice',
      'A notice board covered in job postings, wanted posters, and coded messages',
      'A gnomish invention stall with unpredictable magical gadgets',
    ],
    encounters: [
      'A pickpocket targets the party — or is caught targeting someone else',
      'Two merchants are in a screaming match over a stall boundary dispute',
      'A rare item appears that a party member has been seeking',
    ],
    secrets: [
      'The market master runs a smuggling operation through the sewers beneath',
      'One stall is a front for a spy network exchanging coded messages',
      'An ancient artifact is being sold as junk at a random stall',
    ],
  },
  ruins: {
    nameTemplates: [
      'The Fallen Spire of {LOCATION}', 'Ruins of {LOCATION}', 'The Shattered Keep',
      'The {ADJ} Remnants', 'Echoes of {LOCATION}', 'The Sunken Citadel',
    ],
    atmospheres: [
      'Crumbling stone walls choked with ivy, every shadow hiding potential danger.',
      'An oppressive silence broken only by dripping water and distant rumbling.',
      'Surprisingly intact — as if the inhabitants left yesterday, not centuries ago.',
    ],
    features: [
      'A partially collapsed ceiling revealing the sky above',
      'Ancient murals still vivid despite centuries of neglect',
      'A functioning magical lock on a door with no visible handle',
      'Scorch marks on the walls consistent with dragonfire',
      'A throne room where spectral figures replay their final moments',
    ],
    encounters: [
      'A group of scavengers who arrived first and claim territorial rights',
      'An undead guardian that activates when certain rooms are entered',
      'A trapped spirit begging for release',
    ],
    secrets: [
      'The ruins were not destroyed from outside — the inhabitants did it themselves',
      'A hidden sub-level remains fully intact and operational',
      'The ruins are slowly rebuilding themselves when no one is watching',
    ],
  },
  forest_clearing: {
    nameTemplates: [
      'The {ADJ} Glade', 'The Whispering Clearing', '{DEITY}\'s Grove',
      'The Moonlit Circle', 'The Heart of the {ADJ} Wood', 'The Verdant Ring',
    ],
    atmospheres: [
      'Dappled sunlight filters through the canopy, and wildflowers carpet the ground.',
      'An unnatural silence — no birds, no insects, just the faint hum of magic.',
      'Mushroom rings dot the clearing, and the air feels thick with fey energy.',
    ],
    features: [
      'A massive ancient tree at the center, easily a thousand years old',
      'A natural spring of crystal-clear water with faintly magical properties',
      'Standing stones arranged in a deliberate pattern',
      'Claw marks on surrounding trees, each as high as a human is tall',
      'A fairy ring of phosphorescent mushrooms',
    ],
    encounters: [
      'A dryad appears and asks the party to resolve a dispute with loggers',
      'A wounded unicorn lies in the clearing, an arrow lodged in its flank',
      'A druid circle is performing a ritual and does not welcome interruption',
    ],
    secrets: [
      'The clearing is a portal to the Feywild that opens on solstices',
      'Something is buried beneath the great tree — roots grip it like fingers',
      'The clearing moves — it\'s never in the same place on any map',
    ],
  },
  cave: {
    nameTemplates: [
      'The Maw of {LOCATION}', 'The {ADJ} Caverns', 'The Howling Depths',
      'The {CREATURE}\'s Den', 'Caverns of {ADJ} Shadow', 'The Echoing Deep',
    ],
    atmospheres: [
      'Dripping stalactites and an oppressive darkness that swallows torchlight.',
      'Bioluminescent fungi cast an eerie blue-green glow over everything.',
      'Warm and sulfurous, as if the earth itself is breathing.',
    ],
    features: [
      'An underground lake of perfectly still, black water',
      'Crystal formations that hum at a specific pitch when touched',
      'Ancient cave paintings depicting creatures that should not exist',
      'A narrow squeeze passage that leads to a vast cathedral cavern',
      'A colony of bats so thick they darken the ceiling',
    ],
    encounters: [
      'A cave-in traps the party and they must find another exit',
      'A creature stalks the party from the darkness, never fully revealing itself',
      'An underground river suddenly rises, flooding the passages',
    ],
    secrets: [
      'The cave is actually the fossilized interior of an ancient leviathan',
      'A dwarven outpost deep within has been sealed for a century',
      'The crystals are eggs that will hatch in the coming weeks',
    ],
  },
  castle: {
    nameTemplates: [
      'Castle {LOCATION}', 'The Fortress of {NPC}', 'The {ADJ} Citadel',
      'Stronghold {LOCATION}', 'The Iron Keep', 'The Spire of {NPC}',
    ],
    atmospheres: [
      'Imposing stone walls and flying banners — a seat of power meant to intimidate.',
      'Crumbling grandeur, tapestries faded and halls echoing with memories of better days.',
      'A military fortress, efficient and spartan — every stone placed for defense.',
    ],
    features: [
      'A great hall with a table that seats a hundred',
      'A dungeon so deep that prisoners claim to hear the earth\'s heartbeat',
      'Murder holes and boiling oil channels in every corridor',
      'A library containing forbidden texts chained to their shelves',
      'A secret passage connecting the lord\'s chambers to the stables',
    ],
    encounters: [
      'A coup attempt occurs while the party is visiting',
      'The castle ghost appears with a warning',
      'A tournament is held to celebrate a noble event',
    ],
    secrets: [
      'The castle was built by a lich who is sealed in the foundation',
      'The lord has a doppelganger that takes their place during absences',
      'A hidden treasury accessible only by solving a riddle carved in the keep',
    ],
  },
  port: {
    nameTemplates: [
      '{LOCATION} Harbor', 'The {ADJ} Docks', 'Port {LOCATION}',
      'The Sailor\'s Landing', 'Tidegate', 'The Mariners\' Wharf',
    ],
    atmospheres: [
      'Salt air and the creak of rigging — ships jostle at anchor while dockworkers heave cargo.',
      'A seedy waterfront alive at night with gambling dens, flophouses, and smuggler\'s coves.',
      'A bustling commercial port with customs officers inspecting every crate.',
    ],
    features: [
      'A lighthouse with a magical beam visible for fifty miles',
      'A shipwreck bar built into the hull of a beached galleon',
      'A harbor master\'s tower with a spyglass that sees through fog',
      'Fishmonger stalls selling catches from uncharted waters',
      'A dry dock where a warship is being secretly constructed',
    ],
    encounters: [
      'A ship arrives flying no colors with an unconscious crew',
      'Press gangs are forcibly recruiting sailors from the docks',
      'A sea monster surfaces in the harbor, disrupting all trade',
    ],
    secrets: [
      'The port is built over a submerged temple to a forgotten sea god',
      'The harbor master is paid by pirates to look the other way',
      'Something massive has been circling the harbor at night',
    ],
  },
  village: {
    nameTemplates: [
      '{LOCATION} Village', 'The Hamlet of {LOCATION}', '{ADJ} Hollow',
      '{LOCATION} Crossing', 'The Settlement at {LOCATION}', '{LOCATION} Green',
    ],
    atmospheres: [
      'Quiet and pastoral — thatched roofs, a village green, and the distant lowing of cattle.',
      'Tense and fearful — shuttered windows, suspicious glances, and a dusk curfew.',
      'Vibrant and welcoming — a festival is underway with music, food, and laughter.',
    ],
    features: [
      'A well at the village center said to grant wishes (it doesn\'t, usually)',
      'A massive old oak where the elders hold council',
      'A communal longhouse where travelers are always welcome',
      'Scarecrows in the fields that look unsettlingly lifelike',
      'A smithy that produces weapons of surprising quality for such a small place',
    ],
    encounters: [
      'Villagers plead for help with a local problem they cannot solve alone',
      'A traveling merchant has been accused of theft and the village wants justice',
      'Children lead the party to something strange they found in the woods',
    ],
    secrets: [
      'The village elders made a pact with a dark power to ensure good harvests',
      'Everyone in the village shares a recurring nightmare they refuse to discuss',
      'The village sits on a ley line nexus of enormous magical potential',
    ],
  },
  underground_city: {
    nameTemplates: [
      'The Under-realm of {LOCATION}', '{LOCATION} Below', 'The Deep Warrens',
      'The Hollow City', 'The Sunless Sprawl', '{LOCATION} Underhome',
    ],
    atmospheres: [
      'Vast cavern ceilings glittering with mineral deposits, streets lit by phosphorescent lanterns.',
      'Cramped tunnels open into pocket neighborhoods carved from living rock.',
      'Industrial and loud — forges burn day and night, and the air tastes of metal.',
    ],
    features: [
      'A fungal garden that provides food for the entire populace',
      'A great forge powered by a lava flow',
      'An underground river used as a highway for boat traffic',
      'Crystal spires that serve as both buildings and light sources',
      'A sealed district that no one enters, roped off with warning signs',
    ],
    encounters: [
      'A cave-in threatens an entire district and evacuation is underway',
      'Tensions between surface visitors and locals reach a boiling point',
      'A creature from deeper underground breaches the lowest level',
    ],
    secrets: [
      'The city was built as a prison for something sealed even deeper below',
      'The ruling council is entirely comprised of doppelgangers',
      'The city is slowly sinking and leadership is hiding this fact',
    ],
  },
  wizard_tower: {
    nameTemplates: [
      'The Tower of {NPC}', 'The {ADJ} Spire', '{NPC}\'s Observatory',
      'The Arcane Pinnacle', 'The {ELEMENT} Tower', 'The Sapphire Needle',
    ],
    atmospheres: [
      'Every surface hums with latent magic — books float, stairs rearrange, and the walls change color.',
      'Cluttered and chaotic, as if a magical hurricane passed through every room.',
      'Pristine and organized to an obsessive degree — everything labeled and categorized.',
    ],
    features: [
      'A telescope that shows other planes of existence',
      'An animated suit of armor that serves as doorman and bouncer',
      'A room where gravity is reversed',
      'Shelves of preserved specimens in glowing jars',
      'A permanent teleportation circle in the basement',
    ],
    encounters: [
      'A summoning experiment has gone wrong and something is loose',
      'The wizard is trapped in a painting and needs help escaping',
      'Rival wizards arrive simultaneously demanding the same rare book',
    ],
    secrets: [
      'The tower exists in a pocket dimension and the "outside" is an illusion',
      'The wizard is actually a collective of three minds sharing one body',
      'The tower\'s foundations are a bound elemental that will eventually break free',
    ],
  },
  prison: {
    nameTemplates: [
      'The {ADJ} Gaol', '{LOCATION} Penitentiary', 'The Ironbound Prison',
      'The Pit of {LOCATION}', 'Debtors\' Hold', 'The Chains of {NPC}',
    ],
    atmospheres: [
      'Cold iron, flickering torches, and the distant echo of chains rattling.',
      'Surprisingly well-maintained — the warden takes perverse pride in their domain.',
      'Overcrowded and desperate — inmates beg through every barred window.',
    ],
    features: [
      'An anti-magic field that covers the entire facility',
      'A solitary confinement cell said to drive inmates mad within days',
      'An exercise yard where gangs mark their territory',
      'Guard rotations that are predictable enough to exploit',
      'A chapel where the chaplain hears confessions and trades favors',
    ],
    encounters: [
      'A prison riot erupts and the party is caught in the middle',
      'An innocent prisoner begs the party to carry a message outside',
      'A notorious criminal offers vital information in exchange for help escaping',
    ],
    secrets: [
      'The warden sells prisoners to a flesh golem creator',
      'A tunnel system connects the prison to the city sewers',
      'One of the "prisoners" is actually the true heir to the throne',
    ],
  },
  shrine: {
    nameTemplates: [
      'The {ADJ} Shrine', 'Shrine of the {ELEMENT}', 'The Pilgrim\'s Rest',
      'The Roadside Altar', 'The Standing Stone of {LOCATION}', '{DEITY}\'s Mark',
    ],
    atmospheres: [
      'Small and intimate, draped with wilting flowers and burning candles.',
      'Ancient and weathered, half-reclaimed by nature but still radiating power.',
      'Recently desecrated — offerings scattered, symbols defaced.',
    ],
    features: [
      'A prayer stone worn smooth by thousands of hands',
      'Offering bowls that have never been looted despite being unguarded',
      'Carvings in a language that predates common',
      'A small reflecting pool that sometimes shows things other than your reflection',
      'Wind chimes that ring in patterns no natural wind could create',
    ],
    encounters: [
      'A pilgrim is injured on the road near the shrine and needs aid',
      'A fanatical cultist is trying to rededicate the shrine to a dark power',
      'An answer to a prayer manifests in an unexpected way',
    ],
    secrets: [
      'The shrine marks the grave of a powerful entity, not a deity',
      'Prayers spoken here are intercepted by something pretending to be the god',
      'The shrine is one of many forming a vast magical ward across the region',
    ],
  },
  guild_hall: {
    nameTemplates: [
      'The {FACTION} Hall', 'Hall of the {ADJ} Order', 'The Guildhouse',
      '{FACTION} Headquarters', 'The Chapter House', 'Lodge of the {ADJ}',
    ],
    atmospheres: [
      'Busy and professional — members come and go on various assignments.',
      'Exclusive and guarded — non-members are watched with suspicion.',
      'Festive — a celebration of a recent guild achievement is underway.',
    ],
    features: [
      'A job board with tasks ranked by difficulty and pay',
      'A trophy hall displaying relics from famous past missions',
      'Private meeting rooms available for hire',
      'A training yard where members spar and practice',
      'A vault of confiscated contraband',
    ],
    encounters: [
      'A ranking member challenges the party to prove their worth',
      'An internal power struggle is playing out in faction politics',
      'A disgraced former member warns the party about the guild\'s true nature',
    ],
    secrets: [
      'The guild is a front for an intelligence agency',
      'The founding charter contains a clause that could dissolve the guild if found',
      'The guild leader reports to a shadowy benefactor no one has ever met',
    ],
  },
  battlefield: {
    nameTemplates: [
      'The Fields of {LOCATION}', 'The {ADJ} Battleground', '{LOCATION} Front',
      'The Killing Fields', 'The Last Stand at {LOCATION}', '{ADJ} Crossing',
    ],
    atmospheres: [
      'Scarred earth, shattered weapons, and the faint smell of old death that never quite leaves.',
      'Fresh from battle — smoke rises, the wounded cry out, and scavengers circle overhead.',
      'Overgrown and peaceful now, but the land occasionally yields bones and broken swords.',
    ],
    features: [
      'A mass grave marked by a simple stone monument',
      'Siege weapons left to rust where they fell',
      'A command tent still standing, maps and plans scattered within',
      'Trenches and fortifications that could be repurposed',
      'A memorial where locals leave flowers and offerings',
    ],
    encounters: [
      'Restless spirits of fallen soldiers rise at dusk seeking closure',
      'Looters are desecrating the dead and stealing from the fallen',
      'A survivor is found alive in the wreckage, wounded and delirious',
    ],
    secrets: [
      'The battle was decided by a hidden magical weapon that was never recovered',
      'One side used necromancy to bolster their ranks — evidence is buried here',
      'A sealed vault beneath the command tent holds the real reason the war started',
    ],
  },
};

const LOC_ADJECTIVES = [
  'Golden','Silver','Crimson','Shadow','Whispering','Broken','Gilded','Emerald',
  'Amber','Obsidian','Ivory','Iron','Sapphire','Rusted','Hollow','Ancient',
  'Frozen','Burning','Silent','Forgotten','Cursed','Blessed','Wild','Sunken'
];

const LOC_ANIMALS = [
  'Stag','Raven','Wolf','Dragon','Bear','Fox','Serpent','Griffin','Eagle','Boar',
  'Owl','Lion','Hawk','Badger','Hound','Crane','Crow','Toad','Hare','Pike'
];

const LOC_DEITIES = [
  'Pelor','Bahamut','Moradin','Selune','Kelemvor','Lathander','Mystra','Tymora',
  'Helm','Ilmater','Silvanus','Tempus','Sune','Oghma','Chauntea'
];

const LOC_ELEMENTS = [
  'Flame','Frost','Storm','Shadow','Light','Stone','Wind','Water',
  'Thunder','Stars','Moon','Sun','Dawn','Dusk','Night'
];

/**
 * Generate a fully-formed location with atmosphere, features, encounters, and secrets.
 * @param {Object} [options]
 * @param {'urban'|'wilderness'|'underground'|'coastal'} [options.setting]
 * @param {'low'|'medium'|'high'} [options.danger_level]
 * @returns {Object} Complete location object
 */
export function generateLocation(options = {}) {
  const { setting, danger_level } = options;

  const settingMap = {
    urban: ['tavern', 'temple', 'marketplace', 'castle', 'guild_hall', 'prison'],
    wilderness: ['forest_clearing', 'cave', 'ruins', 'village', 'battlefield', 'shrine'],
    underground: ['cave', 'underground_city', 'ruins', 'prison'],
    coastal: ['port', 'cave', 'ruins', 'village', 'tavern'],
  };

  const typeKeys = setting && settingMap[setting]
    ? settingMap[setting]
    : Object.keys(LOCATION_TYPES);

  const typeKey = pick(typeKeys);
  const locType = LOCATION_TYPES[typeKey];

  const nameTemplate = pick(locType.nameTemplates);
  const name = nameTemplate
    .replace(/\{ADJ\}/g, pick(LOC_ADJECTIVES))
    .replace(/\{ANIMAL\}/g, pick(LOC_ANIMALS))
    .replace(/\{NPC\}/g, _nameForRace(pick(RACES)).first)
    .replace(/\{LOCATION\}/g, pick(LOCATION_NAMES_POOL))
    .replace(/\{CREATURE\}/g, pick(CREATURES))
    .replace(/\{DEITY\}/g, pick(LOC_DEITIES))
    .replace(/\{ELEMENT\}/g, pick(LOC_ELEMENTS))
    .replace(/\{FACTION\}/g, pick(FACTIONS));

  const atmosphere = pick(locType.atmospheres);
  const features = pickN(locType.features, rollRange(3, 5));
  const encounters = pickN(locType.encounters, rollRange(1, 3));
  const secrets = pickN(locType.secrets, rollRange(1, 2));

  // Generate 1-2 resident NPCs
  const residentNPCs = Array.from({ length: rollRange(1, 2) }, () => {
    const r = pick(RACES);
    const n = _nameForRace(r);
    return { name: n.full, race: r, role: pick(OCCUPATIONS) };
  });

  return {
    name,
    type: typeKey.replace(/_/g, ' '),
    description: `${atmosphere} This ${typeKey.replace(/_/g, ' ')} is known for its distinct character and has drawn the attention of many over the years.`,
    atmosphere,
    features,
    encounters,
    secrets,
    residentNPCs,
    dangerLevel: danger_level || pick(['low', 'medium', 'medium', 'high']),
  };
}

// ─── 4. Lore Entry Generator ─────────────────────────────────────────────────

const LORE_CATEGORIES = {
  legend: {
    titles: [
      'The Legend of {NPC} the {ADJ}', 'The {ADJ} Hero of {LOCATION}',
      'The Ballad of the {ITEM}', 'When {NPC} Walked Among Mortals',
      'The Saga of {LOCATION}\'s Champion',
    ],
    bodies: [
      'Long ago, {NPC} rose from humble origins in {LOCATION} to become the greatest champion the realm had ever known. Armed with {ITEM}, they faced the {CREATURE} of {LOCATION2} and emerged victorious — but the cost was devastating. To this day, travelers claim to see {NPC}\'s spirit walking the old roads at dusk.',
      'The people of {LOCATION} still tell the story of {NPC}, who single-handedly held the bridge at {LOCATION2} for three days against an army. When reinforcements finally arrived, they found {NPC} standing among the fallen, {ITEM} still clutched in hand. Whether {NPC} survived is a matter of heated debate in every tavern.',
      'It is said that {NPC} discovered {ITEM} in the depths of {LOCATION} and used its power to reshape the very land. Mountains moved, rivers changed course, and {LOCATION2} was founded on the site of the miracle. But power corrupts, and the legend ends in tragedy.',
    ],
  },
  prophecy: {
    titles: [
      'The {ADJ} Prophecy', 'The Foretelling of {LOCATION}\'s Doom',
      'Words of the Last Oracle', 'The Sealed Verse', 'The {CREATURE} Prophecy',
    ],
    bodies: [
      '*When the {ADJ} star rises over {LOCATION}, and the {CREATURE} stirs in its ancient sleep, a bearer of {ITEM} shall stand at the crossroads of fate. Three choices lie before them: the path of mercy, the path of justice, and the path of blood. Only one leads to dawn.* This prophecy was spoken by the Oracle of {LOCATION2} three centuries ago and has been debated by scholars ever since.',
      '*The {ADJ} seal shall break when {LOCATION} falls silent, and from the depths shall rise what was buried in shame. Only the one who carries {ITEM} and speaks the true name of {NPC} shall turn the tide.* Found inscribed on a tablet in the ruins of {LOCATION2}, this prophecy may be nearing fulfillment.',
      '*Five signs shall herald the age of {ADJ} reckoning: the river of {LOCATION} runs backward, a {CREATURE} speaks in mortal tongue, {ITEM} surfaces from the deep, the moon turns crimson for three nights, and a child is born with the mark of {NPC}.* The first three signs have already occurred.',
    ],
  },
  historical_event: {
    titles: [
      'The Fall of {LOCATION}', 'The {ADJ} Uprising', 'The Treaty of {LOCATION}',
      'The Great {ADJ} Plague', 'The Founding of {LOCATION}',
    ],
    bodies: [
      'In the year of the {ADJ} Moon, the city of {LOCATION} fell to an assault led by {NPC}. The siege lasted forty days and resulted in the destruction of the Great Library, the loss of {ITEM}, and the displacement of thousands. The event reshaped the political landscape of the region for generations.',
      'The {ADJ} Uprising began as a simple tax protest in {LOCATION} but escalated into a full rebellion when {NPC} rallied the common folk against the ruling class. The conflict lasted two years and ended with the Treaty of {LOCATION2}, which established the rights of commoners but left deep scars that persist today.',
      'The founding of {LOCATION} is attributed to {NPC}, who led a band of refugees from the destruction of {LOCATION2}. They carried with them {ITEM}, the last relic of their homeland, and used its power to establish a ward that has protected the settlement ever since.',
    ],
  },
  faction_history: {
    titles: [
      'The Origin of the {FACTION}', 'The {FACTION}: A History',
      'Rise of the {FACTION}', 'The {FACTION} Schism',
      'The Secret Charter of the {FACTION}',
    ],
    bodies: [
      'The {FACTION} was founded by {NPC} in the aftermath of the {ADJ} War. Originally a mutual aid society for veterans, it evolved into a powerful organization with interests spanning {LOCATION} and beyond. Their symbol, derived from {ITEM}, is recognized and feared throughout the realm.',
      'For centuries, the {FACTION} operated in secret from their base beneath {LOCATION}. Their mission: to safeguard {ITEM} and prevent the return of the {CREATURE}. But a schism fifty years ago split the order in two, and both halves now claim to be the true inheritors of the founding mandate.',
      'The {FACTION} began as a trade guild in {LOCATION} but quickly expanded into politics, espionage, and — some whisper — assassination. {NPC} transformed the organization from a merchants\' association into the most powerful shadow network in the region.',
    ],
  },
  artifact_origin: {
    titles: [
      'The Forging of {ITEM}', 'Origin of {ITEM}', 'The {ADJ} Relic',
      '{ITEM}: A Scholar\'s Account', 'The Truth About {ITEM}',
    ],
    bodies: [
      '{ITEM} was forged in {LOCATION} by the legendary artificer {NPC} during the height of the {ADJ} Age. The process required the heart of a {CREATURE}, a shard of starfall iron, and — most troublingly — a willing sacrifice. The artifact has changed hands dozens of times since, and each wielder has met a different but equally dramatic end.',
      'Scholars debate whether {ITEM} was created by mortal hands at all. Found in the ruins of {LOCATION}, it predates all known civilizations and bears inscriptions in no identifiable language. {NPC} spent a lifetime studying it and concluded that it originated on another plane entirely.',
      'The creation of {ITEM} was an accident. {NPC} was attempting to bind a {CREATURE} in {LOCATION} when the ritual went catastrophically wrong. The resulting explosion fused raw magic into physical form, creating an object of immense power. {NPC} sealed it away, but it has a way of resurfacing.',
    ],
  },
  creation_myth: {
    titles: [
      'How the {ADJ} World Began', 'The First Dawn', 'The Dream of {DEITY}',
      'The Weaving of {LOCATION}', 'Before There Was Light',
    ],
    bodies: [
      'In the time before time, there was only the Void and the Dream. From the Dream arose {DEITY}, who spoke the first word and from that word came {LOCATION} — the first land. {DEITY} shaped the mountains from loneliness, filled the seas with tears of joy, and breathed life into clay to create the first mortals.',
      'The world was woven on a great loom by {DEITY}, each thread a life, each knot an event. The {ADJ} threads form the mountains, the silver threads the rivers. When a thread is cut, a life ends. When a thread is tangled, calamity strikes. And somewhere, it is said, the edge of the weaving is fraying.',
      'Before the gods, there were the Titans — vast beings of elemental fury. They warred endlessly until {DEITY} arose and imposed order. The Titans were bound: one became {LOCATION}\'s mountains, another its seas, a third its deep earth. Their dreams still shape reality, and their stirring causes earthquakes and storms.',
    ],
  },
  curse_origin: {
    titles: [
      'The Curse of {LOCATION}', 'How {NPC} Was Damned', 'The {ADJ} Blight',
      'The Price of Hubris', 'The {CREATURE}\'s Grudge',
    ],
    bodies: [
      '{NPC} brought the curse upon {LOCATION} through a single act of hubris: they defied {DEITY} by claiming {ITEM} for mortal use. In punishment, the land itself was blighted. Crops fail, water turns bitter, and every seventh child is born with the mark. The curse can only be broken by returning {ITEM} to its shrine.',
      'The {ADJ} Curse of {LOCATION} dates back to a betrayal. {NPC} murdered their sworn companion to claim {ITEM}, and with their dying breath, the victim called upon a {CREATURE} to exact vengeance. The curse has spread through the bloodline for twelve generations.',
      'No one remembers what caused the curse on {LOCATION}, and that is by design. The curse itself erases knowledge of its origin from the minds of those who learn it. Only {ITEM}, hidden somewhere in {LOCATION}, contains the record of what happened — and the key to ending it.',
    ],
  },
  war_chronicle: {
    titles: [
      'Chronicle of the {ADJ} War', 'The {LOCATION} Campaign', 'Blood and Iron',
      'The War of {ADJ} Succession', 'The {CREATURE} Incursion',
    ],
    bodies: [
      'The {ADJ} War raged for seven years across {LOCATION} and {LOCATION2}. It began when {NPC} assassinated the High Sovereign and seized {ITEM} as a symbol of authority. The resulting conflict drew in every faction in the region. The war ended not with victory but exhaustion — both sides collapsed and a fragile peace was brokered by the {FACTION}.',
      'When the {CREATURE}s poured through the breach at {LOCATION}, no army was prepared. The first three frontier towns fell in a day. It took {NPC} rallying the scattered forces at {LOCATION2} to mount a real defense. The war lasted only two months but cost more lives than any conflict in a century.',
      'The War of {ADJ} Succession tore {LOCATION} apart. Three claimants to the throne, each backed by a different faction, plunged the realm into chaos. {NPC} emerged as the ultimate victor, wielding {ITEM} to break the final siege, but ruled over a kingdom of ashes.',
    ],
  },
  divine_intervention: {
    titles: [
      'When {DEITY} Walked the Earth', 'The Miracle of {LOCATION}',
      'Divine Wrath at {LOCATION}', 'The {ADJ} Blessing', 'The Silence of the Gods',
    ],
    bodies: [
      'The Miracle of {LOCATION} occurred during the darkest hour of the {ADJ} Plague. When all hope was lost, {DEITY} manifested in the central square and healed every afflicted soul with a single gesture. But the miracle came with a price: {DEITY} has not answered prayers from {LOCATION} since.',
      'Divine wrath descended on {LOCATION} when its people turned to worship of the {CREATURE}. {DEITY} struck the temple with a bolt of celestial fire and sealed the ground with holy wards. The crater remains to this day, and nothing will grow within it.',
      'For thirty days, no god answered any prayer across the entire realm. Clerics lost their power, paladins their oaths. When divine magic returned, it was changed — weaker in some ways, stranger in others. Scholars call this the {ADJ} Silence, and no deity has ever explained why it happened.',
    ],
  },
  planar_event: {
    titles: [
      'The {ADJ} Convergence', 'When the Planes Collided', 'The Rift at {LOCATION}',
      'The {ADJ} Incursion', 'Beyond the Veil at {LOCATION}',
    ],
    bodies: [
      'The {ADJ} Convergence happens once every thousand years, when the barriers between planes thin to nothing. During the last convergence at {LOCATION}, creatures from the Feywild, Shadowfell, and Elemental Planes walked the material world for seven days. {NPC} sealed the rifts using {ITEM}, but some entities never returned to their home planes.',
      'A permanent rift to the {ADJ} Plane opened at {LOCATION} fifty years ago and has never closed. The surrounding area has been transformed — reality itself bends near the rift. {NPC} and the {FACTION} maintain a quarantine perimeter, but things still slip through.',
      'When {NPC} attempted to use {ITEM} to open a portal to the {ADJ} Plane at {LOCATION}, the ritual tore a wound in reality itself. The wound healed, but not cleanly — the area now exists partially in two planes at once, shifting unpredictably between them.',
    ],
  },
};

/**
 * Generate a lore entry with full markdown body and related entities.
 * @param {Object} [options]
 * @param {string} [options.category] - One of the lore category keys
 * @param {'heroic'|'tragic'|'mysterious'|'dark'} [options.tone]
 * @returns {Object} Complete lore entry
 */
export function generateLoreEntry(options = {}) {
  const { category, tone } = options;

  const catKeys = Object.keys(LORE_CATEGORIES);
  const catKey = category && LORE_CATEGORIES[category] ? category : pick(catKeys);
  const cat = LORE_CATEGORIES[catKey];

  const npc = _nameForRace(pick(RACES)).full;
  const location1 = pick(LOCATION_NAMES_POOL);
  const location2 = pick(LOCATION_NAMES_POOL.filter(l => l !== location1));
  const item = pick(ITEMS_POOL);
  const creature = pick(CREATURES);
  const faction = pick(FACTIONS);
  const deity = pick(LOC_DEITIES);
  const adj = pick(LOC_ADJECTIVES);

  const replace = (str) =>
    str
      .replace(/\{NPC\}/g, npc)
      .replace(/\{LOCATION2\}/g, location2)
      .replace(/\{LOCATION\}/g, location1)
      .replace(/\{ITEM\}/g, item)
      .replace(/\{CREATURE\}/g, creature)
      .replace(/\{FACTION\}/g, faction)
      .replace(/\{DEITY\}/g, deity)
      .replace(/\{ADJ\}/g, adj);

  const title = replace(pick(cat.titles));
  const body = replace(pick(cat.bodies));

  const tonePrefix = {
    heroic: 'This tale speaks of courage and triumph, inspiring all who hear it.',
    tragic: 'This is a story of loss and sacrifice, a cautionary tale passed down through generations.',
    mysterious: 'Much about this account remains uncertain, shrouded in contradictions and half-truths.',
    dark: 'This is not a story told to children. It speaks of horrors best left forgotten.',
  };

  const timePeriods = [
    'The Age of Myths', 'The First Era', 'The Age of Expansion', 'The Dark Century',
    'The Golden Age', 'Three centuries ago', 'Within living memory', 'The Founding Era',
    'The Age of Strife', 'The Planar Convergence Era', 'The Long Winter'
  ];

  const fullBody = tone && tonePrefix[tone]
    ? `*${tonePrefix[tone]}*\n\n${body}`
    : body;

  return {
    title,
    category: catKey.replace(/_/g, ' '),
    body: fullBody,
    relatedEntities: {
      npcs: [npc],
      locations: [location1, location2],
      items: [item],
      creatures: [creature],
      factions: [faction],
    },
    timePeriod: pick(timePeriods),
    tone: tone || pick(['heroic', 'tragic', 'mysterious', 'dark']),
  };
}

// ─── 5. Encounter Generator ──────────────────────────────────────────────────

const ENCOUNTER_SCENARIOS = [
  {
    type: 'ambush',
    setup: 'The party is traveling when enemies spring from concealment on all sides.',
    challenges: ['Surrounded with limited cover', 'Enemies have high ground', 'Escape routes are cut off'],
    outcomes: ['Fight through and loot the ambushers', 'Negotiate a toll or surrender valuables', 'Flee and lose supplies in the chaos'],
  },
  {
    type: 'chase',
    setup: 'The party must pursue (or flee from) a target through difficult terrain.',
    challenges: ['Obstacles require Athletics/Acrobatics checks', 'Bystanders get in the way', 'The terrain shifts dangerously'],
    outcomes: ['Catch the target after a harrowing pursuit', 'Lose the target but find a clue they dropped', 'The chase leads into a trap'],
  },
  {
    type: 'puzzle room',
    setup: 'The party enters a chamber where the exits seal and a puzzle must be solved to proceed.',
    challenges: ['Pressure plates trigger hazards for wrong answers', 'The puzzle has a time limit', 'Components are missing and must be found in the room'],
    outcomes: ['Solve the puzzle and claim a hidden reward', 'Brute-force the mechanism but trigger a penalty', 'Find a bypass the original builders left'],
  },
  {
    type: 'social confrontation',
    setup: 'A heated argument or accusation forces the party to use words instead of weapons.',
    challenges: ['The crowd is hostile and easily swayed', 'Evidence supports the wrong side', 'A key witness is lying'],
    outcomes: ['Win the argument and gain an ally', 'Lose face but learn valuable information', 'The confrontation escalates to violence'],
  },
  {
    type: 'environmental hazard',
    setup: 'Natural forces threaten the party — a collapsing cave, rising floodwater, volcanic tremors, or a blizzard.',
    challenges: ['Visibility drops to near zero', 'The ground is unstable', 'Exposure causes exhaustion over time'],
    outcomes: ['Find shelter and wait it out safely', 'Push through and arrive exhausted but alive', 'Discover something revealed by the disaster'],
  },
  {
    type: 'moral dilemma',
    setup: 'The party faces a choice with no good answer — both options have serious consequences.',
    challenges: ['Saving one group means abandoning another', 'The "right" choice benefits the enemy', 'A party member has a personal stake'],
    outcomes: ['Choose and live with the consequences', 'Find a creative third option (very hard DC)', 'Refuse to choose and face both consequences'],
  },
  {
    type: 'trap gauntlet',
    setup: 'A corridor or chamber is filled with overlapping traps that must be navigated.',
    challenges: ['Traps reset after being triggered', 'Disabling one trap activates another', 'The floor itself is a pressure plate'],
    outcomes: ['Navigate without triggering anything', 'Trigger traps but survive with clever use of abilities', 'Find the builder\'s safe path hidden in the walls'],
  },
  {
    type: 'rival party',
    setup: 'Another adventuring party is after the same objective and reaches it simultaneously.',
    challenges: ['They have complementary strengths to the party', 'They offer to team up but plan to betray', 'They have information the party lacks'],
    outcomes: ['Form a genuine alliance and share the reward', 'Outmaneuver them through guile', 'A fight breaks out over the prize'],
  },
  {
    type: 'wounded creature',
    setup: 'The party encounters a powerful creature that is injured and vulnerable.',
    challenges: ['Helping it may be dangerous — it is still powerful', 'Something wounded it and may return', 'The creature does not trust humanoids'],
    outcomes: ['Heal it and gain a powerful ally or mount', 'Put it down humanely and harvest components', 'The creature\'s attacker arrives mid-treatment'],
  },
  {
    type: 'mysterious merchant',
    setup: 'A merchant appears in an impossible location, offering remarkable wares.',
    challenges: ['Prices are steep or require unusual payment', 'Some items have hidden curses', 'The merchant knows things they shouldn\'t'],
    outcomes: ['Buy something that changes the campaign', 'Decline and the merchant vanishes forever', 'Discover the merchant is not mortal'],
  },
  {
    type: 'planar rift',
    setup: 'A tear in reality opens nearby, leaking creatures and energy from another plane.',
    challenges: ['The rift warps magic in the area', 'Extraplanar creatures pour through', 'Getting too close risks being pulled in'],
    outcomes: ['Close the rift using a skill challenge', 'Enter the rift and deal with the source', 'The rift stabilizes into a permanent portal'],
  },
  {
    type: 'undead uprising',
    setup: 'The dead rise from their graves in a sudden, localized necromantic event.',
    challenges: ['The undead are former allies or loved ones', 'The source of the necromancy is hidden', 'Destroyed undead reanimate after one round'],
    outcomes: ['Destroy the phylactery or necromantic focus', 'Hold out until dawn breaks the magic', 'Discover the undead were raised to deliver a warning'],
  },
  {
    type: 'bar brawl',
    setup: 'A tavern erupts into a chaotic fistfight — the party is caught in the middle.',
    challenges: ['Nonlethal combat only (guards will arrest killers)', 'Allies and enemies are hard to tell apart', 'The furniture is breaking apart and becoming improvised weapons'],
    outcomes: ['Win the brawl and earn respect', 'Slip out during the chaos with valuable intel', 'Get arrested and must talk their way out'],
  },
  {
    type: 'gladiator arena',
    setup: 'The party is thrust into an arena combat — voluntarily or as prisoners.',
    challenges: ['The terrain changes between rounds', 'The crowd can be swayed to help or hinder', 'The final opponent has an unfair advantage'],
    outcomes: ['Win and earn freedom, glory, or a patron', 'Throw the fight to gain a specific audience', 'Stage a dramatic escape mid-fight'],
  },
  {
    type: 'heist complication',
    setup: 'Mid-heist, something goes wrong and the party must adapt on the fly.',
    challenges: ['The alarm has been raised', 'A vault has an unexpected guardian', 'The target has been moved'],
    outcomes: ['Improvise and complete the heist anyway', 'Abort and escape with partial loot', 'Get caught but negotiate from a position of knowledge'],
  },
  {
    type: 'natural disaster',
    setup: 'An earthquake, flood, or wildfire strikes with no warning.',
    challenges: ['Civilians need rescuing', 'Infrastructure collapse blocks paths', 'A secondary danger is revealed by the disaster'],
    outcomes: ['Save everyone and become local heroes', 'Save most but suffer losses', 'Discover something the disaster unearthed'],
  },
  {
    type: 'betrayal reveal',
    setup: 'An NPC the party trusted reveals their true allegiance at the worst possible moment.',
    challenges: ['The betrayer has taken something important', 'Other NPCs are unsure whom to believe', 'The betrayer has a head start'],
    outcomes: ['Catch the betrayer and recover what was taken', 'Let them go in exchange for vital information', 'The betrayal was faked to fool the real enemy'],
  },
  {
    type: 'magical anomaly',
    setup: 'Wild magic surges through the area, causing unpredictable effects.',
    challenges: ['Spells behave erratically', 'Random transformations affect the party', 'The anomaly is growing'],
    outcomes: ['Stabilize the anomaly and harvest residual magic', 'Ride it out and deal with the aftermath', 'Trace it to its source — someone is doing this deliberately'],
  },
  {
    type: 'hostage situation',
    setup: 'Enemies hold innocents and threaten to harm them unless demands are met.',
    challenges: ['Direct assault risks hostage lives', 'The enemies are desperate and unstable', 'A hidden hostage complicates any plan'],
    outcomes: ['Rescue all hostages without bloodshed', 'Storm in and accept some casualties', 'Meet the demands and track the enemies later'],
  },
  {
    type: 'festival gone wrong',
    setup: 'A celebration turns dangerous when something disrupts it — sabotage, monster, or magic.',
    challenges: ['Panicking crowds impede movement', 'The threat hides among the festivities', 'Important NPCs are scattered and vulnerable'],
    outcomes: ['Neutralize the threat and save the festival', 'Evacuate civilians and contain the damage', 'Discover the disruption was a distraction for the real crime'],
  },
];

/**
 * Generate a fully-formed encounter with setup, challenges, outcomes, and loot.
 * @param {Object} [options]
 * @param {'easy'|'medium'|'hard'|'deadly'} [options.difficulty]
 * @param {string} [options.biome]
 * @param {number} [options.party_level]
 * @param {number} [options.party_size]
 * @returns {Object} Complete encounter object
 */
export function generateEncounter(options = {}) {
  const { difficulty, biome, party_level, party_size } = options;

  const scenario = pick(ENCOUNTER_SCENARIOS);
  const diff = difficulty || pick(['easy', 'medium', 'medium', 'hard', 'deadly']);
  const lvl = party_level || rollRange(1, 15);
  const size = party_size || rollRange(3, 5);

  const xpMultiplier = { easy: 50, medium: 100, hard: 150, deadly: 250 };
  const xpValue = lvl * (xpMultiplier[diff] || 100) * size;

  const lootTables = {
    easy: ['A handful of copper coins', 'A simple healing potion', 'A mundane but well-crafted weapon'],
    medium: ['A pouch of gold coins', 'A potion of greater healing', 'A minor magical trinket', pick(ITEMS_POOL)],
    hard: ['A significant gold cache', 'A rare magical item', pick(ITEMS_POOL), 'A scroll of a useful spell'],
    deadly: ['A hoard of mixed coins and gems', pick(ITEMS_POOL), pick(ITEMS_POOL), 'A very rare magical item'],
  };

  const biomeDetail = biome || pick(['forest', 'mountain', 'swamp', 'desert', 'urban', 'underground', 'coastal', 'plains']);

  return {
    type: scenario.type,
    difficulty: diff,
    setup: scenario.setup,
    challenge: pick(scenario.challenges),
    possibleOutcomes: scenario.outcomes,
    loot: pickN(lootTables[diff] || lootTables.medium, rollRange(1, 3)),
    xpValue,
    partyLevel: lvl,
    partySize: size,
    biome: biomeDetail,
    environmentalNote: `Set in a ${biomeDetail} environment. Adjust terrain and sensory details accordingly.`,
  };
}

// ─── 6. Tavern Event Generator ───────────────────────────────────────────────

const TAVERN_EVENTS = [
  'A bard begins a song about the party\'s recent exploits — some details are hilariously wrong.',
  'Two drunken patrons are arm-wrestling with a wager of 50 gold. One of them is cheating with a strength-enhancing ring.',
  'A hooded figure drops a sealed letter on the party\'s table and leaves without a word.',
  'The tavern cat hisses at a seemingly normal patron, then hides under the bar.',
  'A group of off-duty guards is loudly debating whether adventurers cause more problems than they solve.',
  'Someone has spiked the ale with a mild hallucinogenic herb. Patrons start seeing strange things.',
  'A merchant is loudly hawking "genuine dragon teeth" that are obviously carved bone.',
  'The innkeeper\'s child is asking every patron the same riddle, and no one can solve it.',
  'A former adventurer, now elderly, recognizes a party member\'s weapon and tells its history.',
  'A bar bet escalates: someone claims they can eat an entire wheel of cheese. The crowd takes sides.',
  'Rain begins to pour and a dozen wet travelers all arrive at once, overwhelming the staff.',
  'A brawl breaks out in the kitchen and a cook chases a dishwasher through the common room with a pan.',
  'A traveling performer does a magic trick that goes wrong — real magic erupts from the playing cards.',
  'A dog wanders in carrying a bloody human hand in its mouth.',
  'Two rival bards engage in an increasingly aggressive musical duel.',
  'The tavern sign falls off and nearly crushes a patron. The innkeeper blames a curse.',
  'A mysterious stranger buys a round for the entire tavern, then starts asking very specific questions.',
  'A wanted poster on the wall bears a striking resemblance to one of the party members.',
  'The fireplace suddenly roars to life with green flame and a voice speaks from within.',
  'A drinking contest is announced with a prize of a mysterious locked box no one can open.',
];

/**
 * Generate a random tavern event.
 * @returns {Object} Tavern event with description and optional hooks
 */
export function generateTavernEvent() {
  const event = pick(TAVERN_EVENTS);
  const hooks = [
    'This could lead to a side quest if the party investigates further.',
    'A perceptive character might notice something others miss.',
    'This is purely atmospheric — or is it?',
    'An NPC may approach the party afterward with more context.',
  ];
  return {
    event,
    hook: pick(hooks),
    mood: pick(['lighthearted', 'mysterious', 'tense', 'chaotic', 'comedic']),
  };
}

// ─── 7. Rumor Generator ──────────────────────────────────────────────────────

const RUMORS = [
  { text: 'The old mine outside town was reopened last week, but the miners refuse to go deeper than the second level.', truthPct: 80 },
  { text: 'The mayor has been meeting with hooded figures in the cemetery at midnight.', truthPct: 65 },
  { text: 'A dragon was spotted flying over the mountains to the north — but it was heading away from civilization.', truthPct: 90 },
  { text: 'The local healer has been buying poisons from a traveling merchant. Probably for antidotes. Probably.', truthPct: 50 },
  { text: 'There is a bounty of 500 gold on a bandit leader named Thornwell, but no one who has gone after them has returned.', truthPct: 95 },
  { text: 'The river has been running warmer than usual. The fishers say something is heating it from below.', truthPct: 70 },
  { text: 'The baron\'s son is not actually his son — he was swapped at birth by fey creatures.', truthPct: 20 },
  { text: 'A hidden vault lies beneath the old temple, sealed since the last war.', truthPct: 85 },
  { text: 'The blacksmith forged a weapon last month that glowed when completed. She hasn\'t spoken about it since.', truthPct: 75 },
  { text: 'Wolves have been seen running in formation, like soldiers. Something is commanding them.', truthPct: 60 },
  { text: 'There\'s a portal in the forest that only appears during a full moon. A child went through and came back speaking a language no one recognizes.', truthPct: 40 },
  { text: 'The king is dead and has been replaced by a magical construct. Only the inner council knows.', truthPct: 10 },
  { text: 'An abandoned ship drifted into port last week with a full cargo hold but no crew. Not even bones.', truthPct: 95 },
  { text: 'The grain stores are being sabotaged. Someone is salting the reserves to cause a famine.', truthPct: 55 },
  { text: 'A traveling bard knows the true name of the demon imprisoned beneath the city.', truthPct: 30 },
];

const RUMOR_SOURCES = [
  'A drunk at the tavern','A nervous merchant','A gossiping washerwoman','A retired soldier',
  'A street urchin','A temple acolyte','A traveling peddler','A suspicious farmer',
  'A guild apprentice','A dockworker on break','A fortune teller','The innkeeper\'s spouse',
];

/**
 * Generate a rumor with truth percentage and source.
 * @returns {Object} Rumor with text, truthPct, and source
 */
export function generateRumor() {
  const rumor = pick(RUMORS);
  return {
    text: rumor.text,
    truthPercentage: rumor.truthPct,
    source: pick(RUMOR_SOURCES),
    isVerifiable: rumor.truthPct > 70,
    leadsPotential: rumor.truthPct > 50 ? 'Could lead to a quest or encounter if investigated.' : 'Likely a dead end, but may add atmosphere.',
  };
}

// ─── 8. Treasure Generator ───────────────────────────────────────────────────

const MUNDANE_ITEMS = [
  'A silver comb with a broken tooth','A love letter written in Elvish',
  'A set of bone dice','A tin whistle','A leather-bound journal half-filled with sketches',
  'An old key with no apparent lock','A pressed flower in a glass locket',
  'A child\'s wooden toy soldier','A vial of perfume','A map of an unknown region',
  'A carved wooden holy symbol','A pouch of exotic spices','A pair of crystal spectacles',
];

const GEMS = [
  { name: 'Azurite', value: 10 },{ name: 'Agate', value: 10 },
  { name: 'Moonstone', value: 50 },{ name: 'Onyx', value: 50 },
  { name: 'Garnet', value: 100 },{ name: 'Pearl', value: 100 },
  { name: 'Topaz', value: 500 },{ name: 'Emerald', value: 1000 },
  { name: 'Ruby', value: 1000 },{ name: 'Diamond', value: 5000 },
  { name: 'Star sapphire', value: 1000 },{ name: 'Jacinth', value: 5000 },
];

/**
 * Generate CR-appropriate treasure/loot.
 * @param {number} [cr=1] - Challenge rating (0-20+)
 * @returns {Object} Treasure hoard with coins, gems, items
 */
export function generateTreasure(cr = 1) {
  const tier = cr <= 4 ? 1 : cr <= 10 ? 2 : cr <= 16 ? 3 : 4;

  const coinMultiplier = [1, 10, 100, 1000][tier - 1];
  const coins = {
    cp: tier <= 2 ? roll(6) * 100 * (tier === 1 ? 1 : 0) : 0,
    sp: roll(6) * 10 * coinMultiplier,
    gp: roll(6) * 5 * coinMultiplier,
    pp: tier >= 3 ? roll(6) * coinMultiplier : 0,
  };

  const gemCount = Math.max(0, rollRange(0, tier + 1));
  const availableGems = GEMS.filter(g => g.value <= coinMultiplier * 100);
  const gems = gemCount > 0 ? pickN(availableGems.length ? availableGems : GEMS.slice(0, 4), gemCount) : [];

  const mundaneCount = rollRange(0, 2);
  const mundane = pickN(MUNDANE_ITEMS, mundaneCount);

  const magicItem = tier >= 2 && Math.random() > 0.5 ? pick(ITEMS_POOL) : null;

  return {
    cr,
    tier,
    coins,
    gems: gems.map(g => ({ ...g, quantity: rollRange(1, 3) })),
    mundaneItems: mundane,
    magicItem,
    totalEstimatedValue: coins.cp / 100 + coins.sp / 10 + coins.gp + coins.pp * 10 +
      gems.reduce((sum, g) => sum + g.value, 0) +
      (magicItem ? tier * 500 : 0),
  };
}

// ─── 9. Trap Generator ──────────────────────────────────────────────────────

const TRAP_TEMPLATES = [
  {
    name: 'Pit Trap', type: 'mechanical',
    desc: 'A concealed pit opens beneath the target, dropping them into a hole.',
    disarm: ['Jam the mechanism with a piton (DC {DC} Thieves\' Tools)', 'Jump across (DC {DC} Acrobatics)', 'Detect the seam in the floor (DC {DC} Perception)'],
  },
  {
    name: 'Poison Dart Wall', type: 'mechanical',
    desc: 'Pressure plates trigger a volley of poisoned darts from hidden wall slots.',
    disarm: ['Block the dart holes with cloth or wax (DC {DC} Thieves\' Tools)', 'Avoid the pressure plates (DC {DC} Acrobatics)', 'Spot the holes in the wall (DC {DC} Investigation)'],
  },
  {
    name: 'Glyph of Warding', type: 'magical',
    desc: 'A magical glyph erupts with elemental energy when triggered.',
    disarm: ['Dispel Magic (DC {DC})', 'Identify and avoid the trigger zone (DC {DC} Arcana)', 'Trigger it from range with a thrown object'],
  },
  {
    name: 'Swinging Blade', type: 'mechanical',
    desc: 'A massive blade swings from the ceiling when a tripwire is triggered.',
    disarm: ['Cut the tripwire carefully (DC {DC} Thieves\' Tools)', 'Crawl under the blade arc (DC {DC} Acrobatics)', 'Wedge the blade in place (DC {DC} Athletics)'],
  },
  {
    name: 'Collapsing Ceiling', type: 'mechanical',
    desc: 'Weight on the floor triggers a chain reaction that drops the ceiling.',
    disarm: ['Shore up the supports (DC {DC} Athletics)', 'Move quickly through (DC {DC} Dexterity save)', 'Detect the weakened supports (DC {DC} Investigation)'],
  },
  {
    name: 'Symbol of Fear', type: 'magical',
    desc: 'A magical symbol triggers overwhelming terror in those who see it.',
    disarm: ['Avert your gaze and cover the symbol (DC {DC} Wisdom save)', 'Dispel Magic (DC {DC})', 'Recognize the symbol and recite the counter-phrase (DC {DC} Arcana)'],
  },
  {
    name: 'Flooding Room', type: 'mechanical',
    desc: 'The doors seal and water pours in from hidden vents.',
    disarm: ['Find and block the water source (DC {DC} Investigation)', 'Force the door open (DC {DC} Athletics)', 'Swim to a hidden air pocket (DC {DC} Perception)'],
  },
  {
    name: 'Illusory Floor', type: 'magical',
    desc: 'An illusion conceals a dangerous drop, pool of acid, or bed of spikes.',
    disarm: ['Test the floor with a pole or thrown object', 'See through the illusion (DC {DC} Investigation)', 'Dispel Magic (DC {DC})'],
  },
  {
    name: 'Fire Breath Statue', type: 'mechanical',
    desc: 'A stone statue breathes fire when movement is detected in its cone.',
    disarm: ['Plug the nozzle from behind (DC {DC} Thieves\' Tools)', 'Move slowly to avoid triggering it (DC {DC} Stealth)', 'Redirect the nozzle (DC {DC} Tinker\'s Tools)'],
  },
  {
    name: 'Necrotic Touch Rune', type: 'magical',
    desc: 'A rune on a door or chest deals necrotic damage to anyone who touches it.',
    disarm: ['Identify the rune type (DC {DC} Arcana)', 'Use Mage Hand to trigger it safely', 'Scrape off the rune with a silvered tool (DC {DC} Dex check)'],
  },
];

/**
 * Generate a trap with DC, damage, and disarm methods.
 * @param {'easy'|'medium'|'hard'|'deadly'} [difficulty='medium']
 * @returns {Object} Complete trap description
 */
export function generateTrap(difficulty = 'medium') {
  const dcTable = { easy: 10, medium: 13, hard: 16, deadly: 20 };
  const dmgTable = { easy: '1d6', medium: '2d10', hard: '4d10', deadly: '10d10' };
  const dc = dcTable[difficulty] || 13;
  const dmg = dmgTable[difficulty] || '2d10';

  const template = pick(TRAP_TEMPLATES);
  const damageTypes = template.type === 'magical'
    ? ['fire', 'cold', 'lightning', 'necrotic', 'force', 'psychic']
    : ['piercing', 'bludgeoning', 'slashing', 'poison'];

  return {
    name: template.name,
    type: template.type,
    difficulty,
    description: template.desc,
    dc,
    damage: `${dmg} ${pick(damageTypes)} damage`,
    disarmMethods: template.disarm.map(d => d.replace(/\{DC\}/g, dc)),
    detectionDC: dc - 2,
    resetable: template.type === 'mechanical' ? Math.random() > 0.3 : false,
  };
}

// ─── 10. Weather Generator ───────────────────────────────────────────────────

const WEATHER_TABLE = [
  {
    weather: 'Clear skies',
    desc: 'Bright sunshine and gentle breezes. Perfect traveling weather.',
    effects: 'No mechanical effects. Advantage on Navigation checks.',
  },
  {
    weather: 'Overcast',
    desc: 'A thick blanket of grey clouds blocks the sun. The air is heavy and still.',
    effects: 'Dim light conditions in open areas. No direct sunlight effects.',
  },
  {
    weather: 'Light rain',
    desc: 'A steady drizzle soaks everything. Visibility is slightly reduced.',
    effects: 'Disadvantage on Perception checks relying on sight beyond 100 ft. Ranged weapon attacks beyond normal range have disadvantage.',
  },
  {
    weather: 'Heavy rain',
    desc: 'Sheets of rain pound the landscape. Thunder rumbles in the distance.',
    effects: 'Lightly obscured beyond 50 ft. Disadvantage on Perception checks relying on hearing. Open flames are extinguished.',
  },
  {
    weather: 'Thunderstorm',
    desc: 'Lightning splits the sky and thunder shakes the ground. The rain is blinding.',
    effects: 'Heavily obscured beyond 100 ft. Disadvantage on ranged attacks. Metal armor attracts lightning (5% chance per hour of 2d10 lightning damage).',
  },
  {
    weather: 'Fog',
    desc: 'A dense fog blankets the area, reducing visibility to mere feet.',
    effects: 'Heavily obscured beyond 30 ft. Advantage on Stealth checks. Navigation DC increases by 5.',
  },
  {
    weather: 'Snow',
    desc: 'Fat snowflakes drift down, muffling sound and painting the world white.',
    effects: 'Lightly obscured. Movement through accumulated snow costs double. Tracking is easier (advantage on Survival checks).',
  },
  {
    weather: 'Blizzard',
    desc: 'Howling winds drive ice and snow horizontally. Visibility is nearly zero.',
    effects: 'Heavily obscured beyond 20 ft. Movement costs triple. One level of exhaustion per hour without shelter. Constitution save DC 15.',
  },
  {
    weather: 'Scorching heat',
    desc: 'The sun beats down mercilessly. The air shimmers with heat haze.',
    effects: 'Constitution save DC 10+1 per hour or gain one level of exhaustion. Water consumption doubles. Metal armor heats (1 fire damage per hour).',
  },
  {
    weather: 'Magical aurora',
    desc: 'Shimmering curtains of magical light dance across the sky in vivid colors.',
    effects: 'Wild Magic surges are twice as likely. Divination spells have advantage. Dim light even at night.',
  },
  {
    weather: 'Unnatural calm',
    desc: 'No wind. No clouds. No birdsong. The air feels wrong, as if the world is holding its breath.',
    effects: 'Animals are agitated. Wisdom save DC 12 or feel an irrational sense of dread. Something is coming.',
  },
  {
    weather: 'Ash fall',
    desc: 'Fine volcanic ash drifts from the sky like grey snow. The air tastes bitter.',
    effects: 'Lightly obscured. Constitution save DC 12 per hour or gain a cough (disadvantage on Stealth). Tracking is easier.',
  },
  {
    weather: 'Gale winds',
    desc: 'Ferocious winds tear across the landscape, making it hard to stand upright.',
    effects: 'Ranged weapon attacks have disadvantage. Small creatures must succeed on DC 12 Strength save or be knocked prone. Flying is impossible for small creatures.',
  },
  {
    weather: 'Hail',
    desc: 'Ice stones pelt down from dark clouds, clattering off every surface.',
    effects: '1d4 bludgeoning damage per 10 minutes without cover. Disadvantage on Perception (hearing). Ground becomes slippery.',
  },
];

/**
 * Generate atmospheric weather with mechanical effects.
 * @returns {Object} Weather description and game effects
 */
export function generateWeather() {
  const entry = pick(WEATHER_TABLE);
  const temp = pick([
    'Frigid (below freezing)','Cold','Cool','Mild','Warm','Hot','Sweltering'
  ]);
  const wind = pick([
    'Calm','Light breeze','Moderate wind','Strong gusts','Howling gale'
  ]);
  return {
    weather: entry.weather,
    description: entry.desc,
    mechanicalEffects: entry.effects,
    temperature: temp,
    wind,
    duration: pick(['A few hours', 'Half the day', 'All day', 'Through the night', 'Multiple days']),
  };
}
