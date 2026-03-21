/**
 * playerSentinelPAMComboGuide.js
 * Player Mode: Sentinel + PAM combo — the lockdown build
 * Pure JS — no React dependencies.
 */

export const SENTINEL_BASICS = {
  feat: 'Sentinel',
  source: "Player's Handbook",
  benefits: [
    'When you hit a creature with an OA, its speed becomes 0 for the rest of the turn.',
    'Creatures provoke OA from you even if they Disengage.',
    'When a creature within 5ft attacks someone other than you, use reaction to melee attack that creature.',
  ],
  note: 'The ultimate tank feat. Enemies can\'t leave your reach and get punished for attacking allies.',
};

export const PAM_BASICS = {
  feat: 'Polearm Master',
  source: "Player's Handbook",
  benefits: [
    'When you take the Attack action with a glaive, halberd, quarterstaff, or spear, make a BA attack with the butt end (1d4 + STR).',
    'When a creature ENTERS your reach, you can make an OA against them.',
  ],
  weapons: ['Glaive (1d10, reach)', 'Halberd (1d10, reach)', 'Quarterstaff (1d6/1d8)', 'Spear (1d6/1d8)'],
  note: 'Extra BA attack + entry OA. Excellent action economy feat for melee fighters.',
};

export const PAM_SENTINEL_COMBO = {
  howItWorks: [
    'PAM: creatures entering your 10ft reach provoke OA.',
    'Sentinel: OA hit reduces their speed to 0.',
    'Result: enemies are stopped 10ft away from you. They can\'t reach melee range.',
    'They can\'t Disengage past you (Sentinel ignores Disengage for OA).',
    'If they somehow get to 5ft and attack an ally, Sentinel lets you attack them as reaction.',
  ],
  note: 'This combo creates a 10ft "kill zone" around you. Enemies enter, get stuck, and die.',
};

export const PAM_SENTINEL_CLASS_VALUE = [
  { class: 'Fighter', rating: 'S', reason: 'Multiple ASIs for both feats early. Extra Attack maximizes PAM BA attack value. Champion/Battle Master both benefit.' },
  { class: 'Paladin', rating: 'S', reason: 'OA hit + Divine Smite. PAM BA attack + Smite. More attacks = more smite opportunities.' },
  { class: 'Barbarian', rating: 'A', reason: 'Rage damage on every hit including OA and BA attack. Reckless Attack on PAM OA for advantage.' },
  { class: 'Cleric', rating: 'B', reason: 'War Cleric or melee Cleric can use this but Spirit Guardians + dodge is often better.' },
  { class: 'Ranger', rating: 'B', reason: 'Hunter\'s Mark on OA hits. But Rangers are often better at range.' },
  { class: 'Rogue', rating: 'C', reason: 'Can only Sneak Attack once per turn. Extra attacks don\'t help Rogues as much.' },
];

export const BUILD_PROGRESSION = {
  variant: [
    { path: 'PAM first (L4) → Sentinel (L8)', note: 'PAM adds immediate DPR (BA attack). Sentinel adds lockdown later.' },
    { path: 'Sentinel first (L4) → PAM (L8)', note: 'Sentinel adds control earlier. PAM adds the entry OA combo later.' },
    { path: 'STR 20 first (L4) → PAM (L6/8) → Sentinel (L8/12)', note: 'For classes that need high STR. Max damage first.' },
  ],
  recommendation: 'PAM first if you want damage. Sentinel first if you want to protect allies. STR first if you start with 16 STR.',
};

export const PAM_SENTINEL_TACTICS = [
  { tactic: 'Chokepoint defense', detail: 'Stand in a doorway/corridor. Nothing gets past you. PAM OA stops them at 10ft.', rating: 'S' },
  { tactic: 'Protect the caster', detail: 'Stand near your Wizard. Sentinel: enemies attacking the Wizard get punished. PAM: enemies approaching get stopped.', rating: 'S' },
  { tactic: 'GWM + PAM OA', detail: 'PAM OA triggers Great Weapon Master -5/+10. If it hits (and it often does with advantage), massive damage + speed 0.', rating: 'S' },
  { tactic: 'Reckless PAM OA', detail: 'Barbarian: Reckless Attack gives advantage on all melee. PAM OA with advantage = almost guaranteed hit.', rating: 'A' },
];

export const PAM_GWM_VS_PAM_SENTINEL = {
  pamGwm: { focus: 'Damage', DPR: 'Higher. +10 per hit on every attack including BA.', control: 'None.' },
  pamSentinel: { focus: 'Control + damage', DPR: 'Lower (no +10).', control: 'Complete lockdown. Enemies can\'t move.' },
  pamGwmSentinel: { focus: 'Both', note: 'All three feats = god tier. Needs 3 ASIs (Fighter ideal). STR may lag.' },
  verdict: 'GWM for pure damage. Sentinel for tanking. Both if you can afford 3 feats (Fighters with 7 ASIs).',
};

export function pamOADamage(strMod, weaponDie, hasGWM) {
  const gwm = hasGWM ? 10 : 0;
  const damage = weaponDie / 2 + 0.5 + strMod + gwm;
  return { damage: Math.round(damage), note: `PAM OA: ${Math.round(damage)} avg damage${hasGWM ? ' (with GWM)' : ''}. Speed → 0 on hit (Sentinel).` };
}
