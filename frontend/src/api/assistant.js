const OLLAMA_URL = 'http://localhost:11434';

export async function checkOllamaStatus(model = 'phi3.5') {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return { available: false, model, error: 'Ollama returned an error' };
    const data = await res.json();
    const models = (data.models || []).map(m => m.name);
    const hasModel = models.some(m => m.startsWith(model));
    return {
      available: true,
      model,
      modelInstalled: hasModel,
      installedModels: models,
      error: hasModel ? null : `Model "${model}" not installed`,
    };
  } catch (err) {
    return { available: false, model, modelInstalled: false, installedModels: [], error: 'Ollama is not running' };
  }
}

export async function listModels() {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || []).map(m => ({ name: m.name, size: m.size, modified: m.modified_at }));
  } catch {
    return [];
  }
}

export async function* streamChat(model, messages) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: true }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    throw new Error(`Ollama error: ${text}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line);
        if (json.message?.content) {
          yield json.message.content;
        }
        if (json.done) return;
      } catch {
        // Skip malformed lines
      }
    }
  }
}
