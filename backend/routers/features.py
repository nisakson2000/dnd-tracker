from fastapi import APIRouter, HTTPException

from backend.database import get_session
from backend.models.all_models import Feature
from backend.schemas.all_schemas import FeatureData

router = APIRouter(prefix="/characters/{character_id}/features", tags=["features"])


@router.get("", response_model=list[FeatureData])
def get_features(character_id: str):
    session = get_session(character_id)
    try:
        features = session.query(Feature).all()
        return [FeatureData.model_validate(f) for f in features]
    finally:
        session.close()


@router.post("", response_model=FeatureData, status_code=201)
def add_feature(character_id: str, data: FeatureData):
    session = get_session(character_id)
    try:
        feature = Feature(**data.model_dump(exclude={"id"}))
        session.add(feature)
        session.commit()
        session.refresh(feature)
        return FeatureData.model_validate(feature)
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.put("/{feature_id}", response_model=FeatureData)
def update_feature(character_id: str, feature_id: int, data: FeatureData):
    session = get_session(character_id)
    try:
        feature = session.query(Feature).get(feature_id)
        if not feature:
            raise HTTPException(status_code=404, detail="Feature not found")
        for field, value in data.model_dump(exclude={"id"}).items():
            setattr(feature, field, value)
        session.commit()
        session.refresh(feature)
        return FeatureData.model_validate(feature)
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@router.delete("/{feature_id}")
def delete_feature(character_id: str, feature_id: int):
    session = get_session(character_id)
    try:
        feature = session.query(Feature).get(feature_id)
        if not feature:
            raise HTTPException(status_code=404, detail="Feature not found")
        session.delete(feature)
        session.commit()
        return {"status": "deleted"}
    except HTTPException:
        raise
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
