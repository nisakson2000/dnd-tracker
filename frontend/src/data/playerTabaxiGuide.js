/**
 * playerTabaxiGuide.js
 * Player Mode: Tabaxi race guide — the cat person
 * Pure JS — no React dependencies.
 */

export const TABAXI_BASICS = {
  race: 'Tabaxi',
  source: 'Volo\'s Guide to Monsters / MotM',
  size: 'Medium',
  speed: '30ft (with Feline Agility: 60ft)',
  asi: '+2 DEX, +1 CHA (Volo\'s) or flexible (MotM)',
  theme: 'Curious cat-folk. Lightning speed, climbing, stealth.',
  note: 'Best speed race. Feline Agility doubles speed for a turn. Great for Rogues, Monks, Rangers.',
};

export const TABAXI_TRAITS = [
  { trait: 'Feline Agility', effect: 'When you move on your turn, double your speed until end of turn. Can\'t use again until you spend a turn not moving (move 0ft).', note: 'Double speed. Dash = quadruple speed. With 30ft base: 120ft in one turn. Reset by standing still.' },
  { trait: 'Cat\'s Claws', effect: 'Climbing speed = walking speed. Unarmed strikes deal 1d6+STR slashing.', note: 'Free climb speed. 1d6 unarmed is nice but rarely used over weapons.' },
  { trait: 'Cat\'s Talent', effect: 'Proficiency in Perception and Stealth.', note: 'Two of the best skills for free. Perception is the most-used skill.' },
  { trait: 'Darkvision', effect: '60ft darkvision.', note: 'Standard darkvision. Always useful.' },
];

export const TABAXI_SPEED_MATH = {
  base: { speed: 30, felineAgility: 60, dash: 120, note: 'Base Tabaxi' },
  monk: { speed: 40, felineAgility: 80, dash: 160, note: 'With Monk Unarmored Movement (+10 at L2)' },
  monkL10: { speed: 50, felineAgility: 100, dash: 200, note: 'Monk L10 (+20)' },
  haste: { speed: 60, felineAgility: 120, dash: 240, note: 'With Haste (double base speed)' },
  boots: { speed: 40, felineAgility: 80, dash: 160, note: 'Boots of Speed (+10ft)' },
  maximum: { speed: 'Varies', detail: 'Tabaxi Monk 18/Rogue 2: 30 base + 30 unarmored + Feline Agility (double) = 120. Dash (action) = 240. Cunning Action Dash = 360. Haste Dash = 480. With Boots of Speed: insane.', note: 'Theoretically 1000+ ft in one turn with enough stacking.' },
};

export const TABAXI_BUILDS = [
  { build: 'Tabaxi Rogue', detail: '+2 DEX. Free Stealth/Perception. Feline Agility + Cunning Action Dash = 120ft movement.', rating: 'S', note: 'Hit and run. Dash in, Sneak Attack, dash out. Nobody catches you.' },
  { build: 'Tabaxi Monk', detail: '+2 DEX. Unarmored Movement + Feline Agility. Cat\'s Claws stack with martial arts (use whichever is higher).', rating: 'S' },
  { build: 'Tabaxi Ranger', detail: '+2 DEX. Perception/Stealth proficiency. Climb speed for scouting. Fast pursuit.', rating: 'A' },
  { build: 'Tabaxi Bard', detail: '+2 DEX +1 CHA. Free skills. Feline Agility for positioning. College of Swords or Whispers.', rating: 'A' },
  { build: 'Tabaxi Swashbuckler', detail: 'Perfect combo. Fancy Footwork + Feline Agility. Attack → free disengage (Fancy Footwork) → sprint 60ft away.', rating: 'S' },
];

export function felineAgilitySpeed(baseSpeed) {
  return baseSpeed * 2;
}

export function maxMoveInTurn(baseSpeed, hasDash, hasBonusDash, hasHaste, hasFelineAgility) {
  let speed = baseSpeed;
  if (hasFelineAgility) speed *= 2;
  let totalMove = speed;
  if (hasDash) totalMove += speed;
  if (hasBonusDash) totalMove += speed;
  if (hasHaste) totalMove += speed; // Haste action dash
  return totalMove;
}
