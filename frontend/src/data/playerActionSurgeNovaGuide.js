/**
 * playerActionSurgeNovaGuide.js
 * Player Mode: Action Surge optimization and nova round strategies
 * Pure JS — no React dependencies.
 */

export const ACTION_SURGE_RULES = {
  feature: 'Fighter L2: Action Surge',
  effect: 'One additional Action on your turn.',
  uses: '1/SR (2/SR at Fighter L17).',
  note: 'Best nova feature in the game. Extra FULL Action.',
  key: 'You get Action + Action Surge Action + Bonus Action + Movement. Not just attacks.',
};

export const ACTION_SURGE_USES = [
  { use: 'Double Attack Action', class: 'Fighter', effect: 'L5: 4 attacks. L11: 6 attacks. L20: 8 attacks.', rating: 'S+', note: 'Raw damage nova. Most common use.' },
  { use: 'Cast Two Spells', class: 'Eldritch Knight / Multiclass', effect: 'TWO leveled spells in one turn (bypasses BA spell rule).', rating: 'S+', note: 'BA spell rule only limits BA + Action. Two Actions = two leveled spells.' },
  { use: 'Attack + Grapple', class: 'Grapple Fighter', effect: 'Attack Action + Action Surge Grapple/Shove.', rating: 'A+', note: 'Hit them AND lock them down.' },
  { use: 'Attack + Dash', class: 'Any Fighter', effect: 'Full attacks then Dash out of range.', rating: 'A', note: 'Hit and run. No Disengage needed if you Dash far enough.' },
  { use: 'Multiclass: Spell + Attack', class: 'Fighter/Caster', effect: 'Hold Person then attack with advantage (paralyzed = auto-crit in 5ft).', rating: 'S+', note: 'Cast → Action Surge Attack → auto-crit. Devastating.' },
];

export const NOVA_ROUND_BUILDS = [
  {
    name: 'Fighter L20 Nova',
    attacks: '4 attacks × 2 (Action Surge) = 8 attacks',
    damage: '8 × (weapon + STR) = 8 × (1d8+5) = 76 avg with longsword',
    rating: 'S+',
    note: 'Pure martial nova. Battlemaster adds superiority dice.',
  },
  {
    name: 'Paladin 2 / Fighter 2 Smite Nova',
    attacks: '2 attacks + 2 Action Surge = 4 attacks, all smites',
    damage: '4 × (weapon + STR + 2d8 smite) = 4 × (1d8+5+9) = ~80 avg',
    rating: 'S+',
    note: 'Smite every attack. Burn all slots in one round.',
  },
  {
    name: 'EK Hold Person + Attack',
    method: 'Cast Hold Person → Action Surge Attack → auto-crit (paralyzed)',
    damage: 'Doubled weapon + doubled smite dice (if multiclass)',
    rating: 'S+',
    note: 'Two leveled spells legal with Action Surge (not BA spell).',
  },
  {
    name: 'Samurai Fighter Nova',
    method: 'Fighting Spirit (advantage) + Action Surge = all attacks with advantage',
    attacks: 'L11: 6 attacks with advantage',
    rating: 'S+',
    note: 'Elven Accuracy: triple advantage. 14.3% crit rate per attack.',
  },
  {
    name: 'Gloom Stalker / Fighter',
    method: 'Dread Ambusher extra attack + Action Surge = 3rd attack action',
    attacks: 'L5: 2+1 (Dread) + 2+1 (AS Dread again) = 6 attacks turn 1',
    rating: 'S+',
    note: 'Dread Ambusher triggers on each Attack action. Insane turn 1.',
  },
];

export const ACTION_SURGE_TIPS = [
  'Action Surge: extra ACTION, not extra attacks. You get a full Action.',
  'Two leveled spells in one turn: legal with Action Surge. BA rule doesn\'t apply.',
  'Multiclass: Fighter 2 is the best 2-level dip for any martial.',
  'Save Action Surge for the fight that matters. It\'s 1/SR.',
  'Battlemaster + Action Surge: use superiority dice on the extra attacks.',
  'Samurai + Action Surge + Elven Accuracy: 6 attacks with triple advantage.',
  'Gloom Stalker + Fighter: Dread Ambusher triggers on EACH Attack action.',
  'Paladin multiclass: smite on every Action Surge attack. Burn all slots.',
  'Don\'t waste Action Surge on easy fights. Save for bosses.',
  'Fighter 17: 2 Action Surges per short rest. Double nova.',
];
