/**
 * Law System — Regional laws, crimes, punishments, guard responses, and bounty generation.
 * Roadmap item 190: Law system per region.
 *
 * Exports:
 *   CRIME_TYPES            — Array of defined crimes with severity, fines, imprisonment
 *   PUNISHMENT_TYPES       — Array of punishment categories with descriptions
 *   GOVERNMENT_TYPES       — Array of government types with law modifiers and corruption
 *   GUARD_RESPONSE         — Response levels and patrol data by crime severity and context
 *   BOUNTY_GENERATION      — Templates for generating bounties from crimes
 *
 * Helper functions:
 *   getCrimePunishment(crimeType, governmentType)
 *   generateBounty(criminal, crime)
 *   getGuardResponse(crimeType, location)
 *   calculateFine(crimeType, wealthLevel)
 *   checkCorruption(governmentType)
 */

// ---------------------------------------------------------------------------
// CRIME TYPES
// ---------------------------------------------------------------------------

export const CRIME_TYPES = [
  {
    id: 'petty_theft',
    name: 'Petty Theft',
    severity: 'minor',
    fineRange: { min: 5, max: 50 },
    imprisonmentRange: { min: 0, max: 7, unit: 'days' },
    description: 'Stealing goods or coin of low value — picking pockets, pilfering from stalls. Most towns handle this with a fine and a stern warning.',
    bountyChance: 0.15,
    typicalPunishments: ['fine', 'stocks'],
  },
  {
    id: 'grand_theft',
    name: 'Grand Theft',
    severity: 'moderate',
    fineRange: { min: 100, max: 1000 },
    imprisonmentRange: { min: 7, max: 90, unit: 'days' },
    description: 'Theft of substantial property, livestock, or valuables above a set threshold. Often triggers a bounty if the victim is wealthy or connected.',
    bountyChance: 0.55,
    typicalPunishments: ['fine', 'imprisonment', 'branding'],
  },
  {
    id: 'assault',
    name: 'Assault',
    severity: 'moderate',
    fineRange: { min: 50, max: 500 },
    imprisonmentRange: { min: 7, max: 180, unit: 'days' },
    description: 'Unprovoked physical attack on a person. Severity scales with injury caused. Self-defense may be a valid legal defense depending on jurisdiction.',
    bountyChance: 0.40,
    typicalPunishments: ['fine', 'imprisonment', 'stocks'],
  },
  {
    id: 'murder',
    name: 'Murder',
    severity: 'capital',
    fineRange: { min: 0, max: 0 },
    imprisonmentRange: { min: 0, max: 0, unit: 'days' },
    description: 'The unlawful killing of another person. Almost universally a capital offense. Blood price or weregild may be accepted in tribal cultures instead of execution.',
    bountyChance: 0.95,
    typicalPunishments: ['execution', 'exile', 'trial_by_combat'],
  },
  {
    id: 'arson',
    name: 'Arson',
    severity: 'major',
    fineRange: { min: 500, max: 5000 },
    imprisonmentRange: { min: 30, max: 365, unit: 'days' },
    description: 'Deliberately setting fire to property. In close-built towns and cities this is treated nearly as severely as murder due to risk of mass casualties.',
    bountyChance: 0.75,
    typicalPunishments: ['imprisonment', 'forced_labor', 'execution'],
  },
  {
    id: 'smuggling',
    name: 'Smuggling',
    severity: 'moderate',
    fineRange: { min: 200, max: 2000 },
    imprisonmentRange: { min: 14, max: 180, unit: 'days' },
    description: 'Moving restricted or taxed goods across borders without proper documentation or duty payment. Enforcement varies wildly by region and the goods involved.',
    bountyChance: 0.30,
    typicalPunishments: ['fine', 'confiscation', 'imprisonment'],
  },
  {
    id: 'treason',
    name: 'Treason',
    severity: 'capital',
    fineRange: { min: 0, max: 0 },
    imprisonmentRange: { min: 0, max: 0, unit: 'days' },
    description: 'Acts against the ruling authority — assassination attempts, working with foreign enemies, inciting rebellion. The definition is broad and often politically motivated.',
    bountyChance: 0.99,
    typicalPunishments: ['execution', 'exile', 'magical_punishment'],
  },
  {
    id: 'heresy',
    name: 'Heresy',
    severity: 'major',
    fineRange: { min: 100, max: 1000 },
    imprisonmentRange: { min: 30, max: 365, unit: 'days' },
    description: 'Practicing or preaching beliefs contrary to the official state religion. Only relevant in theocracies or strongly religious regions. May be a capital offense in extreme cases.',
    bountyChance: 0.50,
    typicalPunishments: ['imprisonment', 'forced_labor', 'exile', 'execution'],
  },
  {
    id: 'trespassing',
    name: 'Trespassing',
    severity: 'minor',
    fineRange: { min: 5, max: 100 },
    imprisonmentRange: { min: 0, max: 3, unit: 'days' },
    description: 'Entering restricted or private property without permission. Noble estates and royal grounds carry much harsher penalties than a farmer\'s field.',
    bountyChance: 0.05,
    typicalPunishments: ['fine', 'stocks'],
  },
  {
    id: 'fraud',
    name: 'Fraud',
    severity: 'moderate',
    fineRange: { min: 100, max: 5000 },
    imprisonmentRange: { min: 14, max: 365, unit: 'days' },
    description: 'Deliberate deception for financial gain — forgery, false identity, counterfeit goods, con schemes. Merchants guilds take a particularly dim view of this.',
    bountyChance: 0.45,
    typicalPunishments: ['fine', 'confiscation', 'imprisonment', 'branding'],
  },
  {
    id: 'poaching',
    name: 'Poaching',
    severity: 'minor',
    fineRange: { min: 10, max: 200 },
    imprisonmentRange: { min: 0, max: 30, unit: 'days' },
    description: 'Hunting or taking game on protected lands or out of season. Noble hunting grounds carry heavier penalties. A starving peasant is judged differently from a merchant.',
    bountyChance: 0.10,
    typicalPunishments: ['fine', 'stocks', 'forced_labor'],
  },
  {
    id: 'necromancy',
    name: 'Necromancy',
    severity: 'major',
    fineRange: { min: 500, max: 5000 },
    imprisonmentRange: { min: 90, max: 730, unit: 'days' },
    description: 'Raising, animating, or communing with the undead. Outlawed in most civilized lands on religious and practical grounds. Undead created become state property — or must be destroyed.',
    bountyChance: 0.80,
    typicalPunishments: ['imprisonment', 'exile', 'execution', 'magical_punishment'],
  },
  {
    id: 'unlicensed_magic',
    name: 'Unlicensed Magic',
    severity: 'moderate',
    fineRange: { min: 50, max: 1000 },
    imprisonmentRange: { min: 7, max: 180, unit: 'days' },
    description: 'Practicing arcane magic without registration or licensure from the relevant guild or government body. Common in magocracies and large cities. Rural areas rarely enforce this.',
    bountyChance: 0.25,
    typicalPunishments: ['fine', 'confiscation', 'imprisonment'],
  },
  {
    id: 'disturbing_peace',
    name: 'Disturbing the Peace',
    severity: 'minor',
    fineRange: { min: 1, max: 25 },
    imprisonmentRange: { min: 0, max: 1, unit: 'days' },
    description: 'Brawling in public, drunken disorder, loud disturbances, or inciting a minor riot. The most common charge issued by city watch. Usually resolved overnight in a cell.',
    bountyChance: 0.02,
    typicalPunishments: ['fine', 'stocks'],
  },
  {
    id: 'tax_evasion',
    name: 'Tax Evasion',
    severity: 'moderate',
    fineRange: { min: 200, max: 10000 },
    imprisonmentRange: { min: 14, max: 365, unit: 'days' },
    description: 'Failure to pay lawfully owed taxes, duties, or tithes. Fine is typically the owed amount plus a heavy penalty. Repeat offenders face confiscation of property or forced labor.',
    bountyChance: 0.35,
    typicalPunishments: ['fine', 'confiscation', 'forced_labor', 'imprisonment'],
  },
];

// ---------------------------------------------------------------------------
// PUNISHMENT TYPES
// ---------------------------------------------------------------------------

export const PUNISHMENT_TYPES = [
  {
    id: 'fine',
    name: 'Fine',
    description: 'Monetary payment to the state or injured party. Most common punishment for minor and moderate crimes. Amount scales with crime severity and the convicted\'s apparent wealth.',
    severity: 'minor',
    deterrence: 'low',
    notes: 'Wealthy criminals often prefer this outcome. Corrupt officials may pocket a portion.',
  },
  {
    id: 'imprisonment',
    name: 'Imprisonment',
    description: 'Confinement in a jail, dungeon, or workhouse for a set duration. Conditions vary from tolerable town lockup to squalid dungeon cells. Long sentences may be commuted for service.',
    severity: 'moderate',
    deterrence: 'medium',
    notes: 'Escaping from lawful imprisonment is itself a crime and adds to any existing sentence.',
  },
  {
    id: 'stocks',
    name: 'Stocks / Pillory',
    description: 'Public humiliation — the convicted is locked in wooden stocks in the town square for a day or more. Citizens may throw rotten produce. Intended as social shame more than physical punishment.',
    severity: 'minor',
    deterrence: 'low',
    notes: 'Very effective in small, tight-knit communities. Less impactful in large anonymous cities.',
  },
  {
    id: 'exile',
    name: 'Exile',
    description: 'Banishment from the city, region, or entire kingdom. Return after exile is usually punishable by death. Often combined with a permanent mark or brand identifying the individual.',
    severity: 'major',
    deterrence: 'high',
    notes: 'May be offered as an alternative to execution. Exiles sometimes become valuable adventurers — or dangerous criminals.',
  },
  {
    id: 'forced_labor',
    name: 'Forced Labor',
    description: 'The convicted is put to work on public projects — road building, mine labor, quarry work, or galley rowing. Duration is set by the court. Often replaces fines for those who cannot pay.',
    severity: 'moderate',
    deterrence: 'medium',
    notes: 'Galley service is considered near-equivalent to a death sentence due to harsh conditions.',
  },
  {
    id: 'execution',
    name: 'Execution',
    description: 'Death. Method varies by culture and crime — hanging, beheading, burning at the stake, drowning, or more exotic means. Often public to serve as a deterrent to onlookers.',
    severity: 'capital',
    deterrence: 'high',
    notes: 'May be carried out immediately after sentencing in lawless regions, or delayed pending appeal in more civilized ones.',
  },
  {
    id: 'branding',
    name: 'Branding',
    description: 'A permanent mark burned or tattooed onto the criminal — usually the hand, face, or forehead. Identifies them as a convicted thief, traitor, or other criminal for life.',
    severity: 'moderate',
    deterrence: 'medium',
    notes: 'Branded individuals face social stigma and discrimination. Some disguise brands with scarves, magic, or further tattoos.',
  },
  {
    id: 'magical_punishment',
    name: 'Magical Punishment (Geas)',
    description: 'A magical compulsion placed on the convicted — typically a geas spell forcing them to perform a task, avoid certain behaviors, or confess crimes. Used in magocracies and by powerful temples.',
    severity: 'major',
    deterrence: 'very high',
    notes: 'Breaking a geas causes psychic damage and may trigger other effects. Considered humane compared to execution by some, oppressive by others.',
  },
  {
    id: 'trial_by_combat',
    name: 'Trial by Combat',
    description: 'The accused may challenge their conviction through single combat — either personally or via a champion. Victory is taken as divine proof of innocence. Rare but culturally significant in martial societies.',
    severity: 'major',
    deterrence: 'medium',
    notes: 'The state may provide its own champion. Wealthy accused sometimes hire skilled fighters to fight in their stead.',
  },
  {
    id: 'confiscation',
    name: 'Confiscation',
    description: 'Seizure of property, goods, assets, or equipment related to the crime — or general wealth. Common alongside other punishments. Corrupt officials may take more than legally authorized.',
    severity: 'moderate',
    deterrence: 'medium',
    notes: 'All confiscated goods technically go to the crown or city coffers, but diversion is common in corrupt jurisdictions.',
  },
];

// ---------------------------------------------------------------------------
// GOVERNMENT TYPES
// ---------------------------------------------------------------------------

export const GOVERNMENT_TYPES = [
  {
    id: 'monarchy',
    name: 'Monarchy',
    description: 'Rule by a king, queen, or similar hereditary monarch. Law is whatever the crown decrees, though tradition and noble pressure moderate absolute power.',
    lawStrictnessModifier: 1.0,
    corruptionLevel: 'moderate',
    corruptionChance: 0.25,
    appealProcess: 'Petition to a noble, then the crown. Takes weeks to months. Expensive.',
    fineModifier: 1.0,
    guardLoyalty: 'to the crown',
    notes: 'The monarch can pardon any crime. Royal connections are valuable.',
  },
  {
    id: 'theocracy',
    name: 'Theocracy',
    description: 'Rule by religious authority. Law is divine law. Crimes against the faith are treated as seriously as crimes against persons. Inquisitors supplement the city watch.',
    lawStrictnessModifier: 1.4,
    corruptionLevel: 'low',
    corruptionChance: 0.10,
    appealProcess: 'Ecclesiastical court appeal, then high clergy. Very hard to overturn without repentance.',
    fineModifier: 0.8,
    guardLoyalty: 'to the church',
    notes: 'Heresy and necromancy are capital offenses. Genuine religious devotion may reduce sentences.',
  },
  {
    id: 'oligarchy',
    name: 'Oligarchy',
    description: 'Rule by a council of wealthy merchant or noble families. Law protects property and commerce above all else. Financial crimes are taken extremely seriously.',
    lawStrictnessModifier: 1.1,
    corruptionLevel: 'high',
    corruptionChance: 0.45,
    appealProcess: 'Bribe the right council member. "Official" appeals take months and cost money.',
    fineModifier: 1.5,
    guardLoyalty: 'to whoever pays them',
    notes: 'Having wealth, merchant connections, or guild membership dramatically improves outcomes.',
  },
  {
    id: 'democracy',
    name: 'Democracy',
    description: 'Rule by elected representatives or direct citizen vote. Due process is important. Trials by jury exist. Punishment tends toward rehabilitation over retribution.',
    lawStrictnessModifier: 0.9,
    corruptionLevel: 'low',
    corruptionChance: 0.15,
    appealProcess: 'Formal jury appeal system. Takes time but genuinely works. Lawyers are common.',
    fineModifier: 1.0,
    guardLoyalty: 'to the law',
    notes: 'Good lawyers and public sympathy can significantly alter outcomes. Mob opinion matters.',
  },
  {
    id: 'anarchy',
    name: 'Anarchy',
    description: 'No central authority. Might makes right. Local warlords, gangs, or strong communities enforce their own ad hoc rules. "Law" is whatever the most powerful party says it is.',
    lawStrictnessModifier: 0.4,
    corruptionLevel: 'very high',
    corruptionChance: 0.75,
    appealProcess: 'None. Retaliation is the only recourse.',
    fineModifier: 0.5,
    guardLoyalty: 'to themselves',
    notes: 'Strength, reputation, and allies are everything. Official crimes are largely meaningless here.',
  },
  {
    id: 'magocracy',
    name: 'Magocracy',
    description: 'Rule by powerful spellcasters or a mages\' guild. Magic use is tightly regulated. Unlicensed casting is treated as a serious offense. Punishments often involve magical compulsion.',
    lawStrictnessModifier: 1.2,
    corruptionLevel: 'moderate',
    corruptionChance: 0.20,
    appealProcess: 'Magical arbitration before the Arcane Council. Truth-telling spells are used freely.',
    fineModifier: 1.2,
    guardLoyalty: 'to the arcane council',
    notes: 'Lying under magical examination is near impossible. Magical punishments — geas, polymorph — are common.',
  },
  {
    id: 'military_dictatorship',
    name: 'Military Dictatorship',
    description: 'Rule by military force. Order is paramount. Dissent is crushed. Punishment is swift, severe, and public. The military is above civilian law.',
    lawStrictnessModifier: 1.6,
    corruptionLevel: 'moderate',
    corruptionChance: 0.30,
    appealProcess: 'Military tribunal. Extremely difficult to overturn. Having military rank or connections is the only real option.',
    fineModifier: 0.6,
    guardLoyalty: 'to the general or warlord',
    notes: 'Crimes against soldiers or military property carry double penalties. Civilians are second-class legally.',
  },
  {
    id: 'tribal_council',
    name: 'Tribal Council',
    description: 'Rule by elders, shamans, or clan chiefs. Law is rooted in tradition, honor, and community survival. Crimes are judged by the community as a whole, with emphasis on restitution over punishment.',
    lawStrictnessModifier: 0.8,
    corruptionLevel: 'low',
    corruptionChance: 0.12,
    appealProcess: 'Speak before the full council or challenge an elder\'s judgment publicly. Community consensus rules.',
    fineModifier: 0.7,
    guardLoyalty: 'to the tribe',
    notes: 'Outsiders receive far harsher judgment than tribe members. Restitution and apology can resolve most crimes.',
  },
];

// ---------------------------------------------------------------------------
// GUARD RESPONSE
// ---------------------------------------------------------------------------

export const GUARD_RESPONSE = {
  responseLevels: [
    {
      id: 'none',
      label: 'No Response',
      description: 'Guards are unaware, understaffed, or simply do not care. The crime goes unnoticed or uninvestigated.',
      patrolFrequency: 'none',
      investigationThoroughness: 'none',
      chaseRange: 0,
      applicableConditions: ['anarchy', 'remote_location', 'bribed', 'crime_undetected'],
    },
    {
      id: 'low',
      label: 'Minimal Response',
      description: 'A guard may come to take a report. No active pursuit. The matter is logged and mostly forgotten unless the victim complains loudly.',
      patrolFrequency: 'occasional',
      investigationThoroughness: 'cursory',
      chaseRange: 1,
      applicableConditions: ['minor_crime', 'low_priority_victim', 'rural_area'],
    },
    {
      id: 'moderate',
      label: 'Standard Response',
      description: 'A patrol unit investigates. Witnesses are questioned. Suspects may be detained for questioning. Actively pursued within the district.',
      patrolFrequency: 'regular',
      investigationThoroughness: 'standard',
      chaseRange: 3,
      applicableConditions: ['moderate_crime', 'urban_area', 'witnessed_crime'],
    },
    {
      id: 'high',
      label: 'Elevated Response',
      description: 'Multiple guard units mobilized. Gates may be watched. Descriptions circulated to neighboring watches. Investigation is thorough and persistent.',
      patrolFrequency: 'heavy',
      investigationThoroughness: 'thorough',
      chaseRange: 6,
      applicableConditions: ['major_crime', 'wealthy_victim', 'public_crime', 'noble_involved'],
    },
    {
      id: 'extreme',
      label: 'Maximum Response',
      description: 'Full city alert. All gates locked. Military may be called in. Bounty posted immediately. Magical tracking or divination may be employed. No quarter for resistance.',
      patrolFrequency: 'saturation',
      investigationThoroughness: 'relentless',
      chaseRange: 12,
      applicableConditions: ['capital_crime', 'royal_involved', 'mass_casualties', 'treason'],
    },
  ],

  byGovernmentType: {
    monarchy: { minorMod: 0, moderateMod: 1, majorMod: 1, capitalMod: 2 },
    theocracy: { minorMod: 1, moderateMod: 1, majorMod: 2, capitalMod: 2 },
    oligarchy: { minorMod: -1, moderateMod: 0, majorMod: 1, capitalMod: 1 },
    democracy: { minorMod: 0, moderateMod: 0, majorMod: 1, capitalMod: 1 },
    anarchy: { minorMod: -2, moderateMod: -2, majorMod: -1, capitalMod: 0 },
    magocracy: { minorMod: 0, moderateMod: 1, majorMod: 1, capitalMod: 2 },
    military_dictatorship: { minorMod: 1, moderateMod: 1, majorMod: 2, capitalMod: 2 },
    tribal_council: { minorMod: -1, moderateMod: 0, majorMod: 1, capitalMod: 1 },
  },

  patrolSchedules: {
    none: { description: 'No patrol', intervalHours: null },
    occasional: { description: 'Once or twice per day', intervalHours: 8 },
    regular: { description: 'Every 2–4 hours', intervalHours: 3 },
    heavy: { description: 'Every 30–60 minutes', intervalHours: 0.75 },
    saturation: { description: 'Continuous — guards on every corner', intervalHours: 0 },
  },
};

// ---------------------------------------------------------------------------
// BOUNTY GENERATION
// ---------------------------------------------------------------------------

export const BOUNTY_GENERATION = {
  templates: [
    {
      id: 'wanted_dead_or_alive',
      label: 'Wanted: Dead or Alive',
      applicableSeverity: ['major', 'capital'],
      poster: 'WANTED — {name} for the crime of {crime} in {location}. Last seen {description}. Reward: {reward} gold. Contact the {authority}.',
      rewardMultiplier: 1.0,
      deathAllowed: true,
    },
    {
      id: 'wanted_alive',
      label: 'Wanted: Alive for Trial',
      applicableSeverity: ['moderate', 'major', 'capital'],
      poster: 'BY ORDER OF {authority} — {name} is sought for questioning regarding {crime}. Bring to the {location} watch-house. Reward of {reward} gold upon delivery, alive and unharmed.',
      rewardMultiplier: 1.5,
      deathAllowed: false,
    },
    {
      id: 'local_notice',
      label: 'Local Notice',
      applicableSeverity: ['minor', 'moderate'],
      poster: 'NOTICE — The {authority} seeks information regarding {crime} occurring in {location}. Any witness should report to the watch. Small reward offered for information leading to arrest.',
      rewardMultiplier: 0.3,
      deathAllowed: false,
    },
    {
      id: 'guild_contract',
      label: 'Guild Contract',
      applicableSeverity: ['moderate', 'major', 'capital'],
      poster: 'CONTRACT POSTED BY {issuer} — For the apprehension of {name}, wanted for {crime}. {reward} gold for proof of capture or death. Inquire at the {authority}.',
      rewardMultiplier: 1.2,
      deathAllowed: true,
    },
    {
      id: 'royal_decree',
      label: 'Royal Decree',
      applicableSeverity: ['capital'],
      poster: 'BY ROYAL DECREE — {name}, convicted of {crime} against the crown, is hereby declared outlaw. All citizens are commanded to aid in their capture. Reward of {reward} gold. Those harboring this fugitive face equal punishment.',
      rewardMultiplier: 2.5,
      deathAllowed: true,
    },
  ],

  rewardBaselines: {
    minor: { base: 10, max: 50 },
    moderate: { base: 50, max: 300 },
    major: { base: 300, max: 1500 },
    capital: { base: 1000, max: 10000 },
  },

  escalationEvents: [
    { trigger: 'guard_killed_during_escape', multiplier: 3.0, label: 'Cop killer — bounty tripled' },
    { trigger: 'multiple_offenses', multiplier: 1.5, label: 'Repeat offender — bounty increased' },
    { trigger: 'noble_victim', multiplier: 2.0, label: 'Noble victim — bounty doubled' },
    { trigger: 'royal_family_victim', multiplier: 5.0, label: 'Royal victim — bounty quintupled' },
    { trigger: 'mass_casualties', multiplier: 4.0, label: 'Mass casualties — maximum bounty' },
    { trigger: 'time_elapsed_30d', multiplier: 1.3, label: 'Fugitive for 30+ days — reward increased' },
  ],
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Returns the appropriate punishment details for a given crime under a given government.
 * @param {string} crimeType - id from CRIME_TYPES
 * @param {string} governmentType - id from GOVERNMENT_TYPES
 * @returns {{ crime, government, recommendedPunishments, adjustedFineRange, notes }}
 */
export function getCrimePunishment(crimeType, governmentType) {
  const crime = CRIME_TYPES.find(c => c.id === crimeType);
  const government = GOVERNMENT_TYPES.find(g => g.id === governmentType);

  if (!crime || !government) {
    return null;
  }

  const strictness = government.lawStrictnessModifier;
  const adjustedFine = {
    min: Math.round(crime.fineRange.min * strictness * government.fineModifier),
    max: Math.round(crime.fineRange.max * strictness * government.fineModifier),
  };

  // Upgrade punishment severity in strict governments
  let recommendedPunishments = [...crime.typicalPunishments];
  if (strictness >= 1.4 && crime.severity === 'moderate') {
    if (!recommendedPunishments.includes('imprisonment')) {
      recommendedPunishments.push('imprisonment');
    }
  }
  if (strictness >= 1.4 && crime.severity === 'major') {
    if (!recommendedPunishments.includes('execution')) {
      recommendedPunishments.push('execution');
    }
  }
  // Downgrade in lenient governments
  if (strictness <= 0.5) {
    recommendedPunishments = recommendedPunishments.filter(p => p !== 'execution' && p !== 'exile');
    if (!recommendedPunishments.includes('fine')) {
      recommendedPunishments.unshift('fine');
    }
  }

  const notes = [];
  if (government.corruptionLevel === 'high' || government.corruptionLevel === 'very high') {
    notes.push(`Corruption is ${government.corruptionLevel} here — a well-placed bribe may resolve this.`);
  }
  if (government.id === 'theocracy' && crimeType === 'heresy') {
    notes.push('In a theocracy, heresy is treated as a capital offense. No leniency.');
  }
  if (government.id === 'magocracy' && crimeType === 'unlicensed_magic') {
    notes.push('Unlicensed magic is a serious offense under magocratic law. Magical punishment likely.');
  }

  return {
    crime,
    government,
    recommendedPunishments,
    adjustedFineRange: adjustedFine,
    appealProcess: government.appealProcess,
    notes,
  };
}

/**
 * Generates a bounty posting for a criminal based on their crime.
 * @param {{ name: string, description?: string }} criminal
 * @param {{ id: string, location?: string, authority?: string }} crime
 * @returns {{ poster: string, reward: number, template: object, escalations: string[] }}
 */
export function generateBounty(criminal, crime) {
  const crimeData = CRIME_TYPES.find(c => c.id === crime.id);
  if (!crimeData) return null;

  const severity = crimeData.severity;
  const rewardRange = BOUNTY_GENERATION.rewardBaselines[severity];
  const baseReward = Math.floor(Math.random() * (rewardRange.max - rewardRange.base) + rewardRange.base);

  // Select appropriate template
  const applicableTemplates = BOUNTY_GENERATION.templates.filter(t =>
    t.applicableSeverity.includes(severity)
  );
  const template = applicableTemplates[Math.floor(Math.random() * applicableTemplates.length)];

  const finalReward = Math.round(baseReward * template.rewardMultiplier);

  const location = crime.location || 'the region';
  const authority = crime.authority || 'local authorities';
  const issuer = crime.authority || 'a concerned party';

  const posterText = template.poster
    .replace(/{name}/g, criminal.name || 'Unknown')
    .replace(/{crime}/g, crimeData.name.toLowerCase())
    .replace(/{location}/g, location)
    .replace(/{description}/g, criminal.description || 'appearance unknown')
    .replace(/{reward}/g, finalReward)
    .replace(/{authority}/g, authority)
    .replace(/{issuer}/g, issuer);

  return {
    poster: posterText,
    reward: finalReward,
    template,
    crimeData,
    severity,
    deathAllowed: template.deathAllowed,
    escalations: [],
  };
}

/**
 * Returns the guard response level for a crime committed in a given location context.
 * @param {string} crimeType - id from CRIME_TYPES
 * @param {{ governmentType?: string, isPublic?: boolean, victimWealth?: string, royalInvolved?: boolean }} location
 * @returns {{ level: object, description: string, patrolSchedule: object }}
 */
export function getGuardResponse(crimeType, location = {}) {
  const crime = CRIME_TYPES.find(c => c.id === crimeType);
  if (!crime) return null;

  const govId = location.governmentType || 'monarchy';
  const govMods = GUARD_RESPONSE.byGovernmentType[govId] || GUARD_RESPONSE.byGovernmentType.monarchy;

  const severityIndex = { minor: 0, moderate: 1, major: 2, capital: 3 };
  const severityMods = { minor: govMods.minorMod, moderate: govMods.moderateMod, major: govMods.majorMod, capital: govMods.capitalMod };

  let responseLevelIndex = severityIndex[crime.severity] + severityMods[crime.severity];

  // Contextual modifiers
  if (location.isPublic) responseLevelIndex += 1;
  if (location.victimWealth === 'noble') responseLevelIndex += 1;
  if (location.royalInvolved) responseLevelIndex += 2;

  // Clamp to valid range
  responseLevelIndex = Math.max(0, Math.min(GUARD_RESPONSE.responseLevels.length - 1, responseLevelIndex));

  const level = GUARD_RESPONSE.responseLevels[responseLevelIndex];
  const patrolSchedule = GUARD_RESPONSE.patrolSchedules[level.patrolFrequency] || GUARD_RESPONSE.patrolSchedules.none;

  return {
    level,
    patrolSchedule,
    description: level.description,
  };
}

/**
 * Calculates the fine amount for a crime based on the criminal's apparent wealth level.
 * @param {string} crimeType - id from CRIME_TYPES
 * @param {'destitute'|'poor'|'commoner'|'comfortable'|'wealthy'|'noble'} wealthLevel
 * @returns {{ min: number, max: number, suggested: number }}
 */
export function calculateFine(crimeType, wealthLevel) {
  const crime = CRIME_TYPES.find(c => c.id === crimeType);
  if (!crime) return null;

  const wealthMultipliers = {
    destitute: 0.25,
    poor: 0.5,
    commoner: 1.0,
    comfortable: 1.5,
    wealthy: 3.0,
    noble: 6.0,
  };

  const multiplier = wealthMultipliers[wealthLevel] || 1.0;
  const min = Math.round(crime.fineRange.min * multiplier);
  const max = Math.round(crime.fineRange.max * multiplier);
  const suggested = Math.round((min + max) / 2);

  return { min, max, suggested, multiplier, wealthLevel };
}

/**
 * Checks whether a bribe attempt is likely to succeed given the government type.
 * Returns the probability (0–1) and a qualitative description.
 * @param {string} governmentType - id from GOVERNMENT_TYPES
 * @returns {{ chance: number, label: string, description: string }}
 */
export function checkCorruption(governmentType) {
  const government = GOVERNMENT_TYPES.find(g => g.id === governmentType);
  if (!government) return { chance: 0.2, label: 'Unknown', description: 'Corruption level unknown.' };

  const chance = government.corruptionChance;

  let label, description;
  if (chance <= 0.10) {
    label = 'Very Low';
    description = 'Guards and officials are zealous and honest. Attempting a bribe is likely to make things worse.';
  } else if (chance <= 0.20) {
    label = 'Low';
    description = 'Most officials are incorruptible, but the right approach and a substantial offer might find a crack in the armor.';
  } else if (chance <= 0.35) {
    label = 'Moderate';
    description = 'Some officials are open to negotiation. Smaller bribes for minor crimes pass without comment. Major crimes still require serious coin.';
  } else if (chance <= 0.55) {
    label = 'High';
    description = 'Corruption is widespread. Most guards expect a little extra. A bribe is often the fastest way to resolve a legal problem.';
  } else {
    label = 'Very High';
    description = 'The system runs on graft. Paying officials is expected and normalized. Refusing to bribe may actually raise suspicion.';
  }

  return {
    chance,
    label,
    description,
    governmentType: government.name,
    corruptionLevel: government.corruptionLevel,
    tipForPlayers: chance >= 0.4
      ? 'A Charisma (Persuasion) or Deception check (DC 10–15) plus appropriate coin should work on most guards here.'
      : 'Bribing officials here is risky. Only attempt it if the bribe is very large or the crime is minor.',
  };
}
