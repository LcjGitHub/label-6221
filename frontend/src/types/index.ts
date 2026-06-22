/** 公告栏位置 */
export interface Position {
  id: number;
  name: string;
  location: string;
  created_at: string;
  snapshot_count: number;
}

/** 历史快照记录 */
export interface Snapshot {
  id: number;
  position_id: number;
  record_date: string;
  content_type: string;
  is_full_post: boolean;
  remark: string;
  created_at: string;
  position_name?: string;
}

import type { Dayjs } from 'dayjs';

/** 创建/编辑快照表单 */
export interface SnapshotFormValues {
  position_id: number;
  record_date: string | Dayjs;
  content_type: string;
  is_full_post: boolean;
  remark: string;
}

/** 内容类型选项 */
export const CONTENT_TYPES = ['通知', '活动', '物业', '其他'] as const;
