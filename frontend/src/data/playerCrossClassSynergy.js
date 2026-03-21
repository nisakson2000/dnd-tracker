/**
 * playerCrossClassSynergy.js
 * Player Mode: Party synergies and cross-class combos
 * Pure JS — no React dependencies.
 */

export const PARTY_COMBOS = [
  { combo: 'Rogue + Anyone with advantage', classes: 'Rogue + Barbarian/Wolf Totem/Faerie Fire caster', detail: 'Rogue needs advantage for Sneak Attack. Wolf Totem, Help action, Faerie Fire, flanking all provide it.', impact: 'Guaranteed 100% Sneak Attack uptime.' },
  { combo: 'Spike Growth + forced movement', classes: 'Druid/Ranger + Warlock (Repelling Blast) / Sorcerer (Telekinetic)', detail: '2d4 per 5ft moved. Repelling Blast pushes 10ft = 4d4. Push through the whole thing = 20d4.', impact: '50+ damage for a 2nd level slot.' },
  { combo: 'Hold Person + melee', classes: 'Caster + any melee', detail: 'Paralyzed = auto-crit from within 5ft. Paladin Smite crit = devastating. Rogue SA crit = nuclear.', impact: 'Double all dice on attacks. Often one-shots.' },
  { combo: 'Twin Haste + martial party', classes: 'Sorcerer + 2 Fighters/Paladins', detail: 'Two martials Hasted: +4 AC total, +20ft speed each, 2 extra attacks.', impact: 'Party damage doubles for 1 concentration spell.' },
  { combo: 'Spirit Guardians + grapple', classes: 'Cleric + Barbarian/Fighter (grappler)', detail: 'Grappler drags enemy into Spirit Guardians range. Can\'t escape. 3d8/turn auto-damage.', impact: 'Target takes 3d8 every turn with no save to escape (grapple hold).' },
  { combo: 'Darkness + Devil\'s Sight', classes: 'Warlock + Warlock (shared area)', detail: 'Warlock casts Darkness. Only they can see. Advantage on attacks, disadvantage on attacks against.', impact: 'But also blinds allies. Use carefully. Shadow of Moil is better for party.' },
  { combo: 'Paladin Aura + party saves', classes: 'Paladin + anyone', detail: '+CHA to all saves within 10ft. CHA 20 = +5 to all saves for everyone near you.', impact: 'Party-wide save boost. The best defensive feature in the game.' },
  { combo: 'Bless + Archery/SS', classes: 'Cleric + Sharpshooter Ranger/Fighter', detail: '+1d4 offsets the -5 from Sharpshooter. +10 damage becomes nearly free.', impact: 'Sharpshooter with no real penalty.' },
  { combo: 'Web + fire spell', classes: 'Wizard + any fire caster', detail: 'Web restrains creatures. Web is flammable. Fire spell ignites web = 2d4 fire to all in web.', impact: 'Crowd control + damage in one round.' },
  { combo: 'Commander\'s Strike + Rogue', classes: 'Battle Master Fighter + Rogue', detail: 'Fighter uses Commander\'s Strike → Rogue gets reaction attack → extra Sneak Attack (once per turn, not per round).', impact: 'Rogue gets 2 Sneak Attacks per round (their turn + Fighter\'s turn).' },
];

export const AURA_STACKING = {
  paladin: 'Aura of Protection (+CHA to all saves, 10ft → 30ft at L18).',
  conquest: 'Aura of Conquest: frightened enemies within 10ft have speed 0 + take psychic damage.',
  devotion: 'Aura of Devotion: immune to charmed within 10ft.',
  ancients: 'Aura of Warding: resistance to spell damage within 10ft.',
  watchers: 'Aura of the Sentinel: +PB to initiative within 30ft.',
  stacking: 'Paladin auras stack with each other AND with other effects. Two Paladins = two auras.',
};

export const ELEMENTAL_SYNERGY = [
  { setup: 'Enemies standing in water', payoff: 'Lightning damage: advantage on targets in water (some DMs rule).' },
  { setup: 'Oil + fire', payoff: 'Pour oil (1 sp) → ignite with fire spell → 5 damage/round for 2 rounds.' },
  { setup: 'Ice + prone', payoff: 'Sleet Storm/ice → difficult terrain + prone. Enemies can\'t stand up easily.' },
  { setup: 'Fog + Blindsight', payoff: 'Fog Cloud equalizes vision. Blindsight/Blind Fighting = you see, they don\'t.' },
];

export function comboEfficiency(damageWithCombo, damageWithout, spellSlotsUsed) {
  return (damageWithCombo - damageWithout) / spellSlotsUsed;
}
