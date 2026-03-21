/**
 * playerCombatFormationGuide.js
 * Player Mode: Party formation strategies for different scenarios
 * Pure JS — no React dependencies.
 */

export const FORMATIONS = [
  {
    name: 'Standard Line',
    description: 'Martial characters in front, ranged/casters behind.',
    positions: { front: ['Fighter', 'Paladin', 'Barbarian'], middle: ['Ranger', 'Monk', 'Rogue'], back: ['Wizard', 'Sorcerer', 'Warlock', 'Bard', 'Cleric', 'Druid'] },
    bestFor: 'Open field combat, straightforward encounters.',
    weakness: 'Flanking attacks, enemies that bypass the front line.',
  },
  {
    name: 'Diamond',
    description: 'Tank front, damage dealers on sides, healer in center-back.',
    positions: { front: ['Tank'], left: ['Melee DPS'], right: ['Ranged DPS'], back: ['Healer'] },
    bestFor: 'Corridors, narrow spaces, protecting the healer.',
    weakness: 'Ambushes from behind, AoE hitting the cluster.',
  },
  {
    name: 'Two Lines',
    description: 'Two tanks in front, two ranged/support behind.',
    positions: { frontLeft: ['Tank 1'], frontRight: ['Tank 2'], backLeft: ['Ranged 1'], backRight: ['Healer/Support'] },
    bestFor: '4-person parties, balanced defense.',
    weakness: 'Spread too thin against many enemies.',
  },
  {
    name: 'Circle / Defensive Ring',
    description: 'Everyone faces outward, protecting the center.',
    positions: { outer: ['All martial characters'], center: ['Most vulnerable member or objective'] },
    bestFor: 'Surrounded, protecting a VIP or objective, last stand.',
    weakness: 'No concentrated front, hard to maintain.',
  },
  {
    name: 'Skirmish / Spread',
    description: 'Everyone spread out, 15+ feet apart.',
    positions: { spread: ['Everyone 15-20ft apart'] },
    bestFor: 'Against AoE-heavy enemies (dragons, spellcasters).',
    weakness: 'Can\'t support each other easily, healers have range issues.',
  },
  {
    name: 'Chokepoint',
    description: 'Funnel enemies through a narrow passage.',
    positions: { choke: ['Tank (blocks passage)'], behind: ['Everyone else attacks from behind tank'] },
    bestFor: 'Doorways, hallways, bridges. Massively favorable.',
    weakness: 'Enemies may have alternative routes. AoE through the choke.',
  },
];

export const MARCHING_ORDER = [
  { position: 'Scout (60ft ahead)', role: 'Highest Stealth/Perception. Spots danger first.', risk: 'Isolated if ambushed.' },
  { position: 'Front', role: 'Best AC/HP. First to engage. Carries light source.', risk: 'Takes first hits from traps and enemies.' },
  { position: 'Middle', role: 'Protected position. Casters and support.', risk: 'Cut off if front and back are engaged.' },
  { position: 'Rear Guard', role: 'Watches behind. Good Perception. Often a Ranger or Rogue.', risk: 'Ambushed from behind. Last to reach front-line combat.' },
];

export function getFormation(name) {
  return FORMATIONS.find(f => f.name.toLowerCase().includes((name || '').toLowerCase())) || null;
}

export function suggestFormation(scenario) {
  const s = (scenario || '').toLowerCase();
  if (s.includes('corridor') || s.includes('narrow') || s.includes('hallway')) return getFormation('Diamond');
  if (s.includes('surround') || s.includes('protect') || s.includes('defend')) return getFormation('Circle');
  if (s.includes('dragon') || s.includes('aoe') || s.includes('fireball')) return getFormation('Skirmish');
  if (s.includes('door') || s.includes('choke') || s.includes('bridge')) return getFormation('Chokepoint');
  return getFormation('Standard Line');
}
