/**
 * playerKiPointOptGuide.js
 * Player Mode: Monk Ki Points — optimization, spending priority, and recovery
 * Pure JS — no React dependencies.
 */

export const KI_RULES = {
  pool: 'Ki points = Monk level.',
  recovery: 'All ki points regain on SHORT REST.',
  saveDC: '8 + PB + WIS mod.',
  note: 'Ki is your most limited resource. Spend wisely. Short rest often.',
};

export const KI_ABILITIES_RANKED = [
  { ability: 'Stunning Strike', cost: 1, level: 5, effect: 'On hit: target must CON save or be Stunned until end of your next turn.', rating: 'S+', note: 'Best ki ability. Stunned = can\'t act, auto-fail STR/DEX saves, attacks have advantage. Use on first hit each round.' },
  { ability: 'Flurry of Blows', cost: 1, level: 2, effect: 'After Attack action: 2 unarmed strikes as BA.', rating: 'S', note: 'Your main damage boost. 2 extra attacks. Use most rounds.' },
  { ability: 'Patient Defense', cost: 1, level: 2, effect: 'Dodge as BA.', rating: 'A+', note: 'All attacks against you have disadvantage. Use when focused by enemies.' },
  { ability: 'Step of the Wind', cost: 1, level: 2, effect: 'Dash or Disengage as BA. Jump distance doubled.', rating: 'A', note: 'Free Disengage + extra movement. Good for hit-and-run.' },
  { ability: 'Deflect Missiles', cost: 1, level: 3, effect: 'Catch and throw back a missile (if damage reduced to 0).', rating: 'A', note: 'Catch arrows and throw them back. Iconic and effective vs ranged.' },
  { ability: 'Slow Fall', cost: 0, level: 4, effect: 'Reduce fall damage by 5 × Monk level. Reaction, no ki cost.', rating: 'A', note: 'Free. No ki cost. Just a reaction. Great safety net.' },
  { ability: 'Stillness of Mind', cost: 0, level: 7, effect: 'End one charmed or frightened effect on yourself (action).', rating: 'A', note: 'Free charm/frighten removal. Costs action though.' },
  { ability: 'Evasion', cost: 0, level: 7, effect: 'DEX saves: success = 0 damage, failure = half.', rating: 'S', note: 'Free. Halves Fireballs, breath weapons, etc.' },
  { ability: 'Diamond Soul', cost: 1, level: 14, effect: 'Proficiency in ALL saves. Spend 1 ki to reroll failed save.', rating: 'S+', note: 'Proficiency in EVERY saving throw + ki reroll. Incredible.' },
  { ability: 'Empty Body', cost: 4, level: 18, effect: 'Invisible + resistance to all damage except force. 1 minute.', rating: 'S+', note: 'Near-invulnerable. Invisible + half damage. Expensive but devastating.' },
];

export const SUBCLASS_KI_FEATURES = [
  { subclass: 'Open Hand', feature: 'Open Hand Technique', cost: 0, effect: 'On Flurry of Blows: prone, push 15ft, or no reactions. No extra ki.', rating: 'S+' },
  { subclass: 'Shadow', feature: 'Shadow Arts', cost: 2, effect: 'Cast Darkness, Darkvision, Pass w/o Trace, Silence. 2 ki each.', rating: 'S' },
  { subclass: 'Mercy', feature: 'Hands of Healing', cost: 1, effect: 'Heal 1d + martial arts die + WIS mod. Can replace Flurry attack.', rating: 'S' },
  { subclass: 'Mercy', feature: 'Hands of Harm', cost: 1, effect: 'Extra necrotic damage + poisoned (CON save). On unarmed hit.', rating: 'A+' },
  { subclass: 'Astral Self', feature: 'Arms of the Astral Self', cost: 1, effect: 'Summon astral arms. Use WIS for attacks. 10ft reach. Force damage.', rating: 'A+' },
  { subclass: 'Four Elements', feature: 'Elemental Disciplines', cost: '2-6', effect: 'Cast spells using ki. Very expensive.', rating: 'B', note: 'Too ki-hungry. Way of Four Elements is weakest Monk subclass.' },
  { subclass: 'Kensei', feature: 'Deft Strike', cost: 1, effect: 'Extra martial arts die damage on Kensei weapon hit.', rating: 'A' },
  { subclass: 'Drunken Master', feature: 'Tipsy Sway', cost: 0, effect: 'Redirect missed attack to adjacent creature. Free.', rating: 'A+' },
  { subclass: 'Long Death', feature: 'Touch of Death', cost: 0, effect: 'Gain temp HP = WIS + Monk level when you reduce a creature to 0.', rating: 'A+' },
];

export const KI_SPENDING_PRIORITY = [
  { priority: 1, ability: 'Stunning Strike', reason: 'Win condition. Stunned enemies can\'t fight back. Use on first hit each round.' },
  { priority: 2, ability: 'Flurry of Blows', reason: 'Extra damage. More attacks = more chances to Stun.' },
  { priority: 3, ability: 'Patient Defense', reason: 'When being focused. Disadvantage on all incoming attacks.' },
  { priority: 4, ability: 'Step of the Wind', reason: 'Positioning and escape. Less common need.' },
  { priority: 5, ability: 'Subclass features', reason: 'Varies. Shadow: Pass without Trace (2 ki) is S+ tier.' },
];

export const KI_TIPS = [
  'Ki recovers on SHORT REST. Push for short rests between fights.',
  'Stunning Strike on first hit. If it lands, remaining attacks have advantage.',
  'Don\'t Stunning Strike every attack. 1-2 attempts per round max. Save ki.',
  'Flurry of Blows is your default BA unless you need to Dodge or Disengage.',
  'Patient Defense when 2+ enemies are attacking you. Otherwise, Flurry.',
  'Four Elements Monk is a ki trap. Spells cost too much ki. Avoid or houserule.',
  'Shadow Monk: Pass without Trace (2 ki) is the best use of ki in the game.',
  'Mercy Monk: replace one Flurry attack with heal. Damage + support in one action.',
  'At L14, Diamond Soul makes you the best save-maker in the game. Reroll for 1 ki.',
  'L2-4 Monks: ki is very scarce. Be conservative. L5+ gets much better.',
];
