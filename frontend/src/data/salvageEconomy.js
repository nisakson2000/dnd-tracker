/**
 * Salvage Economy — Monster harvesting, banking, downtime income, and economic services.
 * Covers roadmap items 440 (Downtime wealth), 444 (Auction house), 445 (Banking),
 * 446 (Insurance), 447 (Salvage economy).
 */

/* ------------------------------------------------------------------ */
/*  SALVAGE MATERIALS — harvestable from defeated monsters             */
/* ------------------------------------------------------------------ */

export const SALVAGE_MATERIALS = {
  Dragon: [
    { name: 'Dragon Scales',   value: 250, harvestDC: 15, skillUsed: 'Nature',   weight: 10, craftingUse: 'Armor crafting — scale mail, splint, or plate with elemental resistance' },
    { name: 'Dragon Blood',    value: 150, harvestDC: 13, skillUsed: 'Arcana',   weight: 2,  craftingUse: 'Potion ingredient — resistance potions, ink for spell scrolls' },
    { name: 'Dragon Teeth',    value: 100, harvestDC: 12, skillUsed: 'Nature',   weight: 3,  craftingUse: 'Weapon component — arrowheads, dagger blades, or amulet foci' },
    { name: 'Dragon Claws',    value: 120, harvestDC: 12, skillUsed: 'Nature',   weight: 4,  craftingUse: 'Weapon component — short sword blades, gauntlet tips' },
    { name: 'Dragon Hide',     value: 200, harvestDC: 14, skillUsed: 'Survival', weight: 15, craftingUse: 'Shield crafting — elemental-resistant shield or cloak' },
  ],
  Troll: [
    { name: 'Troll Blood',     value: 80,  harvestDC: 13, skillUsed: 'Arcana',   weight: 2,  craftingUse: 'Regeneration potion — grants minor healing over time' },
    { name: 'Troll Hide',      value: 60,  harvestDC: 11, skillUsed: 'Survival', weight: 12, craftingUse: 'Acid-resistant leather — armor or protective garments' },
  ],
  Giant: [
    { name: 'Giant Bones',     value: 40,  harvestDC: 10, skillUsed: 'Nature',   weight: 30, craftingUse: 'Construction material — fortification struts, siege weapon arms' },
    { name: 'Giant Hair',      value: 15,  harvestDC: 8,  skillUsed: 'Survival', weight: 5,  craftingUse: 'Rope — incredibly strong cord or bowstring' },
    { name: 'Giant Hide',      value: 50,  harvestDC: 11, skillUsed: 'Survival', weight: 25, craftingUse: 'Leather — heavy-duty cloaks, bags, or tent material' },
  ],
  Elemental: [
    { name: 'Elemental Core',    value: 200, harvestDC: 16, skillUsed: 'Arcana', weight: 3,  craftingUse: 'Spell component — focus for elemental spells, wand/staff core' },
    { name: 'Elemental Essence', value: 120, harvestDC: 14, skillUsed: 'Arcana', weight: 1,  craftingUse: 'Enchanting — infuse weapons or armor with elemental damage/resistance' },
  ],
  Undead: [
    { name: 'Ectoplasm',        value: 30,  harvestDC: 12, skillUsed: 'Arcana',   weight: 1,  craftingUse: 'Necrotic resistance potion — temporary ward against necrotic damage' },
    { name: 'Undead Bones',     value: 10,  harvestDC: 8,  skillUsed: 'Nature',   weight: 5,  craftingUse: 'Bone meal fertilizer — accelerates plant growth, alchemical base' },
  ],
  Beast: [
    { name: 'Beast Hide',       value: 15,  harvestDC: 10, skillUsed: 'Survival', weight: 8,  craftingUse: 'Leather — standard armor, bags, book covers' },
    { name: 'Beast Meat',       value: 5,   harvestDC: 8,  skillUsed: 'Survival', weight: 10, craftingUse: 'Rations — 1d4 days of trail rations per harvest' },
    { name: 'Horn / Tusk',      value: 25,  harvestDC: 11, skillUsed: 'Nature',   weight: 4,  craftingUse: 'Decoration or weapon — ornamental grip, dagger, or trophy' },
  ],
  Aberration: [
    { name: 'Aberrant Ichor',   value: 90,  harvestDC: 14, skillUsed: 'Arcana',   weight: 1,  craftingUse: 'Poison — potent contact or injury poison (2d6 damage, DC 13 Con)' },
    { name: 'Chitin Plates',    value: 70,  harvestDC: 13, skillUsed: 'Nature',   weight: 10, craftingUse: 'Armor crafting — lightweight, alien-looking medium armor' },
    { name: 'Aberrant Brain',   value: 150, harvestDC: 17, skillUsed: 'Arcana',   weight: 3,  craftingUse: 'Psionics component — amplifier for psionic items or telepathy spells' },
  ],
  Fiend: [
    { name: 'Fiend Horn',       value: 100, harvestDC: 14, skillUsed: 'Arcana',   weight: 4,  craftingUse: 'Unholy weapon — dagger or staff with necrotic/fire bonus' },
    { name: 'Fiend Blood',      value: 120, harvestDC: 15, skillUsed: 'Arcana',   weight: 2,  craftingUse: 'Binding ritual — ink for summoning circles and contracts' },
    { name: 'Fiend Hide',       value: 80,  harvestDC: 13, skillUsed: 'Survival', weight: 12, craftingUse: 'Fire-resistant leather — armor or gloves with fire resistance' },
  ],
};

/* ------------------------------------------------------------------ */
/*  BANKING SERVICES — available in civilized settlements               */
/* ------------------------------------------------------------------ */

export const BANKING_SERVICES = [
  {
    service: 'Deposit',
    description: 'Secure vault storage for coins, gems, or small valuables.',
    fee: '0.5% of stored value per month',
    feeRate: 0.005,
    duration: null,
    notes: 'Receipt provided; balance tracked per branch.',
  },
  {
    service: 'Withdrawal',
    description: 'Retrieve deposited funds from the bank.',
    fee: 'None',
    feeRate: 0,
    duration: 'Immediate in same city; 1d4 days if transferring between cities',
    notes: 'Must present receipt or prove identity via passphrase.',
  },
  {
    service: 'Loan',
    description: 'Borrow gold from the bank with interest.',
    fee: '10% interest per month on outstanding balance',
    feeRate: 0.10,
    duration: 'Repayment expected within 6 months',
    notes: 'Maximum 500 gp. Collateral required (item or property worth at least loan value). Failure to repay may result in bounty hunters.',
    maxAmount: 500,
  },
  {
    service: 'Wire Transfer',
    description: 'Send gold to another branch in a different city.',
    fee: '2% of transferred amount',
    feeRate: 0.02,
    duration: '1d6 days between cities',
    notes: 'Recipient must present matching passphrase to collect funds.',
  },
  {
    service: 'Interest',
    description: 'Earn passive interest on deposited gold.',
    fee: 'N/A — bank pays 0.1% monthly on balances over 100 gp',
    feeRate: -0.001,
    duration: 'Credited monthly',
    notes: 'Only applies to deposits exceeding 100 gp. Compounds monthly.',
    minimumBalance: 100,
  },
  {
    service: 'Insurance',
    description: 'Insure a valuable item against loss, theft, or destruction.',
    fee: '5% of insured item value (one-time premium)',
    feeRate: 0.05,
    duration: '1 year coverage per premium payment',
    notes: 'Payout equals appraised value at time of purchase. Fraud voids coverage. Does not cover acts of war or divine intervention.',
  },
];

/* ------------------------------------------------------------------ */
/*  DOWNTIME ACTIVITIES — income and progress during downtime           */
/* ------------------------------------------------------------------ */

export const DOWNTIME_ACTIVITIES = [
  {
    activity: 'Crafting',
    incomePerDay: 5,
    incomeDescription: '5 gp/day toward item value',
    requirements: 'Proficiency with relevant tools; raw materials worth half the item sale price',
    risk: null,
    details: 'Each day of crafting subtracts 5 gp from the remaining cost. Multiple characters can collaborate to speed production.',
  },
  {
    activity: 'Working',
    incomePerDay: 1,
    incomeDescription: '1 gp/day; modest lifestyle covered',
    requirements: 'None',
    risk: null,
    details: 'Honest labor — laboring, clerking, serving. Modest lifestyle expenses are covered by the work.',
  },
  {
    activity: 'Performing',
    incomePerDay: null,
    incomeDescription: '1–3 gp/day based on Performance check',
    requirements: 'Proficiency with a musical instrument or Performance skill',
    risk: null,
    details: 'DC 10 = 1 gp, DC 15 = 2 gp, DC 20+ = 3 gp per day. Lifestyle covered at corresponding level.',
    checkDC: [
      { dc: 10, income: 1, lifestyle: 'Modest' },
      { dc: 15, income: 2, lifestyle: 'Comfortable' },
      { dc: 20, income: 3, lifestyle: 'Wealthy' },
    ],
  },
  {
    activity: 'Crime',
    incomePerDay: null,
    incomeDescription: 'Variable — higher take means higher risk',
    requirements: "Proficiency with thieves' tools or Stealth",
    risk: 'Arrest on failed check; DC scales with take',
    details: 'Choose a target take. DM sets DC (10 for petty theft, 15 for moderate heist, 20 for major score). Failure means arrest, fines, or jail time.',
    riskTable: [
      { take: '5 gp',   dc: 10, penalty: 'Fine of 10 gp or 1d4 days in jail' },
      { take: '25 gp',  dc: 15, penalty: 'Fine of 50 gp or 2d4 days in jail' },
      { take: '100 gp', dc: 20, penalty: 'Fine of 200 gp, 1d4 weeks in jail, possible bounty' },
    ],
  },
  {
    activity: 'Gambling',
    incomePerDay: null,
    incomeDescription: 'Variable — 3 ability checks determine outcome',
    requirements: 'Stake of 10–1000 gp',
    risk: 'Can lose entire stake',
    details: 'Make 3 checks (Insight, Deception, Intimidation — DC 15). 0 successes = lose full stake. 1 success = lose half. 2 successes = win 1.5x stake. 3 successes = win 2x stake.',
    outcomeTable: [
      { successes: 0, result: 'Lose entire stake' },
      { successes: 1, result: 'Lose half of stake' },
      { successes: 2, result: 'Win 1.5x stake' },
      { successes: 3, result: 'Win 2x stake' },
    ],
  },
  {
    activity: 'Research',
    incomePerDay: 0,
    incomeDescription: 'No income — gain information instead',
    requirements: 'Access to a library, sage, or archive; 1 gp/day in expenses',
    risk: null,
    details: 'Each day (or week, DM discretion) spent researching reveals one piece of lore about a topic. Intelligence (Investigation or Arcana) check may speed results.',
  },
  {
    activity: 'Training',
    incomePerDay: 0,
    incomeDescription: 'No income — costs 1 gp/day for instruction',
    requirements: 'Instructor; 250 days and 250 gp total',
    risk: null,
    details: 'Learn a new language, tool proficiency, or skill (DM discretion). 250 days of training at 1 gp/day. Days need not be consecutive.',
    totalDays: 250,
    costPerDay: 1,
  },
  {
    activity: 'Running a Business',
    incomePerDay: null,
    incomeDescription: 'Variable — roll 1d100 + number of days spent to determine profit or loss',
    requirements: 'Ownership or partnership in a business',
    risk: 'Can incur losses',
    details: 'Roll 1d100 and add the number of days spent managing. Result determines outcome for the period.',
    outcomeTable: [
      { roll: '1–20',   result: 'Pay 1.5x maintenance cost; business struggles' },
      { roll: '21–30',  result: 'Pay full maintenance cost; break even' },
      { roll: '31–40',  result: 'Pay half maintenance cost' },
      { roll: '41–60',  result: 'Business covers its own costs' },
      { roll: '61–80',  result: 'Business covers costs + earns 1d6 x 5 gp profit' },
      { roll: '81–90',  result: 'Business covers costs + earns 2d8 x 5 gp profit' },
      { roll: '91+',    result: 'Business covers costs + earns 3d10 x 5 gp profit' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  HELPER FUNCTIONS                                                    */
/* ------------------------------------------------------------------ */

/**
 * Get all salvageable materials for a given creature type.
 * @param {string} type — creature type (e.g. "Dragon", "Troll", "Beast")
 * @returns {Array} array of material objects, or empty array if type unknown
 */
export function getSalvageForCreature(type) {
  if (!type) return [];
  // Normalise: capitalise first letter, lowercase rest
  const key = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return SALVAGE_MATERIALS[key] || [];
}

/**
 * Calculate compound interest earned on a bank deposit.
 * Rate: 0.1% per month, only on balances over 100 gp.
 * @param {number} gold — initial deposit amount
 * @param {number} months — number of months deposited
 * @returns {{ principal: number, interest: number, total: number, monthlyFee: number, netTotal: number }}
 */
export function calculateBankInterest(gold, months) {
  const monthlyRate = 0.001;   // 0.1%
  const storageFeeRate = 0.005; // 0.5%
  const minBalanceForInterest = 100;

  let balance = gold;
  let totalInterest = 0;
  let totalFees = 0;

  for (let m = 0; m < months; m++) {
    // Storage fee applied every month
    const fee = balance * storageFeeRate;
    totalFees += fee;
    balance -= fee;

    // Interest only on balances above minimum
    if (balance > minBalanceForInterest) {
      const interest = balance * monthlyRate;
      totalInterest += interest;
      balance += interest;
    }
  }

  return {
    principal: gold,
    interest: Math.round(totalInterest * 100) / 100,
    total: Math.round(balance * 100) / 100,
    monthlyFee: Math.round((gold * storageFeeRate) * 100) / 100,
    netTotal: Math.round(balance * 100) / 100,
  };
}

/**
 * Estimate expected daily income for a downtime activity.
 * @param {string} activity — activity name (e.g. "Crafting", "Performing")
 * @param {number} [modifier=0] — ability modifier applied to relevant checks
 * @returns {{ activity: string, estimatedDailyGP: number|string, notes: string }}
 */
export function getDowntimeIncome(activity, modifier = 0) {
  const entry = DOWNTIME_ACTIVITIES.find(
    (a) => a.activity.toLowerCase() === activity.toLowerCase()
  );
  if (!entry) {
    return { activity, estimatedDailyGP: 0, notes: 'Unknown activity.' };
  }

  switch (entry.activity) {
    case 'Crafting':
      return { activity: 'Crafting', estimatedDailyGP: 5, notes: 'Fixed rate toward item cost.' };

    case 'Working':
      return { activity: 'Working', estimatedDailyGP: 1, notes: 'Modest lifestyle covered.' };

    case 'Performing': {
      // Estimate based on average d20 roll (10.5) + modifier
      const avgRoll = 10.5 + modifier;
      let income = 0;
      if (avgRoll >= 20) income = 3;
      else if (avgRoll >= 15) income = 2;
      else if (avgRoll >= 10) income = 1;
      return { activity: 'Performing', estimatedDailyGP: income, notes: `Based on avg roll + modifier (${modifier}).` };
    }

    case 'Crime': {
      const avgRoll = 10.5 + modifier;
      let est = 0;
      if (avgRoll >= 20) est = 100;
      else if (avgRoll >= 15) est = 25;
      else if (avgRoll >= 10) est = 5;
      else est = -10; // fines
      return { activity: 'Crime', estimatedDailyGP: est, notes: `Risk-adjusted. Modifier: ${modifier}. Negative = expected fines.` };
    }

    case 'Gambling':
      return { activity: 'Gambling', estimatedDailyGP: 'Variable', notes: '3 checks determine outcome. Stake dependent.' };

    case 'Research':
      return { activity: 'Research', estimatedDailyGP: 0, notes: 'No income — gain lore instead. Costs 1 gp/day.' };

    case 'Training':
      return { activity: 'Training', estimatedDailyGP: -1, notes: 'No income — costs 1 gp/day for 250 days.' };

    case 'Running a Business':
      return { activity: 'Running a Business', estimatedDailyGP: 'Variable', notes: 'Roll 1d100 + days spent. See outcome table.' };

    default:
      return { activity: entry.activity, estimatedDailyGP: entry.incomePerDay || 0, notes: entry.details };
  }
}
