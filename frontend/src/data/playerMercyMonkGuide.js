/**
 * playerMercyMonkGuide.js
 * Player Mode: Way of Mercy Monk — the healer-striker monk
 * Pure JS — no React dependencies.
 */

export const MERCY_BASICS = {
  class: 'Monk (Way of Mercy)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Plague doctor monk. Heals allies and poisons enemies with ki-powered touch.',
  note: 'Best monk subclass. Solves monk\'s biggest problem: what to spend ki on besides Stunning Strike.',
};

export const MERCY_FEATURES = [
  { feature: 'Hands of Healing', level: 3, effect: 'When you use Flurry of Blows, replace one attack with healing: 1 Martial Arts die + WIS mod HP. Removes poisoned/diseased/blinded/deafened (1 ki each).', note: 'Free healing built into Flurry. No extra ki cost for the heal itself.' },
  { feature: 'Hands of Harm', level: 3, effect: 'When you hit with unarmed strike (Flurry), spend 1 ki: deal extra necrotic = 1 Martial Arts die + WIS mod. Target must CON save or be poisoned until end of your next turn.', note: 'Extra damage + poisoned condition. Poisoned = disadvantage on attacks and ability checks.' },
  { feature: 'Physician\'s Touch', level: 6, effect: 'Hands of Healing can also end one disease or: blinded, deafened, paralyzed, poisoned, stunned.', note: 'Remove paralyzed and stunned! Better than Lesser Restoration in many cases.' },
  { feature: 'Flurry of Healing and Harm', level: 11, effect: 'Replace EACH Flurry of Blows attack with a heal (no ki) OR add Hands of Harm to each hit (1 ki each).', note: 'Two heals per Flurry (free) or two Hands of Harm (2 ki). Massive flexibility.' },
  { feature: 'Hand of Ultimate Mercy', level: 17, effect: 'Touch a creature that died within 24 hours: spend 5 ki, it returns to life with 4d10+WIS HP. Once per long rest.', note: 'Free Raise Dead equivalent. No material components. Once per day.' },
];

export const MERCY_TACTICS = [
  { tactic: 'Flurry heal combo', detail: 'Action: Attack x2. Bonus: Flurry of Blows, replace one unarmed strike with Hands of Healing. 2 attacks + 1 heal for 1 ki.', rating: 'S', note: 'Damage AND healing in the same turn. No other monk can do this.' },
  { tactic: 'Poison + Stun combo', detail: 'Hands of Harm → target poisoned (disadvantage). Next turn: Stunning Strike (they save with disadvantage because poisoned).', rating: 'S', note: 'Poisoned gives disadvantage on ability checks AND saving throws (CON save for Stun).' },
  { tactic: 'Emergency medic', detail: 'Move to downed ally (Step of the Wind if needed). Flurry: one attack on enemy + one Hands of Healing on ally.', note: 'Revive allies while still fighting.' },
  { tactic: 'Condition cleanse', detail: 'L6: Remove stunned/paralyzed as part of Flurry heal. Better than casting Lesser Restoration.', rating: 'A' },
  { tactic: 'Double harm (L11)', detail: 'Flurry of Blows: both hits + Hands of Harm on each = 2 × (martial arts die + WIS) extra necrotic + 2 poison saves.', rating: 'S' },
];

export const MERCY_VS_OTHER_MONKS = {
  mercy: { pros: ['Built-in healing (free with Flurry)', 'Extra damage (Hands of Harm)', 'Condition removal', 'Poisoned condition synergy with Stun', 'Best ki economy'], cons: ['Still a monk (d8 hit die, low AC vs heavy armor)', 'Hands of Harm costs ki'] },
  openHand: { pros: ['Stronger control (push/prone/no reactions)', 'Wholeness of Body self-heal', 'Quivering Palm'], cons: ['No ally healing', 'Less damage than Mercy'] },
  shadow: { pros: ['Darkness/Silence for free', 'Shadow Step teleport', 'Invisibility in dim light'], cons: ['No healing', 'Darkness-dependent', 'Less direct combat power'] },
  verdict: 'Mercy is the best overall monk. Open Hand for control. Shadow for stealth campaigns.',
};

export function handsOfHealingHP(martialArtsDie, wisMod) {
  const dieAvg = { 4: 2.5, 6: 3.5, 8: 4.5, 10: 5.5 };
  return (dieAvg[martialArtsDie] || 3.5) + wisMod;
}

export function handsOfHarmDamage(martialArtsDie, wisMod) {
  const dieAvg = { 4: 2.5, 6: 3.5, 8: 4.5, 10: 5.5 };
  return (dieAvg[martialArtsDie] || 3.5) + wisMod;
}

export function mercyFlurryDPR(monkLevel, dexMod, wisMod, targetAC, useHarm = true) {
  const martialArts = monkLevel >= 17 ? 10 : monkLevel >= 11 ? 8 : monkLevel >= 5 ? 6 : 4;
  const dieAvg = { 4: 2.5, 6: 3.5, 8: 4.5, 10: 5.5 };
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - (dexMod + Math.min(6, 2 + Math.floor((monkLevel + 3) / 4))))) / 20));
  const attacks = monkLevel >= 5 ? 4 : 3; // 2 Attack + 2 Flurry or 1 Attack + 2 Flurry
  const baseDmg = dieAvg[martialArts] + dexMod;
  const harmDmg = useHarm ? dieAvg[martialArts] + wisMod : 0;
  return attacks * hitChance * baseDmg + (useHarm ? hitChance * harmDmg : 0);
}
