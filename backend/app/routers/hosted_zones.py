from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import HostedZone
from app.schemas import HostedZoneCreate, HostedZoneOut, HostedZoneUpdate, MessageResponse

router = APIRouter(
    prefix="/hosted-zones",
    tags=["Hosted Zones"],
    dependencies=[Depends(get_current_user)],
)


def get_zone_or_404(db: Session, zone_id: int) -> HostedZone:
    zone = db.get(HostedZone, zone_id)
    if zone is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hosted zone not found")
    return zone


@router.get("", response_model=list[HostedZoneOut])
def list_hosted_zones(
    search: str | None = Query(default=None, description="Filter by zone name"),
    db: Session = Depends(get_db),
):
    stmt = select(HostedZone).order_by(HostedZone.created_at.desc())
    if search:
        stmt = stmt.where(HostedZone.name.ilike(f"%{search}%"))
    return db.scalars(stmt).all()


@router.get("/{zone_id}", response_model=HostedZoneOut)
def get_hosted_zone(zone_id: int, db: Session = Depends(get_db)):
    return get_zone_or_404(db, zone_id)


@router.post("", response_model=HostedZoneOut, status_code=status.HTTP_201_CREATED)
def create_hosted_zone(payload: HostedZoneCreate, db: Session = Depends(get_db)):
    zone = HostedZone(
        name=payload.name.strip(),
        type=payload.type,
        comment=payload.comment,
        record_count=0,
    )
    db.add(zone)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A hosted zone with this name already exists",
        )
    db.refresh(zone)
    return zone


@router.put("/{zone_id}", response_model=HostedZoneOut)
def update_hosted_zone(
    zone_id: int,
    payload: HostedZoneUpdate,
    db: Session = Depends(get_db),
):
    zone = get_zone_or_404(db, zone_id)
    data = payload.model_dump(exclude_unset=True)
    if "name" in data and data["name"] is not None:
        data["name"] = data["name"].strip()
    for field, value in data.items():
        setattr(zone, field, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A hosted zone with this name already exists",
        )
    db.refresh(zone)
    return zone


@router.delete("/{zone_id}", response_model=MessageResponse)
def delete_hosted_zone(zone_id: int, db: Session = Depends(get_db)):
    zone = get_zone_or_404(db, zone_id)
    db.delete(zone)
    db.commit()
    return MessageResponse(detail="Hosted zone deleted")
