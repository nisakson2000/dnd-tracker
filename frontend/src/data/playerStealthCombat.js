/**
 * playerStealthCombat.js
 * Player Mode: Using stealth during combat, hiding rules, and unseen attacker benefits
 * Pure JS — no React dependencies.
 */

export const HIDING_IN_COMBAT = {
  requirement: 'Must have total cover or be heavily obscured from the creature you\'re hiding from.',
  action: 'Hide action (Rogue: Cunning Action bonus action)',
  check: 'Stealth check vs each creature\'s passive Perception',
  benefit: 'Attacks against hidden creatures have disadvantage. Hidden attacker has advantage on first attack.',
  revealing: 'Making an attack or casting a spell with V/S components reveals your location (even if attack misses).',
  stayHidden: 'You can move while hidden as long as you stay behind cover/concealment.',
  note: 'You can\'t hide from a creature that can see you clearly. Need cover or concealment.',
};

export const UNSEEN_ATTACKER = {
  advantage: 'If target can\'t see you, you have advantage on attack rolls.',
  hidden: 'Being hidden is one way to be unseen. Invisibility is another.',
  disadvantage: 'If you can\'t see your target, you have disadvantage (but must guess their location).',
  cancelOut: 'If BOTH sides can\'t see each other, advantage and disadvantage cancel = normal roll.',
  revelation: 'Your position is revealed when you attack, whether you hit or miss, unless you have a feature that says otherwise.',
};

export const STEALTH_BUILDS = [
  { build: 'Lightfoot Halfling Rogue', feature: 'Naturally Stealthy: hide behind a creature one size larger (use allies as cover)', rating: 'S', note: 'Hide behind the Fighter, attack with advantage, hide again. Repeat.' },
  { build: 'Wood Elf Ranger/Rogue', feature: 'Mask of the Wild: hide when lightly obscured by natural phenomena (rain, fog, leaves)', rating: 'A', note: 'Can hide in light fog or falling leaves. Very broad trigger outdoors.' },
  { build: 'Gloom Stalker Ranger', feature: 'Umbral Sight: invisible to creatures relying on darkvision to see you', rating: 'S', note: 'In darkness, most enemies use darkvision. You\'re invisible to them. Free advantage.' },
  { build: 'Shadow Monk', feature: 'Shadow Step: teleport 60ft between dim light/darkness, advantage on first attack', rating: 'A', note: 'Free teleport + advantage. No ki cost. Only needs dim light/darkness.' },
  { build: 'Arcane Trickster', feature: 'Magical Ambush (level 9): hidden + spell = target has disadvantage on save', rating: 'S', note: 'Hide, then cast Hold Person. Target has disadvantage on the save. Brutal.' },
  { build: 'Skulker feat', feature: 'Missing a ranged attack doesn\'t reveal position. Can hide when lightly obscured.', rating: 'B', note: 'Miss an arrow, stay hidden, try again. Niche but effective for ranged stealth.' },
];

export const STEALTH_COMBAT_TACTICS = [
  { tactic: 'Shoot and hide', description: 'Attack from hiding (advantage), then Cunning Action Hide behind cover. Repeat every turn.', classes: ['Rogue'], effectiveness: 'S' },
  { tactic: 'Darkness + stealth', description: 'Create magical darkness. Hide within it. Attack from darkness with advantage.', classes: ['Warlock', 'Shadow Sorcerer'], effectiveness: 'A' },
  { tactic: 'Fog Cloud stealth', description: 'Cast Fog Cloud. Both sides are blinded. But you can Hide within it for advantage on exit.', classes: ['Any caster'], effectiveness: 'B' },
  { tactic: 'Invisibility attack', description: 'Cast Invisibility/Greater Invisibility. Attack with advantage. Greater Invis doesn\'t break on attack.', classes: ['Wizard', 'Sorcerer', 'Bard'], effectiveness: 'S' },
  { tactic: 'Familiar scout', description: 'Send invisible familiar (Imp, Chain Pact) to scout enemy positions. Attack informed.', classes: ['Warlock', 'Wizard'], effectiveness: 'A' },
  { tactic: 'Pass Without Trace in combat', description: '+10 to all party Stealth checks. Even in combat, allies can Hide more easily.', classes: ['Druid', 'Ranger'], effectiveness: 'A' },
];

export const HIDING_MISTAKES = [
  'Trying to hide in plain sight without cover or concealment — you need something to hide behind.',
  'Thinking you stay hidden after attacking — you\'re revealed. Need to Hide again.',
  'Forgetting Stealth check vs PASSIVE Perception — not an active check from enemies.',
  'Hiding in the same spot repeatedly — DM may rule enemies know where you are.',
  'Not clarifying WHERE you\'re hiding to the DM — be specific about your cover.',
  'Using Hide with a loud spell (V component) — verbal components make noise, revealing you.',
];

export function canHide(hasFullCover, isHeavilyObscured, isLightfoot, allySizeCategory) {
  if (hasFullCover || isHeavilyObscured) return { canHide: true, source: 'Cover/obscurement' };
  if (isLightfoot && allySizeCategory >= 2) return { canHide: true, source: 'Naturally Stealthy (behind ally)' };
  return { canHide: false, reason: 'Need cover or heavy obscurement to attempt Hide.' };
}

export function stealthVsPerception(stealthRoll, passivePerception) {
  return {
    hidden: stealthRoll >= passivePerception,
    margin: stealthRoll - passivePerception,
    stealthRoll,
    passivePerception,
  };
}
