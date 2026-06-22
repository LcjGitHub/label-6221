"""SQLite 数据库连接与 Session 管理。"""

from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_URL = f"sqlite:///{DATA_DIR / 'bulletin.db'}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """SQLAlchemy 声明基类。"""


def get_db():
    """
     * 提供 FastAPI 依赖的数据库 Session。
     * @yields {Session} SQLAlchemy Session
     """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
