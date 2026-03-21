/**
 * playerMagicItemPriorityGuide.js
 * Player Mode: Which magic items to prioritize by class and role
 * Pure JS — no React dependencies.
 */

export const UNIVERSAL_PRIORITY_ITEMS = [
  { item: 'Cloak of Protection', rarity: 'Uncommon', attune: 'Yes', effect: '+1 AC and saves', rating: 'S', note: 'Everyone benefits. +1 to ALL saves is quietly incredible.' },
  { item: 'Ring of Protection', rarity: 'Rare', attune: 'Yes', effect: '+1 AC and saves', rating: 'S', note: 'Same as Cloak. They stack.' },
  { item: '+1/+2/+3 Weapon', rarity: 'Uncommon-Very Rare', attune: 'No', effect: '+1/2/3 to hit and damage', rating: 'S+', note: 'Fundamental. Bypasses nonmagical resistance.' },
  { item: '+1/+2/+3 Armor', rarity: 'Rare-Legendary', attune: 'No', effect: '+1/2/3 AC', rating: 'S+', note: 'AC is always valuable.' },
  { item: 'Amulet of Health', rarity: 'Rare', attune: 'Yes', effect: 'CON becomes 19', rating: 'S', note: 'If your CON is below 18. +4 or +5 CON = massive HP + save boost.' },
  { item: 'Headband of Intellect', rarity: 'Uncommon', attune: 'Yes', effect: 'INT becomes 19', rating: 'S (if you dumped INT)', note: 'Turn any class into INT 19. Niche but powerful.' },
  { item: 'Winged Boots', rarity: 'Uncommon', attune: 'Yes', effect: 'Fly speed = walk speed (4 hours/day)', rating: 'S', note: 'Flight without concentration. Game-changing.' },
  { item: 'Bag of Holding', rarity: 'Uncommon', attune: 'No', effect: '500 lbs storage in a bag', rating: 'A+', note: 'Essential utility. Carry everything. No encumbrance.' },
];

export const ITEMS_BY_CLASS = [
  { class: 'Fighter', items: ['+X Weapon', 'Belt of Giant Strength', 'Gauntlets of Ogre Power', 'Adamantine Armor', 'Flame Tongue'], note: 'Weapon and STR items. Fighters attack the most = +X weapons matter most.' },
  { class: 'Rogue', items: ['+X Weapon (rapier/shortsword)', 'Cloak of Elvenkind', 'Boots of Elvenkind', 'Gloves of Thievery', 'Ring of Invisibility'], note: 'Stealth and accuracy items. Rogues need to hit for SA.' },
  { class: 'Barbarian', items: ['Belt of Giant Strength', '+X Weapon (greataxe)', 'Amulet of Health', 'Boots of Speed', 'Cloak of Protection'], note: 'STR items. No magic armor (conflicts with Unarmored). Rage + magic weapon.' },
  { class: 'Paladin', items: ['+X Weapon', 'Holy Avenger', 'Belt of Giant Strength', '+X Shield', 'Amulet of Health'], note: 'Weapon for Smite damage. Holy Avenger is THE Paladin item.' },
  { class: 'Ranger', items: ['+X Weapon (longbow)', 'Bracers of Archery', 'Cloak of Elvenkind', 'Boots of Elvenkind', 'Quiver of Ehlonna'], note: 'Ranged weapon bonuses. Stealth gear. Bracers = +2 longbow damage.' },
  { class: 'Monk', items: ['Bracers of Defense', 'Insignia of Claws', 'Cloak of Protection', 'Amulet of Health', 'Winged Boots'], note: 'No armor = Bracers of Defense. Insignia makes unarmed strikes magical.' },
  { class: 'Wizard', items: ['Staff of the Magi', 'Robe of the Archmagi', 'Pearl of Power', 'Wand of the War Mage', 'Headband of Intellect'], note: 'Best magic items in the game go to Wizards. Staff of the Magi is #1.' },
  { class: 'Sorcerer', items: ['Wand of the War Mage', 'Bloodwell Vial', 'Robe of the Archmagi', 'Pearl of Power', 'Cloak of Protection'], note: 'Bloodwell Vial: +1 DC/attacks + recover sorcery points on SR.' },
  { class: 'Warlock', items: ['Rod of the Pact Keeper', 'Wand of the War Mage', 'Cloak of Protection', 'Amulet of Proof Against Detection'], note: 'Rod of Pact Keeper: +1/2/3 DC + recover 1 slot per LR.' },
  { class: 'Cleric', items: ['+X Shield', 'Amulet of the Devout', 'Pearl of Power', '+X Armor', 'Ring of Spell Storing'], note: 'Amulet of the Devout: +1/2/3 spell attack + DC + Channel Divinity recharge.' },
  { class: 'Druid', items: ['Staff of the Woodlands', 'Moon Sickle', 'Ring of Spell Storing', 'Cloak of Protection', 'Winged Boots'], note: 'Moon Sickle: +1/2/3 attacks + extra healing die. Great for Moon Druids.' },
  { class: 'Bard', items: ['Instrument of the Bards', 'Cloak of Protection', 'Ring of Spell Storing', 'Hat of Disguise', 'Pearl of Power'], note: 'Instrument: free spells + charm advantage. Thematic and powerful.' },
  { class: 'Artificer', items: ['All Infusions (built-in)', 'Spell-Refueling Ring', 'Winged Boots', 'Cloak of Protection'], note: 'Artificer creates their own magic items. Infusions are the priority.' },
];

export const MAGIC_ITEM_TIPS = [
  '+1 weapon is the single most impactful uncommon item for martial classes.',
  'Cloak of Protection: +1 to ALL saves. Quietly one of the best items.',
  'Pearl of Power: extra L3 slot per day. Every caster wants one.',
  'Winged Boots: flight without concentration. Better than Fly spell in some ways.',
  'Belt of Giant Strength: STR 21-29. Best martial item for non-DEX builds.',
  'Staff of the Magi is the best item in the game. Give it to the Wizard.',
  'Attunement limit is 3. Choose your 3 slots very carefully.',
  'Some items don\'t need attunement (Bag of Holding, +1 weapon/armor). Free value.',
  'Ring of Spell Storing: pre-load 5 levels of spells. Emergency spells for non-casters.',
  'Adamantine Armor: crits become normal hits. Excellent against crit-fishing enemies.',
];
