# CLAUDE.md — Workbook 專案規則手冊

> 每次修改功能或新增規則後，必須同步更新本檔案與 README.md。
> 這條規則本身也記錄在此，請每次作業結束前確認兩份文件是否反映最新狀態。

---

## 專案概覽

| 項目 | 說明 |
|------|------|
| 框架 | React 18 + Vite |
| 樣式 | Tailwind CSS + 手寫 CSS（plan-practice.css） |
| UI 元件 | MUI Icons |
| 後端 | Firebase（Auth + Firestore） |
| 路由 | React Router DOM，basename `/workBooks` |
| 部署 | GitHub Pages（`npm run deploy` via gh-pages） |

---

## 環境變數（.env）

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_ALLOWED_AUTH_UID=...   ← 白名單 UID，只有這個帳號能登入
```

---

## 路由結構

```
/frontend-practice              → OverviewPage（卡片總覽）
/frontend-practice/dive-plan    → DivePlanPage（前端成長計畫）
/frontend-practice/[其他課題]   → 未來新增的課題頁面
```

所有路由都包在 `AdminLayout` 裡（側邊欄 + 頂部 Header）。

---

## 側邊欄行為規則

- 路由 **不包含** `/frontend-practice/` 子路徑：顯示一般導航（`NAV_SECTIONS`）
- 路由 **包含** `/frontend-practice/` 子路徑：切換為 `CourseSidebar`，顯示「卡片進度總覽」

`CourseSidebar` 位於 `src/components/AdminLayout.jsx`，偵測邏輯：
```js
const insideCourse = location.pathname.startsWith('/frontend-practice/')
```

---

## 卡片（課題）系統規則

### 新增一張課題卡片的步驟

1. **在 `src/pages/OverviewPage.jsx` 的 `COURSES` 陣列新增一筆**：
```js
{
  id: 'unique-id',
  title: '課題名稱',
  subtitle: '副標題',
  desc: '說明文字',
  tags: ['tag1', 'tag2'],
  getProgress: 自訂進度函數或 null,
  path: '/frontend-practice/unique-id',
}
```

2. **建立對應頁面** `src/pages/YourCoursePage.jsx`

3. **在 `src/App.jsx` 新增路由**：
```jsx
<Route path="/frontend-practice/unique-id" element={<YourCoursePage />} />
```

4. **如果有進度追蹤**，在 `AdminLayout.jsx` 的 `CourseSidebar` 裡加上對應的進度區塊

---

## 前端習題課題（dive-plan）規則

### 檔案位置
```
src/pages/DivePlanPage.jsx     ← Tab 容器（麵包屑 + 成長計畫/練習題庫 tab）
src/pages/PlanPage.jsx         ← 成長計畫頁（海洋主題，scroll 動畫）
src/pages/PracticePage.jsx     ← 練習題庫頁
src/data/questions.js          ← 題目資料（DATA 陣列）
src/plan-practice.css          ← 此課題專用樣式
```

### 題目資料結構（questions.js）
```js
DATA = [{ m: 1, w: 1, d: 1, t: '觀念題'|'程式題'|'任務題', q: '題目HTML', a: '答案HTML' }]
MONTH_NAMES = { 1: '...', ... }
DAY_NAMES = { 1: '週一', ... }
```

### 進度追蹤（localStorage）
- 鍵值格式：`done_m{m}w{w}d{d}`，值為 `'1'`（完成）或 `'0'`/`null`（未完成）
- 計畫開始日：`dive_start`（日期字串）
- 當前月份：`dive_month`（數字字串）

### PlanPage scroll 動畫
- PlanPage 接收 `scrollEl` prop（`useRef`），用於監聽容器 scroll 而非 `window`
- DivePlanPage 把 `scrollRef` 傳給 PlanPage：`<PlanPage scrollEl={scrollRef} />`
- 背景、氣泡等元素使用 `position: absolute`（不是 fixed），限制在容器內

### CSS 作用域
- `.plan-page`、`.practice-page` 已有完整作用域，不會污染全域
- 全域可能衝突的樣式已移除（不使用 `body`、`button` 等全域選擇器在此 CSS 中）

---

## CourseSidebar 進度顯示（AdminLayout）

目前 `CourseSidebar` 硬綁定顯示「前端習題」的 6 個月進度（`MONTHS` 陣列）。

**新增其他領域課題時**，若該課題也需要側邊欄進度，需要：
1. 擴充 `CourseSidebar` 支援依路由顯示不同進度內容
2. 或改為在 `CourseSidebar` 接收 `pathname` 判斷要顯示哪個課題的進度

---

## 部署

```bash
npm run deploy    # build + push to gh-pages branch
```

`package.json` 中的 scripts：
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

`vite.config.js` 需設定 `base: '/workBooks/'`（已設定）。

---

## 同步規則

**任何以下情況發生後，必須更新 CLAUDE.md 和 README.md：**
- 新增課題卡片
- 新增或修改路由
- 修改側邊欄行為
- 修改進度追蹤機制
- 修改 localStorage 鍵值格式
- 新增環境變數
- 修改部署流程
- 建立新的共用元件

更新順序：先改程式碼 → 確認功能正常 → 更新 CLAUDE.md → 更新 README.md
