/**
 * playerControlSpellTierGuide.js
 * Player Mode: Best battlefield control spells ranked by tier
 * Pure JS — no React dependencies.
 */

export const CONTROL_SPELLS_RANKED = [
  { spell: 'Hypnotic Pattern', level: 3, save: 'WIS', effect: 'Charmed + incapacitated. 30ft cube. Creatures that fail: OUT.', rating: 'S+', note: 'Best L3 control. Targets don\'t get repeat saves. Shaking awake costs ally\'s action.' },
  { spell: 'Web', level: 2, save: 'DEX', effect: 'Restrained. Difficult terrain. DEX check to escape (action).', rating: 'S+', note: 'Best L2 control. Restrained + difficult terrain. Flammable for extra damage.' },
  { spell: 'Wall of Force', level: 5, save: 'None', effect: 'Impenetrable wall/dome. No save. No HP.', rating: 'S+', note: 'No counterplay except Disintegrate. Split encounters.' },
  { spell: 'Banishment', level: 4, save: 'CHA', effect: 'Remove creature from plane. CHA save.', rating: 'S+', note: 'Remove biggest threat. If native: gone permanently if held 1 min.' },
  { spell: 'Slow', level: 3, save: 'WIS', effect: '-2 AC, half speed, no reactions, limited actions. Up to 6 targets.', rating: 'S', note: 'Multi-target debuff. No concentration escape. Brutal on martial enemies.' },
  { spell: 'Spike Growth', level: 2, save: 'None', effect: '20ft radius difficult terrain. 2d4 per 5ft moved. Hidden.', rating: 'S', note: 'No save on damage. Forced movement combos. Doesn\'t need to be seen.' },
  { spell: 'Hold Person', level: 2, save: 'WIS', effect: 'Paralyzed. Auto-crit within 5ft. WIS save each turn.', rating: 'S', note: 'Paralyzed = auto-crit for melee allies. Paladin Smite combo.' },
  { spell: 'Entangle', level: 1, save: 'STR', effect: 'Restrained. 20ft square. STR check to escape.', rating: 'A+', note: 'L1 restrain. Great early control. Druid/Ranger.' },
  { spell: 'Fog Cloud', level: 1, save: 'None', effect: 'Heavily obscured sphere. Blocks sight.', rating: 'A', note: 'Blocks targeting. Emergency cover. Breaks enemy advantage.' },
  { spell: 'Faerie Fire', level: 1, save: 'DEX', effect: 'Advantage on attacks vs affected creatures. Invisible creatures revealed.', rating: 'A+', note: 'AoE advantage. Reveals invisible. Great support.' },
  { spell: 'Silence', level: 2, save: 'None', effect: '20ft sphere. No sound. Can\'t cast V spells.', rating: 'A+', note: 'Anti-caster sphere. No verbal components = most spells blocked.' },
  { spell: 'Plant Growth', level: 3, save: 'None', effect: '100ft radius. Quarter speed. Not concentration.', rating: 'S', note: 'No save, no concentration. Quarter speed = 7.5ft movement. Insane area denial.' },
  { spell: 'Forcecage', level: 7, save: 'None (CHA to teleport out)', effect: 'Cage or box. No save. No HP. Teleport out: CHA save.', rating: 'S+', note: 'Best control spell. No save. Can\'t break. Only teleport out (CHA save).' },
  { spell: 'Maze', level: 8, save: 'None (INT check to escape)', effect: 'Banish to demiplane. INT check DC 20 to escape. No initial save.', rating: 'S+', note: 'No save. INT-based escape. Most monsters have low INT. 10 min duration.' },
];

export const CONTROL_SPELL_TIPS = [
  'Hypnotic Pattern: best L3 control. No repeat saves. Shaking = ally\'s action.',
  'Web: L2 restrain. Flammable. Best early control spell.',
  'Wall of Force: no save, no break. Only Disintegrate. Split and conquer.',
  'Spike Growth + forced movement: 2d4 per 5ft. No save on the damage.',
  'Hold Person + melee: auto-crit. Paladin Smite doubled. Devastating.',
  'Plant Growth: no concentration! Quarter speed. Best area denial.',
  'Silence: drop on enemy caster. Most spells need verbal components.',
  'Slow: targets 6 creatures. No save to end early (save each turn to end on self).',
  'Forcecage: L7. No save. No break. Best single-target lockdown.',
  'Control > damage. One Hypnotic Pattern > multiple Fireballs.',
];
