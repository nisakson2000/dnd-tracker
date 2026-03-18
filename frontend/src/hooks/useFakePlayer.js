import { useState, useCallback, useRef } from 'react';
import { useTutorial } from '../contexts/TutorialContext';

const FAKE_PLAYER = {
  id: 'tutorial-fake-player-001',
  name: 'Elara Brightblade',
  display_name: 'Elara Brightblade',
  connected: true,
  playerStatus: 'approved',
  status: 'approved',
  uuid: 'tutorial-fake-player-001',
  player_uuid: 'tutorial-fake-player-001',
  // Character data
  race: 'Human',
  primary_class: 'Fighter',
  level: 1,
  current_hp: 12,
  max_hp: 12,
  temp_hp: 0,
  armor_class: 15,
  speed: 30,
  passive_perception: 12,
  // Ability scores
  strength: 16,
  dexterity: 14,
  constitution: 14,
  intelligence: 10,
  wisdom: 12,
  charisma: 8,
  // Initiative
  initiative_bonus: 2,
  // Death saves
  death_save_successes: 0,
  death_save_failures: 0,
  // Spell slots (fighter = none)
  spell_slots: {},
  // Conditions
  conditions: [],
  // Inspiration
  inspiration: false,
  exhaustion_level: 0,
};

/**
 * Hook that provides a fake player for the tutorial.
 * Returns the fake player object and response simulation functions.
 */
export default function useFakePlayer() {
  const tutorial = useTutorial();
  const [fakePlayerHp, setFakePlayerHp] = useState(FAKE_PLAYER.max_hp);
  const [responses, setResponses] = useState([]);
  const responseIdRef = useRef(0);

  const isActive = tutorial?.tutorialActive;

  const fakePlayer = isActive ? {
    ...FAKE_PLAYER,
    current_hp: fakePlayerHp,
  } : null;

  /**
   * Simulate a player response after a delay.
   * @param {'acknowledge'|'rollCheck'|'rollInitiative'} actionType
   * @param {object} context - optional context (e.g. { skill, dc })
   */
  const simulateResponse = useCallback((actionType, context = {}) => {
    if (!isActive) return;

    const delay = 1500 + Math.random() * 1500; // 1.5-3s

    setTimeout(() => {
      const id = ++responseIdRef.current;
      let response;

      switch (actionType) {
        case 'acknowledge':
          response = {
            id,
            type: 'chat',
            from: FAKE_PLAYER.name,
            playerId: FAKE_PLAYER.id,
            message: 'Elara nods thoughtfully.',
            timestamp: Date.now(),
          };
          break;

        case 'rollCheck': {
          const roll = Math.floor(Math.random() * 20) + 1;
          const modifier = context.ability === 'Wisdom' ? 1 : context.ability === 'Dexterity' ? 2 : 0;
          const total = roll + modifier;
          const dc = context.dc || 12;
          const passed = total >= dc;
          response = {
            id,
            type: 'rollResult',
            from: FAKE_PLAYER.name,
            playerId: FAKE_PLAYER.id,
            message: `${FAKE_PLAYER.name} rolled ${context.skill || 'Check'}: ${roll} + ${modifier} = ${total} (${passed ? 'Pass' : 'Fail'})`,
            roll,
            total,
            passed,
            timestamp: Date.now(),
          };
          break;
        }

        case 'rollInitiative': {
          const roll = Math.floor(Math.random() * 20) + 1;
          const total = roll + FAKE_PLAYER.initiative_bonus;
          response = {
            id,
            type: 'initiative',
            from: FAKE_PLAYER.name,
            playerId: FAKE_PLAYER.id,
            message: `${FAKE_PLAYER.name} rolled initiative: ${roll} + ${FAKE_PLAYER.initiative_bonus} = ${total}`,
            roll,
            total,
            timestamp: Date.now(),
          };
          break;
        }

        default:
          return;
      }

      setResponses(prev => [...prev, response]);
    }, delay);
  }, [isActive]);

  const applyDamage = useCallback((amount) => {
    setFakePlayerHp(prev => Math.max(0, prev - amount));
  }, []);

  const applyHeal = useCallback((amount) => {
    setFakePlayerHp(prev => Math.min(FAKE_PLAYER.max_hp, prev + amount));
  }, []);

  const clearResponses = useCallback(() => {
    setResponses([]);
  }, []);

  return {
    fakePlayer,
    responses,
    simulateResponse,
    applyDamage,
    applyHeal,
    clearResponses,
    isActive,
  };
}

export { FAKE_PLAYER };
