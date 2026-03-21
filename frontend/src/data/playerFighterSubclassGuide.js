/**
 * playerFighterSubclassGuide.js
 * Player Mode: Fighter subclass comparison and optimization
 * Pure JS — no React dependencies.
 */

export const FIGHTER_SUBCLASSES = [
  {
    subclass: 'Battle Master',
    rating: 'S+',
    source: 'PHB',
    keyFeature: 'Superiority Dice (d8→d12) + Maneuvers. Versatile combat options.',
    strengths: ['Best martial versatility', 'Maneuvers for any situation', 'Scales with any build'],
    weaknesses: ['Limited superiority dice (4-6)', 'Some maneuvers are situational'],
    bestManeuvers: ['Precision Attack (S+)', 'Riposte (S)', 'Trip Attack (S)', 'Menacing Attack (A+)', 'Goading Attack (A+)'],
    playstyle: 'Tactical fighter. Right tool for every situation.',
  },
  {
    subclass: 'Echo Knight',
    rating: 'S+',
    source: 'EGW',
    keyFeature: 'Manifest Echo: a ghostly copy of yourself. Attack from its position.',
    strengths: ['Incredible action economy', 'Attack from 30ft away', 'Sentinel on echo locks enemies', 'Free teleport to echo'],
    weaknesses: ['Echo has only 1 HP (AC 14+PB)', 'Uses BA to summon', 'Setting-specific'],
    playstyle: 'Control two positions at once. Be everywhere.',
  },
  {
    subclass: 'Rune Knight',
    rating: 'S',
    source: 'TCE',
    keyFeature: 'Runes: passive bonuses + activated effects. Giant\'s Might: grow Large.',
    strengths: ['Excellent rune options', 'Giant\'s Might = Large + 1d6 damage', 'Great saves boosts', 'Best grappler'],
    weaknesses: ['Limited rune activations (PB per LR)', 'Some runes are better than others'],
    bestRunes: ['Cloud (S: redirect attacks)', 'Fire (S: Restrained on hit)', 'Stone (A+: charm on hit)', 'Hill (A: resistance to damage)'],
    playstyle: 'Grow large. Grapple everything. Activate runes for control.',
  },
  {
    subclass: 'Eldritch Knight',
    rating: 'A+',
    source: 'PHB',
    keyFeature: 'Wizard spellcasting (Abjuration/Evocation focus). Shield + Absorb Elements.',
    strengths: ['Shield spell = best defensive reaction', 'War Magic at L7', 'Can\'t be disarmed (bond weapon)'],
    weaknesses: ['Limited spell slots', 'INT dependency makes you MAD', 'Spell list restrictions'],
    playstyle: 'Armored wizard-fighter. Shield, Absorb Elements, and Booming Blade.',
  },
  {
    subclass: 'Samurai',
    rating: 'A+',
    source: 'XGE',
    keyFeature: 'Fighting Spirit: advantage on ALL attacks for a turn (3/LR). Temp HP too.',
    strengths: ['Reliable advantage (no Reckless downsides)', 'WIS save proficiency at L7', 'Extra turn at L18 (die = bonus turn)'],
    weaknesses: ['Uses BA (competes with PAM/GWM)', 'Only 3 uses per LR'],
    playstyle: 'Burst damage. Pop Fighting Spirit, use GWM/Sharpshooter with advantage.',
  },
  {
    subclass: 'Champion',
    rating: 'B+',
    source: 'PHB',
    keyFeature: 'Improved Critical: crit on 19-20 (18-20 at L15).',
    strengths: ['Simple and effective', 'No resources to manage', 'Good for new players'],
    weaknesses: ['Mathematically weakest subclass', 'Crit range adds ~0.5 DPR', 'Boring for experienced players'],
    playstyle: 'Hit things. Sometimes crit. That\'s it.',
  },
  {
    subclass: 'Cavalier',
    rating: 'A',
    source: 'XGE',
    keyFeature: 'Unwavering Mark: BA attack + damage if marked target attacks others. Warding Maneuver.',
    strengths: ['Best "taunt" after Ancestral Guardian', 'Warding Maneuver protects allies', 'Vigorous at L18: unlimited OAs'],
    weaknesses: ['Mount-focused but works fine on foot', 'Mark uses limited STR mod/LR'],
    playstyle: 'Tank and protector. Force enemies to deal with you.',
  },
  {
    subclass: 'Psi Warrior',
    rating: 'A',
    source: 'TCE',
    keyFeature: 'Psionic Energy dice: protective field, telekinetic strikes, telekinetic movement.',
    strengths: ['Versatile psionic options', 'No spell slots needed', 'Telekinetic movement is fun'],
    weaknesses: ['Psi dice are limited (PB×2/LR)', 'Damage boost is small', 'Competes with Battle Master'],
    playstyle: 'Psychic fighter. Move allies, block damage, add force damage.',
  },
  {
    subclass: 'Arcane Archer',
    rating: 'C+',
    source: 'XGE',
    keyFeature: 'Arcane Shot: 2 special arrows per short rest (8 options at max level).',
    strengths: ['Cool shot options', 'Seeking Arrow ignores cover and goes around corners'],
    weaknesses: ['Only 2 uses per SR at ALL levels', 'Worst resource scaling in the game', 'Most options do low damage'],
    playstyle: 'Cool concept, terrible execution. Battle Master does archery better.',
  },
  {
    subclass: 'Purple Dragon Knight',
    rating: 'C',
    source: 'SCAG',
    keyFeature: 'Rallying Cry: Second Wind heals allies too. Inspiring Surge: ally attacks when you Action Surge.',
    strengths: ['Support fighter is a neat concept', 'Free ally healing on Second Wind'],
    weaknesses: ['Features are weak versions of better abilities', 'No unique combat identity', 'Worst fighter subclass'],
    playstyle: 'Support fighter. Better to just play a Paladin.',
  },
];

export const FIGHTER_GENERAL_TIPS = [
  'Action Surge is your best feature. Extra action 1-2/SR. Use for burst damage.',
  'Fighters get more ASIs than anyone (7 total). Take feats freely.',
  'Extra Attack scales: 2 at L5, 3 at L11, 4 at L20. More attacks = more damage and more chances for effects.',
  'Second Wind: 1d10+level HP as BA. Free healing every short rest.',
  'Indomitable (L9): reroll a failed save. Weak but can save your life.',
  'Fighter 1 is the best martial dip: CON save proficiency, Fighting Style, Second Wind.',
  'Fighter 2 is the best action dip: Action Surge on any build is incredible.',
];

export const FIGHTER_FIGHTING_STYLES = [
  { style: 'Great Weapon Fighting', effect: 'Reroll 1s and 2s on damage with two-handed. Avg +1.33 DPR with greatsword.', rating: 'A' },
  { style: 'Dueling', effect: '+2 damage with one-handed weapon (one hand free or shield).', rating: 'S', note: 'Best flat damage. Shield + Dueling is efficient.' },
  { style: 'Archery', effect: '+2 to ranged attack rolls.', rating: 'S+', note: 'Best fighting style. +2 to hit is massive.' },
  { style: 'Defense', effect: '+1 AC while wearing armor.', rating: 'A+', note: 'Simple, always on. Great for tanks.' },
  { style: 'Protection', effect: 'Impose disadvantage on attacks against adjacent allies (uses reaction + shield).', rating: 'B', note: 'Requires shield and reaction. Niche.' },
  { style: 'Two-Weapon Fighting', effect: 'Add ability mod to off-hand damage.', rating: 'B+', note: 'Only matters for TWF builds.' },
  { style: 'Blind Fighting', effect: '10ft Blindsight.', rating: 'A', note: 'Incredible in Fog Cloud or Darkness combos.' },
  { style: 'Superior Technique', effect: '1 maneuver + 1 superiority die (d6).', rating: 'A', note: 'Great non-BM dip. Precision Attack best pick.' },
  { style: 'Interception', effect: 'Reduce damage to adjacent ally by 1d10+PB (reaction).', rating: 'A', note: 'Better than Protection. Flat damage reduction.' },
];
