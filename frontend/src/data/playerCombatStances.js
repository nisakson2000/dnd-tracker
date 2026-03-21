/**
 * playerCombatStances.js
 * Player Mode: Tactical combat positioning and stances
 * Pure JS — no React dependencies.
 */

export const COMBAT_STANCES = [
  {
    stance: 'Aggressive',
    description: 'Move toward enemies, maximize damage output.',
    tips: [
      'Use Dash to close distance if needed.',
      'Flank enemies for advantage (optional rule).',
      'Target the most dangerous enemy first.',
      'Use bonus action attacks (TWF, Martial Arts, etc.).',
    ],
    bestFor: ['Barbarian', 'Fighter', 'Paladin', 'Monk'],
    risks: ['Overextending away from healer range', 'Provoking multiple opportunity attacks', 'Ignoring back-line threats'],
  },
  {
    stance: 'Defensive',
    description: 'Protect allies, hold position, use Dodge or cover.',
    tips: [
      'Use Dodge action if you\'re tanking multiple enemies.',
      'Position between enemies and squishy allies.',
      'Use Shield spell or Shield Master feat reactively.',
      'Take opportunity attacks on enemies that try to pass.',
    ],
    bestFor: ['Fighter (tank)', 'Paladin', 'Cleric (heavy armor)', 'Barbarian'],
    risks: ['Low damage output', 'Enemies may bypass you', 'Wasting turns if enemies aren\'t attacking you'],
  },
  {
    stance: 'Ranged / Kiting',
    description: 'Stay at range, use cover, avoid melee.',
    tips: [
      'Stay behind half or three-quarters cover (+2/+5 AC).',
      'Move after attacking to break line of sight.',
      'Use difficult terrain or obstacles to slow melee enemies.',
      'Remember: ranged attacks have disadvantage within 5 feet of hostile creatures.',
    ],
    bestFor: ['Ranger', 'Warlock', 'Sorcerer', 'Fighter (ranged)'],
    risks: ['Disadvantage if enemies close in', 'Limited cover in open areas', 'Long range penalties'],
  },
  {
    stance: 'Support / Buff',
    description: 'Focus on enhancing allies and controlling the battlefield.',
    tips: [
      'Maintain concentration on key buff (Bless, Haste, etc.).',
      'Stay in range to heal but out of melee.',
      'Use Help action if you have nothing better.',
      'Position for aura benefits (Paladin, Bard).',
    ],
    bestFor: ['Bard', 'Cleric', 'Druid', 'Paladin (aura)'],
    risks: ['Being targeted to break concentration', 'Not contributing damage', 'Allies moving out of range'],
  },
  {
    stance: 'Control / Area Denial',
    description: 'Use spells and abilities to shape the battlefield.',
    tips: [
      'Place AoE spells to split enemy groups.',
      'Use Wall spells to block reinforcements.',
      'Entangle/Web to lock down melee enemies.',
      'Silence to shut down enemy casters.',
    ],
    bestFor: ['Wizard', 'Druid', 'Sorcerer', 'Bard'],
    risks: ['Friendly fire from AoE', 'Concentration broken = lost control', 'Enemies with high saves ignore you'],
  },
  {
    stance: 'Hit and Run',
    description: 'Strike then reposition to avoid retaliation.',
    tips: [
      'Rogues: attack then Cunning Action Disengage.',
      'Monks: Flurry then Step of the Wind.',
      'Mobile feat: no OA from creatures you attack.',
      'Fly-by attacks if you have flying speed.',
    ],
    bestFor: ['Rogue', 'Monk', 'Ranger (Mobile)', 'Any with Mobile feat'],
    risks: ['Less effective without Disengage options', 'Uses bonus action for movement', 'May leave allies unprotected'],
  },
];

export const POSITIONING_TIPS = [
  'Never cluster — AoE spells punish grouping.',
  'Casters stay behind martial characters.',
  'Use doorways as chokepoints — force 1-on-1 fights.',
  'High ground gives advantage on ranged attacks (optional rule).',
  'End your turn behind cover whenever possible.',
  'Stay within 60ft of your healer.',
  'Flanking (optional): allies on opposite sides = advantage.',
];

export function getStance(stanceName) {
  return COMBAT_STANCES.find(s => s.stance.toLowerCase() === (stanceName || '').toLowerCase()) || null;
}

export function suggestStance(className) {
  return COMBAT_STANCES.filter(s => s.bestFor.some(c => c.toLowerCase().includes((className || '').toLowerCase())));
}
