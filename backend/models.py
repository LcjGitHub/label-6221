"""公告栏位置与历史快照 ORM 模型。"""

from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Position(Base):
    """公告栏位置。"""

    __tablename__ = "positions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    location: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    snapshots: Mapped[list["Snapshot"]] = relationship(
        "Snapshot", back_populates="position", cascade="all, delete-orphan"
    )


class Snapshot(Base):
    """公告栏历史快照记录。"""

    __tablename__ = "snapshots"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    position_id: Mapped[int] = mapped_column(
        ForeignKey("positions.id", ondelete="CASCADE"), nullable=False, index=True
    )
    record_date: Mapped[date] = mapped_column(Date, nullable=False)
    content_type: Mapped[str] = mapped_column(String(50), nullable=False)
    is_full_post: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    remark: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    position: Mapped["Position"] = relationship("Position", back_populates="snapshots")
