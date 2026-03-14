import { invoke, Channel } from '@tauri-apps/api/core';

const MODEL = 'phi3.5';

export async function checkOllamaStatus() {
  try {
    const result = await invoke('check_ollama');
    const models = result.models || [];
    const hasModel = models.some(m => m.startsWith(MODEL));
    return {
      available: result.available,
      model: MODEL,
      modelInstalled: hasModel,
      installedModels: models,
      error: result.error || (hasModel ? null : `Model "${MODEL}" not installed`),
    };
  } catch (err) {
    return { available: false, model: MODEL, modelInstalled: false, installedModels: [], error: String(err) };
  }
}

export async function pullModel(onProgress) {
  const channel = new Channel();
  channel.onmessage = (progress) => {
    if (onProgress) onProgress(progress);
  };
  await invoke('ollama_pull', { model: MODEL, onProgress: channel });
}

export async function searchWikiContext(query) {
  try {
    const result = await invoke('wiki_search', { q: query, perPage: 3 });
    if (!result.items || result.items.length === 0) return '';
    return result.items
      .map(item => `[${item.title}] ${item.summary}`)
      .join('\n');
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
    model: options.model || MODEL,
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
