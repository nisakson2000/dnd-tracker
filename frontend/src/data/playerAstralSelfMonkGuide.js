/**
 * playerAstralSelfMonkGuide.js
 * Player Mode: Way of the Astral Self Monk — the astral arms fighter
 * Pure JS — no React dependencies.
 */

export const ASTRAL_SELF_BASICS = {
  class: 'Monk (Way of the Astral Self)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Manifest astral arms, visage, and body. WIS-based attacks instead of DEX.',
  note: 'Interesting concept. WIS for attacks is unique. But ki-hungry and overall weaker than Mercy or Kensei.',
};

export const ASTRAL_SELF_FEATURES = [
  { feature: 'Arms of the Astral Self', level: 3, effect: 'Bonus action, 1 ki: summon spectral arms for 10 minutes. Reach 10ft. Use WIS for attack/damage. 1d8 + WIS force damage. Can use DEX or WIS for Athletics/Acrobatics.', note: 'WIS-based attacks at 10ft reach. Force damage. You can dump DEX if you want (but AC suffers).' },
  { feature: 'Visage of the Astral Self', level: 6, effect: 'When you summon Arms, spend 1 additional ki: gain advantages. See in darkness 120ft, advantage on Insight/Intimidation, amplified voice 600ft.', note: '2 ki total for Arms + Visage. Darkvision, social advantages. Decent utility.' },
  { feature: 'Body of the Astral Self', level: 11, effect: 'When you have Arms and Visage, spend 1 additional ki: reaction to deflect energy damage (1d10+WIS reduction). Extra 1d10 force on arms attacks.', note: '3 ki total for full form. Extra d10 damage + energy deflection. Ki expensive.' },
  { feature: 'Awakened Astral Self', level: 17, effect: 'Summon Arms, Visage, and Body at once for 5 ki. Extra attack on Arms attacks (3 unarmed strikes as bonus action). +2 AC.', note: '5 ki for full form. 3 bonus action strikes + regular attacks. +2 AC. L17 capstone.' },
];

export const ASTRAL_SELF_TACTICS = [
  { tactic: 'WIS-based attacks', detail: 'Arms use WIS for attacks. Max WIS first. AC = 10+DEX+WIS. Attacks = WIS. Saves = WIS. Single-stat dependency.', rating: 'A', note: 'You still need some DEX for AC. But WIS is your primary stat for everything.' },
  { tactic: '10ft reach unarmed', detail: 'Astral Arms have 10ft reach. Stunning Strike at 10ft range. Hit-and-run without being adjacent.', rating: 'A' },
  { tactic: 'Force damage attacks', detail: 'Astral Arms deal force damage. Almost nothing resists force. Better than bludgeoning martial arts.', rating: 'A' },
  { tactic: 'Full form nova', detail: 'L17: 5 ki → 2 regular attacks + 3 bonus action strikes. 5 attacks per turn, all WIS-based, force damage.', rating: 'A' },
];

export const ASTRAL_SELF_VS_MERCY = {
  astralSelf: { pros: ['WIS-based attacks', '10ft reach', 'Force damage', 'Darkvision/social bonuses'], cons: ['Ki-hungry (1-5 ki per activation)', 'No healing', 'Requires setup turn', 'Weaker overall'] },
  mercy: { pros: ['Free healing (built into Flurry)', 'Extra necrotic damage', 'Condition removal', 'Better ki economy'], cons: ['No reach', 'Normal damage types', 'No WIS-based attacks'] },
  verdict: 'Mercy is stronger. Astral Self is more unique/flavorful.',
};

export function astralArmsAttackDamage(wisMod) {
  return 4.5 + wisMod; // 1d8 + WIS, force damage
}

export function astralSelfKiCost(armsOnly, visage, body) {
  let cost = 1; // Arms
  if (visage) cost += 1;
  if (body) cost += 1;
  return cost;
}

export function awakenedAstralSelfAttacks() {
  return 5; // 2 regular + 3 bonus action at L17
}
