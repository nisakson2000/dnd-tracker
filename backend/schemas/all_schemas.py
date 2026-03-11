from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime


class FlexibleModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra='ignore')


# Character listing
class CharacterSummary(FlexibleModel):
    id: str
    name: str
    race: str
    primary_class: str
    level: int
    campaign_name: str
    ruleset: str = "5e-2014"
    updated_at: Optional[str] = None


class CharacterCreate(FlexibleModel):
    name: str = "New Character"
    ruleset: str = "5e-2014"
    race: str = ""
    primary_class: str = ""
    primary_subclass: str = ""


# Overview
class OverviewData(FlexibleModel):
    name: str = "New Character"
    race: str = ""
    subrace: str = ""
    primary_class: str = ""
    primary_subclass: str = ""
    level: int = Field(default=1, ge=1, le=20)
    background: str = ""
    alignment: str = ""
    experience_points: int = Field(default=0, ge=0)
    max_hp: int = Field(default=10, ge=0)
    current_hp: int = Field(default=10, ge=0)
    temp_hp: int = Field(default=0, ge=0)
    armor_class: int = Field(default=10, ge=0)
    speed: int = Field(default=30, ge=0)
    hit_dice_total: str = "1d10"
    hit_dice_used: int = Field(default=0, ge=0)
    death_save_successes: int = Field(default=0, ge=0, le=3)
    death_save_failures: int = Field(default=0, ge=0, le=3)
    inspiration: bool = False
    senses: str = ""
    languages: str = "Common"
    proficiencies_armor: str = ""
    proficiencies_weapons: str = ""
    proficiencies_tools: str = ""
    campaign_name: str = ""
    exhaustion_level: int = Field(default=0, ge=0, le=10)
    ruleset: str = "5e-2014"
    multiclass_data: str = "[]"


class AbilityScoreData(FlexibleModel):
    ability: str
    score: int = Field(default=10, ge=1, le=30)


class SavingThrowData(FlexibleModel):
    ability: str
    proficient: bool = False


class SkillData(FlexibleModel):
    name: str
    proficient: bool = False
    expertise: bool = False


class FullOverviewResponse(FlexibleModel):
    overview: OverviewData
    ability_scores: list[AbilityScoreData]
    saving_throws: list[SavingThrowData]
    skills: list[SkillData]


# Backstory
class BackstoryData(FlexibleModel):
    backstory_text: str = ""
    personality_traits: str = ""
    ideals: str = ""
    bonds: str = ""
    flaws: str = ""
    age: str = ""
    height: str = ""
    weight: str = ""
    eyes: str = ""
    hair: str = ""
    skin: str = ""
    portrait_data: str = ""
    allies_organizations: str = ""
    appearance_notes: str = ""
    goals_motivations: str = ""


# Spells
class SpellData(FlexibleModel):
    id: Optional[int] = None
    name: str
    level: int = 0
    school: str = ""
    casting_time: str = ""
    spell_range: str = ""
    components: str = ""
    material: str = ""
    duration: str = ""
    concentration: bool = False
    ritual: bool = False
    description: str = ""
    upcast_notes: str = ""
    prepared: bool = False
    source: str = "PHB"


class SpellSlotData(FlexibleModel):
    slot_level: int = Field(ge=1, le=9)
    max_slots: int = Field(default=0, ge=0)
    used_slots: int = Field(default=0, ge=0)


# Inventory
class ItemData(FlexibleModel):
    id: Optional[int] = None
    name: str
    item_type: str = "misc"
    weight: float = Field(default=0.0, ge=0)
    value_gp: float = Field(default=0.0, ge=0)
    quantity: int = Field(default=1, ge=1)
    description: str = ""
    attunement: bool = False
    attuned: bool = False
    equipped: bool = False
    equipment_slot: str = ""


class CurrencyData(FlexibleModel):
    cp: int = Field(default=0, ge=0)
    sp: int = Field(default=0, ge=0)
    ep: int = Field(default=0, ge=0)
    gp: int = Field(default=0, ge=0)
    pp: int = Field(default=0, ge=0)


# Features
class FeatureData(FlexibleModel):
    id: Optional[int] = None
    name: str
    source: str = ""
    source_level: int = 0
    feature_type: str = "class"
    description: str = ""


# Combat
class AttackData(FlexibleModel):
    id: Optional[int] = None
    name: str
    attack_bonus: str = "+0"
    damage_dice: str = "1d6"
    damage_type: str = ""
    attack_range: str = ""
    notes: str = ""


class ConditionData(FlexibleModel):
    name: str
    active: bool = False


class CombatNotesData(FlexibleModel):
    actions: str = ""
    bonus_actions: str = ""
    reactions: str = ""
    legendary_actions: str = ""


# Journal
class JournalEntryData(FlexibleModel):
    id: Optional[int] = None
    title: str
    session_number: int = 0
    real_date: str = ""
    ingame_date: str = ""
    body: str = ""
    tags: str = ""
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


# NPCs
class NPCData(FlexibleModel):
    id: Optional[int] = None
    name: str
    role: str = "neutral"
    race: str = ""
    npc_class: str = ""
    location: str = ""
    description: str = ""
    notes: str = ""
    status: str = "alive"


# Quests
class QuestObjectiveData(FlexibleModel):
    id: Optional[int] = None
    text: str
    completed: bool = False


class QuestData(FlexibleModel):
    id: Optional[int] = None
    title: str
    giver: str = ""
    description: str = ""
    status: str = "active"
    notes: str = ""
    objectives: list[QuestObjectiveData] = []


# Lore
class LoreNoteData(FlexibleModel):
    id: Optional[int] = None
    title: str
    category: str = ""
    body: str = ""
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
