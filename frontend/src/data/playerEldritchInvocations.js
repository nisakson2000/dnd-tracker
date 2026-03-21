/**
 * playerEldritchInvocations.js
 * Player Mode: Warlock Eldritch Invocation reference
 * Pure JS — no React dependencies.
 */

export const ELDRITCH_INVOCATIONS = [
  { name: 'Agonizing Blast', prerequisite: 'Eldritch Blast cantrip', effect: 'Add CHA modifier to Eldritch Blast damage.' },
  { name: 'Armor of Shadows', prerequisite: null, effect: 'Cast Mage Armor on yourself at will.' },
  { name: 'Ascendant Step', prerequisite: 'Level 9', effect: 'Cast Levitate on yourself at will.' },
  { name: 'Beast Speech', prerequisite: null, effect: 'Cast Speak with Animals at will.' },
  { name: 'Beguiling Influence', prerequisite: null, effect: 'Proficiency in Deception and Persuasion.' },
  { name: 'Book of Ancient Secrets', prerequisite: 'Pact of the Tome', effect: 'Ritual casting from your Book of Shadows. Can add ritual spells from any class.' },
  { name: 'Devil\'s Sight', prerequisite: null, effect: 'See normally in darkness (magical and nonmagical) to 120ft.' },
  { name: 'Eldritch Mind', prerequisite: null, effect: 'Advantage on Constitution saving throws to maintain concentration.' },
  { name: 'Eldritch Sight', prerequisite: null, effect: 'Cast Detect Magic at will.' },
  { name: 'Eldritch Smite', prerequisite: 'Pact of the Blade, 5th level', effect: 'On pact weapon hit, expend slot: +1d8 force per slot level + 1d8. Large or smaller = prone.' },
  { name: 'Eyes of the Rune Keeper', prerequisite: null, effect: 'Read all writing.' },
  { name: 'Fiendish Vigor', prerequisite: null, effect: 'Cast False Life on yourself at will (1st level).' },
  { name: 'Ghostly Gaze', prerequisite: 'Level 7', effect: 'See through solid objects to 30ft for 1 minute. 1/short rest.' },
  { name: 'Gift of the Ever-Living Ones', prerequisite: 'Pact of the Chain', effect: 'When familiar is within 100ft, maximize all hit dice healing on yourself.' },
  { name: 'Grasp of Hadar', prerequisite: 'Eldritch Blast', effect: 'Once per turn: Eldritch Blast hit pulls target 10ft closer.' },
  { name: 'Improved Pact Weapon', prerequisite: 'Pact of the Blade', effect: 'Pact weapon is +1, can be ranged, can be used as focus.' },
  { name: 'Lance of Lethargy', prerequisite: 'Eldritch Blast', effect: 'Once per turn: Eldritch Blast reduces target speed by 10ft.' },
  { name: 'Lifedrinker', prerequisite: 'Pact of the Blade, 12th level', effect: 'Pact weapon deals extra necrotic = CHA mod.' },
  { name: 'Mask of Many Faces', prerequisite: null, effect: 'Cast Disguise Self at will.' },
  { name: 'Master of Myriad Forms', prerequisite: 'Level 15', effect: 'Cast Alter Self at will.' },
  { name: 'Misty Visions', prerequisite: null, effect: 'Cast Silent Image at will.' },
  { name: 'One with Shadows', prerequisite: 'Level 5', effect: 'In dim light/darkness: action to become invisible until you move/act.' },
  { name: 'Otherworldly Leap', prerequisite: 'Level 9', effect: 'Cast Jump on yourself at will.' },
  { name: 'Relentless Hex', prerequisite: 'Level 7, Hex or curse', effect: 'Teleport up to 30ft to a space adjacent to your cursed target.' },
  { name: 'Repelling Blast', prerequisite: 'Eldritch Blast', effect: 'Each Eldritch Blast hit pushes target 10ft away.' },
  { name: 'Sculptor of Flesh', prerequisite: 'Level 7', effect: 'Cast Polymorph using a warlock slot. 1/long rest.' },
  { name: 'Thirsting Blade', prerequisite: 'Pact of the Blade, 5th level', effect: 'Attack twice with pact weapon (Extra Attack).' },
  { name: 'Tomb of Levistus', prerequisite: 'Level 5', effect: 'Reaction when taking damage: gain 10x warlock level temp HP, but incapacitated + speed 0 until end of next turn.' },
  { name: 'Witch Sight', prerequisite: 'Level 15', effect: 'See true form of shapechangers/illusions within 30ft.' },
];

export function getAvailableInvocations(warlockLevel, pact = null, hasEldritchBlast = false) {
  return ELDRITCH_INVOCATIONS.filter(inv => {
    const prereq = (inv.prerequisite || '').toLowerCase();
    if (prereq.includes('level')) {
      const match = prereq.match(/level (\d+)/);
      if (match && warlockLevel < parseInt(match[1])) return false;
    }
    if (prereq.includes('pact of the blade') && pact !== 'blade') return false;
    if (prereq.includes('pact of the tome') && pact !== 'tome') return false;
    if (prereq.includes('pact of the chain') && pact !== 'chain') return false;
    if (prereq.includes('eldritch blast') && !hasEldritchBlast) return false;
    return true;
  });
}

export function getInvocation(name) {
  return ELDRITCH_INVOCATIONS.find(i => i.name.toLowerCase() === (name || '').toLowerCase()) || null;
}

export function getInvocationCount(warlockLevel) {
  if (warlockLevel >= 17) return 8;
  if (warlockLevel >= 15) return 7;
  if (warlockLevel >= 12) return 6;
  if (warlockLevel >= 9) return 5;
  if (warlockLevel >= 7) return 4;
  if (warlockLevel >= 5) return 3;
  if (warlockLevel >= 2) return 2;
  return 0;
}
