/**
 * playerMagicInitiateFeatGuide.js
 * Player Mode: Magic Initiate feat — dip into another class's magic
 * Pure JS — no React dependencies.
 */

export const MAGIC_INITIATE_BASICS = {
  feat: 'Magic Initiate',
  source: "Player's Handbook",
  benefit: 'Learn 2 cantrips + 1 L1 spell from one class list. Cast L1 spell once per long rest (no slot).',
  note: 'The L1 spell uses the chosen class\'s spellcasting ability. Cantrips scale with character level, not class level.',
};

export const BEST_CLASS_PICKS = [
  {
    list: 'Cleric',
    cantrips: ['Guidance (+1d4 any ability check)', 'Spare the Dying (stabilize at range with Grave)'],
    spell: 'Bless (+1d4 attacks and saves, 3 targets) or Healing Word (BA ranged heal)',
    bestFor: 'Any non-Cleric. Guidance is the best cantrip in the game.',
    rating: 'S',
  },
  {
    list: 'Druid',
    cantrips: ['Shillelagh (WIS melee attacks)', 'Thorn Whip (pull + damage)'],
    spell: 'Goodberry (10 berries, 1 HP each, 24hr duration) or Absorb Elements',
    bestFor: 'Nature Clerics, melee WIS characters.',
    rating: 'A',
  },
  {
    list: 'Warlock',
    cantrips: ['Eldritch Blast (best damage cantrip)', 'Minor Illusion'],
    spell: 'Hex (1d6 extra damage per hit) or Armor of Agathys',
    bestFor: 'Non-Warlocks wanting ranged damage. Note: EB without invocations is weaker.',
    rating: 'B+',
  },
  {
    list: 'Wizard',
    cantrips: ['Booming Blade (melee + rider damage)', 'Find Familiar (via L1 spell)'],
    spell: 'Find Familiar (scout, Help, touch delivery) or Shield (+5 AC reaction)',
    bestFor: 'Melee characters wanting Booming Blade. Anyone wanting a familiar.',
    rating: 'S',
  },
  {
    list: 'Sorcerer',
    cantrips: ['Booming Blade', 'Green-Flame Blade'],
    spell: 'Shield or Absorb Elements',
    bestFor: 'Same as Wizard but uses CHA. Good for Paladins/Bards.',
    rating: 'A',
  },
];

export const CLASS_SYNERGY = [
  { class: 'Fighter/Barbarian', pick: 'Cleric (Guidance + Bless)', reason: 'Guidance for out-of-combat. Bless for party support. No magic otherwise.' },
  { class: 'Rogue', pick: 'Wizard (Booming Blade + Find Familiar)', reason: 'BB adds damage. Familiar gives free advantage (Help) = guaranteed Sneak Attack.' },
  { class: 'Paladin', pick: 'Druid (Shillelagh) or Cleric (Guidance)', reason: 'Shillelagh lets SAD WIS paladin builds. Guidance is always useful.' },
  { class: 'Ranger', pick: 'Druid (Goodberry) or Cleric (Guidance)', reason: 'Goodberry for emergency healing. Guidance covers skill gaps.' },
  { class: 'Monk', pick: 'Cleric (Guidance + Bless)', reason: 'Monks lack utility. Guidance + Bless cover biggest gaps.' },
];

export const MAGIC_INITIATE_TIPS = [
  'The L1 spell is once per LR without a slot. If you\'re a caster, you CAN also cast it with your own slots if it\'s on your class list.',
  'Cantrips scale with character level, not class level. Eldritch Blast still gets extra beams at 5/11/17.',
  'Find Familiar via Magic Initiate is permanent — you only need to recast if it dies.',
  'Guidance from Cleric list works even for non-WIS characters — it has no attack roll or save.',
  'Half-casters (Paladin/Ranger) can use this to get spells they otherwise never access.',
];
