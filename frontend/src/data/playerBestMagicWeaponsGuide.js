/**
 * playerBestMagicWeaponsGuide.js
 * Player Mode: Best magic weapons by rarity and type
 * Pure JS — no React dependencies.
 */

export const UNCOMMON_WEAPONS = [
  { weapon: '+1 Weapon', type: 'Any', effect: '+1 to attack and damage rolls. Counts as magical.', rating: 'A+', note: 'Simple but always useful. Overcomes nonmagical resistance.' },
  { weapon: 'Moon-Touched Sword', type: 'Any sword', effect: 'Glows in darkness (15ft bright, 15ft dim). Counts as magical.', rating: 'B+', note: 'Common rarity but counts as magical. Free light source.' },
  { weapon: 'Weapon of Warning', type: 'Any', effect: 'Advantage on initiative. Can\'t be surprised while carrying it.', rating: 'S', note: 'Going first is huge. Surprise immunity is a lifesaver.' },
  { weapon: 'Javelin of Lightning', type: 'Javelin', effect: '4d6 lightning line (150ft). DEX save. Once/day.', rating: 'A', note: 'Free Lightning Bolt once per day. Solid ranged option.' },
  { weapon: 'Vicious Weapon', type: 'Any', effect: 'On nat 20: deal extra 7 damage.', rating: 'B+', note: '+7 on crits. Better for crit-fishing builds.' },
];

export const RARE_WEAPONS = [
  { weapon: '+2 Weapon', type: 'Any', effect: '+2 to attack and damage. Magical.', rating: 'S', note: 'Straight upgrade. +2 accuracy is significant.' },
  { weapon: 'Flame Tongue', type: 'Any sword', effect: 'BA: ignite for +2d6 fire damage per hit. Bright light.', rating: 'S+', note: '+2d6 per hit. Extra Attack = +4d6/round. Incredible.' },
  { weapon: 'Sun Blade', type: 'Longsword', effect: '+2 to hit/damage. Radiant damage. Finesse. +1d8 vs undead.', rating: 'S+', note: 'Radiant damage. Finesse longsword. Extra vs undead. Best rare weapon.' },
  { weapon: 'Dragon Slayer', type: 'Any sword', effect: '+1 weapon. +3d6 to dragons.', rating: 'A (campaign)', note: 'Amazing in dragon campaigns. Niche otherwise.' },
  { weapon: 'Giant Slayer', type: 'Any axe/sword', effect: '+1 weapon. +2d6 to giants. Knock prone.', rating: 'A (campaign)', note: 'Great against giants. Prone is valuable.' },
  { weapon: 'Mace of Disruption', type: 'Mace', effect: 'Extra 2d6 radiant vs fiends/undead. Fear + destroy if under 25 HP.', rating: 'A+', note: 'Anti-undead/fiend weapon. Instant kill under 25 HP.' },
  { weapon: 'Sword of Wounding', type: 'Any sword', effect: 'Wounds don\'t heal naturally. Must make CON save to stop bleeding.', rating: 'A', note: 'Counters regeneration. Stack wounds for damage over time.' },
];

export const VERY_RARE_WEAPONS = [
  { weapon: '+3 Weapon', type: 'Any', effect: '+3 to attack and damage. Magical.', rating: 'S', note: 'Highest standard bonus. Very accurate.' },
  { weapon: 'Frost Brand', type: 'Any sword', effect: '+1d6 cold per hit. Fire resistance. Extinguish fire.', rating: 'A+', note: 'Extra cold damage + fire resistance. Good package.' },
  { weapon: 'Dancing Sword', type: 'Any sword', effect: 'BA: throw, fights on its own for 4 rounds. Uses your attack bonus.', rating: 'A+', note: 'Free attacks without using your action. Action economy boost.' },
  { weapon: 'Scimitar of Speed', type: 'Scimitar', effect: '+2 to hit/damage. BA: make one attack with it.', rating: 'S', note: 'Free BA attack. Stacks with everything. Amazing.' },
  { weapon: 'Oathbow', type: 'Longbow', effect: 'Sworn enemy: 3d6 extra damage. Advantage on attacks vs sworn enemy.', rating: 'A+', note: 'Designate one enemy. +3d6 and advantage. One at a time.' },
  { weapon: 'Nine Lives Stealer', type: 'Any sword', effect: '+2 weapon. On nat 20 vs <100 HP: instant kill (9 charges).', rating: 'S', note: 'Instant kill on crit. 9 uses. Devastating.' },
];

export const LEGENDARY_WEAPONS = [
  { weapon: 'Vorpal Sword', type: 'Any slashing sword', effect: '+3. On nat 20: decapitate (instant kill most creatures).', rating: 'S+', note: 'Instant kill on crit. Bypasses legendary resistance. Ignores HP.' },
  { weapon: 'Holy Avenger', type: 'Any sword', effect: '+3. +2d10 radiant vs fiends/undead. 10ft magic resistance aura.', rating: 'S+ (Paladin)', note: 'Paladin only. Best martial weapon. Party-wide magic resistance.' },
  { weapon: 'Luck Blade', type: 'Any sword', effect: '+1. +1 to saves. 1d4-1 Wish charges.', rating: 'S+', note: 'WISH ON A SWORD. Each charge = one Wish. Incredible.' },
  { weapon: 'Defender', type: 'Any sword', effect: '+3. Transfer +1-3 from attack/damage to AC each turn.', rating: 'A+', note: 'Flexible defense. Tank or damage as needed.' },
  { weapon: 'Blackrazor', type: 'Greatsword', effect: 'Sentient. Devour souls. Temp HP on kill. Haste.', rating: 'S', note: 'Artifact. Sentient weapon with personality. Very powerful.' },
];

export const MAGIC_WEAPON_TIPS = [
  'Flame Tongue: +2d6 per hit. Best damage increase until +3 weapons.',
  'Sun Blade: radiant damage + finesse. Best rare weapon overall.',
  'Weapon of Warning: advantage on initiative + surprise immunity. Underrated.',
  'Holy Avenger: Paladin exclusive. Best martial weapon in the game.',
  'Vorpal Sword: instant kill on nat 20. Ignores HP. Legendary.',
  '+1 weapon: don\'t underestimate it. Magical damage overcomes resistance.',
  'Dancing Sword: fights on its own. Free extra attacks.',
  'Scimitar of Speed: free BA attack. Amazing action economy.',
  'Nine Lives Stealer: instant kill on crits. 9 charges.',
  'Ask your DM about attunement. Some weapons require it.',
];
