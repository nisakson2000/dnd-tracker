/**
 * playerCombatOpenersGuide.js
 * Player Mode: Best round 1 actions by class — optimal combat openers
 * Pure JS — no React dependencies.
 */

export const ROUND_1_BY_CLASS = [
  {
    class: 'Fighter',
    openers: [
      { action: 'Action Surge + Attack', why: 'Double attacks. 4-8 attacks round 1. Nova damage.', rating: 'S+' },
      { action: 'Attack + Trip Attack', why: 'Prone on first hit → advantage on remaining attacks.', rating: 'S' },
      { action: 'Archery: Sharpshooter shots', why: '-5/+10 all attacks. High damage output.', rating: 'S' },
    ],
  },
  {
    class: 'Barbarian',
    openers: [
      { action: 'BA Rage → Reckless Attack', why: 'Advantage on all attacks. Resistance active. Go aggressive.', rating: 'S+' },
      { action: 'Rage → GWM attacks', why: 'Reckless offsets GWM -5. Max damage.', rating: 'S+' },
    ],
  },
  {
    class: 'Rogue',
    openers: [
      { action: 'Attack with advantage → Sneak Attack', why: 'Max Sneak Attack damage. Hide first if possible.', rating: 'S' },
      { action: 'Steady Aim → Attack', why: 'BA advantage → guaranteed Sneak Attack.', rating: 'A+' },
      { action: 'Assassinate (Assassin)', why: 'Surprise = auto-crit. All Sneak Attack dice doubled.', rating: 'S+' },
    ],
  },
  {
    class: 'Wizard',
    openers: [
      { action: 'Hypnotic Pattern / Web', why: 'Disable multiple enemies immediately. Win the action economy.', rating: 'S+' },
      { action: 'Fireball (if enemies grouped)', why: '8d6 to multiple targets. Clear trash mobs.', rating: 'S' },
      { action: 'Wall of Force (high level)', why: 'Split the encounter. Fight half the enemies.', rating: 'S+' },
    ],
  },
  {
    class: 'Cleric',
    openers: [
      { action: 'Spirit Guardians', why: 'Best sustained damage. Affects enemies who start near you.', rating: 'S+' },
      { action: 'Bless (3 allies)', why: '+1d4 attacks and saves for 3 allies. Scales the party.', rating: 'S+' },
      { action: 'Spiritual Weapon + Toll the Dead', why: 'BA damage + cantrip damage. No concentration.', rating: 'A+' },
    ],
  },
  {
    class: 'Paladin',
    openers: [
      { action: 'Bless (3 allies)', why: '+1d4 to attacks and saves. Best support opener.', rating: 'S+' },
      { action: 'Vow of Enmity → Attack', why: 'BA advantage on one target. Attack with advantage + smite on crit.', rating: 'S' },
      { action: 'Attack → Smite (on crit)', why: 'Hold smite for crits. Don\'t waste slots on normal hits round 1.', rating: 'A+' },
    ],
  },
  {
    class: 'Sorcerer',
    openers: [
      { action: 'Quickened Hypnotic Pattern + EB', why: 'Control as BA → damage with action.', rating: 'S+' },
      { action: 'Twinned Haste', why: 'Buff two martials simultaneously.', rating: 'S' },
      { action: 'Fireball (grouped enemies)', why: '8d6 AoE. Clear groups.', rating: 'S' },
    ],
  },
  {
    class: 'Warlock',
    openers: [
      { action: 'Hex + Eldritch Blast', why: 'BA Hex → EB. 1d10+1d6+CHA per beam.', rating: 'S' },
      { action: 'Hypnotic Pattern', why: 'Control the battlefield first.', rating: 'S+' },
      { action: 'Darkness + Devil\'s Sight', why: 'Advantage on attacks, enemies can\'t see you.', rating: 'A+' },
    ],
  },
  {
    class: 'Bard',
    openers: [
      { action: 'Hypnotic Pattern / Faerie Fire', why: 'Disable groups or grant party advantage.', rating: 'S+' },
      { action: 'Inspiration + cantrip', why: 'Give inspiration to martial → Vicious Mockery or attack.', rating: 'A+' },
      { action: 'Heat Metal (armored enemy)', why: 'No save for damage. Can\'t remove armor.', rating: 'S' },
    ],
  },
  {
    class: 'Druid',
    openers: [
      { action: 'Conjure Animals', why: '8 wolves. Immediate action economy dominance.', rating: 'S+' },
      { action: 'Entangle / Spike Growth', why: 'Area control. Restrain or punish movement.', rating: 'S' },
      { action: 'Moon: BA Wild Shape → attack', why: 'Transform and attack same turn.', rating: 'S' },
    ],
  },
  {
    class: 'Ranger',
    openers: [
      { action: 'Conjure Animals (L9+)', why: '8 wolves. Same as Druid. Broken.', rating: 'S+' },
      { action: 'Entangle + attack', why: 'Restrain enemies → attack with advantage.', rating: 'S' },
      { action: 'Gloom Stalker: Dread Ambusher', why: 'Extra attack R1 + extra 1d8. Extra movement. Free.', rating: 'S+' },
    ],
  },
  {
    class: 'Monk',
    openers: [
      { action: 'Attack + Flurry of Blows → Stunning Strike', why: '4 attacks. Try to stun priority target.', rating: 'S' },
      { action: 'Attack + Stunning Strike on caster', why: 'Stun the caster. They lose concentration.', rating: 'S+' },
    ],
  },
  {
    class: 'Artificer',
    openers: [
      { action: 'Cannon + attack/cantrip', why: 'Eldritch Cannon (BA damage) + Firebolt or attack.', rating: 'A+' },
      { action: 'Web / Faerie Fire', why: 'Control first, then sustained cannon damage.', rating: 'A+' },
    ],
  },
];

export const COMBAT_OPENER_TIPS = [
  'Control spells first. Hypnotic Pattern round 1 wins more fights than Fireball.',
  'Fighter: Action Surge round 1 for maximum impact.',
  'Barbarian: always Rage round 1. Resistance + damage bonus.',
  'Cleric: Spirit Guardians round 1. Everything else is secondary.',
  'Paladin: Bless or Vow of Enmity. Support or damage.',
  'Bard: control first (Hypnotic Pattern), then support.',
  'Wizard: Wall of Force to split, or Hypnotic Pattern to disable.',
  'Warlock: Hex + EB is your bread and butter opener.',
  'Rogue: get advantage somehow. Sneak Attack is your whole turn.',
  'Going first is critical. Initiative bonuses matter.',
];
