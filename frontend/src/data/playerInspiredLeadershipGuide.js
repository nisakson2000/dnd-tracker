/**
 * playerInspiredLeadershipGuide.js
 * Player Mode: Party leadership, shot-calling, and team coordination
 * Pure JS — no React dependencies.
 */

export const PARTY_ROLES = [
  { role: 'Shot Caller', description: 'Makes tactical decisions in combat. Calls targets, orders retreat.', bestClasses: 'Fighter, Paladin, Bard', tip: 'Communicate clearly. "Focus the mage" is better than "attack something."' },
  { role: 'Face', description: 'Handles social encounters. Speaks for the party in negotiations.', bestClasses: 'Bard, Warlock, Sorcerer, Rogue', tip: 'Let others contribute insights. Being the Face doesn\'t mean silencing others.' },
  { role: 'Scout', description: 'Goes ahead to gather intel. Reports back before the party commits.', bestClasses: 'Rogue, Ranger, Monk, Druid (Wild Shape)', tip: 'Always have an escape plan. Don\'t engage alone.' },
  { role: 'Mapper/Note-Taker', description: 'Tracks the party\'s path, important NPCs, quest objectives.', bestClasses: 'Any (out-of-game role)', tip: 'Keep notes concise. Map key intersections, not every 5ft.' },
  { role: 'Treasurer', description: 'Manages party gold, loot distribution, and purchases.', bestClasses: 'Any (out-of-game role)', tip: 'Track shared loot. Fair distribution prevents arguments.' },
  { role: 'Timekeeper', description: 'Tracks torch duration, spell durations, travel time.', bestClasses: 'Any', tip: 'Especially important for concentration spells and limited-duration effects.' },
];

export const COMBAT_COMMUNICATION = [
  { callout: 'Focus fire target', example: '"Everyone hit the wizard first!"', impact: 'S — concentrated damage kills threats faster.', note: 'Action economy: 4 PCs on 1 enemy > 1 PC each on 4 enemies.' },
  { callout: 'Incoming AoE', example: '"Spread out, they have a breath weapon!"', impact: 'A+ — prevents party wipes from single effects.', note: 'Stay 30ft apart if dragon or AoE caster.' },
  { callout: 'Retreat signal', example: '"Fog Cloud, everyone run north!"', impact: 'S — saves TPKs.', note: 'Agree on retreat signal before combat starts.' },
  { callout: 'Combo setup', example: '"I\'ll Hold Person, you smite on your turn!"', impact: 'S — coordinate for devastating combos.', note: 'Call out on YOUR turn what you need from allies.' },
  { callout: 'Resource status', example: '"I\'m out of spell slots" or "Last rage."', impact: 'A — informs party tactics.', note: 'Let allies know when you\'re running low.' },
  { callout: 'Counterspell alert', example: '"I see the lich starting to cast — should I counter?"', impact: 'S — coordinate who counters what.', note: 'Only need one person to Counter. Don\'t waste multiple.' },
  { callout: 'Flanking position', example: '"I\'ll move to the other side for flanking advantage."', impact: 'A — if using flanking rules.', note: 'Flanking: two allies on opposite sides = advantage on melee attacks.' },
];

export const LOOT_DISTRIBUTION = {
  methods: [
    { method: 'Need before Greed', description: 'Item goes to whoever benefits most. Party votes on disputes.', rating: 'S', note: 'Most common and fair. Magic sword goes to the Fighter, spell scroll to the Wizard.' },
    { method: 'Round Robin', description: 'Players take turns picking items.', rating: 'A', note: 'Prevents one person hoarding. May not optimize for party power.' },
    { method: 'Auction', description: 'Bid party gold for items. Gold returns to party fund.', rating: 'B+', note: 'Fun but can create imbalance if one player has more gold.' },
    { method: 'DM Assigns', description: 'DM distributes based on party needs.', rating: 'A', note: 'Simplest. Relies on DM fairness.' },
  ],
  tips: [
    'Consumables (potions, scrolls) should go to whoever is most likely to use them effectively.',
    'Attunement items should go to whoever has free attunement slots AND benefits most.',
    'Gold should be split evenly unless party agrees otherwise.',
    'Discuss loot distribution at session 0 to prevent conflicts.',
  ],
};

export const PARTY_COORDINATION_TIPS = [
  'Discuss tactics BEFORE entering combat. "If we see undead, Cleric uses Turn Undead first."',
  'Establish marching order: tanks front, squishies middle, rearguard.',
  'Designate who carries the Bag of Holding, healing potions, and diamonds.',
  'Set up a "buddy system": each frontliner protects a specific caster.',
  'Share buffs: Bless hits 3 people, choose wisely. Haste the person with the best action.',
  'Agree on retreat conditions: "If two of us go down, we retreat."',
  'After every combat, share information: "I noticed it was resistant to fire."',
];
