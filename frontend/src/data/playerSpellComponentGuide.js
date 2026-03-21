/**
 * playerSpellComponentGuide.js
 * Player Mode: Spell components management — V, S, M rules
 * Pure JS — no React dependencies.
 */

export const COMPONENT_BASICS = {
  verbal: { symbol: 'V', rule: 'Must speak in a strong voice. Can\'t cast if silenced (Silence spell, gagged).', note: 'Most spells have V. Being in a Silence zone shuts down most casters.' },
  somatic: { symbol: 'S', rule: 'Must have a free hand for gestures. Can\'t cast with both hands occupied.', note: 'Shield + weapon = no free hand for S. Solution: War Caster feat or drop/sheathe weapon.' },
  material: { symbol: 'M', rule: 'Must have the material or a focus/component pouch. If material has a gold cost, you need that specific item.', note: 'Component pouch replaces ALL non-costed materials. Focus (arcane/druidic/holy) also works.' },
};

export const FREE_HAND_RULES = [
  { scenario: 'Sword + Shield', freeHand: false, solution: 'War Caster feat (cast S spells with full hands) or use shield as holy symbol (Cleric/Paladin).', note: 'Clerics/Paladins can emboss holy symbol on shield — counts as focus for M components.' },
  { scenario: 'Two-handed weapon', freeHand: 'Technically yes', solution: 'Two-handed only requires both hands to ATTACK. Can hold in one hand and cast with the other between attacks.', note: 'RAW: release one hand, cast, re-grip. No action cost.' },
  { scenario: 'Dual wielding', freeHand: false, solution: 'War Caster is almost mandatory. Or drop one weapon (free action), cast, pick up (object interaction on next turn).', note: 'Dual wielding + casting is awkward without War Caster.' },
  { scenario: 'Weapon + focus', freeHand: false, solution: 'Can use the focus for M component, but still need a free hand for S. Ruby of the War Mage attaches focus to weapon.', note: 'Ruby of the War Mage (common magic item) solves this for Artificers, makes weapon = focus.' },
];

export const COSTLY_COMPONENTS = [
  { spell: 'Revivify', cost: '300 gp diamond (consumed)', note: 'Must have on hand. Party should stockpile these.' },
  { spell: 'Raise Dead', cost: '500 gp diamond (consumed)', note: 'Keep multiple. Deaths happen.' },
  { spell: 'Resurrection', cost: '1,000 gp diamond (consumed)', note: 'Expensive but worth having one ready.' },
  { spell: 'Greater Restoration', cost: '100 gp diamond dust (consumed)', note: 'Removes conditions. Keep 2-3 worth of dust.' },
  { spell: 'Heroes\' Feast', cost: '1,000 gp gem-encrusted bowl (not consumed)', note: 'One-time purchase. Lasts forever. Amazing pre-boss buff.' },
  { spell: 'Find Familiar', cost: '10 gp charcoal/incense/herbs (consumed)', note: 'Cheap. Re-summon whenever familiar dies.' },
  { spell: 'Chromatic Orb', cost: '50 gp diamond (not consumed)', note: 'One-time purchase. Keep in component pouch.' },
  { spell: 'Identify', cost: '100 gp pearl (not consumed)', note: 'One-time purchase. Or just short rest to identify (DMG variant rule).' },
  { spell: 'Clone', cost: '1,000 gp diamond + 2,000 gp vessel (consumed)', note: 'Insurance against death. Very expensive but invaluable at high levels.' },
  { spell: 'Simulacrum', cost: '1,500 gp ruby dust (consumed)', note: 'Creates a copy with half your HP. Expensive but extremely powerful.' },
];

export const COMPONENT_TIPS = [
  { tip: 'Buy a component pouch early', detail: '25 gp. Replaces ALL non-costed material components. Simpler than tracking individual components.', priority: 'Essential' },
  { tip: 'Or get a focus', detail: 'Arcane focus (wand/staff/orb), Druidic focus (totem/staff), Holy symbol (amulet/emblem/reliquary). Same function.', priority: 'Essential' },
  { tip: 'Stock resurrection diamonds', detail: 'Buy 300gp and 500gp diamonds whenever you\'re in a city. Revivify is useless without them.', priority: 'High' },
  { tip: 'War Caster for S+M casters', detail: 'If you use a shield + weapon, War Caster lets you perform somatic components with full hands.', priority: 'High' },
  { tip: 'Ruby of the War Mage', detail: 'Common magic item. Attaches to weapon, makes it a spellcasting focus. Solves M component issues for gish builds.', priority: 'Medium' },
];

export function needsFreeHand(hasVerbal, hasSomatic, hasMaterial, hasFocus) {
  if (!hasSomatic && !hasMaterial) return false;
  if (hasSomatic && hasMaterial && hasFocus) return true; // Focus handles M, but still need hand for S (same hand can work)
  if (hasSomatic) return true;
  if (hasMaterial && !hasFocus) return true;
  return false;
}

export function canCastWithSetup(hasShield, hasTwoHandedWeapon, hasDualWield, hasWarCaster) {
  if (hasWarCaster) return { canCast: true, note: 'War Caster allows somatic components with full hands.' };
  if (hasDualWield) return { canCast: false, note: 'Need War Caster or must drop a weapon.' };
  if (hasShield) return { canCast: false, note: 'Need War Caster, or use shield as holy symbol (Cleric/Paladin only).' };
  if (hasTwoHandedWeapon) return { canCast: true, note: 'Release one hand (free), cast, re-grip (free object interaction).' };
  return { canCast: true, note: 'One hand free for components.' };
}
