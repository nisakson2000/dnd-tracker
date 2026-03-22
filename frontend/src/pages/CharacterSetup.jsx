import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Dice5, RefreshCw, Info, Zap, Star, User, BookOpen, Sparkles, Plus, Trash2, GripVertical, Loader2, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoke } from '@tauri-apps/api/core';
import { getRuleset } from '../data/rulesets';
import { APP_VERSION } from '../version';
import { modStr } from '../utils/dndHelpers';
import { ABILITIES } from '../utils/dndHelpers';
import { PREMADE_CHARACTERS } from '../data/premadeCharacters';
import { generateAI, checkOllamaStatus } from '../api/assistant';

// ─── Constants ──────────────────────────────────────────────────────────────
const ABILITY_NAMES = { STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution', INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma' };
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
const POINT_BUY_COSTS = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
const POINT_BUY_TOTAL = 27;

const SKILL_ABILITIES = {
  'Acrobatics': 'DEX', 'Animal Handling': 'WIS', 'Arcana': 'INT', 'Athletics': 'STR',
  'Deception': 'CHA', 'History': 'INT', 'Insight': 'WIS', 'Intimidation': 'CHA',
  'Investigation': 'INT', 'Medicine': 'WIS', 'Nature': 'INT', 'Perception': 'WIS',
  'Performance': 'CHA', 'Persuasion': 'CHA', 'Religion': 'INT', 'Sleight of Hand': 'DEX',
  'Stealth': 'DEX', 'Survival': 'WIS',
};

// ─── Class & Race Tooltips ───────────────────────────────────────────────────

const CLASS_TOOLTIPS = {
  Barbarian:  { hitDie: 'd12', saves: 'STR, CON', flavor: 'A fierce warrior who channels primal rage into devastating attacks. Good at: Tanking, melee damage.' },
  Bard:       { hitDie: 'd8',  saves: 'DEX, CHA', flavor: 'A versatile performer whose music weaves magic. Good at: Support, utility, face skills.' },
  Cleric:     { hitDie: 'd8',  saves: 'WIS, CHA', flavor: 'A holy champion who channels divine power. Good at: Healing, support, turning undead.' },
  Druid:      { hitDie: 'd8',  saves: 'INT, WIS', flavor: 'A keeper of nature who can shapeshift into beasts. Good at: Control, versatility, Wild Shape.' },
  Fighter:    { hitDie: 'd10', saves: 'STR, CON', flavor: 'A master of martial combat with unmatched weapon skill. Good at: Tanking, damage dealing.' },
  Monk:       { hitDie: 'd8',  saves: 'STR, DEX', flavor: 'A martial artist harnessing the power of ki. Good at: Speed, stunning, evasion.' },
  Paladin:    { hitDie: 'd10', saves: 'WIS, CHA', flavor: 'A holy knight bound by a sacred oath. Good at: Burst damage (smite), healing, auras.' },
  Ranger:     { hitDie: 'd10', saves: 'STR, DEX', flavor: 'A wilderness warrior and tracker. Good at: Ranged combat, exploration, survival.' },
  Rogue:      { hitDie: 'd8',  saves: 'DEX, INT', flavor: 'A cunning scoundrel who strikes from the shadows. Good at: Sneak Attack, skills, stealth.' },
  Sorcerer:   { hitDie: 'd6',  saves: 'CON, CHA', flavor: 'A spellcaster born with innate magical power. Good at: Burst spells, Metamagic flexibility.' },
  Warlock:    { hitDie: 'd8',  saves: 'WIS, CHA', flavor: 'A wielder of eldritch power from a patron pact. Good at: Eldritch Blast, short rest recovery.' },
  Wizard:     { hitDie: 'd6',  saves: 'INT, WIS', flavor: 'A scholarly mage with an unmatched spell library. Good at: Spell variety, control, ritual casting.' },
};

const RACE_TOOLTIPS = {
  Human:      { flavor: 'Versatile and ambitious. Adaptable to any class.', perks: '+1 to all abilities (Standard) or +1 to two & a feat (Variant).' },
  Dwarf:      { flavor: 'Stout and resilient. Born from stone.', perks: 'CON +2, poison resistance, darkvision 60 ft.' },
  Elf:        { flavor: 'Graceful and long-lived. Attuned to magic.', perks: 'DEX +2, fey ancestry, darkvision 60 ft, trance.' },
  Halfling:   { flavor: 'Small but brave and incredibly lucky.', perks: 'DEX +2, Lucky (reroll natural 1s), brave.' },
  'Half-Elf': { flavor: 'Charming and versatile, blending two heritages.', perks: 'CHA +2, +1 to two others, two bonus skills.' },
  'Half-Orc': { flavor: 'Fierce and enduring. Hard to keep down.', perks: 'STR +2, CON +1, Relentless Endurance, Savage Attacks.' },
  Gnome:      { flavor: 'Curious and inventive tinkerers.', perks: 'INT +2, advantage on INT/WIS/CHA saves vs. magic.' },
  Dragonborn: { flavor: 'Proud descendants of dragons.', perks: 'STR +2, CHA +1, breath weapon, damage resistance.' },
  Tiefling:   { flavor: 'Infernal heritage grants dark power.', perks: 'CHA +2, INT +1, fire resistance, innate spellcasting.' },
};

// ─── Quick Start Presets ─────────────────────────────────────────────────────

const QUICK_START_PRESETS = [
  // --- Core class/race combos ---
  {
    name: 'Classic Fighter',
    icon: '⚔',
    desc: 'A stalwart warrior with heavy armor and a greatsword.',
    targetClass: 'Fighter',
    targetRace: 'Human',
    scores: { STR: 16, DEX: 12, CON: 14, INT: 10, WIS: 13, CHA: 8 },
    skills: ['Athletics', 'Perception'],
    background: 'Soldier',
  },
  {
    name: 'Elven Wizard',
    icon: '🧙',
    desc: 'A scholarly mage wielding arcane power with elven grace.',
    targetClass: 'Wizard',
    targetRace: 'Elf',
    scores: { STR: 8, DEX: 14, CON: 13, INT: 16, WIS: 12, CHA: 10 },
    skills: ['Arcana', 'Investigation'],
    background: 'Sage',
  },
  {
    name: 'Halfling Rogue',
    icon: '🗡',
    desc: 'A nimble trickster who slips past danger unseen.',
    targetClass: 'Rogue',
    targetRace: 'Halfling',
    scores: { STR: 8, DEX: 16, CON: 12, INT: 13, WIS: 10, CHA: 14 },
    skills: ['Stealth', 'Sleight of Hand', 'Perception', 'Deception'],
    background: 'Criminal',
  },
  {
    name: 'Dwarven Cleric',
    icon: '🛡',
    desc: 'A stout healer in heavy mail, channeling divine wrath.',
    targetClass: 'Cleric',
    targetRace: 'Dwarf',
    scores: { STR: 14, DEX: 10, CON: 14, INT: 8, WIS: 16, CHA: 12 },
    skills: ['Medicine', 'Insight'],
    background: 'Acolyte',
  },
  {
    name: 'Tiefling Warlock',
    icon: '🔥',
    desc: 'A charismatic pact-wielder with infernal heritage.',
    targetClass: 'Warlock',
    targetRace: 'Tiefling',
    scores: { STR: 8, DEX: 14, CON: 12, INT: 10, WIS: 13, CHA: 16 },
    skills: ['Deception', 'Arcana'],
    background: 'Charlatan',
  },
  {
    name: 'Half-Orc Barbarian',
    icon: '🪓',
    desc: 'A raging berserker who thrives in the chaos of battle.',
    targetClass: 'Barbarian',
    targetRace: 'Half-Orc',
    scores: { STR: 16, DEX: 13, CON: 14, INT: 8, WIS: 12, CHA: 10 },
    skills: ['Athletics', 'Intimidation'],
    background: 'Outlander',
  },
  // --- Expanded race/class templates ---
  {
    name: 'Gnome Artificer',
    icon: '🔧',
    desc: 'A brilliant inventor who infuses objects with magical power.',
    targetClass: 'Wizard',
    targetRace: 'Gnome',
    scores: { STR: 8, DEX: 13, CON: 14, INT: 16, WIS: 12, CHA: 10 },
    skills: ['Arcana', 'Investigation'],
    background: 'Guild Artisan',
  },
  {
    name: 'Dragonborn Paladin',
    icon: '🐉',
    desc: 'A holy knight with draconic heritage, smiting evil with divine fury.',
    targetClass: 'Paladin',
    targetRace: 'Dragonborn',
    scores: { STR: 16, DEX: 10, CON: 12, INT: 8, WIS: 13, CHA: 14 },
    skills: ['Athletics', 'Persuasion'],
    background: 'Noble',
  },
  {
    name: 'Wood Elf Ranger',
    icon: '🏹',
    desc: 'A wilderness tracker who strikes from the shadows of the forest.',
    targetClass: 'Ranger',
    targetRace: 'Elf',
    scores: { STR: 12, DEX: 16, CON: 13, INT: 10, WIS: 14, CHA: 8 },
    skills: ['Stealth', 'Survival', 'Perception'],
    background: 'Outlander',
  },
  {
    name: 'Half-Elf Bard',
    icon: '🎵',
    desc: 'A silver-tongued performer who charms allies and confounds foes.',
    targetClass: 'Bard',
    targetRace: 'Half-Elf',
    scores: { STR: 8, DEX: 14, CON: 12, INT: 10, WIS: 13, CHA: 16 },
    skills: ['Persuasion', 'Performance', 'Deception'],
    background: 'Entertainer',
  },
  {
    name: 'Human Monk',
    icon: '👊',
    desc: 'A disciplined martial artist who channels ki into devastating strikes.',
    targetClass: 'Monk',
    targetRace: 'Human',
    scores: { STR: 10, DEX: 16, CON: 13, INT: 8, WIS: 14, CHA: 12 },
    skills: ['Acrobatics', 'Stealth'],
    background: 'Hermit',
  },
  {
    name: 'Elven Druid',
    icon: '🌿',
    desc: 'A guardian of the wild who shapeshifts into beasts and commands nature.',
    targetClass: 'Druid',
    targetRace: 'Elf',
    scores: { STR: 10, DEX: 14, CON: 13, INT: 12, WIS: 16, CHA: 8 },
    skills: ['Nature', 'Perception'],
    background: 'Hermit',
  },
  {
    name: 'Tiefling Sorcerer',
    icon: '✨',
    desc: 'Born with innate magical power fueled by infernal blood.',
    targetClass: 'Sorcerer',
    targetRace: 'Tiefling',
    scores: { STR: 8, DEX: 13, CON: 14, INT: 10, WIS: 12, CHA: 16 },
    skills: ['Arcana', 'Persuasion'],
    background: 'Sage',
  },
  {
    name: 'Dwarven Fighter',
    icon: '🪖',
    desc: 'An iron-willed defender wielding axe and shield with dwarven tenacity.',
    targetClass: 'Fighter',
    targetRace: 'Dwarf',
    scores: { STR: 16, DEX: 10, CON: 14, INT: 12, WIS: 13, CHA: 8 },
    skills: ['Athletics', 'Intimidation'],
    background: 'Soldier',
  },
  {
    name: 'Halfling Bard',
    icon: '🪕',
    desc: 'A cheerful storyteller whose music inspires courage and mends wounds.',
    targetClass: 'Bard',
    targetRace: 'Halfling',
    scores: { STR: 8, DEX: 14, CON: 12, INT: 10, WIS: 13, CHA: 16 },
    skills: ['Performance', 'Persuasion', 'Insight'],
    background: 'Entertainer',
  },
  {
    name: 'Human Paladin',
    icon: '⚜',
    desc: 'A righteous champion bound by a sacred oath to defend the innocent.',
    targetClass: 'Paladin',
    targetRace: 'Human',
    scores: { STR: 16, DEX: 10, CON: 13, INT: 8, WIS: 12, CHA: 14 },
    skills: ['Athletics', 'Persuasion'],
    background: 'Acolyte',
  },
  {
    name: 'Gnome Rogue',
    icon: '🔍',
    desc: 'A tiny master of misdirection — what you can\'t see can definitely hurt you.',
    targetClass: 'Rogue',
    targetRace: 'Gnome',
    scores: { STR: 8, DEX: 16, CON: 12, INT: 14, WIS: 10, CHA: 13 },
    skills: ['Stealth', 'Investigation', 'Sleight of Hand', 'Perception'],
    background: 'Urchin',
  },
];

// ─── Backstory Constants ────────────────────────────────────────────────────

const RELATIONSHIP_TYPES = ['Family', 'Friend', 'Mentor', 'Rival', 'Enemy', 'Lover', 'Employer', 'Ally', 'Contact', 'Other'];
const NPC_STATUSES = ['Alive', 'Dead', 'Missing', 'Unknown', 'Estranged'];
const MOTIVATION_PRESETS = ['Revenge', 'Redemption', 'Knowledge', 'Power', 'Wealth', 'Protection', 'Freedom', 'Justice', 'Glory', 'Love', 'Duty', 'Survival', 'Discovery'];

/* ── Standard 5e Background Presets (for 2014 edition catalog) ── */
const BACKGROUND_PRESETS_5E = [
  { name: 'Acolyte', featureName: 'Shelter of the Faithful', featureDesc: 'You command the respect of those who share your faith, and you can perform religious ceremonies. You and your companions can expect free healing and care at temples of your faith.' },
  { name: 'Charlatan', featureName: 'False Identity', featureDesc: 'You have created a second identity with documentation, acquaintances, and disguises. You can also forge documents if you have seen an example.' },
  { name: 'Criminal', featureName: 'Criminal Contact', featureDesc: 'You have a reliable contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact over great distances.' },
  { name: 'Entertainer', featureName: 'By Popular Demand', featureDesc: 'You can always find a place to perform. You receive free lodging and food of modest or comfortable standard, as long as you perform each night.' },
  { name: 'Folk Hero', featureName: 'Rustic Hospitality', featureDesc: 'You fit in among common folk with ease. You can find a place to hide, rest, or recuperate among commoners, unless you have shown yourself to be a danger.' },
  { name: 'Guild Artisan', featureName: 'Guild Membership', featureDesc: 'As an established guild member, you can rely on benefits of membership. Fellow guild members will provide lodging and food if necessary.' },
  { name: 'Hermit', featureName: 'Discovery', featureDesc: 'Your extended hermitage gave you access to a unique and powerful discovery — a great truth, a hidden site, a long-forgotten fact, or an unearthed relic.' },
  { name: 'Noble', featureName: 'Position of Privilege', featureDesc: 'People are inclined to think the best of you. You are welcome in high society, and common folk make every effort to accommodate you.' },
  { name: 'Outlander', featureName: 'Wanderer', featureDesc: 'You have an excellent memory for maps and geography. You can find food and fresh water for yourself and up to five others each day in the wild.' },
  { name: 'Sage', featureName: 'Researcher', featureDesc: 'When you attempt to learn or recall lore, if you don\'t know the information, you often know where and from whom you can obtain it.' },
  { name: 'Sailor', featureName: 'Ship\'s Passage', featureDesc: 'You can secure free passage on a sailing ship for yourself and your companions, though you can\'t guarantee a schedule or route.' },
  { name: 'Soldier', featureName: 'Military Rank', featureDesc: 'Soldiers loyal to your former organization still recognize your authority. You can invoke your rank to influence other soldiers and requisition simple equipment.' },
  { name: 'Urchin', featureName: 'City Secrets', featureDesc: 'You know secret patterns and flow of cities. When not in combat, you and companions you lead can travel between two city locations twice as fast.' },
];

const GUIDED_PROMPTS = [
  { key: 'origin', label: 'Where were you born and raised?', placeholder: 'A small fishing village on the Sword Coast...' },
  { key: 'family', label: 'Who raised you? What was your family like?', placeholder: 'My mother was a blacksmith, my father a traveling merchant...' },
  { key: 'defining', label: 'What was the defining moment that set you on this path?', placeholder: 'The night the raiders came and burned everything...' },
  { key: 'person', label: 'Who is the most important person in your life?', placeholder: 'My older sister, who taught me everything I know...' },
  { key: 'fear', label: 'What is your greatest fear?', placeholder: 'That I\'ll become the very thing I swore to destroy...' },
  { key: 'desire', label: 'What do you want more than anything?', placeholder: 'To find the lost heirloom my family was sworn to protect...' },
  { key: 'secret', label: 'What secret do you carry?', placeholder: 'I once made a deal with a fiend in a moment of desperation...' },
];

const MAX_REROLLS = 3; // Common house rule: 3 rerolls for 4d6 method

function mod(score) {
  return Math.floor((score - 10) / 2);
}

function roll4d6DropLowest() {
  const dice = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  dice.sort((a, b) => b - a);
  return { dice, total: dice[0] + dice[1] + dice[2] };
}

// ─── Shared styles ──────────────────────────────────────────────────────────

const accent = '#c9a84c';
const cardStyle = {
  borderRadius: 12, padding: '18px 20px',
  background: 'rgba(11,9,20,0.9)',
  border: '1px solid rgba(201,168,76,0.15)',
};

// ─── Tooltip Component ───────────────────────────────────────────────────────

function InfoTooltip({ text, style: extraStyle }) {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'help', ...extraStyle }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Info size={13} style={{ color: 'rgba(200,175,130,0.35)', flexShrink: 0 }} />
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
              marginBottom: 8, padding: '10px 14px', borderRadius: 8, width: 260, zIndex: 100,
              background: 'rgba(20,17,35,0.97)', border: '1px solid rgba(201,168,76,0.25)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              fontSize: 11, lineHeight: 1.6, color: 'rgba(200,175,130,0.7)',
              pointerEvents: 'none',
            }}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

// ─── Class/Race Info Banner ──────────────────────────────────────────────────

function ClassRaceInfoBanner({ overview }) {
  const [expanded, setExpanded] = useState(false);
  const className = overview?.primary_class || '';
  const raceName = overview?.race || '';
  const ct = CLASS_TOOLTIPS[className];
  const rt = RACE_TOOLTIPS[raceName];

  if (!ct && !rt) return null;

  return (
    <div style={{
      ...cardStyle, padding: '12px 16px', marginBottom: 16,
      background: 'rgba(201,168,76,0.03)', borderColor: 'rgba(201,168,76,0.12)',
      cursor: 'pointer',
    }} onClick={() => setExpanded(e => !e)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Info size={14} style={{ color: accent, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-heading)', color: 'rgba(200,175,130,0.5)', letterSpacing: '0.05em' }}>
            {className && raceName ? `${raceName} ${className}` : className || raceName} — Quick Reference
          </span>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: 'rgba(200,175,130,0.3)', fontSize: 10 }}
        >
          ▼
        </motion.span>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ct && (
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', textTransform: 'uppercase', color: accent, marginBottom: 4 }}>{className}</div>
                  <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.55)', lineHeight: 1.6 }}>
                    Hit Die: <span style={{ color: '#efe0c0', fontFamily: 'var(--font-mono)' }}>{ct.hitDie}</span>
                    {' | '}Saves: <span style={{ color: '#efe0c0', fontFamily: 'var(--font-mono)' }}>{ct.saves}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.4)', marginTop: 2 }}>{ct.flavor}</div>
                </div>
              )}
              {rt && (
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', textTransform: 'uppercase', color: accent, marginBottom: 4 }}>{raceName}</div>
                  <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.55)', lineHeight: 1.6 }}>{rt.perks}</div>
                  <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.4)', marginTop: 2 }}>{rt.flavor}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Step: Name & Identity ──────────────────────────────────────────────────

const PORTRAIT_MAX_SIZE = 2 * 1024 * 1024; // 2MB
const PORTRAIT_ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

function StepNameIdentity({ identity, setIdentity, characterName }) {
  const update = (field, value) => setIdentity(prev => ({ ...prev, [field]: value }));
  const portraitInputRef = useRef(null);
  const [portraitDragOver, setPortraitDragOver] = useState(false);

  const handlePortraitFile = (file) => {
    if (!file) return;
    if (!PORTRAIT_ACCEPTED.includes(file.type)) {
      toast.error('Only PNG, JPEG, WebP, and GIF images are supported.');
      return;
    }
    if (file.size > PORTRAIT_MAX_SIZE) {
      toast.error('Image must be under 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update('portrait', reader.result);
    reader.onerror = () => toast.error('Failed to read image file.');
    reader.readAsDataURL(file);
  };

  const handlePortraitDrop = (e) => {
    e.preventDefault();
    setPortraitDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handlePortraitFile(file);
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}><User size={28} style={{ color: accent }} /></div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#efe0c0', marginBottom: 4 }}>
          Name & Identity
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)' }}>
          Who is your character? Start with the basics.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Character Name (read-only, set during character creation) */}
        <div style={{ ...cardStyle, padding: '12px 16px' }}>
          <label style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 6, display: 'block' }}>Character Name</label>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: '#efe0c0', fontWeight: 700 }}>
            {characterName || 'Unknown'}
          </div>
        </div>

        {/* Character Portrait */}
        <div style={{ ...cardStyle, padding: '12px 16px' }}>
          <label style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 8, display: 'block' }}>Character Portrait</label>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            {identity.portrait && (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={identity.portrait}
                  alt="Portrait"
                  style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', border: '2px solid rgba(201,168,76,0.3)' }}
                />
                <button
                  onClick={() => update('portrait', null)}
                  style={{
                    position: 'absolute', top: -6, right: -6, width: 20, height: 20,
                    borderRadius: '50%', border: '1px solid rgba(248,113,113,0.5)',
                    background: 'rgba(127,29,29,0.8)', color: '#fca5a5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: 10, padding: 0,
                  }}
                  title="Remove portrait"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            )}
            <div
              onClick={() => portraitInputRef.current?.click()}
              onDrop={handlePortraitDrop}
              onDragOver={e => { e.preventDefault(); setPortraitDragOver(true); }}
              onDragLeave={() => setPortraitDragOver(false)}
              style={{
                flex: 1, minHeight: 80, borderRadius: 8,
                border: `2px dashed ${portraitDragOver ? accent : 'rgba(201,168,76,0.15)'}`,
                background: portraitDragOver ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                transition: 'all 0.15s',
              }}
            >
              <ImagePlus size={22} style={{ color: 'rgba(200,175,130,0.25)' }} />
              <span style={{ fontSize: 11, color: 'rgba(200,175,130,0.35)' }}>
                {identity.portrait ? 'Click or drag to replace' : 'Click or drag an image'}
              </span>
              <span style={{ fontSize: 9, color: 'rgba(200,175,130,0.2)' }}>PNG, JPEG, WebP, GIF — max 2 MB</span>
            </div>
            <input
              ref={portraitInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={e => { handlePortraitFile(e.target.files?.[0]); e.target.value = ''; }}
            />
          </div>
        </div>

        {/* Aliases & Titles */}
        <div style={{ ...cardStyle, padding: '12px 16px' }}>
          <label style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 6, display: 'block' }}>Aliases & Titles</label>
          <input
            type="text"
            value={identity.aliases || ''}
            onChange={e => update('aliases', e.target.value)}
            placeholder='e.g. "The Shadow", "Lord Ashwick", "Patches"'
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 8, padding: '8px 12px', color: '#efe0c0', fontFamily: 'var(--font-ui)', fontSize: 13, outline: 'none' }}
          />
        </div>

        {/* Two-column: Age & Gender */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ ...cardStyle, padding: '12px 16px' }}>
            <label style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 6, display: 'block' }}>Age</label>
            <input
              type="text"
              value={identity.age || ''}
              onChange={e => update('age', e.target.value)}
              placeholder="e.g. 28, 150, Ancient"
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 8, padding: '8px 12px', color: '#efe0c0', fontFamily: 'var(--font-ui)', fontSize: 13, outline: 'none' }}
            />
          </div>
          <div style={{ ...cardStyle, padding: '12px 16px' }}>
            <label style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 6, display: 'block' }}>Gender & Pronouns</label>
            <input
              type="text"
              value={identity.gender || ''}
              onChange={e => update('gender', e.target.value)}
              placeholder="e.g. Male (he/him)"
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 8, padding: '8px 12px', color: '#efe0c0', fontFamily: 'var(--font-ui)', fontSize: 13, outline: 'none' }}
            />
          </div>
        </div>

        {/* Appearance row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { key: 'height', label: 'Height', placeholder: "5'10\"" },
            { key: 'weight', label: 'Weight', placeholder: '170 lbs' },
            { key: 'eyes', label: 'Eyes', placeholder: 'Green' },
          ].map(f => (
            <div key={f.key} style={{ ...cardStyle, padding: '12px 16px' }}>
              <label style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 6, display: 'block' }}>{f.label}</label>
              <input
                type="text"
                value={identity[f.key] || ''}
                onChange={e => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 8, padding: '8px 12px', color: '#efe0c0', fontFamily: 'var(--font-ui)', fontSize: 13, outline: 'none' }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { key: 'hair', label: 'Hair', placeholder: 'Long, dark brown' },
            { key: 'skin', label: 'Skin', placeholder: 'Tanned, weathered' },
          ].map(f => (
            <div key={f.key} style={{ ...cardStyle, padding: '12px 16px' }}>
              <label style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 6, display: 'block' }}>{f.label}</label>
              <input
                type="text"
                value={identity[f.key] || ''}
                onChange={e => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 8, padding: '8px 12px', color: '#efe0c0', fontFamily: 'var(--font-ui)', fontSize: 13, outline: 'none' }}
              />
            </div>
          ))}
        </div>

        {/* Physical Description */}
        <div style={{ ...cardStyle, padding: '12px 16px' }}>
          <label style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 6, display: 'block' }}>Physical Description</label>
          <textarea
            value={identity.physicalDescription || ''}
            onChange={e => update('physicalDescription', e.target.value)}
            placeholder="Distinguishing marks, scars, tattoos, build, posture, clothing style..."
            rows={3}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 8, padding: '8px 12px', color: '#efe0c0', fontFamily: 'var(--font-ui)', fontSize: 13, outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step: Backstory & Lore ─────────────────────────────────────────────────

function StepBackstoryLore({ backstoryData, setBackstoryData, overview }) {
  const [mode, setMode] = useState(backstoryData.mode || 'free');
  const [aiStatus, setAiStatus] = useState(null); // null = unchecked, 'checking', 'available', 'unavailable'
  const [analyzing, setAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const analysisAbortRef = useRef(false);

  const update = (field, value) => setBackstoryData(prev => ({ ...prev, [field]: value }));

  // Check Ollama status on mount
  useEffect(() => {
    setAiStatus('checking');
    checkOllamaStatus().then(status => {
      setAiStatus(status.available && status.modelInstalled ? 'available' : 'unavailable');
    }).catch(() => setAiStatus('unavailable'));
  }, []);

  // Guided mode helpers
  const guidedResponses = backstoryData.guidedResponses || {};
  const updateGuided = (key, value) => {
    const next = { ...guidedResponses, [key]: value };
    update('guidedResponses', next);
    // Combine guided responses into backstory text
    const combined = GUIDED_PROMPTS
      .filter(p => next[p.key]?.trim())
      .map(p => next[p.key].trim())
      .join('\n\n');
    update('text', combined);
  };

  const backstoryText = backstoryData.text || '';
  const wordCount = backstoryText.trim() ? backstoryText.trim().split(/\s+/).length : 0;
  const complexityLabel = wordCount < 100 ? 'Brief' : wordCount < 300 ? 'Standard' : wordCount < 600 ? 'Detailed' : 'Epic';

  // NPC list management
  const npcs = backstoryData.npcs || [];
  const addNpcEntry = () => {
    update('npcs', [...npcs, { id: Date.now(), name: '', relationship: 'Friend', status: 'Alive', description: '' }]);
  };
  const updateNpc = (id, field, value) => {
    update('npcs', npcs.map(n => n.id === id ? { ...n, [field]: value } : n));
  };
  const removeNpc = (id) => {
    update('npcs', npcs.filter(n => n.id !== id));
  };

  // Life events management
  const lifeEvents = backstoryData.lifeEvents || [];
  const addLifeEvent = () => {
    update('lifeEvents', [...lifeEvents, { id: Date.now(), age: '', title: '', description: '' }]);
  };
  const updateLifeEvent = (id, field, value) => {
    update('lifeEvents', lifeEvents.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  const removeLifeEvent = (id) => {
    update('lifeEvents', lifeEvents.filter(e => e.id !== id));
  };

  // AI Analysis
  const runAnalysis = async () => {
    if (wordCount < 50) {
      toast('Write at least 50 words before analyzing.', { icon: '✏️' });
      return;
    }
    setAnalyzing(true);
    analysisAbortRef.current = false;

    try {
      const systemPrompt = `You are a D&D character backstory analyzer. Given a character's backstory and basic info, extract structured data. Return ONLY valid JSON with this exact shape:
{
  "npcs": [{"name": "string", "relationship": "Family|Friend|Mentor|Rival|Enemy|Lover|Employer|Ally|Contact|Other", "status": "Alive|Dead|Missing|Unknown|Estranged", "description": "1 sentence"}],
  "plot_hooks": [{"title": "string", "description": "1-2 sentences", "type": "personal|mystery|combat|social|exploration"}],
  "motivations": {"short_term": "string", "long_term": "string", "driving": "string"},
  "personality": {"traits": ["string"], "ideals": ["string"], "bonds": ["string"], "flaws": ["string"]},
  "themes": ["string"],
  "locations": [{"name": "string", "significance": "1 sentence"}]
}
Do NOT include any text outside the JSON object. Extract only what is explicitly or strongly implied in the backstory.`;

      const userPrompt = `Character: ${overview?.name || 'Unknown'}, ${overview?.race || 'Unknown'} ${overview?.primary_class || 'Unknown'}, Level 1
Background: ${overview?.background || 'Unknown'}

Backstory:
${backstoryText}

Analyze this backstory and extract NPCs, plot hooks, motivations, personality traits, themes, and locations. Return ONLY JSON.`;

      const result = await generateAI(userPrompt, systemPrompt, {
        maxTokens: 1500,
        temperature: 0.3,
      });

      if (analysisAbortRef.current) return;

      // Parse JSON from response
      const responseText = typeof result === 'string' ? result : result?.response || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        toast.error('AI returned an unexpected format. Try again.');
        return;
      }

      let raw = jsonMatch[0];
      raw = raw.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        toast.error('AI returned malformed JSON. Try again.');
        return;
      }
      setAiSuggestions(parsed);
      toast.success('Backstory analyzed! Review the suggestions below.');
    } catch (err) {
      if (!analysisAbortRef.current) {
        toast.error(`Analysis failed: ${err.message || 'Check Ollama connection'}`);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  // Accept AI suggestions
  const acceptNpcs = () => {
    if (!aiSuggestions?.npcs?.length) return;
    const newNpcs = aiSuggestions.npcs.map((n, i) => ({
      id: Date.now() + i,
      name: n.name,
      relationship: n.relationship || 'Other',
      status: n.status || 'Alive',
      description: n.description || '',
      aiSuggested: true,
    }));
    const existing = backstoryData.npcs || [];
    update('npcs', [...existing, ...newNpcs]);
    setAiSuggestions(prev => ({ ...prev, npcs: [] }));
    toast.success(`Added ${newNpcs.length} NPCs`);
  };

  const acceptMotivations = () => {
    if (!aiSuggestions?.motivations) return;
    update('motivations', aiSuggestions.motivations);
    setAiSuggestions(prev => ({ ...prev, motivations: null }));
    toast.success('Motivations applied');
  };

  const acceptPersonality = () => {
    if (!aiSuggestions?.personality) return;
    update('personality', aiSuggestions.personality);
    setAiSuggestions(prev => ({ ...prev, personality: null }));
    toast.success('Personality traits applied');
  };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 8, padding: '8px 12px', color: '#efe0c0', fontFamily: 'var(--font-ui)', fontSize: 13, outline: 'none' };
  const labelStyle = { fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 6, display: 'block' };

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}><BookOpen size={28} style={{ color: accent }} /></div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#efe0c0', marginBottom: 4 }}>
          Backstory & Lore
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)' }}>
          Tell your character's story. This step is optional — you can always add it later.
        </p>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, justifyContent: 'center' }}>
        {[{ id: 'free', label: 'Free Write' }, { id: 'guided', label: 'Guided' }].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{
              padding: '6px 18px', borderRadius: 99, border: 'none', cursor: 'pointer',
              background: mode === m.id ? `${accent}25` : 'rgba(255,255,255,0.04)',
              color: mode === m.id ? accent : 'rgba(200,175,130,0.4)',
              fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.06em',
              transition: 'all 0.15s',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Free Write Mode */}
      {mode === 'free' && (
        <div style={{ ...cardStyle, padding: '16px' }}>
          <textarea
            value={backstoryText}
            onChange={e => update('text', e.target.value)}
            placeholder="Tell your character's story... Where did they come from? What shaped them? What drives them forward?"
            rows={10}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, minHeight: 200, fontSize: 13 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(200,175,130,0.3)' }}>
              {wordCount} words — {complexityLabel}
            </span>
            <div style={{ width: 100, height: 3, borderRadius: 2, background: 'rgba(201,168,76,0.1)', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (wordCount / 600) * 100)}%`, height: '100%', borderRadius: 2, background: accent, transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>
      )}

      {/* Guided Mode */}
      {mode === 'guided' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GUIDED_PROMPTS.map(p => (
            <div key={p.key} style={{ ...cardStyle, padding: '14px 16px' }}>
              <label style={{ ...labelStyle, fontSize: 11, letterSpacing: '0.03em', textTransform: 'none', color: 'rgba(200,175,130,0.55)', marginBottom: 8 }}>
                {p.label}
              </label>
              <textarea
                value={guidedResponses[p.key] || ''}
                onChange={e => updateGuided(p.key, e.target.value)}
                placeholder={p.placeholder}
                rows={2}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Personality Traits */}
      <div style={{ marginTop: 20 }}>
        <div style={{ ...labelStyle, marginBottom: 10, fontSize: 10 }}>Personality</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { key: 'traits', label: 'Personality Traits', placeholder: 'I always have a plan for what to do when things go wrong...', color: '#60a5fa' },
            { key: 'ideals', label: 'Ideals', placeholder: 'Freedom. Everyone should be free to pursue their own livelihood...', color: accent },
            { key: 'bonds', label: 'Bonds', placeholder: 'I owe everything to my mentor, who saved me from the streets...', color: '#4ade80' },
            { key: 'flaws', label: 'Flaws', placeholder: 'I have trouble trusting anyone who isn\'t in my inner circle...', color: '#f87171' },
          ].map(t => (
            <div key={t.key} style={{ ...cardStyle, padding: '12px 14px', borderColor: `${t.color}20` }}>
              <label style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', textTransform: 'uppercase', color: t.color, marginBottom: 6, display: 'block', opacity: 0.7 }}>{t.label}</label>
              <textarea
                value={(backstoryData.personality || {})[t.key]?.join?.('\n') || (backstoryData.personality || {})[t.key] || ''}
                onChange={e => {
                  const personality = { ...(backstoryData.personality || {}) };
                  personality[t.key] = e.target.value;
                  update('personality', personality);
                }}
                placeholder={t.placeholder}
                rows={2}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5, fontSize: 12, borderColor: `${t.color}15` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Motivations */}
      <div style={{ marginTop: 20 }}>
        <div style={{ ...labelStyle, marginBottom: 10, fontSize: 10 }}>Motivations & Goals</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ ...cardStyle, padding: '12px 14px' }}>
              <label style={{ ...labelStyle }}>Short-term Goal</label>
              <input
                type="text"
                value={(backstoryData.motivations || {}).short_term || ''}
                onChange={e => update('motivations', { ...(backstoryData.motivations || {}), short_term: e.target.value })}
                placeholder="Find the missing merchant"
                style={inputStyle}
              />
            </div>
            <div style={{ ...cardStyle, padding: '12px 14px' }}>
              <label style={{ ...labelStyle }}>Long-term Goal</label>
              <input
                type="text"
                value={(backstoryData.motivations || {}).long_term || ''}
                onChange={e => update('motivations', { ...(backstoryData.motivations || {}), long_term: e.target.value })}
                placeholder="Restore my family's honor"
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ ...cardStyle, padding: '12px 14px' }}>
            <label style={{ ...labelStyle }}>Driving Motivation</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
              {MOTIVATION_PRESETS.map(m => {
                const sel = (backstoryData.motivations || {}).driving === m;
                return (
                  <button
                    key={m}
                    onClick={() => update('motivations', { ...(backstoryData.motivations || {}), driving: m })}
                    style={{
                      padding: '3px 10px', borderRadius: 99, border: 'none', cursor: 'pointer',
                      background: sel ? `${accent}25` : 'rgba(255,255,255,0.04)',
                      color: sel ? accent : 'rgba(200,175,130,0.35)',
                      fontFamily: 'var(--font-heading)', fontSize: 10, transition: 'all 0.15s',
                    }}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* NPC Relationships */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ ...labelStyle, marginBottom: 0, fontSize: 10 }}>NPC Relationships</span>
          <button onClick={addNpcEntry} style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: accent, fontFamily: 'var(--font-heading)', fontSize: 10 }}>
            <Plus size={12} /> Add NPC
          </button>
        </div>
        {npcs.length === 0 && (
          <div style={{ ...cardStyle, padding: '16px', textAlign: 'center', color: 'rgba(200,175,130,0.25)', fontSize: 12 }}>
            No NPCs yet — add allies, enemies, mentors, or family members.
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {npcs.map(npc => (
            <div key={npc.id} style={{ ...cardStyle, padding: '12px 14px' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  type="text"
                  value={npc.name}
                  onChange={e => updateNpc(npc.id, 'name', e.target.value)}
                  placeholder="NPC Name"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <select
                  value={npc.relationship}
                  onChange={e => updateNpc(npc.id, 'relationship', e.target.value)}
                  style={{ ...inputStyle, width: 'auto', minWidth: 100, cursor: 'pointer' }}
                >
                  {RELATIONSHIP_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select
                  value={npc.status}
                  onChange={e => updateNpc(npc.id, 'status', e.target.value)}
                  style={{ ...inputStyle, width: 'auto', minWidth: 90, cursor: 'pointer' }}
                >
                  {NPC_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => removeNpc(npc.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(248,113,113,0.5)', padding: 4, flexShrink: 0 }}>
                  <Trash2 size={14} />
                </button>
              </div>
              <input
                type="text"
                value={npc.description}
                onChange={e => updateNpc(npc.id, 'description', e.target.value)}
                placeholder="Brief description of this NPC and their connection to you..."
                style={{ ...inputStyle, fontSize: 12 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Key Life Events */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ ...labelStyle, marginBottom: 0, fontSize: 10 }}>Key Life Events</span>
          <button onClick={addLifeEvent} style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: accent, fontFamily: 'var(--font-heading)', fontSize: 10 }}>
            <Plus size={12} /> Add Event
          </button>
        </div>
        {lifeEvents.length === 0 && (
          <div style={{ ...cardStyle, padding: '16px', textAlign: 'center', color: 'rgba(200,175,130,0.25)', fontSize: 12 }}>
            No life events yet — add pivotal moments from your character's past.
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {lifeEvents.map(evt => (
            <div key={evt.id} style={{ ...cardStyle, padding: '12px 14px' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="text"
                  value={evt.age}
                  onChange={e => updateLifeEvent(evt.id, 'age', e.target.value)}
                  placeholder="Age"
                  style={{ ...inputStyle, width: 60, textAlign: 'center', flexShrink: 0 }}
                />
                <input
                  type="text"
                  value={evt.title}
                  onChange={e => updateLifeEvent(evt.id, 'title', e.target.value)}
                  placeholder="Event title (e.g. 'First Battle')"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button onClick={() => removeLifeEvent(evt.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(248,113,113,0.5)', padding: 4, flexShrink: 0 }}>
                  <Trash2 size={14} />
                </button>
              </div>
              <input
                type="text"
                value={evt.description}
                onChange={e => updateLifeEvent(evt.id, 'description', e.target.value)}
                placeholder="What happened?"
                style={{ ...inputStyle, fontSize: 12, marginTop: 6 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* AI Analysis Section */}
      <div style={{ marginTop: 24, borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Sparkles size={16} style={{ color: accent }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: '#efe0c0', letterSpacing: '0.04em' }}>AI Backstory Analysis</span>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: aiStatus === 'available' ? '#4ade80' : aiStatus === 'checking' ? accent : '#ef4444',
            boxShadow: aiStatus === 'available' ? '0 0 6px rgba(74,222,128,0.5)' : 'none',
          }} />
          <span style={{ fontSize: 10, color: 'rgba(200,175,130,0.3)' }}>
            {aiStatus === 'available' ? 'Ollama Connected' : aiStatus === 'checking' ? 'Checking...' : 'Ollama Offline'}
          </span>
        </div>

        <button
          onClick={runAnalysis}
          disabled={analyzing || aiStatus !== 'available' || wordCount < 50}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 20px', borderRadius: 10, border: 'none', cursor: analyzing || aiStatus !== 'available' || wordCount < 50 ? 'not-allowed' : 'pointer',
            background: analyzing ? 'rgba(201,168,76,0.08)' : aiStatus === 'available' && wordCount >= 50 ? 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(240,216,120,0.06))' : 'rgba(255,255,255,0.03)',
            color: aiStatus === 'available' && wordCount >= 50 ? accent : 'rgba(200,175,130,0.25)',
            fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.06em',
            transition: 'all 0.2s',
          }}
        >
          {analyzing ? (
            <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing your backstory...</>
          ) : (
            <><Sparkles size={14} /> Analyze My Backstory</>
          )}
        </button>
        {wordCount < 50 && aiStatus === 'available' && (
          <p style={{ fontSize: 10, color: 'rgba(200,175,130,0.25)', textAlign: 'center', marginTop: 6 }}>
            Write at least 50 words to enable AI analysis ({wordCount}/50)
          </p>
        )}

        {/* AI Suggestions Panel */}
        <AnimatePresence>
          {aiSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {/* NPC Suggestions */}
              {aiSuggestions.npcs?.length > 0 && (
                <div style={{ ...cardStyle, padding: '14px 16px', borderColor: 'rgba(74,222,128,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4ade80' }}>Detected NPCs ({aiSuggestions.npcs.length})</span>
                    <button onClick={acceptNpcs} style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'rgba(74,222,128,0.1)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: '#4ade80', fontFamily: 'var(--font-heading)', fontSize: 10 }}>
                      <Check size={12} /> Accept All
                    </button>
                  </div>
                  {aiSuggestions.npcs.map((npc, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <span style={{ fontSize: 12, color: '#efe0c0', fontWeight: 600, flex: 1 }}>{npc.name}</span>
                      <span style={{ fontSize: 10, color: 'rgba(200,175,130,0.4)' }}>{npc.relationship}</span>
                      <span style={{ fontSize: 10, color: 'rgba(200,175,130,0.3)' }}>{npc.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Motivation Suggestions */}
              {aiSuggestions.motivations && (
                <div style={{ ...cardStyle, padding: '14px 16px', borderColor: 'rgba(201,168,76,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', textTransform: 'uppercase', color: accent }}>Detected Motivations</span>
                    <button onClick={acceptMotivations} style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: `${accent}15`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: accent, fontFamily: 'var(--font-heading)', fontSize: 10 }}>
                      <Check size={12} /> Accept
                    </button>
                  </div>
                  {aiSuggestions.motivations.short_term && <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.5)', marginBottom: 4 }}><strong>Short-term:</strong> {aiSuggestions.motivations.short_term}</div>}
                  {aiSuggestions.motivations.long_term && <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.5)', marginBottom: 4 }}><strong>Long-term:</strong> {aiSuggestions.motivations.long_term}</div>}
                  {aiSuggestions.motivations.driving && <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.5)' }}><strong>Driving:</strong> {aiSuggestions.motivations.driving}</div>}
                </div>
              )}

              {/* Personality Suggestions */}
              {aiSuggestions.personality && (
                <div style={{ ...cardStyle, padding: '14px 16px', borderColor: 'rgba(96,165,250,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#60a5fa' }}>Suggested Personality</span>
                    <button onClick={acceptPersonality} style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'rgba(96,165,250,0.1)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: '#60a5fa', fontFamily: 'var(--font-heading)', fontSize: 10 }}>
                      <Check size={12} /> Accept
                    </button>
                  </div>
                  {['traits', 'ideals', 'bonds', 'flaws'].map(key => {
                    const items = aiSuggestions.personality[key];
                    if (!items?.length) return null;
                    return (
                      <div key={key} style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: 'rgba(200,175,130,0.35)', textTransform: 'capitalize' }}>{key}: </span>
                        <span style={{ fontSize: 11, color: 'rgba(200,175,130,0.55)' }}>{Array.isArray(items) ? items.join(', ') : items}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Plot Hooks */}
              {aiSuggestions.plot_hooks?.length > 0 && (
                <div style={{ ...cardStyle, padding: '14px 16px', borderColor: 'rgba(168,85,247,0.2)' }}>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(168,85,247,0.7)', display: 'block', marginBottom: 10 }}>Story Seeds</span>
                  {aiSuggestions.plot_hooks.map((hook, i) => (
                    <div key={i} style={{ padding: '6px 0', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <div style={{ fontSize: 12, color: '#efe0c0', fontWeight: 600 }}>{hook.title}</div>
                      <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.4)', marginTop: 2 }}>{hook.description}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Themes */}
              {aiSuggestions.themes?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {aiSuggestions.themes.map((theme, i) => (
                    <span key={i} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 99, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', color: 'rgba(168,85,247,0.6)' }}>
                      {theme}
                    </span>
                  ))}
                </div>
              )}

              {/* Dismiss */}
              <button
                onClick={() => setAiSuggestions(null)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(200,175,130,0.25)', fontFamily: 'var(--font-heading)', fontSize: 10, textAlign: 'center', padding: 8 }}
              >
                Dismiss Suggestions
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Quick Start Step ────────────────────────────────────────────────────────

function StepQuickStart({ overview, onApplyPreset, onSkip }) {
  const matchingPresets = QUICK_START_PRESETS.filter(() => {
    // Show all presets, but highlight ones matching current class/race
    return true;
  });

  const getMatchLevel = (preset) => {
    const classMatch = overview?.primary_class === preset.targetClass;
    const raceMatch = overview?.race === preset.targetRace;
    if (classMatch && raceMatch) return 'perfect';
    if (classMatch || raceMatch) return 'partial';
    return 'none';
  };

  // Sort: perfect matches first, then partial, then none
  const sorted = [...matchingPresets].sort((a, b) => {
    const order = { perfect: 0, partial: 1, none: 2 };
    return order[getMatchLevel(a)] - order[getMatchLevel(b)];
  });

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}><Zap size={28} style={{ color: accent }} /></div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#efe0c0', marginBottom: 4 }}>
          Quick Start
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)' }}>
          Pick a template to auto-fill ability scores, skills, and background — or skip to build from scratch.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map(preset => {
          const matchLvl = getMatchLevel(preset);
          const isPerfect = matchLvl === 'perfect';
          const isPartial = matchLvl === 'partial';
          return (
            <button
              key={preset.name}
              onClick={() => onApplyPreset(preset)}
              style={{
                ...cardStyle, cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px',
                transition: 'all 0.2s',
                background: isPerfect ? 'rgba(201,168,76,0.06)' : 'rgba(11,9,20,0.9)',
                borderColor: isPerfect ? `${accent}40` : isPartial ? `${accent}25` : 'rgba(201,168,76,0.15)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${accent}50`}
              onMouseLeave={e => e.currentTarget.style.borderColor = isPerfect ? `${accent}40` : isPartial ? `${accent}25` : 'rgba(201,168,76,0.15)'}
            >
              <span style={{ fontSize: 26, lineHeight: 1 }}>{preset.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: '#efe0c0', letterSpacing: '0.03em' }}>{preset.name}</span>
                  {isPerfect && (
                    <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 99, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                      BEST MATCH
                    </span>
                  )}
                  {isPartial && (
                    <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 99, background: `${accent}10`, border: `1px solid ${accent}25`, color: `${accent}aa`, fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                      GOOD FIT
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.4)', marginTop: 3 }}>{preset.desc}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(200,175,130,0.3)' }}>
                  <span>STR {preset.scores.STR}</span>
                  <span>DEX {preset.scores.DEX}</span>
                  <span>CON {preset.scores.CON}</span>
                  <span>INT {preset.scores.INT}</span>
                  <span>WIS {preset.scores.WIS}</span>
                  <span>CHA {preset.scores.CHA}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          onClick={onSkip}
          style={{
            border: 'none', background: 'none', cursor: 'pointer',
            color: 'rgba(200,175,130,0.35)', fontFamily: 'var(--font-heading)',
            fontSize: 12, letterSpacing: '0.05em',
            padding: '8px 16px',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(200,175,130,0.6)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(200,175,130,0.35)'}
        >
          Skip — I'll build from scratch
        </button>
      </div>
    </div>
  );
}

// ─── Review Summary Panel ────────────────────────────────────────────────────

function StepReviewSummary({ overview, scores, classData, raceData, backgroundData, selectedSkills, selectedBackground }) {
  const conMod = mod(scores?.CON || 10);
  const hp = classData ? classData.hitDie + conMod : 10;
  const ac = 10 + mod(scores?.DEX || 10);
  const bgSkills = backgroundData?.skillProficiencies || [];
  const allSkills = [...new Set([...selectedSkills, ...bgSkills])];
  const ct = CLASS_TOOLTIPS[overview?.primary_class];

  const sections = [
    {
      title: 'Character',
      items: [
        { label: 'Name', value: overview?.name || 'Unknown' },
        { label: 'Race', value: overview?.race || 'Unknown' },
        { label: 'Class', value: overview?.primary_class || 'Unknown' },
        ...(selectedBackground ? [{ label: 'Background', value: selectedBackground }] : []),
      ],
    },
    {
      title: 'Ability Scores',
      items: ABILITIES.map(a => ({
        label: a,
        value: `${scores?.[a] || 10} (${modStr(mod(scores?.[a] || 10))})`,
      })),
    },
    {
      title: 'Combat',
      items: [
        { label: 'Hit Points', value: `${hp}` },
        { label: 'Armor Class', value: `${ac}` },
        { label: 'Speed', value: `${raceData?.speed || 30} ft` },
        ...(ct ? [{ label: 'Hit Die', value: ct.hitDie }] : []),
      ],
    },
    ...(allSkills.length > 0 ? [{
      title: 'Skills',
      items: allSkills.map(s => ({ label: s, value: SKILL_ABILITIES[s] || '' })),
    }] : []),
    ...(classData?.savingThrows ? [{
      title: 'Saving Throws',
      items: classData.savingThrows.map(s => ({ label: s, value: ABILITY_NAMES[s] || s })),
    }] : []),
  ];

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}><Star size={28} style={{ color: accent }} /></div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#efe0c0', marginBottom: 4 }}>
          Review Your Choices
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)' }}>
          Double-check everything before finalizing. Use Back to make changes.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sections.map(section => (
          <div key={section.title}>
            <div style={{
              fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 8,
            }}>
              {section.title}
            </div>
            <div style={{ ...cardStyle, padding: '12px 16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {section.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'rgba(200,175,130,0.5)' }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#efe0c0', fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 1: Ability Scores ─────────────────────────────────────────────────

function StepAbilities({ setScores, raceData }) {
  const [method, setMethod] = useState(null);
  const [rolls, setRolls] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [rerollCount, setRerollCount] = useState(0);
  const [pointBuyScores, setPointBuyScores] = useState(
    Object.fromEntries(ABILITIES.map(a => [a, 8]))
  );

  const pointsSpent = Object.values(pointBuyScores).reduce((sum, v) => sum + (POINT_BUY_COSTS[v] || 0), 0);
  const pointsLeft = POINT_BUY_TOTAL - pointsSpent;
  const rerollsLeft = MAX_REROLLS - rerollCount;

  const racialBonuses = useMemo(() => raceData?.abilityBonuses || {}, [raceData?.abilityBonuses]);

  const doRoll = () => {
    if (rolls && rerollCount >= MAX_REROLLS) {
      toast('No rerolls remaining! Assign the scores you have.', { icon: '🎲' });
      return;
    }
    const r = ABILITIES.map(() => roll4d6DropLowest());
    setRolls(r);
    setAssignments({});
    if (rolls) setRerollCount(prev => prev + 1); // Don't count the initial roll
  };

  const applyMethod = useCallback(() => {
    let base = {};
    if (method === 'standard') {
      // Need all 6 assigned
      ABILITIES.forEach((a) => {
        base[a] = assignments[a] != null ? STANDARD_ARRAY[assignments[a]] : 10;
      });
    } else if (method === 'pointbuy') {
      base = { ...pointBuyScores };
    } else if (method === 'roll') {
      ABILITIES.forEach((a) => {
        base[a] = assignments[a] != null ? rolls[assignments[a]].total : 10;
      });
    }
    // Apply racial bonuses
    const final = {};
    ABILITIES.forEach(a => {
      final[a] = (base[a] || 10) + (racialBonuses[a] || 0);
    });
    setScores(final);
  }, [method, assignments, pointBuyScores, rolls, racialBonuses, setScores]);

  // Auto-apply when point buy changes
  useEffect(() => {
    if (method === 'pointbuy') applyMethod();
  }, [pointBuyScores, method, applyMethod]);

  const allAssigned = method === 'standard'
    ? Object.keys(assignments).length === 6
    : method === 'roll'
    ? rolls && Object.keys(assignments).length === 6
    : method === 'pointbuy';

  // Drag-and-drop style assignment for standard array and roll
  const usedIndices = new Set(Object.values(assignments));

  const assignScore = (ability, idx) => {
    setAssignments(prev => {
      const next = { ...prev };
      // Remove ability if it was already assigned
      Object.entries(next).forEach(([a, v]) => { if (v === idx) delete next[a]; });
      // Remove this ability's old assignment
      delete next[ability];
      // Assign
      next[ability] = idx;
      return next;
    });
  };

  const clearAssignments = () => setAssignments({});

  useEffect(() => {
    if (allAssigned && method !== 'pointbuy') applyMethod();
  }, [assignments, allAssigned, method, applyMethod]);

  const scorePool = method === 'standard' ? STANDARD_ARRAY : method === 'roll' && rolls ? rolls.map(r => r.total) : [];

  const methods = [
    { id: 'pointbuy', label: 'Point Buy', desc: '27 points to spend (scores start at 8, max 15). Most balanced.', icon: '⚖' },
    { id: 'standard', label: 'Standard Array', desc: '15, 14, 13, 12, 10, 8. Quick & fair.', icon: '📋' },
    { id: 'roll', label: 'Roll 4d6', desc: 'Roll 4d6, drop lowest. Classic!', icon: '🎲' },
  ];

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🎲</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#efe0c0', marginBottom: 4 }}>
          Ability Scores
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)' }}>
          Choose how to generate your six ability scores.
        </p>
      </div>

      {/* Method selection */}
      {!method && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {methods.map(m => (
            <button
              key={m.id}
              onClick={() => { setMethod(m.id); if (m.id === 'roll') doRoll(); }}
              style={{
                ...cardStyle, cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${accent}45`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'}
            >
              <span style={{ fontSize: 28 }}>{m.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, color: '#efe0c0', letterSpacing: '0.03em' }}>{m.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(200,175,130,0.35)', marginTop: 2 }}>{m.desc}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Point Buy */}
      {method === 'pointbuy' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <button onClick={() => setMethod(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(200,175,130,0.4)', fontFamily: 'var(--font-heading)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ChevronLeft size={14} /> Change Method
            </button>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: pointsLeft < 0 ? '#ef4444' : pointsLeft === 0 ? '#4ade80' : accent }}>
              {pointsLeft} / {POINT_BUY_TOTAL} points left
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ABILITIES.map(a => {
              const base = pointBuyScores[a];
              const bonus = racialBonuses[a] || 0;
              const total = base + bonus;
              return (
                <div key={a} style={{ ...cardStyle, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, fontFamily: 'var(--font-heading)', fontSize: 11, color: accent, letterSpacing: '0.1em' }}>{a}</div>
                  <div style={{ flex: 1, fontSize: 11, color: 'rgba(200,175,130,0.3)' }}>{ABILITY_NAMES[a]}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => setPointBuyScores(p => ({ ...p, [a]: Math.max(8, p[a] - 1) }))}
                      disabled={base <= 8}
                      style={{ width: 28, height: 28, borderRadius: 6, border: 'none', cursor: base > 8 ? 'pointer' : 'not-allowed', background: 'rgba(255,255,255,0.05)', color: 'rgba(200,175,130,0.5)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >−</button>
                    <span style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#efe0c0' }}>{base}</span>
                    <button
                      onClick={() => setPointBuyScores(p => {
                        const next = Math.min(15, p[a] + 1);
                        const newCost = pointsSpent - (POINT_BUY_COSTS[p[a]] || 0) + (POINT_BUY_COSTS[next] || 0);
                        if (newCost > POINT_BUY_TOTAL) return p;
                        return { ...p, [a]: next };
                      })}
                      disabled={base >= 15}
                      style={{ width: 28, height: 28, borderRadius: 6, border: 'none', cursor: base < 15 ? 'pointer' : 'not-allowed', background: 'rgba(255,255,255,0.05)', color: 'rgba(200,175,130,0.5)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >+</button>
                  </div>
                  {bonus > 0 && (
                    <span style={{ fontSize: 11, color: '#4ade80', fontFamily: 'var(--font-mono)' }}>+{bonus}</span>
                  )}
                  <div style={{ width: 36, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: accent }}>{total}</div>
                  <div style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(200,175,130,0.35)' }}>{modStr(mod(total))}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Standard Array / Roll — assignment UI */}
      {(method === 'standard' || method === 'roll') && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <button onClick={() => { setMethod(null); setRolls(null); clearAssignments(); setRerollCount(0); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(200,175,130,0.4)', fontFamily: 'var(--font-heading)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ChevronLeft size={14} /> Change Method
            </button>
            <div style={{ display: 'flex', gap: 6 }}>
              {method === 'roll' && (
                <button
                  onClick={doRoll}
                  disabled={rerollsLeft <= 0}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: rerollsLeft > 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', borderRadius: 6, padding: '4px 10px', cursor: rerollsLeft > 0 ? 'pointer' : 'not-allowed', color: rerollsLeft > 0 ? accent : 'rgba(200,175,130,0.25)', fontFamily: 'var(--font-heading)', fontSize: 11 }}
                >
                  <RefreshCw size={12} /> Re-roll ({rerollsLeft}/{MAX_REROLLS})
                </button>
              )}
              {Object.keys(assignments).length > 0 && (
                <button onClick={clearAssignments} style={{ border: 'none', background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: 'rgba(200,175,130,0.4)', fontFamily: 'var(--font-heading)', fontSize: 11 }}>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Score pool */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
            {scorePool.map((val, idx) => {
              const used = usedIndices.has(idx);
              return (
                <div key={idx} style={{
                  width: 52, height: 52, borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: used ? 'rgba(74,222,128,0.08)' : 'rgba(201,168,76,0.06)',
                  border: `1px solid ${used ? 'rgba(74,222,128,0.25)' : 'rgba(201,168,76,0.2)'}`,
                  opacity: used ? 0.4 : 1,
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: used ? '#4ade80' : '#efe0c0' }}>{val}</span>
                  {method === 'roll' && rolls && (
                    <span style={{ fontSize: 8, color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-mono)' }}>
                      {rolls[idx].dice.join(',')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(200,175,130,0.3)', marginBottom: 14 }}>
            Click a score value for each ability to assign it
          </p>

          {/* Assignment rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ABILITIES.map(a => {
              const assignedIdx = assignments[a];
              const baseVal = assignedIdx != null ? scorePool[assignedIdx] : null;
              const bonus = racialBonuses[a] || 0;
              const total = baseVal != null ? baseVal + bonus : null;
              return (
                <div key={a} style={{ ...cardStyle, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, fontFamily: 'var(--font-heading)', fontSize: 11, color: accent, letterSpacing: '0.1em' }}>{a}</div>
                  <div style={{ flex: 1, fontSize: 11, color: 'rgba(200,175,130,0.3)' }}>{ABILITY_NAMES[a]}</div>
                  {/* Score picker buttons */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    {scorePool.map((val, idx) => {
                      const usedByOther = usedIndices.has(idx) && assignments[a] !== idx;
                      const isThis = assignments[a] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => assignScore(a, idx)}
                          disabled={usedByOther}
                          style={{
                            width: 30, height: 26, borderRadius: 5, border: 'none', cursor: usedByOther ? 'not-allowed' : 'pointer',
                            background: isThis ? `${accent}30` : 'rgba(255,255,255,0.04)',
                            color: isThis ? accent : usedByOther ? 'rgba(200,175,130,0.15)' : 'rgba(200,175,130,0.5)',
                            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: isThis ? 700 : 400,
                            outline: isThis ? `1px solid ${accent}55` : 'none',
                          }}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                  {bonus > 0 && <span style={{ fontSize: 11, color: '#4ade80', fontFamily: 'var(--font-mono)' }}>+{bonus}</span>}
                  <div style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: total != null ? accent : 'rgba(200,175,130,0.2)' }}>
                    {total ?? '—'}
                  </div>
                  <div style={{ width: 24, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(200,175,130,0.35)' }}>
                    {total != null ? modStr(mod(total)) : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Auto-Apply Preview ─────────────────────────────────────────────

function StepAutoApply({ raceData, classData, backgroundData, scores }) {
  const items = [];

  // HP
  if (classData) {
    const conMod = mod(scores?.CON || 10);
    const hp = classData.hitDie + conMod;
    items.push({ label: 'Hit Points', value: `${hp} (${classData.hitDie} + ${conMod} CON)`, category: 'Combat' });
    items.push({ label: 'Hit Dice', value: `1d${classData.hitDie}`, category: 'Combat' });
  }

  // Speed
  if (raceData?.speed) items.push({ label: 'Speed', value: `${raceData.speed} ft`, category: 'Combat' });

  // AC
  items.push({ label: 'Armor Class', value: `${10 + mod(scores?.DEX || 10)} (10 + ${mod(scores?.DEX || 10)} DEX)`, category: 'Combat' });

  // Saving Throws
  if (classData?.savingThrows) items.push({ label: 'Saving Throws', value: classData.savingThrows.join(', '), category: 'Proficiencies' });

  // Armor profs
  if (classData?.armorProficiencies?.length) items.push({ label: 'Armor', value: classData.armorProficiencies.join(', '), category: 'Proficiencies' });

  // Weapon profs
  if (classData?.weaponProficiencies?.length) items.push({ label: 'Weapons', value: classData.weaponProficiencies.join(', '), category: 'Proficiencies' });

  // Languages
  if (raceData?.languages?.length) items.push({ label: 'Languages', value: raceData.languages.join(', '), category: 'Traits' });

  // Darkvision
  if (raceData?.darkvision > 0) items.push({ label: 'Darkvision', value: `${raceData.darkvision} ft`, category: 'Traits' });

  // Size
  if (raceData?.size) items.push({ label: 'Size', value: raceData.size, category: 'Traits' });

  // Racial traits
  if (raceData?.traits?.length) {
    raceData.traits.forEach(t => items.push({ label: t.name, value: t.description, category: 'Racial Traits' }));
  }

  // Background (2024)
  if (backgroundData) {
    if (backgroundData.feat) items.push({ label: 'Starting Feat', value: backgroundData.feat, category: 'Background' });
    if (backgroundData.skillProficiencies?.length) items.push({ label: 'Background Skills', value: backgroundData.skillProficiencies.join(', '), category: 'Background' });
  }

  // Spellcasting
  if (classData?.spellcasting) items.push({ label: 'Spellcasting', value: `${classData.spellcasting.ability} — ${classData.spellcasting.type} caster`, category: 'Magic' });

  // Group by category
  const groups = {};
  items.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#efe0c0', marginBottom: 4 }}>
          Auto-Applied Defaults
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)' }}>
          These are automatically set based on your race and class. Review before continuing.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Object.entries(groups).map(([cat, entries]) => (
          <div key={cat}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 8 }}>{cat}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {entries.map((item, i) => (
                <div key={i} style={{ ...cardStyle, padding: '10px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: '#4ade80', fontSize: 10, marginTop: 3, flexShrink: 0 }}>✓</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#efe0c0' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.45)', marginTop: 2, lineHeight: 1.5 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Skill Proficiencies ────────────────────────────────────────────

function StepSkills({ classData, backgroundData, selectedSkills, setSelectedSkills, scores }) {
  const maxPicks = classData?.skillChoices?.count || 2;
  const availableSkills = classData?.skillChoices?.from || Object.keys(SKILL_ABILITIES);
  const bgSkills = backgroundData?.skillProficiencies || [];

  const toggle = (skill) => {
    if (bgSkills.includes(skill)) return; // Can't toggle background skills
    setSelectedSkills(prev => {
      if (prev.includes(skill)) return prev.filter(s => s !== skill);
      if (prev.length >= maxPicks) return prev;
      return [...prev, skill];
    });
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>📜</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#efe0c0', marginBottom: 4 }}>
          Skill Proficiencies
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)' }}>
          Choose {maxPicks} skill{maxPicks > 1 ? 's' : ''} from your class.
          {bgSkills.length > 0 && ` Your background already grants: ${bgSkills.join(', ')}.`}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99,
          background: selectedSkills.length === maxPicks ? 'rgba(74,222,128,0.08)' : 'rgba(201,168,76,0.06)',
          border: `1px solid ${selectedSkills.length === maxPicks ? 'rgba(74,222,128,0.25)' : 'rgba(201,168,76,0.2)'}`,
          fontFamily: 'var(--font-mono)', fontSize: 12,
          color: selectedSkills.length === maxPicks ? '#4ade80' : accent,
        }}>
          {selectedSkills.length} / {maxPicks} selected
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {availableSkills.map(skill => {
          const isBg = bgSkills.includes(skill);
          const isSelected = selectedSkills.includes(skill) || isBg;
          const ability = SKILL_ABILITIES[skill] || '?';
          const scoreMod = scores ? modStr(mod(scores[ability] || 10)) : '+0';
          const _profBonus = isSelected ? '+2' : '+0';
          const disabled = !isSelected && selectedSkills.length >= maxPicks && !isBg;

          return (
            <button
              key={skill}
              onClick={() => toggle(skill)}
              disabled={isBg}
              style={{
                ...cardStyle, padding: '10px 16px', cursor: isBg ? 'default' : disabled ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                background: isSelected ? 'rgba(201,168,76,0.06)' : 'rgba(11,9,20,0.9)',
                borderColor: isSelected ? `${accent}35` : 'rgba(201,168,76,0.1)',
                opacity: disabled ? 0.4 : 1,
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                border: `1.5px solid ${isSelected ? accent : 'rgba(201,168,76,0.25)'}`,
                background: isSelected ? `${accent}25` : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isSelected && <Check size={12} style={{ color: accent }} />}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, color: isSelected ? '#efe0c0' : 'rgba(200,175,130,0.55)', fontWeight: isSelected ? 600 : 400 }}>
                  {skill}
                </span>
                {isBg && <span style={{ fontSize: 10, color: 'rgba(200,175,130,0.3)', marginLeft: 6 }}>(background)</span>}
              </div>
              <span style={{ fontSize: 10, color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-mono)', width: 28 }}>{ability}</span>
              <span style={{ fontSize: 11, color: 'rgba(200,175,130,0.35)', fontFamily: 'var(--font-mono)', width: 24, textAlign: 'right' }}>{scoreMod}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 4: Review ─────────────────────────────────────────────────────────

function StepReview({ overview, scores, classData, raceData, backgroundData, selectedSkills }) {
  const conMod = mod(scores?.CON || 10);
  const hp = classData ? classData.hitDie + conMod : 10;
  const ac = 10 + mod(scores?.DEX || 10);
  const bgSkills = backgroundData?.skillProficiencies || [];
  const allSkills = [...new Set([...selectedSkills, ...bgSkills])];

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>⚔</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#efe0c0', marginBottom: 4 }}>
          Ready for Adventure
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)' }}>
          Review your character before entering the world.
        </p>
      </div>

      {/* Character card preview */}
      <div style={{ ...cardStyle, padding: '24px', textAlign: 'center', marginBottom: 20, border: `1px solid ${accent}25` }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', margin: '0 auto 12px',
          background: `${accent}15`, border: `2px solid ${accent}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 900, color: accent,
        }}>
          {(overview?.name || '?')[0]}
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: '#efe0c0', marginBottom: 4 }}>{overview?.name}</div>
        <div style={{ fontSize: 13, color: `${accent}aa`, marginBottom: 2 }}>
          {[overview?.race, overview?.primary_class].filter(Boolean).join(' ')} · Level 1
        </div>
        {overview?.background && <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.3)' }}>{overview.background} Background</div>}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
        <div style={{ ...cardStyle, padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>HP</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#4ade80' }}>{hp}</div>
        </div>
        <div style={{ ...cardStyle, padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>AC</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: '#60a5fa' }}>{ac}</div>
        </div>
        <div style={{ ...cardStyle, padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Speed</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: accent }}>{raceData?.speed || 30}</div>
        </div>
      </div>

      {/* Ability scores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginBottom: 16 }}>
        {ABILITIES.map(a => (
          <div key={a} style={{ ...cardStyle, padding: '8px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: accent, fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', marginBottom: 4 }}>{a}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#efe0c0' }}>{scores?.[a] || 10}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(200,175,130,0.4)' }}>{modStr(mod(scores?.[a] || 10))}</div>
          </div>
        ))}
      </div>

      {/* Skills */}
      {allSkills.length > 0 && (
        <div style={{ ...cardStyle, padding: '12px 16px', marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 8 }}>Skill Proficiencies</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {allSkills.map(s => (
              <span key={s} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: `${accent}10`, border: `1px solid ${accent}25`, color: `${accent}cc` }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Saves */}
      {classData?.savingThrows && (
        <div style={{ ...cardStyle, padding: '12px 16px' }}>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.35)', marginBottom: 8 }}>Saving Throw Proficiencies</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {classData.savingThrows.map(s => (
              <span key={s} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa' }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Background Step (enhanced with feature catalog) ────────────────────────

function StepBackground({ backgrounds, selected, setSelected, is2024 }) {
  const selectedPresetInfo = BACKGROUND_PRESETS_5E.find(b => b.name === selected);

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>📖</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: '#efe0c0', marginBottom: 4 }}>
          Background
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(200,175,130,0.4)' }}>
          {is2024
            ? 'Your background grants ability bonuses, skill proficiencies, and a feat.'
            : 'Your background defines where you came from and grants a unique feature.'}
        </p>
      </div>

      {/* 2024 edition: use ruleset backgrounds */}
      {is2024 && backgrounds.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          {backgrounds.map(bg => {
            const sel = selected === bg.name;
            const bonuses = Object.entries(bg.abilityBonuses || {}).map(([a, v]) => `${a} +${v}`).join(', ');
            return (
              <button
                key={bg.name}
                onClick={() => setSelected(bg.name)}
                style={{
                  ...cardStyle, padding: '14px 12px', cursor: 'pointer', textAlign: 'left',
                  background: sel ? 'rgba(201,168,76,0.08)' : 'rgba(11,9,20,0.9)',
                  borderColor: sel ? `${accent}45` : 'rgba(201,168,76,0.1)',
                  outline: sel ? `1px solid ${accent}35` : 'none',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: sel ? accent : 'rgba(200,175,130,0.6)', marginBottom: 4, letterSpacing: '0.03em' }}>{bg.name}</div>
                {bonuses && <div style={{ fontSize: 10, color: '#4ade80', fontFamily: 'var(--font-mono)', marginBottom: 3 }}>{bonuses}</div>}
                {bg.skillProficiencies?.length > 0 && <div style={{ fontSize: 10, color: 'rgba(200,175,130,0.35)' }}>{bg.skillProficiencies.join(', ')}</div>}
                {bg.feat && <div style={{ fontSize: 10, color: 'rgba(155,89,182,0.6)', marginTop: 3 }}>{bg.feat}</div>}
              </button>
            );
          })}
        </div>
      )}

      {/* 2014 edition (or no ruleset backgrounds): show standard 5e catalog */}
      {(!is2024 || backgrounds.length === 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          {BACKGROUND_PRESETS_5E.map(bg => {
            const sel = selected === bg.name;
            return (
              <button
                key={bg.name}
                onClick={() => setSelected(bg.name)}
                style={{
                  ...cardStyle, padding: '14px 12px', cursor: 'pointer', textAlign: 'left',
                  background: sel ? 'rgba(201,168,76,0.08)' : 'rgba(11,9,20,0.9)',
                  borderColor: sel ? `${accent}45` : 'rgba(201,168,76,0.1)',
                  outline: sel ? `1px solid ${accent}35` : 'none',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: sel ? accent : 'rgba(200,175,130,0.6)', marginBottom: 4, letterSpacing: '0.03em' }}>{bg.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(200,175,130,0.4)', marginBottom: 2 }}>{bg.featureName}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Feature info panel for selected background */}
      {selected && selectedPresetInfo && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            ...cardStyle, marginTop: 16, padding: '16px 18px',
            background: 'rgba(201,168,76,0.04)', borderColor: 'rgba(201,168,76,0.18)',
          }}
        >
          <div style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', textTransform: 'uppercase', color: accent, marginBottom: 6 }}>
            {selectedPresetInfo.name} — Background Feature
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: '#efe0c0', marginBottom: 6 }}>
            {selectedPresetInfo.featureName}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(200,175,130,0.55)', lineHeight: 1.7 }}>
            {selectedPresetInfo.featureDesc}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Subclass Selection Step ─────────────────────────────────────────────────

function StepSubclass({ classData, selected, setSelected }) {
  const subclasses = classData?.subclasses || [];
  return (
    <div>
      <h2 className="font-display text-2xl text-amber-100 mb-2">Choose Your Subclass</h2>
      <p className="text-sm text-amber-200/50 mb-6">
        {classData?.name} characters choose their subclass at level 1.
        This defines your specialization and grants unique features as you level up.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {subclasses.map(sc => (
          <button
            key={sc}
            onClick={() => setSelected(sc)}
            className={`text-left p-4 rounded-lg border transition-all ${
              selected === sc
                ? 'bg-gold/10 border-gold/40 text-amber-100'
                : 'bg-[#0a0a10] border-amber-200/10 text-amber-200/60 hover:border-amber-200/25'
            }`}
          >
            <div className="font-display text-sm">{sc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Setup Page ────────────────────────────────────────────────────────

const RUNE_CHARS = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ'];
const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: 30 + Math.random() * 70,
  sym: RUNE_CHARS[i % RUNE_CHARS.length],
  delay: Math.random() * 10, dur: 14 + Math.random() * 8,
}));

export default function CharacterSetup() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [scores, setScores] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState('');
  const [selectedSubclass, setSelectedSubclass] = useState('');
  const [saving, setSaving] = useState(false);
  const [_quickStartApplied, setQuickStartApplied] = useState(false);
  const [showQuickBuild, setShowQuickBuild] = useState(false);
  const [quickBuildBusy, setQuickBuildBusy] = useState(false);

  // Phase 1: New identity & backstory state
  const [identity, setIdentity] = useState({
    aliases: '', age: '', gender: '', height: '', weight: '',
    eyes: '', hair: '', skin: '', physicalDescription: '',
  });
  const [backstoryData, setBackstoryData] = useState({
    text: '', mode: 'free', guidedResponses: {},
    personality: { traits: '', ideals: '', bonds: '', flaws: '' },
    motivations: { short_term: '', long_term: '', driving: '' },
    npcs: [], lifeEvents: [],
  });

  // Load character overview
  useEffect(() => {
    (async () => {
      try {
        const ov = await invoke('get_overview', { characterId });
        setOverview(ov.overview);
      } catch { /* ignore */
        toast.error('Failed to load character');
        navigate('/');
      } finally {
        setLoading(false);
      }
    })();
  }, [characterId, navigate]);

  const rulesetId = overview?.ruleset || '5e-2014';
  const ruleset = getRuleset(rulesetId);
  const is2024 = rulesetId === '5e-2024';

  // Find race/class data
  const raceData = ruleset.RACES.find(r =>
    r.name === overview?.race && (!r.subrace || r.subrace === overview?.subrace || r.subrace === 'Standard' || r.subrace === '')
  ) || ruleset.RACES.find(r => r.name === overview?.race);

  const classData = ruleset.CLASSES.find(c => c.name === overview?.primary_class);
  const backgrounds = ruleset.BACKGROUNDS || [];
  const backgroundData = backgrounds.find(b => b.name === selectedBackground) || null;

  // Quick Start preset handler
  const applyPreset = (preset) => {
    // Apply racial bonuses on top of preset scores
    const racialBonuses = raceData?.abilityBonuses || {};
    const finalScores = {};
    ABILITIES.forEach(a => {
      finalScores[a] = (preset.scores[a] || 10) + (racialBonuses[a] || 0);
    });
    setScores(finalScores);

    // Apply skills that are valid for this class
    const availableSkills = classData?.skillChoices?.from || Object.keys(SKILL_ABILITIES);
    const maxPicks = classData?.skillChoices?.count || 2;
    const validSkills = preset.skills.filter(s => availableSkills.includes(s)).slice(0, maxPicks);
    setSelectedSkills(validSkills);

    // Apply background if it exists in ruleset
    if (preset.background && backgrounds.find(b => b.name === preset.background)) {
      setSelectedBackground(preset.background);
    }

    setQuickStartApplied(true);
    setStep(2); // Move past quickstart
    toast.success(`Applied "${preset.name}" template — customize as needed!`);
  };

  const skipQuickStart = () => {
    setStep(2);
  };

  // ── Quick Build: one-click full character creation ──
  const handleQuickBuild = async (template) => {
    if (quickBuildBusy) return;
    setQuickBuildBusy(true);
    try {
      // 1. Update overview with all core stats
      await invoke('update_overview', {
        characterId,
        payload: {
          name: template.name,
          race: template.race,
          subrace: '',
          primary_class: template.className,
          primary_subclass: '',
          level: 1,
          background: template.background || '',
          alignment: '',
          experience_points: 0,
          max_hp: template.hp,
          current_hp: template.hp,
          temp_hp: 0,
          armor_class: template.ac,
          speed: template.speed,
          hit_dice_total: `1d${classData?.hitDie || 10}`,
          hit_dice_used: 0,
          death_save_successes: 0,
          death_save_failures: 0,
          inspiration: false,
          senses: '',
          languages: 'Common',
          proficiencies_armor: '',
          proficiencies_weapons: '',
          proficiencies_tools: '',
          campaign_name: overview?.campaign_name || '',
          exhaustion_level: 0,
          ruleset: rulesetId,
          multiclass_data: '[]',
        },
      });

      // 2. Update ability scores
      await invoke('update_ability_scores', {
        characterId,
        payload: ABILITIES.map(a => ({ ability: a, score: template.scores[a] || 10 })),
      });

      // 3. Update skills
      const allSkillNames = Object.keys(SKILL_ABILITIES);
      await invoke('update_skills', {
        characterId,
        payload: allSkillNames.map(name => ({
          name,
          proficient: (template.skills || []).includes(name),
          expertise: false,
        })),
      });

      // 4. Add equipment
      for (const item of template.equipment || []) {
        await invoke('add_item', {
          characterId,
          payload: {
            name: item.name,
            item_type: item.item_type || 'gear',
            weight: item.weight || 0,
            value_gp: item.value_gp || 0,
            quantity: item.quantity || 1,
            description: item.description || '',
            attunement: false,
            attuned: false,
            equipped: false,
            equipment_slot: '',
            stat_modifiers: null,
            rarity: null,
          },
        }).catch(() => {});
      }

      // 5. Add features
      for (const feat of template.features || []) {
        await invoke('add_feature', {
          characterId,
          payload: {
            name: feat.name || '',
            source: feat.source || template.className || '',
            source_level: feat.source_level ?? 1,
            feature_type: feat.feature_type || 'class',
            description: feat.description || '',
            uses_total: feat.uses_total ?? 0,
            uses_remaining: feat.uses_total ?? 0,
            recharge: feat.recharge || 'none',
          },
        }).catch(() => {});
      }

      // 6. Add spells
      for (const spell of template.spells || []) {
        await invoke('add_spell', {
          characterId,
          payload: {
            name: spell.name,
            level: spell.level ?? 0,
            school: spell.school || '',
            casting_time: spell.casting_time || '1 action',
            range: spell.range || '',
            duration: spell.duration || '',
            description: spell.description || '',
            prepared: spell.prepared || false,
          },
        }).catch(() => {});
      }

      // 7. Set currency
      if (template.currency) {
        await invoke('update_currency', {
          characterId,
          payload: {
            cp: template.currency.cp || 0,
            sp: template.currency.sp || 0,
            ep: template.currency.ep || 0,
            gp: template.currency.gp || 0,
            pp: template.currency.pp || 0,
          },
        }).catch(() => {});
      }

      // 8. Set backstory
      if (template.backstory) {
        await invoke('update_backstory', {
          characterId,
          payload: { backstory_text: template.backstory },
        }).catch(() => {});
      }

      toast.success(`${template.name} is ready for adventure!`);
      navigate(`/character/${characterId}`);
    } catch (err) {
      toast.error(`Quick build failed: ${err.message || err}`);
    } finally {
      setQuickBuildBusy(false);
    }
  };

  // Does this class pick a subclass at level 1? (Cleric, Sorcerer, Warlock)
  const needsSubclassAtOne = classData?.subclassLevel === 1 && classData?.subclasses?.length > 0;

  // Steps depend on edition — Name & Identity and Backstory added in V0.9.0
  const steps = is2024
    ? [
        { id: 'quickstart', label: 'Quick Start' },
        { id: 'identity', label: 'Identity' },
        { id: 'background', label: 'Background' },
        { id: 'abilities', label: 'Abilities' },
        { id: 'autoapply', label: 'Defaults' },
        { id: 'skills', label: 'Skills' },
        ...(needsSubclassAtOne ? [{ id: 'subclass', label: 'Subclass' }] : []),
        { id: 'backstory', label: 'Backstory' },
        { id: 'summary', label: 'Summary' },
        { id: 'review', label: 'Review' },
      ]
    : [
        { id: 'quickstart', label: 'Quick Start' },
        { id: 'identity', label: 'Identity' },
        { id: 'background', label: 'Background' },
        { id: 'abilities', label: 'Abilities' },
        { id: 'autoapply', label: 'Defaults' },
        { id: 'skills', label: 'Skills' },
        ...(needsSubclassAtOne ? [{ id: 'subclass', label: 'Subclass' }] : []),
        { id: 'backstory', label: 'Backstory' },
        { id: 'summary', label: 'Summary' },
        { id: 'review', label: 'Review' },
      ];

  const currentStep = steps[step - 1];
  const isLast = step === steps.length;

  // Step label for progress indicator
  const stepLabel = currentStep ? `Step ${step} of ${steps.length}: ${currentStep.label}` : '';

  const canNext = () => {
    if (currentStep.id === 'quickstart') return true;
    if (currentStep.id === 'identity') return true; // All identity fields are optional
    if (currentStep.id === 'abilities') return scores && Object.keys(scores).length === 6;
    if (currentStep.id === 'skills') return selectedSkills.length === (classData?.skillChoices?.count || 2);
    if (currentStep.id === 'subclass') return !!selectedSubclass;
    if (currentStep.id === 'background') return !!selectedBackground;
    if (currentStep.id === 'backstory') return true; // Backstory is optional
    return true;
  };

  // Save everything to backend
  const finishSetup = async () => {
    if (saving) return;
    setSaving(true);

    try {
      // Apply 2024 background ability bonuses before computing derived stats
      const finalScores = { ...scores };
      if (is2024 && backgroundData?.abilityBonuses) {
        for (const [ability, bonus] of Object.entries(backgroundData.abilityBonuses)) {
          finalScores[ability] = (finalScores[ability] || 10) + bonus;
        }
      }

      const conMod = mod(finalScores?.CON || 10);
      const hp = classData ? classData.hitDie + conMod : 10;
      const ac = 10 + mod(finalScores?.DEX || 10);
      const bgSkills = backgroundData?.skillProficiencies || [];
      const allSkills = [...new Set([...selectedSkills, ...bgSkills])];

      // 1. Update ability scores
      await invoke('update_ability_scores', {
        characterId,
        payload: ABILITIES.map(a => ({ ability: a, score: finalScores?.[a] || 10 })),
      });

      // 2. Update saving throws
      const classSaves = classData?.savingThrows || [];
      await invoke('update_saving_throws', {
        characterId,
        payload: ABILITIES.map(a => ({ ability: a, proficient: classSaves.includes(a) })),
      });

      // 3. Update skills
      const allSkillNames = Object.keys(SKILL_ABILITIES);
      await invoke('update_skills', {
        characterId,
        payload: allSkillNames.map(name => ({
          name,
          proficient: allSkills.includes(name),
          expertise: false,
        })),
      });

      // 4. Update overview
      const senses = [];
      if (raceData?.darkvision > 0) senses.push(`Darkvision ${raceData.darkvision} ft`);

      await invoke('update_overview', {
        characterId,
        payload: {
          name: overview.name || 'New Character',
          race: overview.race || '',
          subrace: overview.subrace || '',
          primary_class: overview.primary_class || '',
          primary_subclass: selectedSubclass || overview.primary_subclass || '',
          level: 1,
          background: selectedBackground || overview.background || '',
          alignment: overview.alignment || '',
          experience_points: 0,
          max_hp: Math.max(1, hp),
          current_hp: Math.max(1, hp),
          temp_hp: 0,
          armor_class: ac,
          speed: raceData?.speed || 30,
          hit_dice_total: `1d${classData?.hitDie || 10}`,
          hit_dice_used: 0,
          death_save_successes: 0,
          death_save_failures: 0,
          inspiration: false,
          senses: senses.join(', '),
          languages: (raceData?.languages || ['Common']).join(', '),
          proficiencies_armor: (classData?.armorProficiencies || []).join(', '),
          proficiencies_weapons: (classData?.weaponProficiencies || []).join(', '),
          proficiencies_tools: '',
          campaign_name: overview.campaign_name || '',
          exhaustion_level: 0,
          ruleset: rulesetId,
          multiclass_data: '[]',
        },
      });

      // 5. Add starting equipment from class
      if (classData?.startingEquipment) {
        for (const item of classData.startingEquipment) {
          await invoke('add_item', {
            characterId,
            payload: {
              name: item.name,
              item_type: item.item_type,
              weight: item.weight,
              value_gp: item.value_gp,
              quantity: item.quantity,
              description: '',
              attunement: false,
              attuned: false,
              equipped: false,
              equipment_slot: '',
              stat_modifiers: null,
              rarity: null,
            },
          });
        }
      }

      // 6. Set starting gold from class
      if (classData?.startingGold) {
        await invoke('update_currency', {
          characterId,
          payload: { cp: 0, sp: 0, ep: 0, gp: classData.startingGold, pp: 0 },
        });
      }

      // 7. Auto-add racial traits as features
      if (raceData?.traits?.length) {
        for (const trait of raceData.traits) {
          await invoke('add_feature', {
            characterId,
            payload: {
              name: trait.name,
              source: [raceData.name, raceData.subrace].filter(Boolean).join(' '),
              source_level: 1,
              feature_type: 'racial',
              description: trait.description || '',
              uses_total: 0,
              uses_remaining: 0,
              recharge: 'none',
            },
          }).catch(() => {});
        }
      }

      // 8. Auto-add background feature and proficiencies (2024 edition)
      // TODO: For 5e-2014, add structured background data to rules5e.js with the following shape:
      //   { name: string, feature: { name, description }, skillProficiencies: string[], toolProficiencies?: string[], languages?: string[] }
      // Then auto-populate features and proficiencies here for 2014 backgrounds as well.
      if (is2024 && backgroundData?.feat) {
        await invoke('add_feature', {
          characterId,
          payload: {
            name: backgroundData.feat,
            source: backgroundData.name || 'Background',
            source_level: 1,
            feature_type: 'background',
            description: `Origin feat from the ${backgroundData.name} background.`,
            uses_total: 0,
            uses_remaining: 0,
            recharge: 'none',
          },
        }).catch(() => {});
      }

      // 9. Save backstory & identity data (V0.9.0)
      const backstoryText = backstoryData.text || '';
      const personalityObj = backstoryData.personality || {};
      const motivationsObj = backstoryData.motivations || {};
      const npcsList = backstoryData.npcs || [];
      const lifeEventsList = backstoryData.lifeEvents || [];

      // Pack identity + backstory into goals_motivations JSON (matches Backstory.jsx's packGoalsData format)
      const goalsPayload = JSON.stringify({
        _v: 2,
        short_term_goals: motivationsObj.short_term ? [{ title: motivationsObj.short_term, description: '', completed: false }] : [],
        long_term_goals: motivationsObj.long_term ? [{ title: motivationsObj.long_term, description: '', completed: false }] : [],
        goals_text: motivationsObj.driving || '',
        character_arc: [],
        backstory_allies: npcsList.filter(n => !['Enemy', 'Rival'].includes(n.relationship)).map(n => ({
          name: n.name, notes: n.relationship, description: n.description,
        })),
        backstory_enemies: npcsList.filter(n => ['Enemy', 'Rival'].includes(n.relationship)).map(n => ({
          name: n.name, notes: n.relationship, description: n.description,
        })),
      });

      // Build personality traits string
      const personalityTraits = [personalityObj.traits, personalityObj.ideals, personalityObj.bonds, personalityObj.flaws]
        .filter(Boolean)
        .map(v => Array.isArray(v) ? v.join(', ') : v)
        .join('\n');

      // Build life events into backstory text
      let fullBackstory = backstoryText;
      if (lifeEventsList.length > 0) {
        const eventsText = lifeEventsList
          .filter(e => e.title || e.description)
          .map(e => `${e.age ? `[Age ${e.age}] ` : ''}${e.title}${e.description ? ': ' + e.description : ''}`)
          .join('\n');
        if (eventsText) {
          fullBackstory += '\n\n--- Key Life Events ---\n' + eventsText;
        }
      }

      // Build background feature data from selected background preset
      const bgPresetInfo = BACKGROUND_PRESETS_5E.find(b => b.name === (selectedBackground || overview?.background));
      const backgroundFeatureName = bgPresetInfo?.featureName || '';
      const backgroundFeatureDesc = bgPresetInfo?.featureDesc || '';

      // If user selected a 5e background, pack the feature into goals data
      if (backgroundFeatureName) {
        const goalsObj = JSON.parse(goalsPayload);
        goalsObj.background_feature_name = backgroundFeatureName;
        goalsObj.background_feature_desc = backgroundFeatureDesc;
        // Re-stringify with feature data
        await invoke('update_backstory', {
          characterId,
          payload: {
            backstory_text: fullBackstory,
            personality_traits: personalityTraits,
            ideals: personalityObj.ideals || '',
            bonds: personalityObj.bonds || '',
            flaws: personalityObj.flaws || '',
            allies_organizations: '',
            appearance_notes: identity.physicalDescription || '',
            age: identity.age || '',
            height: identity.height || '',
            weight: identity.weight || '',
            eyes: identity.eyes || '',
            hair: identity.hair || '',
            skin: identity.skin || '',
            goals_motivations: JSON.stringify(goalsObj),
            portrait_data: identity.portrait || '',
          },
        }).catch(() => {});
      } else {
        await invoke('update_backstory', {
          characterId,
          payload: {
            backstory_text: fullBackstory,
            personality_traits: personalityTraits,
            ideals: personalityObj.ideals || '',
            bonds: personalityObj.bonds || '',
            flaws: personalityObj.flaws || '',
            allies_organizations: '',
            appearance_notes: identity.physicalDescription || '',
            age: identity.age || '',
            height: identity.height || '',
            weight: identity.weight || '',
            eyes: identity.eyes || '',
            hair: identity.hair || '',
            skin: identity.skin || '',
            goals_motivations: goalsPayload,
            portrait_data: identity.portrait || '',
          },
        }).catch(() => {});
      }

      toast.success(`${overview.name} is ready for adventure!`);
      navigate(`/character/${characterId}`);
    } catch (err) {
      toast.error(`Failed to save: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d12', color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-heading)', fontSize: 14 }}>
        Preparing character setup...
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0d0d12', overflow: 'hidden' }}>
      {/* Atmosphere */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(46,31,94,0.18) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        {PARTICLES.map(p => (
          <motion.span
            key={p.id}
            style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, fontFamily: 'serif', fontSize: 12, color: accent, opacity: 0, pointerEvents: 'none', userSelect: 'none' }}
            animate={{ y: [0, -100], opacity: [0, 0.06, 0.03, 0] }}
            transition={{ delay: p.delay, duration: p.dur, repeat: Infinity, repeatDelay: Math.random() * 6 + 4, ease: 'linear' }}
          >
            {p.sym}
          </motion.span>
        ))}
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 620, padding: '28px 24px 0', flexShrink: 0 }}>
        {/* Character name */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-heading)', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(200,175,130,0.25)', marginBottom: 4 }}>Character Setup</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: '#efe0c0', fontWeight: 700 }}>
              {overview?.name || 'New Character'}
              <span style={{ fontSize: 12, color: 'rgba(200,175,130,0.35)', fontWeight: 400, marginLeft: 8 }}>
                {[overview?.race, overview?.primary_class].filter(Boolean).join(' ')}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate(`/character/${characterId}`)}
            style={{ border: 'none', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.05em' }}
          >
            Skip Setup
          </button>
        </div>

        {/* Step label */}
        <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-heading)', color: accent, letterSpacing: '0.06em' }}>
            {stepLabel}
          </span>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(200,175,130,0.25)' }}>
            {Math.round(((step - 1) / (steps.length - 1)) * 100)}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ position: 'relative', height: 3, borderRadius: 2, background: 'rgba(201,168,76,0.1)', marginBottom: 14, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${accent}, #f0d878)` }}
          />
        </div>

        {/* Step indicator dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
          {steps.map((s, i) => {
            const n = i + 1;
            const done = n < step;
            const current = n === step;
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontFamily: 'var(--font-heading)', fontWeight: 700, flexShrink: 0,
                  border: `1.5px solid ${done || current ? accent : 'rgba(201,168,76,0.2)'}`,
                  background: done ? accent : current ? `${accent}20` : 'transparent',
                  color: done ? '#12101c' : current ? accent : 'rgba(201,168,76,0.3)',
                  transition: 'all 0.3s',
                }}>
                  {done ? <Check size={11} /> : n}
                </div>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-heading)', color: current ? accent : 'rgba(200,175,130,0.25)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</span>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: done ? `${accent}50` : 'rgba(201,168,76,0.1)', marginLeft: 4 }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Build Banner */}
      {!showQuickBuild && (
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 620, padding: '0 24px', flexShrink: 0 }}>
          <motion.button
            onClick={() => setShowQuickBuild(true)}
            whileHover={{ y: -1, boxShadow: `0 4px 20px rgba(201,168,76,0.25)` }}
            whileTap={{ scale: 0.99 }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 20px', borderRadius: 12, cursor: 'pointer',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(240,216,120,0.04) 100%)',
              border: '1.5px solid rgba(201,168,76,0.3)',
              marginBottom: 16, transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(135deg, ${accent}, #f0d878)`,
              boxShadow: `0 0 12px rgba(201,168,76,0.3)`,
              flexShrink: 0,
            }}>
              <Zap size={18} style={{ color: '#12101c' }} />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: '#efe0c0', fontWeight: 700, letterSpacing: '0.04em' }}>
                Quick Build — One-click character
              </div>
              <div style={{ fontSize: 11, color: 'rgba(200,175,130,0.4)', marginTop: 2 }}>
                Create a fully equipped, ready-to-play character in seconds
              </div>
            </div>
            <ChevronRight size={16} style={{ color: accent, opacity: 0.5, flexShrink: 0 }} />
          </motion.button>
        </div>
      )}

      {/* Quick Build Expanded Panel */}
      <AnimatePresence>
        {showQuickBuild && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 620, padding: '0 24px', overflow: 'hidden', flexShrink: 0, flex: 1, overflowY: 'auto' }}
          >
            <div style={{
              borderRadius: 14, padding: '24px 20px',
              background: 'rgba(11,9,20,0.95)',
              border: '1.5px solid rgba(201,168,76,0.3)',
              boxShadow: '0 0 30px rgba(201,168,76,0.06), inset 0 1px 0 rgba(201,168,76,0.08)',
              marginBottom: 16,
            }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 48, height: 48, borderRadius: 14,
                  background: `linear-gradient(135deg, ${accent}, #f0d878)`,
                  boxShadow: `0 0 24px rgba(201,168,76,0.3)`,
                  marginBottom: 12,
                }}>
                  <Zap size={24} style={{ color: '#12101c' }} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: '#efe0c0', marginBottom: 4, fontWeight: 700 }}>
                  Quick Build
                </h2>
                <p style={{ fontSize: 12, color: 'rgba(200,175,130,0.4)', maxWidth: 380, margin: '0 auto' }}>
                  Create a ready-to-play character in seconds — fully equipped with gear, features, spells, and backstory.
                </p>
              </div>

              {/* Character Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 10,
                marginBottom: 16,
              }}>
                {PREMADE_CHARACTERS.map(template => (
                  <motion.button
                    key={template.id}
                    onClick={() => handleQuickBuild(template)}
                    disabled={quickBuildBusy}
                    whileHover={!quickBuildBusy ? { y: -3, boxShadow: `0 6px 20px rgba(201,168,76,0.2)` } : {}}
                    whileTap={!quickBuildBusy ? { scale: 0.97 } : {}}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      padding: '16px 10px 14px', borderRadius: 12, cursor: quickBuildBusy ? 'wait' : 'pointer',
                      background: 'rgba(201,168,76,0.04)',
                      border: '1px solid rgba(201,168,76,0.15)',
                      transition: 'all 0.2s',
                      opacity: quickBuildBusy ? 0.5 : 1,
                    }}
                    onMouseEnter={e => { if (!quickBuildBusy) e.currentTarget.style.borderColor = `${accent}50`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'; }}
                  >
                    <span style={{ fontSize: 28, lineHeight: 1 }}>{template.icon}</span>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: '#efe0c0', fontWeight: 600, textAlign: 'center', letterSpacing: '0.02em' }}>
                      {template.name}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(200,175,130,0.35)', fontFamily: 'var(--font-heading)', letterSpacing: '0.04em' }}>
                      {template.race} {template.className}
                    </div>
                    <div style={{ fontSize: 9, color: 'rgba(200,175,130,0.25)', textAlign: 'center', lineHeight: 1.4, marginTop: 2, minHeight: 26 }}>
                      {template.flavor}
                    </div>
                    <div style={{
                      display: 'flex', gap: 6, marginTop: 4, fontSize: 9, fontFamily: 'var(--font-mono)', color: 'rgba(200,175,130,0.2)',
                    }}>
                      <span>HP {template.hp}</span>
                      <span>AC {template.ac}</span>
                    </div>
                    <div style={{
                      marginTop: 6, padding: '4px 14px', borderRadius: 6,
                      background: `linear-gradient(135deg, ${accent}, #f0d878)`,
                      fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700,
                      color: '#12101c', letterSpacing: '0.06em',
                    }}>
                      {quickBuildBusy ? 'BUILDING...' : 'CREATE'}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Collapse button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => setShowQuickBuild(false)}
                  style={{
                    border: 'none', background: 'none', cursor: 'pointer',
                    color: 'rgba(200,175,130,0.3)', fontFamily: 'var(--font-heading)',
                    fontSize: 11, letterSpacing: '0.05em', padding: '6px 16px',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(200,175,130,0.55)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(200,175,130,0.3)'}
                >
                  Close Quick Build — use step-by-step wizard instead
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {!showQuickBuild && (<>
      <div style={{ position: 'relative', zIndex: 10, flex: 1, width: '100%', maxWidth: 620, padding: '0 24px', overflowY: 'auto', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Class/Race info banner on relevant steps */}
            {['abilities', 'autoapply', 'skills'].includes(currentStep.id) && (
              <ClassRaceInfoBanner classData={classData} raceData={raceData} overview={overview} />
            )}

            {currentStep.id === 'quickstart' && (
              <StepQuickStart
                overview={overview}
                classData={classData}
                raceData={raceData}
                backgrounds={backgrounds}
                onApplyPreset={applyPreset}
                onSkip={skipQuickStart}
              />
            )}
            {currentStep.id === 'identity' && (
              <StepNameIdentity identity={identity} setIdentity={setIdentity} characterName={overview?.name} />
            )}
            {currentStep.id === 'backstory' && (
              <StepBackstoryLore backstoryData={backstoryData} setBackstoryData={setBackstoryData} overview={overview} />
            )}
            {currentStep.id === 'background' && (
              <StepBackground backgrounds={backgrounds} selected={selectedBackground} setSelected={setSelectedBackground} is2024={is2024} />
            )}
            {currentStep.id === 'abilities' && (
              <StepAbilities scores={scores} setScores={setScores} raceData={raceData} />
            )}
            {currentStep.id === 'autoapply' && (
              <StepAutoApply raceData={raceData} classData={classData} backgroundData={backgroundData} scores={scores} />
            )}
            {currentStep.id === 'skills' && (
              <StepSkills classData={classData} backgroundData={backgroundData} selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} scores={scores} />
            )}
            {currentStep.id === 'subclass' && (
              <StepSubclass classData={classData} selected={selectedSubclass} setSelected={setSelectedSubclass} />
            )}
            {currentStep.id === 'summary' && (
              <StepReviewSummary
                overview={overview}
                scores={scores}
                classData={classData}
                raceData={raceData}
                backgroundData={backgroundData}
                selectedSkills={selectedSkills}
                selectedBackground={selectedBackground}
              />
            )}
            {currentStep.id === 'review' && (
              <StepReview overview={overview} scores={scores} classData={classData} raceData={raceData} backgroundData={backgroundData} selectedSkills={selectedSkills} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav — hidden on quickstart (it has its own buttons) */}
      {currentStep.id !== 'quickstart' && (
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 620, padding: '16px 24px 24px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              border: 'none', background: 'none', cursor: step > 1 ? 'pointer' : 'not-allowed',
              color: step > 1 ? 'rgba(200,175,130,0.45)' : 'rgba(200,175,130,0.15)',
              fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.05em',
            }}
          >
            <ChevronLeft size={14} /> Back
          </button>

          <motion.button
            onClick={() => {
              if (isLast) finishSetup();
              else setStep(s => s + 1);
            }}
            disabled={!canNext() || saving}
            whileHover={canNext() && !saving ? { y: -2, boxShadow: `0 5px 18px ${accent}44` } : {}}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 24px', borderRadius: 9, border: 'none',
              cursor: canNext() && !saving ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--font-heading)', fontSize: 12, letterSpacing: '0.08em', fontWeight: 700,
              background: canNext() ? `linear-gradient(135deg, ${accent}, #f0d878)` : `${accent}20`,
              color: canNext() ? '#12101c' : `${accent}50`,
              opacity: saving ? 0.6 : canNext() ? 1 : 0.5,
            }}
          >
            {saving ? 'Saving...' : isLast ? <><Check size={14} /> Finish Setup</> : <>Continue <ChevronRight size={14} /></>}
          </motion.button>
        </div>
      )}
      </>)}

      {/* Version */}
      <div style={{ position: 'fixed', bottom: 12, right: 16, fontFamily: 'var(--font-heading)', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(200,175,130,0.12)' }}>
        {APP_VERSION}
      </div>
    </div>
  );
}
