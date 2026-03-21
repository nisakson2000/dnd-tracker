/**
 * playerRedemptionPaladinGuide.js
 * Player Mode: Oath of Redemption Paladin — the pacifist protector
 * Pure JS — no React dependencies.
 */

export const REDEMPTION_BASICS = {
  class: 'Paladin (Oath of Redemption)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Pacifist protector. Absorb damage for allies. Redirect attacks to yourself.',
  note: 'The tank Paladin. Rebuke the Violent and Protective Spirit let you absorb incredible damage. Pairs with high AC.',
};

export const REDEMPTION_FEATURES = [
  { feature: 'Emissary of Peace', level: 3, effect: 'Channel Divinity: +5 to Persuasion checks for 10 minutes.', note: '+5 to Persuasion. With proficiency + CHA: massive Persuasion bonus. Talk down enemies.' },
  { feature: 'Rebuke the Violent', level: 3, effect: 'Channel Divinity: when a creature within 30ft deals damage to someone other than you, reaction: attacker takes same damage (radiant, WIS save for half).', note: 'Mirror damage. Enemy hits ally for 20? Attacker takes 20 radiant (or 10 on save). Punish aggression.' },
  { feature: 'Aura of the Guardian', level: 7, effect: 'Reaction: when a creature within 10ft takes damage, you magically take the damage instead (no reduction/resistance applies to the transfer).', note: 'Absorb ally damage. YOU take the hit. Pairs with heavy armor + high HP + Lay on Hands.' },
  { feature: 'Protective Spirit', level: 15, effect: 'At end of each turn, if below half HP, regain 1d6+half Paladin level HP. No action needed.', note: 'Regeneration when below half HP. You\'re absorbing ally damage (Aura of Guardian) and healing each turn.' },
  { feature: 'Emissary of Redemption', level: 20, effect: 'Resistance to all damage from other creatures. When a creature hits you, it takes radiant = half damage dealt.', note: 'Resistance to everything + auto-retribution damage. Attacking you hurts the attacker.' },
];

export const REDEMPTION_SPELLS = {
  oathSpells: [
    { level: 1, spells: 'Sanctuary, Sleep', note: 'Sanctuary on yourself after buffing. Sleep at low levels is incredible.' },
    { level: 2, spells: 'Calm Emotions, Hold Person', note: 'Calm Emotions: end charm/frightened or make hostile creatures indifferent. Great for de-escalation.' },
    { level: 3, spells: 'Counterspell, Hypnotic Pattern', note: 'COUNTERSPELL on a Paladin! Excellent. Hypnotic Pattern is top-tier control.' },
    { level: 4, spells: 'Otiluke\'s Resilient Sphere, Stoneskin', note: 'Resilient Sphere: invulnerable bubble. Protect ally or trap enemy.' },
    { level: 5, spells: 'Hold Monster, Wall of Force', note: 'Wall of Force is one of the best spells in the game. On a Paladin!' },
  ],
};

export const REDEMPTION_TACTICS = [
  { tactic: 'Damage sponge', detail: 'Aura of Guardian: absorb damage for squishy allies. You have heavy armor, shield, d10 hit die. They don\'t.', rating: 'S', note: 'You WANT to take damage. High AC means less damage taken. Lay on Hands to recover.' },
  { tactic: 'Rebuke the Violent revenge', detail: 'Enemy crits your Wizard for 40 damage? Rebuke: attacker takes 40 radiant (or 20 on save). Punish big hits.', rating: 'S' },
  { tactic: 'Protective Spirit sustain', detail: 'L15: below half HP → heal 1d6+7 (at L15) per turn. Combined with Aura of Guardian, you tank and self-heal.', rating: 'A' },
  { tactic: 'Counterspell surprise', detail: 'No one expects Counterspell from a Paladin. Shut down enemy casters. Paladin CHA for the check.', rating: 'S' },
  { tactic: 'Wall of Force Paladin', detail: 'Wall of Force on a Paladin. Split the battlefield. Protect the party. No save. No HP. Just force wall.', rating: 'S' },
];

export const REDEMPTION_VS_CROWN = {
  redemption: { pros: ['Rebuke the Violent (mirror damage)', 'Aura of Guardian (absorb damage)', 'Counterspell + Wall of Force', 'Regeneration at L15'], cons: ['Pacifist theme limits aggression', 'Absorbing damage is risky', 'Emissary of Peace is niche'] },
  crown: { pros: ['Champion Challenge (taunt)', 'Spirit Guardians oath spell', 'Turn the Tide (mass heal)'], cons: ['Weaker spell list', 'No Counterspell', 'Less tanky'] },
  verdict: 'Redemption is the better protector Paladin. Crown is more aggressive.',
};

export function rebukeTheViolentDamage(damageDealt, targetSaves) {
  return targetSaves ? Math.floor(damageDealt / 2) : damageDealt;
}

export function protectiveSpiritHealing(paladinLevel) {
  return 3.5 + Math.floor(paladinLevel / 2); // 1d6 + half paladin level
}

export function auraOfGuardianDamageAbsorbed(damageToAlly) {
  return damageToAlly; // You take the full damage instead
}
