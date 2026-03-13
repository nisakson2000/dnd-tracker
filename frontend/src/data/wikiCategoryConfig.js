import {
  Heart, ScrollText, Star, Crosshair, Users, Globe, BookOpen,
  Flame, Shield, Gem, Compass, Sparkles, Skull, Map,
  Sword, Crown, Wand2, Layers, FileText, Landmark,
} from 'lucide-react';

/**
 * Single source of truth for wiki category visuals.
 * Every component imports from here instead of duplicating icon/color maps.
 */
export const CATEGORY_CONFIG = {
  'conditions':       { icon: Heart,      color: '#f97316', label: 'Conditions',       description: 'Status effects and afflictions' },
  'rules':            { icon: ScrollText, color: '#6366f1', label: 'Rules',            description: 'Core game mechanics and rulings' },
  'ability-scores':   { icon: Star,       color: '#eab308', label: 'Ability Scores',   description: 'The six core attributes' },
  'skills':           { icon: Crosshair,  color: '#22d3ee', label: 'Skills',           description: 'Proficiency-based checks' },
  'classes':          { icon: Users,      color: '#3b82f6', label: 'Classes',          description: 'Adventurer archetypes' },
  'subclasses':       { icon: Users,      color: '#60a5fa', label: 'Subclasses',       description: 'Specialized class paths' },
  'races':            { icon: Globe,      color: '#10b981', label: 'Races',            description: 'Playable species and lineages' },
  'backgrounds':      { icon: BookOpen,   color: '#14b8a6', label: 'Backgrounds',      description: 'Character origins and histories' },
  'feats':            { icon: Flame,      color: '#8b5cf6', label: 'Feats',            description: 'Special abilities and talents' },
  'equipment':        { icon: Shield,     color: '#6b7280', label: 'Equipment',        description: 'Weapons, armor, and gear' },
  'magic-items':      { icon: Gem,        color: '#f59e0b', label: 'Magic Items',      description: 'Enchanted treasures and artifacts' },
  'tools':            { icon: Compass,    color: '#78716c', label: 'Tools',            description: 'Artisan and specialist tools' },
  'spells':           { icon: Sparkles,   color: '#a78bfa', label: 'Spells',           description: 'Arcane and divine magic' },
  'monsters':         { icon: Skull,      color: '#ef4444', label: 'Monsters',         description: 'Creatures and adversaries' },
  'gods':             { icon: Crown,      color: '#fbbf24', label: 'Gods & Deities',   description: 'Divine pantheons and powers' },
  'planes':           { icon: Map,        color: '#06b6d4', label: 'Planes',           description: 'Realms of existence' },
  'languages':        { icon: ScrollText, color: '#a3a3a3', label: 'Languages',        description: 'Tongues of the multiverse' },
  'settings':         { icon: Globe,      color: '#34d399', label: 'Settings',         description: 'Campaign worlds' },
  'poisons':          { icon: Flame,      color: '#84cc16', label: 'Poisons',          description: 'Toxic substances' },
  'diseases':         { icon: Heart,      color: '#fb923c', label: 'Diseases',         description: 'Illness and plague' },
  'adventuring':      { icon: Compass,    color: '#2dd4bf', label: 'Adventuring',      description: 'Travel, exploration, and survival' },
  'combat':           { icon: Sword,      color: '#dc2626', label: 'Combat',           description: 'Battle rules and tactics' },
  'dm-tools':         { icon: BookOpen,   color: '#818cf8', label: 'DM Tools',         description: 'Dungeon Master resources' },
  'alignments':       { icon: Layers,     color: '#c084fc', label: 'Alignments',       description: 'Moral and ethical axes' },
  'schools-of-magic': { icon: Wand2,      color: '#c084fc', label: 'Schools of Magic', description: 'Arcane traditions' },
  'creature-types':   { icon: Skull,      color: '#fb7185', label: 'Creature Types',   description: 'Monster classifications' },
  'character-options':{ icon: Users,      color: '#38bdf8', label: 'Character Options', description: 'Optional player rules' },
  'notable-npcs':     { icon: Crown,      color: '#e879f9', label: 'Notable NPCs',     description: 'Famous characters of the realms' },
  'adventures':       { icon: Map,        color: '#fb923c', label: 'Adventures',       description: 'Published campaigns and modules' },
  'edition-history':  { icon: FileText,   color: '#94a3b8', label: 'Edition History',  description: 'Evolution of D&D' },
  'dm-reference':     { icon: Landmark,   color: '#a78bfa', label: 'DM Reference',     description: 'Quick reference tables and guides' },
  'homebrew':         { icon: Flame,      color: '#f472b6', label: 'Homebrew',         description: 'Popular house rules and variants' },
};

/** Get config for a category, with fallback for unknown categories. */
export function getCategoryConfig(category) {
  const key = (category || '').toLowerCase().replace(/\s+/g, '-');
  return CATEGORY_CONFIG[key] || {
    icon: BookOpen,
    color: '#c9a84c',
    label: category ? category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Unknown',
    description: '',
  };
}

/** All category keys sorted alphabetically. */
export const CATEGORY_KEYS = Object.keys(CATEGORY_CONFIG).sort();
