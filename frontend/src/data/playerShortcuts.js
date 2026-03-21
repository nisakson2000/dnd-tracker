/**
 * playerShortcuts.js
 * Player Mode: Quick action shortcuts and context menus
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// QUICK ACTION GROUPS
// ---------------------------------------------------------------------------

export const QUICK_ACTION_GROUPS = [
  {
    id: 'combat',
    label: 'Combat',
    actions: [
      { id: 'attack', label: 'Attack', icon: 'swords', color: '#fca5a5' },
      { id: 'cast_spell', label: 'Cast Spell', icon: 'wand', color: '#c4b5fd' },
      { id: 'dash', label: 'Dash', icon: 'zap', color: '#fbbf24' },
      { id: 'disengage', label: 'Disengage', icon: 'arrow-right', color: '#86efac' },
      { id: 'dodge', label: 'Dodge', icon: 'shield', color: '#60a5fa' },
      { id: 'help', label: 'Help', icon: 'users', color: '#f472b6' },
      { id: 'hide', label: 'Hide', icon: 'eye-off', color: '#a78bfa' },
      { id: 'ready', label: 'Ready', icon: 'clock', color: '#fbbf24' },
      { id: 'grapple', label: 'Grapple', icon: 'grip', color: '#f97316' },
      { id: 'shove', label: 'Shove', icon: 'arrow-right', color: '#d97706' },
    ],
  },
  {
    id: 'utility',
    label: 'Utility',
    actions: [
      { id: 'use_item', label: 'Use Item', icon: 'flask', color: '#86efac' },
      { id: 'use_feature', label: 'Use Feature', icon: 'sparkles', color: '#fde68a' },
      { id: 'end_concentration', label: 'Drop Concentration', icon: 'x-circle', color: '#60a5fa' },
      { id: 'second_wind', label: 'Second Wind', icon: 'heart', color: '#4ade80' },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    actions: [
      { id: 'whisper_dm', label: 'Whisper DM', icon: 'message-circle', color: '#a78bfa' },
      { id: 'suggest', label: 'Suggestion', icon: 'lightbulb', color: '#fbbf24' },
      { id: 'react', label: 'React', icon: 'smile', color: '#f472b6' },
    ],
  },
];

// ---------------------------------------------------------------------------
// CONTEXT MENU ITEMS (right-click or long-press on elements)
// ---------------------------------------------------------------------------

export const CONTEXT_MENUS = {
  spell: [
    { id: 'cast', label: 'Cast', icon: 'wand' },
    { id: 'upcast', label: 'Upcast...', icon: 'trending-up' },
    { id: 'details', label: 'View Details', icon: 'info' },
    { id: 'ritual', label: 'Cast as Ritual', icon: 'clock', condition: 'isRitual' },
  ],
  weapon: [
    { id: 'attack', label: 'Attack', icon: 'swords' },
    { id: 'attack_adv', label: 'Attack (Advantage)', icon: 'arrow-up' },
    { id: 'attack_dis', label: 'Attack (Disadvantage)', icon: 'arrow-down' },
    { id: 'details', label: 'Weapon Details', icon: 'info' },
  ],
  item: [
    { id: 'use', label: 'Use', icon: 'play' },
    { id: 'equip', label: 'Equip/Unequip', icon: 'package' },
    { id: 'drop', label: 'Drop', icon: 'trash' },
    { id: 'details', label: 'Item Details', icon: 'info' },
  ],
  condition: [
    { id: 'info', label: 'Condition Details', icon: 'info' },
    { id: 'remove', label: 'Remove Condition', icon: 'x' },
    { id: 'save', label: 'Make Save', icon: 'dice' },
  ],
};

/**
 * Get quick actions for the current context.
 */
export function getQuickActionsForContext(context) {
  if (context === 'combat') return QUICK_ACTION_GROUPS[0].actions;
  if (context === 'utility') return QUICK_ACTION_GROUPS[1].actions;
  if (context === 'social') return QUICK_ACTION_GROUPS[2].actions;
  return QUICK_ACTION_GROUPS.flatMap(g => g.actions);
}
