/**
 * playerClericDomainRankingGuide.js
 * Player Mode: Cleric domain/subclass ranking
 * Pure JS — no React dependencies.
 */

export const CLERIC_DOMAIN_RANKING = [
  {
    domain: 'Twilight',
    source: "Tasha's Cauldron of Everything",
    tier: 'S+',
    reason: 'Twilight Sanctuary: 1d6+level temp HP every round to ENTIRE PARTY. 300ft darkvision. Heavy armor + martial weapons. Widely considered overpowered.',
    keyFeatures: ['Twilight Sanctuary (temp HP aura)', '300ft shared darkvision', 'Heavy armor + martial weapons', 'Channel Divinity: mass temp HP'],
  },
  {
    domain: 'Peace',
    source: "Tasha's Cauldron of Everything",
    tier: 'S+',
    reason: 'Emboldening Bond: add 1d4 to attacks, saves, and ability checks (party-wide). Protective Bond: teleport to take damage for ally. Broken support.',
    keyFeatures: ['Emboldening Bond (+1d4 to everything)', 'Protective Bond (teleport intercept)', 'Expansive Bond (30ft range)', 'Stacks with Bless'],
  },
  {
    domain: 'Life',
    source: "Player's Handbook",
    tier: 'S',
    reason: 'Best pure healer. Disciple of Life adds 2+spell level HP to all healing spells. Heavy armor. Goodberry combo (4 HP per berry).',
    keyFeatures: ['Disciple of Life (+healing)', 'Heavy armor', 'Preserve Life (mass heal CD)', 'Supreme Healing (max heal dice)'],
  },
  {
    domain: 'Forge',
    source: "Xanathar's Guide to Everything",
    tier: 'A+',
    reason: 'Highest AC Cleric. Blessing of the Forge (+1 weapon/armor). Soul of the Forge (+1 AC, fire resist, fire immune at 17). Tank Cleric.',
    keyFeatures: ['Blessing of the Forge (+1 item)', 'Soul of the Forge (+1 AC)', 'Heavy armor', 'Fire immunity at L17'],
  },
  {
    domain: 'Order',
    source: "Tasha's Cauldron of Everything",
    tier: 'A',
    reason: 'Voice of Authority: when you cast spell on ally, they can use reaction to attack. Pairs amazingly with Rogue (free Sneak Attack).',
    keyFeatures: ['Voice of Authority (ally reaction attack)', 'Heavy armor', 'Order\'s Demand (mass charm)', 'Enchantment spells'],
  },
  {
    domain: 'Tempest',
    source: "Player's Handbook",
    tier: 'A',
    reason: 'Destructive Wrath: maximize lightning/thunder damage. Heavy armor + martial weapons. Call Lightning + max damage = devastating.',
    keyFeatures: ['Destructive Wrath (max damage)', 'Heavy armor + martial', 'Wrath of the Storm (reaction damage)', 'Lightning/thunder spells'],
  },
  {
    domain: 'Arcana',
    source: "Sword Coast Adventurer's Guide",
    tier: 'A',
    reason: 'Wizard cantrips on a Cleric. Spell Breaker at L6. Arcane Mastery at L17 = choose any Wizard spell including Wish.',
    keyFeatures: ['Wizard cantrips', 'Spell Breaker (dispel on heal)', 'Arcane Mastery (Wish at L17)', 'Abjuration + control'],
  },
  {
    domain: 'Light',
    source: "Player's Handbook",
    tier: 'A',
    reason: 'Fireball on a Cleric. Warding Flare (impose disadvantage). Best blaster Cleric. Faerie Fire for party support.',
    keyFeatures: ['Fireball + Wall of Fire', 'Warding Flare (disadvantage)', 'Corona of Light (disadvantage on saves)', 'Radiance of the Dawn (AoE)'],
  },
  {
    domain: 'Grave',
    source: "Xanathar's Guide to Everything",
    tier: 'B+',
    reason: 'Path to the Grave: next attack is vulnerable (double damage). Pairs with Paladin smite for massive nova. Sentinel at Death\'s Door cancels crits.',
    keyFeatures: ['Path to the Grave (vulnerability)', 'Sentinel at Death\'s Door (cancel crit)', 'Spare the Dying as BA at 30ft', 'Anti-undead'],
  },
  {
    domain: 'War',
    source: "Player's Handbook",
    tier: 'B',
    reason: 'War Priest: BA attack (WIS mod/LR). Guided Strike (+10 to attack). Heavy armor + martial. Solid but outclassed by Forge/Twilight.',
    keyFeatures: ['War Priest (BA attack)', 'Guided Strike (+10)', 'Heavy armor + martial', 'Spirit Guardians access'],
  },
  {
    domain: 'Trickery',
    source: "Player's Handbook",
    tier: 'B',
    reason: 'Invoke Duplicity (illusory double). Domain spells are great (Polymorph, Dimension Door). But base features are weak.',
    keyFeatures: ['Invoke Duplicity (illusion)', 'Great domain spells', 'Cloak of Shadows (invisibility)', 'Poison/charm focus'],
  },
  {
    domain: 'Knowledge',
    source: "Player's Handbook",
    tier: 'B',
    reason: 'Two expertise skills. Knowledge of the Ages (any skill/tool proficiency for 10min). Visions of the Past. Utility/RP focused.',
    keyFeatures: ['Two expertise', 'Knowledge of the Ages', 'Read Thoughts', 'Utility/investigation'],
  },
  {
    domain: 'Nature',
    source: "Player's Handbook",
    tier: 'C',
    reason: 'Druid cantrip. Heavy armor. Dampen Elements (resistance reaction). But domain spells overlap badly with Druid. Underwhelming.',
    keyFeatures: ['Druid cantrip', 'Heavy armor', 'Dampen Elements', 'Nature domain spells'],
  },
];

export function domainByRole(role) {
  const roles = {
    healer: ['Life', 'Grave', 'Peace'],
    tank: ['Forge', 'Twilight', 'War'],
    blaster: ['Light', 'Tempest', 'Arcana'],
    support: ['Peace', 'Twilight', 'Order'],
    utility: ['Knowledge', 'Trickery', 'Arcana'],
  };
  return roles[role] || ['Life', 'Forge', 'Light'];
}
