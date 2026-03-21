/**
 * playerAarakocraRaceGuide.js
 * Player Mode: Aarakocra — the flying race
 * Pure JS — no React dependencies.
 */

export const AARAKOCRA_BASICS = {
  race: 'Aarakocra',
  source: 'Elemental Evil Player\'s Companion / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 DEX, +1 WIS (legacy) or +2/+1 any (MotM)',
  speed: '25ft walking, 50ft flying',
  size: 'Medium',
  languages: 'Common, Aarakocra, Auran',
  note: 'THE flying race. 50ft fly speed from L1. Banned at many tables because flight trivializes early encounters. If allowed: incredibly powerful for ranged builds.',
};

export const AARAKOCRA_TRAITS = [
  { trait: 'Flight', effect: '50ft fly speed. Cannot fly while wearing medium or heavy armor.', note: 'THE reason to play Aarakocra. Fly out of melee reach, rain down attacks. Light armor only.' },
  { trait: 'Talons', effect: '1d6 slashing unarmed strike.', note: 'Better than normal unarmed. Works with Monk. Flavor: eagle talons.' },
  { trait: 'Wind Caller (MotM)', effect: 'Cast Gust of Wind once per long rest (no spell slot). At L3: spell uses any stat.', note: 'Free Gust of Wind. Situational but can push enemies off cliffs or clear gas.' },
];

export const AARAKOCRA_CLASS_SYNERGY = [
  { class: 'Ranger (Archer)', priority: 'S', reason: 'Fly + longbow from 600ft. Enemies can\'t reach you. DEX + WIS bonuses are perfect. Best Aarakocra class.' },
  { class: 'Monk', priority: 'S', reason: 'Unarmored (no armor restriction). Fly in, Stunning Strike, fly away. Talons = monk weapon. Incredible mobility.' },
  { class: 'Druid', priority: 'A', reason: 'WIS bonus. Fly until Wild Shape. Then Wild Shape for ground combat. Utility flight.' },
  { class: 'Warlock (EB)', priority: 'A', reason: 'Fly 50ft up. Eldritch Blast from 120ft. Repelling Blast pushes grounded enemies. Untouchable.' },
  { class: 'Rogue', priority: 'A', reason: 'DEX bonus. Fly for positioning. Always get Sneak Attack (ranged, no cover issues). Cunning Action: Dash = 100ft fly.' },
  { class: 'Fighter/Paladin', priority: 'C', reason: 'Flight requires light armor only. Fighters/Paladins want heavy armor. Conflict.' },
];

export const AARAKOCRA_TACTICS = [
  { tactic: 'Aerial kiting', detail: 'Fly 50ft up. Attack with ranged weapons/spells. Melee enemies can\'t reach you. Win.', rating: 'S' },
  { tactic: 'Monk dive-bomb', detail: 'Fly in → Stunning Strike → fly away (no OA if Mobile or Stunning hit). Hit-and-run perfection.', rating: 'S' },
  { tactic: 'Grapple and drop', detail: 'Fly up while grappling enemy. Drop them. 1d6 per 10ft fallen. STR Aarakocra build.', rating: 'A' },
  { tactic: 'Scout from above', detail: '50ft fly speed = cover huge distances. Scout ahead safely. Perception from above.', rating: 'A' },
];

export const AARAKOCRA_WEAKNESSES = [
  { weakness: 'Indoor/underground', note: 'Low ceilings = can\'t fly. Dungeons limit your best feature. Still fine on foot.' },
  { weakness: 'Ranged enemies', note: 'Archers and spellcasters can still target you. You\'re not immune, just out of melee range.' },
  { weakness: 'Falling = death', note: 'If knocked unconscious while flying, you fall. Fall damage on top of whatever hit you.' },
  { weakness: 'Light armor only', note: 'Can\'t fly in medium/heavy armor. Lower AC than armored characters.' },
  { weakness: 'Table bans', note: 'Many DMs ban Aarakocra at L1. Ask before building around flight.' },
];

export function fallingDamage(heightFeet) {
  const d6s = Math.min(Math.floor(heightFeet / 10), 20);
  return { dice: `${d6s}d6`, avg: d6s * 3.5, max: d6s * 6, note: 'Max 20d6 (200ft).' };
}

export function flyingSpeed(baseSpeed, hasDash = false) {
  return hasDash ? baseSpeed * 2 : baseSpeed;
}
