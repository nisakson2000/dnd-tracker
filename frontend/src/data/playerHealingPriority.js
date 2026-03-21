/**
 * playerHealingPriority.js
 * Player Mode: Healing triage — who to heal, when, and how
 * Pure JS — no React dependencies.
 */

export const HEALING_TRIAGE = [
  { priority: 1, target: 'Downed ally (0 HP)', action: 'Healing Word (bonus action, 60ft)', reason: 'Getting them up prevents death saves and restores their turn. Amount doesn\'t matter — even 1 HP.', color: '#f44336' },
  { priority: 2, target: 'Healer (if low)', action: 'Self-heal or ally heals you', reason: 'Dead healer = no more healing for anyone. Protect yourself.', color: '#ff5722' },
  { priority: 3, target: 'Concentrator with critical spell', action: 'Healing to buffer concentration', reason: 'If they drop concentration on Haste/Spirit Guardians, the party suffers greatly.', color: '#ff9800' },
  { priority: 4, target: 'Tank at <25% HP', action: 'Cure Wounds or Healing Word', reason: 'If the tank goes down, enemies rush the backline.', color: '#ffc107' },
  { priority: 5, target: 'Multiple allies at 50% HP', action: 'Mass Healing Word / Prayer of Healing', reason: 'Spread healing efficiently when multiple targets are hurt.', color: '#8bc34a' },
  { priority: 6, target: 'Anyone above 50% HP', action: 'DON\'T heal — attack instead', reason: 'Killing an enemy is better "healing" than topping off HP. Dead enemies deal 0 damage.', color: '#4caf50' },
];

export const HEALING_EFFICIENCY = {
  rule1: 'Healing in D&D is NOT efficient for keeping people topped off. It\'s for picking up downed allies.',
  rule2: 'Damage prevention > healing. Kill the source, use Shield/Absorb Elements, dodge.',
  rule3: 'Healing Word is the best healing spell because it\'s a BONUS ACTION at RANGE.',
  rule4: 'Cure Wounds heals more but costs your ACTION. Use only when safe.',
  rule5: 'Mass Healing Word at 3rd level: heal 6 allies for 1d4+mod each. Emergency button.',
  rule6: 'Goodberry: 1st-level slot = 10 berries = 10 HP of healing split however you want.',
  rule7: 'Life Cleric + Goodberry = each berry heals 4 HP (10 × 4 = 40 HP from a 1st-level slot).',
  rule8: 'Hit dice during short rests are your primary healing resource. Use them!',
};

export const HEALING_SPELL_COMPARISON = [
  { spell: 'Healing Word', level: 1, action: 'Bonus', range: '60ft', avg: '5-6', rating: 'S', note: 'THE healing spell. Ranged, bonus action.' },
  { spell: 'Cure Wounds', level: 1, action: 'Action', range: 'Touch', avg: '8-9', rating: 'B', note: 'More healing but uses your action.' },
  { spell: 'Mass Healing Word', level: 3, action: 'Bonus', range: '60ft', avg: '5-6 each (6 targets)', rating: 'A', note: 'Emergency mass pickup.' },
  { spell: 'Aura of Vitality', level: 3, action: 'Action + Bonus', range: '30ft', avg: '70 total over 10 rounds', rating: 'A', note: 'Best out-of-combat healing. 2d6 per round.' },
  { spell: 'Heal', level: 6, action: 'Action', range: '60ft', avg: '70', rating: 'S', note: '70 HP in one action. Also ends conditions.' },
  { spell: 'Prayer of Healing', level: 2, action: '10 min', range: '30ft', avg: '9-10 each (6 targets)', rating: 'A', note: 'Post-combat only. 10-minute cast time.' },
];

export function getHealingPriority(allies) {
  if (!allies || allies.length === 0) return null;
  return [...allies].sort((a, b) => {
    if (a.hp === 0 && b.hp !== 0) return -1;
    if (b.hp === 0 && a.hp !== 0) return 1;
    return (a.hp / a.maxHp) - (b.hp / b.maxHp);
  })[0];
}

export function shouldHealOrAttack(allyHpPercent, canKillEnemy) {
  if (allyHpPercent === 0) return 'HEAL — Downed ally is priority 1.';
  if (canKillEnemy) return 'ATTACK — Dead enemies deal 0 damage.';
  if (allyHpPercent < 25) return 'HEAL — Ally is in critical danger.';
  return 'ATTACK — Damage prevention through offense.';
}
