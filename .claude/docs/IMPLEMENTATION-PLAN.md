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

### Phase 2: 外科醫師評估文件生成 (預估 1 週)

> **文件說明**: 此階段生成「二位心臟外科專科醫師判定」文件，供醫師簽名使用

#### 2.1 Claude API 封裝與初始化
- [ ] 建立 `lib/ai/claude.ts`
- [ ] 封裝 Claude SDK 初始化
- [ ] 實作 `generateSurgeonAssessment(caseData)` 函數
- [ ] 錯誤處理與 retry 機制

#### 2.2 AI Prompt 設計 - 醫師評估摘要
- [ ] 建立 `lib/ai/prompts/surgeon-assessment.ts`
- [ ] 撰寫「病患摘要段落」生成 Prompt
- [ ] 輸入資料：
  - 病患基本資料 (姓名、病歷號、性別、年齡、出生日期、身分證)
  - 病史列表
  - 症狀列表與發作時間
  - 就醫歷程
  - 檢查報告摘要 (各項檢查的日期與關鍵數據)
  - STS Score、外科醫師姓名、NYHA 分級
  - 手術緊急性說明
- [ ] 輸出格式：單一段落，符合健保局格式
- [ ] 提供真實範例作為 few-shot learning

#### 2.3 API Route - 醫師評估文件生成
- [ ] 建立 `app/api/ai/generate-surgeon-assessment/route.ts`
- [ ] 接收 `caseData` 物件
- [ ] 呼叫 Claude API 生成摘要段落
- [ ] 回傳生成的文字內容
- [ ] 錯誤處理與重試機制

#### 2.4 Word 文件生成 - 醫師評估
- [ ] 建立 `lib/docx/surgeon-assessment.ts`
- [ ] 使用 docx.js 生成 .docx 檔案
- [ ] 文件結構：
  1. 標題：「申請『經導管主動脈瓣膜置換術』必須至少二位心臟外科專科醫師判定...」（3 行）
  2. 副標題：「TAVI 事前審查」（置中）
  3. 摘要段落 (AI 生成)
  4. 簽名欄位（兩行）：
     - 第一位 心臟外科醫師____________________ 日期 _________
     - 第二位 心臟外科醫師____________________ 日期 _________
- [ ] 格式設定：
  - 字型：標楷體 (中文) / Times New Roman (英文)
  - 標題：16pt 粗體
  - 內文：12pt
  - 行距：1.5

#### 2.5 檔案命名與下載功能
- [ ] 實作 `generateFileName(patientInfo, docType)` 函數
- [ ] 命名規則：`{姓名}{病歷號} - 二位心臟外科專科醫師判定.docx`
- [ ] 範例：`謝式修02759044 - 二位心臟外科專科醫師判定.docx`
- [ ] 在前端新增「生成醫師評估文件」按鈕
- [ ] 點擊後呼叫 API → 生成 Word → 自動下載

#### 2.6 使用者介面整合
- [ ] 在 `app/page.tsx` 新增「步驟 7：生成醫師評估文件」區塊
- [ ] 顯示「生成文件」按鈕（需完成前 6 步驟）
- [ ] 顯示生成進度 (呼叫 AI → 生成 Word → 下載)
- [ ] 成功後顯示提示：「請列印此文件給兩位心臟外科醫師簽名」
- [ ] 提供預覽功能（顯示生成的摘要段落）

**完成標準**:
- ✅ 可基於輸入資料生成「二位心臟外科專科醫師判定」Word 文件
- ✅ 摘要段落內容正確、格式符合健保局要求
- ✅ 檔名符合命名規則
- ✅ 可正常下載並用 Word 開啟編輯

---

### Phase 3: 簽名文件上傳功能 (預估 3 天)

> **功能說明**: 上傳已由兩位外科醫師簽名的「醫師評估文件」，準備嵌入最終申請文件

#### 3.1 簽名文件上傳組件
- [ ] 建立 `components/upload/SignedDocumentUploader.tsx`
- [ ] 支援格式：PDF, PNG, JPG, JPEG
- [ ] 拖曳上傳功能
- [ ] 檔案大小限制：單檔 < 5MB
- [ ] 上傳後顯示預覽（PDF 或圖片）

#### 3.2 PDF/圖片預覽功能
- [ ] 安裝 `react-pdf`: `pnpm add react-pdf pdfjs-dist`
- [ ] 建立 `components/upload/DocumentPreview.tsx`
- [ ] PDF 預覽：顯示第一頁縮圖
- [ ] 圖片預覽：顯示完整圖片
- [ ] 提供「放大檢視」功能
- [ ] 顯示檔案資訊：檔名、大小、上傳時間

#### 3.3 檔案轉換為 Base64
- [ ] 建立 `lib/utils/file-converter.ts`
- [ ] 實作 `fileToBase64(file)` 函數
- [ ] 實作 `pdfToImage(pdfFile)` 函數（將 PDF 轉為圖片）
- [ ] 圖片壓縮（如需要）

#### 3.4 Zustand Store 整合
- [ ] 在 `store/useCaseStore.ts` 新增欄位：
  ```typescript
  signedSurgeonAssessment?: {
    fileName: string
    fileType: 'pdf' | 'image'
    base64Data: string
    uploadedAt: string
  }
  ```
- [ ] 新增 action: `updateSignedAssessment(fileData)`
- [ ] LocalStorage 自動儲存

#### 3.5 使用者介面整合
- [ ] 在 `app/page.tsx` 新增「步驟 8：上傳簽名文件」區塊
- [ ] 顯示上傳區域（拖曳或點擊上傳）
- [ ] 上傳成功後顯示預覽
- [ ] 提供「重新上傳」按鈕
- [ ] 顯示狀態：
  - 未上傳：顯示說明文字
  - 已上傳：顯示檔案資訊與預覽
- [ ] 警告提示：「請確認文件已由兩位外科醫師簽名」

#### 3.6 驗證與錯誤處理
- [ ] 檔案格式驗證
- [ ] 檔案大小驗證
- [ ] 上傳失敗錯誤提示
- [ ] LocalStorage 容量檢查（若接近上限則警告）

**完成標準**:
- ✅ 可上傳 PDF 或圖片格式的簽名文件
- ✅ 上傳後可正確預覽
- ✅ 檔案資料正確儲存至 LocalStorage
- ✅ 可重新上傳替換檔案

---

### Phase 4: 事前審查文件生成 (預估 1.5 週)

> **文件說明**: 生成完整的「事前審查」申請文件，包含 13 個區塊及簽名醫師評估

#### 4.1 Claude API - 各區塊內容生成
- [ ] 建立 `lib/ai/prompts/pre-approval.ts`
- [ ] 撰寫各檢查報告的內容生成 Prompt：
  1. 心臟超音波檢查 (含關鍵數據標註)
  2. 心導管檢查
  3. 胸部 X 光
  4. EKG
  5. Heart CT
  6. 肺功能檢查
  7. 四肢血流探測 (ABI)
  8. 生理測量資訊 (BMI 計算)
  9. 檢驗報告 (表格格式)
  10. 就醫紀錄
  11. 用藥紀錄
  12. STS Score
- [ ] 每個 Prompt 需根據原始文字內容與圖片生成結構化報告
- [ ] 識別關鍵數據需標紅色（如 Severe AS, LVEF, STS score）

#### 4.2 API Route - 事前審查文件生成
- [ ] 建立 `app/api/ai/generate-pre-approval/route.ts`
- [ ] 接收完整 `caseData` + 簽名文件
- [ ] 分區塊呼叫 Claude API（避免 token 限制）
- [ ] 串接所有區塊內容
- [ ] 錯誤處理與重試機制
- [ ] 顯示生成進度 (1/13, 2/13, ...)

#### 4.3 Word 文件生成 - 事前審查
- [ ] 建立 `lib/docx/pre-approval.ts`
- [ ] 使用 docx.js 生成完整 .docx 檔案
- [ ] 文件結構（13 個區塊）：
  1. **標題與摘要段落**（與醫師評估文件相同）
  2. **一、心臟超音波檢查**
     - 日期標註
     - 完整報告文字
     - 關鍵數據紅色標註
  3. **二、心導管檢查**
     - 日期與報告內容
  4. **三、Chest X-ray**
     - 報告文字
     - 嵌入 X 光圖片
  5. **四、EKG**
     - 報告文字
     - 嵌入 EKG 圖片
  6. **五、Heart CTA**
     - 詳細測量數據
  7. **六、心肌灌注掃瞄** (如有)
  8. **七、頸動脈杜普勒超音波** (如有)
  9. **八、生理測量資訊**
     - 身高、體重、BMI
  10. **九、檢驗報告**
      - 表格格式
      - GFR 等關鍵值標紅
  11. **十、就醫紀錄**
      - 嵌入醫院系統截圖
  12. **十一、用藥紀錄**
      - 嵌入用藥清單截圖
  13. **十二、STS Score**
      - 顯示百分比
      - 嵌入 STS Calculator 截圖
  14. **十三、二位心臟外科專科醫師判定**
      - 嵌入已簽名的醫師評估文件（全頁圖片）

#### 4.4 圖片嵌入功能
- [ ] 實作 `embedImageInDocx(base64Image, width, height)` 函數
- [ ] 從 `examinations` 陣列讀取各檢查的圖片
- [ ] 圖片尺寸調整：
  - X 光、EKG：寬度 15cm
  - 截圖類：寬度 16cm (滿版)
  - 簽名文件：寬度 16cm (滿版)
- [ ] 圖片品質優化（避免檔案過大）

#### 4.5 紅色標註功能
- [ ] 實作 `highlightText(text, keywords)` 函數
- [ ] 關鍵字清單：
  - `Severe AS`, `Critical AS`
  - `LVEF`, `AVA`, `Vmax`, `Peak PG`, `Mean PG`
  - `STS score`, `>10%`
  - `GFR`
  - NYHA Class III/IV
- [ ] 使用 docx.js 的 `TextRun` 設定 `color: "FF0000"` (紅色)

#### 4.6 檔案命名與下載功能
- [ ] 命名規則：`事前審查-{姓名}{病歷號}.docx`
- [ ] 範例：`事前審查-謝式修02759044.docx`
- [ ] 在前端新增「生成事前審查文件」按鈕
- [ ] 需先完成步驟 8 (上傳簽名文件)
- [ ] 顯示生成進度條 (0-100%)
- [ ] 生成完成後自動下載

#### 4.7 使用者介面整合
- [ ] 在 `app/page.tsx` 新增「步驟 9：生成事前審查文件」區塊
- [ ] 檢查前置條件：
  - 步驟 1-6 已完成
  - 步驟 7 已生成醫師評估文件
  - 步驟 8 已上傳簽名文件
- [ ] 顯示「生成最終文件」按鈕
- [ ] 顯示生成進度：
  - 正在生成區塊 1/13...
  - 正在嵌入圖片...
  - 正在生成 Word 文件...
  - 下載準備中...
- [ ] 成功後顯示：「事前審查文件已生成！」

**完成標準**:
- ✅ 可基於所有輸入資料生成完整的「事前審查」Word 文件
- ✅ 包含所有 13 個區塊，內容正確
- ✅ 醫療圖片正確嵌入文件中
- ✅ 關鍵數據正確標註紅色
- ✅ 簽名醫師評估文件嵌入最後一頁
- ✅ 檔名符合命名規則
- ✅ 可正常下載並用 Word 開啟編輯
- ✅ 格式符合健保局要求

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

| 里程碑 | 完成標準 | 狀態 |
|--------|---------|------|
| M1: 專案初始化完成 | 可執行 `pnpm dev` | ✅ 完成 |
| M2: 資料輸入功能完成 | 可新增案例並儲存所有資料 (6 個步驟) | ✅ 完成 |
| M3: 醫師評估文件生成 | 可生成並下載「二位心臟外科專科醫師判定」Word 文件 | ✅ 完成 |
| M4: 簽名文件上傳完成 | 可上傳已簽名的醫師評估文件 | ✅ 完成 |
| M5: 事前審查文件生成 | 可生成完整「事前審查」Word 文件 (17 區塊) | ✅ 完成 |
| M6: 核心功能完成 | 完整流程跑通 (輸入→生成→簽名→最終文件) | ✅ 完成 |
| M7: MVP 完成 | 包含案例管理與 UI 優化 | ⏳ 進行中（案例管理已完成）|
| M8: 正式上線 | 測試完成並部署到 Vercel | ✅ 完成（Vercel 部署成功）|

---

## 進度追蹤

| 階段 | 狀態 | 完成度 | 負責人 |
|------|------|--------|--------|
| Phase 0: 專案初始化 | ✅ 完成 | 100% | `/backend-dev` |
| Phase 1: 基礎功能 | ✅ 完成 | 100% | `/frontend-dev` |
| Phase 1.5: UX 優化 | ✅ 完成 | 100% | `/frontend-dev` |
| Phase 2: 外科醫師評估文件生成 | ✅ 完成 | 100% | `/backend-dev` + `/ai-engineer` |
| Phase 3: 簽名文件上傳功能 | ✅ 完成 | 100% | `/frontend-dev` |
| Phase 4: 事前審查文件生成 | ✅ 完成 | 100% | `/backend-dev` + `/ai-engineer` |
| Phase 5: 案例管理 | ✅ 完成 | 100% | `/frontend-dev` |
| Phase 6: UI/UX 優化 | ⏳ 待開始 | 0% | `/frontend-dev` |
| Phase 7: 測試與部署 | 部分完成 | 50% | 全員 |

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

### 立即執行（配額恢復後 - 2026-01-01）
1. **測試 Phase 2 完成的功能**：
   - 測試 AI 摘要生成功能（繁體中文、資料真實性、格式）
   - 測試檢驗報告 Lab Findings 標註功能
   - 驗證 Word 文件格式是否符合健保局要求
   - 使用真實資料測試完整流程

### 當前優先執行（UX 優化）
**Phase 1.5: UX 優化 - EuroSCORE 與檢查輸入增強**（2025-12-15 新增）

#### 1. 新增 EuroSCORE 檢查類型
**位置**：步驟 5 - 檢查報告輸入
- [ ] 修改 `types/index.ts`：
  - ExaminationType 新增 `'euroscore'`
  - EXAMINATION_LABELS 新增 `'euroscore': 'EuroSCORE'`
  - EXAMINATION_INPUT_CONFIG 新增配置（文字 + 圖片）
- [ ] 自動整合到 ExaminationInput 組件（無需修改組件）
- [ ] 測試：可在檢查類型下拉選單中選擇 EuroSCORE

#### 2. 風險評估表單新增切換按鈕
**位置**：步驟 6 - 手術風險評估與適應症
- [ ] 修改 `types/index.ts`：
  - RiskAssessment 介面新增 `scoreType?: 'sts' | 'euroscore'`（預設 'sts'）
  - RiskAssessment 介面新增 `euroScore?: string`
- [ ] 修改 `RiskAssessmentForm.tsx`：
  - 在 STS Score 輸入框上方新增切換按鈕（Tab 式或 Toggle）
  - 根據 scoreType 顯示對應的輸入框
  - STS 模式：顯示 STS Score 輸入 + STS Calculator 連結
  - EuroSCORE 模式：顯示 EuroSCORE 輸入 + EuroSCORE Calculator 連結
  - 切換時保留兩邊資料（不清空）
- [ ] 更新 Zustand store：支援新的 scoreType 和 euroScore 欄位

#### 3. 檢查輸入支援貼上截圖
**位置**：所有檢查類型的圖片上傳區
- [ ] 修改 `ExaminationInput.tsx`：
  - 在圖片上傳區域新增 onPaste 事件監聽
  - 從 clipboard 取得圖片資料
  - 自動進入裁切模式
  - 在 UI 提示「支援 Ctrl+V 貼上截圖」
- [ ] 測試：複製截圖後按 Ctrl+V 可直接貼上

#### 4. 測試與部署
- [ ] 測試 EuroSCORE 檢查類型輸入
- [ ] 測試風險評估表單切換功能
- [ ] 測試貼上截圖功能
- [ ] Git commit & push
- [ ] Vercel 自動部署

### 當前可執行（無需 API）
1. **開始 Phase 3 - 簽名文件上傳功能**：
   - 設計文件上傳組件 (PDF/圖片)
   - 實作文件預覽功能
   - 整合到步驟 8
   - LocalStorage 儲存

2. **準備 Phase 4 - 完整申請文件設計**：
   - 研究 17 個區塊的結構（已有文檔：COMPLETE-APPLICATION-TEMPLATE.md）
   - 設計各區塊的資料對應邏輯
   - 規劃圖片嵌入策略
   - 設計紅色標註關鍵字清單

### 已完成
- ✅ Phase 0: 專案初始化
- ✅ Phase 1: 基礎功能（資料輸入）
- ✅ Phase 2: 醫師評估文件生成（AI + Word 匯出）
- ✅ Vercel 部署成功（https://tavi-seven.vercel.app/）

### 未來規劃
- Week 3: 完成 Phase 3 & 4 (簽名文件上傳 + 完整申請文件)
- Week 4: 完成 Phase 5-6 (案例管理與 UI 優化)
- Week 5: Phase 7 (完整測試)

---

## 變更記錄

| 日期 | 版本 | 變更內容 |
|------|------|----------|
| 2025-12-14 | v1.0 | 初版建立，完整規劃 7 個 Phase |
| 2025-12-14 | v2.0 | **重大更新**：基於文件分析結果，重新規劃 Phase 2-4<br>- Phase 0-1: 標記為已完成 (100%)<br>- Phase 2: 改為「外科醫師評估文件生成」<br>- Phase 3: 改為「簽名文件上傳功能」<br>- Phase 4: 改為「事前審查文件生成」(13 區塊)<br>- 確立兩文件工作流程：醫師評估 → 簽名 → 最終申請<br>- 新增檔案命名規則與紅色標註需求 |
| 2025-12-14 | v3.0 | **進度更新**：<br>- ✅ Phase 2 已完成（AI 摘要生成、Word 匯出、Vercel 部署）<br>- ✅ M3 里程碑達成（醫師評估文件生成）<br>- ✅ M8 里程碑達成（Vercel 部署）<br>- 更新「下一步行動」：區分配額恢復後與當前可執行任務<br>- 已知限制：Claude API 配額到 2026-01-01 恢復<br>- 檢查類型已擴充至 15 種（含 Lab Findings 標註） |
| 2025-12-15 | v3.1 | **新增 Phase 1.5 UX 優化**：<br>- Feature 1: 新增 EuroSCORE 檢查類型（檢查報告輸入）<br>- Feature 2: 風險評估表單新增 STS ↔ EuroSCORE 切換按鈕<br>- Feature 3: 檢查輸入支援 Ctrl+V 貼上截圖功能<br>- 詳細規劃實作步驟與資料結構設計 |
