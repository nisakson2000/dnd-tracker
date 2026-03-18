const GUIDANCE_TIPS = {
  'campaign-prep': {
    'no-scenes': { text: "Scenes are the building blocks of your session \u2014 each one is a location or event your players will experience. Create your first one to get started.", section: 'campaign-hub' },
    'no-npcs': { text: "Every great campaign needs characters to interact with. Add an NPC \u2014 even a simple tavern keeper gives players someone to talk to.", section: 'npcs' },
    'no-quests': { text: "Quests give your players a goal and direction. Create one with objectives they can check off as they progress.", section: 'quests' },
    'no-encounters': { text: "Pre-build encounters so combat runs smoothly during your session. The Encounter Builder helps you balance CR.", section: 'encounter-builder' },
    'no-description': { text: "A campaign description helps set the tone. Even a few sentences about the world gives context to everything else.", section: 'campaign-hub' },
  },
  'session-prep': {
    'no-agenda': { text: "Write a quick session agenda \u2014 even 3 bullet points helps you stay on track and not forget key plot beats.", section: 'session-prep' },
    'review-quests': { text: "Check which quests are active before your players arrive. Mark any completed objectives from last session.", section: 'quests' },
  },
  'live-session': {
    'combat-ended': { text: "Combat is over! Consider awarding XP and distributing loot while it's fresh.", section: null },
    'scene-stale': { text: "You've been on this scene for a while. Ready to move to the next location?", section: null },
    'no-broadcast': { text: "Use broadcasts to narrate scene transitions \u2014 players see them as dramatic popups on their screens.", section: null },
    'first-encounter': { text: "Starting your first encounter? Initiative auto-rolls for everyone. Use damage buttons on monster cards to track HP.", section: null },
  },
  'post-session': {
    'write-recap': { text: "Write a quick session recap while it's fresh \u2014 your future self will thank you when players ask what happened.", section: 'journal' },
    'update-quests': { text: "Mark completed quest objectives and update quest statuses before you forget.", section: 'quests' },
  },
};

export default GUIDANCE_TIPS;

export function getTipsForStage(stage, progress, dismissedTips) {
  const stageTips = GUIDANCE_TIPS[stage];
  if (!stageTips) return [];

  const applicable = [];
  for (const [tipId, tip] of Object.entries(stageTips)) {
    if (dismissedTips.has(tipId)) continue;
    // Filter based on progress
    if (stage === 'campaign-prep') {
      if (tipId === 'no-scenes' && progress.sceneCount > 0) continue;
      if (tipId === 'no-npcs' && progress.npcCount > 0) continue;
      if (tipId === 'no-quests' && progress.questCount > 0) continue;
      if (tipId === 'no-encounters' && progress.encountersPrepped > 0) continue;
      if (tipId === 'no-description' && progress.descriptionFilled) continue;
    }
    applicable.push({ id: tipId, ...tip });
  }
  return applicable;
}
