/**
 * playerCombatSoundEffects.js
 * Player Mode: Sound effect descriptors for combat event narration
 * Pure JS — no React dependencies.
 */

export const WEAPON_SOUNDS = {
  sword: ['Steel rings as your blade connects', 'A sharp clang of metal on armor', 'The sword hums through the air'],
  axe: ['A heavy crunch as the axe bites deep', 'Wood splinters under the impact', 'The axe thuds into flesh'],
  bow: ['The bowstring twangs', 'A whistle of fletching through air', 'A sharp thunk as the arrow hits'],
  mace: ['A sickening crunch of bone', 'Metal slams against the target', 'The mace connects with a dull thud'],
  dagger: ['A swift, silent strike', 'The blade slips between armor plates', 'Quick steel flashes in the dim light'],
  fist: ['Knuckles crack against jaw', 'A heavy body blow lands', 'The impact echoes in the chamber'],
  staff: ['A crack of wood against skull', 'The staff sweeps and connects', 'A resonant thwack rings out'],
};

export const SPELL_SOUNDS = {
  fire: ['A roar of flame erupts', 'Heat waves shimmer through the air', 'Crackling fire consumes'],
  cold: ['Ice crackles and pops', 'A bitter chill fills the area', 'Frost crystallizes in the air'],
  lightning: ['Thunder booms through the chamber', 'Electric arcs sizzle and crack', 'The air crackles with energy'],
  radiant: ['A warm glow fills the space', 'Pure light blazes forth', 'Divine energy hums with power'],
  necrotic: ['A hollow, draining whisper', 'Dark energy hisses and seeps', 'Life force withers audibly'],
  thunder: ['A deafening boom shakes the ground', 'Sound waves ripple outward', 'Walls tremble from the impact'],
  psychic: ['A piercing mental shriek', 'Reality seems to warp briefly', 'The mind recoils from assault'],
  force: ['A deep hum of pure energy', 'Invisible force impacts with a crack', 'Magical power reverberates'],
};

export const COMBAT_SOUNDS = {
  hit: ['A solid hit!', 'It connects!', 'Direct impact!'],
  miss: ['The strike goes wide', 'It glances off harmlessly', 'A near miss!'],
  crit: ['A devastating blow!', 'Perfect strike!', 'CRITICAL!'],
  fumble: ['A clumsy swing', 'You overextend!', 'The weapon slips!'],
  death: ['The enemy crumbles', 'It collapses lifelessly', 'With a final groan, it falls'],
  heal: ['Warm energy flows through', 'Wounds begin to close', 'Life returns to their eyes'],
  block: ['Your shield absorbs the blow', 'Armor deflects the strike', 'You parry just in time'],
};

export function getWeaponSound(weaponType) {
  const sounds = WEAPON_SOUNDS[(weaponType || '').toLowerCase()];
  return sounds ? sounds[Math.floor(Math.random() * sounds.length)] : 'The weapon strikes!';
}

export function getSpellSound(damageType) {
  const sounds = SPELL_SOUNDS[(damageType || '').toLowerCase()];
  return sounds ? sounds[Math.floor(Math.random() * sounds.length)] : 'Magical energy surges!';
}

export function getCombatSound(eventType) {
  const sounds = COMBAT_SOUNDS[(eventType || '').toLowerCase()];
  return sounds ? sounds[Math.floor(Math.random() * sounds.length)] : '';
}
