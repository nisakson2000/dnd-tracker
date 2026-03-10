from fastapi import APIRouter, HTTPException

from backend.database import get_session
from backend.models.all_models import (
    CharacterOverview, AbilityScore, SavingThrow, Skill,
    Backstory, Spell, SpellSlot, Item, Currency,
    Feature, Attack, Condition, CombatNotes,
    JournalEntry, NPC, Quest, LoreNote,
)

router = APIRouter(prefix="/characters/{character_id}/export", tags=["export"])


def _row_to_dict(row, exclude=None):
    exclude = exclude or set()
    return {
        c.name: getattr(row, c.name)
        for c in row.__table__.columns
        if c.name not in exclude
    }


@router.get("")
def export_character(character_id: str):
    session = get_session(character_id)
    try:
        overview = session.query(CharacterOverview).first()
        if not overview:
            raise HTTPException(status_code=404, detail="Character not found")

        abilities = session.query(AbilityScore).all()
        saves = session.query(SavingThrow).all()
        skills = session.query(Skill).all()
        backstory = session.query(Backstory).first()
        spells = session.query(Spell).order_by(Spell.level, Spell.name).all()
        spell_slots = session.query(SpellSlot).order_by(SpellSlot.slot_level).all()
        items = session.query(Item).all()
        currency = session.query(Currency).first()
        features = session.query(Feature).all()
        attacks = session.query(Attack).all()
        conditions = session.query(Condition).filter_by(active=True).all()
        combat_notes = session.query(CombatNotes).first()
        journal = session.query(JournalEntry).order_by(JournalEntry.created_at.desc()).all()
        npcs = session.query(NPC).order_by(NPC.name).all()
        quests = session.query(Quest).all()
        lore = session.query(LoreNote).all()

        # Serialize datetimes to strings
        def serialize(row, exclude=None):
            d = _row_to_dict(row, exclude)
            for k, v in d.items():
                if hasattr(v, 'isoformat'):
                    d[k] = v.isoformat()
            return d

        result = {
            "character_id": character_id,
            "overview": serialize(overview, exclude={"id"}),
            "ability_scores": {a.ability: a.score for a in abilities},
            "saving_throw_proficiencies": [s.ability for s in saves if s.proficient],
            "skills": [
                {"name": s.name, "proficient": s.proficient, "expertise": s.expertise}
                for s in skills
            ],
            "backstory": serialize(backstory, exclude={"id", "portrait_data"}) if backstory else None,
            "spells": [serialize(s, exclude={"id"}) for s in spells],
            "spell_slots": [
                {"level": sl.slot_level, "max": sl.max_slots, "used": sl.used_slots}
                for sl in spell_slots if sl.max_slots > 0
            ],
            "inventory": [serialize(i, exclude={"id"}) for i in items],
            "currency": serialize(currency, exclude={"id"}) if currency else None,
            "features": [serialize(f, exclude={"id"}) for f in features],
            "attacks": [serialize(a, exclude={"id"}) for a in attacks],
            "active_conditions": [c.name for c in conditions],
            "combat_notes": serialize(combat_notes, exclude={"id"}) if combat_notes else None,
            "journal_entries": [serialize(j, exclude={"id"}) for j in journal],
            "npcs": [serialize(n, exclude={"id"}) for n in npcs],
            "quests": [
                {
                    **serialize(q, exclude={"id"}),
                    "objectives": [
                        {"text": o.text, "completed": o.completed}
                        for o in q.objectives
                    ],
                }
                for q in quests
            ],
            "lore_notes": [serialize(ln, exclude={"id"}) for ln in lore],
        }

        return result
    finally:
        session.close()
