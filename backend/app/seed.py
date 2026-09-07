from sqlalchemy.orm import Session

from app.auth import hash_password
from app.models import User

DEFAULT_USERNAME = "admin"
DEFAULT_PASSWORD = "admin123"


def seed_default_user(db: Session) -> None:
    existing = db.query(User).filter(User.username == DEFAULT_USERNAME).first()
    if existing is None:
        db.add(
            User(
                username=DEFAULT_USERNAME,
                password_hash=hash_password(DEFAULT_PASSWORD),
            )
        )
        db.commit()
