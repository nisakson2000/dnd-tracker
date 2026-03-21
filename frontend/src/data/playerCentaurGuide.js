/**
 * playerCentaurGuide.js
 * Player Mode: Centaur race guide — the horse person
 * Pure JS — no React dependencies.
 */

export const CENTAUR_BASICS = {
  race: 'Centaur',
  source: 'Guildmaster\'s Guide to Ravnica / MotM',
  size: 'Medium',
  speed: '40ft',
  asi: '+2 STR, +1 WIS (original) or flexible (MotM)',
  theme: 'Horse-bodied humanoid. Fast, strong, and can carry allies.',
  note: '40ft speed is excellent. Equine Build lets allies ride you. Charge for bonus action attack. Great martial race.',
};

export const CENTAUR_TRAITS = [
  { trait: 'Equine Build', effect: 'You count as one size larger for carry capacity. Climbing costs extra movement (4ft per 1ft). Medium creatures can ride you (if you allow it).', note: 'ALLIES CAN RIDE YOU. Small or Medium creatures. They move with you on your 40ft speed. Climbing is hard though.' },
  { trait: 'Charge', effect: 'If you move 30ft+ in a straight line and hit with a melee attack, deal extra 1d6 damage. After the hit, bonus action: shove prone (STR save vs 8+prof+STR).', note: 'Charge → extra 1d6 + bonus action prone. Prone = advantage for melee allies. Good opening.' },
  { trait: 'Hooves', effect: 'Unarmed strike: 1d6+STR bludgeoning.', note: '1d6 hooves. Natural weapon. Decent backup.' },
  { trait: 'Speed', effect: '40ft walking speed.', note: '10ft faster than most races. Closes gaps faster.' },
];

export const CENTAUR_BUILDS = [
  { build: 'Centaur Fighter', detail: '+2 STR. 40ft speed. Charge for extra d6 + prone. GWM + prone target = advantage + big damage.', rating: 'S' },
  { build: 'Centaur Paladin', detail: '+2 STR. 40ft speed for charge-Smite. Carry the Halfling Rogue into battle.', rating: 'A' },
  { build: 'Centaur Barbarian', detail: '+2 STR. Charge while raging. 40ft fast rage. Carry the Gnome Wizard to safety.', rating: 'A' },
  { build: 'Centaur Ranger', detail: '+2 STR +1 WIS. 40ft speed for scouting. Carry allies through wilderness.', rating: 'B' },
  { build: 'Centaur + Small rider duo', detail: 'Halfling/Gnome ally rides you. They attack on your turn using their actions. You both benefit from positioning.', rating: 'A', note: 'The mounted combat rules apply. Rider uses your speed. Very fun duo.' },
];

export const CENTAUR_TACTICS = [
  { tactic: 'Charge + GWM', detail: 'Move 30ft+ straight → hit → extra 1d6 → bonus action prone → next attack (Extra Attack) with advantage + GWM.', rating: 'S' },
  { tactic: 'Ally taxi', detail: 'Small/Medium ally rides you. Your 40ft speed moves them. They keep their full action. Carry the caster into position.', rating: 'A' },
  { tactic: 'Hooves + grapple', detail: 'Grapple with hands → hooves kick (1d6+STR) as unarmed strike. Grapple-and-kick combo.', rating: 'B' },
  { tactic: '40ft chase/escape', detail: '40ft base speed. Dash = 80ft. Few creatures outrun you. Chase down fleeing enemies or escape easily.', rating: 'A' },
];

export function chargeExtraDamage() {
  return 3.5; // 1d6 average
}

export function chargeProneSuccess(strMod, profBonus, targetSTR) {
  const dc = 8 + profBonus + strMod;
  const targetMod = targetSTR; // target's STR save
  return Math.min(0.95, Math.max(0.05, (21 - (dc - targetMod)) / 20));
}

export function centaurCarryCapacity(strScore) {
  return strScore * 15 * 2; // ×2 for Equine Build (one size larger)
}
