/**
 * playerBestFirstLevelSpellsGuide.js
 * Player Mode: Best L1 spells for each class
 * Pure JS — no React dependencies.
 */

export const BEST_L1_BY_CLASS = {
  wizard: [
    { spell: 'Shield', rating: 'S+', note: '+5 AC reaction. Take this always.' },
    { spell: 'Find Familiar', rating: 'S', note: 'Owl scout + Help action. Ritual.' },
    { spell: 'Magic Missile', rating: 'A+', note: 'Auto-hit force damage. Breaks concentration guaranteed.' },
    { spell: 'Absorb Elements', rating: 'S', note: 'Halve elemental damage as reaction.' },
    { spell: 'Detect Magic', rating: 'A+', note: 'Ritual. Free magic detection.' },
    { spell: 'Sleep', rating: 'S (L1-3)', note: 'No save. Incredible at L1-3. Falls off hard.' },
  ],
  cleric: [
    { spell: 'Healing Word', rating: 'S+', note: 'BA 60ft heal. Best combat heal.' },
    { spell: 'Guiding Bolt', rating: 'A+', note: '4d6 radiant + advantage on next attack.' },
    { spell: 'Shield of Faith', rating: 'A', note: '+2 AC. Concentration. Good pre-combat.' },
    { spell: 'Bless', rating: 'S', note: '+1d4 to attacks AND saves for 3 allies.' },
    { spell: 'Command', rating: 'A+', note: 'Grovel = prone + waste turn. BA spell after.' },
  ],
  druid: [
    { spell: 'Goodberry', rating: 'S', note: '10 berries = 10 days food or 10 emergency heals.' },
    { spell: 'Entangle', rating: 'A+', note: 'AoE restrained. STR save. Great area control.' },
    { spell: 'Healing Word', rating: 'S', note: 'Same as Cleric. Essential.' },
    { spell: 'Absorb Elements', rating: 'S', note: 'Halve elemental damage.' },
    { spell: 'Faerie Fire', rating: 'A+', note: 'AoE advantage. No invisibility. Outlines targets.' },
  ],
  bard: [
    { spell: 'Healing Word', rating: 'S', note: 'BA ranged heal. Essential.' },
    { spell: 'Faerie Fire', rating: 'A+', note: 'AoE advantage for party. DEX save.' },
    { spell: 'Silvery Barbs', rating: 'S (if allowed)', note: 'Force reroll + grant advantage. Controversial.' },
    { spell: 'Dissonant Whispers', rating: 'A+', note: 'Forced movement triggers OA.' },
    { spell: 'Sleep', rating: 'S (low levels)', note: 'No save. Auto-incapacitate at low levels.' },
  ],
  sorcerer: [
    { spell: 'Shield', rating: 'S+', note: '+5 AC reaction. Same as Wizard.' },
    { spell: 'Absorb Elements', rating: 'S', note: 'Elemental defense.' },
    { spell: 'Silvery Barbs', rating: 'S (if allowed)', note: 'Reroll + advantage.' },
    { spell: 'Magic Missile', rating: 'A', note: 'Auto-hit. Reliable damage.' },
    { spell: 'Mage Armor', rating: 'A+', note: 'AC 13+DEX if no armor. 8 hours.' },
  ],
  warlock: [
    { spell: 'Hex', rating: 'A+', note: '+1d6 per hit. Concentration. Moves between targets.' },
    { spell: 'Armor of Agathys', rating: 'S', note: 'Temp HP + cold retaliation. Scales with upcast.' },
    { spell: 'Hellish Rebuke', rating: 'A', note: 'Reaction damage when hit. 2d10 fire.' },
  ],
  paladin: [
    { spell: 'Shield of Faith', rating: 'A+', note: '+2 AC. Concentration. Good for tanking.' },
    { spell: 'Bless', rating: 'S', note: '+1d4 attacks and saves. Best L1 party buff.' },
    { spell: 'Wrathful Smite', rating: 'A', note: 'Frightened on hit. WIS save. Pseudo-control.' },
    { spell: 'Thunderous Smite', rating: 'A', note: '2d6 thunder + push 10ft + prone. Good opener.' },
  ],
  ranger: [
    { spell: 'Goodberry', rating: 'S', note: 'Food + emergency heals.' },
    { spell: 'Absorb Elements', rating: 'S', note: 'Halve elemental damage.' },
    { spell: 'Hunter\'s Mark', rating: 'A', note: '+1d6 per hit. Concentration. Classic.' },
    { spell: 'Entangle', rating: 'A+', note: 'AoE control. Restrained.' },
    { spell: 'Fog Cloud', rating: 'A', note: 'Block line of sight. Escape tool.' },
  ],
};

export const L1_SPELLS_THAT_STAY_RELEVANT = [
  { spell: 'Shield', note: '+5 AC is always good at any level.' },
  { spell: 'Absorb Elements', note: 'Halving damage scales with enemy damage.' },
  { spell: 'Healing Word', note: '0→1 HP is always the best heal value.' },
  { spell: 'Silvery Barbs', note: 'Rerolling saves never stops being useful.' },
  { spell: 'Bless', note: '+1d4 scales because it\'s a flat bonus.' },
  { spell: 'Goodberry', note: 'Food + emergency heals at any level.' },
  { spell: 'Find Familiar', note: 'Scout, Help action, deliver touch spells. Always useful.' },
];
