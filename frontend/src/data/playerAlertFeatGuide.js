/**
 * playerAlertFeatGuide.js
 * Player Mode: Alert feat — never be caught off guard
 * Pure JS — no React dependencies.
 */

export const ALERT_BASICS = {
  feat: 'Alert',
  source: 'Player\'s Handbook',
  benefits: [
    '+5 bonus to initiative.',
    'Can\'t be surprised while conscious.',
    'Hidden creatures don\'t gain advantage on attacks against you.',
  ],
  note: 'Three excellent benefits. +5 initiative is huge. Can\'t be surprised prevents ambush deaths. Hidden attacker negation is gravy.',
};

export const ALERT_VALUE = {
  initiative: {
    bonus: '+5',
    equivalent: 'Like having +10 DEX modifier for initiative only.',
    impact: 'Going first means landing your spell/attack before enemies act. Determines who controls the fight.',
  },
  surprise: {
    benefit: 'You can never be surprised. Even in ambush, you act normally.',
    note: 'Surprised creatures can\'t move or take actions in round 1, can\'t take reactions until turn ends. Alert: you ignore all of this.',
  },
  hiddenAttackers: {
    benefit: 'Hidden creatures don\'t gain advantage on attacks against you.',
    note: 'Invisible attackers, hidden snipers, creatures in darkness — all lose their advantage.',
  },
};

export const ALERT_CLASS_PRIORITY = [
  { class: 'Wizard/Sorcerer', priority: 'S', reason: 'Going first = landing AoE before enemies spread. Casters benefit most from initiative.' },
  { class: 'Gloom Stalker', priority: 'S', reason: '+5 Alert + WIS mod. +10+ initiative. Dread Ambusher turn 1 with highest initiative.' },
  { class: 'Rogue (Assassin)', priority: 'S', reason: 'Assassinate requires going before target. +5 = almost always act first.' },
  { class: 'Paladin', priority: 'A', reason: 'Go first = cast buffs before enemies attack. Can\'t be surprised protects the tank.' },
  { class: 'Fighter', priority: 'B', reason: 'Useful but Fighters have other priorities (GWM, PAM). Take later.' },
  { class: 'Barbarian', priority: 'B', reason: 'Feral Instinct gives advantage on initiative at L7. Less value from Alert.' },
];

export const ALERT_TACTICS = [
  { tactic: 'First-turn AoE', detail: 'Go first → Fireball/Web/Hypnotic Pattern before enemies scatter. Maximum targets.', rating: 'S' },
  { tactic: 'Pre-buff the party', detail: 'Go first → cast Bless/Haste before enemies attack. Party starts with advantages.', rating: 'S' },
  { tactic: 'Ambush immunity', detail: 'Party ambushed? You still act normally. Cast Shield, reposition, or counterattack.', rating: 'S' },
  { tactic: 'Counter-ambush', detail: 'Can\'t be surprised + high initiative = even in ambush, you go first and alert the party.', rating: 'A' },
];

export function alertInitiativeBonus(dexMod) {
  return { total: dexMod + 5, note: `DEX +${dexMod} + Alert +5 = +${dexMod + 5} initiative` };
}
