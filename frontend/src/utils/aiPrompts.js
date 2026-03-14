/**
 * AI Prompt Templates — Phase 5: AI Module Expansion
 *
 * Each module exports a function that takes campaign context data
 * and returns { system, prompt } for Ollama generation.
 */

// ── Shared system preamble ──
const DM_PREAMBLE = `You are an expert Dungeon Master's creative writing assistant for a D&D 5e campaign. Write vivid, evocative content that a DM can read aloud or use as reference. Use second person sparingly — prefer atmospheric third-person narration. Never break character or mention you are an AI. Keep output in clean markdown.`;

// ── Context formatters ──
function fmtNpcs(npcs) {
  if (!npcs?.length) return '';
  return `\n\nKEY NPCs:\n${npcs.slice(0, 8).map(n => `- ${n.name} (${n.role || 'unknown role'}, ${n.status || 'alive'})${n.disposition ? ` — Disposition: ${n.disposition}` : ''}`).join('\n')}`;
}

function fmtFactions(factions) {
  if (!factions?.length) return '';
  return `\n\nFACTIONS:\n${factions.slice(0, 6).map(f => `- ${f.name}: ${f.description?.slice(0, 80) || 'no desc'}${f.alignment ? ` [${f.alignment}]` : ''}`).join('\n')}`;
}

function fmtQuests(quests) {
  if (!quests?.length) return '';
  return `\n\nACTIVE QUESTS:\n${quests.filter(q => q.status === 'active' || q.status === 'in_progress').slice(0, 6).map(q => `- "${q.title}" (${q.status}) — ${q.description?.slice(0, 60) || 'no desc'}`).join('\n')}`;
}

function fmtWeather(weather) {
  if (!weather) return '';
  return `\n\nWEATHER: ${weather.season || 'unknown'} season, ${weather.temperature || 'mild'} temperature, ${weather.precipitation || 'none'} precipitation, ${weather.wind || 'calm'} wind${weather.special_effects ? ` — ${weather.special_effects}` : ''}`;
}

function fmtScene(scene) {
  if (!scene) return '';
  return `\n\nCURRENT SCENE: "${scene.name}"${scene.location ? ` at ${scene.location}` : ''}${scene.phase ? ` (${scene.phase} phase)` : ''}${scene.mood ? ` — mood: ${scene.mood}` : ''}${scene.description ? `\nScene description: ${scene.description.slice(0, 200)}` : ''}`;
}

function fmtPlayers(players) {
  if (!players?.length) return '';
  return `\n\nPARTY MEMBERS:\n${players.slice(0, 6).map(p => `- ${p.display_name || p.player_uuid?.slice(0, 8)}${p.class_level ? ` (${p.class_level})` : ''} — HP: ${p.hp_current}/${p.hp_max}`).join('\n')}`;
}

function fmtTimeline(timeline) {
  if (!timeline?.length) return '';
  const recent = timeline.slice(0, 5);
  return `\n\nRECENT TIMELINE:\n${recent.map(t => `- ${t.title}${t.category ? ` [${t.category}]` : ''}`).join('\n')}`;
}

function fmtEconomy(economy) {
  if (!economy) return '';
  return `\n\nECONOMY: Prosperity: ${economy.prosperity || 'moderate'}, Tax rate: ${Math.round((economy.tax_rate || 0.1) * 100)}%, Price modifier: ${economy.price_modifier || 1.0}x`;
}

// ── Module 1: Scene Description ──
export function buildScenePrompt(ctx) {
  const system = DM_PREAMBLE + `\n\nYou specialize in creating atmospheric scene descriptions for D&D sessions. Include sensory details: what the characters see, hear, smell, and feel. Write 2-3 paragraphs.`;

  let prompt = `Generate a vivid scene description for the following setting:`;
  prompt += fmtScene(ctx.scene);
  prompt += fmtWeather(ctx.weather);
  prompt += fmtNpcs(ctx.npcs);
  if (ctx.userInput) prompt += `\n\nAdditional DM notes: ${ctx.userInput}`;
  prompt += `\n\nWrite an atmospheric description the DM can read aloud to players.`;

  return { system, prompt };
}

// ── Module 2: NPC Dialogue ──
export function buildNpcDialoguePrompt(ctx) {
  const system = DM_PREAMBLE + `\n\nYou specialize in writing NPC dialogue and personality. Write dialogue that reveals character, advances the story, and gives the DM options for roleplay. Include speech patterns, mannerisms, and suggested responses to common player questions.`;

  let prompt = `Generate dialogue and roleplay notes for this NPC:`;
  if (ctx.npc) {
    prompt += `\n\nNPC: ${ctx.npc.name}`;
    prompt += `\nRole: ${ctx.npc.role || 'unknown'}`;
    prompt += `\nRace: ${ctx.npc.race || 'unknown'}`;
    prompt += `\nLocation: ${ctx.npc.location || 'unknown'}`;
    prompt += `\nDisposition: ${ctx.npc.disposition || 'Neutral'} (score: ${ctx.npc.disposition_score || 0})`;
    if (ctx.npc.description) prompt += `\nDescription: ${ctx.npc.description}`;
    if (ctx.npc.dm_notes) prompt += `\nDM Notes: ${ctx.npc.dm_notes}`;
  }
  prompt += fmtQuests(ctx.quests);
  prompt += fmtPlayers(ctx.players);
  if (ctx.userInput) prompt += `\n\nContext/topic: ${ctx.userInput}`;
  prompt += `\n\nWrite:\n1. A greeting the NPC would use\n2. 3-4 dialogue lines showing their personality\n3. What they know about current quests/events\n4. How they react if pressed or threatened`;

  return { system, prompt };
}

// ── Module 3: Session Summary ──
export function buildSessionSummaryPrompt(ctx) {
  const system = DM_PREAMBLE + `\n\nYou specialize in writing session summaries and recaps. Create a narrative summary that captures the key events, decisions, and consequences of a D&D session. Write in past tense.`;

  let prompt = `Generate a session summary/recap based on the following campaign state:`;
  if (ctx.campaignName) prompt += `\n\nCampaign: ${ctx.campaignName}`;
  prompt += fmtScene(ctx.scene);
  prompt += fmtQuests(ctx.quests);
  prompt += fmtNpcs(ctx.npcs);
  prompt += fmtPlayers(ctx.players);
  prompt += fmtTimeline(ctx.timeline);
  if (ctx.sessionEvents?.length) {
    prompt += `\n\nSESSION EVENTS:\n${ctx.sessionEvents.slice(0, 20).map(e => `- [${e.event_type}] ${JSON.stringify(e.payload_json || {}).slice(0, 100)}`).join('\n')}`;
  }
  if (ctx.userInput) prompt += `\n\nAdditional notes: ${ctx.userInput}`;
  prompt += `\n\nWrite a 3-4 paragraph narrative session recap suitable for reading at the start of the next session.`;

  return { system, prompt };
}

// ── Module 4: Campaign Recap ──
export function buildCampaignRecapPrompt(ctx) {
  const system = DM_PREAMBLE + `\n\nYou write epic campaign recaps that weave together multiple storylines. Focus on the big picture: major plot arcs, faction movements, and character development.`;

  let prompt = `Generate an overarching campaign recap:`;
  if (ctx.campaignName) prompt += `\n\nCampaign: ${ctx.campaignName}`;
  if (ctx.campaignDescription) prompt += `\nDescription: ${ctx.campaignDescription}`;
  prompt += fmtQuests(ctx.quests);
  prompt += fmtFactions(ctx.factions);
  prompt += fmtNpcs(ctx.npcs);
  prompt += fmtTimeline(ctx.timeline);
  prompt += fmtPlayers(ctx.players);
  if (ctx.userInput) prompt += `\n\nFocus on: ${ctx.userInput}`;
  prompt += `\n\nWrite a dramatic 4-5 paragraph campaign recap covering the full story arc so far.`;

  return { system, prompt };
}

// ── Module 5: Character Backstory ──
export function buildBackstoryPrompt(ctx) {
  const system = DM_PREAMBLE + `\n\nYou help create rich character backstories for D&D characters. Include formative events, motivations, connections to the world, and plot hooks the DM can use.`;

  let prompt = `Help develop a character backstory:`;
  prompt += fmtFactions(ctx.factions);
  prompt += fmtNpcs(ctx.npcs);
  if (ctx.userInput) prompt += `\n\nCharacter details & DM guidance: ${ctx.userInput}`;
  prompt += `\n\nWrite:\n1. A compelling origin story (2 paragraphs)\n2. 3 key formative events\n3. 2-3 NPC connections from their past\n4. A secret or unresolved conflict\n5. Plot hooks the DM can use`;

  return { system, prompt };
}

// ── Module 6: Villain Monologue ──
export function buildVillainMonologuePrompt(ctx) {
  const system = DM_PREAMBLE + `\n\nYou write dramatic villain monologues and speeches. The villain should be menacing, intelligent, and reveal just enough of their plan to tantalize the players. Include stage directions for dramatic delivery.`;

  let prompt = `Create a villain monologue:`;
  if (ctx.villain) {
    prompt += `\n\nVillain: ${ctx.villain.name}`;
    if (ctx.villain.role) prompt += `\nRole: ${ctx.villain.role}`;
    if (ctx.villain.description) prompt += `\nDescription: ${ctx.villain.description}`;
    if (ctx.villain.dm_notes) prompt += `\nMotivation/Notes: ${ctx.villain.dm_notes}`;
  }
  prompt += fmtPlayers(ctx.players);
  prompt += fmtQuests(ctx.quests);
  if (ctx.userInput) prompt += `\n\nContext/moment: ${ctx.userInput}`;
  prompt += `\n\nWrite:\n1. A dramatic opening line\n2. The main monologue (3-5 paragraphs with stage directions in italics)\n3. A threatening final line\n4. How the villain reacts if interrupted`;

  return { system, prompt };
}

// ── Module 7: Story Hooks ──
export function buildStoryHooksPrompt(ctx) {
  const system = DM_PREAMBLE + `\n\nYou generate compelling story hooks and adventure seeds. Each hook should tie into existing campaign elements and create interesting player choices. Make hooks diverse — social, combat, mystery, exploration.`;

  let prompt = `Generate story hooks for this campaign:`;
  if (ctx.campaignName) prompt += `\n\nCampaign: ${ctx.campaignName}`;
  prompt += fmtQuests(ctx.quests);
  prompt += fmtFactions(ctx.factions);
  prompt += fmtNpcs(ctx.npcs);
  prompt += fmtWeather(ctx.weather);
  prompt += fmtEconomy(ctx.economy);
  prompt += fmtScene(ctx.scene);
  if (ctx.userInput) prompt += `\n\nTheme/direction: ${ctx.userInput}`;
  prompt += `\n\nGenerate 5 diverse story hooks. For each:\n- **Hook Name**: catchy title\n- **Type**: (social/combat/mystery/exploration/political)\n- **Setup**: 2-3 sentences describing the situation\n- **Twist**: an unexpected complication\n- **Connections**: which existing NPCs/factions/quests it ties into`;

  return { system, prompt };
}

// ── Module 8: Narrative Expansion ──
export function buildNarrativeExpansionPrompt(ctx) {
  const system = DM_PREAMBLE + `\n\nYou expand brief DM notes into full narrative descriptions, dialogue, and encounter details. Transform bullet points and shorthand into rich, usable session content.`;

  let prompt = `Expand these DM notes into full narrative content:`;
  prompt += fmtScene(ctx.scene);
  prompt += fmtNpcs(ctx.npcs);
  prompt += fmtWeather(ctx.weather);
  if (ctx.userInput) prompt += `\n\nDM NOTES TO EXPAND:\n${ctx.userInput}`;
  prompt += `\n\nExpand the notes into:\n1. A read-aloud description (1-2 paragraphs)\n2. Key NPC dialogue for the scene\n3. Skill check DCs and outcomes\n4. Possible complications\n5. Transition to the next scene`;

  return { system, prompt };
}

// ── Module 9: Lore Generation ──
export function buildLorePrompt(ctx) {
  const system = DM_PREAMBLE + `\n\nYou create rich world lore, history, legends, and cultural details for D&D settings. Write lore that feels lived-in and can be revealed to players through in-game discoveries.`;

  let prompt = `Generate world lore for this campaign:`;
  if (ctx.campaignName) prompt += `\n\nCampaign: ${ctx.campaignName}`;
  prompt += fmtFactions(ctx.factions);
  prompt += fmtNpcs(ctx.npcs);
  prompt += fmtTimeline(ctx.timeline);
  prompt += fmtScene(ctx.scene);
  if (ctx.userInput) prompt += `\n\nLore topic/request: ${ctx.userInput}`;
  prompt += `\n\nGenerate:\n1. **Historical Background**: 2-3 paragraphs of history\n2. **Legends & Myths**: 2 local legends\n3. **Cultural Details**: customs, traditions, taboos\n4. **Hidden Secrets**: things the players might discover\n5. **In-Game Documents**: a letter, inscription, or passage the DM can hand to players`;

  return { system, prompt };
}

// ── Module registry for the UI ──
export const AI_MODULES = [
  { key: 'scene', label: 'Scene Description', icon: 'eye', builder: buildScenePrompt, placeholder: 'Describe the mood, time of day, or specific elements to include...', needsContext: ['scene', 'weather', 'npcs'] },
  { key: 'npc-dialogue', label: 'NPC Dialogue', icon: 'message-circle', builder: buildNpcDialoguePrompt, placeholder: 'What topic or situation should the NPC address?', needsContext: ['npcs', 'quests', 'players'], selectNpc: true },
  { key: 'session-summary', label: 'Session Summary', icon: 'scroll', builder: buildSessionSummaryPrompt, placeholder: 'Any specific events to highlight...', needsContext: ['scene', 'quests', 'npcs', 'players', 'timeline'] },
  { key: 'campaign-recap', label: 'Campaign Recap', icon: 'book-open', builder: buildCampaignRecapPrompt, placeholder: 'Focus on specific storylines or time period...', needsContext: ['quests', 'factions', 'npcs', 'timeline', 'players'], playerVisible: true },
  { key: 'backstory', label: 'Character Backstory', icon: 'user', builder: buildBackstoryPrompt, placeholder: 'Character name, race, class, and any themes or secrets to weave in...', needsContext: ['factions', 'npcs'], playerVisible: true },
  { key: 'villain', label: 'Villain Monologue', icon: 'skull', builder: buildVillainMonologuePrompt, placeholder: 'What moment is this? (confrontation, reveal, taunt...)', needsContext: ['players', 'quests'], selectNpc: true },
  { key: 'hooks', label: 'Story Hooks', icon: 'compass', builder: buildStoryHooksPrompt, placeholder: 'Theme or direction for the hooks...', needsContext: ['quests', 'factions', 'npcs', 'weather', 'economy', 'scene'] },
  { key: 'expand', label: 'Narrative Expand', icon: 'file-text', builder: buildNarrativeExpansionPrompt, placeholder: 'Paste your brief DM notes here to expand...', needsContext: ['scene', 'npcs', 'weather'] },
  { key: 'lore', label: 'Lore Generator', icon: 'library', builder: buildLorePrompt, placeholder: 'What aspect of the world needs lore? (location, deity, artifact...)', needsContext: ['factions', 'npcs', 'timeline', 'scene'], playerVisible: true },
];
