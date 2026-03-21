/**
 * playerFollowerManagement.js
 * Player Mode: Managing followers, hirelings, and sidekicks
 * Pure JS — no React dependencies.
 */

export const FOLLOWER_TYPES = [
  { type: 'Hireling', description: 'Paid NPC worker. Non-combatant usually.', cost: '2 sp/day (untrained), 2 gp/day (skilled)', loyalty: 'Payment-based. Stop paying = they leave.', combat: 'Rarely. Flee from danger unless paid extra.' },
  { type: 'Sidekick', description: 'Tasha\'s sidekick rules. Levels up with party.', cost: 'Free (loyalty-based)', loyalty: 'Personal bond. Earned through roleplay.', combat: 'Yes — uses simplified class (Expert/Warrior/Spellcaster).' },
  { type: 'Animal Companion', description: 'Beast Master Ranger feature. Levels with you.', cost: 'Free (class feature)', loyalty: 'Absolute — magically bonded.', combat: 'Yes — uses your bonus action to command.' },
  { type: 'Familiar', description: 'Find Familiar spell. Fey/celestial/fiend spirit.', cost: '10 gp (materials)', loyalty: 'Absolute — summoned servant.', combat: 'Can\'t attack (except Pact of Chain). Help action, deliver touch spells.' },
  { type: 'Summoned Creature', description: 'Conjure Animals, Summon spells, etc.', cost: 'Spell slot + concentration', loyalty: 'Duration-based. Follows commands.', combat: 'Yes — primary purpose.' },
  { type: 'Retainer', description: 'Noble background or earned through quests.', cost: 'Varies (housing, equipment, salary)', loyalty: 'Moderate. May have own agenda.', combat: 'Sometimes. DM-controlled in combat.' },
];

export const SIDEKICK_CLASSES = [
  { class: 'Warrior', hp: 'd8 + CON', role: 'Frontline fighter. Extra Attack at level 3.', bestFor: 'Tank or damage companion. Give them a shield.' },
  { class: 'Expert', hp: 'd8 + CON', role: 'Skills and utility. Expertise and Help action.', bestFor: 'Out-of-combat utility. Scout, face, skill monkey.' },
  { class: 'Spellcaster', hp: 'd6 + CON', role: 'Healing or damage caster. Limited spell list.', bestFor: 'Healing support if party lacks a healer.' },
];

export const FOLLOWER_TIPS = [
  'Keep follower turns SHORT. 10 seconds max. Don\'t let them slow combat.',
  'Let the DM control follower RP. You describe their combat actions.',
  'Followers should complement your weaknesses, not duplicate strengths.',
  'Don\'t use followers as meat shields — other players find it annoying.',
  'Name your followers. Give them personality. It makes the game better.',
  'Followers can carry extra equipment (within reason). Great for encumbrance.',
  'Followers can guard the camp, watch prisoners, or hold positions.',
  'If a follower dies, it should matter. Don\'t treat them as disposable.',
];

export const LOYALTY_SYSTEM = {
  starting: 10,
  max: 20,
  min: 0,
  modifiers: [
    { action: 'Pay bonus wages', modifier: +1 },
    { action: 'Save their life', modifier: +2 },
    { action: 'Share magic item', modifier: +2 },
    { action: 'Miss payment', modifier: -2 },
    { action: 'Use as bait/shield', modifier: -3 },
    { action: 'Insult or belittle', modifier: -1 },
    { action: 'Complete personal quest', modifier: +3 },
    { action: 'Nearly kill them through negligence', modifier: -4 },
  ],
  thresholds: [
    { loyalty: '16-20', behavior: 'Will risk their life for you. Advantage on morale checks.' },
    { loyalty: '11-15', behavior: 'Loyal and reliable. Normal behavior.' },
    { loyalty: '6-10', behavior: 'Grumbling. May refuse dangerous orders.' },
    { loyalty: '1-5', behavior: 'Looking for a way out. May betray at worst moment.' },
    { loyalty: '0', behavior: 'Leaves or betrays immediately.' },
  ],
};

export function createFollower(name, type, level) {
  return {
    name,
    type,
    level: level || 1,
    loyalty: LOYALTY_SYSTEM.starting,
    hp: 0,
    maxHp: 0,
    notes: '',
    equipment: [],
  };
}

export function adjustLoyalty(currentLoyalty, modifier) {
  return Math.max(LOYALTY_SYSTEM.min, Math.min(LOYALTY_SYSTEM.max, currentLoyalty + modifier));
}

export function getLoyaltyBehavior(loyalty) {
  const threshold = LOYALTY_SYSTEM.thresholds.find(t => {
    if (t.loyalty.includes('-')) {
      const [min, max] = t.loyalty.split('-').map(Number);
      return loyalty >= min && loyalty <= max;
    }
    return loyalty === parseInt(t.loyalty, 10);
  });
  return threshold ? threshold.behavior : 'Unknown';
}
