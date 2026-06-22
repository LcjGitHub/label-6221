"""初始化示例数据：2 个位置，各 3 条快照。"""

from datetime import date

from sqlalchemy.orm import Session

from models import Position, Snapshot


def seed_data(db: Session) -> None:
    """
     * 若尚无位置数据则写入 seed。
     * @param {Session} db - 数据库 Session
     """
    if db.query(Position).count() > 0:
        return

    positions = [
        Position(name="东门公告栏", location="社区东门入口左侧"),
        Position(name="活动中心公告栏", location="社区活动中心一楼大厅"),
    ]
    db.add_all(positions)
    db.flush()

    snapshots = [
        Snapshot(
            position_id=positions[0].id,
            record_date=date(2025, 6, 1),
            content_type="通知",
            is_full_post=True,
            remark="端午节放假安排已贴满",
        ),
        Snapshot(
            position_id=positions[0].id,
            record_date=date(2025, 6, 10),
            content_type="活动",
            is_full_post=False,
            remark="亲子运动会海报，尚有空位",
        ),
        Snapshot(
            position_id=positions[0].id,
            record_date=date(2025, 6, 18),
            content_type="物业",
            is_full_post=True,
            remark="停水通知与缴费提醒",
        ),
        Snapshot(
            position_id=positions[1].id,
            record_date=date(2025, 6, 5),
            content_type="通知",
            is_full_post=False,
            remark="垃圾分类宣传",
        ),
        Snapshot(
            position_id=positions[1].id,
            record_date=date(2025, 6, 12),
            content_type="活动",
            is_full_post=True,
            remark="社区读书会报名已满",
        ),
        Snapshot(
            position_id=positions[1].id,
            record_date=date(2025, 6, 20),
            content_type="其他",
            is_full_post=False,
            remark="志愿者招募启事",
        ),
    ]
    db.add_all(snapshots)
    db.commit()
