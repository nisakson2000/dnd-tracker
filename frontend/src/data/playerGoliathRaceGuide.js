/**
 * playerGoliathRaceGuide.js
 * Player Mode: Goliath — the mountain warrior
 * Pure JS — no React dependencies.
 */

export const GOLIATH_BASICS = {
  race: 'Goliath',
  source: 'Volo\'s Guide to Monsters / Elemental Evil / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 STR, +1 CON (legacy) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Medium',
  note: 'Stone\'s Endurance reduces damage by 1d12+CON. Powerful Build for carrying. Natural Athlete for Athletics. Perfect Barbarian/Fighter race.',
};

export const GOLIATH_TRAITS = [
  { trait: 'Stone\'s Endurance', effect: 'Reaction: reduce damage by 1d12+CON mod. Once per short rest (legacy) or PB uses/LR (MotM).', note: 'At CON +3: reduce by 4-15 damage (avg 9.5). PB uses in MotM = 2-6 per LR. Incredible survivability.' },
  { trait: 'Powerful Build', effect: 'Count as one size larger for carrying, push, drag, lift.', note: 'Carry/grapple like a Large creature. Carry heavy gear. Grapple more effectively.' },
  { trait: 'Mountain Born', effect: 'Cold resistance. Acclimated to high altitude (no altitude sickness).', note: 'Cold resistance is decent. Altitude is niche but thematic.' },
  { trait: 'Natural Athlete', effect: 'Proficiency in Athletics.', note: 'Free Athletics. Perfect for grapple/shove builds.' },
];

export const GOLIATH_CLASS_SYNERGY = [
  { class: 'Barbarian', priority: 'S', reason: 'STR+CON. Stone\'s Endurance + Rage resistance = incredibly tanky. Athletics for grappling. Thematic perfection.' },
  { class: 'Fighter', priority: 'S', reason: 'STR+CON. Stone\'s Endurance reduces damage without spell slots. Athletics for battlefield control.' },
  { class: 'Paladin', priority: 'A', reason: 'STR. Stone\'s Endurance protects concentration. Lay on Hands + Stone\'s Endurance = never drop.' },
  { class: 'Cleric (melee)', priority: 'A', reason: 'Frontline Cleric. Stone\'s Endurance protects Spirit Guardians concentration. CON bonus helps.' },
  { class: 'Ranger (STR)', priority: 'B', reason: 'STR Ranger with Athletics. Stone\'s Endurance for survival. Niche but functional.' },
];

export const GOLIATH_TACTICS = [
  { tactic: 'Stone\'s Endurance on big hits', detail: 'Save for crits or high-damage attacks. Reduce a 20-damage hit by avg 9.5. Big value on big hits.', rating: 'S' },
  { tactic: 'Grapple build', detail: 'Athletics proficiency + Powerful Build (Large for grappling). Grapple + shove prone. Pin enemies.', rating: 'A' },
  { tactic: 'Barbarian stacking', detail: 'Rage halves damage → Stone\'s Endurance reduces further. A 30-damage hit becomes: 15 (Rage) - 9.5 (Stone) = 5.5 effective.', rating: 'S' },
  { tactic: 'Concentration protection', detail: 'Stone\'s Endurance reduces damage = lower concentration DC. Keep Spirit Guardians/Haste running.', rating: 'A' },
];

export function stonesEnduranceReduction(conMod) {
  return { dice: '1d12', bonus: conMod, avg: 6.5 + conMod, min: 1 + conMod, max: 12 + conMod };
}

export function effectiveDamageAfterRageAndStone(incomingDamage, conMod) {
  const afterRage = Math.floor(incomingDamage / 2);
  const stoneReduction = 6.5 + conMod;
  return Math.max(0, Math.round(afterRage - stoneReduction));
}
