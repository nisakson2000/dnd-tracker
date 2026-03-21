/**
 * playerDevilContracts.js
 * Player Mode: Dealing with devils — contracts, negotiation, and infernal politics
 * Pure JS — no React dependencies.
 */

export const DEVIL_HIERARCHY = [
  { rank: 'Lemure', cr: 0, role: 'Mindless fodder. Reformed from damned souls.' },
  { rank: 'Imp', cr: 1, role: 'Spies, familiars. Invisible + shapechange.' },
  { rank: 'Bearded Devil', cr: 3, role: 'Shock troops. Glaive attacks with infernal wound (bleed).' },
  { rank: 'Barbed Devil', cr: 5, role: 'Guards. Barbs deal damage to grapplers. Hurl Flame.' },
  { rank: 'Chain Devil', cr: 8, role: 'Torturers. Animate chains. Unnerving Mask (frightened).' },
  { rank: 'Bone Devil', cr: 9, role: 'Taskmasters. Sting (poison + poisoned). Flying.' },
  { rank: 'Horned Devil', cr: 11, role: 'Elite soldiers. Tail stinger + infernal wound. Flying.' },
  { rank: 'Ice Devil', cr: 14, role: 'Generals. Wall of Ice. Intense cold aura.' },
  { rank: 'Pit Fiend', cr: 20, role: 'Supreme commanders. Fear Aura. Fireball at will. Poison. Flying.' },
  { rank: 'Archdevil', cr: '26+', role: 'Lords of the Nine Hells. Asmodeus, Zariel, Dispater, etc.' },
];

export const CONTRACT_RULES = {
  binding: 'Infernal contracts are magically binding. Breaking one has severe consequences (soul forfeiture, curses, etc.).',
  loopholes: [
    'Devils honor the LETTER of the contract, not the spirit.',
    'Every word matters. "Eternal" means eternal. "Reasonable" is undefined.',
    'Devils are master lawyers. They\'ve been writing contracts for millennia.',
    'Always have a termination clause. Without one, the contract is permanent.',
  ],
  negotiation: [
    'Devils WANT your soul. Everything they offer is designed to get it eventually.',
    'They will offer power, wealth, information. The price is always worse than it seems.',
    'Time limits protect you. "For one year" is better than "until the task is done."',
    'Specify "without harm to me, my allies, or my soul" in every clause.',
    'Zone of Truth doesn\'t help — devils can choose to fail the save but use truthful but misleading language.',
  ],
};

export const BREAKING_CONTRACTS = {
  methods: [
    { method: 'Find a loophole', difficulty: 'Hard', detail: 'Investigation/Arcana checks. Read every word. Look for ambiguity the devil missed.' },
    { method: 'Kill the devil', difficulty: 'Very Hard', detail: 'Devils killed on the Material Plane reform in the Nine Hells. Must kill in their home plane.' },
    { method: 'Wish spell', difficulty: 'Hard', detail: 'Wish can break contracts. May trigger Wish stress. DM adjudicates.' },
    { method: 'Divine Intervention', difficulty: 'DM discretion', detail: 'A god might break the contract. They might also demand something in return.' },
    { method: 'Trade a better soul', difficulty: 'Risky', detail: 'Offer the devil a more valuable soul. They may accept. Extremely evil.' },
    { method: 'Destroy the contract', difficulty: 'Nearly impossible', detail: 'Physical contracts are often stored in the Nine Hells, heavily guarded.' },
  ],
};

export const USEFUL_DEVIL_DEALS = {
  note: 'Sometimes dealing with devils is necessary. Here\'s how to minimize risk.',
  saferDeals: [
    'Information in exchange for a specific, limited service. Not your soul.',
    'Temporary power with a clear end date. "For 30 days" not "until I don\'t need it."',
    'Exchange of services, not souls. "I will defeat your rival. You will give me this item."',
    'Include an explicit "this contract becomes void if..." termination clause.',
  ],
  neverAgree: [
    'Open-ended soul clauses ("when you die, your soul is mine").',
    'Undefined terms ("reasonable effort," "sufficient payment").',
    'Contracts that reference other contracts ("as per standard infernal code").',
    'Verbal agreements. Always insist on written terms.',
  ],
};

export function contractRiskLevel(hasSoulClause, hasTermination, hasDefinedTerms) {
  if (hasSoulClause) return 'Extreme — never sign';
  if (!hasTermination) return 'High — no way out';
  if (!hasDefinedTerms) return 'High — ambiguity will be exploited';
  return 'Moderate — proceed with extreme caution';
}
