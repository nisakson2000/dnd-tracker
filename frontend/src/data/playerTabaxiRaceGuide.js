/**
 * playerTabaxiRaceGuide.js
 * Player Mode: Tabaxi — the feline speedster
 * Pure JS — no React dependencies.
 */

export const TABAXI_BASICS = {
  race: 'Tabaxi',
  source: 'Volo\'s Guide to Monsters / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 DEX, +1 CHA (legacy) or +2/+1 any (MotM)',
  speed: '30ft, 20ft climb',
  size: 'Medium',
  darkvision: '60ft',
  note: 'Feline Agility doubles speed for one turn (refreshes when stationary). Cat\'s Claws for climbing + unarmed. Stealth/Perception proficiency. Best burst movement race.',
};

export const TABAXI_TRAITS = [
  { trait: 'Feline Agility', effect: 'When you move on your turn, double your speed until end of turn. Can\'t use again until you spend a turn not moving.', note: 'THE feature. 30ft speed → 60ft. With Dash: 120ft in one turn. With Monk: 160ft+. Recharges by standing still 1 turn.' },
  { trait: 'Cat\'s Claws', effect: '20ft climbing speed. 1d6+STR slashing unarmed strike.', note: 'Free climbing without Athletics checks. Better unarmed damage.' },
  { trait: 'Cat\'s Talent', effect: 'Proficiency in Perception and Stealth.', note: 'Two of the best skills in the game. Free. Incredible value.' },
];

export const TABAXI_SPEED_EXAMPLES = [
  { build: 'Base Tabaxi', speed: 30, withAgility: 60, withDash: 120, note: 'Standard. 120ft burst with Dash.' },
  { build: 'Tabaxi Monk L5', speed: 40, withAgility: 80, withDash: 160, note: 'Unarmored Movement +10. 160ft burst.' },
  { build: 'Tabaxi Monk L18', speed: 60, withAgility: 120, withDash: 240, note: 'Monk speed +30. 240ft in one turn.' },
  { build: 'Tabaxi + Mobile feat', speed: 40, withAgility: 80, withDash: 160, note: 'Mobile +10. Same as Monk L5.' },
  { build: 'Tabaxi + Boots of Speed', speed: 60, withAgility: 120, withDash: 240, note: 'Doubled base + Agility. Insane.' },
  { build: 'Tabaxi + Haste + Dash', speed: 60, withAgility: 120, withDash: 360, note: 'Haste doubles, Agility doubles, Dash. 360ft turn.' },
];

export const TABAXI_CLASS_SYNERGY = [
  { class: 'Monk', priority: 'S', reason: 'DEX. Speed stacking with Unarmored Movement + Feline Agility. Fastest character possible. Step of Wind + Agility = absurd.' },
  { class: 'Rogue', priority: 'S', reason: 'DEX. Free Stealth + Perception. Feline Agility for getaways. Perfect stat and skill match.' },
  { class: 'Ranger', priority: 'A', reason: 'DEX. Climbing speed for outdoor exploration. Stealth + Perception free. Natural scout.' },
  { class: 'Bard', priority: 'A', reason: 'DEX + CHA. Two free skills (Tabaxi get 2, Bard gets tons). Party face + scout combo.' },
  { class: 'Fighter (DEX)', priority: 'A', reason: 'DEX Fighter. Feline Agility for repositioning. Climb speed for terrain advantage.' },
];

export const TABAXI_TACTICS = [
  { tactic: 'Burst movement', detail: 'Feline Agility: double speed one turn. Stand still next turn. Double again. Repeat. Incredible chasing/fleeing.', rating: 'S' },
  { tactic: 'Monk speed stack', detail: 'Monk L10 Tabaxi: 50ft base. Agility: 100ft. Step of Wind Dash: 200ft. In one turn.', rating: 'S' },
  { tactic: 'Hit and run', detail: 'Agility turn: run in, attack, run away 60ft. Nothing can catch you. Stand still next turn.', rating: 'A' },
  { tactic: 'Vertical combat', detail: '20ft climb speed. Scale walls, fight from rooftops, reach elevated positions without checks.', rating: 'A' },
];

export function felineAgilitySpeed(baseSpeed, hasDash = false, hasStepOfWind = false) {
  let speed = baseSpeed * 2;
  if (hasDash) speed *= 2;
  if (hasStepOfWind && !hasDash) speed *= 2;
  return speed;
}
