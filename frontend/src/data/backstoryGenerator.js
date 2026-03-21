/**
 * Backstory Generator — Character backstory data and generation utilities for D&D 5e.
 * Covers roadmap items related to character backstory generation.
 * Includes backgrounds, life events, family status, childhood events, motivations, and quirks.
 * No React dependencies — pure data and helper functions.
 */

// ─────────────────────────────────────────────
// BACKGROUNDS — 15 official D&D 5e backgrounds
// ─────────────────────────────────────────────

export const BACKGROUNDS = {
  acolyte: {
    name: 'Acolyte',
    description:
      'You have spent your life in the service of a temple to a specific god or pantheon of gods.',
    skillProficiencies: ['Insight', 'Religion'],
    toolProficiencies: [],
    languages: ['Two of your choice'],
    equipment: [
      'Holy symbol (gift to you when you entered the priesthood)',
      'Prayer book or prayer wheel',
      '5 sticks of incense',
      'Vestments',
      'Set of common clothes',
      '15 gp',
    ],
    featureName: 'Shelter of the Faithful',
    featureDescription:
      'As an acolyte, you command the respect of those who share your faith. You and your companions can receive free healing and care at temples, shrines, and other establishments of your faith. Those who share your religion will support you at a modest lifestyle.',
  },
  charlatan: {
    name: 'Charlatan',
    description:
      'You have always had a talent for making people believe what you want them to believe.',
    skillProficiencies: ['Deception', 'Sleight of Hand'],
    toolProficiencies: ['Disguise kit', 'Forgery kit'],
    languages: [],
    equipment: [
      'Set of fine clothes',
      'Disguise kit',
      'Tools of the con of your choice (ten stoppered bottles filled with colored liquid, set of weighted dice, deck of marked cards, or signet ring of an imaginary duke)',
      '15 gp',
    ],
    featureName: 'False Identity',
    featureDescription:
      'You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that persona. Additionally, you can forge documents including official papers and personal letters, as long as you have seen an example of the kind of document or the handwriting you are trying to copy.',
  },
  criminal: {
    name: 'Criminal',
    description:
      'You are an experienced criminal with a history of breaking the law.',
    skillProficiencies: ['Deception', 'Stealth'],
    toolProficiencies: ["One type of gaming set", "Thieves' tools"],
    languages: [],
    equipment: [
      'Crowbar',
      'Set of dark common clothes including a hood',
      '15 gp',
    ],
    featureName: 'Criminal Contact',
    featureDescription:
      'You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you.',
  },
  entertainer: {
    name: 'Entertainer',
    description:
      'You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them.',
    skillProficiencies: ['Acrobatics', 'Performance'],
    toolProficiencies: ['Disguise kit', 'One type of musical instrument'],
    languages: [],
    equipment: [
      'Musical instrument (one of your choice)',
      "Favor of an admirer (love letter, lock of hair, or trinket)",
      'Costume',
      '15 gp',
    ],
    featureName: 'By Popular Demand',
    featureDescription:
      'You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble\'s court. At such a place, you receive free lodging and food of a modest or comfortable standard (depending on the quality of the establishment), as long as you perform each night.',
  },
  folkHero: {
    name: 'Folk Hero',
    description:
      'You come from a humble social rank, but you are destined for so much more.',
    skillProficiencies: ['Animal Handling', 'Survival'],
    toolProficiencies: ["One type of artisan's tools", 'Vehicles (land)'],
    languages: [],
    equipment: [
      "Set of artisan's tools (one of your choice)",
      'Shovel',
      'Iron pot',
      'Set of common clothes',
      '10 gp',
    ],
    featureName: 'Rustic Hospitality',
    featureDescription:
      'Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them. They will shield you from the law or anyone else searching for you, though they will not risk their lives for you.',
  },
  guildArtisan: {
    name: 'Guild Artisan',
    description:
      'You are a member of an artisan\'s guild, skilled in a particular field and closely associated with other artisans.',
    skillProficiencies: ['Insight', 'Persuasion'],
    toolProficiencies: ["One type of artisan's tools"],
    languages: ['One of your choice'],
    equipment: [
      "Set of artisan's tools (one of your choice)",
      'Letter of introduction from your guild',
      "Set of traveler's clothes",
      '15 gp',
    ],
    featureName: 'Guild Membership',
    featureDescription:
      'As an established and respected member of a guild, you can rely on certain benefits that membership provides. Your fellow guild members will provide you with lodging and food if necessary, and pay for your funeral if needed. In some cities and towns, a guildhall offers a central place to meet other members of your profession, which can be a good place to meet potential patrons, allies, or hirelings.',
  },
  hermit: {
    name: 'Hermit',
    description:
      'You lived in seclusion — either in a sheltered community such as a monastery, or entirely alone — for a formative part of your life.',
    skillProficiencies: ['Medicine', 'Religion'],
    toolProficiencies: ['Herbalism kit'],
    languages: ['One of your choice'],
    equipment: [
      'Scroll case stuffed full of notes from your studies or prayers',
      'Winter blanket',
      'Set of common clothes',
      'Herbalism kit',
      '5 gp',
    ],
    featureName: 'Discovery',
    featureDescription:
      'The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth about the cosmos, the deities, the powerful beings of the outer planes, or the forces of nature.',
  },
  noble: {
    name: 'Noble',
    description:
      'You understand wealth, power, and privilege. You carry a noble title, and your family owns land, collects taxes, and wields significant political influence.',
    skillProficiencies: ['History', 'Persuasion'],
    toolProficiencies: ['One type of gaming set'],
    languages: ['One of your choice'],
    equipment: [
      'Set of fine clothes',
      'Signet ring',
      'Scroll of pedigree',
      'Purse containing 25 gp',
    ],
    featureName: 'Position of Privilege',
    featureDescription:
      'Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are. The common folk make every effort to accommodate you and avoid your displeasure, and other people of high birth treat you as a member of the same social sphere.',
  },
  outlander: {
    name: 'Outlander',
    description:
      'You grew up in the wilds, far from civilization and the comforts of town and technology.',
    skillProficiencies: ['Athletics', 'Survival'],
    toolProficiencies: ['One type of musical instrument'],
    languages: ['One of your choice'],
    equipment: [
      'Staff',
      'Hunting trap',
      'Trophy from an animal you killed',
      "Set of traveler's clothes",
      '10 gp',
    ],
    featureName: 'Wanderer',
    featureDescription:
      'You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find food and fresh water for yourself and up to five other people each day, provided that the land offers berries, small game, water, and so forth.',
  },
  sage: {
    name: 'Sage',
    description:
      'You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you.',
    skillProficiencies: ['Arcana', 'History'],
    toolProficiencies: [],
    languages: ['Two of your choice'],
    equipment: [
      'Bottle of black ink',
      'Quill',
      'Small knife',
      'Letter from a dead colleague posing a question you have not yet been able to answer',
      'Set of common clothes',
      '10 gp',
    ],
    featureName: 'Researcher',
    featureDescription:
      'When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature. Your DM might rule that the knowledge you seek is secreted away in an almost inaccessible place, or that it simply cannot be found.',
  },
  sailor: {
    name: 'Sailor',
    description:
      'You sailed on a seagoing vessel for years. In that time, you faced down mighty storms, monsters of the deep, and those who wanted to sink your craft to the bottomless depths.',
    skillProficiencies: ['Athletics', 'Perception'],
    toolProficiencies: ["Navigator's tools", 'Vehicles (water)'],
    languages: [],
    equipment: [
      'Belaying pin (club)',
      '50 feet of silk rope',
      "Lucky charm such as a rabbit foot or a small stone with a hole in the center (or you can roll for a trinket on the Trinkets table in chapter 5)",
      'Set of common clothes',
      '10 gp',
    ],
    featureName: "Ship's Passage",
    featureDescription:
      'When you need to, you can secure free passage on a sailing ship for yourself and your adventuring companions. You might sail on the ship you served on, or another ship you have good relations with. Because you\'re calling in a favor, you can\'t be certain of a schedule or route that will meet your every need.',
  },
  soldier: {
    name: 'Soldier',
    description:
      'War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor, learned basic survival techniques, including how to stay alive on the battlefield.',
    skillProficiencies: ['Athletics', 'Intimidation'],
    toolProficiencies: ['One type of gaming set', 'Vehicles (land)'],
    languages: [],
    equipment: [
      'Insignia of rank',
      'Trophy taken from a fallen enemy (a dagger, broken blade, or piece of a banner)',
      'Set of bone dice or deck of cards',
      'Set of common clothes',
      '10 gp',
    ],
    featureName: 'Military Rank',
    featureDescription:
      'You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use.',
  },
  urchin: {
    name: 'Urchin',
    description:
      'You grew up on the streets alone, orphaned, and poor. You had no one to watch over you or to provide for you, so you learned to provide for yourself.',
    skillProficiencies: ['Sleight of Hand', 'Stealth'],
    toolProficiencies: ['Disguise kit', "Thieves' tools"],
    languages: [],
    equipment: [
      'Small knife',
      'Map of the city you grew up in',
      'Pet mouse',
      'Token to remember your parents by',
      'Set of common clothes',
      '10 gp',
    ],
    featureName: 'City Secrets',
    featureDescription:
      'You know the secret patterns and flow to cities and can find passages through the urban sprawl that others would miss. When you are not in combat, you (and companions you lead) can travel between any two locations in the city twice as fast as your speed would normally allow.',
  },
  hauntedOne: {
    name: 'Haunted One',
    description:
      'You are haunted by something so terrible that you dare not speak of it. You\'ve tried to bury it and run away from it, to no avail.',
    skillProficiencies: ['Arcana or Investigation', 'Medicine or Survival'],
    toolProficiencies: [],
    languages: ['Two of your choice, one of which being an exotic language (Abyssal, Celestial, Deep Speech, Draconic, Infernal, Primordial, Sylvan, or Undercommon)'],
    equipment: [
      'Monster hunter\'s pack (chest, crowbar, hammer, three wooden stakes, holy symbol, flask of holy water, set of manacles, steel mirror, flask of oil, tinderbox, 3 torches)',
      'One trinket of special significance',
    ],
    featureName: 'Heart of Darkness',
    featureDescription:
      'Those who look into your eyes can see that you have faced unimaginable horror and that you are no stranger to darkness. Though they might fear you, commoners will extend you every courtesy and do their utmost to help you. Unless you have shown yourself to be a danger to them, they will even take up arms to fight alongside you should you find yourself facing an enemy alone.',
  },
  farTraveler: {
    name: 'Far Traveler',
    description:
      'You come from a distant land, far outside the region where the campaign takes place. You maintain the customs and ways of your homeland while adapting — slowly — to this foreign land.',
    skillProficiencies: ['Insight', 'Perception'],
    toolProficiencies: ['One musical instrument or gaming set of your choice'],
    languages: ['One of your choice'],
    equipment: [
      'Set of traveler\'s clothes',
      'Any one musical instrument or gaming set you are proficient with',
      'Poorly drawn map from your homeland that shows where you come from',
      'Small piece of jewelry worth 10 gp in the style of your homeland\'s craftsmanship',
      '5 gp',
    ],
    featureName: 'All Eyes on You',
    featureDescription:
      'Your accent, mannerisms, figures of speech, and perhaps even your appearance all mark you as foreign. Curious glances are directed your way wherever you go, which can be a nuisance, but you also gain the friendly interest of scholars and others intrigued by far-off lands, to say nothing of everyday folk who are eager to hear stories of your homeland.',
  },
};

// ─────────────────────────────────────────────
// LIFE_EVENTS — d20 table of formative events
// ─────────────────────────────────────────────

export const LIFE_EVENTS = [
  {
    roll: 1,
    event: 'Orphaned',
    description:
      'You lost your parents at a young age and were forced to fend for yourself or rely on strangers.',
  },
  {
    roll: 2,
    event: 'Trained by a Master',
    description:
      'A skilled mentor took you under their wing and taught you everything you know about your craft.',
  },
  {
    roll: 3,
    event: 'Witnessed Tragedy',
    description:
      'You saw something horrific — a battle, a disaster, or an act of cruelty — that shaped your worldview forever.',
  },
  {
    roll: 4,
    event: 'Discovered a Talent',
    description:
      'One day you realized you had an extraordinary ability that others lacked, changing the course of your life.',
  },
  {
    roll: 5,
    event: 'Fell in Love',
    description:
      'You experienced deep romantic love — whether it endured, ended in heartbreak, or was never realized.',
  },
  {
    roll: 6,
    event: 'Made an Enemy',
    description:
      'Through words, deeds, or circumstance, you earned the lasting hatred of someone powerful or persistent.',
  },
  {
    roll: 7,
    event: 'Found a Mentor',
    description:
      'A wise and experienced figure recognized potential in you and guided you on your path.',
  },
  {
    roll: 8,
    event: 'Committed a Crime',
    description:
      'Desperation, greed, or misguided loyalty led you to break the law — and live with the consequences.',
  },
  {
    roll: 9,
    event: 'Was Betrayed',
    description:
      'Someone you trusted deeply turned against you, leaving scars that have never fully healed.',
  },
  {
    roll: 10,
    event: 'Served in War',
    description:
      'You fought in a conflict — as a soldier, a conscript, or a volunteer — and saw the true cost of war.',
  },
  {
    roll: 11,
    event: 'Traveled Far',
    description:
      'A long journey to distant lands broadened your horizons and exposed you to cultures very different from your own.',
  },
  {
    roll: 12,
    event: 'Received a Prophecy',
    description:
      'A seer, oracle, or divine vision revealed a portent about your destiny that you cannot ignore.',
  },
  {
    roll: 13,
    event: 'Lost Everything',
    description:
      'Fire, war, theft, or misfortune stripped you of your home, wealth, or the people you loved.',
  },
  {
    roll: 14,
    event: 'Saved a Life',
    description:
      'At great personal risk, you acted to preserve another\'s life — an act that defined your character.',
  },
  {
    roll: 15,
    event: 'Made a Pact',
    description:
      'You entered into a binding agreement — with a patron, a devil, a fey lord, or a mortal power — in exchange for something precious.',
  },
  {
    roll: 16,
    event: 'Joined an Organization',
    description:
      'You became a member of a guild, a thieves\' ring, a religious order, or another organized group that shaped your loyalties.',
  },
  {
    roll: 17,
    event: 'Discovered a Secret',
    description:
      'You uncovered hidden knowledge — about a person, a place, or the world itself — that others would kill to suppress.',
  },
  {
    roll: 18,
    event: 'Survived a Disaster',
    description:
      'You endured a catastrophe — a shipwreck, a collapsing mine, a magical explosion — that few others walked away from.',
  },
  {
    roll: 19,
    event: 'Inherited Something',
    description:
      'A deceased relative or benefactor left you an item, a debt, a title, or a burden that has followed you ever since.',
  },
  {
    roll: 20,
    event: 'Had a Vision',
    description:
      'A vivid dream, a divine visitation, or a brush with the arcane gave you a glimpse of something beyond the mortal veil.',
  },
];

// ─────────────────────────────────────────────
// FAMILY_STATUS — d6 table
// ─────────────────────────────────────────────

export const FAMILY_STATUS = [
  {
    roll: 1,
    status: 'Wealthy',
    description:
      'Your family was prosperous — merchants, minor nobility, or successful landowners. You never lacked for comfort.',
  },
  {
    roll: 2,
    status: 'Comfortable',
    description:
      'Your family lived well enough. Not rich, but never hungry. Skilled tradespeople or respected professionals.',
  },
  {
    roll: 3,
    status: 'Modest',
    description:
      'Your family scraped by with honest work. Life was not easy, but you had a roof over your head and food on the table.',
  },
  {
    roll: 4,
    status: 'Poor',
    description:
      'Your family struggled constantly. Work was scarce, and hardship was a frequent visitor in your home.',
  },
  {
    roll: 5,
    status: 'Destitute',
    description:
      'Your family had almost nothing. Poverty shaped every part of your childhood, and survival was never guaranteed.',
  },
  {
    roll: 6,
    status: 'Unknown / Orphan',
    description:
      'You do not know your family, were abandoned, or lost them so young that you have no real memory of them.',
  },
];

// ─────────────────────────────────────────────
// CHILDHOOD_EVENTS — 10 formative childhood memories
// ─────────────────────────────────────────────

export const CHILDHOOD_EVENTS = [
  {
    id: 'bully',
    event: 'The Bully',
    description:
      'An older child made your life miserable for a time. You learned to endure — or to fight back.',
  },
  {
    id: 'bestFriend',
    event: 'A Best Friend',
    description:
      'You had a companion who meant the world to you. Whether you stayed close or drifted apart, they left a mark on you.',
  },
  {
    id: 'mysteriousStranger',
    event: 'The Mysterious Stranger',
    description:
      'A traveler, wizard, or wanderer passed through your life briefly but said something or showed you something you never forgot.',
  },
  {
    id: 'naturalDisaster',
    event: 'Natural Disaster',
    description:
      'A flood, storm, earthquake, or wildfire tore through your community, and you witnessed its aftermath firsthand.',
  },
  {
    id: 'festivalMemory',
    event: 'The Festival',
    description:
      'A grand celebration — a harvest festival, a holy day, a royal visit — fills your earliest happy memories.',
  },
  {
    id: 'lostPet',
    event: 'A Lost Pet',
    description:
      'You had an animal companion that you loved dearly. Its loss — or its fate — taught you something about love and grief.',
  },
  {
    id: 'secretPlace',
    event: 'The Secret Place',
    description:
      'You discovered a hidden spot — a cave, a loft, a ruined building — that was entirely your own.',
  },
  {
    id: 'familyTradition',
    event: 'Family Tradition',
    description:
      'A ritual, craft, or practice passed down in your family gave you a sense of belonging and identity.',
  },
  {
    id: 'firstFight',
    event: 'The First Fight',
    description:
      'The first time you came to blows with someone — whether you won or lost — revealed something about your character.',
  },
  {
    id: 'strangeDream',
    event: 'The Strange Dream',
    description:
      'A recurring dream you had as a child still lingers in your memory, vivid and inexplicable.',
  },
];

// ─────────────────────────────────────────────
// MOTIVATIONS — 10 adventure motivations
// ─────────────────────────────────────────────

export const MOTIVATIONS = [
  {
    id: 'revenge',
    motivation: 'Revenge',
    description:
      'Someone took something from you — a person, a future, a belief — and you will not rest until justice is served.',
  },
  {
    id: 'glory',
    motivation: 'Glory',
    description:
      'You want to be remembered. Songs sung in taverns, statues in town squares, a name that echoes through history.',
  },
  {
    id: 'wealth',
    motivation: 'Wealth',
    description:
      'Coin opens doors that nothing else can. You intend to acquire as much of it as possible.',
  },
  {
    id: 'knowledge',
    motivation: 'Knowledge',
    description:
      'The world is full of secrets — magical, historical, cosmic — and you intend to uncover as many as you can.',
  },
  {
    id: 'duty',
    motivation: 'Duty',
    description:
      'You serve a cause, a nation, a god, or a people. Personal desires come second to obligation.',
  },
  {
    id: 'redemption',
    motivation: 'Redemption',
    description:
      'You have done wrong — or believe you have — and every step of your journey is an attempt to make amends.',
  },
  {
    id: 'wanderlust',
    motivation: 'Wanderlust',
    description:
      'The horizon is always calling. You travel not toward something, but simply because standing still feels like dying.',
  },
  {
    id: 'protectLovedOnes',
    motivation: 'Protect Loved Ones',
    description:
      'There are people in the world — family, friends, a community — whose safety matters more to you than your own.',
  },
  {
    id: 'fulfillProphecy',
    motivation: 'Fulfill a Prophecy',
    description:
      'A vision, an omen, or a dying elder\'s words told you that you are destined for something. You mean to see it through.',
  },
  {
    id: 'escapeThePast',
    motivation: 'Escape the Past',
    description:
      'Whatever life you had before, you have left it behind — or are trying to. The road ahead is better than what\'s behind you.',
  },
];

// ─────────────────────────────────────────────
// PERSONALITY_QUIRKS — 20 flavor quirks
// ─────────────────────────────────────────────

export const PERSONALITY_QUIRKS = [
  'You always whistle or hum to yourself when nervous.',
  'You collect small trinkets from everywhere you visit and never throw them away.',
  'You have an opinion on everything and rarely keep it to yourself.',
  'You refuse to sleep indoors if the sky is clear.',
  'You compulsively straighten crooked objects.',
  'You give everyone a nickname, whether they like it or not.',
  'You cannot resist a dare, even a foolish one.',
  'You speak to animals as though they fully understand you — and sometimes act as if they replied.',
  'You keep a journal and record everything in meticulous detail.',
  'You always eat the same meal when you find it available — it reminds you of home.',
  'You trust no one until you have seen them show kindness to a stranger.',
  'You are deeply superstitious and follow a set of personal omens and rituals.',
  'You quote ancient texts or proverbs in conversation, often at inappropriate moments.',
  'You have a habit of pacing when you think.',
  'You laugh at your own jokes before you finish telling them.',
  'You maintain an impeccably clean blade, even when everything else is falling apart.',
  'You never ask for help — even when you desperately need it.',
  'You make bets on almost anything and always pay your debts.',
  'You are drawn to high places and seek out rooftops, cliffs, and towers whenever possible.',
  'You have a recurring nightmare you have never told anyone about.',
];

// ─────────────────────────────────────────────
// Helper utilities
// ─────────────────────────────────────────────

/**
 * Returns a random integer between min and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Picks a random element from an array.
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
function randomFrom(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

// ─────────────────────────────────────────────
// Exported helper functions
// ─────────────────────────────────────────────

/**
 * Returns the background data object for a given background type key.
 * @param {string} backgroundType - Key from BACKGROUNDS (e.g. 'acolyte', 'noble').
 * @returns {object|null} Background object, or null if not found.
 */
export function getBackground(backgroundType) {
  return BACKGROUNDS[backgroundType] ?? null;
}

/**
 * Rolls on the d20 LIFE_EVENTS table and returns a random life event.
 * @returns {object} A life event object { roll, event, description }.
 */
export function rollLifeEvent() {
  const roll = randomInt(1, 20);
  return LIFE_EVENTS.find((e) => e.roll === roll) ?? LIFE_EVENTS[0];
}

/**
 * Rolls on the d6 FAMILY_STATUS table and returns a random family status.
 * @returns {object} A family status object { roll, status, description }.
 */
export function rollFamilyStatus() {
  const roll = randomInt(1, 6);
  return FAMILY_STATUS.find((s) => s.roll === roll) ?? FAMILY_STATUS[0];
}

/**
 * Returns a random adventure motivation from the MOTIVATIONS list.
 * @returns {object} A motivation object { id, motivation, description }.
 */
export function getMotivation() {
  return randomFrom(MOTIVATIONS);
}

/**
 * Generates a short backstory paragraph for a character given race, class, and background.
 * @param {string} race - The character's race (e.g. 'Human', 'Elf').
 * @param {string} classType - The character's class (e.g. 'Fighter', 'Wizard').
 * @param {string} backgroundType - Key from BACKGROUNDS (e.g. 'soldier', 'sage').
 * @returns {string} A generated backstory paragraph.
 */
export function generateBackstory(race, classType, backgroundType) {
  const background = getBackground(backgroundType);
  const lifeEvent = rollLifeEvent();
  const familyStatus = rollFamilyStatus();
  const motivation = getMotivation();
  const quirk = randomFrom(PERSONALITY_QUIRKS);
  const childhoodEvent = randomFrom(CHILDHOOD_EVENTS);

  const bgName = background ? background.name : backgroundType;

  return (
    `Born into a ${familyStatus.status.toLowerCase()} family, this ${race} ${classType} spent their formative years shaped by the life of a ${bgName}. ` +
    `As a child, a defining memory stands out: ${childhoodEvent.description.toLowerCase()} ` +
    `Later in life, a pivotal moment changed everything — they ${lifeEvent.event.toLowerCase()}. ${lifeEvent.description} ` +
    `Now they are driven by a desire to ${motivation.motivation.toLowerCase()}: ${motivation.description} ` +
    `Those who know them well have noticed one particular trait: ${quirk}`
  );
}

/**
 * Generates a full structured backstory object with all relevant components.
 * @param {object} options
 * @param {string} [options.race='Unknown'] - Character race.
 * @param {string} [options.classType='Adventurer'] - Character class.
 * @param {string} [options.backgroundType] - Background key. If omitted, one is chosen at random.
 * @param {number} [options.lifeEventCount=2] - How many life events to roll (1–5).
 * @returns {object} Full backstory object with all components and a narrative summary.
 */
export function generateFullBackstory(options = {}) {
  const {
    race = 'Unknown',
    classType = 'Adventurer',
    backgroundType,
    lifeEventCount = 2,
  } = options;

  const backgroundKeys = Object.keys(BACKGROUNDS);
  const resolvedBgKey =
    backgroundType && BACKGROUNDS[backgroundType]
      ? backgroundType
      : randomFrom(backgroundKeys);

  const background = BACKGROUNDS[resolvedBgKey];
  const familyStatus = rollFamilyStatus();
  const motivation = getMotivation();
  const quirk = randomFrom(PERSONALITY_QUIRKS);
  const childhoodEvent = randomFrom(CHILDHOOD_EVENTS);

  const count = Math.min(Math.max(lifeEventCount, 1), 5);
  const usedRolls = new Set();
  const lifeEvents = [];
  while (lifeEvents.length < count) {
    const event = rollLifeEvent();
    if (!usedRolls.has(event.roll)) {
      usedRolls.add(event.roll);
      lifeEvents.push(event);
    }
  }

  const narrative = generateBackstory(race, classType, resolvedBgKey);

  return {
    race,
    classType,
    background,
    familyStatus,
    childhoodEvent,
    lifeEvents,
    motivation,
    quirk,
    narrative,
  };
}
