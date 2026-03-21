/**
 * playerLightClericGuide.js
 * Player Mode: Light Domain Cleric — the blaster cleric
 * Pure JS — no React dependencies.
 */

export const LIGHT_CLERIC_BASICS = {
  class: 'Cleric (Light Domain)',
  source: 'Player\'s Handbook',
  theme: 'Fire and radiance. Fireball on a Cleric. Warding Flare for defense. Best blaster Cleric.',
  note: 'Gets Fireball and Wall of Fire as domain spells. Warding Flare imposes disadvantage on attacks. Best offensive Cleric while still having full Cleric healing/utility.',
};

export const LIGHT_CLERIC_FEATURES = [
  { feature: 'Light cantrip', level: 1, effect: 'Free Light cantrip.', note: 'Minor utility. Doesn\'t count against cantrips known.' },
  { feature: 'Warding Flare', level: 1, effect: 'Reaction: creature within 30ft attacking you or an ally. Impose disadvantage on the attack. WIS uses/LR.', note: 'Free disadvantage on attacks. At +5 WIS: 5 uses per long rest. Excellent defense for you AND allies.' },
  { feature: 'Channel Divinity: Radiance of the Dawn', level: 2, effect: 'Action: dispel magical darkness within 30ft. Each hostile creature within 30ft: CON save or take 2d10+Cleric level radiant (half on save).', note: 'AoE radiant damage that dispels darkness. Good burst. Scales with level.' },
  { feature: 'Improved Flare', level: 6, effect: 'Warding Flare can protect ANY creature within 30ft, not just yourself.', note: 'Now you\'re a party-wide defense tool. Protect the Wizard from attacks.' },
  { feature: 'Potent Spellcasting', level: 8, effect: 'Add WIS mod to Cleric cantrip damage.', note: '+5 to Sacred Flame/Toll the Dead damage. Nice but not game-changing.' },
  { feature: 'Corona of Light', level: 17, effect: '60ft bright light aura. Enemies in the light have disadvantage on saves vs fire and radiant spells.', note: 'Fireball and Spirit Guardians with disadvantage on saves. Devastating at L17.' },
];

export const LIGHT_CLERIC_DOMAIN_SPELLS = [
  { level: 1, spells: ['Burning Hands', 'Faerie Fire'], note: 'Faerie Fire is excellent — advantage for the party. Burning Hands is decent AoE early.' },
  { level: 3, spells: ['Flaming Sphere', 'Scorching Ray'], note: 'Scorching Ray for single-target burst. Flaming Sphere for sustained BA damage.' },
  { level: 5, spells: ['Daylight', 'Fireball'], note: 'FIREBALL on a Cleric. This alone makes Light Domain top tier.' },
  { level: 7, spells: ['Guardian of Faith', 'Wall of Fire'], note: 'Wall of Fire for area denial. Guardian of Faith for chokepoint damage.' },
  { level: 9, spells: ['Flame Strike', 'Scrying'], note: 'Flame Strike is weaker Fireball (split fire/radiant). Scrying for recon.' },
];

export const LIGHT_CLERIC_TACTICS = [
  { tactic: 'Fireball + Spirit Guardians', detail: 'Fireball for burst AoE. Spirit Guardians for sustained AoE. Light Cleric has the best of both worlds.', rating: 'S' },
  { tactic: 'Warding Flare party defense', detail: 'Reaction: disadvantage on any attack within 30ft. Protect the Rogue, Wizard, anyone. WIS uses/LR.', rating: 'S' },
  { tactic: 'Corona of Light + Fireball', detail: 'L17: enemies have disadvantage on fire/radiant saves in your aura. Fireball with disadvantage on saves = mass failure.', rating: 'S' },
  { tactic: 'Still a full Cleric', detail: 'You still get Healing Word, Spiritual Weapon, Revivify. Full Cleric chassis with blaster domain.', rating: 'S' },
  { tactic: 'Faerie Fire for party', detail: 'Advantage on attacks against affected creatures. Great for enabling Rogues and GWM/SS fighters.', rating: 'A' },
];

export function radianceOfDawnDamage(clericLevel) {
  return { dice: '2d10', bonus: clericLevel, avg: 11 + clericLevel };
}

export function wardingFlareUses(wisMod) {
  return Math.max(1, wisMod);
}
