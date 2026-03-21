/**
 * Cultural Name Generator — Names by culture/region for world-building.
 * Supplements the race-based NPC name generator with region-flavored names.
 */

const CULTURAL_NAMES = {
  northern: {
    label: 'Northern / Viking',
    male: ['Bjorn', 'Erik', 'Gunnar', 'Halvard', 'Ivar', 'Leif', 'Magnus', 'Olaf', 'Ragnar', 'Sigurd', 'Thorin', 'Ulfric', 'Vidar', 'Harald', 'Fenris', 'Torsten', 'Svein', 'Brynjar', 'Asmund', 'Kael'],
    female: ['Astrid', 'Brynhild', 'Freya', 'Gudrun', 'Helga', 'Ingrid', 'Kara', 'Sigrid', 'Thyra', 'Ylva', 'Ragnhild', 'Solveig', 'Sif', 'Eira', 'Hilda', 'Revna', 'Dagny', 'Torhild', 'Alfhild', 'Liv'],
    surnames: ['Ironforge', 'Stormborn', 'Frostbeard', 'Wolfsbane', 'Thunderheart', 'Iceblood', 'Ravenclaw', 'Bearskull', 'Stonefist', 'Winterheart'],
  },
  eastern: {
    label: 'Eastern / Silk Road',
    male: ['Akira', 'Chen', 'Daisuke', 'Feng', 'Hiro', 'Jin', 'Kazuki', 'Li Wei', 'Makoto', 'Ryu', 'Shen', 'Takeshi', 'Wei', 'Xian', 'Yuto', 'Zhen', 'Bao', 'Haruki', 'Kenji', 'Tao'],
    female: ['Akemi', 'Bing', 'Chihiro', 'Fang', 'Hana', 'Jade', 'Kaede', 'Lian', 'Mei', 'Nari', 'Sakura', 'Tomoe', 'Xiu', 'Yuki', 'Zhi', 'Ai', 'Fumiko', 'Hua', 'Kiyoko', 'Ren'],
    surnames: ['Jade Phoenix', 'Iron Lotus', 'Silent Storm', 'Golden Crane', 'Crimson Tiger', 'Moon Shadow', 'Dragon Pearl', 'Wind Walker', 'Star Gazer', 'Silk Weaver'],
  },
  desert: {
    label: 'Desert / Arabian',
    male: ['Amir', 'Bashir', 'Cyrus', 'Darius', 'Farid', 'Hassan', 'Ibrahim', 'Jalil', 'Khalid', 'Malik', 'Nasir', 'Omar', 'Rashid', 'Salim', 'Tariq', 'Zahir', 'Aziz', 'Idris', 'Karim', 'Yusuf'],
    female: ['Amira', 'Basira', 'Dalila', 'Farah', 'Halima', 'Inara', 'Jamila', 'Layla', 'Nadia', 'Rashida', 'Safiya', 'Tahira', 'Yasmin', 'Zahra', 'Aisha', 'Fatima', 'Khadija', 'Miriam', 'Samira', 'Zaina'],
    surnames: ['al-Sharif', 'ibn Rashid', 'al-Hakim', 'el-Amin', 'al-Noor', 'ibn Khalil', 'al-Sayed', 'el-Masri', 'al-Fadl', 'ibn Yusuf'],
  },
  mediterranean: {
    label: 'Mediterranean / Roman',
    male: ['Aurelius', 'Cassius', 'Demetrius', 'Felix', 'Gaius', 'Hadrian', 'Julius', 'Lucius', 'Marcus', 'Nero', 'Octavian', 'Quintus', 'Romulus', 'Severus', 'Titus', 'Valerius', 'Maximus', 'Antonius', 'Brutus', 'Cato'],
    female: ['Aurelia', 'Claudia', 'Diana', 'Faustina', 'Helena', 'Julia', 'Livia', 'Marcella', 'Octavia', 'Portia', 'Sabina', 'Valeria', 'Cornelia', 'Flavia', 'Lucretia', 'Agrippina', 'Camilla', 'Drusilla', 'Messalina', 'Tullia'],
    surnames: ['Corvinus', 'Aquila', 'Maximus', 'Gracchus', 'Regulus', 'Silanus', 'Varro', 'Priscus', 'Longinus', 'Crassus'],
  },
  celtic: {
    label: 'Celtic / Druidic',
    male: ['Aidan', 'Brennan', 'Cael', 'Declan', 'Eamon', 'Fionn', 'Gallan', 'Lorcan', 'Niall', 'Oisin', 'Padraig', 'Ronan', 'Seamus', 'Tiernan', 'Cormac', 'Diarmuid', 'Fergus', 'Killian', 'Lugh', 'Tadhg'],
    female: ['Aine', 'Brigid', 'Ciara', 'Deirdre', 'Eithne', 'Fiona', 'Grainne', 'Iona', 'Maeve', 'Niamh', 'Orlaith', 'Rhiannon', 'Saoirse', 'Siobhan', 'Aoife', 'Branwen', 'Caoimhe', 'Eileen', 'Moira', 'Nuala'],
    surnames: ['Oakenheart', 'Thornfield', 'Mistwalker', 'Greenmantle', 'Stonebrook', 'Willowshade', 'Moonwhisper', 'Fernhollow', 'Ashwood', 'Ravendale'],
  },
  slavic: {
    label: 'Slavic / Eastern European',
    male: ['Aleksei', 'Boris', 'Dimitri', 'Fyodor', 'Igor', 'Ivan', 'Kazimir', 'Lev', 'Miroslav', 'Nikolai', 'Pavel', 'Radoslav', 'Stanislav', 'Viktor', 'Vladimir', 'Yaroslav', 'Bogdan', 'Dragan', 'Grigori', 'Oleg'],
    female: ['Anastasia', 'Branka', 'Daria', 'Elena', 'Galina', 'Irina', 'Katarina', 'Ludmila', 'Mila', 'Natasha', 'Olga', 'Rada', 'Svetlana', 'Tatiana', 'Valentina', 'Yelena', 'Zoya', 'Anya', 'Ivana', 'Vesna'],
    surnames: ['Volkov', 'Petrov', 'Morozov', 'Sokolov', 'Dragomir', 'Kuznetsov', 'Novak', 'Zima', 'Koval', 'Chernyshev'],
  },
  tropical: {
    label: 'Tropical / Island',
    male: ['Akua', 'Biko', 'Davu', 'Ekon', 'Jelani', 'Kato', 'Lewa', 'Mosi', 'Nuru', 'Osei', 'Rudo', 'Tau', 'Uzoma', 'Wekesa', 'Zuberi', 'Amadi', 'Chike', 'Idris', 'Kofi', 'Sefu'],
    female: ['Adaeze', 'Binta', 'Chiku', 'Dalili', 'Eshe', 'Fatou', 'Imani', 'Jamila', 'Kamaria', 'Lulu', 'Makena', 'Nia', 'Oni', 'Sanura', 'Zuri', 'Amara', 'Folami', 'Hasina', 'Kesi', 'Thandiwe'],
    surnames: ['Sunspeaker', 'Tidewalker', 'Stormcaller', 'Coralborn', 'Sandweaver', 'Windchaser', 'Firebloom', 'Jungleheart', 'Reefguard', 'Thunderpalm'],
  },
  underworld: {
    label: 'Underworld / Underdark',
    male: ['Draxus', 'Kethren', 'Malagrim', 'Nezzar', 'Pharek', 'Rhazien', 'Szoreth', 'Veldrin', 'Xarann', 'Zekith', 'Arach', 'Duskrin', 'Guldeth', 'Ilphrin', 'Nathrez'],
    female: ['Akordia', 'Belaern', 'Drisinil', 'Elvara', 'Ghilanna', 'Ilivarra', 'Jhael', 'Lirdneth', 'Malice', 'Nedylene', 'Pellani', 'Quave', 'Shri', 'Talice', 'Viconia'],
    surnames: ['Shadowveil', 'Darkmantle', 'Deepstone', 'Sporewalker', 'Gloomweaver', 'Crystalblood', 'Venomtongue', 'Silkspinner', 'Duskhollow', 'Nightfang'],
  },
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function generateCulturalName(cultureKey, gender = 'any') {
  const culture = CULTURAL_NAMES[cultureKey];
  if (!culture) return 'Unknown';

  let firstName;
  if (gender === 'male') {
    firstName = pick(culture.male);
  } else if (gender === 'female') {
    firstName = pick(culture.female);
  } else {
    firstName = pick([...culture.male, ...culture.female]);
  }

  const surname = pick(culture.surnames);
  return { firstName, surname, full: `${firstName} ${surname}`, culture: culture.label };
}

export function generateBatchNames(cultureKey, count = 5, gender = 'any') {
  return Array.from({ length: count }, () => generateCulturalName(cultureKey, gender));
}

export function getCultureOptions() {
  return Object.entries(CULTURAL_NAMES).map(([key, c]) => ({
    id: key,
    label: c.label,
  }));
}

export { CULTURAL_NAMES };
