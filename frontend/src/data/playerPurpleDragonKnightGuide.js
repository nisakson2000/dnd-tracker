/**
 * playerPurpleDragonKnightGuide.js
 * Player Mode: Purple Dragon Knight (Banneret) Fighter — the inspiring leader
 * Pure JS — no React dependencies.
 */

export const PDK_BASICS = {
  class: 'Fighter (Purple Dragon Knight / Banneret)',
  source: 'Sword Coast Adventurer\'s Guide',
  theme: 'Support Fighter. Second Wind heals allies. Action Surge grants ally attacks. Weak but flavorful.',
  note: 'Generally considered underpowered. Features share existing Fighter resources with allies but don\'t add anything new. Best in parties that benefit from any extra healing or attacks. Roleplay-heavy subclass.',
};

export const PDK_FEATURES = [
  { feature: 'Rallying Cry', level: 3, effect: 'When you use Second Wind, choose 3 allies within 60ft — each regains HP = Fighter level.', note: 'At L10: heal 3 allies for 10 HP each when you Second Wind. Decent but not competitive with dedicated healers.' },
  { feature: 'Royal Envoy', level: 7, effect: 'Proficiency in Persuasion (or another if you have it). Double proficiency bonus on Persuasion checks.', note: 'Expertise in Persuasion. Good for party face Fighter. Pure ribbon but useful.' },
  { feature: 'Inspiring Surge', level: 10, effect: 'When you Action Surge, one ally within 60ft can make one weapon attack as reaction.', note: 'Free attack for an ally. At L18: two allies. But Battlemaster gives you more overall.' },
  { feature: 'Inspiring Surge (2 allies)', level: 18, effect: 'Inspiring Surge targets 2 allies instead of 1.', note: 'Two free ally attacks on Action Surge. Better but still not amazing.' },
  { feature: 'Bulwark', level: 15, effect: 'When you use Indomitable to reroll a save, one ally within 60ft who failed the same save can also reroll.', note: 'Share your save reroll. Situational but can save a party member from save-or-suck.' },
];

export const PDK_TACTICS = [
  { tactic: 'Rallying Cry + Short Rest sync', detail: 'Second Wind + 3 allies healed = decent group top-up. Not a replacement for healer but helps.', rating: 'B' },
  { tactic: 'Inspiring Surge + Rogue ally', detail: 'Give reaction attack to Rogue = extra Sneak Attack (once per turn, not per round). If not their turn: full SA.', rating: 'A' },
  { tactic: 'Inspiring Surge + Paladin ally', detail: 'Give attack to Paladin = chance for Divine Smite on their reaction. High damage potential.', rating: 'A' },
  { tactic: 'Bulwark save sharing', detail: 'L15: ally fails same save as you → reroll. Can save them from Banishment, Hold Person, etc.', rating: 'B' },
  { tactic: 'Face Fighter', detail: 'Royal Envoy = expertise Persuasion. STR Fighter who talks. Niche but fun roleplay.', rating: 'B' },
];

export const PDK_VERDICT = {
  strengths: 'Flavorful support, no resource cost (shares existing features), face skills',
  weaknesses: 'No new resources, weak compared to Battlemaster/Echo Knight/Rune Knight, features are underwhelming',
  recommendation: 'Play for roleplay/flavor, not optimization. Best in casual games. Battlemaster does "support Fighter" better.',
};

export function rallyingCryHealing(fighterLevel, numAllies = 3) {
  return { perAlly: fighterLevel, total: fighterLevel * numAllies, note: 'Heals when you Second Wind. No extra action cost.' };
}
