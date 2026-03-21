/**
 * playerKiPointManagement.js
 * Player Mode: Monk Ki point optimization, spending priorities, and subclass ki uses
 * Pure JS — no React dependencies.
 */

export const KI_BASICS = {
  pool: 'Ki points = Monk level. Recover ALL on short or long rest.',
  saveDC: '8 + proficiency + WIS modifier.',
  note: 'Short rest recovery makes Ki very renewable. Don\'t hoard.',
};

export const CORE_KI_ABILITIES = [
  { name: 'Flurry of Blows', cost: 1, action: 'BA', effect: 'Two unarmed strikes as bonus action (instead of one).', rating: 'S', when: 'Every round if you can afford it. Your primary damage boost.' },
  { name: 'Patient Defense', cost: 1, action: 'BA', effect: 'Dodge as bonus action. All attacks against you have disadvantage.', rating: 'A', when: 'When you\'re getting focused or need to survive. Tank mode.' },
  { name: 'Step of the Wind', cost: 1, action: 'BA', effect: 'Dash or Disengage as bonus action. Jump distance doubled.', rating: 'B', when: 'Repositioning or escaping. Jump across chasms.' },
  { name: 'Stunning Strike', cost: 1, action: 'On hit', effect: 'Target makes CON save or is stunned until end of your next turn.', rating: 'S', when: 'On first hit to set up allies. Stunned = auto-fail STR/DEX saves, advantage on attacks, can\'t act.' },
  { name: 'Deflect Missiles', cost: '1 (to throw back)', action: 'Reaction', effect: 'Reduce ranged attack damage. If reduced to 0, spend 1 ki to throw it back.', rating: 'B', when: 'Only spend ki to throw back if the damage is worth it.' },
  { name: 'Slow Fall', cost: 0, action: 'Reaction', effect: 'Reduce falling damage by 5× monk level.', rating: 'A', when: 'Whenever you fall. Free and powerful.' },
];

export const KI_SPENDING_PRIORITY = {
  highPriority: [
    { ability: 'Stunning Strike', reason: 'Stunned is the best condition in the game. One successful stun can end a fight.' },
    { ability: 'Flurry of Blows', reason: 'Your main DPR increase. Two attacks for 1 ki is excellent value.' },
  ],
  mediumPriority: [
    { ability: 'Patient Defense', reason: 'When you\'re in danger. Dodge is very effective at high AC.' },
    { ability: 'Subclass abilities', reason: 'Many subclass features cost ki. Budget for them.' },
  ],
  lowPriority: [
    { ability: 'Step of the Wind', reason: 'Usually you can just use your high base speed. Rarely worth ki.' },
    { ability: 'Deflect Missiles (throw)', reason: 'Cool but 1 ki for 1d10+DEX+level damage is modest.' },
  ],
};

export const STUNNING_STRIKE_MATH = {
  description: 'Stun is amazing but CON saves are the hardest to force failures on.',
  tips: [
    'Target enemies with LOW CON saves. Casters, support creatures, not the dragon.',
    'At low levels, your save DC is modest (13-14). Pick targets wisely.',
    'Don\'t burn all ki on stunning strike against a high-CON enemy. You WILL run out.',
    'Multiple attempts per turn: try stunning on first hit. If it works, Flurry for damage.',
    'At high levels (17+), your DC is 17-19. Now it works reliably on most targets.',
  ],
  whenToStun: 'First attack of your turn. If it lands, your remaining attacks + allies\' attacks all have advantage.',
};

export const SUBCLASS_KI_USES = [
  { subclass: 'Open Hand', ki: 'Free effects on Flurry hits (push, prone, no reactions)', note: 'Best ki efficiency — free riders on Flurry.' },
  { subclass: 'Shadow', ki: 'Cast Darkness, Silence, etc. for 2 ki each', note: 'Shadow Step is FREE (not ki). Teleport in dim/dark.' },
  { subclass: 'Four Elements', ki: '2-6 ki for elemental spells', note: 'VERY expensive. Budget carefully. Most underwhelming subclass for ki.' },
  { subclass: 'Drunken Master', ki: 'Flurry = free Disengage + 10ft speed', note: 'Flurry does more. Best Flurry subclass.' },
  { subclass: 'Kensei', ki: 'Deft Strike: 1 ki for extra martial arts die', note: 'Modest damage. Kensei weapons are the main draw.' },
  { subclass: 'Mercy', ki: 'Hands of Harm/Healing (1 ki each)', note: 'Healing + necrotic damage. Versatile and efficient.' },
  { subclass: 'Astral Self', ki: '1 ki for astral arms (WIS for attacks, reach)', note: 'WIS-based attacks. Saves you from needing DEX.' },
  { subclass: 'Long Death', ki: '1 ki to avoid dropping to 0 HP', note: 'Survive lethal hits. 10 ki at level 10 = 10 extra lives.' },
];

export const KI_BUDGET_PER_FIGHT = [
  { level: 3, ki: 3, budget: '1 Stun attempt + 1 Flurry, or 3 Flurries.' },
  { level: 5, ki: 5, budget: '2 Stun attempts + 1 Flurry + Patient Defense.' },
  { level: 10, ki: 10, budget: '3 Stuns + 3 Flurries + 1 Patient Defense.' },
  { level: 15, ki: 15, budget: '4 Stuns + 4 Flurries + subclass abilities.' },
  { level: 20, ki: 20, budget: 'Abundant ki. Stun freely, Flurry every round.' },
];

export function kiRemaining(monkLevel, spent) {
  return Math.max(0, monkLevel - spent);
}

export function stunDC(profBonus, wisMod) {
  return 8 + profBonus + wisMod;
}

export function stunChance(dc, targetConSave) {
  const needed = dc - targetConSave;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}
