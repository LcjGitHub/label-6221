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
  inspector_name: string;
  created_at: string;
  position_name?: string;
}

import type { Dayjs } from 'dayjs';

/** 创建/编辑位置表单 */
export interface PositionFormValues {
  name: string;
  location: string;
}

/** 创建/编辑快照表单 */
export interface SnapshotFormValues {
  position_id: number;
  record_date: string | Dayjs;
  content_type: string;
  is_full_post: boolean;
  remark: string;
  inspector_name: string;
}

/** 内容类型选项 */
export const CONTENT_TYPES = ['通知', '活动', '物业', '其他'] as const;

/** 按内容类型分组的数量 */
export interface ContentTypeCount {
  content_type: string;
  count: number;
}

/** 数据统计概览 */
export interface StatsOverview {
  total_count: number;
  full_post_count: number;
  not_full_post_count: number;
  content_type_counts: ContentTypeCount[];
}

/** 快照筛选参数 */
export interface SnapshotFilterParams {
  content_type?: string;
  is_full_post?: boolean;
  record_date_start?: string;
  record_date_end?: string;
}
