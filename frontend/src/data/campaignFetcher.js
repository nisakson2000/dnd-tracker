// Shared utility for fetching community campaigns from 5etools homebrew repo

const HOMEBREW_API_URL = 'https://api.github.com/repos/TheGiddyLimit/homebrew/contents/adventure';
const CACHE_KEY = 'codex-community-campaigns';
const CACHE_TTL = 1000 * 60 * 60 * 4; // 4 hours

// Parse a 5etools homebrew filename into a clean name, author, and description
function parseAdventureFilename(fileName) {
  const raw = fileName.replace(/\.json$/, '');
  // 5etools filenames often follow: "Author; AdventureName" or "Author - AdventureName"
  let author = '';
  let title = raw;

  // Split on common delimiters
  const semiParts = raw.split(';').map(s => s.trim());
  if (semiParts.length >= 2) {
    author = semiParts[0].replace(/[_-]/g, ' ').trim();
    title = semiParts.slice(1).join(' ').trim();
  }

  // Clean up the title
  title = title
    .replace(/[_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Generate a brief description based on keywords in the title/filename
  let description = generateDescription(title, fileName);

  return { title, author, description };
}

function generateDescription(title, fileName) {
  const lower = (title + ' ' + fileName).toLowerCase();
  const parts = [];

  // Detect adventure type
  if (/dungeon|cave|tomb|crypt|mine|underground|lair/i.test(lower)) parts.push('A dungeon crawl adventure');
  else if (/mystery|murder|detective|investigation/i.test(lower)) parts.push('A mystery and investigation adventure');
  else if (/horror|haunt|curse|dread|dark/i.test(lower)) parts.push('A dark horror-themed adventure');
  else if (/sea|ocean|ship|pirate|coast|island/i.test(lower)) parts.push('A nautical adventure');
  else if (/forest|wild|wilder|wood|swamp|marsh/i.test(lower)) parts.push('A wilderness exploration adventure');
  else if (/city|urban|guild|thief|heist/i.test(lower)) parts.push('An urban adventure');
  else if (/war|siege|battle|army|fort/i.test(lower)) parts.push('A war and combat-focused adventure');
  else if (/fey|fairy|feywild|dream/i.test(lower)) parts.push('A fey-themed adventure');
  else if (/dragon/i.test(lower)) parts.push('A dragon-themed adventure');
  else if (/undead|zombie|vampire|lich|necro/i.test(lower)) parts.push('An undead-themed adventure');
  else parts.push('A community-created adventure');

  // Add size hint
  const sizeKB = fileName.length; // rough proxy
  parts.push(`from the 5etools homebrew collection.`);

  return parts.join(' ');
}

export async function fetchCommunityList() {
  // Check cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL && Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch { /* ignore */ }

  const resp = await fetch(HOMEBREW_API_URL);
  if (!resp.ok) throw new Error(`GitHub API error: ${resp.status}`);
  const files = await resp.json();
  const list = files
    .filter(f => f.name.endsWith('.json'))
    .map(f => {
      const raw = f.name.replace(/\.json$/, '');
      // Try to extract ruleset from filename patterns
      let ruleset = '5e-2014'; // default — most 5etools homebrew is 5e
      if (/2024|5\.5|onednd/i.test(raw)) ruleset = '5e-2024';
      if (/pathfinder|pf2e/i.test(raw)) ruleset = 'pf2e';

      const { title, author, description } = parseAdventureFilename(f.name);

      return {
        name: title,
        fileName: f.name,
        downloadUrl: f.download_url,
        size: f.size,
        ruleset,
        author,
        description,
      };
    });

  // Cache result
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: list, timestamp: Date.now() }));
  } catch { /* ignore */ }

  return list;
}

// Fetch the first bit of an adventure to get its real description (lightweight)
export async function fetchAdventureDescription(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();
    // Try to extract a description from the adventure metadata
    if (data.adventure && Array.isArray(data.adventure) && data.adventure[0]) {
      const adv = data.adventure[0];
      const name = adv.name || '';
      const entries = adv.entries ? extractFluffText(adv.entries).substring(0, 200) : '';
      const level = adv.level ? `Levels ${adv.level.start || '?'}-${adv.level.end || '?'}` : '';
      return { name, description: entries, level };
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchAndParseAdventure(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch adventure: ${resp.status}`);
  return resp.json();
}

function extractFluffText(entries) {
  if (!entries) return '';
  if (typeof entries === 'string') return entries;
  if (Array.isArray(entries)) {
    return entries
      .map(e => {
        if (typeof e === 'string') return e;
        if (e && typeof e === 'object') {
          if (e.entries) return extractFluffText(e.entries);
          if (e.text) return e.text;
          if (e.name && e.entries) return `**${e.name}**: ${extractFluffText(e.entries)}`;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n\n');
  }
  return '';
}

export function parse5etoolsAdventure(data) {
  const npcs = [];
  const quests = [];
  const lore = [];
  const journals = [];

  if (data.monster && Array.isArray(data.monster)) {
    for (const m of data.monster.slice(0, 20)) {
      npcs.push({
        name: m.name || 'Unknown Creature',
        role: m.type?.type || m.type || 'Monster',
        race: typeof m.type === 'string' ? m.type : (m.type?.type || 'Unknown'),
        npc_class: `CR ${m.cr?.cr || m.cr || '?'}`,
        location: m.environment?.join(', ') || '',
        description: extractFluffText(m.fluff || m.entries) || `A ${m.size || ''}${m.type?.type || m.type || 'creature'}.`,
        notes: '', status: 'alive',
      });
    }
  }

  if (data.npc && Array.isArray(data.npc)) {
    for (const n of data.npc) {
      npcs.push({
        name: n.name || 'Unknown NPC', role: n.role || 'NPC', race: n.race || 'Unknown',
        npc_class: n.class || '', location: n.location || '',
        description: extractFluffText(n.entries || n.description) || '',
        notes: '', status: 'alive',
      });
    }
  }

  if (data.adventure && Array.isArray(data.adventure)) {
    for (const adv of data.adventure) {
      if (adv.name) lore.push({ title: adv.name, category: 'History', body: extractFluffText(adv.entries) || adv.name, related_to: '' });
    }
  }

  if (data.adventureData && Array.isArray(data.adventureData)) {
    for (const ad of data.adventureData) {
      if (ad.data && Array.isArray(ad.data)) {
        for (const chapter of ad.data) {
          if (chapter.name && chapter.entries) {
            const body = extractFluffText(chapter.entries);
            if (body && body.length > 20) {
              lore.push({ title: chapter.name, category: 'Location', body: body.substring(0, 2000), related_to: ad.name || '' });
            }
            if (Array.isArray(chapter.entries)) {
              for (const entry of chapter.entries) {
                if (entry && typeof entry === 'object' && entry.name && entry.type === 'section') {
                  quests.push({
                    title: entry.name, giver: '', description: extractFluffText(entry.entries) || entry.name,
                    status: 'active', notes: `From chapter: ${chapter.name}`,
                    objectives: [{ text: `Complete: ${entry.name}`, completed: false }],
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  if (data.item && Array.isArray(data.item)) {
    for (const item of data.item.slice(0, 10)) {
      lore.push({ title: item.name || 'Unknown Item', category: 'Item', body: extractFluffText(item.entries) || `${item.rarity || ''} ${item.type || 'item'}`.trim(), related_to: '' });
    }
  }

  if (data.spell && Array.isArray(data.spell)) {
    for (const spell of data.spell.slice(0, 10)) {
      lore.push({ title: spell.name || 'Unknown Spell', category: 'Magic', body: extractFluffText(spell.entries) || `Level ${spell.level || '?'} spell.`, related_to: '' });
    }
  }

  const advName = data.adventure?.[0]?.name || data._meta?.sources?.[0]?.full || 'Imported Adventure';
  journals.push({
    title: `Campaign Import: ${advName}`,
    session_number: 0,
    body: `## Imported Adventure: ${advName}\n\nImported ${npcs.length} NPCs, ${quests.length} quests, and ${lore.length} lore entries.\n\n${data.adventure?.[0]?.entries ? extractFluffText(data.adventure[0].entries).substring(0, 500) : ''}`,
    tags: 'import,homebrew',
    npcs_mentioned: npcs.slice(0, 5).map(n => n.name).join(','),
  });

  return { npcs, quests, lore, journals, name: advName };
}
