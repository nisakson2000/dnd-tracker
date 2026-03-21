/**
 * playerFighterSubclassRankingGuide.js
 * Player Mode: Fighter subclass ranking
 * Pure JS — no React dependencies.
 */

export const FIGHTER_SUBCLASS_RANKING = [
  {
    subclass: 'Echo Knight',
    source: "Explorer's Guide to Wildemount",
    tier: 'S',
    reason: 'Manifest Echo: create duplicate at 30ft. Attack through it. Teleport to it. Sentinel + PAM through echo. Best Fighter subclass.',
    keyFeatures: ['Manifest Echo (shadow clone)', 'Unleash Incarnation (extra attack through echo)', 'Echo Avatar (scout through echo)', 'Shadow Martyr (echo takes hit)'],
  },
  {
    subclass: 'Battle Master',
    source: "Player's Handbook",
    tier: 'S',
    reason: 'Superiority dice + maneuvers. Trip Attack, Precision Attack, Riposte. Most versatile Fighter. Always useful.',
    keyFeatures: ['Superiority Dice (d8→d12)', 'Maneuvers (many options)', 'Know Your Enemy', 'Relentless (regain 1 die on initiative if none left)'],
  },
  {
    subclass: 'Rune Knight',
    source: "Tasha's Cauldron of Everything",
    tier: 'A+',
    reason: 'Giant\'s Might: become Large + 1d6 extra damage. Runes provide diverse effects. Fire Rune: restrain on hit. Great scaling.',
    keyFeatures: ['Giant\'s Might (Large size + damage)', 'Rune Carver (2-5 runes)', 'Fire Rune (restrain)', 'Storm Rune (impose disadvantage on enemy)', 'Runic Juggernaut (Huge at L18)'],
  },
  {
    subclass: 'Eldritch Knight',
    source: "Player's Handbook",
    tier: 'A',
    reason: 'Wizard spellcasting (INT). Shield, Absorb Elements, Find Familiar. War Magic: cantrip + BA weapon attack. Full martial + magic defense.',
    keyFeatures: ['Spellcasting (Wizard list)', 'War Magic (cantrip + BA attack)', 'Eldritch Strike (-1 to saves)', 'Arcane Charge (teleport on Action Surge)'],
  },
  {
    subclass: 'Psi Warrior',
    source: "Tasha's Cauldron of Everything",
    tier: 'A',
    reason: 'Psionic Energy dice: Protective Field (reduce damage), Psionic Strike (+force damage), Telekinetic Movement. Versatile resource.',
    keyFeatures: ['Psionic Energy Dice', 'Protective Field', 'Psionic Strike', 'Telekinetic Adept', 'Bulwark of Force'],
  },
  {
    subclass: 'Samurai',
    source: "Xanathar's Guide to Everything",
    tier: 'A',
    reason: 'Fighting Spirit: BA advantage on all attacks this turn (3/LR) + temp HP. WIS save proficiency. Elegant Courtier: CHA to WIS.',
    keyFeatures: ['Fighting Spirit (BA advantage + temp HP)', 'Elegant Courtier (WIS to Persuasion)', 'Tireless Spirit', 'Rapid Strike (trade advantage for extra attack)', 'Strength Before Death'],
  },
  {
    subclass: 'Champion',
    source: "Player's Handbook",
    tier: 'B',
    reason: 'Improved Critical (19-20). Simple and effective. Remarkable Athlete. No resources to track. Best for new players.',
    keyFeatures: ['Improved Critical (19-20)', 'Remarkable Athlete', 'Additional Fighting Style', 'Superior Critical (18-20 at L15)', 'Survivor (regen at L18)'],
  },
  {
    subclass: 'Cavalier',
    source: "Xanathar's Guide to Everything",
    tier: 'B+',
    reason: 'Unwavering Mark: mark enemies + BA attack if they attack others. Warding Maneuver. Hold the Line. Tank subclass.',
    keyFeatures: ['Unwavering Mark', 'Warding Maneuver', 'Hold the Line', 'Vigilant Defender (OA every turn at L18)'],
  },
  {
    subclass: 'Arcane Archer',
    source: "Xanathar's Guide to Everything",
    tier: 'C+',
    reason: 'Only 2 Arcane Shots per SR. Cool effects (Grasping, Bursting, Seeking) but too few uses. Runs out immediately.',
    keyFeatures: ['Arcane Shot (2 options, 2/SR)', 'Magic Arrow', 'Curving Shot (redirect miss)', 'Ever-Ready Shot (regain 1 on initiative)'],
  },
  {
    subclass: 'Purple Dragon Knight',
    source: "Sword Coast Adventurer's Guide",
    tier: 'C',
    reason: 'Rallying Cry: Second Wind heals allies too. Inspiring Surge: ally attacks when you Action Surge. Weak overall.',
    keyFeatures: ['Rallying Cry', 'Royal Envoy', 'Inspiring Surge', 'Bulwark'],
  },
];

export function fighterAttacksPerRound(level, hasHaste, actionSurge) {
  let attacks = level >= 20 ? 4 : level >= 11 ? 3 : level >= 5 ? 2 : 1;
  if (hasHaste) attacks += 1;
  const surge = actionSurge ? attacks : 0;
  return { normal: attacks, withSurge: attacks + surge, note: `L${level}: ${attacks} attacks${hasHaste ? ' (hasted)' : ''}${actionSurge ? ` + ${surge} (Action Surge) = ${attacks + surge}` : ''}` };
}
