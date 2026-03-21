/**
 * World Systems — Law, guilds, and karma for world-building depth.
 */

// ── Law System (Item 190) ──
export const LAW_SYSTEMS = {
  lawful: {
    label: 'Lawful Kingdom',
    crimes: [
      { name: 'Theft', punishment: 'Restitution + 1d4 days jail', fine: '2x value stolen', severity: 'minor' },
      { name: 'Assault', punishment: '1d4 weeks jail + fine', fine: '50 gp', severity: 'moderate' },
      { name: 'Murder', punishment: 'Execution or life imprisonment', fine: 'N/A', severity: 'major' },
      { name: 'Treason', punishment: 'Public execution', fine: 'Asset seizure', severity: 'capital' },
      { name: 'Smuggling', punishment: 'Confiscation + fine + 1d4 weeks jail', fine: '5x value of goods', severity: 'moderate' },
      { name: 'Trespassing', punishment: 'Warning or 1d4 days jail', fine: '10 gp', severity: 'minor' },
      { name: 'Fraud', punishment: 'Restitution + 1d4 weeks jail', fine: '3x amount defrauded', severity: 'moderate' },
      { name: 'Arson', punishment: 'Restitution + 1d12 weeks jail', fine: 'Full damages', severity: 'major' },
      { name: 'Use of forbidden magic', punishment: 'Imprisonment + magical binding', fine: '500 gp', severity: 'major' },
      { name: 'Public disturbance', punishment: 'Fine or overnight in stocks', fine: '5 gp', severity: 'minor' },
    ],
    bountySystem: true,
    trialByJury: true,
    corruptionLevel: 'low',
  },
  frontier: {
    label: 'Frontier Town',
    crimes: [
      { name: 'Theft', punishment: 'Public shaming + restitution', fine: '1x value', severity: 'minor' },
      { name: 'Assault', punishment: 'Exile or duel', fine: '20 gp', severity: 'moderate' },
      { name: 'Murder', punishment: 'Hanging', fine: 'N/A', severity: 'major' },
      { name: 'Horse theft', punishment: 'Hanging', fine: 'N/A', severity: 'major' },
      { name: 'Claim jumping', punishment: 'Exile + loss of claim', fine: 'Claim value', severity: 'moderate' },
    ],
    bountySystem: true,
    trialByJury: false,
    corruptionLevel: 'medium',
  },
  corrupt: {
    label: 'Corrupt City-State',
    crimes: [
      { name: 'Theft (from the rich)', punishment: 'Severe beating + servitude', fine: '10x value', severity: 'major' },
      { name: 'Theft (from the poor)', punishment: 'Ignored', fine: 'None', severity: 'minor' },
      { name: 'Bribery', punishment: 'Accepted (it\'s how business works)', fine: 'N/A', severity: 'none' },
      { name: 'Murder (of a noble)', punishment: 'Execution + family punished', fine: 'Asset seizure', severity: 'capital' },
      { name: 'Murder (of a commoner)', punishment: 'Fine', fine: '100 gp', severity: 'moderate' },
      { name: 'Speaking against the ruler', punishment: 'Imprisonment', fine: 'Variable', severity: 'major' },
    ],
    bountySystem: true,
    trialByJury: false,
    corruptionLevel: 'high',
  },
  tribal: {
    label: 'Tribal Lands',
    crimes: [
      { name: 'Theft', punishment: 'Return + work for the victim', fine: 'Labor', severity: 'minor' },
      { name: 'Violence against kin', punishment: 'Exile', fine: 'N/A', severity: 'major' },
      { name: 'Oath breaking', punishment: 'Permanent dishonor + exile', fine: 'N/A', severity: 'capital' },
      { name: 'Desecrating sacred ground', punishment: 'Ritual punishment + quest to atone', fine: 'N/A', severity: 'major' },
      { name: 'Cowardice in battle', punishment: 'Stripped of status', fine: 'N/A', severity: 'moderate' },
    ],
    bountySystem: false,
    trialByJury: false,
    corruptionLevel: 'low',
  },
};

// ── Guild System (Item 191) ──
export const GUILD_TYPES = [
  {
    name: 'Adventurers\' Guild',
    ranks: ['Initiate', 'Member', 'Veteran', 'Elite', 'Guildmaster'],
    dues: '10 gp/month',
    perks: ['Access to job board', 'Discounted healing potions', 'Safe houses in major cities', 'Legal representation', 'Retirement fund'],
    missions: ['Monster hunts', 'Escort missions', 'Dungeon clearing', 'Artifact recovery'],
  },
  {
    name: 'Merchants\' Guild',
    ranks: ['Apprentice', 'Trader', 'Merchant', 'Master Merchant', 'Guildmaster'],
    dues: '25 gp/month',
    perks: ['Trade route access', '10% discount on goods', 'Insurance on cargo', 'Market stall rights', 'Import/export licenses'],
    missions: ['Deliver cargo', 'Negotiate trade agreements', 'Investigate market fraud', 'Establish new trade routes'],
  },
  {
    name: 'Thieves\' Guild',
    ranks: ['Pickpocket', 'Burglar', 'Shadow', 'Master Thief', 'Guildmaster'],
    dues: '20% of take',
    perks: ['Fence services', 'Safe houses', 'Forgery services', 'Blackmail protection', 'Territory rights'],
    missions: ['Heists', 'Smuggling', 'Intelligence gathering', 'Sabotage', 'Kidnapping'],
  },
  {
    name: 'Mages\' Guild',
    ranks: ['Apprentice', 'Journeyman', 'Mage', 'Archmage', 'Grand Magister'],
    dues: '50 gp/month',
    perks: ['Library access', 'Spell component discounts', 'Enchantment services', 'Spell scroll crafting', 'Planar communication'],
    missions: ['Arcane research', 'Ward maintenance', 'Magical artifact study', 'Containment of magical threats'],
  },
  {
    name: 'Warriors\' Guild',
    ranks: ['Recruit', 'Soldier', 'Sergeant', 'Captain', 'Champion'],
    dues: '15 gp/month',
    perks: ['Training facilities', 'Equipment maintenance', 'Medical care', 'Arena access', 'Letters of recommendation'],
    missions: ['Guard duty', 'Tournament fighting', 'Military campaigns', 'Training militia'],
  },
  {
    name: 'Crafters\' Guild',
    ranks: ['Apprentice', 'Journeyman', 'Craftsman', 'Master Crafter', 'Grand Master'],
    dues: '20 gp/month',
    perks: ['Workshop access', 'Material discounts', 'Exclusive commissions', 'Quality certifications', 'Patent protections'],
    missions: ['Commission work', 'Material sourcing', 'Quality inspections', 'Master crafting challenges'],
  },
];

// ── Karma System (Item 250) ──
export const KARMA_TIERS = [
  { min: -100, max: -61, label: 'Villain', color: '#ef4444', description: 'Feared and reviled. Bounties on your head. NPCs flee or attack on sight.' },
  { min: -60, max: -31, label: 'Infamous', color: '#f97316', description: 'A dark reputation precedes you. Merchants charge double. Guards watch closely.' },
  { min: -30, max: -11, label: 'Suspicious', color: '#fbbf24', description: 'People are wary. Prices inflated 25%. Information is harder to come by.' },
  { min: -10, max: 10, label: 'Unknown', color: '#94a3b8', description: 'Neutral. No reputation precedes you. Normal prices and reactions.' },
  { min: 11, max: 30, label: 'Respected', color: '#60a5fa', description: 'People nod in greeting. 10% discount at shops. Guards are helpful.' },
  { min: 31, max: 60, label: 'Renowned', color: '#818cf8', description: 'Fame spreads. Free lodging at inns. Nobles request audiences. Quests seek you out.' },
  { min: 61, max: 100, label: 'Legendary', color: '#c084fc', description: 'Songs are sung of your deeds. Armies rally to your banner. History remembers.' },
];

export const KARMA_ACTIONS = {
  positive: [
    { action: 'Saved innocent lives', points: 5 },
    { action: 'Defeated a major threat', points: 10 },
    { action: 'Donated to the poor', points: 2 },
    { action: 'Completed a quest for the good of the realm', points: 8 },
    { action: 'Showed mercy to a defeated enemy', points: 3 },
    { action: 'Protected the weak', points: 4 },
    { action: 'Kept a difficult promise', points: 3 },
    { action: 'Made a personal sacrifice for others', points: 7 },
  ],
  negative: [
    { action: 'Killed an innocent', points: -10 },
    { action: 'Stole from a merchant', points: -3 },
    { action: 'Broke a sworn oath', points: -5 },
    { action: 'Betrayed an ally', points: -8 },
    { action: 'Caused collateral damage', points: -4 },
    { action: 'Extorted or threatened civilians', points: -3 },
    { action: 'Desecrated a holy site', points: -6 },
    { action: 'Sided with evil for personal gain', points: -7 },
  ],
};

export function getKarmaTier(points) {
  return KARMA_TIERS.find(t => points >= t.min && points <= t.max) || KARMA_TIERS[3];
}

export function getLawSystem(type) {
  return LAW_SYSTEMS[type] || LAW_SYSTEMS.lawful;
}
