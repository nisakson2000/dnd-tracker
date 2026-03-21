/**
 * playerEldritchBlastBuildsGuide.js
 * Player Mode: Eldritch Blast optimization — the Warlock's bread and butter
 * Pure JS — no React dependencies.
 */

export const ELDRITCH_BLAST_BASICS = {
  cantrip: 'Eldritch Blast',
  class: 'Warlock',
  range: '120ft',
  damage: '1d10 force per beam',
  beams: '1 at L1, 2 at L5, 3 at L11, 4 at L17',
  note: 'Best cantrip in the game. Multiple beams = multiple chances to hit, multiple Invocation triggers. Force damage (best type). 120ft range. THE reason to play Warlock.',
};

export const EB_INVOCATIONS = [
  { invocation: 'Agonizing Blast', level: 2, effect: 'Add CHA mod to each beam\'s damage.', note: 'Mandatory. +5 per beam = +20 at L17. Turns EB from good to incredible.', priority: 'S' },
  { invocation: 'Repelling Blast', level: 2, effect: 'Push target 10ft per beam.', note: '10ft per beam = 40ft push at L17. Forces movement through hazards. No save.', priority: 'S' },
  { invocation: 'Grasp of Hadar', level: 2, effect: 'Once per turn: pull target 10ft toward you.', note: 'Pull once per turn. Combo with Spike Growth or hazards. Only once though.', priority: 'A' },
  { invocation: 'Lance of Lethargy', level: 2, effect: 'Once per turn: reduce target speed by 10ft.', note: 'Slow enemies. Stack with Repelling Blast = enemy can never reach you.', priority: 'A' },
  { invocation: 'Eldritch Spear', level: 2, effect: 'EB range = 300ft.', note: 'Sniper build. 300ft is obscene. Most encounters are within 120ft though.', priority: 'C' },
];

export const EB_DAMAGE_BY_LEVEL = [
  { level: 1, beams: 1, noCHA: '1d10 (5.5)', withCHA5: '1d10+5 (10.5)', note: 'One beam. Agonizing makes it a heavy crossbow equivalent.' },
  { level: 5, beams: 2, noCHA: '2d10 (11)', withCHA5: '2d10+10 (21)', note: 'Two beams. 21 avg = better than most martial Extra Attack.' },
  { level: 11, beams: 3, noCHA: '3d10 (16.5)', withCHA5: '3d10+15 (31.5)', note: 'Three beams. 31.5 avg cantrip damage. Surpasses most weapon builds.' },
  { level: 17, beams: 4, noCHA: '4d10 (22)', withCHA5: '4d10+20 (42)', note: 'Four beams. 42 avg. Competitive with optimized martial DPR.' },
];

export const EB_COMBOS = [
  { combo: 'EB + Hex', detail: 'Hex adds 1d6 per hit. 4 beams = 4d6 extra (14 avg). Total: 4d10+4d6+20 = 56 avg at L17.', rating: 'S' },
  { combo: 'EB + Spike Growth', detail: 'Repelling Blast pushes through Spike Growth. 10ft push = 2d4 damage. 4 beams = 8d4 (20) + EB damage.', rating: 'S' },
  { combo: 'EB + Darkness/Devil\'s Sight', detail: 'You see in magical darkness. Enemies can\'t see you. Advantage on attacks, disadvantage on theirs.', rating: 'A' },
  { combo: 'EB + Sorlock (Quicken)', detail: 'Sorcerer 3/Warlock X. Quicken EB = 2 EBs per turn. 8 beams at L17 = 84 avg damage.', rating: 'S' },
  { combo: 'EB + Repelling + Lance', detail: 'Push 10ft + slow 10ft per turn. Melee enemies literally cannot reach you ever.', rating: 'A' },
];

export const EB_BUILD_ARCHETYPES = [
  { build: 'Control Blaster', invocations: ['Agonizing', 'Repelling', 'Lance of Lethargy'], note: 'Push + slow. Enemies never reach you. Incredible kiting.' },
  { build: 'Sniper', invocations: ['Agonizing', 'Eldritch Spear', 'Repelling'], note: '300ft range. Push from extreme range. Siege warfare.' },
  { build: 'Spike Growth Engine', invocations: ['Agonizing', 'Repelling', 'Grasp of Hadar'], note: 'Push through Spike Growth. Pull back in. Repeat. 20+ extra damage/turn.' },
  { build: 'Sorlock Nova', invocations: ['Agonizing', 'Repelling'], note: 'Quicken EB for 8 beams/turn. Short rest pact slots fund Sorcery Points.' },
];

export function ebDPR(level, chaMod, hasHex = false) {
  const beams = level >= 17 ? 4 : level >= 11 ? 3 : level >= 5 ? 2 : 1;
  const perBeam = 5.5 + chaMod + (hasHex ? 3.5 : 0);
  return { beams, perBeam: Math.round(perBeam * 10) / 10, total: Math.round(perBeam * beams * 10) / 10 };
}

export function spikeGrowthComboDamage(beamsHit, pushDistancePerBeam = 10) {
  const d4sPerBeam = pushDistancePerBeam / 5 * 2;
  return { extraDamage: `${d4sPerBeam * beamsHit}d4`, avg: d4sPerBeam * beamsHit * 2.5 };
}
