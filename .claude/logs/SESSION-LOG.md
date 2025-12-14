# Session Log

> 每次 CLI 啟動時必讀此檔案，了解專案進度與待辦事項

---

## Session: 2025-12-14 初始化

### 變更摘要
- 建立專案模板框架
- 建立 CLAUDE.md 主要說明文件
- 建立 `/concept` subagent (概念設計師)
- 建立 `/pm` subagent (專案經理)
- 建立文件模板：PRD.md, TECHSTACK.md, IMPLEMENTATION-PLAN.md
- 建立 log 系統

### 決策記錄
- 採用 `.claude/` 目錄結構管理所有 Claude Code 相關檔案
- Subagent 使用 slash command 方式實作，放在 `.claude/commands/`
- Log 使用累積式 Markdown 格式，每次 session 新增一個區塊
- 工作流程：Concept 先行 → PM 接手規劃 → 動態建立其他 Subagent

### 待辦事項
- [ ] 使用此模板開始新專案時，執行 `/concept` 討論專案概念
- [ ] 更新 CLAUDE.md 中的 `[PROJECT_NAME]`
- [ ] 填寫 PRD.md
- [ ] 填寫 TECHSTACK.md
- [ ] 執行 `/pm` 建立實作計畫

---

## Session: 2025-12-14 需求討論與文件撰寫

### 變更摘要
- ✅ 與用戶深入討論 TAVI 健保申請專案需求
- ✅ 分析現有健保申請文件結構（閱讀 2 份真實案例）
- ✅ 完成 **PRD.md** (產品需求文件)
  - 定義專案目標：協助護理師快速完成申請文件（從 170 分鐘縮短至 32 分鐘）
  - 設計完整功能需求：11 個核心功能
  - 列出常見病史與症狀選項
  - 設計資料結構與使用流程
- ✅ 完成 **TECHSTACK.md** (技術棧說明)
  - 確定使用 Next.js 15 + Claude API + Vercel 部署
  - 選擇 Shadcn/ui、Tailwind CSS、React Hook Form 等技術
  - 設計專案結構和 API 端點
- ✅ 更新 **CLAUDE.md** 專案名稱為「TAVI 健保申請輔助系統」

### 決策記錄

#### 1. 採用「輔助式生成」方案（方案 B）
- **決定**: 不採用全自動生成，而是採用「結構化輸入 + AI 輔助 + 人工確認」
- **原因**:
  - 醫療文件需要高準確度，完全自動化風險太高
  - 護理師輸入病史/症狀選項，AI 負責數據提取和格式化
  - 保留人工編輯功能，確保內容正確性

#### 2. 檢查日期處理：混合方案
- **決定**: AI 嘗試識別日期並預填，護理師確認/修改
- **原因**:
  - 日期在醫療文件中極度重要，不能有錯
  - 報告格式不統一，AI 識別準確度約 80-90%
  - 護理師快速確認比重新輸入省時

#### 3. 技術棧選擇
- **前端**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Shadcn/ui
- **後端**: Next.js API Routes (Serverless)
- **AI**: Claude 3.5 Sonnet (Vision API)
- **資料儲存**: LocalStorage / IndexedDB (無需後端資料庫)
- **部署**: Vercel (用戶指定)
- **原因**:
  - 考量使用者年齡（45-60 歲），界面需簡單易用
  - Vercel 部署零配置，開發快速
  - LocalStorage 保護隱私，無需後端資料庫
  - Claude API 的 Vision 能力適合醫學影像識別

#### 4. 不需要登入功能
- **決定**: 暫不實作登入功能
- **原因**: 單一護理師使用，資料存在瀏覽器本地即可

#### 5. 範本管理延後考慮
- **決定**: MVP 階段先不實作範本管理
- **原因**: 先驗證核心功能可行性，範本管理可後續擴充

### 待辦事項
- [x] 更新 CLAUDE.md 中的 `[PROJECT_NAME]` → TAVI 健保申請輔助系統
- [x] 完成 PRD.md
- [x] 完成 TECHSTACK.md
- [ ] 執行 `/pm` 建立 IMPLEMENTATION-PLAN.md（實作計畫）
- [ ] PM 建立開發用 Subagent：
  - `/frontend-dev` - 前端開發
  - `/backend-dev` - 後端開發
  - `/ai-engineer` - AI Prompt 優化
- [ ] 開始開發 MVP 功能

### 下次啟動重點
1. 執行 `/pm` 讓專案經理規劃實作計畫
2. 確認開發環境設定（Node.js, pnpm, Claude API Key）
3. 建立 Next.js 專案結構
4. 開始實作第一個功能：病患基本資料輸入表單

---

## Session: 2025-12-14 PM 規劃與 Subagent 建立

### 變更摘要
- ✅ PM 接手專案規劃
- ✅ 完成 **IMPLEMENTATION-PLAN.md** (實作計畫)
  - 規劃 7 個開發階段 (Phase 0-7)
  - 預估開發時間 4-6 週
  - 定義 7 個里程碑
  - 列出風險與應對策略
- ✅ 建立 3 個開發用 Subagent：
  - `/frontend-dev` - 前端開發專家
  - `/backend-dev` - 後端 API 與整合專家
  - `/ai-engineer` - AI Prompt 優化專家
- 📝 每個 Subagent 都有詳細的職責說明、開發規範、檢查清單

### 決策記錄

#### 1. 採用 7 階段開發策略
- **Phase 0**: 專案初始化 (2-3 天)
- **Phase 1**: 基礎功能 - 資料輸入 (1 週)
- **Phase 2**: AI 功能 - 圖片上傳與數據提取 (1.5 週)
- **Phase 3**: 文件生成功能 (1 週)
- **Phase 4**: Word 匯出功能 (3 天)
- **Phase 5**: 歷史案例管理 (3 天)
- **Phase 6**: UI/UX 優化 (3 天)
- **Phase 7**: 測試與部署 (3-4 天)
- **原因**: 逐步推進，每個階段都有明確的完成標準，便於測試與迭代

#### 2. Subagent 職責分工
- **Frontend Dev**: 負責 Phase 1, 3, 5, 6 (所有 UI/表單/編輯器)
- **Backend Dev**: 負責 Phase 0, 2, 4 (專案初始化、API、整合)
- **AI Engineer**: 負責 Phase 2 的 Prompt 設計與 Phase 7 的準確度優化
- **原因**: 明確分工，避免重複，各司其職

#### 3. MVP 優先策略
- 先實現核心流程（資料輸入 → AI 提取 → 文件生成 → 匯出）
- UI/UX 優化延後到 Phase 6
- **原因**: 快速驗證核心價值，盡早發現問題

#### 4. 里程碑設定
- **M1** (Day 3): 專案初始化完成
- **M2** (Week 1): 資料輸入功能完成
- **M3** (Week 2.5): AI 功能完成
- **M4** (Week 3.5): 文件生成完成
- **M5** (Week 4): 匯出功能完成
- **M6** (Week 4.5): MVP 完成
- **M7** (Week 6): 正式上線
- **原因**: 清楚的進度指標，便於追蹤與調整

### Subagent 建立詳情

#### `/frontend-dev` (前端開發)
- **職責**: React 組件、表單、狀態管理、UI/UX
- **技術**: Next.js 15, React Hook Form, Zod, Tailwind, Shadcn/ui, Tiptap
- **規範**: 詳細的組件結構、表單驗證、無障礙性要求
- **檔案**: `.claude/commands/frontend-dev.md`

#### `/backend-dev` (後端開發)
- **職責**: API Routes, Claude API 整合, Word 文件生成
- **技術**: Next.js API Routes, @anthropic-ai/sdk, docx.js
- **規範**: API 結構、錯誤處理、Claude API 封裝
- **特色**: 包含詳細的 Phase 0 初始化步驟指南
- **檔案**: `.claude/commands/backend-dev.md`

#### `/ai-engineer` (AI 工程師)
- **職責**: Prompt 設計、準確度優化、參數調校
- **技術**: Claude 3.5 Sonnet, Vision API, Prompt Engineering
- **規範**: Prompt 設計原則、測試流程、優化方法
- **特色**: 提供完整的 Prompt 模板（心臟超音波、心導管、日期識別）
- **檔案**: `.claude/commands/ai-engineer.md`

### 待辦事項
- [x] 執行 `/pm` 建立 IMPLEMENTATION-PLAN.md
- [x] 建立 `/frontend-dev` subagent
- [x] 建立 `/backend-dev` subagent
- [x] 建立 `/ai-engineer` subagent
- [ ] **下一步：確認開發環境**
  - [ ] 用戶是否已安裝 Node.js 20.x？
  - [ ] 用戶是否已安裝 pnpm？
  - [ ] 用戶是否已取得 Claude API Key？
- [ ] **開始 Phase 0：專案初始化**
  - 建立 Next.js 專案
  - 安裝依賴
  - 建立目錄結構
  - 設定環境變數

### 下次啟動重點
1. **確認開發環境**: 詢問用戶是否已準備好開發環境
2. **啟動 Backend Dev**: 執行 `/backend-dev` 開始 Phase 0
3. **建立 Next.js 專案**: 按照 IMPLEMENTATION-PLAN 的步驟初始化
4. **設定 Claude API Key**: 確保可以呼叫 Claude API

### 專案狀態
- **文件完成度**: PRD ✅ | TECHSTACK ✅ | IMPLEMENTATION-PLAN ✅
- **Subagent 就緒**: `/concept` ✅ | `/pm` ✅ | `/frontend-dev` ✅ | `/backend-dev` ✅ | `/ai-engineer` ✅
- **開發進度**: Phase 0 未開始
- **預估完成時間**: 4-6 週

---

## Session: 2025-12-14 Phase 0 專案初始化完成

### 變更摘要
- ✅ 確認開發環境（Node.js v24.11.0、pnpm 10.20.0）
- ✅ 建立 Next.js 15 專案（使用 npm，App Router + TypeScript + Tailwind CSS）
- ✅ 安裝核心依賴套件：
  - @anthropic-ai/sdk（Claude API SDK）
  - react-hook-form、zod、@hookform/resolvers（表單與驗證）
  - zustand（狀態管理）
  - docx（Word 文件生成）
  - browser-image-compression（圖片壓縮）
- ✅ 初始化 Shadcn/ui（選擇 Neutral 主題）
- ✅ 安裝基礎 UI 組件（button、input、label、checkbox、select、textarea、card）
- ✅ 建立完整專案目錄結構：
  - `app/api/ai/` - AI API 端點
  - `components/forms/` - 表單組件
  - `components/upload/` - 上傳組件
  - `components/editor/` - 編輯器組件
  - `lib/ai/` - AI 相關工具
  - `lib/storage/` - 資料儲存
  - `lib/docx/` - Word 文件生成
  - `types/` - TypeScript 型別定義
  - `store/` - Zustand store
- ✅ 建立環境變數模板 (`.env.local`)
- ✅ 驗證開發伺服器啟動（成功在 port 3005，2.7 秒就緒）
- ✅ 更新 .gitignore 排除醫療案例資料
- ✅ Git commit 並記錄所有變更

### 決策記錄

#### 1. 使用 npm 而非 pnpm
- **決定**: 雖然用戶有安裝 pnpm，但在建立 Next.js 專案時 pnpm 安裝失敗
- **原因**: pnpm 安裝過程中出現 Exit code 127 錯誤，切換到 npm 後成功
- **影響**: 專案使用 npm 作為套件管理器，package-lock.json 而非 pnpm-lock.yaml

#### 2. Shadcn/ui 主題選擇
- **決定**: 使用 Neutral 配色主題
- **原因**: Neutral 是預設選項，適合醫療應用的專業風格

#### 3. .env.local 僅作為模板
- **決定**: 提交的 .env.local 包含佔位符 API Key
- **原因**:
  - 真實 API Key 不應提交到 Git
  - 提供模板方便用戶配置
  - .gitignore 已排除 .env*.local 避免意外提交真實 Key

#### 4. 排除醫療案例資料
- **決定**: 在 .gitignore 加入 `TAVI VPN case*/` 規則
- **原因**: 用戶的案例資料包含敏感醫療資訊，不應提交到版本控制

### 技術細節

#### 專案結構
```
tavi-app/
├── app/
│   ├── api/ai/        # AI API 端點（待建立）
│   ├── layout.tsx      # 根佈局
│   ├── page.tsx        # 首頁
│   └── globals.css     # 全域樣式（已包含 Shadcn 變數）
├── components/
│   ├── ui/             # Shadcn/ui 組件（7 個基礎組件）
│   ├── forms/          # 表單組件（待建立）
│   ├── upload/         # 上傳組件（待建立）
│   └── editor/         # 編輯器組件（待建立）
├── lib/
│   ├── ai/             # AI 相關工具（待建立）
│   ├── storage/        # 資料儲存（待建立）
│   ├── docx/           # Word 文件生成（待建立）
│   └── utils.ts        # 通用工具函數（Shadcn 提供）
├── types/              # TypeScript 型別定義（待建立）
├── store/              # Zustand store（待建立）
├── public/             # 靜態資源
├── .env.local          # 環境變數（需填入真實 API Key）
├── components.json     # Shadcn/ui 配置
├── package.json        # 依賴清單
└── tsconfig.json       # TypeScript 配置
```

#### 已安裝的套件
- **框架**: next@16.0.10, react@19.2.1
- **AI**: @anthropic-ai/sdk@^0.40.0
- **表單**: react-hook-form@^7.54.2, zod@^3.24.1, @hookform/resolvers@^3.9.1
- **狀態**: zustand@^5.0.2
- **UI**: tailwindcss@^4, @tailwindcss/postcss@^4
- **工具**: docx@^8.5.0, browser-image-compression@^2.0.2

### 待辦事項
- [x] 確認開發環境
- [x] 建立 Next.js 專案
- [x] 安裝核心依賴
- [x] 初始化 Shadcn/ui
- [x] 建立專案目錄結構
- [x] 設定環境變數
- [x] 驗證開發伺服器
- [x] Git commit
- [ ] **下一步：填入 Claude API Key**
  - 用戶需要前往 https://console.anthropic.com/ 取得 API Key
  - 填入 `tavi-app/.env.local` 的 `ANTHROPIC_API_KEY`
- [ ] **開始 Phase 1：基礎功能開發**
  - 建立病患基本資料表單
  - 建立病史選擇系統
  - 建立症狀選擇系統

### 下次啟動重點
1. **確認 API Key**: 詢問用戶是否已填入 Claude API Key
2. **啟動 Frontend Dev**: 執行 `/frontend-dev` 開始 Phase 1
3. **建立第一個表單**: 病患基本資料輸入表單
4. **測試表單功能**: 驗證 React Hook Form + Zod 整合

### 專案狀態
- **Phase 0**: ✅ 完成（2025-12-14）
- **Phase 1**: 🔜 準備開始
- **Phase 2-7**: ⏳ 待執行
- **開發環境**: ✅ 就緒
- **API Key**: ⚠️ 待填入
- **開發伺服器**: ✅ 正常運作（http://localhost:3005）

### 效能指標
- Next.js 啟動時間：2.7 秒
- 專案大小：36 個檔案（+11,188 行）
- 依賴套件：458 個 packages

---

## Session: 2025-12-14 圖片裁切功能與完整檢查類型支援

### 變更摘要
- ✅ 安裝 react-easy-crop 套件實現圖片裁切功能
- ✅ 建立 **ImageCropper** 組件
  - 支援自由裁切（無固定比例限制）
  - 提供拖動調整位置功能
  - 提供縮放控制（1x-3x）
  - 全螢幕裁切介面，黑色半透明背景
  - 確認/取消按鈕
- ✅ 建立 **ExaminationInput** 統一組件取代舊的 ImageUploader
  - 支援 13 種檢查類型（心臟超音波、心導管、EKG、CXR 等）
  - 動態配置每種檢查類型的輸入需求（文字框、圖片、最少圖片數）
  - 整合檔案上傳與螢幕截圖功能
  - 上傳與截圖後自動進入裁切模式
  - 拖放上傳支援
- ✅ 更新 **app/page.tsx** 使用新的 ExaminationInput 組件
  - 移除舊的 ImageUploader 組件
  - 更新檢查列表顯示支援所有 13 種檢查類型
- ✅ 更新 Shadcn/ui slider 組件（用於縮放控制）
- ✅ Git commit 並推送到 GitHub

### 決策記錄

#### 1. 採用 react-easy-crop 而非原生裁切
- **決定**: 使用 react-easy-crop 套件實現裁切功能
- **原因**:
  - 提供完整的裁切 UI 與互動體驗
  - 支援觸控與滑鼠操作
  - 內建縮放、拖動功能
  - 比自行開發更穩定可靠
  - 使用者體驗更好

#### 2. 每次上傳一張圖片並裁切
- **決定**: 改為每次處理一張圖片，而非批次處理多張
- **原因**:
  - 批次處理時，需要複雜的等待機制
  - 使用者體驗更清晰：上傳 → 裁切 → 確認 → 再上傳下一張
  - 避免狀態管理複雜度
  - 簡化程式碼，減少 bug 風險

#### 3. 裁切介面使用全螢幕覆蓋
- **決定**: 裁切時顯示全螢幕黑色半透明覆蓋層
- **原因**:
  - 提供專注的裁切環境
  - 避免與背景內容產生視覺干擾
  - 符合一般圖片編輯軟體的使用習慣
  - 讓使用者清楚知道目前在裁切模式

#### 4. 支援 13 種檢查類型動態配置
- **決定**: 使用 EXAMINATION_INPUT_CONFIG 物件配置每種檢查類型的輸入需求
- **原因**:
  - 避免重複程式碼
  - 新增檢查類型只需修改配置，不需改動組件邏輯
  - 清楚定義每種檢查的輸入需求（文字、圖片、最少數量）
  - 易於維護與擴充

### 技術細節

#### ImageCropper 組件特性
```typescript
// 主要功能
- Cropper 組件來自 react-easy-crop
- 縮放範圍：1x 到 3x（使用 Shadcn slider）
- 無固定裁切比例（aspect={undefined}）
- 提供即時縮放百分比顯示
- Canvas API 處理裁切後的圖片輸出（PNG 格式）
```

#### ExaminationInput 組件結構
```typescript
// 13 種檢查類型配置範例
'echocardiography': {
  hasText: true,      // 需要文字輸入
  hasImages: true,    // 需要圖片上傳
  minImages: 2,       // 至少 2 張圖片
  placeholder: '請貼上心臟超音波報告全文...',
},
'lab-report': {
  hasText: false,     // 不需要文字輸入
  hasImages: true,    // 只需要圖片
  minImages: 1,       // 至少 1 張圖片
}
```

#### 裁切流程
1. 使用者點擊上傳或截圖
2. 取得圖片資料（File 或 Screenshot）
3. 設定 `currentCropImage` 觸發裁切介面顯示
4. 使用者調整裁切範圍與縮放
5. 點擊確認：Canvas API 產生裁切後的 base64 圖片
6. 圖片加入 `images` 陣列
7. `currentCropImage` 設為 null，返回主介面
8. 可重複上傳下一張圖片

### 待辦事項
- [x] 安裝 react-easy-crop 套件
- [x] 建立 ImageCropper 組件
- [x] 整合裁切功能到 ExaminationInput
- [x] 測試裁切功能
- [x] 提交變更到 Git
- [ ] **Phase 1 剩餘工作**：
  - [ ] 測試所有 13 種檢查類型的輸入
  - [ ] 實作 STS Score 計算器（如可行）
  - [ ] Phase 1 完整測試
- [ ] **下一步：Phase 2 AI 功能開發**
  - [ ] 建立 AI API 端點
  - [ ] 整合 Claude Vision API
  - [ ] 實作心臟超音波數據提取
  - [ ] 實作心導管數據提取

### 下次啟動重點
1. **測試檢查輸入功能**: 確認 13 種檢查類型都能正常運作
2. **討論 STS Score**: 詢問用戶是否需要實作自動計算，或只提供圖片上傳
3. **準備 Phase 2**: 討論 AI 數據提取的優先順序與測試資料

### 專案狀態
- **Phase 0**: ✅ 完成
- **Phase 1**: 🚧 進行中（約 90% 完成）
  - ✅ 病患基本資料表單
  - ✅ 病史選擇系統
  - ✅ 症狀選擇系統
  - ✅ 就醫歷程表單
  - ✅ 檢查報告輸入系統（13 種類型）
  - ✅ 圖片裁切功能
  - ⏳ 整體測試待執行
- **Phase 2-7**: ⏳ 待執行
- **開發伺服器**: ✅ 正常運作（http://localhost:3000）

### Git 記錄
- **Commit**: 74f97aa - feat: 實作圖片裁切功能與完整檢查類型支援
- **推送**: https://github.com/tnfsp/TAVI.git
- **變更檔案**: 7 files changed, 761 insertions(+), 37 deletions(-)
- **新增組件**: ImageCropper.tsx, ExaminationInput.tsx, slider.tsx

---

## Session: 2025-12-14 Phase 1 完成與使用者體驗優化

### 變更摘要
- ✅ 完成圖片裁切功能整合（繼續前一個 session）
- ✅ 為 STS Score 檢查類型新增數字輸入欄位
- ✅ 建立 **RiskAssessmentForm** 組件（步驟 6）
  - STS Score 百分比輸入
  - 兩位外科醫師姓名輸入
  - NYHA 心功能分級選擇（I/II/III/IV）
  - 手術適應症與緊急性說明文字框
- ✅ 移除「外科醫師判定」檢查類型（從 13 種調整為 12 種）
- ✅ 新增 STS Calculator 官方連結（在檢查報告輸入區）
- ✅ 新增手術適應症快捷輸入功能（4 個常用範本按鈕）
- ✅ **Phase 1 基礎功能 100% 完成**

### 決策記錄

#### 1. Phase 2 簡化方案（移除 AI 數據提取）
- **決定**: 不實作從圖片提取檢查數據的功能
- **原因**:
  - 使用者會直接複製報告內容到文字框（心臟超音波、心導管）
  - STS Score 提供數字輸入 + 截圖上傳即可
  - 簡化開發，避免 AI 提取準確度問題
  - Phase 2 將專注於文件生成功能

#### 2. 移除外科醫師判定檢查類型
- **決定**: 從 13 種檢查類型中移除 surgeon-assessment
- **原因**: 外科醫師評估資訊已整合到步驟 6 的風險評估表單中，避免重複

#### 3. STS Score 輸入方式
- **決定**: 採用「數字輸入 + 截圖上傳」方式
- **原因**:
  - 使用者在官方計算器算好後，可直接輸入數字
  - 上傳截圖作為佐證
  - 不需要實作複雜的 STS 計算器
  - 文件生成時有明確的數字可用

#### 4. 手術適應症快捷輸入
- **決定**: 提供 4 個常用範本按鈕，方便快速插入
- **原因**:
  - 減少重複輸入工作
  - 提供標準化的專業用語
  - 可自行修改調整
  - 大幅提高填寫效率

### 技術細節

#### RiskAssessmentForm 組件結構
```typescript
// 表單欄位
- stsScore: string (例如：>10%)
- surgeon1: string (第一位外科醫師)
- surgeon2: string (第二位外科醫師)
- nyhaClass: 'I' | 'II' | 'III' | 'IV'
- urgencyReason: string (手術適應症與緊急性)

// 快捷範本
URGENCY_TEMPLATES = [
  '症狀惡化 + Critical AS',
  'NYHA III-IV + 傳統手術高風險',
  'Low flow low gradient',
  '生活品質 + 預後評估',
]
```

#### STS Calculator 連結位置
- 位於「步驟 5：檢查報告輸入」
- 當選擇 STS Score 檢查類型時顯示
- 連結：https://riskcalc.sts.org/stswebriskcalc/
- 新分頁開啟，方便來回切換

### 待辦事項
- [x] 完成圖片裁切功能整合
- [x] 為 STS Score 新增數字輸入
- [x] 建立手術風險評估表單
- [x] 新增 STS Calculator 連結
- [x] 新增手術適應症快捷輸入
- [x] Phase 1 所有功能完成
- [ ] **Phase 1 完整測試**（下次 session）
  - [ ] 測試所有 6 個步驟的表單
  - [ ] 測試 12 種檢查類型輸入
  - [ ] 測試圖片裁切功能
  - [ ] 測試資料持久化（LocalStorage）
- [ ] **Phase 2 & 3：文件生成功能**（未來）
  - [ ] 設計文件生成 Prompt
  - [ ] 整合 Claude API
  - [ ] 實作文件預覽與編輯
  - [ ] Phase 4: Word 匯出

### 下次啟動重點
1. **進行 Phase 1 完整測試**: 逐步測試所有功能
2. **收集測試反饋**: 記錄任何需要修正的問題
3. **討論 Phase 2**: 確認文件生成的格式與欄位需求

### 專案狀態
- **Phase 0**: ✅ 完成
- **Phase 1**: ✅ **100% 完成**
  - ✅ 步驟 1：病患基本資料表單
  - ✅ 步驟 2：病史選擇系統（9 種）
  - ✅ 步驟 3：症狀選擇系統（8 種 + 發生時間）
  - ✅ 步驟 4：就醫歷程表單
  - ✅ 步驟 5：檢查報告輸入系統（12 種檢查類型）
    - 圖片裁切功能（react-easy-crop）
    - 螢幕截圖與檔案上傳
    - STS Calculator 快速連結
  - ✅ 步驟 6：手術風險評估與適應症
    - STS Score、外科醫師、NYHA 分級
    - 手術適應症快捷輸入
  - ⏳ 整體測試待執行
- **Phase 2-7**: ⏳ 待執行
- **開發伺服器**: ✅ 正常運作（http://localhost:3000）

### Git 記錄
本次 session 共 5 個 commits：
1. **7cdbe69** - feat: 為 STS Score 新增數字輸入欄位
2. **6d93e8f** - feat: 新增手術風險評估與適應症表單（步驟 6）
3. **3010a3d** - refactor: 移除外科醫師判定檢查類型
4. **ce78083** - feat: 新增 STS Calculator 連結與手術適應症快捷輸入
5. **2f16257** - fix: 將 STS Calculator 連結移到檢查報告輸入區

**推送**: https://github.com/tnfsp/TAVI.git
**總變更**: 新增 RiskAssessmentForm.tsx，更新 types、store、主頁面

### 系統功能總覽

**可收集的完整資料：**
1. 病患基本資料（姓名、病歷號、性別、年齡、出生日期、身分證號）
2. 病史（9 種可複選）
3. 症狀（8 種可複選 + 發生時間描述）
4. 就醫歷程（追蹤情形 + 就醫經過）
5. 檢查報告（12 種類型，支援文字/圖片/兩者）
6. STS Score（數字 + 截圖）
7. 兩位外科醫師姓名
8. NYHA 心功能分級
9. 手術適應症與緊急性說明
10. 日常生活功能狀態（在 CaseData 結構中，UI 待實作）
11. 預後評估（在 CaseData 結構中，UI 待實作）

**支援的 12 種檢查類型：**
1. 心臟超音波檢查（文字 + 圖片 2+）
2. 心導管檢查（文字）
3. 心電圖 EKG（文字 + 圖片）
4. 胸部 X 光 CXR（文字 + 圖片）
5. 肺功能檢查（文字）
6. 四肢血流探測 ABI（文字）
7. Heart CT（文字）
8. 生理測量（文字）
9. 檢驗報告（圖片）
10. 就醫紀錄（圖片）
11. 就醫用藥（圖片）
12. STS Score（文字 + 圖片）

---

## Session: 2025-12-14 Phase 2 外科醫師評估文件生成

### 變更摘要
- ✅ **Phase 2 完整開發完成**
- ✅ 建立 Claude API 封裝層 (`lib/ai/claude.ts`)
  - 初始化 Anthropic SDK
  - 封裝 `generateText()` 通用函數
  - 實作 `generateSurgeonAssessment()` 專用函數
- ✅ 設計醫師評估摘要 Prompt (`lib/ai/prompts/surgeon-assessment.ts`)
  - 詳細的系統 Prompt，定義輸出格式要求
  - 自動組織病患資料（基本資料、病史、症狀、檢查、風險評估）
  - 參考真實案例（謝式修02759044）設計輸出範本
  - 包含日期轉換（西元→民國年）、年齡計算等輔助函數
- ✅ 建立 AI API Route (`/api/ai/generate-surgeon-assessment`)
  - 接收完整案例資料
  - 呼叫 Claude API 生成摘要段落
  - 錯誤處理與驗證
- ✅ 建立 Word 文件生成功能 (`lib/docx/surgeon-assessment.ts`)
  - 使用 docx.js 建立標準格式文件
  - 文件結構：標題（3 行）+ 副標題 + 摘要段落 + 簽名欄（2 位醫師）
  - 字型設定：標楷體（中文）/ Times New Roman（英文）
  - 行距 1.5 倍、兩端對齊
  - 檔案命名規則：`{姓名}{病歷號} - 二位心臟外科專科醫師判定.docx`
- ✅ 建立 DOCX API Route (`/api/docx/surgeon-assessment`)
  - 接收病患資料與摘要內容
  - 生成 Word 文件 buffer
  - 設定正確的 MIME type 與下載檔名
- ✅ 建立前端 UI 組件 (`SurgeonAssessmentGenerator`)
  - 步驟 1：生成摘要段落按鈕（呼叫 AI API）
  - 步驟 2：下載 Word 文件按鈕
  - 預覽摘要段落內容
  - 前置條件檢查（是否完成必要步驟）
  - 載入狀態與錯誤處理
  - 使用說明與操作指引
- ✅ 更新主頁面 (`app/page.tsx`)
  - 新增步驟 7：生成醫師評估文件
  - 整合 SurgeonAssessmentGenerator 組件
  - 更新進度提示（Phase 2 已完成）
- ✅ Git commit & push
  - Commit: `4cb388c` - feat: 完成 Phase 2 外科醫師評估文件生成功能
  - 推送至 GitHub: https://github.com/tnfsp/TAVI.git

### 決策記錄

#### 1. 採用 Claude 3.5 Sonnet 模型
- **決定**: 使用 `claude-3-5-sonnet-20241022` 模型
- **原因**:
  - Sonnet 3.5 在醫療文書生成上表現優異
  - 成本與效能平衡
  - 支援足夠的 context window (200k tokens)

#### 2. Prompt 設計策略
- **決定**: 採用「系統 Prompt + 結構化 User Prompt」方式
- **原因**:
  - 系統 Prompt 定義角色與輸出格式要求
  - User Prompt 提供完整的結構化資料
  - 提供真實範例作為參考（few-shot learning）
  - 明確要求單一段落輸出，避免分段
  - 強調醫學術語準確性與民國年格式

#### 3. 文件生成流程分為兩階段
- **決定**: AI 生成摘要 → Word 文件生成（分開處理）
- **原因**:
  - 使用者可先預覽摘要內容，確認無誤再下載
  - AI 生成與文件格式化解耦，易於維護
  - 未來可支援手動編輯摘要後再生成文件
  - 降低 API 調用成本（只需調用一次）

#### 4. 使用 docx.js 而非其他方案
- **決定**: 使用 docx.js 生成 Word 文件
- **原因**:
  - 純 JavaScript 實作，可在 Next.js API Route 中運行
  - 支援完整的 Word 格式控制（字型、行距、對齊）
  - 不需要額外的系統依賴（如 LibreOffice）
  - 文件體積小、效能好

#### 5. 前端 UI 採用兩步驟流程
- **決定**: 步驟 1 生成摘要 → 步驟 2 下載文件
- **原因**:
  - 符合使用者心智模型（先確認內容，再下載）
  - 提供即時預覽，增加信任感
  - 若 AI 生成內容有誤，可及早發現
  - 未來可擴充手動編輯功能

### 技術細節

#### Claude API 調用
```typescript
const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 3000,
  system: systemPrompt,  // 定義角色與格式要求
  messages: [{ role: 'user', content: userPrompt }],  // 提供結構化資料
});
```

#### Word 文件結構
```
申請『經導管主動脈瓣膜置換術』（標題，16pt 粗體）
必須至少二位心臟外科專科醫師判定...（標題續行）
置換或開刀危險性過高（標題結束）

TAVI 事前審查（副標題，置中）

[AI 生成的摘要段落]（12pt，1.5 倍行距，兩端對齊）

第一位 心臟外科專科醫師____________________ 日期 __________
第二位 心臟外科專科醫師____________________ 日期 __________
```

#### 檔案命名範例
- 輸入：姓名 `謝式修`、病歷號 `02759044`
- 輸出：`謝式修02759044 - 二位心臟外科專科醫師判定.docx`

### 待辦事項
- [x] 完成 Phase 2 開發
- [x] Git commit & push
- [ ] **Phase 2 完整測試**（下次重點）
  - [ ] 測試 AI 摘要生成功能
  - [ ] 測試 Word 文件下載
  - [ ] 驗證文件格式是否符合健保局要求
  - [ ] 測試各種邊界情況（資料不完整、API 錯誤等）
- [ ] **Phase 3：上傳已簽名的醫師評估文件**
  - [ ] 建立文件上傳組件（PDF/圖片）
  - [ ] 文件預覽功能
  - [ ] 儲存至 LocalStorage
- [ ] **Phase 4：生成完整事前審查申請文件**
  - [ ] 設計 13 個區塊的 Prompt
  - [ ] 實作文件生成邏輯
  - [ ] 嵌入圖片與簽名文件

### 下次啟動重點
1. **測試 Phase 2 功能**:
   - 使用真實資料測試 AI 生成摘要
   - 確認 Word 文件格式正確
   - 驗證檔名與內容
2. **準備 Phase 3**: 討論簽名文件上傳的需求與格式
3. **準備 Phase 4**: 分析完整事前審查文件的結構（13 個區塊）

### 專案狀態
- **Phase 0**: ✅ 完成
- **Phase 1**: ✅ 完成（100%）
- **Phase 2**: ✅ **開發完成**（100%）
  - ✅ Claude API 封裝
  - ✅ 醫師評估 Prompt 設計
  - ✅ AI 摘要生成 API
  - ✅ Word 文件生成功能
  - ✅ 前端 UI 整合
  - ⏳ 功能測試待執行
- **Phase 3-7**: ⏳ 待執行
- **開發伺服器**: ✅ 正常運作（http://localhost:3000）

### Git 記錄
- **Commit**: `4cb388c` - feat: 完成 Phase 2 外科醫師評估文件生成功能
- **推送**: https://github.com/tnfsp/TAVI.git
- **變更檔案**: 9 files changed, 934 insertions(+), 158 deletions(-)
- **新增檔案**:
  - `lib/ai/claude.ts` (Claude API 封裝)
  - `lib/ai/prompts/surgeon-assessment.ts` (Prompt 設計)
  - `app/api/ai/generate-surgeon-assessment/route.ts` (AI API)
  - `lib/docx/surgeon-assessment.ts` (Word 生成)
  - `app/api/docx/surgeon-assessment/route.ts` (DOCX API)
  - `components/document/SurgeonAssessmentGenerator.tsx` (前端組件)
- **修改檔案**:
  - `app/page.tsx` (新增步驟 7)
  - `.claude/docs/IMPLEMENTATION-PLAN.md` (更新進度)

### 效能指標
- AI API 回應時間：預估 3-8 秒（視內容複雜度）
- Word 文件生成時間：< 1 秒
- 文件大小：約 20-30 KB

---

<!-- 新的 session 記錄請加在這裡，格式如下：

## Session: YYYY-MM-DD HH:MM

### 變更摘要
- 完成了什麼

### 決策記錄
- 決定了什麼，為什麼

### 待辦事項
- [ ] 下次要做的事
- [x] 已完成的事（保留追蹤）

-->
