/**
 * playerSummonerBuildGuide.js
 * Player Mode: Summoner builds — best classes, spells, and army management
 * Pure JS — no React dependencies.
 */

export const SUMMONER_CLASSES_RANKED = [
  { class: 'Shepherd Druid', rating: 'S+', keyFeature: 'Bear Spirit Totem: summons get +5+druid level temp HP. Unicorn: AoE healing when you heal.', note: 'Best summoner. Your Conjure Animals wolves have 16+ temp HP each. Insanely tanky summons.' },
  { class: 'Necromancy Wizard', rating: 'S', keyFeature: 'Undead Thralls: Animate Dead creates +PB HP, +PB damage undead. No concentration army.', note: 'No concentration! Army persists 24 hours. Recast to maintain. Build it up over days.' },
  { class: 'Conjuration Wizard', rating: 'A+', keyFeature: 'Focused Conjuration: can\'t lose concentration on conjuration spells from damage.', note: 'Guaranteed concentration on summons. Very reliable.' },
  { class: 'Wildfire Druid', rating: 'A', keyFeature: 'Wildfire Spirit: built-in companion. Teleports allies. Enhances summons.', note: 'Companion + summons. Great action economy.' },
  { class: 'Bard (Magical Secrets)', rating: 'A', keyFeature: 'Steal Conjure Animals or Find Greater Steed via Magical Secrets.', note: 'Access to any summon spell. Flexible summoner.' },
  { class: 'Warlock (Chain)', rating: 'A', keyFeature: 'Improved familiar (imp/quasit). Investment of the Chain Master (Tasha\'s).', note: 'Best single companion. Imp is invisible scout + BA attack via Investment.' },
];

export const SUMMONER_SPELL_PRIORITY = [
  { spell: 'Conjure Animals (L3)', priority: 'S+', note: '8 wolves = 8 Pack Tactics attacks. Best summon. DM chooses RAW.' },
  { spell: 'Animate Objects (L5)', priority: 'S', note: '10 tiny coins = 10 attacks at +8 for 1d4+4. ~47 DPR. Incredible.' },
  { spell: 'Animate Dead (L3)', priority: 'S', note: 'No concentration. Build army over time. Recast daily to maintain.' },
  { spell: 'Summon Fey/Beast/Undead (Tasha\'s)', priority: 'A+', note: 'Reliable. YOU choose the form. Scales with slot level.' },
  { spell: 'Conjure Woodland Beings (L4)', priority: 'S+ (Pixies)', note: '8 Pixies = 8 Polymorphs. Game-breaking if DM allows.' },
  { spell: 'Find Greater Steed (L4)', priority: 'S', note: 'Permanent flying mount. Shares self-target spells. Paladin only.' },
  { spell: 'Find Familiar (L1)', priority: 'S', note: 'Not combat — utility. Help action, scouting, spell delivery.' },
  { spell: 'Summon Celestial (L5)', priority: 'A+', note: 'Defender heals, Avenger damages. Both fly. Reliable.' },
  { spell: 'Finger of Death (L7)', priority: 'A', note: 'Kills create PERMANENT zombies. No maintenance needed.' },
];

export const SUMMONER_TIPS = [
  'Pre-roll summon attacks. Roll 8d20 at once, mark hits, resolve damage. Be fast.',
  'Know your summon stat blocks before combat. Don\'t look them up mid-fight.',
  'Give summons simple standing orders: "Attack nearest enemy" or "Guard the Wizard."',
  'Tasha\'s summons are more table-friendly than old Conjure spells (fewer creatures).',
  'Shepherd Druid + Conjure Animals = each wolf has ~20+ HP with Bear Spirit. Unkillable.',
  'Animate Dead army: equip skeletons with shortbows for ranged volleys.',
  'Be considerate of table time. 8 summons = 8 attack rolls. Be efficient or use average damage.',
  'Protection from Evil and Good: immune to being charmed/frightened by summons that turn on you.',
];
