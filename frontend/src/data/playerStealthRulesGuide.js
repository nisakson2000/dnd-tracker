/**
 * playerStealthRulesGuide.js
 * Player Mode: Stealth rules comprehensive guide
 * Pure JS — no React dependencies.
 */

export const STEALTH_BASICS = {
  hiding: 'Action: make a DEX (Stealth) check. Must be unseen/heavily obscured. Compare vs Passive Perception.',
  unseen: 'While hidden: enemies don\'t know your location. Attacks against you have disadvantage. Your attacks have advantage (if target can\'t see you).',
  revealed: 'You stop being hidden when: you attack (hit or miss), cast a spell with verbal component, enemy finds you, or you\'re no longer obscured.',
  passivePerception: 'Passive Perception = 10 + WIS mod + proficiency (if proficient). Disadvantage on Perception = -5 to passive.',
  note: 'Stealth is one of the most misunderstood rules in 5e. Key: you need cover/obscurement to ATTEMPT to hide.',
};

export const STEALTH_IN_COMBAT = [
  { rule: 'Hide action in combat', detail: 'Costs your action (or bonus action for Rogues/Goblin). Must break line of sight first. Then roll Stealth.', note: 'Can\'t hide in plain sight unless you have a feature allowing it.' },
  { rule: 'Attacking from hidden', detail: 'Advantage on the attack. After attacking (hit or miss), you are revealed.', note: 'Rogues: hide as bonus action → attack with advantage next turn → Sneak Attack guaranteed.' },
  { rule: 'Cunning Action: Hide', detail: 'Rogues can Hide as a bonus action. This is the core Rogue combat loop: attack → bonus action Hide.', note: 'Requires something to hide behind. Move behind cover → hide → next turn attack with advantage.' },
  { rule: 'Heavily obscured areas', detail: 'Darkness, heavy fog, dense foliage. Can hide without total cover if heavily obscured.', note: 'Devil\'s Sight + Darkness: you\'re in heavily obscured area. You can hide. Enemies can\'t see you.' },
  { rule: 'Invisible creatures', detail: 'Invisibility: always unseen. Can still be detected by sound, smell, tracks. Still need to be quiet (Stealth check) to be truly hidden.', note: 'Invisible ≠ hidden. Invisible + Stealth check = hidden.' },
];

export const STEALTH_SPECIAL_ABILITIES = [
  { ability: 'Halfling: Naturally Stealthy', detail: 'Can hide behind any Medium or larger creature. Hide behind your party members in combat.', rating: 'A' },
  { ability: 'Wood Elf: Mask of the Wild', detail: 'Can hide when lightly obscured by natural phenomena (rain, snow, foliage, mist).', rating: 'A' },
  { ability: 'Skulker feat', detail: 'Can hide when lightly obscured. Missing ranged attack doesn\'t reveal position. Dim light doesn\'t impose disadvantage on Perception.', rating: 'B' },
  { ability: 'Gloomstalker: Umbral Sight', detail: 'Invisible to creatures relying on darkvision to see you. In darkness: most monsters can\'t see you at all.', rating: 'S' },
  { ability: 'Pass Without Trace', detail: '+10 to Stealth for entire party. Turns everyone into a stealth operative.', rating: 'S' },
  { ability: 'Cloak of Elvenkind', detail: 'Advantage on Stealth. Creatures have disadvantage on Perception to find you. Doesn\'t require attunement in some versions.', rating: 'A' },
  { ability: 'Boots of Elvenkind', detail: 'Advantage on Stealth checks that rely on moving silently. Stacks with Cloak of Elvenkind.', rating: 'A' },
];

export const STEALTH_TIPS = [
  { tip: 'Break line of sight first', detail: 'Move behind a pillar, around a corner, into bushes. THEN take the Hide action. You can\'t hide while observed.' },
  { tip: 'Fog Cloud for emergency hiding', detail: 'Cast Fog Cloud → everyone inside is heavily obscured → can attempt to hide. Works for whole party.' },
  { tip: 'Darkness + Darkvision trick', detail: 'In Darkness: creatures with darkvision see as if dim light (lightly obscured). They have disadvantage on Perception. Good for hiding.' },
  { tip: 'Minor Illusion cover', detail: 'Create a 5ft box/bush illusion. Hide behind it. If enemies don\'t investigate it, it\'s valid cover for hiding.' },
  { tip: 'Ready action from stealth', detail: 'Hide → Ready an attack → when trigger occurs, attack with advantage (you\'re still hidden). Sniper gameplay.' },
];

export function stealthCheckVsPassivePerception(stealthRoll, passivePerception) {
  return { hidden: stealthRoll >= passivePerception, margin: stealthRoll - passivePerception };
}

export function passivePerceptionWithConditions(wisMod, proficiency, isProficient, hasDisadvantage, hasAdvantage) {
  let pp = 10 + wisMod + (isProficient ? proficiency : 0);
  if (hasDisadvantage) pp -= 5;
  if (hasAdvantage) pp += 5;
  return pp;
}
