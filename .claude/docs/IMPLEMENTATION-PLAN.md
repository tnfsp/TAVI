# 實作計畫 (Implementation Plan)

> 由 `/pm` 維護

---

## 專案資訊

- **專案名稱**: TAVI 健保申請輔助系統
- **PRD 版本**: v0.1
- **TECHSTACK 版本**: v0.1
- **計畫建立日期**: 2025-12-14
- **最後更新**: 2025-12-14
- **預估開發時間**: 4-6 週

---

## 開發策略

### 核心原則
1. **MVP 優先**: 先實現最小可行產品，驗證核心價值
2. **迭代開發**: 每個 Phase 完成後即可測試，快速迭代
3. **用戶驗證**: 每個階段完成後請護理師試用，收集反饋
4. **品質優先**: 醫療系統需要高準確度，寧可慢但正確

### 技術重點
- **Next.js 15 App Router**: 檔案系統路由，結構清晰
- **Claude Vision API**: AI 數據提取的核心
- **LocalStorage**: 隱私優先，無需後端資料庫
- **Vercel 部署**: 零配置，自動 CI/CD

---

## 階段規劃

### Phase 0: 專案初始化 (預估 2-3 天)

#### 0.1 開發環境設定
- [ ] 安裝 Node.js 20.x LTS
- [ ] 安裝 pnpm 8.x
- [ ] 確認 Git 設定正確
- [ ] 取得 Claude API Key（需向 Anthropic 申請）

#### 0.2 Next.js 專案建立
- [ ] 執行 `npx create-next-app@latest tavi-app --typescript --tailwind --app`
- [ ] 安裝核心依賴：
  ```bash
  pnpm add @anthropic-ai/sdk react-hook-form zod zustand
  pnpm add docx browser-image-compression
  pnpm add -D @types/node
  ```
- [ ] 設定 Shadcn/ui：
  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button input label checkbox select textarea
  ```

#### 0.3 專案結構建立
- [ ] 建立目錄結構：
  ```
  app/
  ├── page.tsx              (首頁：案例列表)
  ├── new/page.tsx          (新增案例)
  ├── case/[id]/page.tsx    (編輯案例)
  ├── api/ai/               (AI API Routes)
  components/
  ├── ui/                   (Shadcn components)
  ├── forms/                (表單組件)
  ├── upload/               (上傳組件)
  lib/
  ├── ai/                   (Claude API 封裝)
  ├── storage/              (LocalStorage 封裝)
  ├── utils.ts
  types/
  ├── case.ts
  ├── patient.ts
  store/
  └── case-store.ts
  ```

#### 0.4 環境變數設定
- [ ] 建立 `.env.local`：
  ```env
  ANTHROPIC_API_KEY=sk-xxx
  NEXT_PUBLIC_APP_VERSION=0.1.0
  ```
- [ ] 更新 `.gitignore` 確保不 commit API Key

#### 0.5 Git 設定
- [ ] 建立 `.gitignore`（確保 `.env.local` 被忽略）
- [ ] 初始 commit: `git commit -m "feat: 初始化 Next.js 專案結構"`

**完成標準**: 可執行 `pnpm dev` 並看到 Next.js 歡迎頁面

---

### Phase 1: 基礎功能 - 資料輸入 (預估 1 週)

#### 1.1 TypeScript 型別定義
- [ ] 建立 `types/patient.ts`：定義 Patient interface
- [ ] 建立 `types/examination.ts`：定義檢查報告資料結構
- [ ] 建立 `types/case.ts`：定義完整案例資料結構

#### 1.2 病患基本資料表單 (PRD 功能 #1)
- [ ] 建立 `components/forms/PatientInfoForm.tsx`
- [ ] 使用 React Hook Form + Zod 驗證
- [ ] 欄位：
  - 姓名（必填，2-10 字）
  - 病歷號（必填，數字）
  - 性別（單選：男/女）
  - 出生日期（日期選擇器，自動計算年齡）
  - 身分證號（選填，格式驗證）
- [ ] 即時顯示年齡計算結果

#### 1.3 病史選擇系統 (PRD 功能 #2)
- [ ] 建立 `components/forms/MedicalHistoryForm.tsx`
- [ ] 9 個常見病史 Checkbox（可複選）
- [ ] 「其他病史」自訂輸入框
- [ ] 資料結構：`string[]`

#### 1.4 症狀選擇系統 (PRD 功能 #3)
- [ ] 建立 `components/forms/SymptomsForm.tsx`
- [ ] 8 個常見症狀 Checkbox（可複選）
- [ ] 「症狀發生時間」輸入框（例如「近 3 個月」）
- [ ] 「其他症狀」自訂輸入框

#### 1.5 就醫歷程輸入 (PRD 功能 #4)
- [ ] 建立 `components/forms/ClinicalCourseForm.tsx`
- [ ] 原追蹤地點輸入框
- [ ] 症狀惡化與轉診原因輸入框（Textarea）

#### 1.6 LocalStorage 封裝
- [ ] 建立 `lib/storage/case-storage.ts`
- [ ] 實作 CRUD 功能：
  - `saveDraft(caseData)`: 儲存草稿
  - `loadCase(caseId)`: 載入案例
  - `listCases()`: 列出所有案例
  - `deleteCase(caseId)`: 刪除案例

#### 1.7 案例列表頁面 (首頁)
- [ ] 建立 `app/page.tsx`
- [ ] 顯示所有歷史案例（從 LocalStorage 讀取）
- [ ] 顯示欄位：姓名、病歷號、日期、狀態
- [ ] 搜尋功能（姓名、病歷號）
- [ ] 「新增案例」按鈕

#### 1.8 新增案例頁面
- [ ] 建立 `app/new/page.tsx`
- [ ] 整合上述 4 個表單組件（步驟式 Wizard）
- [ ] 步驟導航：基本資料 → 病史 → 症狀 → 就醫歷程
- [ ] 自動儲存草稿（每步驟完成後）
- [ ] 「上一步」「下一步」按鈕

**完成標準**: 可新增案例並輸入所有基本資料，資料正確存入 LocalStorage

---

### Phase 2: AI 功能 - 圖片上傳與數據提取 (預估 1.5 週)

#### 2.1 Claude API 封裝
- [ ] 建立 `lib/ai/claude.ts`
- [ ] 封裝 Claude SDK 初始化
- [ ] 實作 `extractDataFromImage(base64Image, examType)` 函數
- [ ] 錯誤處理與 retry 機制

#### 2.2 AI Prompt 設計
- [ ] 建立 `lib/ai/prompts.ts`
- [ ] 撰寫「心臟超音波數據提取」Prompt
  - 需提取：AVA, Vmax, Peak PG, Mean PG, LVEF
  - 要求 JSON 格式輸出
  - 包含信心度評分
- [ ] 撰寫「心導管檢查數據提取」Prompt
- [ ] 撰寫「日期識別」Prompt

#### 2.3 圖片上傳組件
- [ ] 建立 `components/upload/ImageUploader.tsx`
- [ ] 支援 PNG, JPG, JPEG 格式
- [ ] 拖曳上傳功能
- [ ] 圖片預覽
- [ ] 壓縮功能（單張 < 2MB）
- [ ] 多張圖片管理

#### 2.4 API Route - 數據提取
- [ ] 建立 `app/api/ai/extract-data/route.ts`
- [ ] 接收 base64 圖片 + 報告類型
- [ ] 呼叫 Claude API
- [ ] 回傳提取的數據 + 信心度
- [ ] 錯誤處理

#### 2.5 API Route - 日期識別
- [ ] 建立 `app/api/ai/detect-date/route.ts`
- [ ] 接收圖片，識別檢查日期
- [ ] 回傳日期字串 + 信心度

#### 2.6 檢查報告上傳頁面
- [ ] 在 `app/new/page.tsx` 新增「檢查報告」步驟
- [ ] 報告類型選擇：
  - 心臟超音波
  - 心導管
  - EKG
  - Chest X-ray
  - 肺功能
  - 檢驗報告
  - STS Score
  - 其他
- [ ] 每種報告可上傳多張截圖
- [ ] 上傳後自動呼叫 AI 提取數據

#### 2.7 數據確認與編輯介面
- [ ] 建立 `components/forms/ExaminationDataTable.tsx`
- [ ] 以表格顯示提取的數據
- [ ] 顯示 AI 信心度指示（高/中/低）
- [ ] 允許手動修改數據
- [ ] 手動補充未提取到的數據

**完成標準**: 可上傳檢查報告截圖，AI 自動提取數據並顯示，護理師可確認/修改

---

### Phase 3: 文件生成功能 (預估 1 週)

#### 3.1 手術風險評估表單 (PRD 功能 #6)
- [ ] 建立 `components/forms/RiskAssessmentForm.tsx`
- [ ] STS Score 輸入（可手動輸入或從截圖提取）
- [ ] 二位心臟外科醫師姓名輸入
- [ ] 自動判斷 STS Score > 10% 顯示警示

#### 3.2 日常生活評估表單 (PRD 功能 #7)
- [ ] 建立 `components/forms/FunctionalStatusForm.tsx`
- [ ] 單選：可自理 / 需家人協助 / 需他人照護
- [ ] 存活機率評估（預設「至少一年以上」，可編輯）

#### 3.3 文件生成邏輯
- [ ] 建立 `lib/docx/generate-application.ts`
- [ ] 實作 `generateDocument(caseData)` 函數
- [ ] 根據 PRD 範例結構生成文字內容：
  1. 標題：TAVI 事前審查
  2. 病患基本資料摘要（一行）
  3. 病情發展敘述（時間序列）
  4. 各項檢查報告（含數據）
  5. 手術風險評估
  6. 日常生活評估
  7. 結論與申請理由

#### 3.4 Claude API - 文件生成
- [ ] 建立 `app/api/ai/generate-document/route.ts`
- [ ] 撰寫「文件生成」Prompt
- [ ] 提供真實案例作為範本
- [ ] 接收結構化資料，生成醫學文件
- [ ] 確保醫學術語正確、時間序列合理

#### 3.5 文件編輯器
- [ ] 安裝 Tiptap: `pnpm add @tiptap/react @tiptap/starter-kit`
- [ ] 建立 `components/editor/DocumentEditor.tsx`
- [ ] WYSIWYG 編輯器
- [ ] 工具列：粗體、斜體、標題、列表
- [ ] 即時預覽

#### 3.6 文件預覽與編輯頁面
- [ ] 在 `app/new/page.tsx` 新增「文件預覽」步驟
- [ ] 顯示 AI 生成的文件
- [ ] 允許編輯任何內容
- [ ] 自動儲存編輯內容

**完成標準**: 可生成完整的申請文件，內容符合健保局格式，護理師可編輯

---

### Phase 4: Word 匯出功能 (預估 3 天)

#### 4.1 Word 文件生成
- [ ] 建立 `lib/docx/export-word.ts`
- [ ] 使用 docx.js 生成 .docx 檔案
- [ ] 設定格式：
  - 字型：標楷體 / Times New Roman
  - 標題：18pt 粗體
  - 內文：12pt
  - 行距：1.5
- [ ] 自動分頁、頁碼

#### 4.2 匯出功能實作
- [ ] 在預覽頁面新增「匯出 Word」按鈕
- [ ] 檔名自動命名：`事前審查-[姓名][病歷號].docx`
- [ ] 點擊下載檔案
- [ ] 載入狀態提示

#### 4.3 匯出格式驗證
- [ ] 匯出測試案例（使用真實資料）
- [ ] 檢查格式是否符合健保局要求
- [ ] 檢查數據是否正確無誤

**完成標準**: 可匯出格式正確的 Word 檔案，打開可正常編輯

---

### Phase 5: 歷史案例管理 (預估 3 天)

#### 5.1 案例列表優化
- [ ] 在首頁顯示案例卡片
- [ ] 顯示：病患姓名、病歷號、建立日期、最後編輯時間
- [ ] 狀態標籤：草稿 / 已完成
- [ ] 點擊進入編輯頁面

#### 5.2 搜尋與篩選功能
- [ ] 搜尋框（姓名、病歷號）
- [ ] 篩選：依日期範圍
- [ ] 排序：最新優先 / 最舊優先

#### 5.3 編輯現有案例
- [ ] 建立 `app/case/[id]/page.tsx`
- [ ] 載入現有案例資料
- [ ] 允許修改所有欄位
- [ ] 自動儲存變更
- [ ] 「重新生成文件」按鈕

#### 5.4 刪除功能
- [ ] 案例卡片新增刪除按鈕
- [ ] 確認對話框
- [ ] 從 LocalStorage 刪除

**完成標準**: 可管理所有歷史案例，可搜尋、編輯、刪除

---

### Phase 6: UI/UX 優化 (預估 3 天)

#### 6.1 載入狀態
- [ ] AI 提取數據時顯示 Loading
- [ ] 文件生成時顯示進度
- [ ] Skeleton UI

#### 6.2 錯誤處理
- [ ] API 錯誤提示（友善的中文訊息）
- [ ] 表單驗證錯誤提示
- [ ] 網路斷線提示

#### 6.3 操作指引
- [ ] 每個步驟新增簡短說明文字
- [ ] 首次使用教學（可跳過）
- [ ] 工具提示（Tooltip）

#### 6.4 響應式設計
- [ ] 確保在 1366x768 螢幕正常顯示
- [ ] 優化大螢幕體驗（1920x1080）
- [ ] 字體大小適當（考量年長用戶）

#### 6.5 鍵盤支援
- [ ] Tab 鍵切換欄位
- [ ] Enter 送出表單
- [ ] ESC 關閉對話框

**完成標準**: 介面流暢易用，60 歲使用者無需教學即可上手

---

### Phase 7: 測試與部署 (預估 3-4 天)

#### 7.1 功能測試
- [ ] 測試完整流程（新增 → 上傳 → 生成 → 匯出）
- [ ] 測試編輯現有案例
- [ ] 測試刪除功能
- [ ] 測試搜尋功能

#### 7.2 AI 準確度測試
- [ ] 使用 10 份真實報告截圖測試
- [ ] 記錄數據提取準確度
- [ ] 優化 Prompt（如準確度 < 90%）

#### 7.3 跨瀏覽器測試
- [ ] Chrome (主要)
- [ ] Edge
- [ ] Firefox

#### 7.4 效能測試
- [ ] 測試頁面載入速度
- [ ] 測試 AI 回應時間
- [ ] 測試 LocalStorage 容量（儲存 50 個案例）

#### 7.5 Vercel 部署
- [ ] 建立 Vercel 帳號
- [ ] 連接 GitHub repository
- [ ] 設定環境變數（ANTHROPIC_API_KEY）
- [ ] 部署測試環境
- [ ] 測試正式環境

#### 7.6 使用者測試
- [ ] 邀請護理師試用
- [ ] 記錄使用過程中的問題
- [ ] 收集反饋意見
- [ ] 修正問題

**完成標準**: 所有功能正常，AI 準確度 > 90%，部署成功

---

## Subagent 分配

| Subagent | 負責階段/任務 | 建立狀態 | 啟動指令 |
|----------|---------------|---------|---------|
| `/frontend-dev` | Phase 1, 3, 5, 6 (前端開發) | 待建立 | `/frontend-dev` |
| `/backend-dev` | Phase 0, 2, 4 (API & 整合) | 待建立 | `/backend-dev` |
| `/ai-engineer` | Phase 2 (Prompt 優化) | 待建立 | `/ai-engineer` |
| `/tester` | Phase 7 (測試) | 可選 | 手動測試優先 |

---

## 里程碑 (Milestones)

| 里程碑 | 完成標準 | 預估日期 |
|--------|---------|---------|
| M1: 專案初始化完成 | 可執行 `pnpm dev` | Day 3 |
| M2: 資料輸入功能完成 | 可新增案例並儲存 | Week 1 |
| M3: AI 功能完成 | 可上傳截圖並提取數據 | Week 2.5 |
| M4: 文件生成完成 | 可生成完整申請文件 | Week 3.5 |
| M5: 匯出功能完成 | 可匯出 Word 檔案 | Week 4 |
| M6: MVP 完成 | 完整流程跑通 | Week 4.5 |
| M7: 正式上線 | 部署到 Vercel | Week 6 |

---

## 進度追蹤

| 階段 | 狀態 | 完成度 | 負責人 |
|------|------|--------|--------|
| Phase 0: 專案初始化 | 未開始 | 0% | `/backend-dev` |
| Phase 1: 基礎功能 | 未開始 | 0% | `/frontend-dev` |
| Phase 2: AI 功能 | 未開始 | 0% | `/backend-dev` + `/ai-engineer` |
| Phase 3: 文件生成 | 未開始 | 0% | `/frontend-dev` + `/ai-engineer` |
| Phase 4: Word 匯出 | 未開始 | 0% | `/backend-dev` |
| Phase 5: 案例管理 | 未開始 | 0% | `/frontend-dev` |
| Phase 6: UI/UX 優化 | 未開始 | 0% | `/frontend-dev` |
| Phase 7: 測試與部署 | 未開始 | 0% | 全員 |

---

## 風險與應對策略

| 風險 | 影響程度 | 機率 | 應對策略 |
|------|---------|------|----------|
| Claude API 數據提取不準確 | 高 | 中 | 1. 設計詳細 Prompt<br>2. 提供信心度指示<br>3. 允許人工修改 |
| 報告格式多樣化 | 中 | 高 | 1. 持續優化 Prompt<br>2. 收集更多範例<br>3. 支援手動輸入 |
| LocalStorage 容量限制 | 中 | 低 | 1. 圖片壓縮<br>2. 限制案例數量<br>3. 提供匯出備份功能 |
| Claude API 成本 | 中 | 中 | 1. 優化 Prompt 長度<br>2. 使用快取<br>3. 監控 API 使用量 |
| 使用者學習曲線 | 中 | 中 | 1. 設計直覺介面<br>2. 提供操作指引<br>3. 現場教學 |
| 網路斷線資料遺失 | 高 | 低 | 1. 自動儲存草稿<br>2. LocalStorage 備份<br>3. 提醒定期匯出 |

---

## 技術債務追蹤

（目前無技術債務）

---

## 下一步行動

### 立即執行
1. **建立 Subagent**：
   - `/frontend-dev` - 負責前端開發
   - `/backend-dev` - 負責後端 API 與整合
   - `/ai-engineer` - 負責 Prompt 設計與優化

2. **確認開發環境**：
   - 用戶是否已安裝 Node.js 20.x？
   - 用戶是否已取得 Claude API Key？

3. **開始 Phase 0**：
   - 建立 Next.js 專案
   - 設定基礎架構

### 本週目標
- 完成 Phase 0 (專案初始化)
- 開始 Phase 1 (基礎功能開發)

---

## 變更記錄

| 日期 | 版本 | 變更內容 |
|------|------|----------|
| 2025-12-14 | v1.0 | 初版建立，完整規劃 7 個 Phase |
