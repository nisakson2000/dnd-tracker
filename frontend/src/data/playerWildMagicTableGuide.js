/**
 * playerWildMagicTableGuide.js
 * Player Mode: Complete Wild Magic Surge table with ratings and tactical notes
 * Pure JS — no React dependencies.
 */

export const WILD_SURGE_TABLE = [
  { roll: '01-02', effect: 'Roll on this table at the start of each turn for 1 minute.', rating: 'C', note: 'Chaos incarnate. Multiple surges.' },
  { roll: '03-04', effect: 'You can see invisible creatures for 1 minute.', rating: 'A+', note: 'Free See Invisibility. Great utility.' },
  { roll: '05-06', effect: 'A modron appears within 5ft, then disappears on its next turn.', rating: 'D', note: 'Flavor only. No mechanical benefit.' },
  { roll: '07-08', effect: 'You cast Fireball (3rd level) centered on yourself.', rating: 'F to S', note: 'Self-centered Fireball. Could kill you or clear enemies. Sculpt Spells helps.' },
  { roll: '09-10', effect: 'You cast Magic Missile (5th level).', rating: 'A+', note: 'Free 7-dart Magic Missile. Nice damage.' },
  { roll: '11-12', effect: 'Roll a d10. Your height changes by that many inches (gain or shrink).', rating: 'D', note: 'Cosmetic. No mechanical effect usually.' },
  { roll: '13-14', effect: 'You cast Confusion centered on yourself.', rating: 'B', note: 'AoE confusion. Hits allies too. Risky.' },
  { roll: '15-16', effect: 'Regain 5 HP at the start of each turn for 1 minute.', rating: 'S', note: '50 HP over 1 minute. Incredible healing.' },
  { roll: '17-18', effect: 'You grow a long beard of feathers until you sneeze.', rating: 'D', note: 'Cosmetic. Fun roleplay.' },
  { roll: '19-20', effect: 'You cast Grease centered on yourself.', rating: 'B', note: 'Self-centered Grease. Could prone you and enemies.' },
  { roll: '21-22', effect: 'Creatures have disadvantage on saves vs your spells for 1 minute.', rating: 'S+', note: 'FREE Heightened Spell on everything. Incredible.' },
  { roll: '23-24', effect: 'Your skin turns blue for 24 hours (or Remove Curse).', rating: 'D', note: 'Cosmetic. Fun roleplay.' },
  { roll: '25-26', effect: 'An eye appears on your forehead, granting advantage on Perception for 1 minute.', rating: 'A', note: 'Free advantage on Perception. Nice.' },
  { roll: '27-28', effect: 'You teleport up to 60ft to a random unoccupied space.', rating: 'B+', note: 'Random direction. Could be good or bad.' },
  { roll: '29-30', effect: 'You are transported to the Astral Plane until end of your next turn.', rating: 'B', note: 'Effectively gone for 1 round. Dodge by absence.' },
  { roll: '31-32', effect: 'Maximize the damage of the next damaging spell you cast within 1 minute.', rating: 'S+', note: 'Free Overchannel. Maximized Fireball = 48 damage.' },
  { roll: '33-34', effect: 'Roll a d10. Your age changes by that many years (age or de-age).', rating: 'D', note: 'Narrative. No combat effect.' },
  { roll: '35-36', effect: '1d6 flumphs appear around you, are frightened of you, and vanish after 1 minute.', rating: 'D', note: 'Flumphs! Flavor only.' },
  { roll: '37-38', effect: 'Regain 2d10 HP.', rating: 'A', note: 'Free healing. Always welcome.' },
  { roll: '39-40', effect: 'You turn into a potted plant until start of your next turn.', rating: 'F', note: 'Incapacitated for 1 round. Terrible.' },
  { roll: '41-42', effect: 'You can teleport up to 20ft as a bonus action for 1 minute.', rating: 'S', note: 'Free Misty Step as BA every turn. Amazing mobility.' },
  { roll: '43-44', effect: 'You cast Levitate on yourself.', rating: 'A', note: 'Free Levitate. Good for avoiding melee.' },
  { roll: '45-46', effect: 'A unicorn appears within 5ft and stays for 1 minute (controlled by DM).', rating: 'A+', note: 'Free unicorn ally. Can heal and attack.' },
  { roll: '47-48', effect: 'You can\'t speak for 1 minute. Sparks fly when you try.', rating: 'C', note: 'No verbal components. Bad for casters.' },
  { roll: '49-50', effect: 'A spectral shield hovers near you, granting +2 AC and immunity to Magic Missile.', rating: 'A+', note: 'Free Shield guardian. +2 AC for duration.' },
];

export const WILD_MAGIC_TIPS = [
  'Most surge results are positive or neutral. Only ~20% are harmful.',
  'DM controls when you surge (after casting L1+ spell, DM can call for d20, surge on 1).',
  'Tides of Chaos: advantage on one roll, then DM can trigger surge to recharge.',
  'Ask your DM to trigger surges frequently. More surges = more fun + more Tides recharges.',
  'Bend Luck (L6): 2 SP to add +/-1d4 to any d20 within 60ft. Excellent ability.',
  'Controlled Chaos (L14): roll twice on surge table, choose either result.',
  'Spell Bombardment (L18): reroll max damage dice. Nice bonus.',
  'Wild Magic is fun but inconsistent. DM engagement matters.',
];
