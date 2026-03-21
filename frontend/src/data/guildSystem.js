/**
 * Guild System — Adventurers' guilds, rank progression, missions, perks, and events.
 *
 * Roadmap items covered:
 *   191 — Guild system (types, ranks, missions, perks, events)
 *
 * No React. All data is plain JS objects and arrays.
 * Helper functions are exported at the bottom.
 */

// ---------------------------------------------------------------------------
// GUILD TYPES
// ---------------------------------------------------------------------------

export const GUILD_TYPES = {
  adventurers: {
    id: 'adventurers',
    name: "Adventurers' Guild",
    icon: '⚔️',
    alignmentTendency: 'Any — loose code of conduct required',
    description:
      'The most open of guilds, accepting sellswords, explorers, and treasure hunters alike. They post public contracts, arbitrate disputes between members, and provide a veneer of legitimacy to those who might otherwise be seen as vagrants with swords.',
    typicalServices: [
      'Contract posting and arbitration',
      'Equipment rental and storage',
      'Bounty registration and collection',
      'Emergency rescue coordination',
      'Monster-bounty verification',
    ],
    entryRequirements: [
      'Registration fee (5 gp)',
      'Demonstration of basic combat or exploration competency',
      'Sworn oath to the guild charter (no unprovoked attacks on citizens)',
    ],
  },
  thieves: {
    id: 'thieves',
    name: "Thieves' Guild",
    icon: '🗝️',
    alignmentTendency: 'Neutral Evil, Chaotic Neutral',
    description:
      'Operating in shadow behind a dozen legitimate fronts, the Thieves\' Guild taxes every criminal enterprise in the city and offers protection, fencing, and legal cover to those who pay their dues. Membership is rarely advertised.',
    typicalServices: [
      'Fencing stolen goods (40–60% of value)',
      'Forged documents and identities',
      'Safe houses and escape routes',
      'Contract theft and burglary',
      'Information brokering',
    ],
    entryRequirements: [
      'Invitation or sponsorship by a current member',
      'Completion of a proving job without being caught',
      'Blood oath of secrecy',
      'Cut of all earnings paid to the guild (15%)',
    ],
  },
  mages: {
    id: 'mages',
    name: "Mages' Guild",
    icon: '📜',
    alignmentTendency: 'Lawful Neutral, Neutral Good',
    description:
      'Part academic institution, part regulatory body, the Mages\' Guild controls the legal practice of arcane magic in most cities. They license spellcasters, maintain libraries of spells and lore, and investigate illegal magical activity.',
    typicalServices: [
      'Spell research and identification',
      'Scroll scribing and enchanting commissions',
      'Arcane library access',
      'Licensing for public spellcasting',
      'Magical item appraisal',
    ],
    entryRequirements: [
      'Demonstrated ability to cast at least one arcane spell',
      'Arcane aptitude test (Arcana DC 12)',
      'Registration fee (25 gp)',
      'Agreement to report all new spells discovered',
    ],
  },
  merchants: {
    id: 'merchants',
    name: "Merchants' Guild",
    icon: '💰',
    alignmentTendency: 'Lawful Neutral, Lawful Good',
    description:
      'The backbone of the city\'s economy, the Merchants\' Guild controls trade licenses, sets fair-market standards, and lobbies city councils on commerce policy. Membership grants access to trade routes, credit, and influential social circles.',
    typicalServices: [
      'Trade licenses and letters of credit',
      'Caravan protection coordination',
      'Price arbitration and dispute resolution',
      'Banking and money exchange',
      'Market stall and warehouse access',
    ],
    entryRequirements: [
      'Proof of a legitimate trade or business',
      'Annual dues (50 gp)',
      'Two member endorsements',
      'Background check by guild auditors',
    ],
  },
  fighters: {
    id: 'fighters',
    name: "Fighters' Guild",
    icon: '🛡️',
    alignmentTendency: 'Lawful Neutral, Lawful Good',
    description:
      'Part military fraternity, part licensed mercenary company, the Fighters\' Guild trains warriors, certifies combat instructors, and dispatches companies for hire. Members receive access to training grounds, weapon smiths, and veterans\' networks.',
    typicalServices: [
      'Mercenary contracts (licensed)',
      'Combat training and sparring',
      'Weapon and armor maintenance',
      'Tournament organisation',
      'Bodyguard placement',
    ],
    entryRequirements: [
      'Sparring evaluation (Athletics or weapon attack roll vs. DC 13)',
      'Registration fee (10 gp)',
      'No active criminal warrants',
    ],
  },
  artisans: {
    id: 'artisans',
    name: "Artisans' Guild",
    icon: '🔨',
    alignmentTendency: 'Lawful Good, Neutral Good',
    description:
      'The Artisans\' Guild encompasses smiths, carpenters, tailors, jewelers, and any skilled craftsperson who trades in physical goods. It sets quality standards, controls apprenticeships, and lobbies against cheap foreign imports.',
    typicalServices: [
      'Masterwork commissions and quality certification',
      'Apprenticeship placement',
      'Raw material procurement at bulk rates',
      'Workshop rental',
      'Guild mark of quality (increases item value 10%)',
    ],
    entryRequirements: [
      'Journeyman-level skill demonstration (relevant Tool proficiency check DC 14)',
      'Craft a qualifying sample piece',
      'Sponsorship by a master artisan',
      'Annual dues (20 gp)',
    ],
  },
  healers: {
    id: 'healers',
    name: "Healers' Guild",
    icon: '⚕️',
    alignmentTendency: 'Neutral Good, Lawful Good',
    description:
      'The Healers\' Guild encompasses clerics, herbalists, surgeons, and apothecaries. They operate licensed infirmaries, maintain standards of care, and provide medical services to the community — sometimes free to those who cannot pay, funded by wealthier patrons.',
    typicalServices: [
      'Infirmary and long-term care',
      'Potion and remedy dispensing',
      'Disease and curse identification',
      'Training in Medicine skill',
      'Emergency triage for city watch and guard',
    ],
    entryRequirements: [
      'Medicine or herbalism proficiency',
      'Demonstrated ability to stabilise a dying creature',
      'Oath to cause no harm through neglect',
      'Registration fee (15 gp)',
    ],
  },
  assassins: {
    id: 'assassins',
    name: "Assassins' Guild",
    icon: '🗡️',
    alignmentTendency: 'Neutral Evil, Lawful Evil',
    description:
      'The most secretive and feared of all guilds, the Assassins\' Guild operates under strict internal law: contracts are binding, identities protected, and failures punished. Members call it "the Compact." To outsiders it does not officially exist.',
    typicalServices: [
      'Assassination contracts (verified, anonymous)',
      'Poison procurement and crafting',
      'Surveillance and intelligence gathering',
      'Witness elimination',
      'Political destabilisation',
    ],
    entryRequirements: [
      'Invitation only — vouched for by two full members',
      'Completion of an unsanctioned kill (proof required)',
      'Full identity dossier surrendered to the guild (leverage)',
      'Blood oath — breaking contracts is punishable by death',
    ],
  },
};

// ---------------------------------------------------------------------------
// GUILD RANKS
// ---------------------------------------------------------------------------

export const GUILD_RANKS = [
  {
    rank: 1,
    title: 'Initiate',
    reputationRequired: 0,
    xpRequired: 0,
    dues: 1,
    description: 'Newly accepted. Probationary status. Watched closely by senior members.',
    privileges: [
      'Access to the public guild hall',
      'Can accept Rank 1 missions',
      'Basic equipment borrowing (non-magical)',
    ],
  },
  {
    rank: 2,
    title: 'Apprentice',
    reputationRequired: 50,
    xpRequired: 300,
    dues: 2,
    description: 'Has completed several missions successfully. Trusted to work without supervision.',
    privileges: [
      'All Initiate privileges',
      'Access to Rank 1–2 missions',
      'Discount at affiliated vendors (5%)',
      'Use of the guild dormitory',
    ],
  },
  {
    rank: 3,
    title: 'Journeyman',
    reputationRequired: 150,
    xpRequired: 900,
    dues: 5,
    description: 'A reliable, tested member. Beginning to build a reputation beyond the guild.',
    privileges: [
      'All Apprentice privileges',
      'Access to Rank 1–3 missions',
      'Discount at affiliated vendors (10%)',
      'One guild contact (NPC ally)',
      'Access to the members-only common room',
    ],
  },
  {
    rank: 4,
    title: 'Member',
    reputationRequired: 350,
    xpRequired: 2700,
    dues: 10,
    description: 'Full member in good standing. Recognised by name across multiple cities.',
    privileges: [
      'All Journeyman privileges',
      'Access to all non-officer missions',
      'Discount at affiliated vendors (15%)',
      'Two guild contacts',
      'Safe house access (one city)',
      'Guild legal protection (basic)',
    ],
  },
  {
    rank: 5,
    title: 'Senior Member',
    reputationRequired: 700,
    xpRequired: 6500,
    dues: 20,
    description: 'A veteran whose word carries weight. May supervise lower-ranked members on missions.',
    privileges: [
      'All Member privileges',
      'Discount at affiliated vendors (20%)',
      'Three guild contacts',
      'Safe house access (three cities)',
      'Guild legal protection (advanced — can call in favors)',
      'Access to restricted guild library or training materials',
    ],
  },
  {
    rank: 6,
    title: 'Officer',
    reputationRequired: 1200,
    xpRequired: 14000,
    dues: 50,
    description: 'Holds administrative authority. Manages a division, territory, or mission category.',
    privileges: [
      'All Senior Member privileges',
      'Discount at affiliated vendors (25%)',
      'Five guild contacts (including at least one noble or official)',
      'Safe house access (any city the guild operates in)',
      'Full legal protection',
      'Political influence (letters of introduction, testimony)',
      'Access to officer-only missions and briefings',
    ],
  },
  {
    rank: 7,
    title: 'Master',
    reputationRequired: 2000,
    xpRequired: 34000,
    dues: 100,
    description: 'One of the guild\'s foremost experts. Sits on the guild council. Policy decisions require their vote.',
    privileges: [
      'All Officer privileges',
      'Unlimited vendor discounts within the guild network',
      'Extensive contact network (8+ NPCs)',
      'Safe house access anywhere (including hidden emergency locations)',
      'High political influence — nobles return letters promptly',
      'Access to the guild vault (borrowed equipment)',
      'Can sponsor new members and promote Journeymen',
    ],
  },
  {
    rank: 8,
    title: 'Guildmaster',
    reputationRequired: 5000,
    xpRequired: 100000,
    dues: 0,
    description: 'The elected or appointed head of the guild. Absolute authority over guild affairs. No dues — the guild funds them.',
    privileges: [
      'All Master privileges',
      'Command over all guild operations',
      'Unlimited access to guild resources',
      'Diplomatic recognition as a faction leader',
      'Can declare guild wars or forge alliances',
      'Direct audience with city rulers and royalty',
      'Guild treasury access',
    ],
  },
];

// ---------------------------------------------------------------------------
// GUILD MISSIONS
// ---------------------------------------------------------------------------

export const GUILD_MISSIONS = {
  adventurers: [
    { id: 'adv-1', rank: 1, title: 'Clear the {location} of Rats', difficulty: 'Easy', rewardGp: [5, 20], reputationGain: 10, description: 'A local {building_type} is infested with giant rats. The owner offers a bounty of {reward} gp. Expected resistance: CR 1/4 creatures only.', tags: ['extermination', 'urban'] },
    { id: 'adv-2', rank: 1, title: 'Escort the Merchant to {town}', difficulty: 'Easy', rewardGp: [10, 30], reputationGain: 10, description: 'A merchant fears bandits on the road to {town}. Protect them and their goods. Distance: roughly one day\'s travel.', tags: ['escort', 'travel'] },
    { id: 'adv-3', rank: 2, title: 'Recover the {item} from {dungeon}', difficulty: 'Medium', rewardGp: [50, 150], reputationGain: 25, description: 'A {client_type} has lost a {item} somewhere in the {dungeon}. Retrieve it intact. Warning: the dungeon is not unoccupied.', tags: ['retrieval', 'dungeon'] },
    { id: 'adv-4', rank: 2, title: 'Bounty: {creature} Spotted Near {village}', difficulty: 'Medium', rewardGp: [75, 200], reputationGain: 30, description: 'A {creature} has been terrorising {village}. The guild posts a bounty for proof of its death. Bring the head or a verified trophy.', tags: ['bounty', 'monster'] },
    { id: 'adv-5', rank: 3, title: 'Explore and Map {ruin}', difficulty: 'Hard', rewardGp: [150, 400], reputationGain: 50, description: 'The guild wants a complete map of {ruin}. Mark hazards, occupants, and any items of interest. Survey quality will be inspected.', tags: ['exploration', 'cartography'] },
    { id: 'adv-6', rank: 4, title: 'Eliminate the {bandit_leader} and Their Band', difficulty: 'Deadly', rewardGp: [300, 800], reputationGain: 75, description: '{bandit_leader} commands a force of {number} bandits operating from {location}. The reward covers elimination of the leader and dispersal of the band.', tags: ['combat', 'bounty'] },
  ],
  thieves: [
    { id: 'thi-1', rank: 1, title: 'Lift the Ledger from {target}\'s Office', difficulty: 'Easy', rewardGp: [20, 50], reputationGain: 15, description: 'A contact needs the account ledger from {target}\'s {location}. No witnesses. Return the ledger by dawn; it will be copied and returned.', tags: ['theft', 'stealth'] },
    { id: 'thi-2', rank: 1, title: 'Deliver the Package to {contact} — No Questions', difficulty: 'Easy', rewardGp: [15, 40], reputationGain: 10, description: 'Courier a sealed package across {district}. Do not open it. Do not let it be inspected. Lose any tails before delivery.', tags: ['courier', 'stealth'] },
    { id: 'thi-3', rank: 2, title: 'Fence the {item} Quietly', difficulty: 'Medium', rewardGp: [50, 120], reputationGain: 20, description: 'A member needs {item} moved to a buyer in {city}. Avoid guild rivals and city watch. Your cut: 20% of the sale price.', tags: ['fencing', 'social'] },
    { id: 'thi-4', rank: 2, title: 'Blackmail the {noble_title}', difficulty: 'Medium', rewardGp: [100, 300], reputationGain: 30, description: 'Gather compromising evidence on {noble_title}. The guild will handle the approach. Your role: surveillance and documentation.', tags: ['espionage', 'intelligence'] },
    { id: 'thi-5', rank: 3, title: 'Break Into {location} and Plant the Evidence', difficulty: 'Hard', rewardGp: [200, 500], reputationGain: 50, description: 'Infiltrate the {location} and leave forged documents in {target}\'s possession. Framing must be airtight. If caught, the guild disavows you.', tags: ['infiltration', 'deception'] },
    { id: 'thi-6', rank: 4, title: 'Eliminate Rival Guild Operative', difficulty: 'Deadly', rewardGp: [400, 1000], reputationGain: 80, description: 'A rival guild\'s enforcer has been disrupting operations. Locate {target}, confirm identity, and ensure they do not interfere again. Clean.', tags: ['elimination', 'covert'] },
  ],
  mages: [
    { id: 'mag-1', rank: 1, title: 'Transcribe the {spell} Scroll', difficulty: 'Easy', rewardGp: [10, 30], reputationGain: 10, description: 'The guild library needs a clean copy of a {spell} scroll. Use the provided materials. Accuracy is graded; errors mean no pay.', tags: ['scribing', 'research'] },
    { id: 'mag-2', rank: 1, title: 'Identify the Items from the {estate} Estate Sale', difficulty: 'Easy', rewardGp: [20, 60], reputationGain: 15, description: 'A noble estate sold a lot of unusual objects. Attend the sale, use Identify or Arcana checks, and report findings to the guild for cataloguing.', tags: ['identification', 'appraisal'] },
    { id: 'mag-3', rank: 2, title: 'Investigate the Wild Magic Surge in {district}', difficulty: 'Medium', rewardGp: [75, 200], reputationGain: 25, description: 'Residents near {district} report strange effects: spontaneous fire, floating objects, temporal ripples. Identify the source and neutralise or report it.', tags: ['investigation', 'arcane'] },
    { id: 'mag-4', rank: 2, title: 'Retrieve the Stolen Grimoire of {mage}', difficulty: 'Medium', rewardGp: [100, 250], reputationGain: 35, description: 'The grimoire of {mage}, a deceased master, was stolen from guild archives. Track it through the black market and recover it without its contents spreading.', tags: ['retrieval', 'investigation'] },
    { id: 'mag-5', rank: 3, title: 'Shut Down the Unlicensed Spell-Forge in {location}', difficulty: 'Hard', rewardGp: [200, 500], reputationGain: 55, description: 'Someone is producing unlicensed enchanted weapons in {location}. The guild wants the operation shut down and the proprietor brought before the council — alive.', tags: ['enforcement', 'arcane'] },
    { id: 'mag-6', rank: 4, title: 'Seal the Rift at {site}', difficulty: 'Deadly', rewardGp: [500, 1500], reputationGain: 90, description: 'A planar rift has opened at {site} and is growing. The guild provides the ritual components; the party must reach the site and perform the sealing under pressure.', tags: ['planar', 'ritual', 'combat'] },
  ],
  merchants: [
    { id: 'mer-1', rank: 1, title: 'Deliver the Shipment to {merchant} in {town}', difficulty: 'Easy', rewardGp: [15, 40], reputationGain: 10, description: 'A routine delivery job. Transport goods worth {value} gp to {merchant} in {town}. Keep the manifest accurate and return a signed receipt.', tags: ['courier', 'travel'] },
    { id: 'mer-2', rank: 1, title: 'Audit the {warehouse} Inventory', difficulty: 'Easy', rewardGp: [10, 25], reputationGain: 8, description: 'A guild member suspects their {warehouse} manager of skimming. Count the inventory against the books and report discrepancies.', tags: ['audit', 'investigation'] },
    { id: 'mer-3', rank: 2, title: 'Negotiate the Trade Agreement with {faction}', difficulty: 'Medium', rewardGp: [100, 300], reputationGain: 30, description: 'The guild wants preferential rates from {faction} traders. Attend the meeting as guild representative. Success means a long-term contract worth thousands.', tags: ['negotiation', 'social'] },
    { id: 'mer-4', rank: 2, title: 'Recover the Stolen Caravan Assets', difficulty: 'Medium', rewardGp: [75, 200], reputationGain: 25, description: 'Bandits hit a guild caravan on the {road} road. Locate the stolen goods and return them — or find the bandits and make an example.', tags: ['recovery', 'combat'] },
    { id: 'mer-5', rank: 3, title: 'Expose the {competitor}\'s Trade Fraud', difficulty: 'Hard', rewardGp: [200, 600], reputationGain: 50, description: 'Gather proof that {competitor} is short-weighing goods and bribing inspectors. Present evidence to the city trade council.', tags: ['investigation', 'legal'] },
    { id: 'mer-6', rank: 4, title: 'Secure the {resource} Source in {region}', difficulty: 'Deadly', rewardGp: [400, 1200], reputationGain: 80, description: 'A rival merchant consortium is muscling in on a key {resource} supply in {region}. Establish guild presence there by any means necessary.', tags: ['territory', 'combat', 'negotiation'] },
  ],
  fighters: [
    { id: 'fig-1', rank: 1, title: 'Bodyguard Duty for {client} — One Evening', difficulty: 'Easy', rewardGp: [10, 30], reputationGain: 10, description: 'Stand guard for {client} during a public event in {location}. Expect no trouble; prevent any that arises. Professional appearance required.', tags: ['bodyguard', 'social'] },
    { id: 'fig-2', rank: 1, title: 'Train the {village} Militia', difficulty: 'Easy', rewardGp: [20, 50], reputationGain: 12, description: 'A village of {size} needs basic weapons training. Spend three days putting {number} farmers through basic drill. Report their readiness honestly.', tags: ['training', 'travel'] },
    { id: 'fig-3', rank: 2, title: 'Represent the Guild in the {city} Tournament', difficulty: 'Medium', rewardGp: [0, 200], reputationGain: 40, description: 'Enter the {city} fighting tournament as a guild representative. Win (or lose honorably). Prize: {reward} gp. Guild reputation rises or falls with your performance.', tags: ['tournament', 'combat'] },
    { id: 'fig-4', rank: 2, title: 'Put Down the Deserter Unit at {location}', difficulty: 'Medium', rewardGp: [80, 220], reputationGain: 30, description: 'A squad of {number} former soldiers has gone rogue near {location}. The guild has a contract to neutralise them. Capture preferred; bodies accepted.', tags: ['combat', 'bounty'] },
    { id: 'fig-5', rank: 3, title: 'Reinforce the {keep} Garrison Under Siege', difficulty: 'Hard', rewardGp: [250, 700], reputationGain: 60, description: '{keep} is besieged. The guild contract requires breaking through, reinforcing the garrison, and holding for {days} days until relief arrives.', tags: ['siege', 'combat'] },
    { id: 'fig-6', rank: 4, title: 'Hunt the Warlord {name} and Bring the War to an End', difficulty: 'Deadly', rewardGp: [500, 2000], reputationGain: 100, description: 'Warlord {name} commands {number} troops and controls {territory}. Eliminate the leadership. The guild\'s contract is with the opposing faction; results must be decisive.', tags: ['assassination', 'warfare'] },
  ],
  artisans: [
    { id: 'art-1', rank: 1, title: 'Craft {quantity} Standard {item} for the {client}', difficulty: 'Easy', rewardGp: [10, 40], reputationGain: 8, description: 'A straightforward commission: {quantity} units of {item} to standard guild quality. Delivery deadline: {days} days. Tools and raw materials provided.', tags: ['commission', 'crafting'] },
    { id: 'art-2', rank: 1, title: 'Repair the {item} Before the {event}', difficulty: 'Easy', rewardGp: [15, 35], reputationGain: 10, description: '{item} was damaged and must be repaired before {event} in {days} days. The owner is anxious. Bonus pay if finished early.', tags: ['repair', 'crafting'] },
    { id: 'art-3', rank: 2, title: 'Appraise the {estate}\'s Inventory of Goods', difficulty: 'Medium', rewardGp: [50, 120], reputationGain: 20, description: 'A {estate} estate is being liquidated. Appraise all craft goods, furnishings, and tools. Your assessment sets the auction floor price.', tags: ['appraisal', 'social'] },
    { id: 'art-4', rank: 2, title: 'Sabotage the {rival}\'s Workshop Deadline', difficulty: 'Medium', rewardGp: [80, 200], reputationGain: 25, description: 'A guild member needs {rival}\'s major commission delayed. Cause non-destructive setbacks without direct evidence linking back to the guild.', tags: ['sabotage', 'stealth'] },
    { id: 'art-5', rank: 3, title: 'Create the Masterwork {item} for {noble}', difficulty: 'Hard', rewardGp: [200, 600], reputationGain: 55, description: '{noble} commissions a masterwork {item}. Guild reputation is on the line. The piece must meet guild master standards or the commission is unpaid.', tags: ['masterwork', 'crafting'] },
    { id: 'art-6', rank: 4, title: 'Recover the Stolen Forge-Plans for {invention}', difficulty: 'Deadly', rewardGp: [400, 900], reputationGain: 70, description: 'Designs for {invention} were stolen by a foreign agent. Recover them before they leave the country. Force authorised.', tags: ['retrieval', 'combat', 'espionage'] },
  ],
  healers: [
    { id: 'hea-1', rank: 1, title: 'Staff the {village} Infirmary for One Week', difficulty: 'Easy', rewardGp: [10, 25], reputationGain: 10, description: '{village}\'s healer is ill. Staff the infirmary for one week: basic injuries, common ailments, childbirth support. Guild supplies provided.', tags: ['medical', 'travel'] },
    { id: 'hea-2', rank: 1, title: 'Identify and Contain the Illness in {district}', difficulty: 'Easy', rewardGp: [20, 50], reputationGain: 15, description: 'An unusual illness is spreading in {district}. Identify the pathogen (Medicine DC 13), recommend treatment, and prevent further spread.', tags: ['disease', 'investigation'] },
    { id: 'hea-3', rank: 2, title: 'Source Rare {herb} from the {location} Wilderness', difficulty: 'Medium', rewardGp: [60, 150], reputationGain: 25, description: 'The guild is out of {herb}, critical for treating {condition}. Travel to {location}, gather {quantity} doses, and return them safely.', tags: ['foraging', 'travel'] },
    { id: 'hea-4', rank: 2, title: 'Treat the Survivors of the {disaster}', difficulty: 'Medium', rewardGp: [50, 130], reputationGain: 35, description: 'A {disaster} has left {number} injured. Triage, treat, and stabilise. You will be rated on lives saved and speed of response. Community reputation impact.', tags: ['triage', 'mass-casualty'] },
    { id: 'hea-5', rank: 3, title: 'Lift the Curse Afflicting {noble_or_village}', difficulty: 'Hard', rewardGp: [200, 600], reputationGain: 55, description: '{target} has been cursed and conventional medicine has failed. Identify the curse (Arcana/Religion DC 15), source the countermeasure, and administer the cure.', tags: ['curse', 'ritual'] },
    { id: 'hea-6', rank: 4, title: 'Contain the Plague Before It Reaches {city}', difficulty: 'Deadly', rewardGp: [500, 1500], reputationGain: 90, description: 'A virulent plague is sweeping toward {city}. Identify the source, create or obtain a mass-cure, and administer it across the affected region before deaths become uncountable.', tags: ['plague', 'mass-casualty', 'ritual'] },
  ],
  assassins: [
    { id: 'ass-1', rank: 1, title: 'Surveil {target} for Three Days', difficulty: 'Easy', rewardGp: [30, 80], reputationGain: 15, description: 'Map {target}\'s daily routine, identify contacts, note security. Written report only — no engagement. A senior member reviews your work.', tags: ['surveillance', 'stealth'] },
    { id: 'ass-2', rank: 1, title: 'Deliver the Warning to {target}', difficulty: 'Easy', rewardGp: [25, 60], reputationGain: 10, description: 'Leave the Compact\'s mark where {target} will find it. No direct contact. The message is the threat. Do not be seen.', tags: ['intimidation', 'stealth'] },
    { id: 'ass-3', rank: 2, title: 'Poison the {target}\'s Food Supply', difficulty: 'Medium', rewardGp: [100, 280], reputationGain: 30, description: 'Infiltrate {target}\'s household and administer a slow-acting poison (provided). Death must appear natural. Timeline: within {days} days.', tags: ['poisoning', 'infiltration'] },
    { id: 'ass-4', rank: 2, title: 'Extract the Captive from {location}', difficulty: 'Medium', rewardGp: [120, 300], reputationGain: 35, description: 'The guild needs {captive} alive and removed from {location} without alarm. Neutralise guards silently. The captive is not to be harmed.', tags: ['extraction', 'stealth'] },
    { id: 'ass-5', rank: 3, title: 'Eliminate {target} at the {event}', difficulty: 'Hard', rewardGp: [300, 800], reputationGain: 60, description: 'Contract: {target} dies at {event}. Maximum confusion — blame must fall on a rival faction. You have until the {event} ends to execute cleanly.', tags: ['assassination', 'deception', 'social'] },
    { id: 'ass-6', rank: 4, title: 'Decapitate the {organization}\'s Leadership', difficulty: 'Deadly', rewardGp: [800, 3000], reputationGain: 100, description: 'Three senior members of {organization} must die within the same 24-hour window. Simultaneous strikes. Guild provides one other operative. You lead.', tags: ['assassination', 'coordination', 'combat'] },
  ],
};

// ---------------------------------------------------------------------------
// GUILD PERKS (by rank)
// ---------------------------------------------------------------------------

export const GUILD_PERKS = [
  {
    rank: 1,
    label: 'Initiate',
    discountPercent: 0,
    safeHouses: 0,
    contacts: 0,
    infoNetwork: false,
    legalProtection: 'none',
    equipmentAccess: 'Basic non-magical gear borrowing',
    politicalInfluence: 'none',
    notes: 'Probationary. No special privileges beyond guild hall access and public mission board.',
  },
  {
    rank: 2,
    label: 'Apprentice',
    discountPercent: 5,
    safeHouses: 0,
    contacts: 0,
    infoNetwork: false,
    legalProtection: 'none',
    equipmentAccess: 'Standard gear and tools at guild cost',
    politicalInfluence: 'none',
    notes: 'Access to the guild dormitory. May participate in group missions led by senior members.',
  },
  {
    rank: 3,
    label: 'Journeyman',
    discountPercent: 10,
    safeHouses: 0,
    contacts: 1,
    infoNetwork: false,
    legalProtection: 'character reference',
    equipmentAccess: 'Standard gear; can request uncommon tools with 24h notice',
    politicalInfluence: 'none',
    notes: 'One named NPC contact. Guild will vouch for character in minor legal matters.',
  },
  {
    rank: 4,
    label: 'Member',
    discountPercent: 15,
    safeHouses: 1,
    contacts: 2,
    infoNetwork: true,
    legalProtection: 'guild solicitor for minor crimes',
    equipmentAccess: 'Uncommon gear; some guild-owned items available on loan',
    politicalInfluence: 'low',
    notes: 'Full guild membership. Information network: rumours and local intel once per week. Safe house in home city.',
  },
  {
    rank: 5,
    label: 'Senior Member',
    discountPercent: 20,
    safeHouses: 3,
    contacts: 3,
    infoNetwork: true,
    legalProtection: 'guild solicitor + one favour call',
    equipmentAccess: 'Uncommon and some rare gear on loan; priority access',
    politicalInfluence: 'moderate',
    notes: 'Trusted veteran. Can call in one guild favour per month for extraction, legal aid, or information. Info network expands to regional.',
  },
  {
    rank: 6,
    label: 'Officer',
    discountPercent: 25,
    safeHouses: 99,
    contacts: 5,
    infoNetwork: true,
    legalProtection: 'full guild legal support — can influence courts',
    equipmentAccess: 'Rare gear available; can access the guild vault with approval',
    politicalInfluence: 'significant',
    notes: 'Administrative authority. Contacts include at least one noble, government official, or equivalent. Letters of introduction to foreign guilds.',
  },
  {
    rank: 7,
    label: 'Master',
    discountPercent: 100,
    safeHouses: 99,
    contacts: 8,
    infoNetwork: true,
    legalProtection: 'near-immunity — guild can quash charges in most jurisdictions',
    equipmentAccess: 'Guild vault access; can borrow legendary items with council vote',
    politicalInfluence: 'high',
    notes: 'Sits on guild council. Can promote Journeymen to Member. Guild network spans multiple regions. Reputation alone opens doors.',
  },
  {
    rank: 8,
    label: 'Guildmaster',
    discountPercent: 100,
    safeHouses: 99,
    contacts: 99,
    infoNetwork: true,
    legalProtection: 'diplomatic immunity equivalent in most regions',
    equipmentAccess: 'Unrestricted guild vault access',
    politicalInfluence: 'faction-level',
    notes: 'Absolute authority. Can declare alliances, guild wars, or guild-wide policies. Treated as a minor noble or faction leader by governments.',
  },
];

// ---------------------------------------------------------------------------
// GUILD EVENTS
// ---------------------------------------------------------------------------

export const GUILD_EVENTS = [
  // --- Internal politics ---
  {
    id: 'evt-politics-1',
    category: 'internal_politics',
    title: 'Election Dispute',
    description: 'Two officers are contesting an election for a vacant master position. Members are being pressured to pick sides. Guild operations slow as the infighting escalates.',
    affectedGuilds: ['adventurers', 'mages', 'merchants', 'fighters', 'artisans', 'healers'],
    reputationEffect: 0,
    standingEffect: -5,
    partyOptions: [
      { action: 'Back a candidate', outcome: 'Gain a powerful patron — or a powerful enemy depending on who wins.' },
      { action: 'Investigate corruption in the election', outcome: 'Expose the cheating candidate. Guild gratitude +20 reputation.' },
      { action: 'Stay neutral', outcome: 'Lose no standing but miss an opportunity for patronage.' },
    ],
  },
  {
    id: 'evt-politics-2',
    category: 'internal_politics',
    title: 'Embezzlement Scandal',
    description: 'An officer has been siphoning guild funds. The council has discovered it but wants to handle it quietly to avoid a scandal.',
    affectedGuilds: ['adventurers', 'merchants', 'mages', 'artisans'],
    reputationEffect: -10,
    standingEffect: 0,
    partyOptions: [
      { action: 'Help gather evidence discreetly', outcome: '+25 reputation; officer removed cleanly.' },
      { action: 'Expose publicly', outcome: 'Short-term guild embarrassment but long-term reform. Mixed reception.' },
      { action: 'Blackmail the officer', outcome: 'Personal leverage gained; guild eventually finds out.' },
    ],
  },
  {
    id: 'evt-politics-3',
    category: 'internal_politics',
    title: 'Reformer Movement',
    description: 'A faction of junior members is pushing for lower dues, better pay on missions, and more transparency. Senior leadership is resistant.',
    affectedGuilds: ['adventurers', 'fighters', 'artisans', 'healers'],
    reputationEffect: 0,
    standingEffect: 0,
    partyOptions: [
      { action: 'Support the reformers', outcome: 'Beloved by lower ranks; distrusted by officers.' },
      { action: 'Support the leadership', outcome: 'Trusted by officers; lower ranks see you as a lackey.' },
      { action: 'Mediate a compromise', outcome: 'Difficult (Persuasion DC 17) but earns respect from both sides.' },
    ],
  },

  // --- Rival guild conflicts ---
  {
    id: 'evt-rival-1',
    category: 'rival_conflict',
    title: 'Rival Guild Poaching Members',
    description: 'A rival guild is offering bonuses and better contracts to lure away mid-rank members. Three have already defected.',
    affectedGuilds: ['adventurers', 'fighters', 'thieves', 'artisans'],
    reputationEffect: -5,
    standingEffect: 0,
    partyOptions: [
      { action: 'Investigate and expose rival guild\'s funding source', outcome: 'Undermines their offer. Guild offers you a retainer.' },
      { action: 'Counter-recruit on the guild\'s behalf', outcome: 'Recover defectors; standing +10.' },
      { action: 'Switch guilds yourself', outcome: 'Short-term gain; bridges burned.' },
    ],
  },
  {
    id: 'evt-rival-2',
    category: 'rival_conflict',
    title: 'Territory Dispute',
    description: 'A rival guild is operating in the guild\'s claimed district, undercutting prices. Tensions are approaching violence.',
    affectedGuilds: ['thieves', 'merchants', 'assassins', 'fighters'],
    reputationEffect: 0,
    standingEffect: -10,
    partyOptions: [
      { action: 'Muscle the rival guild out', outcome: 'Effective but risks street war. Standing +15 if successful.' },
      { action: 'Broker a territorial agreement', outcome: 'Persuasion DC 16. Peace at cost of some district income.' },
      { action: 'Sabotage the rival\'s reputation with clients', outcome: 'Deception DC 14. Slow but clean.' },
    ],
  },
  {
    id: 'evt-rival-3',
    category: 'rival_conflict',
    title: 'Spy Discovered in the Guild',
    description: 'A member has been identified as a plant from a rival guild. They have been feeding information for months.',
    affectedGuilds: ['thieves', 'mages', 'assassins', 'merchants'],
    reputationEffect: -15,
    standingEffect: 5,
    partyOptions: [
      { action: 'Help interrogate the spy', outcome: 'Intelligence gained on rival guild; standing +20.' },
      { action: 'Turn the spy into a double agent', outcome: 'Intelligence DC 16. If successful, major coup; if failed, spy escapes with guild secrets.' },
      { action: 'Eliminate the spy quietly', outcome: 'Clean but loses the intelligence opportunity.' },
    ],
  },

  // --- Guild hall events ---
  {
    id: 'evt-hall-1',
    category: 'guild_hall',
    title: 'Guild Hall Fire',
    description: 'A fire breaks out in the guild hall — arson suspected. The records room is threatened. Members scramble to evacuate people and save the archives.',
    affectedGuilds: ['adventurers', 'mages', 'artisans', 'merchants', 'healers', 'fighters'],
    reputationEffect: 0,
    standingEffect: 0,
    partyOptions: [
      { action: 'Help fight the fire and save the archives', outcome: 'Standing +15; specific records saved may be significant.' },
      { action: 'Investigate the arson source', outcome: 'Investigation DC 14. Identify the culprit; major standing gain.' },
      { action: 'Protect members and evacuate', outcome: 'Lives saved; community goodwill rises.' },
    ],
  },
  {
    id: 'evt-hall-2',
    category: 'guild_hall',
    title: 'Important Visitor Arrives Unannounced',
    description: 'A foreign dignitary, rival guild master, or high-ranking noble shows up at the guild hall with a proposal — and the Guildmaster is away.',
    affectedGuilds: ['adventurers', 'mages', 'merchants', 'fighters', 'healers'],
    reputationEffect: 0,
    standingEffect: 0,
    partyOptions: [
      { action: 'Host and entertain diplomatically', outcome: 'Persuasion DC 13. Impressed visitor; potential alliance.' },
      { action: 'Stall until Guildmaster returns', outcome: 'Safe but visitor is mildly annoyed.' },
      { action: 'Negotiate on the guild\'s behalf', outcome: 'Risky. Great success or great embarrassment.' },
    ],
  },
  {
    id: 'evt-hall-3',
    category: 'guild_hall',
    title: 'Annual Rank Review',
    description: 'The guild holds its annual promotion review. Members with enough reputation are evaluated. Politics play a role; not everyone advances on merit alone.',
    affectedGuilds: ['adventurers', 'mages', 'merchants', 'fighters', 'artisans', 'healers', 'thieves', 'assassins'],
    reputationEffect: 0,
    standingEffect: 0,
    partyOptions: [
      { action: 'Prepare a portfolio of completed missions', outcome: 'Straightforward advancement if reputation qualifies.' },
      { action: 'Lobby officers before the review', outcome: 'Persuasion DC 12. Advantage on the evaluation.' },
      { action: 'Call in a favour from a senior member', outcome: 'Uses one favour. Guaranteed promotion if eligible.' },
    ],
  },
  {
    id: 'evt-hall-4',
    category: 'guild_hall',
    title: 'Guild Treasury Audit Reveals Shortfall',
    description: 'The annual audit shows the guild treasury is significantly short. Dues may rise, mission payouts may be cut, or the cause may be sinister.',
    affectedGuilds: ['adventurers', 'merchants', 'artisans', 'fighters'],
    reputationEffect: -5,
    standingEffect: 0,
    partyOptions: [
      { action: 'Volunteer to investigate the shortfall', outcome: 'Investigation DC 13. May uncover embezzlement or poor management.' },
      { action: 'Help fundraise or take underpaid missions', outcome: 'Goodwill earned; modest standing gain.' },
      { action: 'Protest the potential dues increase publicly', outcome: 'Popular with members; unpopular with leadership.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

const _pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Returns the guild type object for a given guild id.
 * @param {string} id - One of the keys in GUILD_TYPES (e.g. 'adventurers').
 * @returns {object|null}
 */
export function getGuildType(id) {
  return GUILD_TYPES[id] ?? null;
}

/**
 * Returns the rank object whose reputation threshold the given value meets.
 * Walks from highest rank downward so the first match is the correct rank.
 * @param {number} reputation - Current reputation score.
 * @returns {object} The matching GUILD_RANKS entry (defaults to rank 1).
 */
export function getGuildRank(reputation) {
  const sorted = [...GUILD_RANKS].sort((a, b) => b.reputationRequired - a.reputationRequired);
  return sorted.find(r => reputation >= r.reputationRequired) ?? GUILD_RANKS[0];
}

/**
 * Returns all mission templates for a given guild type filtered to missions
 * at or below the supplied rank number.
 * @param {string} guildType - Key in GUILD_MISSIONS (e.g. 'thieves').
 * @param {number} rank - Current rank number (1–8).
 * @returns {object[]}
 */
export function getAvailableMissions(guildType, rank) {
  const missions = GUILD_MISSIONS[guildType];
  if (!missions) return [];
  return missions.filter(m => m.rank <= rank);
}

/**
 * Returns the perks object for a given rank number.
 * @param {number} rank - Rank number (1–8).
 * @returns {object|null}
 */
export function getGuildPerks(rank) {
  return GUILD_PERKS.find(p => p.rank === rank) ?? null;
}

/**
 * Returns a random guild event that applies to the given guild type.
 * Falls back to any random event if none are tagged for that guild.
 * @param {string} guildType - Key in GUILD_TYPES.
 * @returns {object}
 */
export function generateGuildEvent(guildType) {
  const applicable = GUILD_EVENTS.filter(e => e.affectedGuilds.includes(guildType));
  if (applicable.length > 0) return _pick(applicable);
  return _pick(GUILD_EVENTS);
}

/**
 * Returns the monthly dues (in gold pieces) for a given rank number.
 * @param {number} rank - Rank number (1–8).
 * @returns {number} Dues in gp; returns 0 if rank not found.
 */
export function calculateDues(rank) {
  const rankObj = GUILD_RANKS.find(r => r.rank === rank);
  return rankObj ? rankObj.dues : 0;
}
