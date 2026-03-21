/**
 * playerCantripOptimization.js
 * Player Mode: Cantrip selection, scaling, and optimization by class
 * Pure JS — no React dependencies.
 */

export const CANTRIP_SCALING = {
  rule: 'Most damage cantrips scale at levels 5, 11, and 17 (character level, not class level).',
  levels: [
    { level: 1, dice: '1d' },
    { level: 5, dice: '2d' },
    { level: 11, dice: '3d' },
    { level: 17, dice: '4d' },
  ],
  note: 'Character level, not class level. A Fighter 17/Wizard 1 still gets 4d scaling.',
};

export const BEST_DAMAGE_CANTRIPS = [
  { cantrip: 'Eldritch Blast', class: 'Warlock', damage: '1d10 force (per beam)', scaling: '1/2/3/4 beams', note: 'Best cantrip in the game. Force damage. Multiple beams = multiple modifiers with Agonizing Blast.', rating: 'S' },
  { cantrip: 'Toll the Dead', class: 'Cleric/Wizard', damage: '1d8/1d12 necrotic', scaling: 'Die increases', note: '1d12 if target is already hurt. Best single-die cantrip. WIS save.', rating: 'S' },
  { cantrip: 'Fire Bolt', class: 'Wizard/Sorcerer/Artificer', damage: '1d10 fire', scaling: 'Die increases', note: 'Long range (120ft). Good damage. Fire resistance is common though.', rating: 'A' },
  { cantrip: 'Sacred Flame', class: 'Cleric', damage: '1d8 radiant', scaling: 'Die increases', note: 'Ignores cover. DEX save. Radiant damage is rarely resisted.', rating: 'A' },
  { cantrip: 'Booming Blade', class: 'Multiple', damage: 'Weapon + 1d8 thunder (if target moves)', scaling: 'Both increase', note: 'Melee cantrip. Punishes movement. Great for Rogues and Warcasters.', rating: 'S' },
  { cantrip: 'Green-Flame Blade', class: 'Multiple', damage: 'Weapon + fire splash to nearby enemy', scaling: 'Both increase', note: 'Melee cantrip. Cleave damage. Better than Booming Blade vs grouped enemies.', rating: 'A' },
  { cantrip: 'Mind Sliver', class: 'Wizard/Sorcerer', damage: '1d6 psychic', scaling: 'Die increases', note: 'Subtract 1d4 from target\'s next save. Set up save-or-suck spells.', rating: 'S' },
  { cantrip: 'Chill Touch', class: 'Wizard/Sorcerer/Warlock', damage: '1d8 necrotic', scaling: 'Die increases', note: 'Prevents healing. Undead get disadvantage on attacks. Anti-regeneration.', rating: 'A' },
];

export const BEST_UTILITY_CANTRIPS = [
  { cantrip: 'Guidance', class: 'Cleric/Druid/Artificer', effect: '+1d4 to one ability check.', note: 'Cast before EVERY skill check. Free bonus. Most impactful cantrip.', rating: 'S' },
  { cantrip: 'Prestidigitation', class: 'Wizard/Sorcerer', effect: 'Minor magical effects (clean, flavor, warm, light, etc).', note: 'Infinite creative uses. Social, exploration, flavor.', rating: 'A' },
  { cantrip: 'Mage Hand', class: 'Multiple', effect: 'Spectral hand manipulates objects at 30ft.', note: 'Trigger traps, grab items, pickpocket (Arcane Trickster).', rating: 'A' },
  { cantrip: 'Minor Illusion', class: 'Multiple', effect: 'Sound or image in 5ft cube.', note: 'Create cover, distract enemies, bluff.', rating: 'A' },
  { cantrip: 'Light', class: 'Multiple', effect: 'Object sheds bright light 20ft + dim 20ft.', note: 'No hand occupied (unlike torch). 1 hour.', rating: 'B' },
  { cantrip: 'Message', class: 'Multiple', effect: 'Whisper to creature within 120ft. They reply.', note: 'Silent communication. Coordinate plans.', rating: 'B' },
  { cantrip: 'Shape Water', class: 'Multiple', effect: 'Move/freeze/change water in 5ft cube.', note: 'Create ice, part water, freeze locks. Creative uses.', rating: 'B' },
  { cantrip: 'Mold Earth', class: 'Multiple', effect: 'Move/excavate earth in 5ft cube.', note: 'Dig trenches, create cover, move dirt barriers.', rating: 'B' },
];

export const CANTRIP_BY_CLASS = {
  wizard: ['Mind Sliver', 'Fire Bolt', 'Minor Illusion', 'Mage Hand', 'Prestidigitation'],
  cleric: ['Toll the Dead', 'Sacred Flame', 'Guidance', 'Light', 'Spare the Dying'],
  druid: ['Guidance', 'Produce Flame', 'Thorn Whip', 'Shape Water', 'Mold Earth'],
  sorcerer: ['Fire Bolt', 'Mind Sliver', 'Prestidigitation', 'Minor Illusion', 'Mage Hand'],
  warlock: ['Eldritch Blast', 'Minor Illusion', 'Prestidigitation', 'Mage Hand'],
  bard: ['Vicious Mockery', 'Minor Illusion', 'Mage Hand', 'Prestidigitation'],
};

export function cantripDamage(dieSize, characterLevel, abilityMod, addsMod) {
  let dice = 1;
  if (characterLevel >= 17) dice = 4;
  else if (characterLevel >= 11) dice = 3;
  else if (characterLevel >= 5) dice = 2;
  const avg = dice * (dieSize / 2 + 0.5);
  return avg + (addsMod ? abilityMod : 0);
}

export function ebDamageTotal(chaMod, level, hasAgonizing) {
  const beams = level >= 17 ? 4 : level >= 11 ? 3 : level >= 5 ? 2 : 1;
  return beams * (5.5 + (hasAgonizing ? chaMod : 0));
}
