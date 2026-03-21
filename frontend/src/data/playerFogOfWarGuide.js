/**
 * playerFogOfWarGuide.js
 * Player Mode: Fog Cloud, obscurement, and vision-blocking spell tactics
 * Pure JS — no React dependencies.
 */

export const OBSCUREMENT_RULES = {
  lightlyObscured: {
    effect: 'Disadvantage on Perception checks that rely on sight.',
    sources: ['Dim light', 'Patchy fog', 'Moderate foliage'],
    note: 'Creatures in lightly obscured areas can still be seen and targeted normally. Only Perception is affected.',
  },
  heavilyObscured: {
    effect: 'Effectively blinded. Can\'t see in or out. Attacks have disadvantage against hidden creatures. Attacks from within have advantage.',
    sources: ['Darkness', 'Opaque fog', 'Dense foliage', 'Fog Cloud spell', 'Darkness spell'],
    note: 'Being in heavily obscured area = blinded. But so are enemies looking into it.',
  },
};

export const FOG_CLOUD_TACTICS = {
  spell: 'Fog Cloud (L1)',
  effect: '20ft radius sphere of fog. Heavily obscures. Concentration.',
  scaling: 'Upcast: +20ft radius per level. L3: 60ft radius.',
  tactics: [
    { tactic: 'Break enemy concentration', detail: 'Fog Cloud on an enemy caster. They can\'t see targets = can\'t maintain many concentration spells. Force DC checks.', rating: 'A' },
    { tactic: 'Block line of sight', detail: 'Place Fog Cloud between your party and enemy ranged attackers. They can\'t target what they can\'t see.', rating: 'A' },
    { tactic: 'Counter advantage', detail: 'If enemies have advantage (flanking, faerie fire): Fog Cloud equalizes. Both sides are effectively blind = straight rolls.', rating: 'A' },
    { tactic: 'Escape cover', detail: 'Drop Fog Cloud on yourself. Run through it. Enemies can\'t see you leave. Free escape.', rating: 'A' },
    { tactic: 'Anti-Counterspell', detail: 'Cast from within Fog Cloud. Enemy casters can\'t see you casting = can\'t Counterspell (requires sight).', rating: 'S' },
    { tactic: 'Blindsight abuse', detail: 'If you have Blindsight (Blind Fighting style, familiar senses): you can see, enemies can\'t. Advantage/disadvantage.', rating: 'S' },
  ],
};

export const VISION_BLOCKING_SPELLS = [
  { spell: 'Fog Cloud', level: 1, area: '20ft radius', type: 'Heavily obscured', concentration: true, note: 'Cheapest vision blocker. Upscales well. No damage.' },
  { spell: 'Darkness', level: 2, area: '15ft radius', type: 'Magical darkness', concentration: true, note: 'Darkvision can\'t penetrate. Only Devil\'s Sight / True Seeing works. Stronger than Fog Cloud.' },
  { spell: 'Sleet Storm', level: 3, area: '40ft radius', type: 'Heavily obscured + difficult terrain + concentration checks', concentration: true, note: 'The best vision-blocking combat spell. Obscures + difficult terrain + forces concentration saves. Devastating.' },
  { spell: 'Wall of Fire', level: 4, area: '60ft long or 20ft ring', type: 'Opaque (one side)', concentration: true, note: 'Blocks vision through it. Plus 5d8 fire damage. Combines LOS blocking with damage.' },
  { spell: 'Sickening Radiance', level: 4, area: '30ft radius', type: 'Heavily obscured + exhaustion + damage', concentration: true, note: 'Dim light heavily obscures. 4d10 radiant + exhaustion per turn. Incredibly deadly.' },
  { spell: 'Stinking Cloud', level: 3, area: '20ft radius', type: 'Heavily obscured + CON save or lose action', concentration: true, note: 'Fog + nausea. Creatures in it waste their action on failed save.' },
];

export const SPELLS_REQUIRING_SIGHT = {
  affected: [
    'Counterspell (must see the caster)',
    'Most targeted spells (must see the target)',
    'Eldritch Blast (must see the target)',
    'Hold Person/Monster (creature you can see)',
    'Banishment (creature you can see)',
    'Polymorph (creature you can see)',
  ],
  notAffected: [
    'AoE spells targeting areas (Fireball, Shatter — target a point, not a creature)',
    'Sacred Flame (target gains no benefit from cover, but RAW still needs to see)',
    'Spells targeting self (Shield, Misty Step)',
    'Blindsight / Tremorsense / Truesight bypasses vision requirements',
  ],
  note: 'Most spells say "a creature you can see" or "a point you can see." If you can\'t see: you can\'t target.',
};

export function fogCloudRadius(spellLevel) {
  return 20 * spellLevel; // 20ft per level
}

export function heavilyObscuredCombat() {
  return {
    attackFromWithin: 'Advantage (unseen attacker)',
    attackInto: 'Disadvantage (can\'t see target)',
    bothBlinded: 'Advantage and disadvantage cancel = straight roll',
    note: 'If both attacker and target are in the fog: advantage + disadvantage = straight roll.',
  };
}
