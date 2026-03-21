/**
 * playerMonkKiManagementGuide.js
 * Player Mode: Monk ki point management and optimization
 * Pure JS — no React dependencies.
 */

export const KI_BASICS = {
  pool: 'Ki points = Monk level. Recover ALL on short or long rest.',
  saveDC: '8 + proficiency + WIS modifier.',
  note: 'Ki is your most precious resource. Every point matters, especially at low levels.',
};

export const KI_ABILITIES = [
  { ability: 'Flurry of Blows', cost: 1, action: 'BA', effect: 'Two unarmed strikes as BA (instead of one).', rating: 'S', note: 'Your bread and butter. Extra attack = more damage + more Stunning Strike chances.' },
  { ability: 'Patient Defense', cost: 1, action: 'BA', effect: 'Dodge as BA.', rating: 'A', note: 'When you\'re taking heat. Disadvantage on all attacks against you.' },
  { ability: 'Step of the Wind', cost: 1, action: 'BA', effect: 'Disengage or Dash as BA. Jump distance doubled.', rating: 'B+', note: 'Mobility. Usually free Disengage is enough without spending ki.' },
  { ability: 'Stunning Strike', cost: 1, action: 'On hit', effect: 'Target must CON save or be stunned until end of your next turn.', rating: 'S+', note: 'Best monk feature. Stunned = can\'t act, auto-fail STR/DEX saves, advantage on attacks.' },
  { ability: 'Deflect Missiles', cost: 1, action: 'Reaction', effect: 'Reduce ranged damage by 1d10+DEX+level. If reduced to 0, throw it back.', rating: 'A', note: 'Only costs ki if you throw it back. The reduction is FREE.' },
  { ability: 'Slow Fall', cost: 0, action: 'Reaction', effect: 'Reduce falling damage by 5× monk level.', rating: 'B', note: 'Free! No ki cost. L10 monk reduces 50 damage from falls.' },
  { ability: 'Quickened Healing (Tasha\'s)', cost: 2, action: 'Action', effect: 'Heal self 1 martial arts die + PB.', rating: 'C', note: 'Too expensive. 2 ki for tiny healing. Only use if desperate.' },
  { ability: 'Focused Aim (Tasha\'s)', cost: 1-3, action: 'On miss', effect: '+2 per ki spent to attack roll (after seeing roll).', rating: 'A', note: 'Turn misses into hits. Great for landing Stunning Strikes.' },
  { ability: 'Ki-Fueled Attack (Tasha\'s)', cost: 0, action: 'BA', effect: 'If you spent ki on your action, make one weapon/unarmed strike as BA.', rating: 'A+', note: 'Free BA attack when using Stunning Strike. Replaces Flurry sometimes.' },
];

export const KI_BUDGET_PER_LEVEL = [
  { level: '2-4', pool: '2-4', strategy: 'Extremely tight. Flurry only on important fights. Save 1 ki for emergencies.', stunningStrike: 'N/A (not yet)' },
  { level: '5-8', pool: '5-8', strategy: 'Getting better. Can Flurry most fights. Stunning Strike on priority targets only.', stunningStrike: 'Save for casters and boss monsters. Don\'t spam.' },
  { level: '9-12', pool: '9-12', strategy: 'Comfortable. Can use 2-3 ki per fight. Start stunning more freely.', stunningStrike: 'Can attempt 2-3 per fight. Target low-CON enemies.' },
  { level: '13-16', pool: '13-16', strategy: 'Abundant. Use ki freely. Push for short rests to refill.', stunningStrike: 'Spam on high-value targets. You can afford to fish.' },
  { level: '17-20', pool: '17-20', strategy: 'Overflowing. Empty Stunning Strike every important target. You refill on SR.', stunningStrike: 'Stun everything. Empty Body (L18) costs 4 ki but is incredible.' },
];

export const STUNNING_STRIKE_OPTIMIZATION = {
  note: 'Stunning Strike targets CON — the MOST common strong save. This is Monk\'s biggest problem.',
  tips: [
    'Target casters and low-CON creatures. Wizards, Sorcerers, many fey and undead.',
    'Don\'t waste ki stunning creatures that are already controlled.',
    'Flurry of Blows gives 4 chances to stun per turn (2 attacks + 2 flurry). More tries = better odds.',
    'Focused Aim: if first attack misses, spend 1 ki to hit, THEN spend 1 ki to stun. Expensive but effective.',
    'Stunned condition: incapacitated, can\'t move, auto-fail STR/DEX saves, attacks have advantage.',
    'WIS is your #2 priority after DEX. Higher WIS = higher DC = more stuns.',
    'At L5 with WIS 16: DC 14. Against CON +1 enemy, ~60% chance to stun per attempt.',
    'Against CON +5 enemy (many bosses): only ~40% chance. Need multiple attempts.',
  ],
};

export const MONK_SUBCLASS_KI = [
  { subclass: 'Open Hand', kiUse: 'Flurry adds free prone/push/no-reactions. No extra ki cost.', rating: 'S', note: 'Best ki efficiency. Flurry does more without costing more.' },
  { subclass: 'Shadow', kiUse: '2 ki for Darkness, Silence, etc. Shadow Step is FREE.', rating: 'A+', note: 'Shadow Step (60ft teleport in dim/dark) costs 0 ki. Amazing.' },
  { subclass: 'Mercy', kiUse: '1 ki to heal (Hands of Healing) or harm (Hands of Harm).', rating: 'S', note: 'Versatile ki spending. Healing without spell slots. Harm adds damage + poison.' },
  { subclass: 'Astral Self', kiUse: '1 ki to summon astral arms (10 min). Uses WIS for attacks.', rating: 'A', note: 'Makes WIS your attack stat. SAD build. Arms are magical.' },
  { subclass: 'Kensei', kiUse: 'Kensei weapons + Deft Strike (1 ki for +martial arts die damage).', rating: 'A', note: 'Better weapon options. Deft Strike is efficient damage boost.' },
  { subclass: 'Four Elements', kiUse: '2-6 ki for elemental spells. VERY expensive.', rating: 'C', note: 'Worst ki efficiency in the game. 3 ki for a Fireball when you have 8 ki total.' },
  { subclass: 'Drunken Master', kiUse: 'Flurry gives free Disengage + 10ft speed. No extra cost.', rating: 'A+', note: 'Hit-and-run. Flurry → free Disengage → run. Great ki efficiency.' },
  { subclass: 'Long Death', kiUse: '1 ki to not drop to 0 HP (Hour of Reaping). Incredible survival.', rating: 'A+', note: 'Spend ki to not die. At L11+, very hard to kill.' },
];

export const MONK_TIPS = [
  'Always push for short rests. You get ALL ki back. Monks are short-rest dependent.',
  'Mobile feat > Step of the Wind. Free Disengage from anyone you attack. Saves 1 ki/round.',
  'Don\'t use Quickened Healing. 2 ki for tiny HP is terrible. Use a healing potion instead.',
  'Flurry of Blows on Round 1, then decide if Patient Defense is needed Round 2.',
  'Empty Body (L18): 4 ki for invisibility + resistance to all except force. Best monk feature.',
  'Monks are MAD: need DEX, WIS, and CON. Use point buy 15/15/15/8/8/8 → DEX/WIS/CON.',
];
