/**
 * playerBestCantripsRankingGuide.js
 * Player Mode: Best cantrips overall ranking with class recommendations
 * Pure JS — no React dependencies.
 */

export const CANTRIP_SCALING = {
  levels: 'Cantrip damage scales at character levels 5, 11, and 17.',
  note: 'Character level, NOT class level. Multiclass cantrips still scale.',
  dice: [
    { level: '1-4', dice: '1 die' },
    { level: '5-10', dice: '2 dice' },
    { level: '11-16', dice: '3 dice' },
    { level: '17-20', dice: '4 dice' },
  ],
};

export const DAMAGE_CANTRIP_RANKINGS = [
  { rank: 'S+', cantrip: 'Eldritch Blast', classes: ['Warlock'], damage: '1d10 force (per beam)', range: '120ft', why: 'Best cantrip in the game. Force damage. Multiple beams. Invocation synergy (Agonizing Blast, Repelling Blast).', note: 'Warlock-exclusive. Each beam = separate attack.' },
  { rank: 'S', cantrip: 'Toll the Dead', classes: ['Cleric', 'Wizard'], damage: '1d8/1d12 necrotic', range: '60ft', why: 'WIS save. 1d12 on damaged targets. Best generic damage cantrip.', note: '1d12 on already-hurt enemies = best damage cantrip for non-Warlocks.' },
  { rank: 'S', cantrip: 'Fire Bolt', classes: ['Sorcerer', 'Wizard', 'Artificer'], damage: '1d10 fire', range: '120ft', why: 'Solid damage die. Long range. Attack roll.', note: 'Fire is the most resisted element. But 1d10 + 120ft is great.' },
  { rank: 'A+', cantrip: 'Sacred Flame', classes: ['Cleric'], damage: '1d8 radiant', range: '60ft', why: 'DEX save. Ignores cover. Radiant damage (rarely resisted).', note: 'No cover bonus to saves. Great vs high AC targets behind cover.' },
  { rank: 'A+', cantrip: 'Mind Sliver', classes: ['Sorcerer', 'Wizard'], damage: '1d6 psychic', range: '60ft', why: 'INT save (usually low). -1d4 to next save. Sets up ally spells.', note: 'The -1d4 to next save is the real value. Combo with save-or-suck.' },
  { rank: 'A', cantrip: 'Chill Touch', classes: ['Sorcerer', 'Warlock', 'Wizard'], damage: '1d8 necrotic', range: '120ft', why: 'Prevents healing for 1 round. Undead get disadvantage to hit you.', note: 'Anti-healing. Essential vs trolls and vampires.' },
  { rank: 'A', cantrip: 'Sword Burst', classes: ['Sorcerer', 'Warlock', 'Wizard', 'Artificer'], damage: '1d6 force', range: '5ft (all adjacent)', why: 'AoE cantrip. Hits all adjacent enemies. DEX save.', note: 'Surrounded? Sword Burst. Only cantrip that can hit multiple.' },
  { rank: 'A', cantrip: 'Vicious Mockery', classes: ['Bard'], damage: '1d4 psychic', range: '60ft', why: 'WIS save. Target has disadvantage on next attack.', note: 'Low damage but the disadvantage is great defensive tool.' },
  { rank: 'B+', cantrip: 'Ray of Frost', classes: ['Sorcerer', 'Wizard', 'Artificer'], damage: '1d8 cold', range: '60ft', why: 'Attack roll. -10ft speed on hit.', note: 'Speed reduction stacks with other slows. Good for kiting.' },
  { rank: 'B', cantrip: 'Shocking Grasp', classes: ['Sorcerer', 'Wizard', 'Artificer'], damage: '1d8 lightning', range: 'Touch', why: 'Advantage vs metal armor. Target can\'t take reactions.', note: 'Hit and run. No AoO from target. Melee caster escape tool.' },
];

export const UTILITY_CANTRIP_RANKINGS = [
  { rank: 'S+', cantrip: 'Prestidigitation', classes: ['Sorcerer', 'Warlock', 'Wizard', 'Artificer'], why: 'Clean, flavor, warm, cool, light, color, mark. Infinite flavor.' },
  { rank: 'S+', cantrip: 'Minor Illusion', classes: ['Sorcerer', 'Warlock', 'Wizard', 'Bard'], why: 'Create image or sound. Distraction, cover, deception. Incredibly versatile.' },
  { rank: 'S', cantrip: 'Mage Hand', classes: ['Sorcerer', 'Warlock', 'Wizard', 'Artificer', 'Bard'], why: '30ft invisible (Arcane Trickster) hand. Interact at distance. Trigger traps safely.' },
  { rank: 'S', cantrip: 'Guidance', classes: ['Cleric', 'Druid', 'Artificer'], why: '+1d4 to ability check. Cast before every skill check.', note: 'Annoying to spam but mathematically great. +12.5% success.' },
  { rank: 'S', cantrip: 'Light', classes: ['Cleric', 'Sorcerer', 'Wizard', 'Artificer', 'Bard'], why: 'Free light. No hand needed. Essential for non-darkvision races.' },
  { rank: 'A+', cantrip: 'Mending', classes: ['Cleric', 'Druid', 'Sorcerer', 'Wizard', 'Artificer', 'Bard'], why: 'Repair broken objects. Warforged healing (niche). Creative uses.' },
  { rank: 'A+', cantrip: 'Thaumaturgy', classes: ['Cleric'], why: 'Booming voice, tremors, open doors. Great for intimidation RP.' },
  { rank: 'A', cantrip: 'Druidcraft', classes: ['Druid'], why: 'Predict weather, bloom flowers, nature flavor. Niche but thematic.' },
  { rank: 'A', cantrip: 'Message', classes: ['Sorcerer', 'Wizard', 'Bard', 'Artificer'], why: '120ft whispered communication. Tactical coordination. Secret messages.' },
  { rank: 'B+', cantrip: 'Shape Water', classes: ['Druid', 'Sorcerer', 'Wizard'], why: 'Move/freeze water. Creative problem solving. Bridge gaps, block doors.' },
];

export const CANTRIP_TIPS = [
  'Eldritch Blast is the best cantrip. Warlock exclusive.',
  'Toll the Dead: 1d12 on hurt targets. Best non-Warlock damage cantrip.',
  'Mind Sliver: -1d4 to next save. Combo with ally save-or-suck spells.',
  'Guidance: +1d4 to ability checks. Spam it before every check.',
  'Minor Illusion: creative uses are endless. Learn to use it well.',
  'Cantrips scale at character level 5, 11, 17. Not class level.',
  'Prestidigitation: infinite flavor. Clean yourself, flavor food, make marks.',
  'Chill Touch vs undead/trolls: prevents healing. Essential counter.',
  'Shocking Grasp: no reactions = no AoO. Escape melee safely.',
  'Take 1 damage cantrip and 1-2 utility cantrips. Balance offense and toolbox.',
];
