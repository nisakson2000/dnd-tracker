import logging
from fastapi import APIRouter, HTTPException, Request

from backend.database import get_session, init_character_db
from backend.models.all_models import (
    CharacterOverview, AbilityScore, SavingThrow, Skill,
    Backstory, Spell, SpellSlot, Item, Currency,
    Feature, Attack, Condition, CombatNotes,
    JournalEntry, NPC, Quest, QuestObjective, LoreNote,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/characters/{character_id}/import", tags=["import"])

SPELL_FIELDS = {
    'name', 'level', 'school', 'casting_time', 'spell_range', 'components',
    'material', 'duration', 'concentration', 'ritual', 'description',
    'upcast_notes', 'prepared', 'source',
}

ITEM_FIELDS = {
    'name', 'item_type', 'weight', 'value_gp', 'quantity', 'description',
    'attunement', 'attuned', 'equipped', 'equipment_slot',
}

FEATURE_FIELDS = {
    'name', 'source', 'source_level', 'feature_type', 'description',
}

ATTACK_FIELDS = {
    'name', 'attack_bonus', 'damage_dice', 'damage_type', 'attack_range', 'notes',
}

JOURNAL_FIELDS = {
    'title', 'session_number', 'real_date', 'ingame_date', 'body', 'tags',
}

NPC_FIELDS = {
    'name', 'role', 'race', 'npc_class', 'location', 'description', 'notes', 'status',
}

LORE_FIELDS = {
    'title', 'category', 'body',
}


def _pick(data, allowed_fields):
    return {k: v for k, v in data.items() if k in allowed_fields}


def _safe_str(val, default=""):
    if val is None:
        return default
    return str(val)


def _safe_int(val, default=0):
    if val is None:
        return default
    try:
        return int(val)
    except (ValueError, TypeError):
        return default


def _safe_float(val, default=0.0):
    if val is None:
        return default
    try:
        return float(val)
    except (ValueError, TypeError):
        return default


def _safe_bool(val, default=False):
    if val is None:
        return default
    if isinstance(val, bool):
        return val
    if isinstance(val, str):
        return val.lower() in ('true', '1', 'yes')
    return bool(val)


@router.post("")
async def import_character(character_id: str, request: Request):
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON in request body")
    if not isinstance(data, dict):
        raise HTTPException(status_code=400, detail="Expected a JSON object")
    errors = []
    imported = {}

    init_character_db(character_id)
    session = get_session(character_id)

    try:
        # Overview
        if data.get('overview'):
            ov = data['overview']
            row = session.query(CharacterOverview).first()
            if not row:
                row = CharacterOverview(id=1)
                session.add(row)
                session.flush()

            for field in ['name', 'race', 'subrace', 'primary_class', 'primary_subclass',
                          'background', 'alignment', 'senses', 'languages',
                          'proficiencies_armor', 'proficiencies_weapons', 'proficiencies_tools',
                          'campaign_name', 'hit_dice_total', 'multiclass_data']:
                if field in ov:
                    setattr(row, field, _safe_str(ov[field]))

            for field in ['level', 'experience_points', 'max_hp', 'current_hp', 'temp_hp',
                          'armor_class', 'speed', 'hit_dice_used', 'death_save_successes',
                          'death_save_failures', 'exhaustion_level']:
                if field in ov:
                    setattr(row, field, _safe_int(ov[field]))

            if 'inspiration' in ov:
                row.inspiration = _safe_bool(ov['inspiration'])

            session.flush()
            imported['overview'] = True

        # Ability scores
        if data.get('ability_scores'):
            abs_data = data['ability_scores']
            if isinstance(abs_data, dict):
                for ability, score in abs_data.items():
                    row = session.query(AbilityScore).filter_by(ability=ability).first()
                    if row:
                        row.score = _safe_int(score, 10)
                    else:
                        session.add(AbilityScore(ability=ability, score=_safe_int(score, 10)))
            elif isinstance(abs_data, list):
                for item in abs_data:
                    ability = item.get('ability')
                    score = item.get('score', 10)
                    if not ability:
                        continue
                    row = session.query(AbilityScore).filter_by(ability=ability).first()
                    if row:
                        row.score = _safe_int(score, 10)
                    else:
                        session.add(AbilityScore(ability=ability, score=_safe_int(score, 10)))
            session.flush()
            imported['ability_scores'] = True

        # Saving throws
        if data.get('saving_throw_proficiencies'):
            prof_list = data['saving_throw_proficiencies']
            if isinstance(prof_list, list):
                for ability in ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']:
                    row = session.query(SavingThrow).filter_by(ability=ability).first()
                    if row:
                        row.proficient = ability in prof_list
            session.flush()
            imported['saving_throws'] = True

        # Skills
        if data.get('skills'):
            for sk in data['skills']:
                name = sk.get('name')
                if not name:
                    continue
                row = session.query(Skill).filter_by(name=name).first()
                if row:
                    row.proficient = _safe_bool(sk.get('proficient'))
                    row.expertise = _safe_bool(sk.get('expertise'))
            session.flush()
            imported['skills'] = True

        # Backstory
        if data.get('backstory'):
            bs_data = data['backstory']
            row = session.query(Backstory).first()
            if not row:
                row = Backstory(id=1)
                session.add(row)
                session.flush()

            for field in ['backstory_text', 'personality_traits', 'ideals', 'bonds', 'flaws',
                          'age', 'height', 'weight', 'eyes', 'hair', 'skin',
                          'allies_organizations', 'appearance_notes', 'goals_motivations']:
                if field in bs_data:
                    setattr(row, field, _safe_str(bs_data[field]))
            session.flush()
            imported['backstory'] = True

        # Spells
        if data.get('spells'):
            session.query(Spell).delete()
            session.flush()
            count = 0
            for sp in data['spells']:
                name = sp.get('name')
                if not name:
                    continue
                cleaned = {
                    'name': _safe_str(name),
                    'level': _safe_int(sp.get('level')),
                    'school': _safe_str(sp.get('school')),
                    'casting_time': _safe_str(sp.get('casting_time')),
                    'spell_range': _safe_str(sp.get('spell_range', sp.get('range', ''))),
                    'components': _safe_str(sp.get('components')),
                    'material': _safe_str(sp.get('material')),
                    'duration': _safe_str(sp.get('duration')),
                    'concentration': _safe_bool(sp.get('concentration')),
                    'ritual': _safe_bool(sp.get('ritual')),
                    'description': _safe_str(sp.get('description')),
                    'upcast_notes': _safe_str(sp.get('upcast_notes', sp.get('at_higher_levels', ''))),
                    'prepared': _safe_bool(sp.get('prepared')),
                    'source': _safe_str(sp.get('source'), 'PHB'),
                }
                session.add(Spell(**cleaned))
                count += 1
            session.flush()
            imported['spells'] = count

        # Spell slots
        if data.get('spell_slots'):
            session.query(SpellSlot).delete()
            session.flush()
            for sl in data['spell_slots']:
                level = sl.get('level') or sl.get('slot_level')
                max_s = sl.get('max') or sl.get('max_slots', 0)
                used_s = sl.get('used') or sl.get('used_slots', 0)
                if level:
                    session.add(SpellSlot(
                        slot_level=_safe_int(level),
                        max_slots=_safe_int(max_s),
                        used_slots=_safe_int(used_s),
                    ))
            session.flush()
            imported['spell_slots'] = True

        # Inventory
        if data.get('inventory'):
            session.query(Item).delete()
            session.flush()
            count = 0
            for it in data['inventory']:
                name = it.get('name')
                if not name:
                    continue
                session.add(Item(
                    name=_safe_str(name),
                    item_type=_safe_str(it.get('item_type', it.get('type', 'misc')), 'misc'),
                    weight=_safe_float(it.get('weight')),
                    value_gp=_safe_float(it.get('value_gp', it.get('value', 0))),
                    quantity=_safe_int(it.get('quantity'), 1),
                    description=_safe_str(it.get('description')),
                    attunement=_safe_bool(it.get('attunement', it.get('requires_attunement'))),
                    attuned=_safe_bool(it.get('attuned')),
                    equipped=_safe_bool(it.get('equipped')),
                    equipment_slot=_safe_str(it.get('equipment_slot')),
                ))
                count += 1
            session.flush()
            imported['inventory'] = count

        # Currency
        if data.get('currency'):
            c = data['currency']
            row = session.query(Currency).first()
            if not row:
                row = Currency(id=1)
                session.add(row)
                session.flush()
            row.cp = _safe_int(c.get('cp'))
            row.sp = _safe_int(c.get('sp'))
            row.ep = _safe_int(c.get('ep'))
            row.gp = _safe_int(c.get('gp'))
            row.pp = _safe_int(c.get('pp'))
            session.flush()
            imported['currency'] = True

        # Features
        if data.get('features'):
            session.query(Feature).delete()
            session.flush()
            count = 0
            for f in data['features']:
                name = f.get('name')
                if not name:
                    continue
                session.add(Feature(
                    name=_safe_str(name),
                    source=_safe_str(f.get('source')),
                    source_level=_safe_int(f.get('source_level', f.get('level', 0))),
                    feature_type=_safe_str(f.get('feature_type', f.get('type', 'class')), 'class'),
                    description=_safe_str(f.get('description')),
                ))
                count += 1
            session.flush()
            imported['features'] = count

        # Attacks
        if data.get('attacks'):
            session.query(Attack).delete()
            session.flush()
            for a in data['attacks']:
                name = a.get('name')
                if not name:
                    continue
                session.add(Attack(
                    name=_safe_str(name),
                    attack_bonus=_safe_str(a.get('attack_bonus'), '+0'),
                    damage_dice=_safe_str(a.get('damage_dice', a.get('damage', '1d6')), '1d6'),
                    damage_type=_safe_str(a.get('damage_type')),
                    attack_range=_safe_str(a.get('attack_range', a.get('range', ''))),
                    notes=_safe_str(a.get('notes')),
                ))
            session.flush()
            imported['attacks'] = True

        # Combat notes
        if data.get('combat_notes'):
            cn = data['combat_notes']
            row = session.query(CombatNotes).first()
            if not row:
                row = CombatNotes(id=1)
                session.add(row)
                session.flush()
            row.actions = _safe_str(cn.get('actions'))
            row.bonus_actions = _safe_str(cn.get('bonus_actions'))
            row.reactions = _safe_str(cn.get('reactions'))
            row.legendary_actions = _safe_str(cn.get('legendary_actions'))
            session.flush()
            imported['combat_notes'] = True

        # Conditions
        if data.get('active_conditions'):
            for cond in session.query(Condition).all():
                cond.active = cond.name in data['active_conditions']
            session.flush()
            imported['conditions'] = True

        # Journal
        if data.get('journal_entries'):
            session.query(JournalEntry).delete()
            session.flush()
            count = 0
            for j in data['journal_entries']:
                title = j.get('title')
                if not title:
                    continue
                session.add(JournalEntry(
                    title=_safe_str(title),
                    session_number=_safe_int(j.get('session_number')),
                    real_date=_safe_str(j.get('real_date')),
                    ingame_date=_safe_str(j.get('ingame_date')),
                    body=_safe_str(j.get('body')),
                    tags=_safe_str(j.get('tags')),
                ))
                count += 1
            session.flush()
            imported['journal'] = count

        # NPCs
        if data.get('npcs'):
            session.query(NPC).delete()
            session.flush()
            count = 0
            for n in data['npcs']:
                name = n.get('name')
                if not name:
                    continue
                session.add(NPC(
                    name=_safe_str(name),
                    role=_safe_str(n.get('role'), 'neutral'),
                    race=_safe_str(n.get('race')),
                    npc_class=_safe_str(n.get('npc_class', n.get('class', ''))),
                    location=_safe_str(n.get('location')),
                    description=_safe_str(n.get('description')),
                    notes=_safe_str(n.get('notes')),
                    status=_safe_str(n.get('status'), 'alive'),
                ))
                count += 1
            session.flush()
            imported['npcs'] = count

        # Quests
        if data.get('quests'):
            session.query(QuestObjective).delete()
            session.query(Quest).delete()
            session.flush()
            count = 0
            for q in data['quests']:
                title = q.get('title')
                if not title:
                    continue
                quest = Quest(
                    title=_safe_str(title),
                    giver=_safe_str(q.get('giver')),
                    description=_safe_str(q.get('description')),
                    status=_safe_str(q.get('status'), 'active'),
                    notes=_safe_str(q.get('notes')),
                )
                for obj in (q.get('objectives') or []):
                    quest.objectives.append(QuestObjective(
                        text=_safe_str(obj.get('text')),
                        completed=_safe_bool(obj.get('completed')),
                    ))
                session.add(quest)
                count += 1
            session.flush()
            imported['quests'] = count

        # Lore
        if data.get('lore_notes'):
            session.query(LoreNote).delete()
            session.flush()
            count = 0
            for l in data['lore_notes']:
                title = l.get('title')
                if not title:
                    continue
                session.add(LoreNote(
                    title=_safe_str(title),
                    category=_safe_str(l.get('category')),
                    body=_safe_str(l.get('body')),
                ))
                count += 1
            session.flush()
            imported['lore'] = count

        session.commit()
        return {"status": "imported", "imported": imported, "errors": errors}

    except Exception as e:
        session.rollback()
        logger.exception("Import failed")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()
