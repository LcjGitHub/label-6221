"""Pydantic 请求/响应模型。"""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class PositionBase(BaseModel):
    """位置基础字段。"""

    name: str = Field(..., min_length=1, max_length=100)
    location: str = Field(default="", max_length=200)


class PositionCreate(PositionBase):
    """创建位置。"""


class PositionRead(PositionBase):
    """位置详情。"""

    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    snapshot_count: int = 0


class SnapshotBase(BaseModel):
    """快照基础字段。"""

    position_id: int
    record_date: date
    content_type: str = Field(..., min_length=1, max_length=50)
    is_full_post: bool = False
    remark: str = ""


class SnapshotCreate(SnapshotBase):
    """创建快照。"""


class SnapshotUpdate(BaseModel):
    """更新快照（全部可选）。"""

    position_id: int | None = None
    record_date: date | None = None
    content_type: str | None = Field(default=None, min_length=1, max_length=50)
    is_full_post: bool | None = None
    remark: str | None = None


class SnapshotRead(SnapshotBase):
    """快照详情。"""

    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    position_name: str | None = None
