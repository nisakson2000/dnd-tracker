/**
 * playerMadnessEffects.js
 * Player Mode: Madness rules from the DMG
 * Pure JS — no React dependencies.
 */

export const SHORT_TERM_MADNESS = [
  { roll: '01-20', effect: 'Retreat into your mind. Stunned. Ends after 1d10 minutes.', duration: '1d10 minutes' },
  { roll: '21-30', effect: 'Become incapacitated. Spend duration screaming, laughing, or weeping.', duration: '1d10 minutes' },
  { roll: '31-40', effect: 'Become frightened. Must use Dash to flee from source each turn.', duration: '1d10 minutes' },
  { roll: '41-50', effect: 'Begin babbling incoherently. Can\'t speak or cast verbal spells.', duration: '1d10 minutes' },
  { roll: '51-60', effect: 'Must use action each round to attack nearest creature.', duration: '1d10 minutes' },
  { roll: '61-70', effect: 'Experience vivid hallucinations. Disadvantage on ability checks.', duration: '1d10 minutes' },
  { roll: '71-75', effect: 'Do whatever anyone tells you. Don\'t do anything self-destructive.', duration: '1d10 minutes' },
  { roll: '76-80', effect: 'Overwhelming urge to eat something strange (dirt, slime, etc.).', duration: '1d10 minutes' },
  { roll: '81-90', effect: 'Stunned.', duration: '1d10 minutes' },
  { roll: '91-100', effect: 'Fall unconscious.', duration: '1d10 minutes' },
];

export const LONG_TERM_MADNESS = [
  { roll: '01-10', effect: 'Compelled to repeat a specific activity over and over.', duration: '1d10 × 10 hours' },
  { roll: '11-20', effect: 'Powerful hallucinations.', duration: '1d10 × 10 hours' },
  { roll: '21-30', effect: 'Extreme paranoia. Disadvantage on WIS and CHA checks.', duration: '1d10 × 10 hours' },
  { roll: '31-40', effect: 'Regard something with intense revulsion (as Antipathy effect).', duration: '1d10 × 10 hours' },
  { roll: '41-45', effect: 'Powerful delusion. Choose a potion effect as if hallucinating.', duration: '1d10 × 10 hours' },
  { roll: '46-55', effect: 'Become attached to a "lucky charm" — must hold it at all times.', duration: '1d10 × 10 hours' },
  { roll: '56-65', effect: 'Blinded (psychosomatic).', duration: '1d10 × 10 hours' },
  { roll: '66-75', effect: 'Deafened (psychosomatic).', duration: '1d10 × 10 hours' },
  { roll: '76-85', effect: 'Uncontrollable trembling. Disadvantage on attacks, checks, and saves involving STR or DEX.', duration: '1d10 × 10 hours' },
  { roll: '86-90', effect: 'Amnesia — can\'t remember anything before the madness.', duration: '1d10 × 10 hours' },
  { roll: '91-95', effect: 'Confused (as Confusion spell) whenever stressed.', duration: '1d10 × 10 hours' },
  { roll: '96-100', effect: 'Loss of speech.', duration: '1d10 × 10 hours' },
];

export const INDEFINITE_MADNESS = [
  { roll: '01-15', effect: '"Being drunk keeps me sane."' },
  { roll: '16-25', effect: '"I keep whatever I find."' },
  { roll: '26-30', effect: '"I try to become more like someone else I know — adopting their dress, mannerisms, and name."' },
  { roll: '31-35', effect: '"I must bend the truth, exaggerate, or outright lie to be interesting to other people."' },
  { roll: '36-45', effect: '"Achieving my goal is the only thing of interest to me, and I\'ll ignore everything else to pursue it."' },
  { roll: '46-50', effect: '"I find it hard to care about anything that goes on around me."' },
  { roll: '51-55', effect: '"I don\'t like the way people judge me all the time."' },
  { roll: '56-70', effect: '"I am the smartest, wisest, strongest, fastest, and most beautiful person I know."' },
  { roll: '71-80', effect: '"I am convinced that powerful enemies are hunting me."' },
  { roll: '81-85', effect: '"There\'s only one person I can trust. And only I can see this special friend."' },
  { roll: '86-95', effect: '"I can\'t take anything seriously. The more serious the situation, the funnier I find it."' },
  { roll: '96-100', effect: '"I\'ve discovered that I really like killing people."' },
];

export const MADNESS_CURES = [
  { type: 'Short-term', cure: 'Calm Emotions or Lesser Restoration ends it.' },
  { type: 'Long-term', cure: 'Greater Restoration or equivalent ends it.' },
  { type: 'Indefinite', cure: 'Greater Restoration, Heal (6th), or Wish ends it.' },
];

export function rollMadness(type) {
  const table = type === 'short' ? SHORT_TERM_MADNESS : type === 'long' ? LONG_TERM_MADNESS : INDEFINITE_MADNESS;
  return table[Math.floor(Math.random() * table.length)];
}
