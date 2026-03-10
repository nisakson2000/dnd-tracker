from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey,
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from backend.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class CharacterOverview(Base):
    __tablename__ = "character_overview"

    id = Column(Integer, primary_key=True, default=1)
    name = Column(String(100), nullable=False, default="New Character")
    race = Column(String(50), default="")
    subrace = Column(String(50), default="")
    primary_class = Column(String(50), default="")
    primary_subclass = Column(String(50), default="")
    level = Column(Integer, default=1)
    background = Column(String(50), default="")
    alignment = Column(String(30), default="")
    experience_points = Column(Integer, default=0)
    max_hp = Column(Integer, default=10)
    current_hp = Column(Integer, default=10)
    temp_hp = Column(Integer, default=0)
    armor_class = Column(Integer, default=10)
    speed = Column(Integer, default=30)
    hit_dice_total = Column(String(20), default="1d10")
    hit_dice_used = Column(Integer, default=0)
    death_save_successes = Column(Integer, default=0)
    death_save_failures = Column(Integer, default=0)
    inspiration = Column(Boolean, default=False)
    senses = Column(Text, default="")
    languages = Column(Text, default="Common")
    proficiencies_armor = Column(Text, default="")
    proficiencies_weapons = Column(Text, default="")
    proficiencies_tools = Column(Text, default="")
    campaign_name = Column(String(100), default="")
    exhaustion_level = Column(Integer, default=0)
    ruleset = Column(String(20), default="5e-2014")
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    # Multiclass support
    multiclass_data = Column(Text, default="[]")


class AbilityScore(Base):
    __tablename__ = "ability_scores"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ability = Column(String(3), nullable=False, unique=True)
    score = Column(Integer, default=10)


class SavingThrow(Base):
    __tablename__ = "saving_throws"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ability = Column(String(3), nullable=False, unique=True)
    proficient = Column(Boolean, default=False)


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False, unique=True)
    proficient = Column(Boolean, default=False)
    expertise = Column(Boolean, default=False)


class Backstory(Base):
    __tablename__ = "backstory"

    id = Column(Integer, primary_key=True, default=1)
    backstory_text = Column(Text, default="")
    personality_traits = Column(Text, default="")
    ideals = Column(Text, default="")
    bonds = Column(Text, default="")
    flaws = Column(Text, default="")
    age = Column(String(20), default="")
    height = Column(String(20), default="")
    weight = Column(String(20), default="")
    eyes = Column(String(30), default="")
    hair = Column(String(30), default="")
    skin = Column(String(30), default="")
    portrait_data = Column(Text, default="")
    allies_organizations = Column(Text, default="")
    appearance_notes = Column(Text, default="")
    goals_motivations = Column(Text, default="")


class Spell(Base):
    __tablename__ = "spells"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    level = Column(Integer, default=0)
    school = Column(String(30), default="")
    casting_time = Column(String(50), default="")
    spell_range = Column(String(50), default="")
    components = Column(String(100), default="")
    material = Column(String(200), default="")
    duration = Column(String(50), default="")
    concentration = Column(Boolean, default=False)
    ritual = Column(Boolean, default=False)
    description = Column(Text, default="")
    upcast_notes = Column(Text, default="")
    prepared = Column(Boolean, default=False)
    source = Column(String(50), default="PHB")


class SpellSlot(Base):
    __tablename__ = "spell_slots"

    id = Column(Integer, primary_key=True, autoincrement=True)
    slot_level = Column(Integer, nullable=False, unique=True)
    max_slots = Column(Integer, default=0)
    used_slots = Column(Integer, default=0)


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    item_type = Column(String(30), default="misc")
    weight = Column(Float, default=0.0)
    value_gp = Column(Float, default=0.0)
    quantity = Column(Integer, default=1)
    description = Column(Text, default="")
    attunement = Column(Boolean, default=False)
    attuned = Column(Boolean, default=False)
    equipped = Column(Boolean, default=False)
    equipment_slot = Column(String(30), default="")


class Currency(Base):
    __tablename__ = "currency"

    id = Column(Integer, primary_key=True, default=1)
    cp = Column(Integer, default=0)
    sp = Column(Integer, default=0)
    ep = Column(Integer, default=0)
    gp = Column(Integer, default=0)
    pp = Column(Integer, default=0)


class Feature(Base):
    __tablename__ = "features"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    source = Column(String(50), default="")
    source_level = Column(Integer, default=0)
    feature_type = Column(String(30), default="class")
    description = Column(Text, default="")


class Attack(Base):
    __tablename__ = "attacks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    attack_bonus = Column(String(20), default="+0")
    damage_dice = Column(String(30), default="1d6")
    damage_type = Column(String(30), default="")
    attack_range = Column(String(30), default="")
    notes = Column(Text, default="")


class Condition(Base):
    __tablename__ = "conditions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(30), nullable=False, unique=True)
    active = Column(Boolean, default=False)


class CombatNotes(Base):
    __tablename__ = "combat_notes"

    id = Column(Integer, primary_key=True, default=1)
    actions = Column(Text, default="")
    bonus_actions = Column(Text, default="")
    reactions = Column(Text, default="")
    legendary_actions = Column(Text, default="")


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    session_number = Column(Integer, default=0)
    real_date = Column(String(20), default="")
    ingame_date = Column(String(50), default="")
    body = Column(Text, default="")
    tags = Column(Text, default="")
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)


class NPC(Base):
    __tablename__ = "npcs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    role = Column(String(30), default="neutral")
    race = Column(String(50), default="")
    npc_class = Column(String(50), default="")
    location = Column(String(100), default="")
    description = Column(Text, default="")
    notes = Column(Text, default="")
    status = Column(String(20), default="alive")


class Quest(Base):
    __tablename__ = "quests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    giver = Column(String(100), default="")
    description = Column(Text, default="")
    status = Column(String(20), default="active")
    notes = Column(Text, default="")

    objectives = relationship("QuestObjective", back_populates="quest",
                              cascade="all, delete-orphan")


class QuestObjective(Base):
    __tablename__ = "quest_objectives"

    id = Column(Integer, primary_key=True, autoincrement=True)
    quest_id = Column(Integer, ForeignKey("quests.id"), nullable=False)
    text = Column(String(300), nullable=False)
    completed = Column(Boolean, default=False)

    quest = relationship("Quest", back_populates="objectives")


class LoreNote(Base):
    __tablename__ = "lore_notes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    category = Column(String(50), default="")
    body = Column(Text, default="")
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)
