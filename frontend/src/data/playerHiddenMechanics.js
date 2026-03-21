/**
 * playerHiddenMechanics.js
 * Player Mode: Non-obvious mechanics that most players miss
 * Pure JS — no React dependencies.
 */

export const HIDDEN_MECHANICS = [
  { mechanic: 'You can choose to fail a saving throw', detail: 'If an ally casts a spell on you that requires a save, you can voluntarily fail it (Polymorph, Enlarge, etc.).', impact: 'High', source: 'PHB p.178' },
  { mechanic: 'Dropping prone is free', detail: 'Dropping prone costs NO movement. Standing up costs HALF your speed. Use this with ranged attacks against you.', impact: 'Medium', source: 'PHB p.190-191' },
  { mechanic: 'Shoving can push into hazards', detail: 'A successful shove pushes 5ft in ANY direction. Push enemies off cliffs, into fire, through Wall of Fire.', impact: 'High', source: 'PHB p.195' },
  { mechanic: 'You can delay your Ready trigger', detail: 'You set your own trigger for readied actions. "When the enemy touches the chest" — you control when you act.', impact: 'Medium', source: 'PHB p.193' },
  { mechanic: 'Familiars can deliver touch spells', detail: 'Your familiar can use its reaction to deliver a touch spell you cast. Owl + Flyby = safe touch spell delivery.', impact: 'High', source: 'PHB p.240' },
  { mechanic: 'You can grapple with a shield', detail: 'Grappling needs a free hand. Shield is strapped to your arm, not held. You can grapple with shield equipped.', impact: 'Medium', source: 'Sage Advice' },
  { mechanic: 'Eldritch Blast beams target independently', detail: 'Each beam can target a different creature. At level 17, that\'s 4 targets. Each applies Hex/Agonizing separately.', impact: 'High', source: 'PHB p.237' },
  { mechanic: 'You can use caltrops and ball bearings mid-combat', detail: 'Action to scatter. Caltrops: DC 15 DEX or stop + 1 piercing. Ball bearings: DC 10 DEX or fall prone.', impact: 'Medium', source: 'PHB p.151' },
  { mechanic: 'Darkness blocks Counterspell', detail: 'Counterspell requires you to SEE the caster. If you\'re in Darkness or they\'re behind cover, you can\'t counter.', impact: 'High', source: 'Sage Advice' },
  { mechanic: 'Net is a ranged weapon that restrains', detail: 'A net restrains the target. Disadvantage at close range, but Crossbow Expert removes that. Sharpshooter ignores cover.', impact: 'Medium', source: 'PHB p.148' },
  { mechanic: 'Spiritual Weapon is NOT concentration', detail: 'This is huge. Spiritual Weapon + Spirit Guardians = bonus action attack + damage aura. Both at once.', impact: 'High', source: 'PHB p.278' },
  { mechanic: 'Long rest only recovers HALF hit dice', detail: 'Many players think you get ALL hit dice back. You get half your total (minimum 1) per long rest.', impact: 'Medium', source: 'PHB p.186' },
  { mechanic: 'Unconscious creatures auto-fail STR and DEX saves', detail: 'AoE against unconscious creatures = auto-fail DEX saves. Fireball on downed enemies is devastating.', impact: 'Medium', source: 'PHB Appendix A' },
  { mechanic: 'You can hold your breath for 1 + CON mod minutes', detail: 'That\'s 1 minute per CON modifier + 1 base. After that, you survive CON modifier rounds before dropping to 0.', impact: 'Medium', source: 'PHB p.183' },
];

export function getMechanic(topic) {
  return HIDDEN_MECHANICS.find(m =>
    m.mechanic.toLowerCase().includes((topic || '').toLowerCase())
  ) || null;
}

export function getHighImpactMechanics() {
  return HIDDEN_MECHANICS.filter(m => m.impact === 'High');
}

export function getRandomMechanic() {
  return HIDDEN_MECHANICS[Math.floor(Math.random() * HIDDEN_MECHANICS.length)];
}
