/**
 * Exhaustion & Madness — D&D 5e exhaustion levels and madness tables.
 */

// ── Exhaustion (Item 21) ──
export const EXHAUSTION_LEVELS = [
  { level: 0, label: 'None', effects: 'No penalties.', color: '#4ade80' },
  { level: 1, label: 'Level 1', effects: 'Disadvantage on ability checks.', color: '#fbbf24' },
  { level: 2, label: 'Level 2', effects: 'Speed halved.', color: '#f97316' },
  { level: 3, label: 'Level 3', effects: 'Disadvantage on attack rolls and saving throws.', color: '#ef4444' },
  { level: 4, label: 'Level 4', effects: 'Hit point maximum halved.', color: '#dc2626' },
  { level: 5, label: 'Level 5', effects: 'Speed reduced to 0.', color: '#991b1b' },
  { level: 6, label: 'Level 6', effects: 'Death.', color: '#000000' },
];

export function getExhaustionEffects(level) {
  // Exhaustion is cumulative — all effects from lower levels apply
  return EXHAUSTION_LEVELS.filter(e => e.level > 0 && e.level <= level);
}

export function getExhaustionColor(level) {
  const entry = EXHAUSTION_LEVELS.find(e => e.level === level);
  return entry ? entry.color : '#4ade80';
}

// ── Madness (Item 24) ──
export const SHORT_TERM_MADNESS = [
  { roll: [1, 20], effect: 'The character retreats into their mind and becomes paralyzed. The effect ends if the character takes any damage.', duration: '1d10 minutes' },
  { roll: [21, 30], effect: 'The character becomes incapacitated and spends the duration screaming, laughing, or weeping.', duration: '1d10 minutes' },
  { roll: [31, 40], effect: 'The character becomes frightened and must use their action and movement each round to flee from the source of fear.', duration: '1d10 minutes' },
  { roll: [41, 50], effect: 'The character begins babbling and is incapable of normal speech or spellcasting.', duration: '1d10 minutes' },
  { roll: [51, 60], effect: 'The character must use their action each round to attack the nearest creature.', duration: '1d10 minutes' },
  { roll: [61, 70], effect: 'The character experiences vivid hallucinations and has disadvantage on ability checks.', duration: '1d10 minutes' },
  { roll: [71, 75], effect: 'The character does whatever anyone tells them to do that isn\'t obviously self-destructive.', duration: '1d10 minutes' },
  { roll: [76, 80], effect: 'The character experiences an overpowering urge to eat something strange (dirt, slime, offal).', duration: '1d10 minutes' },
  { roll: [81, 90], effect: 'The character is stunned.', duration: '1d10 minutes' },
  { roll: [91, 100], effect: 'The character falls unconscious.', duration: '1d10 minutes' },
];

export const LONG_TERM_MADNESS = [
  { roll: [1, 10], effect: 'The character feels compelled to repeat a specific activity over and over (hand-washing, counting, etc.).', duration: '1d10 x 10 hours' },
  { roll: [11, 20], effect: 'The character experiences vivid hallucinations and has disadvantage on ability checks.', duration: '1d10 x 10 hours' },
  { roll: [21, 30], effect: 'The character suffers extreme paranoia. Disadvantage on Wisdom and Charisma checks.', duration: '1d10 x 10 hours' },
  { roll: [31, 40], effect: 'The character regards something with intense revulsion, as if affected by the antipathy effect of Antipathy/Sympathy.', duration: '1d10 x 10 hours' },
  { roll: [41, 45], effect: 'The character experiences a powerful delusion. Choose a potion effect — the character imagines they\'re under its effect.', duration: '1d10 x 10 hours' },
  { roll: [46, 55], effect: 'The character becomes attached to a "lucky charm" and has disadvantage on attacks, checks, and saves while more than 30 feet from it.', duration: '1d10 x 10 hours' },
  { roll: [56, 65], effect: 'The character is blinded (25%) or deafened (75%).', duration: '1d10 x 10 hours' },
  { roll: [66, 75], effect: 'The character experiences uncontrollable tremors or tics, giving disadvantage on Strength and Dexterity checks and attacks.', duration: '1d10 x 10 hours' },
  { roll: [76, 85], effect: 'The character suffers from partial amnesia. They know who they are but don\'t recognize other people.', duration: '1d10 x 10 hours' },
  { roll: [86, 90], effect: 'Whenever the character takes damage, they must succeed on a DC 15 Wisdom save or be affected by Confusion.', duration: '1d10 x 10 hours' },
  { roll: [91, 95], effect: 'The character loses the ability to speak.', duration: '1d10 x 10 hours' },
  { roll: [96, 100], effect: 'The character falls unconscious. No amount of jostling or damage can wake them.', duration: '1d10 x 10 hours' },
];

export const INDEFINITE_MADNESS = [
  { roll: [1, 15], flaw: '"Being drunk keeps me sane."', cure: 'Calm Emotions, Lesser Restoration, or resolution of underlying trauma' },
  { roll: [16, 25], flaw: '"I keep whatever I find."', cure: 'Calm Emotions, Lesser Restoration' },
  { roll: [26, 30], flaw: '"I try to become more like someone else I know — adopting their style, mannerisms, name."', cure: 'Greater Restoration or prolonged therapy' },
  { roll: [31, 35], flaw: '"I must bend the truth, exaggerate, or outright lie to be interesting to other people."', cure: 'Greater Restoration' },
  { roll: [36, 45], flaw: '"Achieving my goal is the only thing of interest to me, and I\'ll ignore everything else."', cure: 'Greater Restoration' },
  { roll: [46, 50], flaw: '"I find it hard to care about anything that goes on around me."', cure: 'Greater Restoration' },
  { roll: [51, 55], flaw: '"I don\'t like the way people judge me all the time."', cure: 'Greater Restoration' },
  { roll: [56, 70], flaw: '"I am the smartest, wisest, strongest, fastest, and most beautiful person I know."', cure: 'Greater Restoration' },
  { roll: [71, 80], flaw: '"I am convinced that powerful enemies are hunting me."', cure: 'Greater Restoration or defeating an actual enemy' },
  { roll: [81, 85], flaw: '"There\'s only one person I can trust. And only I can see this special friend."', cure: 'Greater Restoration' },
  { roll: [86, 95], flaw: '"I can\'t take anything seriously. The more serious the situation, the funnier I find it."', cure: 'Greater Restoration' },
  { roll: [96, 100], flaw: '"I\'ve discovered that I really like killing people."', cure: 'Greater Restoration and atonement' },
];

const d100 = () => Math.floor(Math.random() * 100) + 1;

export function rollMadness(type = 'short') {
  const roll = d100();
  const table = type === 'short' ? SHORT_TERM_MADNESS : type === 'long' ? LONG_TERM_MADNESS : INDEFINITE_MADNESS;
  const entry = table.find(e => roll >= e.roll[0] && roll <= e.roll[1]) || table[0];
  return { roll, ...entry, type };
}
