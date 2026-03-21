/**
 * playerInspirationGuide.js
 * Player Mode: Inspiration rules, earning tips, and variant systems
 * Pure JS — no React dependencies.
 */

export const INSPIRATION_RULES = {
  what: 'Inspiration is a binary state. You either have it or you don\'t. Can\'t stockpile.',
  effect: 'Spend inspiration to gain advantage on one attack roll, saving throw, or ability check.',
  earning: 'DM awards it for good roleplaying, creative play, or acting in character (especially against self-interest).',
  giving: 'You can give your inspiration to another player if you have it.',
  timing: 'You choose to use it BEFORE the roll, not after.',
  forgetting: 'Inspiration is the most commonly forgotten mechanic in 5e. Remind your DM to award it.',
};

export const EARNING_TIPS = [
  { method: 'Play your flaws', detail: 'Act on your character\'s bonds, ideals, or flaws — especially when it creates complications.', likelihood: 'High' },
  { method: 'Dramatic roleplay moments', detail: 'A moving speech, a difficult choice, an in-character sacrifice. Moments that make the table go "ooh."', likelihood: 'High' },
  { method: 'Creative problem-solving', detail: 'Find an unexpected solution to a problem. Use the environment, NPC relationships, or abilities in novel ways.', likelihood: 'Medium' },
  { method: 'Help other players shine', detail: 'Set up moments for other players. Assist their plans. Be a team player in character.', likelihood: 'Medium' },
  { method: 'Stay in character during pressure', detail: 'When the smart play and the in-character play conflict, choose character. DMs reward that.', likelihood: 'High' },
  { method: 'Advance the story', detail: 'Take the plot hook. Follow up on clues. Engage with the DM\'s prepared content.', likelihood: 'Medium' },
  { method: 'Make the table laugh', detail: 'In-character humor, witty one-liners, comedic timing. Fun = inspiration.', likelihood: 'Medium' },
];

export const WHEN_TO_USE = [
  { situation: 'Critical saving throw (death save, dominate, banishment)', priority: 'S', reason: 'Failing these ends you. Advantage is massive.' },
  { situation: 'Attack roll on a big smite or Sneak Attack', priority: 'A', reason: 'Ensure your highest-damage attack lands.' },
  { situation: 'Crucial skill check (persuade the king, disarm the bomb)', priority: 'A', reason: 'Plot-critical check that can\'t be retried.' },
  { situation: 'Final blow on a boss', priority: 'B', reason: 'Cool moment, but you can always attack again next turn.' },
  { situation: 'Random encounter combat', priority: 'C', reason: 'Save it for something important. Don\'t waste on trash mobs.' },
  { situation: 'Contested check you must win', priority: 'A', reason: 'Grapple, Counterspell check, opposed Stealth. One chance.' },
];

export const VARIANT_SYSTEMS = [
  { variant: 'Hero Points', source: 'DMG', rule: '5 + half level hero points. Spend to add 1d6 to any d20 roll AFTER seeing the result.', note: 'More flexible than standard inspiration. Can be spent after rolling.' },
  { variant: 'Group Inspiration Pool', source: 'Houserule', rule: 'Party shares a pool of 1-3 inspiration tokens. Anyone can earn or spend.', note: 'Encourages team play. Less likely to be forgotten.' },
  { variant: 'Inspiration as Luck Points', source: 'Houserule', rule: 'Inspiration works like Lucky feat: reroll after seeing the result.', note: 'Much more powerful. Players love this.' },
  { variant: 'Stackable Inspiration', source: 'Houserule', rule: 'Can have up to 3 inspiration. Stack them for emergencies.', note: 'Gives players a real resource to manage.' },
  { variant: 'Other Players Award It', source: 'Houserule', rule: 'Players nominate each other for inspiration. DM approves.', note: 'Encourages noticing each other\'s good play.' },
  { variant: 'Start of Session Inspiration', source: '2024 Rules', rule: 'Each player starts every session with inspiration.', note: '2024 PHB change. Ensures it gets used. Background features can grant it.' },
];

export function shouldUseInspiration(situation, hasInspiration) {
  if (!hasInspiration) return { use: false, reason: 'You don\'t have inspiration.' };
  const guide = WHEN_TO_USE.find(w =>
    w.situation.toLowerCase().includes((situation || '').toLowerCase())
  );
  if (guide && (guide.priority === 'S' || guide.priority === 'A')) {
    return { use: true, reason: guide.reason };
  }
  return { use: false, reason: 'Save it for a more critical moment.' };
}
