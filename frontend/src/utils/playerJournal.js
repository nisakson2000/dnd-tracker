const STORAGE_KEY = (charId) => `codex_player_journal_${charId}`;

export function loadJournal(characterId) {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY(characterId))) || { quests: [], npcs: [] };
  } catch { return { quests: [], npcs: [] }; }
}

export function saveJournal(characterId, journal) {
  localStorage.setItem(STORAGE_KEY(characterId), JSON.stringify(journal));
}

export function addQuest(characterId, quest) {
  const journal = loadJournal(characterId);
  const existing = journal.quests.find(q => q.title === quest.title);
  if (existing) {
    Object.assign(existing, quest);
  } else {
    journal.quests.push({ ...quest, receivedAt: Date.now() });
  }
  saveJournal(characterId, journal);
  return journal;
}

export function updateQuestStatus(characterId, title, status) {
  const journal = loadJournal(characterId);
  const quest = journal.quests.find(q => q.title === title);
  if (quest) quest.status = status;
  saveJournal(characterId, journal);
  return journal;
}

export function addNpc(characterId, npc) {
  const journal = loadJournal(characterId);
  const existing = journal.npcs.find(n => n.name === npc.name);
  if (existing) {
    Object.assign(existing, npc);
  } else {
    journal.npcs.push({ ...npc, discoveredAt: Date.now() });
  }
  saveJournal(characterId, journal);
  return journal;
}
