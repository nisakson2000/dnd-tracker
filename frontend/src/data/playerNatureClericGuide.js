/**
 * playerNatureClericGuide.js
 * Player Mode: Nature Domain Cleric — the heavy armor druid
 * Pure JS — no React dependencies.
 */

export const NATURE_BASICS = {
  class: 'Cleric (Nature Domain)',
  source: 'Player\'s Handbook',
  theme: 'Nature-themed Cleric with heavy armor and Druid cantrips.',
  note: 'Often overlooked. The real power: Shillelagh + heavy armor + Spirit Guardians. Also Dampen Elements is great.',
};

export const NATURE_FEATURES = [
  { feature: 'Acolyte of Nature', level: 1, effect: 'Learn one Druid cantrip (WIS based). Proficiency in Animal Handling, Nature, or Survival. Heavy armor proficiency.', note: 'Get SHILLELAGH. Now you attack with WIS. Heavy armor + shield + WIS attacks. Single-stat Cleric.' },
  { feature: 'Channel Divinity: Charm Animals and Plants', level: 2, effect: 'Each beast/plant creature within 30ft: WIS save or charmed by you for 1 minute.', note: 'Niche. Only works on beasts and plants. But when it works, it\'s free control.' },
  { feature: 'Dampen Elements', level: 6, effect: 'Reaction: when you or ally within 30ft takes acid/cold/fire/lightning/thunder damage, grant resistance to that damage instance.', note: 'FREE resistance to elemental damage as a reaction. No resource cost. Every time. Dragon breathes fire? Halved.' },
  { feature: 'Divine Strike', level: 8, effect: '+1d8 cold/fire/lightning on weapon hit (choose on hit). 2d8 at L14.', note: 'Choose element per hit. Can match enemy vulnerability. Versatile.' },
  { feature: 'Master of Nature', level: 17, effect: 'Command charmed beasts and plants (from your Channel Divinity) as bonus action.', note: 'Command charmed nature creatures. Very niche capstone.' },
];

export const SHILLELAGH_CLERIC_BUILD = {
  concept: 'WIS is your only needed stat. Shillelagh: melee attack with WIS. Spells: WIS. AC: heavy armor (no DEX needed).',
  statPriority: 'WIS > CON > STR (for heavy armor) > everything else',
  l1Setup: 'Shillelagh + Chain mail + Shield = 18 AC. Attack with WIS.',
  l5Setup: 'Spirit Guardians + Shillelagh. Walk into enemies. Spirit Guardians does 3d8/turn. You attack for d8+WIS.',
  note: 'The real reason to play Nature Cleric. Single-stat Cleric that\'s just as effective as any Cleric.',
  rating: 'A',
};

export const NATURE_TACTICS = [
  { tactic: 'Shillelagh + Spirit Guardians', detail: 'Cast Spirit Guardians. Use Shillelagh (bonus action cantrip) for melee. Walk into enemies: 3d8 per creature per turn + your attacks.', rating: 'S', note: 'Standard Cleric tactic, but Nature does it with WIS for everything. No STR/DEX needed.' },
  { tactic: 'Dampen Elements spam', detail: 'Reaction: grant resistance to elemental damage. Free. Unlimited. Dragon fight? Halve every breath weapon.', rating: 'S', note: 'No resource cost. Use every round. Best sustained defensive feature for any Cleric.' },
  { tactic: 'Thorn Whip pull', detail: 'If you pick Thorn Whip instead of Shillelagh: pull enemies 10ft into Spirit Guardians.', rating: 'A', note: 'Alternative to Shillelagh. Pull enemies into your damage aura.' },
  { tactic: 'Elemental Divine Strike', detail: 'Choose cold/fire/lightning per hit. Hit a troll? Fire. Hit a fire elemental? Cold. Adapt to enemy.', rating: 'A' },
];

export const NATURE_VS_FORGE = {
  nature: { pros: ['Shillelagh (WIS attacks)', 'Dampen Elements (free resistance)', 'Flexible Divine Strike element', 'Druid cantrip'], cons: ['Weak Channel Divinity', 'Weak capstone', 'Less AC than Forge'] },
  forge: { pros: ['Highest AC (Blessing + Soul of Forge)', 'Fire resistance/immunity', '+1 equipment daily'], cons: ['No Dampen Elements', 'No Shillelagh', 'Fire Divine Strike (commonly resisted)'] },
  verdict: 'Nature for Dampen Elements and Shillelagh. Forge for maximum AC and fire tanking.',
};

export function shillelaghDamage(wisMod) {
  return 4.5 + wisMod; // 1d8 + WIS
}

export function dampenElementsReduction(damage) {
  return Math.floor(damage / 2); // Resistance = half damage
}
