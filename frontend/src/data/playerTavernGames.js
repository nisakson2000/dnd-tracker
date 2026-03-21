/**
 * playerTavernGames.js
 * Player Mode: Tavern mini-games, gambling, and social activities
 * Pure JS — no React dependencies.
 */

export const TAVERN_GAMES = [
  { name: 'Three-Dragon Ante', type: 'Card Game', players: '2-6', rules: 'Ante up, play cards with dragon values. Highest hand wins the pot. Bluffing allowed.', skill: 'Deception vs Insight', stakes: '1-10 gp per round' },
  { name: 'Liar\'s Dice', type: 'Dice Game', players: '2-8', rules: 'Each player rolls dice hidden. Bid on total count of a face value among ALL dice. Challenge = reveal.', skill: 'Deception vs Insight', stakes: '1-5 gp per round' },
  { name: 'Arm Wrestling', type: 'Strength Contest', players: '2', rules: 'Contested Athletics checks. Best of 3 or sudden death.', skill: 'Athletics (STR)', stakes: '5-50 gp per match' },
  { name: 'Darts', type: 'Dexterity Game', players: '2-4', rules: 'Ranged attack rolls against increasing DCs (10, 13, 16, 19). Highest total wins.', skill: 'DEX (ranged attack)', stakes: '1-5 gp per game' },
  { name: 'Drinking Contest', type: 'Endurance', players: '2+', rules: 'CON saves with increasing DC (10, 12, 14, 16...). Fail = drunk. Last one standing wins.', skill: 'Constitution save', stakes: '5-20 gp + bragging rights' },
  { name: 'Knife Game (Five Finger Fillet)', type: 'Dexterity', players: '2', rules: 'Escalating DEX checks (DC 10, 13, 16, 19). Fail = 1d4 piercing damage.', skill: 'Sleight of Hand', stakes: '10-50 gp' },
  { name: 'Storytelling', type: 'Performance', players: '2+', rules: 'Each contestant tells a tale. Performance check. Audience (DM) judges.', skill: 'Performance (CHA)', stakes: 'Tips from crowd (1d6 gp)' },
  { name: 'Chess/Dragonchess', type: 'Strategy', players: '2', rules: 'Contested Intelligence checks. Or play out with actual strategy talk.', skill: 'Intelligence (no proficiency)', stakes: '1-100 gp' },
];

export const GAMBLING_RULES = {
  cheating: 'Sleight of Hand vs passive Perception of other players. Fail = caught.',
  magicCheating: 'Guidance, Enhance Ability, Friends — if subtle. Detect Magic ruins it.',
  houseEdge: 'Most tavern games favor the house. DC is usually 1-2 higher than fair.',
  limits: 'Most taverns limit bets to 10-50 gp. High-stakes games in back rooms.',
  consequences: 'Caught cheating: kicked out, barred, or beaten. Depending on the tavern.',
};

export const TAVERN_ACTIVITIES = [
  { activity: 'Gather Rumors', skill: 'Persuasion or buying drinks (1-5 gp)', result: 'DM provides a rumor hook. May be true, partially true, or false.' },
  { activity: 'Find a Contact', skill: 'Persuasion DC 15 or Streetwise/Investigation', result: 'Connect with a fence, informant, or specialist.' },
  { activity: 'Start a Bar Fight', skill: 'Intimidation or Provocation', result: 'Unarmed combat. 1 + STR mod damage. Guards arrive in 1d4 rounds.' },
  { activity: 'Perform for Tips', skill: 'Performance DC 10-20', result: 'DC 10: 1d4 sp. DC 15: 1d6 gp. DC 20: 2d6 gp + reputation.' },
  { activity: 'Eavesdrop', skill: 'Stealth or Perception DC 12-18', result: 'Overhear a conversation. Quality depends on roll.' },
  { activity: 'Recruit Hirelings', skill: 'Persuasion DC 10-15', result: 'Find willing workers. Better rolls = better quality.' },
];

export const DRINKING_EFFECTS = [
  { drinks: '1-2', effect: 'Slightly tipsy. No mechanical effect. Good roleplay.' },
  { drinks: '3-4', effect: 'Buzzed. Disadvantage on precise skill checks (Sleight of Hand, etc.).' },
  { drinks: '5-6', effect: 'Drunk. Disadvantage on INT, WIS, DEX checks and saves.' },
  { drinks: '7+', effect: 'Hammered. CON save DC 15 or fall unconscious for 1d4 hours.' },
];

export function rollTavernGame(playerMod, opponentMod) {
  const playerRoll = Math.floor(Math.random() * 20) + 1 + playerMod;
  const opponentRoll = Math.floor(Math.random() * 20) + 1 + opponentMod;
  return {
    playerTotal: playerRoll,
    opponentTotal: opponentRoll,
    winner: playerRoll >= opponentRoll ? 'player' : 'opponent',
    margin: Math.abs(playerRoll - opponentRoll),
  };
}

export function getGame(name) {
  return TAVERN_GAMES.find(g =>
    g.name.toLowerCase().includes((name || '').toLowerCase())
  ) || null;
}
