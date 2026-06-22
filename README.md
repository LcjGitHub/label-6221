# 社区公告栏历史快照

MVP：公告栏位置列表 + 快照记录页（CRUD）。  
技术栈：React + Ant Design（前端 3101）| FastAPI + SQLite（后端 3000）。

## 目录结构

```
├── backend/          # FastAPI 后端
│   ├── data/         # SQLite 数据库（运行时生成 bulletin.db）
│   ├── main.py
│   └── requirements.txt
└── frontend/         # React 前端
    ├── src/
    └── package.json
```

## 启动方式

### 1. 后端（端口 3000）

在项目根目录执行：

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 3000
```

一条命令等价写法（已创建虚拟环境后）：

```bash
cd backend && .venv\Scripts\python -m uvicorn main:app --reload --host 0.0.0.0 --port 3000
```

API 文档：http://localhost:3000/docs

### 2. 前端（端口 3101）

新开终端，在项目根目录执行：

```bash
cd frontend
npm install
npm run dev
```

浏览器访问：http://localhost:3101

## 功能说明

| 页面 | 说明 |
|------|------|
| 位置列表 | 展示 2 个公告栏位置及快照数量，点击进入快照页 |
| 快照记录 | 按位置查看历史快照，支持新增 / 编辑 / 删除 |

### 快照字段

- **位置**：所属公告栏
- **记录日期**：快照日期
- **内容类型**：通知 / 活动 / 物业 / 其他
- **是否满贴**：公告栏是否已贴满
- **备注**：补充说明

## Seed 数据

首次启动后端自动写入：

- 东门公告栏 — 3 条快照
- 活动中心公告栏 — 3 条快照

## 依赖说明

- 后端依赖安装在 `backend/.venv` 内，不依赖全局 Python 包
- 前端依赖安装在 `frontend/node_modules`，使用 **npm**（无需全局 pnpm/yarn）
