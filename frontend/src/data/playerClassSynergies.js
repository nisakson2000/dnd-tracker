/**
 * playerClassSynergies.js
 * Player Mode: Class combo synergies for party tactics
 * Pure JS — no React dependencies.
 */

export const CLASS_SYNERGIES = [
  {
    combo: 'Rogue + Any Melee Ally',
    classes: ['Rogue'],
    description: 'Rogue gets Sneak Attack whenever an ally is within 5ft of the target.',
    tactic: 'Tank stands next to the target, Rogue attacks from flanking or range for guaranteed Sneak Attack.',
    rating: 'S',
  },
  {
    combo: 'Paladin + Warlock (Darkness/Devil\'s Sight)',
    classes: ['Paladin', 'Warlock'],
    description: 'Warlock casts Darkness on Paladin, who has Devil\'s Sight via Eldritch Invocation.',
    tactic: 'Paladin attacks with advantage (enemies blinded), enemies attack with disadvantage. Smite on crits.',
    rating: 'A',
  },
  {
    combo: 'Bard/Cleric + Anyone (Bless)',
    classes: ['Bard', 'Cleric'],
    description: 'Bless gives +1d4 to attacks and saves for 3 creatures.',
    tactic: 'Cast on the three martial characters who attack most often. +2.5 average to every attack and save.',
    rating: 'S',
  },
  {
    combo: 'Wizard + Fighter (Wall of Force Split)',
    classes: ['Wizard', 'Fighter'],
    description: 'Wizard splits enemy group with Wall of Force, Fighter handles smaller group.',
    tactic: 'Divide and conquer. No save, no check. Wall is nearly indestructible.',
    rating: 'S',
  },
  {
    combo: 'Druid + Rogue (Faerie Fire)',
    classes: ['Druid', 'Rogue'],
    description: 'Faerie Fire gives advantage on attacks against affected creatures.',
    tactic: 'Rogue gets guaranteed Sneak Attack and advantage on every attack.',
    rating: 'A',
  },
  {
    combo: 'Sorcerer + Anyone (Haste)',
    classes: ['Sorcerer'],
    description: 'Haste doubles speed, +2 AC, and gives an extra attack action.',
    tactic: 'Cast on the Fighter or Paladin for maximum extra attacks.',
    rating: 'A',
  },
  {
    combo: 'Monk + Caster (Stunning Strike)',
    classes: ['Monk'],
    description: 'Monk stuns a target, giving all melee attacks advantage and auto-crit.',
    tactic: 'Monk stuns, Paladin Smites with advantage for crit-fishing.',
    rating: 'A',
  },
  {
    combo: 'Cleric + Barbarian (Spirit Guardians + Grapple)',
    classes: ['Cleric', 'Barbarian'],
    description: 'Barbarian grapples enemies and drags them into Spirit Guardians.',
    tactic: 'Enemies can\'t escape (grappled) and take 3d8 radiant each turn.',
    rating: 'A',
  },
  {
    combo: 'Ranger + Druid (Pass without Trace)',
    classes: ['Ranger', 'Druid'],
    description: '+10 to Stealth for the entire party. Even heavy armor can sneak.',
    tactic: 'Entire party infiltrates or ambushes for guaranteed surprise rounds.',
    rating: 'S',
  },
  {
    combo: 'Two Casters (Counterspell Coverage)',
    classes: ['Wizard', 'Sorcerer', 'Warlock', 'Bard'],
    description: 'Two Counterspell users mean you can counter the counter.',
    tactic: 'If enemy Counterspells your caster, the second caster Counterspells their Counterspell.',
    rating: 'A',
  },
];

export function getSynergiesForClass(className) {
  return CLASS_SYNERGIES.filter(s =>
    s.classes.some(c => c.toLowerCase() === (className || '').toLowerCase())
  );
}

export function getSynergiesForParty(classNames) {
  const names = (classNames || []).map(n => n.toLowerCase());
  return CLASS_SYNERGIES.filter(s =>
    s.classes.every(c => names.includes(c.toLowerCase())) ||
    s.classes.some(c => names.includes(c.toLowerCase()))
  );
}
