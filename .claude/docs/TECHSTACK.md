# 技術棧 (Tech Stack)

> 由 `/concept` 維護

---

## 總覽

本專案採用 **Next.js 全端框架**，搭配 **Claude AI API** 實現醫學影像數據提取與文件生成功能。選擇以 **Vercel** 部署，確保簡單快速的上線流程。所有病患資料存儲於用戶瀏覽器本地（LocalStorage/IndexedDB），無需後端資料庫，最大程度保護隱私。

**技術定位**：輕量級、快速開發、易於維護、重視隱私

---

## 前端

### 框架/函式庫

#### **Next.js 15 (App Router)** ✅
- **版本**: 15.x (最新穩定版)
- **理由**:
  - Vercel 原生支援，部署零配置
  - App Router 提供更好的開發體驗
  - 內建 API Routes，無需額外後端
  - Server Components 優化效能
  - 檔案系統路由，結構清晰

#### **React 18**
- **版本**: 18.x
- **理由**:
  - Next.js 的基礎框架
  - 豐富的生態系統
  - 易於找到解決方案和範例

#### **TypeScript**
- **版本**: 5.x
- **理由**:
  - 類型安全，減少錯誤
  - 更好的 IDE 支援
  - 醫療數據結構化管理
  - 團隊協作更容易

### UI 組件庫

#### **Shadcn/ui** ✅ (推薦)
- **理由**:
  - 基於 Radix UI，無障礙性佳
  - 組件代碼在專案內，完全可控
  - 設計簡潔專業，適合醫療系統
  - 與 Tailwind CSS 完美整合
  - 無需額外 bundle size

#### **Radix UI Primitives**
- 作為 Shadcn/ui 的底層
- 提供無障礙的基礎組件

### 樣式方案

#### **Tailwind CSS** ✅
- **版本**: 3.x
- **理由**:
  - 快速開發 UI
  - Utility-first，靈活度高
  - 內建響應式設計
  - 與 Next.js 整合良好
  - 檔案大小優化（purge CSS）

### 表單管理

#### **React Hook Form** ✅
- **版本**: 7.x
- **理由**:
  - 效能優異（無需過多 re-render）
  - API 簡潔易用
  - 內建表單驗證
  - 支援複雜表單結構
  - TypeScript 支援完整

#### **Zod** (搭配 React Hook Form)
- **版本**: 3.x
- **理由**:
  - Schema 驗證
  - 與 TypeScript 完美整合
  - 清晰的錯誤訊息

### 狀態管理

#### **Zustand** ✅
- **版本**: 4.x
- **理由**:
  - 輕量級（~1KB）
  - API 簡單直覺
  - 無需 Provider 包裹
  - TypeScript 支援良好
  - 適合中小型專案

**管理的狀態**:
- 當前編輯中的案例
- 上傳的圖片暫存
- 提取的數據暫存
- UI 狀態（載入中、錯誤提示）

### 文件編輯器

#### **Tiptap** ✅
- **版本**: 2.x
- **理由**:
  - 基於 ProseMirror，功能強大
  - WYSIWYG 所見即所得
  - 支援 Markdown
  - 可自訂工具列
  - TypeScript 支援

**替代方案**: Lexical (Meta 開源)

### 檔案處理

#### **docx.js** ✅
- **版本**: 8.x
- **理由**:
  - 純前端生成 Word 文件
  - 無需後端處理
  - 支援完整 .docx 格式
  - 可控制樣式、段落、表格

#### **Browser Image Compression**
- 壓縮上傳的截圖，降低儲存空間

---

## 後端

### 架構

#### **Next.js API Routes (Serverless Functions)** ✅
- **理由**:
  - 無需獨立後端伺服器
  - 與前端代碼同一專案
  - Vercel 自動部署為 Serverless Function
  - 簡化開發與部署流程

### API 端點設計

```
/api/ai/extract-data     - 提取醫學數據
/api/ai/generate-document - 生成申請文件
/api/ai/detect-date      - 識別檢查日期
```

### AI 整合

#### **Claude API (Anthropic)** ✅
- **模型**: Claude 3.5 Sonnet
- **SDK**: @anthropic-ai/sdk
- **理由**:
  - 強大的 Vision 能力，可讀取醫學影像
  - 醫學術語理解能力優異
  - 支援結構化輸出（JSON）
  - Zero data retention 政策，保護隱私
  - 長 context window（200K tokens）

**API 使用方式**:
- 數據提取：傳送截圖 base64 + prompt
- 文件生成：傳送結構化數據 + 範本
- 日期識別：傳送截圖局部 + 簡短 prompt

---

## 資料儲存

### **LocalStorage** ✅ (主要)
- **用途**: 儲存案例 metadata 和文字資料
- **容量**: ~5-10MB
- **理由**:
  - 無需後端資料庫
  - 操作簡單
  - 隱私保護（資料不離開用戶設備）

### **IndexedDB** (可選)
- **用途**: 儲存截圖 base64（如需要）
- **容量**: ~50MB+
- **理由**:
  - 可儲存更大量資料
  - 非同步操作，不阻塞 UI

### 資料結構設計

```typescript
// LocalStorage Key 設計
'tavi-cases': Array<CaseMetadata>  // 案例列表
'tavi-case-{id}': CaseData         // 完整案例資料
'tavi-settings': UserSettings      // 用戶設定
```

---

## 開發工具

### 程式碼品質

#### **TypeScript**
- 全專案使用嚴格模式
- 定義完整的型別（Patient, Examination, Case）

#### **ESLint**
- 使用 Next.js 預設配置
- 額外規則：
  - `no-console` (production)
  - `react/jsx-no-target-blank`

#### **Prettier**
- 統一代碼格式
- 整合到 Git pre-commit hook

### 測試框架

#### **Vitest** (推薦)
- 快速的單元測試
- 與 Vite 整合良好

#### **Playwright** (E2E 測試)
- 測試完整使用流程
- 跨瀏覽器測試

### 版本控制

- **Git**
- **GitHub** (程式碼託管)
- **Git Flow** 分支策略:
  - `main`: 正式版本
  - `develop`: 開發分支
  - `feature/*`: 功能開發

---

## 部署環境

### 雲端服務

#### **Vercel** ✅ (指定)
- **理由**:
  - 用戶指定
  - Next.js 原生支援
  - 自動 CI/CD
  - 免費額度充足
  - 全球 CDN
  - 零配置部署

**部署流程**:
```
git push → GitHub → Vercel 自動部署 → 產生預覽 URL
```

### 環境變數管理

```env
ANTHROPIC_API_KEY=sk-xxx  # Claude API Key
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### CI/CD

- **GitHub Actions** (可選)
  - 自動執行 TypeScript 檢查
  - 自動執行測試
  - 自動 build 驗證

---

## 選擇原因

| 技術 | 選擇原因 |
|------|----------|
| **Next.js 15** | Vercel 部署零配置、App Router 提升開發體驗、內建 API Routes 無需獨立後端 |
| **TypeScript** | 醫療數據結構化、類型安全減少錯誤、更好的開發體驗 |
| **Tailwind CSS** | 快速開發 UI、與 Next.js 整合良好、檔案大小優化 |
| **Shadcn/ui** | 專業設計、無障礙性、組件可控、無需額外 bundle size |
| **React Hook Form** | 效能優異、API 簡潔、支援複雜表單 |
| **Zustand** | 輕量級、簡單易用、適合中小型專案 |
| **Tiptap** | 強大的 WYSIWYG 編輯器、可自訂、TypeScript 支援 |
| **docx.js** | 純前端生成 Word、無需後端、完整格式支援 |
| **Claude API** | 強大 Vision 能力、醫學理解優異、隱私保護 |
| **LocalStorage** | 無需後端資料庫、隱私保護、操作簡單 |
| **Vercel** | 用戶指定、自動部署、免費額度充足 |

---

## 專案結構

```
tavi-application/
├── app/                      # Next.js App Router
│   ├── page.tsx             # 首頁（案例列表）
│   ├── new/                 # 新增案例
│   │   └── page.tsx
│   ├── case/[id]/           # 編輯案例
│   │   └── page.tsx
│   ├── api/                 # API Routes
│   │   └── ai/
│   │       ├── extract-data/route.ts
│   │       ├── generate-document/route.ts
│   │       └── detect-date/route.ts
│   └── layout.tsx           # 根 Layout
├── components/              # React 組件
│   ├── ui/                  # Shadcn/ui 組件
│   ├── forms/               # 表單組件
│   ├── upload/              # 上傳組件
│   └── editor/              # 編輯器組件
├── lib/                     # 工具函數
│   ├── ai/                  # AI 相關
│   │   ├── claude.ts        # Claude API 封裝
│   │   └── prompts.ts       # Prompt 模板
│   ├── storage/             # LocalStorage 封裝
│   ├── docx/                # Word 文件生成
│   └── utils.ts             # 通用工具
├── types/                   # TypeScript 型別定義
│   ├── case.ts
│   ├── patient.ts
│   └── examination.ts
├── store/                   # Zustand Store
│   └── case-store.ts
├── public/                  # 靜態資源
└── package.json
```

---

## 開發環境需求

### 本機開發

- **Node.js**: 18.x 或 20.x (LTS)
- **npm**: 9.x+ 或 **pnpm**: 8.x+ (推薦)
- **作業系統**: Windows 10/11, macOS 12+, Linux

### 環境設定

```bash
# 安裝依賴
pnpm install

# 設定環境變數
cp .env.example .env.local
# 編輯 .env.local 填入 ANTHROPIC_API_KEY

# 啟動開發伺服器
pnpm dev

# 建構正式版本
pnpm build

# 本機測試正式版本
pnpm start
```

---

## 效能優化策略

### 圖片處理

1. **上傳時壓縮**: 限制單張圖片 < 2MB
2. **Lazy Loading**: 使用 Next.js Image 組件
3. **Progressive JPEG**: 漸進式載入

### 代碼優化

1. **Code Splitting**: Next.js 自動處理
2. **Tree Shaking**: 移除未使用的代碼
3. **Bundle Analysis**: 使用 `@next/bundle-analyzer`

### AI API 優化

1. **Prompt 優化**: 減少 token 使用量
2. **並行處理**: 多張圖片同時提取
3. **快取**: 相同圖片避免重複呼叫

---

## 安全性考量

### 前端

1. **輸入驗證**: Zod schema 驗證所有表單輸入
2. **XSS 防護**: React 自動轉義輸出
3. **HTTPS**: Vercel 自動啟用

### API

1. **Rate Limiting**: 限制 API 呼叫頻率
2. **環境變數**: API Key 不暴露到前端
3. **CORS**: 限制 API 來源

### 隱私保護

1. **本地儲存**: 資料不上傳到伺服器
2. **Claude API**: Zero data retention
3. **無追蹤**: 不使用 Google Analytics 等追蹤工具

---

## 未來技術擴展

### 可能的技術升級

- **PWA**: 離線使用支援
- **Web Worker**: 背景處理圖片壓縮
- **WebAssembly**: 更快的圖片處理
- **PostgreSQL**: 多用戶支援時需要資料庫
- **NextAuth.js**: 登入功能
- **Prisma**: ORM 資料庫管理

---

## 變更記錄

| 日期 | 變更內容 |
|------|----------|
| 2025-12-14 | 初版建立：確定使用 Next.js 15 + Claude API + Vercel 部署 |
