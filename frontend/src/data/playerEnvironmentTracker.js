/**
 * playerEnvironmentTracker.js
 * Player Mode: Track environmental conditions affecting the party
 * Pure JS — no React dependencies.
 */

export const ENVIRONMENT_CONDITIONS = [
  { condition: 'Darkness', effect: 'Heavily obscured. Blinded condition effectively.', impact: 'Disadvantage on attacks. Enemies have advantage. Can\'t target with most spells.', counters: ['Darkvision', 'Light cantrip', 'Dancing Lights', 'Torch'] },
  { condition: 'Dim Light', effect: 'Lightly obscured. Disadvantage on Perception checks.', impact: 'Minor. Darkvision treats darkness as dim light.', counters: ['Light sources'] },
  { condition: 'Fog/Mist', effect: 'Lightly/Heavily obscured depending on thickness.', impact: 'Can block line of sight for spells.', counters: ['Gust of Wind', 'Wind Wall', 'Move out'] },
  { condition: 'Extreme Cold', effect: 'DC 10 CON save each hour or gain 1 exhaustion level.', impact: 'Cumulative exhaustion is deadly.', counters: ['Cold weather gear', 'Endure Elements', 'Resistance to cold'] },
  { condition: 'Extreme Heat', effect: 'DC 5+ CON save each hour (increases) or gain 1 exhaustion.', impact: 'Heavy armor = disadvantage on save.', counters: ['Water (1 gallon/day)', 'Endure Elements', 'Fire resistance'] },
  { condition: 'Strong Wind', effect: 'Disadvantage on ranged attacks and Perception (hearing).', impact: 'Also extinguishes open flames.', counters: ['Take cover', 'Use melee instead'] },
  { condition: 'Heavy Rain', effect: 'Lightly obscured. Disadvantage on Perception (sight/hearing).', impact: 'Extinguishes open flames.', counters: ['Shelter', 'Control Weather'] },
  { condition: 'Underwater', effect: 'Melee disadvantage (except specified weapons). Ranged auto-miss past range.', impact: 'No fire spells. Verbal component spells risky.', counters: ['Water Breathing', 'Swim speed', 'Trident/dagger/spear work normally'] },
  { condition: 'High Altitude', effect: '10,000+ ft: each hour = CON save vs exhaustion.', impact: 'Halve travel time before exhaustion.', counters: ['Acclimate for 30 days', 'Fly spell'] },
  { condition: 'Desecrated Ground', effect: 'Undead created here have advantage on saves. Healing halved.', impact: 'Very dangerous for parties relying on healing.', counters: ['Hallow', 'Consecrate'] },
  { condition: 'Ravenous Hunger (Shadowfell)', effect: 'After 1d4 hours: CHA save or gain despair effect.', impact: 'Various madness-like effects.', counters: ['Calm Emotions', 'Leave quickly'] },
  { condition: 'Memory Loss (Feywild)', effect: 'WIS save when leaving or lose memories of time there.', impact: 'Greater Restoration restores memories.', counters: ['High WIS save', 'Greater Restoration'] },
];

export function createEnvironmentState() {
  return {
    activeConditions: [],
    lighting: 'Bright Light',
    temperature: 'Normal',
    terrain: 'Normal',
    notes: '',
  };
}

export function getConditionInfo(conditionName) {
  return ENVIRONMENT_CONDITIONS.find(c => c.condition.toLowerCase().includes((conditionName || '').toLowerCase())) || null;
}

export function getActiveEffects(conditions) {
  return (conditions || []).map(name => getConditionInfo(name)).filter(Boolean);
}
