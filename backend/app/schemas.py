from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models import RecordType, ZoneType


class MessageResponse(BaseModel):
    detail: str


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=64)
    password: str = Field(min_length=1, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str


class HostedZoneCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    type: ZoneType = ZoneType.PUBLIC
    comment: str | None = None


class HostedZoneUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    type: ZoneType | None = None
    comment: str | None = None


class HostedZoneOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    type: ZoneType
    comment: str | None
    record_count: int
    created_at: datetime


class DnsRecordCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    type: RecordType
    ttl: int = Field(default=300, ge=0, le=2147483647)
    value: str = Field(min_length=1)
    routing_policy: str = Field(default="Simple", max_length=64)


class DnsRecordUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    type: RecordType | None = None
    ttl: int | None = Field(default=None, ge=0, le=2147483647)
    value: str | None = Field(default=None, min_length=1)
    routing_policy: str | None = Field(default=None, max_length=64)

class BulkDeleteRecordsRequest(BaseModel):
    record_ids: list[int] = Field(min_length=1)


class DnsRecordOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    hosted_zone_id: int
    name: str
    type: RecordType
    ttl: int
    value: str
    routing_policy: str
