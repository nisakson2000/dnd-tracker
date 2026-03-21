/**
 * playerConcentrationSpellRankingGuide.js
 * Player Mode: Best concentration spells ranked — what to protect and when to swap
 * Pure JS — no React dependencies.
 */

export const CONCENTRATION_RULES = {
  limit: 'Only ONE concentration spell at a time. New concentration spell ends the old one.',
  save: 'CON save when taking damage. DC = 10 or half damage (whichever is higher).',
  ends: 'Concentration ends when: you cast another concentration spell, you\'re incapacitated, you fail a CON save, or you choose to end it.',
  note: 'Concentration is the most important mechanic for casters. Protecting it defines your effectiveness.',
};

export const BEST_CONCENTRATION_SPELLS = [
  { spell: 'Spirit Guardians', level: 3, class: 'Cleric', rating: 'S+', note: '3d8 per enemy per round in 15ft. Best sustained damage. Protect at all costs.' },
  { spell: 'Hypnotic Pattern', level: 3, class: 'Multiple', rating: 'S+', note: 'Incapacitate everything in 30ft cube. Fight-ending if enough fail.' },
  { spell: 'Bless', level: 1, class: 'Cleric/Paladin', rating: 'S+', note: '+1d4 to attacks AND saves for 3 allies. Always worth concentrating on.' },
  { spell: 'Haste', level: 3, class: 'Multiple', rating: 'S+', note: 'Massive buff to one ally. Losing concentration = ally loses a turn. Dangerous.' },
  { spell: 'Web', level: 2, class: 'Multiple', rating: 'S', note: 'Restrained + difficult terrain. Best L2 control. Cheap and devastating.' },
  { spell: 'Wall of Force', level: 5, class: 'Wizard', rating: 'S+', note: 'Split encounters. Nothing passes through. Worth every ounce of concentration.' },
  { spell: 'Polymorph', level: 4, class: 'Multiple', rating: 'S+', note: 'Turn ally into T-Rex (136 HP) or enemy into snail. Versatile.' },
  { spell: 'Banishment', level: 4, class: 'Multiple', rating: 'S', note: 'Remove creature from fight. Permanent if not native to plane. CHA save.' },
  { spell: 'Hold Person/Monster', level: '2/5', class: 'Multiple', rating: 'S', note: 'Paralyzed = auto-crits + no actions. WIS save each turn.' },
  { spell: 'Hex', level: 1, class: 'Warlock', rating: 'A+', note: '+1d6 per hit for 1 hour (8 hours at L3). Moves to new target on kill.' },
  { spell: 'Hunter\'s Mark', level: 1, class: 'Ranger', rating: 'A', note: '+1d6 per hit. Moves on kill. Standard Ranger concentration.' },
  { spell: 'Spike Growth', level: 2, class: 'Druid/Ranger', rating: 'S', note: '2d4 per 5ft moved through. Combine with forced movement. 10 min.' },
  { spell: 'Fly', level: 3, class: 'Multiple', rating: 'S', note: '60ft fly. Losing concentration = falling. Cast on martial allies.' },
  { spell: 'Greater Invisibility', level: 4, class: 'Multiple', rating: 'S', note: 'Invisible while acting. Advantage on all attacks.' },
  { spell: 'Conjure Animals', level: 3, class: 'Druid/Ranger', rating: 'S+', note: '8 wolves with Pack Tactics. Losing concentration = all gone.' },
  { spell: 'Animate Objects', level: 5, class: 'Multiple', rating: 'S', note: '10 tiny objects = ~47 DPR. Losing = all inert. Protect fiercely.' },
];

export const CONCENTRATION_PROTECTION = [
  { method: 'War Caster', bonus: 'Advantage on CON saves', rating: 'S', note: 'Advantage at all levels. Better at low levels.' },
  { method: 'Resilient (CON)', bonus: '+PB to CON saves', rating: 'S', note: 'Better at high levels (+6 at L17). Stacks with War Caster.' },
  { method: 'Both (War Caster + Resilient)', bonus: 'Advantage + PB', rating: 'S+', note: 'Nearly impossible to fail DC 10 checks. Even big hits survivable.' },
  { method: 'Aura of Protection (Paladin)', bonus: '+CHA to all saves', rating: 'S+', note: '+5 to CON saves for you and allies. Best concentration protection.' },
  { method: 'Mind Sharpener (Artificer)', bonus: 'Auto-succeed (4/LR)', rating: 'S', note: 'Infusion. Give to the concentrating caster. 4 free passes.' },
  { method: 'Blade Ward + Dodge', bonus: 'Resistance or disadvantage', rating: 'B', note: 'Reduce damage taken = lower DC. Niche but works.' },
  { method: 'Position behind cover/tank', bonus: 'Fewer attacks hit you', rating: 'A+', note: 'Not getting hit = not making saves. Best strategy.' },
];

export const WHEN_TO_SWAP_CONCENTRATION = [
  'When your current spell has served its purpose (Web enemies are all dead).',
  'When a more impactful option becomes available (Bless → Banishment on the boss).',
  'When the situation changes dramatically (Spirit Guardians → Banishment for a planar creature).',
  'NEVER swap from Haste unless the buffed ally is safe. Losing Haste = they lose a turn.',
  'Don\'t swap from Wall of Force unless the split enemies are dead.',
  'Swap from Hex to a control spell when control is needed more than damage.',
];
