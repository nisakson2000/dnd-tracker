import { invoke, Channel } from '@tauri-apps/api/core';

const MODEL_STORAGE_KEY = 'codex-ai-model';
const DEFAULT_MODEL = 'phi3.5';

export function getSelectedModel() {
  try {
    return localStorage.getItem(MODEL_STORAGE_KEY) || DEFAULT_MODEL;
  } catch { return DEFAULT_MODEL; }
}

export function setSelectedModel(model) {
  try {
    localStorage.setItem(MODEL_STORAGE_KEY, model);
  } catch { /* ignore storage errors */ }
}

export async function getAvailableModels() {
  try {
    const result = await invoke('check_ollama');
    return result.models || [];
  } catch { return []; }
}

export async function checkOllamaStatus() {
  try {
    const model = getSelectedModel();
    const result = await invoke('check_ollama');
    const models = result.models || [];
    const hasModel = models.some(m => m.startsWith(model));
    return {
      available: result.available,
      model,
      modelInstalled: hasModel,
      installedModels: models,
      error: result.error || (hasModel ? null : `Model "${model}" not installed`),
    };
  } catch (err) {
    const model = getSelectedModel();
    return { available: false, model, modelInstalled: false, installedModels: [], error: String(err) };
  }
}

export async function pullModel(onProgress, model) {
  const targetModel = model || getSelectedModel();
  const channel = new Channel();
  channel.onmessage = (progress) => {
    if (onProgress) onProgress(progress);
  };
  await invoke('ollama_pull', { model: targetModel, onProgress: channel });
}

// ─── Smart Wiki Search ──────────────────────────────────────────────────────

// Legacy keyword regex kept for backwards compatibility — still used as a fast-path
const RULES_KEYWORDS = /\b(spell|attack|damage|AC|armor|class|hit point|HP|saving throw|ability check|skill check|proficiency|initiative|condition|grapple|stealth|perception|rest|level|multiclass|feat|cantrip|ritual|concentration|opportunity|reaction|bonus action|movement|range|resistance|immunity|vulnerability|death save|wild shape|sneak attack|rage|weapon|shield|potion|magic item|monster|creature|race|background|alignment|experience|XP|challenge rating|CR|warlock|wizard|cleric|paladin|ranger|rogue|fighter|barbarian|bard|druid|sorcerer|monk|artificer|subclass|archetype|ability score|stat|modifier|DC|difficulty class|short rest|long rest|hit dice|temp HP|healing|cure|resurrect|teleport|conjure|summon|familiar|companion|mount|flanking|cover|terrain|dash|disengage|dodge|help action|ready action|inspiration|exhaustion|downtime|crafting)\b/i;

// Greetings / social phrases that should never trigger a wiki search
const GREETING_PATTERN = /^(hi|hello|hey|howdy|yo|sup|thanks|thank you|ok|okay|sure|yes|no|yep|nope|bye|goodbye|see ya|lol|haha|cool|nice|great|awesome|good|fine|wow|hmm|hm|ah|oh|ooh|umm|uh)\s*[!?.]*$/i;

export function needsWikiSearch(query) {
  const trimmed = query.trim();
  // Too short to be a real question
  if (trimmed.length <= 10) return false;
  // Pure greetings / social phrases — skip search
  if (GREETING_PATTERN.test(trimmed)) return false;
  // "Always-search" approach: any substantive query gets wiki context
  // The model will decide relevance from the results
  return true;
}

const wikiCache = new Map();
const WIKI_CACHE_MAX = 50;

export async function searchWikiContext(query) {
  const key = query.toLowerCase().trim();
  if (wikiCache.has(key)) return wikiCache.get(key);
  try {
    const result = await invoke('wiki_search', { q: query, perPage: 3 });
    if (!result.items || result.items.length === 0) {
      wikiCache.set(key, '');
      return '';
    }
    const text = result.items
      .map(item => `[${item.title}] ${item.summary}`)
      .join('\n');
    wikiCache.set(key, text);
    if (wikiCache.size > WIKI_CACHE_MAX) wikiCache.delete(wikiCache.keys().next().value);
    return text;
  } catch {
    return '';
  }
}

export async function* streamChat(messages, options = {}) {
  const queue = [];
  let resolveWait = null;
  let finished = false;
  let error = null;

  const channel = new Channel();
  channel.onmessage = (chunk) => {
    if (chunk.content) queue.push(chunk.content);
    if (chunk.done) finished = true;
    if (resolveWait) { resolveWait(); resolveWait = null; }
  };

  const invokePromise = invoke('ollama_chat', {
    model: options.model || getSelectedModel(),
    messages,
    onChunk: channel,
    maxTokens: options.maxTokens || null,
    temperature: options.temperature || null,
  }).catch(err => {
      error = err;
      finished = true;
      if (resolveWait) { resolveWait(); resolveWait = null; }
    });

  while (true) {
    while (queue.length > 0) {
      yield queue.shift();
    }
    if (finished) break;
    await new Promise(r => { resolveWait = r; });
  }

  await invokePromise;
  if (error) throw new Error(String(error));
}

// One-shot generation (non-streaming) for AI modules
export async function generateAI(prompt, system, options = {}) {
  return invoke('ollama_generate', {
    model: options.model || 'llama3.2',
    prompt,
    system: system || null,
    maxTokens: options.maxTokens || 1024,
    temperature: options.temperature || 0.7,
  });
}
