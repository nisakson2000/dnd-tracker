/**
 * playerEchoKnightGuide.js
 * Player Mode: Echo Knight Fighter subclass optimization
 * Pure JS — no React dependencies.
 */

export const ECHO_KNIGHT_BASICS = {
  class: 'Fighter (Echo Knight) — Explorer\'s Guide to Wildemount',
  keyFeature: 'Manifest Echo: Summon a translucent echo of yourself. AC 14 + prof, 1 HP, immune to all conditions.',
  echoRules: [
    'Appears within 15ft of you. Uses your bonus action to summon.',
    'Move it 30ft (free, no action). Must stay within 30ft or it\'s destroyed.',
    'You can make attacks FROM the echo\'s position (not your own).',
    'You can swap places with the echo (15ft teleport, costs 5ft movement).',
    'Costs nothing to resummon. Destroyed? Bonus action to bring it back.',
  ],
};

export const ECHO_FEATURES = [
  { feature: 'Unleash Incarnation', level: 3, uses: 'CON mod/long rest', effect: 'Extra attack from echo\'s position when you take Attack action.', note: 'Basically Action Surge lite, usable CON times per long rest.' },
  { feature: 'Echo Avatar', level: 7, uses: 'At will', effect: 'Transfer senses to echo. See/hear through it up to 1000ft. 10 min duration.', note: 'Ultimate scouting. Send echo through walls, around corners.' },
  { feature: 'Shadow Martyr', level: 10, uses: '1/short rest', effect: 'Teleport echo to take a hit for an ally within 30ft.', note: 'Echo has 1 HP so it\'s destroyed, but the ally takes 0 damage.' },
  { feature: 'Reclaim Potential', level: 15, uses: 'CON mod/long rest', effect: 'When echo is destroyed, gain 2d6+CON temp HP.', note: 'Incentivizes echo dying. Free temp HP.' },
  { feature: 'Legion of One', level: 18, uses: 'At will', effect: 'Two echoes simultaneously. Two extra positions for attacks.', note: 'Triple threat range. Absurd battlefield control.' },
];

export const ECHO_TACTICS = [
  { tactic: 'Reach extension', detail: 'Attack from echo\'s position. Effectively 30ft melee reach. Hit enemies behind walls/cover.' },
  { tactic: 'Opportunity attack zone', detail: 'Echo provides OA from its position. With Sentinel, you lock down a huge area.' },
  { tactic: 'Swap-strike', detail: 'Place echo behind enemy. Attack from echo (flanking if used). Swap places. Now behind enemy lines.' },
  { tactic: 'Tank without risk', detail: 'Stay 30ft back. Attack through echo. Enemies can\'t reach you without destroying echo first (1 HP, but free to resummon).' },
  { tactic: 'Scouting', detail: 'Echo Avatar at L7. Send echo 1000ft. See through it. Perfect reconnaissance.' },
  { tactic: 'Bodyguard', detail: 'Shadow Martyr at L10. Echo absorbs a hit meant for the squishy Wizard. 0 damage to ally.' },
  { tactic: 'PAM + Sentinel combo', detail: 'Echo has reach with PAM. Sentinel stops movement. Lock down 2 areas at once.' },
];

export const ECHO_MULTICLASS = [
  { combo: 'Echo Knight 11 / Rogue 3', benefit: 'Sneak Attack from echo position. Swashbuckler doesn\'t need ally for SA.', rating: 'A' },
  { combo: 'Echo Knight 5 / Barbarian X', benefit: 'Reckless Attack through echo. Advantage on attacks, but enemies can\'t retaliate.', rating: 'S' },
  { combo: 'Echo Knight 11 / War Wizard 2', benefit: 'Shield + Absorb Elements + Arcane Deflection. INT initiative.', rating: 'A' },
  { combo: 'Echo Knight 5 / Paladin 2', benefit: 'Smite through echo. Divine Smite at 30ft melee range.', rating: 'A' },
];

export function echoAC(profBonus) {
  return 14 + profBonus;
}

export function unleashUses(conMod) {
  return Math.max(1, conMod);
}

export function echoAttackRange(echoDistance, weaponReach) {
  return echoDistance + weaponReach; // effective melee range from your position
}
