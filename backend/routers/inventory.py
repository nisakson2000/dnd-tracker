from fastapi import APIRouter, HTTPException

from backend.database import get_session
from backend.models.all_models import Item, Currency
from backend.schemas.all_schemas import ItemData, CurrencyData

router = APIRouter(prefix="/characters/{character_id}/inventory", tags=["inventory"])


@router.get("/items", response_model=list[ItemData])
def get_items(character_id: str):
    session = get_session(character_id)
    try:
        items = session.query(Item).all()
        return [ItemData.model_validate(i) for i in items]
    finally:
        session.close()


@router.post("/items", response_model=ItemData, status_code=201)
def add_item(character_id: str, data: ItemData):
    session = get_session(character_id)
    try:
        item = Item(**data.model_dump(exclude={"id"}))
        session.add(item)
        session.commit()
        session.refresh(item)
        return ItemData.model_validate(item)
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("/items/{item_id}", response_model=ItemData)
def update_item(character_id: str, item_id: int, data: ItemData):
    session = get_session(character_id)
    try:
        item = session.query(Item).get(item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        for field, value in data.model_dump(exclude={"id"}).items():
            setattr(item, field, value)
        session.commit()
        session.refresh(item)
        return ItemData.model_validate(item)
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.delete("/items/{item_id}")
def delete_item(character_id: str, item_id: int):
    session = get_session(character_id)
    try:
        item = session.query(Item).get(item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        session.delete(item)
        session.commit()
        return {"status": "deleted"}
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# Currency
@router.get("/currency", response_model=CurrencyData)
def get_currency(character_id: str):
    session = get_session(character_id)
    try:
        c = session.query(Currency).first()
        if not c:
            c = Currency(id=1)
            session.add(c)
            session.commit()
            session.refresh(c)
        return CurrencyData.model_validate(c)
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("/currency")
def update_currency(character_id: str, data: CurrencyData):
    session = get_session(character_id)
    try:
        c = session.query(Currency).first()
        if not c:
            c = Currency(id=1)
            session.add(c)
            session.flush()
        for field, value in data.model_dump().items():
            setattr(c, field, value)
        session.commit()
        return {"status": "saved"}
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
