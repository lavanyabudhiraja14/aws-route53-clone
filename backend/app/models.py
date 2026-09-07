import enum
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def _enum_values(enum_cls):
    return [member.value for member in enum_cls]


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class ZoneType(str, enum.Enum):
    PUBLIC = "Public"
    PRIVATE = "Private"


class RecordType(str, enum.Enum):
    A = "A"
    AAAA = "AAAA"
    CNAME = "CNAME"
    TXT = "TXT"
    MX = "MX"
    NS = "NS"
    PTR = "PTR"
    SRV = "SRV"
    CAA = "CAA"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    token: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True, index=True)


class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    type: Mapped[ZoneType] = mapped_column(
        Enum(ZoneType, values_callable=_enum_values, native_enum=False),
        nullable=False,
        default=ZoneType.PUBLIC,
    )
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    record_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        nullable=False,
    )

    records: Mapped[list["DnsRecord"]] = relationship(
        "DnsRecord",
        back_populates="hosted_zone",
        cascade="all, delete-orphan",
    )


class DnsRecord(Base):
    __tablename__ = "dns_records"
    __table_args__ = (
        UniqueConstraint(
            "hosted_zone_id",
            "name",
            "type",
            "value",
            name="uq_record_identity",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    hosted_zone_id: Mapped[int] = mapped_column(
        ForeignKey("hosted_zones.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    type: Mapped[RecordType] = mapped_column(
        Enum(RecordType, values_callable=_enum_values, native_enum=False),
        nullable=False,
    )
    ttl: Mapped[int] = mapped_column(Integer, nullable=False, default=300)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    routing_policy: Mapped[str] = mapped_column(String(64), nullable=False, default="Simple")

    hosted_zone: Mapped[HostedZone] = relationship("HostedZone", back_populates="records")
