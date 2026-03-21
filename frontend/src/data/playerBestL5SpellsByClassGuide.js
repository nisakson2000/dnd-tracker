/**
 * playerBestL5SpellsByClassGuide.js
 * Player Mode: Best level 5 spells by class — high-impact magic
 * Pure JS — no React dependencies.
 */

export const BARD_L5 = [
  { spell: 'Synaptic Static', rating: 'S+', why: '8d6 psychic + subtract 1d6 from attacks/checks/concentration. INT save. No concentration.' },
  { spell: 'Hold Monster', rating: 'S', why: 'Paralyzed. Any creature type (not just humanoids). WIS save.' },
  { spell: 'Greater Restoration', rating: 'S', why: 'Remove exhaustion, charm, petrify, curse, stat reduction. Essential.' },
  { spell: 'Animate Objects', rating: 'S+', why: '10 tiny objects: +8 to hit, 1d4+4 each. 10 attacks/round. Insane DPR.' },
  { spell: 'Wall of Force', rating: 'S+', why: 'Indestructible wall/dome. No save. Split encounters. Trap enemies.' },
  { spell: 'Modify Memory', rating: 'A+', why: 'Rewrite 10 minutes of memory. WIS save. Social pillar nuke.' },
];

export const CLERIC_L5 = [
  { spell: 'Holy Weapon', rating: 'S', why: '+2d8 radiant per hit. BA to end: 4d8 AoE + blind. No concentration tax beyond upkeep.' },
  { spell: 'Greater Restoration', rating: 'S', why: 'Remove almost any debuff. Always prepare.' },
  { spell: 'Raise Dead', rating: 'A+', why: 'Revive dead (up to 10 days). 500gp diamond. Penalties for 4 days.' },
  { spell: 'Dawn', rating: 'A+', why: '4d10 radiant in cylinder + dim light = anti-undead nuke.' },
  { spell: 'Flame Strike', rating: 'B+', why: '4d6 fire + 4d6 radiant. Worse than Fireball in most cases.' },
  { spell: 'Summon Celestial', rating: 'A+', why: 'Tasha\'s. Reliable celestial ally. Scales well.' },
];

export const DRUID_L5 = [
  { spell: 'Wall of Stone', rating: 'S', why: 'Permanent walls. Split encounters. Create structures. No HP limit if 10+ min.' },
  { spell: 'Conjure Elemental', rating: 'A+', why: 'Powerful elemental ally. Careful: goes hostile if concentration drops.' },
  { spell: 'Greater Restoration', rating: 'S', why: 'Remove any major condition. Essential.' },
  { spell: 'Transmute Rock', rating: 'A+', why: 'Rock to mud: restrained + 20ft/turn sinking. Devastating area control.' },
  { spell: 'Wrath of Nature', rating: 'A', why: 'Trees, rocks, grass all attack enemies. Great in forests.' },
  { spell: 'Maelstrom', rating: 'A', why: '6d6 bludgeoning + pull toward center. Area denial.' },
];

export const SORCERER_L5 = [
  { spell: 'Synaptic Static', rating: 'S+', why: '8d6 psychic + permanent debuff (subtract 1d6). No concentration. Best L5 damage.' },
  { spell: 'Wall of Force', rating: 'S+', why: 'Indestructible. Split encounters. Dome to trap. No save.' },
  { spell: 'Animate Objects', rating: 'S+', why: '10 tiny objects = 10 attacks at +8, 1d4+4 each. Absurd DPR.' },
  { spell: 'Hold Monster', rating: 'S', why: 'Paralyzed. Any creature type. WIS save.' },
  { spell: 'Telekinesis', rating: 'A+', why: 'Move creatures/objects 30ft. Restrain or hurl. Concentration.' },
  { spell: 'Bigby\'s Hand', rating: 'A+', why: 'Versatile: grapple, shove, punch (4d8), interpose (half damage).' },
];

export const WARLOCK_L5 = [
  { spell: 'Synaptic Static', rating: 'S+', why: '8d6 psychic + subtract 1d6. No concentration. Best L5 pick.' },
  { spell: 'Hold Monster', rating: 'S', why: 'Paralyzed any creature. WIS save. Concentration.' },
  { spell: 'Wall of Light', rating: 'A', why: '4d8 radiant on entry. BA: fire a beam of light.' },
  { spell: 'Enervation', rating: 'A', why: '4d8 necrotic/round. Heal half. Sustained single-target.' },
  { spell: 'Danse Macabre', rating: 'A', why: '5 undead servants from corpses. Action economy boost.' },
  { spell: 'Far Step', rating: 'A', why: 'BA teleport 60ft each turn for 1 minute. Incredible mobility.' },
];

export const WIZARD_L5 = [
  { spell: 'Wall of Force', rating: 'S+', why: 'Indestructible wall/dome. No save. Best control spell at this level.' },
  { spell: 'Animate Objects', rating: 'S+', why: '10 tiny objects = 10 attacks. Best sustained DPR in the game.' },
  { spell: 'Synaptic Static', rating: 'S+', why: '8d6 psychic + debuff. No concentration. Replaces Fireball.' },
  { spell: 'Telekinesis', rating: 'A+', why: 'Move anything 30ft. Restrain creatures. Versatile.' },
  { spell: 'Bigby\'s Hand', rating: 'A+', why: 'Giant hand: grapple, punch, block, shove. Scales with upcast.' },
  { spell: 'Hold Monster', rating: 'S', why: 'Paralyze anything. WIS save. Auto-crit in melee.' },
  { spell: 'Steel Wind Strike', rating: 'A+', why: 'Teleport + 6d10 force to 5 targets. Melee spell attack.' },
  { spell: 'Rary\'s Telepathic Bond', rating: 'A', why: 'Ritual. Party telepathy for 1 hour. Perfect coordination.' },
  { spell: 'Passwall', rating: 'A', why: 'Walk through 20ft of wall. Bypass any physical barrier.' },
  { spell: 'Scrying', rating: 'A', why: 'Spy on anyone. WIS save with modifiers. Intel gathering.' },
];

export const L5_SPELL_TIPS = [
  'Synaptic Static: best L5 damage spell. 8d6 + permanent debuff. No concentration.',
  'Wall of Force: indestructible. Split the encounter. Win the fight.',
  'Animate Objects: 10 tiny objects = 10 attacks/round. Insane DPR.',
  'Greater Restoration: always prepare. Remove exhaustion, charm, petrify.',
  'Hold Monster: Paralyze anything. Auto-crit melee. WIS save.',
  'L5 slots are premium. Save for Wall of Force and Animate Objects.',
  'Holy Weapon (Cleric): +2d8 radiant per hit. Give to your Fighter.',
  'Wall of Stone: permanent walls. Reshape the battlefield permanently.',
  'Raise Dead: revive the dead. 500gp diamond. Always carry one.',
  'Steel Wind Strike: 6d10 to 5 targets + teleport. Amazing action economy.',
];
