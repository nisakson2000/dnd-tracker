/**
 * playerWebSpellGuide.js
 * Player Mode: Web — best L2 control spell
 * Pure JS — no React dependencies.
 */

export const WEB_BASICS = {
  spell: 'Web',
  level: 2,
  school: 'Conjuration',
  castTime: '1 action',
  duration: '1 hour (concentration)',
  range: '60 feet',
  area: '20ft cube',
  save: 'DEX save or restrained. Can repeat save (action) each turn.',
  classes: ['Wizard', 'Sorcerer', 'Artificer'],
  note: 'Best L2 control spell in the game. Restrained is devastating. Lasts 1 hour. Scales by never falling off.',
};

export const RESTRAINED_CONDITION = {
  effects: [
    'Speed becomes 0.',
    'Attack rolls against restrained creature have advantage.',
    'Restrained creature\'s attack rolls have disadvantage.',
    'Disadvantage on DEX saves.',
  ],
  note: 'Restrained is one of the best conditions to inflict. Advantage to hit + disadvantage on their attacks = massive swing.',
};

export const WEB_TACTICS = [
  { tactic: 'Chokepoint control', detail: 'Cast Web in doorway/corridor. Enemies must cross it or go around. Splits encounters.', rating: 'S' },
  { tactic: 'Web + ranged attacks', detail: 'Restrained = advantage on attacks. Party ranged attackers get free advantage.', rating: 'S' },
  { tactic: 'Web + save spells', detail: 'Restrained = disadvantage on DEX saves. Follow with Fireball for near-guaranteed damage.', rating: 'S' },
  { tactic: 'Web + Spike Growth', detail: 'Enemies restrained in difficult terrain. Even if they break free, Spike Growth shreds them.', rating: 'A' },
  { tactic: 'Battlefield denial', detail: 'Web covers 20ft cube. Enemies avoid it entirely. Controls movement without needing saves.', rating: 'A' },
  { tactic: 'Flammable webs', detail: 'Webs are flammable. Each 5ft cube burns away in 1 round, dealing 2d4 fire to creatures inside.', rating: 'B' },
];

export const WEB_TIPS = [
  'Web needs two anchor points (walls, floor, ceiling). In open fields, it layers on the ground as difficult terrain only.',
  'If cast between walls/pillars: full 3D web. Creatures inside are restrained. Much more effective indoors.',
  'STR check (not save) to break free. Low-STR creatures (casters, small enemies) struggle enormously.',
  'Concentration spell. Protect it — if you drop concentration, webs remain but become non-magical (easier to escape).',
  'At higher levels, Web is still excellent. A L2 slot for advantage on all attacks against a group is always efficient.',
  'Immune creatures: anything with freedom of movement, oozes, incorporeal creatures.',
];

export const WEB_VS_OTHER_CONTROL = {
  vsEntangle: { webWins: 'Web lasts 1 hour vs 1 min. Web works indoors on walls. Same save (STR check to escape).', entangleWins: 'Entangle is L1 (cheaper slot). Druid-exclusive.' },
  vsHold: { webWins: 'Web is AoE. Hold Person is single target (or limited targets at higher slots). Web = DEX save, weaker for most monsters.', holdWins: 'Hold Person gives paralyzed (auto-crits in 5ft). Much stronger single-target.' },
  vsHypnoticPattern: { webWins: 'Web at L2 vs HP at L3. Web restrains (still allows saves). HP incapacitates but breaks on damage.', hpWins: 'HP removes enemies completely. No save to break free — only takes damage or an ally\'s action.' },
};

export function webSaveDC(spellcastingMod, profBonus) {
  return { dc: 8 + spellcastingMod + profBonus, note: `Web save DC: ${8 + spellcastingMod + profBonus}` };
}
