/**
 * playerTableEtiquetteGuide.js
 * Player Mode: Table etiquette, DM negotiation, and session best practices
 * Pure JS — no React dependencies.
 */

export const TABLE_ETIQUETTE_RULES = [
  { rule: 'Know your character', detail: 'Read your spells, features, and abilities BEFORE your turn. Don\'t slow the game.', priority: 'S+' },
  { rule: 'Plan your turn in advance', detail: 'Decide what you\'ll do while others take their turns. Have a backup plan.', priority: 'S+' },
  { rule: 'Don\'t rules-lawyer mid-combat', detail: 'Accept DM\'s ruling. Discuss disagreements AFTER the session.', priority: 'S' },
  { rule: 'Share the spotlight', detail: 'Let other players have their moments. Don\'t dominate every scene.', priority: 'S' },
  { rule: 'Stay engaged when it\'s not your turn', detail: 'Don\'t check phone. Watch the game. React to events.', priority: 'A+' },
  { rule: 'Don\'t metagame', detail: 'Your character doesn\'t know what you know. Act on character knowledge.', priority: 'A+' },
  { rule: 'Respect party decisions', detail: 'Compromise. Don\'t PvP or steal from allies without consent.', priority: 'S' },
  { rule: 'Communicate boundaries', detail: 'Use safety tools (X-card, lines/veils). Speak up if uncomfortable.', priority: 'S+' },
  { rule: 'Be on time', detail: 'Respect everyone\'s schedule. Notify early if you\'ll be late.', priority: 'A+' },
  { rule: 'Thank the DM', detail: 'DMing is work. Appreciation goes a long way.', priority: 'A+' },
];

export const DM_NEGOTIATION_TIPS = [
  { topic: 'Homebrew requests', approach: 'Propose specific changes with RAW comparison. Show it\'s balanced.', note: 'DM is more likely to allow changes that don\'t break the game.' },
  { topic: 'Ruling disagreements', approach: 'Cite PHB/DMG page. Accept DM\'s ruling for now. Discuss after session.', note: 'Never argue during combat. It kills pacing.' },
  { topic: 'Character backstory hooks', approach: 'Give DM plot hooks in your backstory. NPCs, enemies, goals.', note: 'DMs love when players give them material to work with.' },
  { topic: 'Magic item requests', approach: 'Mention items in-character. "I\'ve heard of a legendary bow..." Let DM decide.', note: 'Don\'t demand specific items. Plant seeds.' },
  { topic: 'Multiclass approval', approach: 'Explain the narrative reason. Show how it fits the story.', note: 'Narrative reasons > mechanical reasons for DM buy-in.' },
  { topic: 'Feat/rule variants', approach: 'Reference Tasha\'s optional features. They\'re official.', note: 'Tasha\'s options are easier to approve than homebrew.' },
  { topic: 'Session pacing', approach: 'Politely mention if sessions are too combat-heavy or too RP-heavy.', note: 'DMs want feedback. Give it constructively.' },
];

export const TURN_SPEED_TIPS = [
  'Roll attack AND damage dice together. Saves time.',
  'Know your spell save DC and attack bonus by heart.',
  'Pre-calculate common damage totals (e.g., 2d6+5 = 12 avg).',
  'Use physical spell cards or a quick-reference sheet.',
  'Have your backup action ready if plan A fails.',
  'If you need to look up a rule: ask DM to move to next player, look it up, come back.',
  'Roll initiative dice when DM says "roll initiative" — don\'t wait.',
  'Announce: "I attack with [weapon], [roll] to hit, [damage] damage." Clean and fast.',
];

export const SESSION_ZERO_CHECKLIST = [
  { item: 'Tone and themes', detail: 'Grimdark vs heroic? Horror OK? PvP allowed?' },
  { item: 'Character creation rules', detail: 'Point buy vs rolling? Starting level? Allowed sources?' },
  { item: 'House rules', detail: 'Flanking? Crit rules? Healing potions as BA?' },
  { item: 'Safety tools', detail: 'X-card? Lines and veils? Consent checklist?' },
  { item: 'Schedule', detail: 'How often? How long? What if someone can\'t make it?' },
  { item: 'Party composition', detail: 'Coordinate classes. Avoid 4 rogues (unless that\'s the vibe).' },
  { item: 'Backstory connections', detail: 'How do characters know each other? Shared history?' },
  { item: 'Lethality', detail: 'Are PC deaths common? Resurrection rules? New character rules?' },
];

export const ETIQUETTE_TIPS = [
  'Know your character. Read your spells. Don\'t waste table time.',
  'Plan your turn during others\' turns. "I\'ll do X, or Y if X fails."',
  'Roll attack + damage together. Fastest way to keep combat moving.',
  'Don\'t argue rules during combat. Note it. Discuss after session.',
  'Share the spotlight. Your moment will come.',
  'Session Zero: establish expectations BEFORE problems arise.',
  'Give your DM backstory hooks. They\'ll weave them into the campaign.',
  'Thank your DM. It\'s a lot of work.',
];
