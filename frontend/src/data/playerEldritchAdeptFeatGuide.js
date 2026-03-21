/**
 * playerEldritchAdeptFeatGuide.js
 * Player Mode: Eldritch Adept feat — Warlock invocations for everyone
 * Pure JS — no React dependencies.
 */

export const ELDRITCH_ADEPT_BASICS = {
  feat: 'Eldritch Adept',
  source: "Tasha's Cauldron of Everything",
  prerequisite: 'Spellcasting or Pact Magic feature (for invocations with prerequisites, must meet them)',
  benefit: 'Learn one Eldritch Invocation. Can swap it on level up.',
  note: 'Most powerful invocations require Warlock levels/pact boon. Non-Warlocks have a limited but still excellent selection.',
};

export const INVOCATIONS_FOR_NON_WARLOCKS = [
  {
    name: 'Devil\'s Sight',
    prerequisite: 'None',
    effect: 'See normally in darkness (including magical darkness) out to 120ft.',
    rating: 'S',
    reason: 'Pairs with Darkness spell for the Darkness + Devil\'s Sight combo. Even without the combo, 120ft perfect darkvision is incredible.',
  },
  {
    name: 'Eldritch Mind',
    prerequisite: 'None',
    effect: 'Advantage on concentration saves.',
    rating: 'A',
    reason: 'Like War Caster but only the concentration part. No feat prerequisite issues. Great for concentration casters.',
  },
  {
    name: 'Armor of Shadows',
    prerequisite: 'None',
    effect: 'Cast Mage Armor on self at will, without a spell slot.',
    rating: 'A',
    reason: 'Infinite Mage Armor. 13+DEX AC forever. Great for lightly armored casters.',
  },
  {
    name: 'Fiendish Vigor',
    prerequisite: 'None',
    effect: 'Cast False Life on self at will, without a spell slot.',
    rating: 'B',
    reason: '1d4+4 temp HP at will. Recast between fights. Average 6.5 temp HP buffer always.',
  },
  {
    name: 'Beast Speech',
    prerequisite: 'None',
    effect: 'Cast Speak with Animals at will, without a spell slot.',
    rating: 'B',
    reason: 'Infinite animal conversations. Fun but situational. Druids/Rangers may already have this.',
  },
  {
    name: 'Mask of Many Faces',
    prerequisite: 'None',
    effect: 'Cast Disguise Self at will, without a spell slot.',
    rating: 'A',
    reason: 'Infinite disguises. Amazing for social encounters, infiltration, and creative problem-solving.',
  },
  {
    name: 'Misty Visions',
    prerequisite: 'None',
    effect: 'Cast Silent Image at will, without a spell slot.',
    rating: 'A',
    reason: 'Infinite illusions. Create walls, creatures, terrain. Only limited by creativity.',
  },
  {
    name: 'Eyes of the Rune Keeper',
    prerequisite: 'None',
    effect: 'Read all writing (any language).',
    rating: 'B',
    reason: 'Never need Comprehend Languages for written text. Great for dungeon exploration.',
  },
];

export const INVOCATIONS_WARLOCK_ONLY = [
  { name: 'Agonizing Blast', requires: 'Eldritch Blast cantrip', note: 'Add CHA to EB damage. Cannot take via Eldritch Adept (need EB).' },
  { name: 'Repelling Blast', requires: 'Eldritch Blast cantrip', note: 'Push 10ft per beam. Cannot take via Eldritch Adept.' },
  { name: 'Thirsting Blade', requires: 'Pact of the Blade', note: 'Extra Attack. Requires Pact Boon.' },
  { name: 'Book of Ancient Secrets', requires: 'Pact of the Tome', note: 'Ritual casting. Requires Pact Boon.' },
  { name: 'Investment of the Chain Master', requires: 'Pact of the Chain', note: 'Enhanced familiar. Requires Pact Boon.' },
];

export const CLASS_RECOMMENDATIONS = [
  { class: 'Wizard', pick: 'Devil\'s Sight or Eldritch Mind', reason: 'DS for Darkness combo. EM for concentration protection.' },
  { class: 'Sorcerer', pick: 'Devil\'s Sight or Mask of Many Faces', reason: 'DS + Darkness combo. MoMF for social sorcery.' },
  { class: 'Cleric', pick: 'Eldritch Mind or Devil\'s Sight', reason: 'Concentration protection for SG/Bless. Or DS for dark dungeons.' },
  { class: 'Druid', pick: 'Eldritch Mind or Armor of Shadows', reason: 'Concentration for Conjure Animals. Armor for non-metal AC.' },
  { class: 'Bard', pick: 'Mask of Many Faces or Devil\'s Sight', reason: 'Infinite disguises for Bard shenanigans. Or DS combo.' },
];
