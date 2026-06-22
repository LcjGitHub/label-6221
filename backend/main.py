"""社区公告栏历史快照 API 服务。"""

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import Base, engine, get_db
from seed import seed_data

Base.metadata.create_all(bind=engine)

app = FastAPI(title="社区公告栏历史快照 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3101", "http://127.0.0.1:3101"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    """启动时写入 seed 数据。"""
    db = next(get_db())
    try:
        seed_data(db)
    finally:
        db.close()


@app.get("/api/health")
def health() -> dict:
    """健康检查。"""
    return {"status": "ok"}


@app.get("/api/positions", response_model=list[schemas.PositionRead])
def list_positions(db: Session = Depends(get_db)) -> list[schemas.PositionRead]:
    """获取所有公告栏位置。"""
    positions = db.query(models.Position).order_by(models.Position.id).all()
    result: list[schemas.PositionRead] = []
    for pos in positions:
        item = schemas.PositionRead.model_validate(pos)
        item.snapshot_count = len(pos.snapshots)
        result.append(item)
    return result


@app.get("/api/positions/{position_id}", response_model=schemas.PositionRead)
def get_position(position_id: int, db: Session = Depends(get_db)) -> schemas.PositionRead:
    """获取单个位置。"""
    pos = db.get(models.Position, position_id)
    if not pos:
        raise HTTPException(status_code=404, detail="位置不存在")
    item = schemas.PositionRead.model_validate(pos)
    item.snapshot_count = len(pos.snapshots)
    return item


@app.get("/api/snapshots", response_model=list[schemas.SnapshotRead])
def list_snapshots(
    position_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[schemas.SnapshotRead]:
    """获取快照列表，可按位置筛选。"""
    query = db.query(models.Snapshot).join(models.Position)
    if position_id is not None:
        query = query.filter(models.Snapshot.position_id == position_id)
    snapshots = query.order_by(
        models.Snapshot.record_date.desc(), models.Snapshot.id.desc()
    ).all()
    return [_to_snapshot_read(item) for item in snapshots]


@app.get("/api/snapshots/{snapshot_id}", response_model=schemas.SnapshotRead)
def get_snapshot(snapshot_id: int, db: Session = Depends(get_db)) -> schemas.SnapshotRead:
    """获取单条快照。"""
    snapshot = db.get(models.Snapshot, snapshot_id)
    if not snapshot:
        raise HTTPException(status_code=404, detail="快照不存在")
    return _to_snapshot_read(snapshot)


@app.post("/api/snapshots", response_model=schemas.SnapshotRead, status_code=201)
def create_snapshot(
    payload: schemas.SnapshotCreate, db: Session = Depends(get_db)
) -> schemas.SnapshotRead:
    """创建快照。"""
    _ensure_position_exists(db, payload.position_id)
    snapshot = models.Snapshot(**payload.model_dump())
    db.add(snapshot)
    db.commit()
    db.refresh(snapshot)
    return _to_snapshot_read(snapshot)


@app.put("/api/snapshots/{snapshot_id}", response_model=schemas.SnapshotRead)
def update_snapshot(
    snapshot_id: int,
    payload: schemas.SnapshotUpdate,
    db: Session = Depends(get_db),
) -> schemas.SnapshotRead:
    """更新快照。"""
    snapshot = db.get(models.Snapshot, snapshot_id)
    if not snapshot:
        raise HTTPException(status_code=404, detail="快照不存在")

    data = payload.model_dump(exclude_unset=True)
    if "position_id" in data:
        _ensure_position_exists(db, data["position_id"])

    for key, value in data.items():
        setattr(snapshot, key, value)

    db.commit()
    db.refresh(snapshot)
    return _to_snapshot_read(snapshot)


@app.delete("/api/snapshots/{snapshot_id}", status_code=204)
def delete_snapshot(snapshot_id: int, db: Session = Depends(get_db)) -> None:
    """删除快照。"""
    snapshot = db.get(models.Snapshot, snapshot_id)
    if not snapshot:
        raise HTTPException(status_code=404, detail="快照不存在")
    db.delete(snapshot)
    db.commit()


def _ensure_position_exists(db: Session, position_id: int) -> None:
    """
     * 校验位置是否存在。
     * @param {Session} db
     * @param {int} position_id
     """
    if not db.get(models.Position, position_id):
        raise HTTPException(status_code=400, detail="位置不存在")


def _to_snapshot_read(snapshot: models.Snapshot) -> schemas.SnapshotRead:
    """
     * 将 ORM 转为带位置名称的响应模型。
     * @param {Snapshot} snapshot
     * @returns {SnapshotRead}
     """
    item = schemas.SnapshotRead.model_validate(snapshot)
    if snapshot.position:
        item.position_name = snapshot.position.name
    return item
