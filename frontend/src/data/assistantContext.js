import { HELP, GLOSSARY } from './helpText';

const APP_SUMMARY = `You are the Arcane Advisor, an AI assistant embedded in "The Codex" — a D&D 5e character tracking desktop application. You help users with:
1. Understanding how the app works and its features
2. Answering D&D 5e rules questions accurately
3. Helping fill out or update character sheet fields

APP SECTIONS:
- Character Sheet: Ability scores, saving throws, skills, HP, AC, speed, proficiency bonus, death saves, conditions, exhaustion, inspiration
- Backstory: Personality traits, bonds, flaws, ideals, physical description, portrait
- Features & Traits: Class features, racial traits, feats with uses/charges tracking
- Combat: Attacks, conditions, action economy, initiative tracker, combat log
- Spellbook: Spell slots, prepared spells, concentration tracking, ritual casting
- Inventory: Items, weapons, armor, currency, encumbrance, attunement (max 3)
- Campaign Journal: Session notes with markdown, NPC mentions, pinning
- NPCs: Relationships, roles, quest hooks, locations
- Quests: Objectives, rewards, priority, quest givers
- Lore & World: Categories (location, faction, deity, etc.), cross-references
- Dice Roller: d4-d100, custom expressions, advantage/disadvantage, saved macros
- Rules Reference: Searchable glossary of D&D mechanics
- Settings: Themes, fonts, density, Party Connect
- Export & Import: Full character JSON backup

Stay focused on D&D 5e and this application. Keep answers concise and practical.
When suggesting character data changes, describe what you'll change and include a JSON action block at the END of your response (after your explanation) in this exact format:
\`\`\`action
{"action": "action_name", "data": { ... }}
\`\`\`

Supported actions: add_spell, update_overview, add_feature, add_item, add_npc
Only include an action block when the user explicitly asks you to make a change.`;

function formatAbilityScore(ability, score) {
  const mod = Math.floor((score - 10) / 2);
  const sign = mod >= 0 ? '+' : '';
  return `${ability}: ${score} (${sign}${mod})`;
}

export function buildSystemPrompt(charData) {
  const parts = [APP_SUMMARY];

  if (charData) {
    const o = charData.overview || {};
    const abilities = (charData.ability_scores || []);
    const abilityLine = abilities
      .map(a => formatAbilityScore(a.ability, a.score))
      .join(' | ');

    const profSaves = (charData.saving_throw_proficiencies || [])
      .filter(s => s.proficient)
      .map(s => s.ability)
      .join(', ');

    const profSkills = (charData.skills || [])
      .filter(s => s.proficient)
      .map(s => s.name + (s.expertise ? ' (expertise)' : ''))
      .join(', ');

    const spellCount = (charData.spells || []).length;
    const preparedCount = (charData.spells || []).filter(s => s.prepared).length;
    const slots = (charData.spell_slots || [])
      .filter(s => s.max > 0)
      .map(s => `Lv${s.level}: ${s.max - s.used}/${s.max}`)
      .join(', ');

    const featureCount = (charData.features || []).length;
    const itemCount = (charData.inventory || []).length;
    const conditions = (charData.active_conditions || []).join(', ') || 'None';

    const currency = charData.currency || {};
    const gp = [
      currency.pp ? `${currency.pp}pp` : '',
      currency.gp ? `${currency.gp}gp` : '',
      currency.ep ? `${currency.ep}ep` : '',
      currency.sp ? `${currency.sp}sp` : '',
      currency.cp ? `${currency.cp}cp` : '',
    ].filter(Boolean).join(', ') || '0gp';

    parts.push(`
ACTIVE CHARACTER:
Name: ${o.name || 'Unknown'}
Race: ${o.race || 'Unknown'}${o.subrace ? ` (${o.subrace})` : ''}
Class: ${o.primary_class || 'Unknown'}${o.primary_subclass ? ` (${o.primary_subclass})` : ''} | Level: ${o.level || 1}
Background: ${o.background || 'None'} | Alignment: ${o.alignment || 'None'}
Ruleset: ${o.ruleset || '5e-2014'}
${abilityLine}
Max HP: ${o.max_hp || 0} | Current HP: ${o.current_hp || 0} | Temp HP: ${o.temp_hp || 0}
AC: ${o.armor_class || 10} | Speed: ${o.speed || 30}ft
Hit Dice: ${o.hit_dice_total || 0} total, ${o.hit_dice_used || 0} used
Death Saves: ${o.death_save_successes || 0} successes, ${o.death_save_failures || 0} failures
Inspiration: ${o.inspiration ? 'Yes' : 'No'} | Exhaustion: ${o.exhaustion_level || 0}
Saving Throw Proficiencies: ${profSaves || 'None'}
Skill Proficiencies: ${profSkills || 'None'}
Languages: ${o.languages || 'Common'}
Active Conditions: ${conditions}
Spells Known: ${spellCount} (${preparedCount} prepared) | Slots: ${slots || 'None'}
Features: ${featureCount} | Items: ${itemCount} | Currency: ${gp}`);
  }

  // Condensed rules reference
  const rulesRef = GLOSSARY.slice(0, 40).map(g => `${g.term}: ${g.definition}`).join('\n');
  parts.push(`\nRULES QUICK REFERENCE:\n${rulesRef}`);

  return parts.join('\n\n');
}

export function buildMessages(systemPrompt, conversationHistory, userMessage) {
  const messages = [{ role: 'system', content: systemPrompt }];

  // Keep last 10 exchanges (20 messages)
  const trimmed = conversationHistory.slice(-20);
  messages.push(...trimmed);
  messages.push({ role: 'user', content: userMessage });

  return messages;
}
