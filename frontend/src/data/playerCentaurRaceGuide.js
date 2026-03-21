/**
 * playerCentaurRaceGuide.js
 * Player Mode: Centaur — the charging mount
 * Pure JS — no React dependencies.
 */

export const CENTAUR_BASICS = {
  race: 'Centaur',
  source: 'Guildmasters\' Guide to Ravnica / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 STR, +1 WIS (legacy) or +2/+1 any (MotM)',
  speed: '40ft',
  size: 'Medium',
  note: '40ft speed (fastest PHB-era race). Fey type (not humanoid). Equine Build lets Small allies ride you. Charge for bonus action attack. Built for speed and mounted combat.',
};

export const CENTAUR_TRAITS = [
  { trait: 'Fey', effect: 'Creature type is Fey, not Humanoid.', note: 'Immune to Hold Person, Charm Person, Dominate Person. Same as Satyr. Huge defensive advantage.' },
  { trait: 'Charge', effect: 'Move 30ft+ straight toward target → bonus action hooves attack (1d6+STR bludgeoning).', note: 'Free BA attack after charging. Turn 1: charge in + attack + BA hooves. Great opener.' },
  { trait: 'Equine Build', effect: 'Count as one size larger for carrying. Climbing costs 4× movement. Small/Medium creatures can ride you (you\'re a mount).', note: 'Allies can ride you. Halfling on a Centaur = mounted combat without a horse. 4× climbing is harsh.' },
  { trait: 'Hooves', effect: '1d6+STR bludgeoning unarmed strike.', note: 'Natural weapon. Works with Charge BA attack.' },
];

export const CENTAUR_CLASS_SYNERGY = [
  { class: 'Fighter', priority: 'S', reason: 'STR. 40ft speed for positioning. Charge BA attack. Fey type protection. Excellent martial.' },
  { class: 'Paladin', priority: 'A', reason: 'STR. 40ft speed to close distance. Charge + Smite. Fey type blocks Hold Person (Paladin\'s worst nightmare).' },
  { class: 'Barbarian', priority: 'A', reason: 'STR. 40ft speed + Fast Movement (50ft). Charge while raging. Fey type.' },
  { class: 'Druid', priority: 'B', reason: 'WIS. 40ft speed. Fey type. But climbing costs are painful for exploration.' },
  { class: 'Ranger', priority: 'B', reason: 'STR+WIS. Speed. But Centaurs can\'t climb well. Indoor/dungeon campaigns suffer.' },
];

export const CENTAUR_TACTICS = [
  { tactic: 'Charge + attack combo', detail: 'Move 30ft+ → attack action → BA hooves attack. Three attacks at L5 (Extra Attack + BA hooves). Great opener.', rating: 'A' },
  { tactic: 'Halfling rider', detail: 'Small ally rides you. They benefit from your 40ft speed. Mounted Combatant feat on them for extra defense.', rating: 'A' },
  { tactic: 'Fey type protection', detail: 'Immune to Hold Person, Charm Person, Dominate Person. Same as Satyr. Blocks common save-or-suck.', rating: 'S' },
  { tactic: 'Speed advantage', detail: '40ft base. Barbarian Fast Movement: 50ft. Mobile feat: 50ft. Fastest non-flying character.', rating: 'A' },
];

export const CENTAUR_WEAKNESSES = [
  { weakness: 'Climbing', note: '4× movement cost. 40ft speed → 10ft climbing per turn. Ladders, walls, mountains are brutal.' },
  { weakness: 'Indoor environments', note: 'Horse-sized in narrow corridors. Squeeze through tight spaces. DM may impose restrictions.' },
  { weakness: 'Stairs/ladders', note: 'Horse body + stairs = DM discretion. Many rule difficulty or inability.' },
];

export function chargeExtraDamage(strMod) {
  return { hoovesDamage: `1d6+${strMod}`, avg: 3.5 + strMod, requirement: '30ft+ straight line movement' };
}
