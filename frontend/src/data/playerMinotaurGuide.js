/**
 * playerMinotaurGuide.js
 * Player Mode: Minotaur race guide — the horned charger
 * Pure JS — no React dependencies.
 */

export const MINOTAUR_BASICS = {
  race: 'Minotaur',
  source: 'Guildmaster\'s Guide to Ravnica / MotM',
  size: 'Medium',
  speed: '30ft',
  asi: '+2 STR, +1 CON (original) or flexible (MotM)',
  theme: 'Horned powerhouse. Gore attack and Hammering Horns push.',
  note: 'Excellent martial race. Bonus action gore after Dash, and bonus action push after melee hit. Great synergy with GWM.',
};

export const MINOTAUR_TRAITS = [
  { trait: 'Horns', effect: 'Unarmed strike: 1d6+STR piercing.', note: '1d6 horns. Natural weapon. Can be used with Goring Rush.' },
  { trait: 'Goring Rush', effect: 'When you Dash, you can make one Horns attack as a bonus action.', note: 'Dash + free attack. Charge into combat with a bonus action gore. Great opening.' },
  { trait: 'Hammering Horns', effect: 'After hitting with a melee attack, bonus action: push target 10ft away (STR save vs 8+prof+STR).', note: 'Bonus action push after ANY melee hit. Push into hazards, off cliffs, away from allies.' },
  { trait: 'Labyrinthine Recall', effect: 'Advantage on checks to navigate or remember paths.', note: 'Never get lost in a dungeon. Flavor but occasionally useful.' },
];

export const MINOTAUR_BUILDS = [
  { build: 'Minotaur Fighter (GWM)', detail: '+2 STR. Hit with greatsword → Hammering Horns push 10ft → GWM bonus action attack on kill/crit. Push for control.', rating: 'S' },
  { build: 'Minotaur Barbarian', detail: '+2 STR +1 CON. Gore on charge. Push while raging. Natural berserker feel.', rating: 'A' },
  { build: 'Minotaur Paladin', detail: '+2 STR. Smite + push 10ft. Knock enemies away from squishy allies.', rating: 'A' },
  { build: 'Minotaur Rune Knight', detail: '+2 STR. Giant\'s Might (Large) + Hammering Horns. Push Large creatures. Fire Rune restraint.', rating: 'A' },
  { build: 'Minotaur + Spike Growth combo', detail: 'Ally casts Spike Growth. Hit enemy → Hammering Horns → push 10ft through Spike Growth = 4d4 damage.', rating: 'S' },
];

export const HAMMERING_HORNS_COMBOS = [
  { combo: 'Push into Spike Growth', detail: 'Push 10ft through Spike Growth = 2×5ft = 4d4 (10 avg) damage. Every turn.', rating: 'S' },
  { combo: 'Push off cliff/ledge', detail: 'Push 10ft toward edge → target falls → fall damage. No save if you push them off.', rating: 'A' },
  { combo: 'Push into Spirit Guardians', detail: 'Push enemy 10ft into ally\'s Spirit Guardians aura. They enter = 3d8 radiant damage.', rating: 'A' },
  { combo: 'Push into Wall of Fire', detail: 'Push through Wall of Fire = 5d8 fire damage on entry.', rating: 'S' },
  { combo: 'Push away from squishy', detail: 'Enemy adjacent to your Wizard? Hit them → push 10ft away. Protective push.', rating: 'A' },
];

export function hammeringHornsDC(profBonus, strMod) {
  return 8 + profBonus + strMod;
}

export function pushIntoSpikeGrowthDamage(pushDistance) {
  const segments = Math.floor(pushDistance / 5);
  return segments * 5; // 2d4 avg per 5ft = 5 per segment
}
