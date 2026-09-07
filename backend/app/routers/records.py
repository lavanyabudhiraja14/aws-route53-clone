from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import String, cast, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import DnsRecord, HostedZone
from app.routers.hosted_zones import get_zone_or_404
from app.schemas import DnsRecordCreate, DnsRecordOut, DnsRecordUpdate, MessageResponse

router = APIRouter(
    prefix="/hosted-zones/{zone_id}/records",
    tags=["DNS Records"],
    dependencies=[Depends(get_current_user)],
)


def get_record_or_404(db: Session, zone: HostedZone, record_id: int) -> DnsRecord:
    record = db.get(DnsRecord, record_id)
    if record is None or record.hosted_zone_id != zone.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="DNS record not found")
    return record


def sync_record_count(db: Session, zone: HostedZone) -> None:
    zone.record_count = (
        db.query(DnsRecord).filter(DnsRecord.hosted_zone_id == zone.id).count()
    )


@router.get("", response_model=list[DnsRecordOut])
def list_records(
    zone_id: int,
    search: str | None = Query(default=None, description="Filter by record name, type, or value"),
    db: Session = Depends(get_db),
):
    zone = get_zone_or_404(db, zone_id)
    stmt = select(DnsRecord).where(DnsRecord.hosted_zone_id == zone.id).order_by(DnsRecord.id)
    if search:
        term = f"%{search}%"
        stmt = stmt.where(
            or_(
                DnsRecord.name.ilike(term),
                DnsRecord.value.ilike(term),
                cast(DnsRecord.type, String).ilike(term),
            )
        )
    return db.scalars(stmt).all()


@router.get("/{record_id}", response_model=DnsRecordOut)
def get_record(zone_id: int, record_id: int, db: Session = Depends(get_db)):
    zone = get_zone_or_404(db, zone_id)
    return get_record_or_404(db, zone, record_id)


@router.post("", response_model=DnsRecordOut, status_code=status.HTTP_201_CREATED)
def create_record(
    zone_id: int,
    payload: DnsRecordCreate,
    db: Session = Depends(get_db),
):
    zone = get_zone_or_404(db, zone_id)
    record = DnsRecord(
        hosted_zone_id=zone.id,
        name=payload.name.strip(),
        type=payload.type,
        ttl=payload.ttl,
        value=payload.value.strip(),
        routing_policy=payload.routing_policy,
    )
    db.add(record)
    try:
        db.flush()
        sync_record_count(db, zone)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An identical DNS record already exists in this hosted zone",
        )
    db.refresh(record)
    return record


@router.put("/{record_id}", response_model=DnsRecordOut)
def update_record(
    zone_id: int,
    record_id: int,
    payload: DnsRecordUpdate,
    db: Session = Depends(get_db),
):
    zone = get_zone_or_404(db, zone_id)
    record = get_record_or_404(db, zone, record_id)
    data = payload.model_dump(exclude_unset=True)
    for key in ("name", "value"):
        if key in data and data[key] is not None:
            data[key] = data[key].strip()
    for field, value in data.items():
        setattr(record, field, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An identical DNS record already exists in this hosted zone",
        )
    db.refresh(record)
    return record


@router.delete("/{record_id}", response_model=MessageResponse)
def delete_record(zone_id: int, record_id: int, db: Session = Depends(get_db)):
    zone = get_zone_or_404(db, zone_id)
    record = get_record_or_404(db, zone, record_id)
    db.delete(record)
    db.flush()
    sync_record_count(db, zone)
    db.commit()
    return MessageResponse(detail="DNS record deleted")
