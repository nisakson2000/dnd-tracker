/**
 * playerAncestralGuardianBarbarianGuide.js
 * Player Mode: Ancestral Guardian Barbarian — the spirit protector
 * Pure JS — no React dependencies.
 */

export const ANCESTRAL_GUARDIAN_BASICS = {
  class: 'Barbarian (Path of the Ancestral Guardian)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Best tank Barbarian. Force disadvantage on enemy attacks vs allies. Spirit Shield reduces ally damage.',
  note: 'Ancestral Protectors debuffs the first creature you hit each turn: disadvantage on attacks vs anyone but you, and allies have resistance to its damage. Incredibly powerful tanking with no resource cost.',
};

export const ANCESTRAL_GUARDIAN_FEATURES = [
  { feature: 'Ancestral Protectors', level: 3, effect: 'While raging, first creature you hit each turn is haunted. Until your next turn: disadvantage on attacks vs anyone but you. If it hits someone else: target has resistance to damage.', note: 'No save. No resource cost. Just hit something = it can barely hurt your allies. Incredible.' },
  { feature: 'Spirit Shield', level: 6, effect: 'Reaction while raging: reduce damage to ally within 30ft by 2d6 (3d6 at L10, 4d6 at L14).', note: 'Stack with Ancestral Protectors. Enemy attacks ally with disadvantage, resistance, AND you reduce damage by 2d6+.' },
  { feature: 'Consult the Spirits', level: 10, effect: 'Cast Augury or Clairvoyance as ritual. Short rest recharge.', note: 'Minor utility. Augury is useful for decision-making. Clairvoyance for scouting.' },
  { feature: 'Vengeful Ancestors', level: 14, effect: 'When you use Spirit Shield, the attacker takes the same amount of force damage.', note: 'Spirit Shield now deals force damage back. 4d6 reduction + 4d6 force retaliation. Punishing.' },
];

export const ANCESTRAL_GUARDIAN_TACTICS = [
  { tactic: 'Hit and protect', detail: 'Reckless Attack the biggest threat → they have disadvantage vs allies AND allies resist their damage. You WANT them to attack you instead.', rating: 'S' },
  { tactic: 'Reckless bait', detail: 'Use Reckless Attack to give enemies advantage vs you. They attack you (good — you have Rage resistance) instead of your squishy allies.', rating: 'S' },
  { tactic: 'Spirit Shield stacking', detail: 'L6+: enemy attacks ally → disadvantage + resistance + 2d6 reduction. Triple layer of protection.', rating: 'S' },
  { tactic: 'Vengeful Ancestors retaliation', detail: 'L14: Spirit Shield reduces 4d6 AND deals 4d6 force to attacker. Enemy loses damage and takes damage.', rating: 'S' },
  { tactic: 'Reach weapon strategy', detail: 'Use a glaive/halberd (PAM). Hit enemies from 10ft → they\'re haunted. If they come to you, great. If they go elsewhere, they\'re debuffed.', rating: 'A' },
];

export const ANCESTRAL_VS_TOTEM = {
  ancestral: { tankFor: 'Party protection', mechanic: 'Debuff enemies, reduce ally damage', weakness: 'Less personal survivability than Bear Totem' },
  totemBear: { tankFor: 'Personal survivability', mechanic: 'Resist all damage except psychic', weakness: 'No party protection — enemies can ignore you' },
  verdict: 'Ancestral Guardian is the better TANK (forces enemies to target you). Bear Totem is the better SPONGE (absorbs more personal damage). Ancestral protects the party; Bear protects itself.',
};

export function spiritShieldReduction(barbarianLevel) {
  if (barbarianLevel < 6) return { dice: 0, avg: 0 };
  const dice = barbarianLevel >= 14 ? 4 : barbarianLevel >= 10 ? 3 : 2;
  return { dice, reduction: `${dice}d6`, avg: dice * 3.5, retaliation: barbarianLevel >= 14 ? `${dice}d6 force` : 'none' };
}
