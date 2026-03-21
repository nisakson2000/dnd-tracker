/**
 * playerLineOfSightGuide.js
 * Player Mode: Line of sight and obscurement rules
 * Pure JS — no React dependencies.
 */

export const OBSCUREMENT_LEVELS = [
  { level: 'Lightly Obscured', examples: 'Dim light, patchy fog, moderate foliage', effect: 'Disadvantage on Perception checks relying on sight.', combat: 'Can still see targets. Can still target creatures. Disadvantage on Perception only.' },
  { level: 'Heavily Obscured', examples: 'Darkness, opaque fog, dense foliage, Fog Cloud, Darkness spell', effect: 'Creatures are effectively BLINDED when trying to see into/through.', combat: 'Can\'t target creatures you can\'t see (most spells require "a creature you can see"). Attacks have disadvantage. Attacks against you have advantage (but you can\'t see to attack them either).' },
];

export const VISION_TYPES = [
  { type: 'Normal Vision', range: 'Requires light', darkness: 'Blinded in darkness', note: 'Most humans. Torches, Light cantrip, or other illumination needed.' },
  { type: 'Darkvision', range: '60ft (most races)', darkness: 'Dim light → normal. Darkness → dim light (lightly obscured). Grayscale only.', note: 'Common misconception: darkvision does NOT let you see in darkness normally. Darkness = dim light = disadvantage on Perception.' },
  { type: 'Superior Darkvision', range: '120ft', darkness: 'Same as darkvision but 120ft range', note: 'Drow, Deep Gnomes. Same rules, just longer range.' },
  { type: 'Blindsight', range: '10-120ft (varies)', darkness: 'Perceives surroundings without sight. Not affected by blindness.', note: 'Ignores invisibility, darkness, fog. Can\'t be fooled by illusions within range.' },
  { type: 'Truesight', range: '120ft (rare)', darkness: 'Sees in darkness, invisible creatures, ethereal plane, illusions, shapechangers\' true forms.', note: 'Rarest and best vision. True Seeing spell (L6) grants 120ft Truesight.' },
  { type: 'Tremorsense', range: '30-60ft (varies)', darkness: 'Detects creatures touching the ground. Doesn\'t help with flying/hovering.', note: 'Mostly monster ability. Detects movement through vibrations. Can\'t detect flying creatures.' },
];

export const DARKNESS_COMBAT_RULES = [
  { rule: 'Both sides blinded', effect: 'Attacker has disadvantage. Defender has advantage from being unseen. These CANCEL OUT. Attacks are straight rolls.', note: 'If neither can see the other, advantage and disadvantage cancel. Effectively normal combat.' },
  { rule: 'One side can see', effect: 'The sighted creature has advantage on attacks. The blind creature has disadvantage on attacks.', note: 'Devil\'s Sight, Blindsight, or light source. Huge combat advantage.' },
  { rule: 'Targeting in darkness', effect: 'Most spells require "a creature you can see." Can\'t target invisible/hidden creatures with these spells.', note: 'Fireball targets a POINT, not a creature. AoE spells work in darkness. Single-target often doesn\'t.' },
  { rule: 'Guessing enemy location', effect: 'If you know an enemy is there but can\'t see them: attack the square. DM confirms hit/miss. If wrong square, auto-miss.', note: 'You can attack a space where you think an enemy is. This is "attacking an unseen target."' },
];

export const LINE_OF_SIGHT_SPELLS = [
  { category: 'Requires sight', examples: 'Hold Person, Banishment, Polymorph, most single-target spells', rule: '"a creature you can see" — can\'t cast on invisible/hidden/obscured creatures.' },
  { category: 'Targets a point', examples: 'Fireball, Fog Cloud, Spirit Guardians (self)', rule: '"a point you can see" — need to see the location, not the creature. Works in fog if you know the spot.' },
  { category: 'Self/emanation', examples: 'Shield, Spirit Guardians, Aura spells', rule: 'Affects self or area around you. No sight needed for the spell effect itself.' },
  { category: 'No sight required', examples: 'Healing Word (creature within range), Magic Missile', rule: 'Some spells just need the target to be "within range." Can heal allies you can\'t see.' },
];

export function combatModifiersInDarkness(attackerCanSee, defenderCanSee) {
  if (attackerCanSee && !defenderCanSee) return { attackerAdvantage: true, defenderDisadvantage: true, note: 'Attacker has advantage, defender has disadvantage' };
  if (!attackerCanSee && defenderCanSee) return { attackerDisadvantage: true, defenderAdvantage: false, note: 'Attacker has disadvantage' };
  if (!attackerCanSee && !defenderCanSee) return { straightRolls: true, note: 'Advantage and disadvantage cancel — straight rolls' };
  return { normal: true, note: 'Both can see — normal combat' };
}
