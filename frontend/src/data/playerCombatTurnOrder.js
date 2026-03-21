/**
 * playerCombatTurnOrder.js
 * Player Mode: Detailed combat turn structure and flow
 * Pure JS — no React dependencies.
 */

export const TURN_STRUCTURE = [
  {
    phase: 'Start of Turn',
    timing: 'Before anything else',
    items: [
      'Ongoing damage effects resolve (e.g., being on fire, Moonbeam)',
      'Regeneration abilities trigger (Troll, some magic items)',
      'Aura effects apply (Spirit Guardians damage)',
      'Condition saves repeat (some end-of-turn, some start-of-turn — read the spell!)',
      'Concentration check if you took damage since your last turn',
    ],
  },
  {
    phase: 'Your Turn',
    timing: 'Main phase',
    items: [
      'Move (up to your speed, can split before/after/during actions)',
      'Action (Attack, Cast, Dash, Dodge, Disengage, Help, Hide, Ready, Search, Use Object)',
      'Bonus Action (if you have one available — class features, spells)',
      'Free Object Interaction (draw/sheathe weapon, open door, pick up item)',
      'Communication (brief, no action cost — short phrases, gestures)',
    ],
  },
  {
    phase: 'End of Turn',
    timing: 'After all actions complete',
    items: [
      'Some condition saves happen at end of turn (read the spell)',
      'Some spell effects trigger at end of turn',
      'Mark any resources used this turn',
      'Note concentration spells still active',
    ],
  },
  {
    phase: 'Other Turns (Reactions)',
    timing: 'During other creatures\' turns',
    items: [
      'Opportunity Attack (enemy leaves your reach)',
      'Counterspell (enemy casts a spell within 60ft)',
      'Shield (+5 AC until start of next turn)',
      'Absorb Elements (halve elemental damage, boost next attack)',
      'Hellish Rebuke (damage creature that hit you)',
      'Uncanny Dodge (halve attack damage — Rogue)',
      'Cutting Words (reduce enemy roll — Bard)',
    ],
  },
];

export const ACTION_ORDER_TIPS = [
  'You can split movement: move 15ft → attack → move 15ft more.',
  'Bonus action spells limit your action to cantrips only (not other leveled spells).',
  'Free object interaction is ONE per turn — drawing AND sheathing requires two turns (or Dual Wielder feat).',
  'You get ONE reaction per round. It refreshes at the start of your turn.',
  'Ready action: if you ready a spell, it uses concentration and the slot is spent even if it never triggers.',
  'You can delay your turn in 5e by using Ready, but there\'s no official "delay" action.',
  'Falling is instant — if you fall 500ft, it all happens before your next turn.',
];

export const FIRST_TURN_PRIORITIES = [
  { role: 'Caster (Control)', priority: 'Cast your best concentration control spell (Hypnotic Pattern, Web, Entangle).' },
  { role: 'Caster (Damage)', priority: 'AoE if enemies are clustered. Otherwise buff (Bless) or debuff (Faerie Fire).' },
  { role: 'Healer', priority: 'Bless or Spirit Guardians. Don\'t pre-heal — heal when someone goes down.' },
  { role: 'Melee (Tank)', priority: 'Move to block enemies from reaching back line. Reckless Attack or GWM if confident.' },
  { role: 'Melee (Striker)', priority: 'Reach the most dangerous target. Sneak Attack, Smite on crit, or Flurry of Blows.' },
  { role: 'Ranged', priority: 'Find cover. Target the enemy spellcaster or the biggest threat. Hunter\'s Mark.' },
];

export function getTurnPhase(phaseName) {
  return TURN_STRUCTURE.find(p => p.phase.toLowerCase().includes((phaseName || '').toLowerCase())) || null;
}

export function getFirstTurnPriority(role) {
  return FIRST_TURN_PRIORITIES.find(p => p.role.toLowerCase().includes((role || '').toLowerCase())) || null;
}
