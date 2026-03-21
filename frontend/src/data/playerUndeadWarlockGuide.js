/**
 * playerUndeadWarlockGuide.js
 * Player Mode: Undead Warlock — the dread form warlock
 * Pure JS — no React dependencies.
 */

export const UNDEAD_BASICS = {
  class: 'Warlock (The Undead)',
  source: 'Van Richten\'s Guide to Ravenloft',
  theme: 'Death-touched warlock. Transform into a dread form. Fear, necrotic damage, and projection.',
  note: 'One of the strongest Warlock patrons. Form of Dread is excellent. Grave Touched turns any damage to necrotic + extra die.',
};

export const UNDEAD_FEATURES = [
  { feature: 'Form of Dread', level: 1, effect: 'Bonus action for 1 minute (PB/LR): gain temp HP = 1d10+Warlock level. When you hit: target must WIS save or frightened until end of your next turn. Immune to frightened while in form.', note: 'Temp HP + fear on every hit + fear immunity. Bonus action. PB uses per day. Incredible at L1.' },
  { feature: 'Grave Touched', level: 6, effect: 'In Form of Dread: can change damage type of attacks to necrotic. Once per turn, extra damage die on one necrotic attack. Don\'t need to eat/drink/breathe.', note: 'EB becomes necrotic + extra die. At L5: 2 beams, one deals 2d10+CHA necrotic. Significant DPR boost.' },
  { feature: 'Necrotic Husk', level: 10, effect: 'Resistance to necrotic. When reduced to 0 HP: explode (each creature within 10ft: 2d10+Warlock level necrotic, CON save half). Revive with 1 HP. Once/LR.', note: 'Auto-revive + AoE explosion. Die → explode → come back at 1 HP. Powerful survival.' },
  { feature: 'Spirit Projection', level: 14, effect: 'Action (1 hour, concentration): project astral body. Fly speed. Resistance to physical damage. Heal when dealing necrotic. Can be conjured/dismissed freely.', note: 'Astral form: fly, resist physical damage, life steal on necrotic hits. Body is safe elsewhere.' },
];

export const UNDEAD_TACTICS = [
  { tactic: 'Form of Dread + EB', detail: 'Bonus action Form of Dread. EB: each hit forces WIS save or frightened. Multiple beams = multiple fear checks.', rating: 'S', note: 'At L5: 2 EB beams. Each can frighten. Hard for enemies to save against both.' },
  { tactic: 'Grave Touched necrotic EB', detail: 'L6: EB becomes necrotic. One beam per turn deals an extra die (2d10+CHA instead of 1d10+CHA).', rating: 'S', note: 'Extra d10 per turn for free in Form of Dread. Stacks with Agonizing Blast.' },
  { tactic: 'Necrotic Husk bomb', detail: 'L10: die → explode for 2d10+10 necrotic in 10ft → revive at 1 HP. Then Healing Light or ally heals you.', rating: 'A', note: 'Plan your "death." Run into a group of enemies, let them kill you, explode, come back.' },
  { tactic: 'Spirit Projection life steal', detail: 'L14: astral form. Fly. Resist physical damage. Every necrotic hit heals you. Nearly unkillable astral combatant.', rating: 'S' },
  { tactic: 'Fear + repelling combo', detail: 'Form of Dread fear + Repelling Blast. Frighten → they can\'t approach (frightened can\'t willingly move closer). Push them away. They\'re stuck.', rating: 'S' },
];

export function formOfDreadTempHP(warlockLevel) {
  return 5.5 + warlockLevel; // 1d10 avg + level
}

export function formOfDreadUses(proficiencyBonus) {
  return proficiencyBonus;
}

export function graveTouchedExtraDamage(warlockLevel) {
  // Extra die matches EB damage die
  return 5.5; // 1d10 necrotic avg
}

export function necroticHuskExplosion(warlockLevel) {
  return 11 + warlockLevel; // 2d10 avg + warlock level
}
