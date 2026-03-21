/**
 * Advanced Combat Rules — Reference data for special combat situations.
 * Used by the Quick Reference panel and combat AI.
 */

export const MOUNTED_COMBAT = {
  label: 'Mounted Combat',
  rules: [
    { title: 'Mounting/Dismounting', description: 'Costs half your movement speed. If mount is moved against its will, DC 10 DEX save or be dismounted (prone).' },
    { title: 'Controlled Mount', description: 'Mount acts on your initiative. Can only Dash, Disengage, or Dodge. You can attack normally while mounted.' },
    { title: 'Independent Mount', description: 'Keeps its own initiative and actions. More versatile but less predictable. Intelligent mounts are always independent.' },
    { title: 'Forced Dismount', description: 'If knocked prone while mounted, DEX DC 10 save to land on feet. If mount is knocked prone, use reaction to dismount safely or fall prone in adjacent space.' },
    { title: 'Targeting', description: 'Attackers can target you or your mount. Melee attacks from unmounted creatures against a mounted target have disadvantage if the mount is Large+.' },
    { title: 'Mount Damage', description: 'If an effect targets both mount and rider (e.g., fireball), mount makes its own save. If mount drops to 0 HP, rider must dismount.' },
  ],
};

export const UNDERWATER_COMBAT = {
  label: 'Underwater Combat',
  rules: [
    { title: 'Melee Attacks', description: 'Creatures without swim speed have disadvantage on melee attacks UNLESS using a dagger, javelin, shortsword, spear, or trident.' },
    { title: 'Ranged Attacks', description: 'Auto-miss beyond normal range. Disadvantage at normal range unless crossbow, net, or weapon thrown like a javelin (dagger, dart, javelin, spear, trident).' },
    { title: 'Fire Resistance', description: 'All creatures and objects fully submerged have resistance to fire damage.' },
    { title: 'Breathing', description: 'A creature can hold breath for 1 + CON mod minutes (min 30 seconds). When out of breath, survives for CON mod rounds (min 1) before dropping to 0 HP.' },
    { title: 'Visibility', description: 'Water is lightly obscured at depth. Murky water is heavily obscured. Darkvision range is halved underwater.' },
    { title: 'Swimming', description: 'Without a swim speed, swimming costs 2x movement (or 3x in difficult water). Creatures with swim speed move normally.' },
  ],
};

export const AERIAL_COMBAT = {
  label: 'Aerial Combat',
  rules: [
    { title: 'Flying Movement', description: 'Fly speed works like normal movement. Can move in any direction including vertically. Ascending costs no extra movement.' },
    { title: 'Falling', description: 'If knocked prone, speed reduced to 0, or flight otherwise stopped while airborne, creature falls immediately. 1d6 bludgeoning per 10 feet fallen (max 20d6).' },
    { title: 'Hover vs Fly', description: 'Creatures with hover can stay aloft even when speed is 0 or incapacitated. Non-hovering flyers fall if speed reaches 0.' },
    { title: 'Ranged Advantage', description: 'Attacking a grounded target from above provides no inherent advantage, but cover considerations change — ground-based cover may not apply.' },
    { title: 'Melee Reach', description: 'Ground creatures can only melee attack flying creatures within their reach (typically 5 feet above). Larger creatures have greater reach.' },
    { title: '3D Positioning', description: 'Track altitude separately. Diagonal movement in 3D: first diagonal costs 1 square, second costs 2, alternating (optional rule).' },
  ],
};

export const OPPORTUNITY_ATTACKS = {
  label: 'Opportunity Attacks',
  rules: [
    { title: 'Trigger', description: 'When a hostile creature you can see moves out of your reach, you can use your reaction to make one melee attack against it.' },
    { title: 'Avoiding', description: 'Taking the Disengage action prevents opportunity attacks for the rest of your turn. Teleportation does not provoke.' },
    { title: 'Forced Movement', description: 'Being pushed, pulled, or moved by a spell or effect does NOT provoke opportunity attacks.' },
    { title: 'One Reaction', description: 'You only get one reaction per round. Using it for an opportunity attack means no other reactions until your next turn.' },
    { title: 'Reach Weapons', description: 'If you have a reach weapon (10 ft), opportunity attacks trigger when enemies leave that extended reach.' },
    { title: 'Sentinel Feat', description: 'Creatures you hit with opportunity attacks have speed reduced to 0. You can make OA even if enemy Disengages. When adjacent creature attacks someone else, you can use reaction to attack.' },
  ],
};

export const READIED_ACTIONS = {
  label: 'Readied Actions',
  rules: [
    { title: 'Ready Action', description: 'Use your action to ready a response. Describe trigger and action. When trigger occurs, use your reaction to perform it.' },
    { title: 'Trigger', description: 'Must be a perceivable circumstance. "When the goblin opens the door..." or "When an enemy moves within 5 feet..."' },
    { title: 'Held Spell', description: 'If you ready a spell, you cast it on your turn and hold concentration until the trigger. If trigger never happens, spell is wasted (slot spent).' },
    { title: 'Reaction Timing', description: 'You can perform your readied action immediately after the trigger OR let the trigger finish first. Your choice when setting it up.' },
    { title: 'Duration', description: 'Readied action lasts until the start of your next turn. If trigger doesn\'t occur, the action (and any held spell slot) is wasted.' },
    { title: 'Movement', description: 'You can ready movement as part of your action. This uses your reaction when triggered.' },
  ],
};

export const ALL_COMBAT_RULES = {
  mounted: MOUNTED_COMBAT,
  underwater: UNDERWATER_COMBAT,
  aerial: AERIAL_COMBAT,
  opportunity: OPPORTUNITY_ATTACKS,
  readied: READIED_ACTIONS,
};

export function getCombatRule(key) {
  return ALL_COMBAT_RULES[key] || null;
}
