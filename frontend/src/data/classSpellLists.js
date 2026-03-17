// D&D 5e SRD Class Spell Lists
// Common/popular spells per class, cantrips through 5th level
// Used for class-based spell filtering in the spell picker

export const CLASS_SPELL_LISTS = {
  Bard: [
    // Cantrips
    'Blade Ward', 'Dancing Lights', 'Friends', 'Light', 'Mage Hand', 'Mending',
    'Message', 'Minor Illusion', 'Prestidigitation', 'True Strike', 'Vicious Mockery',
    // 1st Level
    'Animal Friendship', 'Bane', 'Charm Person', 'Comprehend Languages', 'Cure Wounds',
    'Detect Magic', 'Disguise Self', 'Dissonant Whispers', 'Faerie Fire', 'Feather Fall',
    'Healing Word', 'Heroism', 'Identify', 'Illusory Script', 'Longstrider',
    'Silent Image', 'Sleep', 'Speak with Animals', 'Tasha\'s Hideous Laughter', 'Thunderwave',
    'Unseen Servant',
    // 2nd Level
    'Animal Messenger', 'Blindness/Deafness', 'Calm Emotions', 'Cloud of Daggers',
    'Crown of Madness', 'Detect Thoughts', 'Enhance Ability', 'Enthrall', 'Heat Metal',
    'Hold Person', 'Invisibility', 'Knock', 'Lesser Restoration', 'Locate Animals or Plants',
    'Locate Object', 'Magic Mouth', 'Phantasmal Force', 'See Invisibility', 'Shatter',
    'Silence', 'Suggestion', 'Zone of Truth',
    // 3rd Level
    'Bestow Curse', 'Clairvoyance', 'Dispel Magic', 'Fear', 'Feign Death',
    'Glyph of Warding', 'Hypnotic Pattern', 'Leomund\'s Tiny Hut', 'Major Image',
    'Nondetection', 'Plant Growth', 'Sending', 'Speak with Dead', 'Speak with Plants',
    'Stinking Cloud', 'Tongues',
    // 4th Level
    'Compulsion', 'Confusion', 'Dimension Door', 'Freedom of Movement',
    'Greater Invisibility', 'Hallucinatory Terrain', 'Locate Creature', 'Polymorph',
    // 5th Level
    'Animate Objects', 'Awaken', 'Dominate Person', 'Dream', 'Geas',
    'Greater Restoration', 'Hold Monster', 'Legend Lore', 'Mass Cure Wounds',
    'Mislead', 'Modify Memory', 'Planar Binding', 'Raise Dead', 'Scrying',
    'Seeming', 'Teleportation Circle',
  ],

  Cleric: [
    // Cantrips
    'Guidance', 'Light', 'Mending', 'Resistance', 'Sacred Flame',
    'Spare the Dying', 'Thaumaturgy', 'Toll the Dead', 'Word of Radiance',
    // 1st Level
    'Bane', 'Bless', 'Command', 'Create or Destroy Water', 'Cure Wounds',
    'Detect Evil and Good', 'Detect Magic', 'Detect Poison and Disease',
    'Guiding Bolt', 'Healing Word', 'Inflict Wounds', 'Protection from Evil and Good',
    'Purify Food and Drink', 'Sanctuary', 'Shield of Faith',
    // 2nd Level
    'Aid', 'Augury', 'Blindness/Deafness', 'Calm Emotions', 'Continual Flame',
    'Enhance Ability', 'Find Traps', 'Gentle Repose', 'Hold Person',
    'Lesser Restoration', 'Locate Object', 'Prayer of Healing',
    'Protection from Poison', 'Silence', 'Spiritual Weapon', 'Warding Bond',
    'Zone of Truth',
    // 3rd Level
    'Animate Dead', 'Beacon of Hope', 'Bestow Curse', 'Clairvoyance',
    'Create Food and Water', 'Daylight', 'Dispel Magic', 'Feign Death',
    'Glyph of Warding', 'Magic Circle', 'Mass Healing Word', 'Meld into Stone',
    'Protection from Energy', 'Remove Curse', 'Revivify', 'Sending',
    'Speak with Dead', 'Spirit Guardians', 'Tongues', 'Water Walk',
    // 4th Level
    'Banishment', 'Control Water', 'Death Ward', 'Divination',
    'Freedom of Movement', 'Guardian of Faith', 'Locate Creature',
    'Stone Shape',
    // 5th Level
    'Commune', 'Contagion', 'Dispel Evil and Good', 'Flame Strike',
    'Geas', 'Greater Restoration', 'Hallow', 'Insect Plague',
    'Legend Lore', 'Mass Cure Wounds', 'Planar Binding', 'Raise Dead',
    'Scrying',
  ],

  Druid: [
    // Cantrips
    'Druidcraft', 'Guidance', 'Mending', 'Poison Spray', 'Produce Flame',
    'Resistance', 'Shillelagh', 'Thorn Whip',
    // 1st Level
    'Animal Friendship', 'Charm Person', 'Create or Destroy Water', 'Cure Wounds',
    'Detect Magic', 'Detect Poison and Disease', 'Entangle', 'Faerie Fire',
    'Fog Cloud', 'Goodberry', 'Healing Word', 'Jump', 'Longstrider',
    'Purify Food and Drink', 'Speak with Animals', 'Thunderwave',
    // 2nd Level
    'Animal Messenger', 'Barkskin', 'Beast Sense', 'Darkvision', 'Enhance Ability',
    'Find Traps', 'Flame Blade', 'Flaming Sphere', 'Gust of Wind', 'Heat Metal',
    'Hold Person', 'Lesser Restoration', 'Locate Animals or Plants', 'Locate Object',
    'Moonbeam', 'Pass without Trace', 'Protection from Poison', 'Spike Growth',
    // 3rd Level
    'Call Lightning', 'Conjure Animals', 'Daylight', 'Dispel Magic', 'Feign Death',
    'Meld into Stone', 'Plant Growth', 'Protection from Energy', 'Sleet Storm',
    'Speak with Plants', 'Water Breathing', 'Water Walk', 'Wind Wall',
    // 4th Level
    'Blight', 'Confusion', 'Conjure Minor Elementals', 'Conjure Woodland Beings',
    'Control Water', 'Dominate Beast', 'Freedom of Movement', 'Giant Insect',
    'Grasping Vine', 'Hallucinatory Terrain', 'Ice Storm', 'Locate Creature',
    'Polymorph', 'Stone Shape', 'Stoneskin', 'Wall of Fire',
    // 5th Level
    'Antilife Shell', 'Awaken', 'Commune with Nature', 'Conjure Elemental',
    'Contagion', 'Geas', 'Greater Restoration', 'Insect Plague',
    'Mass Cure Wounds', 'Planar Binding', 'Reincarnate', 'Scrying',
    'Tree Stride', 'Wall of Stone',
  ],

  Paladin: [
    // 1st Level
    'Bless', 'Command', 'Compelled Duel', 'Cure Wounds', 'Detect Evil and Good',
    'Detect Magic', 'Detect Poison and Disease', 'Divine Favor', 'Heroism',
    'Protection from Evil and Good', 'Purify Food and Drink', 'Searing Smite',
    'Shield of Faith', 'Thunderous Smite', 'Wrathful Smite',
    // 2nd Level
    'Aid', 'Branding Smite', 'Find Steed', 'Lesser Restoration', 'Locate Object',
    'Magic Weapon', 'Protection from Poison', 'Zone of Truth',
    // 3rd Level
    'Aura of Vitality', 'Blinding Smite', 'Create Food and Water', 'Crusader\'s Mantle',
    'Daylight', 'Dispel Magic', 'Elemental Weapon', 'Magic Circle',
    'Remove Curse', 'Revivify',
    // 4th Level
    'Aura of Life', 'Aura of Purity', 'Banishment', 'Death Ward',
    'Find Greater Steed', 'Locate Creature', 'Staggering Smite',
    // 5th Level
    'Banishing Smite', 'Circle of Power', 'Destructive Wave', 'Dispel Evil and Good',
    'Geas', 'Holy Weapon', 'Raise Dead',
  ],

  Ranger: [
    // 1st Level
    'Alarm', 'Animal Friendship', 'Cure Wounds', 'Detect Magic',
    'Detect Poison and Disease', 'Ensnaring Strike', 'Fog Cloud', 'Goodberry',
    'Hail of Thorns', 'Hunter\'s Mark', 'Jump', 'Longstrider',
    'Speak with Animals',
    // 2nd Level
    'Animal Messenger', 'Barkskin', 'Beast Sense', 'Cordon of Arrows',
    'Darkvision', 'Find Traps', 'Lesser Restoration', 'Locate Animals or Plants',
    'Locate Object', 'Pass without Trace', 'Protection from Poison',
    'Silence', 'Spike Growth',
    // 3rd Level
    'Conjure Animals', 'Conjure Barrage', 'Daylight', 'Lightning Arrow',
    'Nondetection', 'Plant Growth', 'Protection from Energy', 'Speak with Plants',
    'Water Breathing', 'Water Walk', 'Wind Wall',
    // 4th Level
    'Conjure Woodland Beings', 'Freedom of Movement', 'Grasping Vine',
    'Locate Creature', 'Stoneskin',
    // 5th Level
    'Commune with Nature', 'Conjure Volley', 'Steel Wind Strike',
    'Swift Quiver', 'Tree Stride',
  ],

  Sorcerer: [
    // Cantrips
    'Acid Splash', 'Blade Ward', 'Chill Touch', 'Dancing Lights', 'Fire Bolt',
    'Friends', 'Light', 'Mage Hand', 'Mending', 'Message', 'Minor Illusion',
    'Poison Spray', 'Prestidigitation', 'Ray of Frost', 'Shocking Grasp',
    'True Strike',
    // 1st Level
    'Burning Hands', 'Charm Person', 'Chromatic Orb', 'Color Spray',
    'Comprehend Languages', 'Detect Magic', 'Disguise Self', 'Expeditious Retreat',
    'False Life', 'Feather Fall', 'Fog Cloud', 'Jump', 'Mage Armor',
    'Magic Missile', 'Ray of Sickness', 'Shield', 'Silent Image', 'Sleep',
    'Thunderwave', 'Witch Bolt',
    // 2nd Level
    'Alter Self', 'Blindness/Deafness', 'Blur', 'Cloud of Daggers', 'Crown of Madness',
    'Darkness', 'Darkvision', 'Detect Thoughts', 'Enhance Ability', 'Enlarge/Reduce',
    'Gust of Wind', 'Hold Person', 'Invisibility', 'Knock', 'Levitate',
    'Mirror Image', 'Misty Step', 'Phantasmal Force', 'Scorching Ray',
    'See Invisibility', 'Shatter', 'Spider Climb', 'Suggestion', 'Web',
    // 3rd Level
    'Blink', 'Clairvoyance', 'Counterspell', 'Daylight', 'Dispel Magic',
    'Fear', 'Fireball', 'Fly', 'Gaseous Form', 'Haste', 'Hypnotic Pattern',
    'Lightning Bolt', 'Major Image', 'Protection from Energy', 'Sleet Storm',
    'Slow', 'Stinking Cloud', 'Tongues', 'Water Breathing', 'Water Walk',
    // 4th Level
    'Banishment', 'Blight', 'Confusion', 'Dimension Door', 'Dominate Beast',
    'Greater Invisibility', 'Ice Storm', 'Polymorph', 'Stoneskin', 'Wall of Fire',
    // 5th Level
    'Animate Objects', 'Cloudkill', 'Cone of Cold', 'Creation', 'Dominate Person',
    'Hold Monster', 'Insect Plague', 'Seeming', 'Telekinesis', 'Teleportation Circle',
    'Wall of Stone',
  ],

  Warlock: [
    // Cantrips
    'Blade Ward', 'Chill Touch', 'Eldritch Blast', 'Friends', 'Mage Hand',
    'Minor Illusion', 'Poison Spray', 'Prestidigitation', 'True Strike',
    // 1st Level
    'Armor of Agathys', 'Arms of Hadar', 'Charm Person', 'Comprehend Languages',
    'Expeditious Retreat', 'Hellish Rebuke', 'Hex', 'Illusory Script',
    'Protection from Evil and Good', 'Unseen Servant', 'Witch Bolt',
    // 2nd Level
    'Cloud of Daggers', 'Crown of Madness', 'Darkness', 'Enthrall',
    'Hold Person', 'Invisibility', 'Mirror Image', 'Misty Step',
    'Ray of Enfeeblement', 'Shatter', 'Spider Climb', 'Suggestion',
    // 3rd Level
    'Counterspell', 'Dispel Magic', 'Fear', 'Fly', 'Gaseous Form',
    'Hunger of Hadar', 'Hypnotic Pattern', 'Magic Circle', 'Major Image',
    'Remove Curse', 'Tongues', 'Vampiric Touch',
    // 4th Level
    'Banishment', 'Blight', 'Dimension Door', 'Hallucinatory Terrain',
    'Shadow of Moil', 'Sickening Radiance',
    // 5th Level
    'Contact Other Plane', 'Danse Macabre', 'Dream', 'Enervation',
    'Far Step', 'Hold Monster', 'Infernal Calling', 'Negative Energy Flood',
    'Scrying', 'Synaptic Static', 'Wall of Light',
  ],

  Wizard: [
    // Cantrips
    'Acid Splash', 'Blade Ward', 'Chill Touch', 'Dancing Lights', 'Fire Bolt',
    'Friends', 'Light', 'Mage Hand', 'Mending', 'Message', 'Minor Illusion',
    'Poison Spray', 'Prestidigitation', 'Ray of Frost', 'Shocking Grasp',
    'True Strike', 'Toll the Dead',
    // 1st Level
    'Alarm', 'Burning Hands', 'Charm Person', 'Chromatic Orb', 'Color Spray',
    'Comprehend Languages', 'Detect Magic', 'Disguise Self', 'Expeditious Retreat',
    'False Life', 'Feather Fall', 'Find Familiar', 'Fog Cloud', 'Grease',
    'Identify', 'Illusory Script', 'Jump', 'Longstrider', 'Mage Armor',
    'Magic Missile', 'Protection from Evil and Good', 'Ray of Sickness', 'Shield',
    'Silent Image', 'Sleep', 'Tasha\'s Hideous Laughter', 'Thunderwave',
    'Unseen Servant', 'Witch Bolt',
    // 2nd Level
    'Alter Self', 'Arcane Lock', 'Blindness/Deafness', 'Blur', 'Cloud of Daggers',
    'Continual Flame', 'Crown of Madness', 'Darkness', 'Darkvision',
    'Detect Thoughts', 'Enlarge/Reduce', 'Flaming Sphere', 'Gentle Repose',
    'Gust of Wind', 'Hold Person', 'Invisibility', 'Knock', 'Levitate',
    'Locate Object', 'Magic Mouth', 'Magic Weapon', 'Melf\'s Acid Arrow',
    'Mirror Image', 'Misty Step', 'Nystul\'s Magic Aura', 'Phantasmal Force',
    'Ray of Enfeeblement', 'Rope Trick', 'Scorching Ray', 'See Invisibility',
    'Shatter', 'Spider Climb', 'Suggestion', 'Web',
    // 3rd Level
    'Animate Dead', 'Bestow Curse', 'Blink', 'Clairvoyance', 'Counterspell',
    'Dispel Magic', 'Fear', 'Feign Death', 'Fireball', 'Fly', 'Gaseous Form',
    'Glyph of Warding', 'Haste', 'Hypnotic Pattern', 'Leomund\'s Tiny Hut',
    'Lightning Bolt', 'Magic Circle', 'Major Image', 'Nondetection',
    'Phantom Steed', 'Protection from Energy', 'Remove Curse', 'Sending',
    'Sleet Storm', 'Slow', 'Stinking Cloud', 'Tongues', 'Vampiric Touch',
    'Water Breathing',
    // 4th Level
    'Arcane Eye', 'Banishment', 'Blight', 'Confusion', 'Conjure Minor Elementals',
    'Control Water', 'Dimension Door', 'Evard\'s Black Tentacles', 'Fabricate',
    'Fire Shield', 'Greater Invisibility', 'Hallucinatory Terrain', 'Ice Storm',
    'Leomund\'s Secret Chest', 'Locate Creature', 'Mordenkainen\'s Faithful Hound',
    'Mordenkainen\'s Private Sanctum', 'Otiluke\'s Resilient Sphere', 'Phantasmal Killer',
    'Polymorph', 'Stone Shape', 'Stoneskin', 'Wall of Fire',
    // 5th Level
    'Animate Objects', 'Bigby\'s Hand', 'Cloudkill', 'Cone of Cold',
    'Conjure Elemental', 'Contact Other Plane', 'Creation', 'Dominate Person',
    'Dream', 'Geas', 'Hold Monster', 'Legend Lore', 'Mislead',
    'Modify Memory', 'Passwall', 'Planar Binding', 'Rary\'s Telepathic Bond',
    'Scrying', 'Seeming', 'Telekinesis', 'Teleportation Circle', 'Wall of Force',
    'Wall of Stone',
  ],
};
