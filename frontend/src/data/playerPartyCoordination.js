/**
 * playerPartyCoordination.js
 * Player Mode: Party coordination signals and communication
 * Pure JS — no React dependencies.
 */

export const COMBAT_CALLOUTS = [
  { callout: 'Focus [target]!', meaning: 'Everyone attack this specific enemy.', when: 'Priority target identified' },
  { callout: 'I\'m down!', meaning: 'I\'m at 0 HP. Need healing.', when: 'Dropped to 0 HP' },
  { callout: 'I\'ll hold them!', meaning: 'I\'m tanking. Don\'t worry about me.', when: 'Engaging multiple enemies' },
  { callout: 'Fall back!', meaning: 'Retreat toward the exit.', when: 'Fight is going badly' },
  { callout: 'Incoming AoE!', meaning: 'I\'m about to Fireball/AoE. Move away from target area.', when: 'About to cast area spell' },
  { callout: 'Healer down!', meaning: 'Our healer is unconscious. Critical situation.', when: 'Healer drops to 0' },
  { callout: 'Need flanking!', meaning: 'Get on the opposite side for advantage.', when: 'Using flanking rules' },
  { callout: 'Counterspell!', meaning: 'Enemy is casting a spell — someone needs to counter it.', when: 'Enemy starts casting' },
  { callout: 'No spells left!', meaning: 'I\'m out of spell slots. Cantrips only.', when: 'Resources depleted' },
  { callout: 'It\'s immune to [type]!', meaning: 'Don\'t use that damage type against this enemy.', when: 'Discovered immunity' },
];

export const COORDINATION_STRATEGIES = [
  { name: 'Focus Fire Protocol', detail: 'Leader calls target. Everyone attacks that target until dead. Then next target.', benefit: 'Eliminates enemies faster. Reduces incoming damage.' },
  { name: 'Buddy System', detail: 'Pair melee + ranged or melee + healer. Watch each other\'s backs.', benefit: 'No one gets isolated. Always have support nearby.' },
  { name: 'Kill Order', detail: 'Pre-plan priority: Healers > Casters > DPS > Tanks.', benefit: 'Saves time deciding targets mid-combat.' },
  { name: 'Action Sync', detail: 'Coordinate readied actions. "When I shove him prone, everyone attacks."', benefit: 'Combine effects for maximum impact.' },
  { name: 'Zone Defense', detail: 'Each player covers a section of the battlefield.', benefit: 'No gaps in defense. Enemies can\'t slip through.' },
  { name: 'Combo Setup', detail: 'One player sets up (Hold Person) → others capitalize (auto-crit).', benefit: 'Multiplicative damage instead of additive.' },
];

export const PRE_COMBAT_SIGNALS = [
  { signal: 'Raised fist', meaning: 'Stop. Hold position. Don\'t move.' },
  { signal: 'Pointed finger', meaning: 'Look at that / threat identified in that direction.' },
  { signal: 'Open palm push down', meaning: 'Get down / stay hidden.' },
  { signal: 'Wave forward', meaning: 'Move up. Advance.' },
  { signal: 'Throat slash gesture', meaning: 'Enemies ahead. Prepare for combat.' },
  { signal: 'Thumbs up', meaning: 'All clear. Safe to proceed.' },
];

export function getCallout(situation) {
  return COMBAT_CALLOUTS.find(c =>
    c.when.toLowerCase().includes((situation || '').toLowerCase())
  ) || null;
}

export function getCoordinationStrategy(name) {
  return COORDINATION_STRATEGIES.find(s =>
    s.name.toLowerCase().includes((name || '').toLowerCase())
  ) || null;
}
