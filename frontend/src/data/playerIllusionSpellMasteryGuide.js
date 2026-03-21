/**
 * playerIllusionSpellMasteryGuide.js
 * Player Mode: Illusion spells — best uses, rulings, and creative applications
 * Pure JS — no React dependencies.
 */

export const ILLUSION_SPELL_TIER_LIST = [
  { spell: 'Minor Illusion', level: 0, rating: 'S', note: 'Free. 5ft cube image or sound. Hide behind it, distract, create fake cover. Best utility cantrip.' },
  { spell: 'Silent Image', level: 1, rating: 'A', note: '15ft cube visual illusion. Move it as action. No sound, no physical interaction.' },
  { spell: 'Disguise Self', level: 1, rating: 'A+', note: 'Change appearance for 1 hour. Infiltration, deception, social encounters.' },
  { spell: 'Phantasmal Force', level: 2, rating: 'S', note: 'Target believes illusion is REAL. Takes 1d6 psychic/round. INT save. Target rationalizes it.' },
  { spell: 'Invisibility', level: 2, rating: 'S', note: 'Invisible until you attack/cast. Best scouting/escape. Upcast for multiple targets.' },
  { spell: 'Mirror Image', level: 2, rating: 'S', note: '3 duplicates. No concentration. Attacks hit duplicates first. Incredible defense.' },
  { spell: 'Major Image', level: 3, rating: 'A+', note: '20ft cube with sound, smell, temperature. Move as action. Very convincing.' },
  { spell: 'Hypnotic Pattern', level: 3, rating: 'S+', note: 'Not technically illusion school but: incapacitate all creatures in 30ft cube. Best L3 control.' },
  { spell: 'Greater Invisibility', level: 4, rating: 'S', note: 'Invisible even while attacking/casting. Advantage on attacks, disadvantage against you.' },
  { spell: 'Hallucinatory Terrain', level: 4, rating: 'B+', note: 'Disguise terrain in 150ft cube. 24 hour duration. Ambushes, hiding camps.' },
  { spell: 'Phantasmal Killer', level: 4, rating: 'B', note: 'Frightened + 4d10 psychic each turn. Two saves to avoid. Inconsistent.' },
  { spell: 'Creation', level: 5, rating: 'A', note: 'Create nonmagical object (larger with higher slots). Temporary but no concentration.' },
  { spell: 'Mislead', level: 5, rating: 'A', note: 'Invisible + illusory double you control. Perfect for decoy tactics.' },
  { spell: 'Programmed Illusion', level: 6, rating: 'B+', note: 'Set trigger for illusion. Lasts until dispelled. Great for traps and warnings.' },
  { spell: 'Project Image', level: 7, rating: 'A', note: 'Create copy of yourself anywhere within 500 miles. Cast spells through it.' },
  { spell: 'Mirage Arcane', level: 7, rating: 'S', note: 'Transform terrain in 1-mile square. Tactile. Creatures can walk on illusory bridges. Incredibly powerful.' },
  { spell: 'Simulacrum', level: 7, rating: 'S+', note: 'Create duplicate with half HP and all abilities. Not strictly illusion but related.' },
];

export const ILLUSION_RULES = {
  investigation: 'A creature that suspects an illusion can use its action to make an Investigation check against your spell DC.',
  physical: 'Most illusions have no physical substance. Touching reveals nothing is there (may grant auto-success on Investigation).',
  believability: 'An illusion that\'s completely implausible may be disbelieved without a check (DM discretion).',
  phantasmalForce: 'Special: target rationalizes the illusion. They believe it\'s real even if it seems unlikely. Only INT saves, not Investigation.',
  note: 'Illusion effectiveness is HEAVILY DM-dependent. Discuss expectations with your DM.',
};

export const CREATIVE_ILLUSION_USES = [
  { use: 'Minor Illusion cover', detail: 'Create a 5ft rock/crate. Hide behind it. Enemies must investigate to know it\'s fake.', rating: 'S' },
  { use: 'Silent Image distraction', detail: 'Create guards running away, a monster approaching, or treasure to lure enemies.', rating: 'A+' },
  { use: 'Phantasmal Force cage', detail: 'Target believes they\'re in a cage. They won\'t try to leave. 1d6 psychic if they touch the "bars".', rating: 'S' },
  { use: 'Major Image monster', detail: 'Create a scary monster to frighten enemies or NPCs. With sound and smell for realism.', rating: 'A+' },
  { use: 'Disguise Self authority', detail: 'Appear as a guard, noble, or specific person. Bluff your way past security.', rating: 'A+' },
  { use: 'Minor Illusion sound', detail: 'Create sounds: screams, footsteps, monster roars. Lure enemies away or cause panic.', rating: 'A' },
  { use: 'Hallucinatory Terrain ambush', detail: 'Make an open field look like dense forest. Enemies walk into your prepared ambush.', rating: 'A' },
  { use: 'Mirage Arcane bridge', detail: 'Create a tactile bridge over a chasm. It\'s real enough to walk on. Transform entire battlefields.', rating: 'S' },
];

export const ILLUSION_TIPS = [
  'Always have Minor Illusion. It\'s the best creative cantrip in the game.',
  'Illusions work best when enemies have no reason to suspect them.',
  'Pair illusions with real effects. A fake Fireball after a real one makes enemies dodge.',
  'Phantasmal Force is Intelligence save — very rare for monsters to be good at INT saves.',
  'Illusion Wizard\'s Malleable Illusions lets you change illusions after casting. Incredibly versatile.',
  'Illusory Reality (Illusion Wizard L14) makes one element of an illusion REAL. Illusory wall becomes a real wall.',
  'Don\'t overuse illusions on the same enemies. Once fooled, they\'ll investigate everything.',
];
