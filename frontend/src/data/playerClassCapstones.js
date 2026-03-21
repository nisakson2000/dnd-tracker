/**
 * playerClassCapstones.js
 * Player Mode: Level 20 capstone features for all classes
 * Pure JS — no React dependencies.
 */

export const CAPSTONE_FEATURES = [
  { class: 'Barbarian', feature: 'Primal Champion', level: 20, effect: 'STR and CON increase by 4. Max is now 24.', rating: 'S', note: 'STR 24 (+7) and CON 24 (+7). Massive stat boost. Best capstone for raw power.' },
  { class: 'Bard', feature: 'Superior Inspiration', level: 20, effect: 'If you have no Bardic Inspiration dice when you roll initiative, you regain one.', rating: 'C', note: 'Only 1 die. Worst capstone in the game. Multiclass instead.' },
  { class: 'Cleric', feature: 'Divine Intervention (auto)', level: 20, effect: 'Divine Intervention automatically succeeds. Once per 7 days.', rating: 'S', note: 'Ask your god for anything. Auto-success. World-shaping power.' },
  { class: 'Druid', feature: 'Archdruid', level: 20, effect: 'Unlimited Wild Shape uses. Ignore V/S components.', rating: 'S', note: 'Infinite Wild Shape = infinite HP sponge. Unlimited beast forms.' },
  { class: 'Fighter', feature: 'Extra Attack (4th)', level: 20, effect: 'Four attacks per Attack action. 8 with Action Surge.', rating: 'S', note: '4 attacks. Action Surge = 8 attacks in one turn. Absurd damage output.' },
  { class: 'Monk', feature: 'Perfect Self', level: 20, effect: 'If you have no ki when you roll initiative, you regain 4 ki.', rating: 'B', note: '4 ki is okay but Monk has 20 ki total. Feels small.' },
  { class: 'Paladin', feature: 'Varies by Oath', level: 20, effect: 'Subclass-specific transformation (1-minute super form).', rating: 'S', note: 'Holy Nimbus (Devotion), Avenging Angel (Vengeance), Elder Champion (Ancients). All amazing.' },
  { class: 'Ranger', feature: 'Foe Slayer', level: 20, effect: 'Add WIS mod to one attack or damage roll vs favored enemy per turn.', rating: 'C', note: '+5 once per turn vs one creature type. Underwhelming. Multiclass.' },
  { class: 'Rogue', feature: 'Stroke of Luck', level: 20, effect: 'Turn a miss into a hit or treat a failed check as a 20. Once per rest.', rating: 'A', note: 'Guaranteed Sneak Attack hit once per rest. Good but not game-breaking.' },
  { class: 'Sorcerer', feature: 'Sorcerous Restoration', level: 20, effect: 'Regain 4 Sorcery Points on short rest.', rating: 'C', note: '4 SP on short rest. Sorcerer has 20 SP. Very underwhelming. Multiclass.' },
  { class: 'Warlock', feature: 'Eldritch Master', level: 20, effect: 'Once per long rest, spend 1 minute to recover all Pact Magic slots.', rating: 'B', note: 'Extra set of slots (4 5th-level). Decent but arrives very late.' },
  { class: 'Wizard', feature: 'Signature Spells', level: 20, effect: 'Two 3rd-level spells always prepared + cast once each at 3rd level for free.', rating: 'B', note: 'Two free 3rd-level casts per rest. Nice but 3rd level is low at L20.' },
  { class: 'Artificer', feature: 'Soul of Artifice', level: 20, effect: '+1 to all saves per attuned item (up to +6). If you drop to 0, end one infusion to drop to 1 instead.', rating: 'S', note: '+6 to all saves. Can\'t die easily. Excellent capstone.' },
];

export const BEST_MULTICLASS_EXITS = {
  note: 'Some classes have weak capstones. These are better off multiclassing.',
  goodToLeave: ['Bard (worst capstone)', 'Ranger (bad capstone)', 'Sorcerer (weak capstone)', 'Monk (underwhelming)'],
  stayForCapstone: ['Barbarian (STR/CON 24)', 'Cleric (auto Divine Intervention)', 'Druid (unlimited WS)', 'Fighter (4 attacks)', 'Paladin (super form)', 'Artificer (+6 saves)'],
};

export function capstoneRating(className) {
  const ratings = {
    'Barbarian': 'S', 'Bard': 'C', 'Cleric': 'S', 'Druid': 'S',
    'Fighter': 'S', 'Monk': 'B', 'Paladin': 'S', 'Ranger': 'C',
    'Rogue': 'A', 'Sorcerer': 'C', 'Warlock': 'B', 'Wizard': 'B', 'Artificer': 'S',
  };
  return ratings[className] || 'Unknown';
}
