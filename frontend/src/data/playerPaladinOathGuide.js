/**
 * playerPaladinOathGuide.js
 * Player Mode: Paladin Oath (subclass) comparison and optimization
 * Pure JS — no React dependencies.
 */

export const PALADIN_OATHS = [
  {
    oath: 'Oath of Vengeance',
    rating: 'S+',
    source: 'PHB',
    keyFeature: 'Vow of Enmity: advantage on all attacks vs one creature for 1 minute (BA, Channel Divinity).',
    spells: ['Bane (A)', 'Hunter\'s Mark (A)', 'Hold Person (S)', 'Misty Step (S)', 'Haste (S)', 'Banishment (S)'],
    strengths: ['Best single-target damage', 'Reliable advantage', 'Great spell list', 'Relentless Avenger (chase down targets)'],
    weaknesses: ['Less party support than other oaths', 'Focused on one target at a time'],
    playstyle: 'Hunter. Pick a target. Destroy it. Move to next.',
  },
  {
    oath: 'Oath of the Watchers',
    rating: 'S',
    source: 'TCE',
    keyFeature: 'Aura of the Sentinel: +PB to initiative for you and allies within 10ft.',
    spells: ['Alarm (B)', 'Detect Magic (A)', 'See Invisibility (A+)', 'Moonbeam (A)', 'Counterspell (S)', 'Banishment (S)'],
    strengths: ['Initiative boost is incredible', 'Anti-extraplanar focus', 'Counterspell access (rare for Paladin)'],
    weaknesses: ['Niche against non-extraplanar enemies', 'Some features are situational'],
    playstyle: 'Guardian against otherworldly threats. Great initiative support.',
  },
  {
    oath: 'Oath of Devotion',
    rating: 'A+',
    source: 'PHB',
    keyFeature: 'Sacred Weapon: +CHA to attack rolls for 1 minute. Holy Nimbus at L20.',
    spells: ['Protection from Evil and Good (A+)', 'Sanctuary (A)', 'Lesser Restoration (A)', 'Zone of Truth (B+)', 'Beacon of Hope (A)', 'Dispel Magic (A+)'],
    strengths: ['Sacred Weapon fixes accuracy', 'Aura of Devotion (charm immunity)', 'Classic paladin flavor'],
    weaknesses: ['Sacred Weapon uses action to activate', 'Spell list is defensive/utility focused'],
    playstyle: 'Classic holy knight. Protect allies. Smite evil.',
  },
  {
    oath: 'Oath of the Ancients',
    rating: 'S',
    source: 'PHB',
    keyFeature: 'Aura of Warding: resistance to ALL spell damage for you and allies within 10ft.',
    spells: ['Ensnaring Strike (B+)', 'Speak with Animals (B)', 'Misty Step (S)', 'Moonbeam (A)', 'Plant Growth (A)', 'Ice Storm (A)'],
    strengths: ['Spell damage resistance is insanely strong', 'Good nature/fey flavor', 'Turning the Faithless (turn fey/fiend)'],
    weaknesses: ['Less offensive focus', 'Some oath spells are weak'],
    playstyle: 'Nature paladin. Incredible aura makes party resistant to caster damage.',
  },
  {
    oath: 'Oath of Conquest',
    rating: 'S',
    source: 'XGE',
    keyFeature: 'Aura of Conquest: frightened enemies within 10ft have speed 0 and take psychic damage.',
    spells: ['Armor of Agathys (S)', 'Command (A+)', 'Hold Person (S)', 'Spiritual Weapon (S)', 'Fear (S)', 'Bestow Curse (A)'],
    strengths: ['Best control paladin', 'Armor of Agathys + heavy armor = amazing', 'Fear + Aura = permanent lockdown'],
    weaknesses: ['Relies on Frightened condition (many creatures immune)', 'Requires setup'],
    playstyle: 'Terrifying conqueror. Frighten and lock down enemies with your aura.',
  },
  {
    oath: 'Oath of Glory',
    rating: 'A',
    source: 'TCE',
    keyFeature: 'Peerless Athlete: bonus speed, carry weight, jump distance (BA, Channel Divinity).',
    spells: ['Guiding Bolt (A)', 'Heroism (A)', 'Enhance Ability (A)', 'Magic Weapon (B+)', 'Haste (S)', 'Protection from Energy (A)'],
    strengths: ['Haste on oath list', 'Good athletic/physical buffs', 'Inspiring Smite: temp HP to nearby allies when you smite'],
    weaknesses: ['Channel Divinity options are weak', 'Less impactful than other oaths'],
    playstyle: 'Athletic hero. Buff yourself and allies with physical prowess.',
  },
  {
    oath: 'Oath of Redemption',
    rating: 'A',
    source: 'XGE',
    keyFeature: 'Aura of the Guardian: take damage instead of an ally (within 10ft, reaction).',
    spells: ['Sanctuary (A)', 'Sleep (B early)', 'Calm Emotions (B+)', 'Hold Person (S)', 'Counterspell (S)', 'Hypnotic Pattern (S+)'],
    strengths: ['Incredible spell list (Counterspell, Hypnotic Pattern)', 'Protect allies by absorbing damage', 'Pacifist paladin is unique'],
    weaknesses: ['You take a LOT of damage as the guardian', 'Pacifist theme conflicts with smiting'],
    playstyle: 'Selfless protector. Absorb damage for allies. Talk before fighting.',
  },
  {
    oath: 'Oathbreaker',
    rating: 'A+',
    source: 'DMG',
    keyFeature: 'Aura of Hate: +CHA to melee damage for you, allies, AND undead/fiends within 10ft.',
    spells: ['Hellish Rebuke (A)', 'Inflict Wounds (A)', 'Darkness (A)', 'Crown of Madness (C)', 'Animate Dead (A)', 'Bestow Curse (A)'],
    strengths: ['Aura of Hate is massive DPR boost', 'Undead army benefits from your aura', 'Best evil paladin option'],
    weaknesses: ['DM permission required (DMG option)', 'Aura buffs enemy fiends/undead too', 'Evil theme limits some campaigns'],
    playstyle: 'Dark knight. Raise undead. Buff their damage with your aura.',
  },
  {
    oath: 'Oath of the Crown',
    rating: 'B+',
    source: 'SCAG',
    keyFeature: 'Champion Challenge: force creatures within 30ft to stay near you (Channel Divinity).',
    spells: ['Command (A+)', 'Compelled Duel (B)', 'Warding Bond (A)', 'Zone of Truth (B+)', 'Spirit Guardians (S+)', 'Banishment (S)'],
    strengths: ['Spirit Guardians on paladin is amazing', 'Good tanking/control', 'Thematic for lawful characters'],
    weaknesses: ['Champion Challenge requires WIS save', 'Turn the Tide healing is weak', 'Overshadowed by other oaths'],
    playstyle: 'Knight of the crown. Tank, control, and protect with duty.',
  },
];

export const PALADIN_GENERAL_TIPS = [
  'Divine Smite: 2d8 radiant (1st slot) + 1d8 per higher slot level. Max 5d8 (or 6d8 vs undead/fiends).',
  'Smite on CRITS. Double all the smite dice. This is why Paladin burst damage is insane.',
  'Aura of Protection (L6): +CHA to all saves within 10ft. Best feature in 5e. Get CHA to 20.',
  'Lay on Hands: 5×level HP pool. Use 1 HP at a time to pick up downed allies. More efficient than healing spells.',
  'Paladins are the best 2-level dip: Fighting Style + Divine Smite + spellcasting + CHA saves.',
  'Blessed Warrior fighting style: get cantrips. Toll the Dead + Guidance is a great pickup.',
  'Find Steed (L2 spell): permanent mount that acts independently. Cast self-target spells on both of you.',
];

export const PALADIN_SMITE_EFFICIENCY = [
  { slot: '1st level', dice: '2d8 (avg 9)', perSlot: '9 damage per slot', note: 'Most efficient. Use for regular hits.' },
  { slot: '2nd level', dice: '3d8 (avg 13.5)', perSlot: '6.75 per slot level', note: 'Good value. Standard smite.' },
  { slot: '3rd level', dice: '4d8 (avg 18)', perSlot: '6 per slot level', note: 'Decent. Save for crits.' },
  { slot: '4th level', dice: '5d8 (avg 22.5)', perSlot: '5.625 per slot level', note: 'Max dice. Only on crits.' },
  { slot: '5th level', dice: '5d8 (avg 22.5)', perSlot: '4.5 per slot level', note: 'Same damage as 4th. Don\'t waste 5th level slots on smite.' },
];
