/**
 * playerClassTierList.js
 * Player Mode: Class power tiers by level range and role
 * Pure JS — no React dependencies.
 */

export const CLASS_POWER_SPIKES = [
  { class: 'Barbarian', spikes: [
    { level: 1, feature: 'Rage', impact: 'Resistance to B/P/S damage. Core class identity.' },
    { level: 5, feature: 'Extra Attack + Fast Movement', impact: 'Major damage and mobility jump.' },
    { level: 11, feature: 'Relentless Rage', impact: 'Can\'t go down easily. Keep fighting at 0 HP.' },
    { level: 20, feature: 'Primal Champion', impact: '+4 STR and CON. Maximum barbarian.' },
  ]},
  { class: 'Bard', spikes: [
    { level: 3, feature: 'Expertise + Subclass', impact: 'Double proficiency in 2 skills. College features.' },
    { level: 5, feature: 'Short Rest Inspiration', impact: 'Bardic Inspiration recharges on short rest. Huge resource gain.' },
    { level: 10, feature: 'Magical Secrets', impact: 'Steal 2 spells from ANY class list. Game-changing.' },
  ]},
  { class: 'Cleric', spikes: [
    { level: 1, feature: 'Domain Features', impact: 'Heavy armor, martial weapons, or bonus cantrips depending on domain.' },
    { level: 5, feature: 'Spirit Guardians + Spiritual Weapon', impact: 'Best sustained damage combo for Clerics.' },
    { level: 17, feature: '9th Level Spells', impact: 'Mass Heal, True Resurrection, Gate.' },
  ]},
  { class: 'Druid', spikes: [
    { level: 2, feature: 'Wild Shape', impact: 'Transform into beasts. Moon Druid: combat forms.' },
    { level: 5, feature: 'Conjure Animals', impact: '8 wolves = 16 attacks per round.' },
    { level: 20, feature: 'Archdruid', impact: 'Unlimited Wild Shape. Never run out of forms.' },
  ]},
  { class: 'Fighter', spikes: [
    { level: 2, feature: 'Action Surge', impact: 'Extra full action. 4 attacks at level 5. Devastating.' },
    { level: 5, feature: 'Extra Attack', impact: '2 attacks per action. Core martial power.' },
    { level: 11, feature: 'Extra Attack (3)', impact: '3 attacks per action. Consistent DPR king.' },
    { level: 20, feature: 'Extra Attack (4)', impact: '4 attacks per action. 8 with Action Surge.' },
  ]},
  { class: 'Monk', spikes: [
    { level: 5, feature: 'Stunning Strike + Extra Attack', impact: 'Stun = auto-crit for party, skip enemy turn.' },
    { level: 14, feature: 'Diamond Soul', impact: 'Proficiency in all saves. Can reroll with ki.' },
  ]},
  { class: 'Paladin', spikes: [
    { level: 2, feature: 'Divine Smite', impact: 'Decide to smite AFTER hitting. Crit-fishing is incredible.' },
    { level: 6, feature: 'Aura of Protection', impact: '+CHA to all saves for nearby allies. Best aura in the game.' },
    { level: 13, feature: 'Improved Aura (30ft)', impact: '30ft range on aura. Protects entire party.' },
  ]},
  { class: 'Ranger', spikes: [
    { level: 5, feature: 'Extra Attack + 2nd Level Spells', impact: 'Pass without Trace, Spike Growth.' },
    { level: 9, feature: '3rd Level Spells', impact: 'Conjure Animals. Huge power spike.' },
  ]},
  { class: 'Rogue', spikes: [
    { level: 1, feature: 'Sneak Attack + Expertise', impact: 'Extra d6s on attacks. Double proficiency.' },
    { level: 5, feature: 'Uncanny Dodge', impact: 'Halve attack damage with reaction. Incredible survivability.' },
    { level: 11, feature: 'Reliable Talent', impact: 'Can\'t roll below 10 on proficient checks. Guaranteed success.' },
  ]},
  { class: 'Sorcerer', spikes: [
    { level: 3, feature: 'Metamagic', impact: 'Twin Spell, Quickened Spell. Define the Sorcerer.' },
    { level: 5, feature: 'Fireball/Counterspell', impact: '3rd level spells are a huge power jump.' },
  ]},
  { class: 'Warlock', spikes: [
    { level: 2, feature: 'Eldritch Invocations', impact: 'Agonizing Blast makes EB the best cantrip. Permanent abilities.' },
    { level: 5, feature: '3rd Level Pact Slots', impact: 'Short rest recharge on 3rd level slots.' },
    { level: 9, feature: 'Mystic Arcanum', impact: 'Access to higher level spells without slot limits.' },
  ]},
  { class: 'Wizard', spikes: [
    { level: 5, feature: 'Fireball/Counterspell', impact: 'Access to the most powerful spell list in the game.' },
    { level: 9, feature: 'Wall of Force', impact: 'No save, impenetrable wall. Encounter-ending.' },
    { level: 17, feature: 'Wish', impact: 'Most powerful spell in the game.' },
  ]},
];

export function getClassSpikes(className) {
  const entry = CLASS_POWER_SPIKES.find(c => c.class.toLowerCase() === (className || '').toLowerCase());
  return entry ? entry.spikes : [];
}

export function getNextSpike(className, currentLevel) {
  const spikes = getClassSpikes(className);
  return spikes.find(s => s.level > currentLevel) || null;
}
