# TAVI 完整事前審查申請文件結構

> 參考範本：範例事前審查文件.pdf（洪范鳳英案例）
> 建立日期：2025-12-14
> 用途：Phase 4 實作完整申請文件生成功能

---

## 文件結構總覽

完整的 TAVI 事前審查申請文件包含 **12 個主要區塊**：

### 1. TAVI 事前審查摘要段落（封面）

**位置**：第 1 頁
**格式**：單一段落
**內容**：
- 標題：「TAVI 事前審查」
- 個案基本資料（姓名、病歷號、性別、年齡、生日、身分證號）
- History（病史，用頓號分隔）
- 就醫追蹤地點
- 症狀發展與就醫歷程（時間序列）
- 關鍵檢查結果摘要
  - 心臟超音波：日期 + 關鍵數據（AVA, Vmax, Peak PG, Mean PG）
  - 心導管：日期 + 關鍵發現
- 外科醫師評估
  - 兩位醫師姓名
  - STS score >10%
  - 傳統手術風險評估
- 醫病共享決策說明
- 日常生活功能狀態
- 存活機率評估
- 手術緊急性說明（Critical AS 隨時可能猝死）
- **結尾**：「惠請貴局同意。」

**範例文字**：
```
個案: 洪范鳳英 04019515（女）85 歲 1940/01/18, N200935271；
History：Severe Aortic stenosis、Hypertension、Hyperlipidemia、
Post thyroidectomy、Left ICA 50~70% Stenosis，在門診追蹤治療；
近期常發生暈眩及暈倒情形；此次於 2025/11/26 因 Syncope 至急診求治...
```

---

### 2. 心臟超音波檢查（Echocardiography）

**位置**：第 1-2 頁
**標題**：「1.心臟超音波檢查」
**內容**：
- 醫院名稱：高雄醫學大學附設中和紀念醫院
- 報告標題：Trans Thoracic Echocardiography Report
- 病患資料區塊
  - 病歷號碼、姓名、性別、出生日期、年齡
  - 身分證號、報告日期、檢查號碼
- 測量數據
  - RVD, IVSd, LVIDd, AoRoot, IVSs, LVIDs 等
  - EF(MM-Teich), LVEDV, LVESV
  - LA volume index, LVMI
- Doppler Finding
  - Trans-mitral inflow: E/A, DT
  - E/E' Med, E/E' Lat, E/E' Avg
- **Valve Analysis**（關鍵！用紅字標註）
  - Very Severe AS(AVA:0.67cm2, Vmax:5.61m/s, Peak PG:126mmHg, Mean PG:76mmHg)
  - Mild TR, Mild MR, Mild AR
  - MV(MVA, Vmax, Peak PG, Mean PG)
- Comments
  - LV systolic function
  - LV diastolic function
  - RV function
  - IVS hypertrophy
- 報告醫師簽名
- **附圖**：心臟超音波影像（多張）

---

### 3. 心導管檢查（Cardiac Catheterization）

**位置**：第 3-4 頁
**標題**：「2. 心導管檢查」
**內容**：
- 醫院名稱 + 報告標題
- 病患資料
- Indication（適應症說明）
- Approach（手術進入方式）
- Catheters（使用的導管）
- Procedure（執行項目）
- Brief Summary
  - Syntax Score = 0
  - LM: No stenosis
  - RCA: No stenosis
  - LAD: No stenosis
  - LCX: No stenosis
- **Severe AS 數據**（用紅字標註）
  - pre-BAV / post-BAV 對比
  - Peak-to-peak, Mean PG, AVA
  - BAV balloon 規格
- Hemodynamic（血流動力學數據）
  - AO Pre., LV Pre., RA, RV, PA, PCW
  - Heart rate, CO, CI, PVR, SVR
- 主治醫師簽名

---

### 4. EKG 心電圖檢查

**位置**：第 4 頁
**標題**：「3. EKG 心電圖檢查」
**內容**：
- 醫院名稱
- 病患資料
- 檢查日期、檢查編號
- 診斷
- EKG Diagnosis（如：Non-Specific ST-T change）
- **附圖**：心電圖影像

---

### 5. Chest X-ray（胸部 X 光）

**位置**：第 5 頁
**標題**：「4. Chest X-ray」
**內容**：
- 醫院名稱 + Plain Film 報告
- 病患資料
- Imaging findings: Chest PA
- Impression（影像發現）
  - Tortuous aorta with atherosclerosis
  - Patch opacities...
  - Spondylosis deformans...
- 報告醫師簽名
- **附圖**：胸部 X 光影像

---

### 6. Heart CT

**位置**：第 5-7 頁
**標題**：「5. Heart CT」
**內容**：
- 醫院名稱 + CT 報告
- 病患資料
- Protocol（檢查方式）
- **Aortic valve/Root measurement**（詳細測量）
  - Annulus diameter: 24x17(20.7) mm
  - Annulus perimetry: 67mm, area:334.5mm^2
  - Sinus of Valsava diameter
  - Sinotubular junction diameter
  - Ascending Aorta diameter
  - LVOT diameter
  - LVEF: 59%
- Length（長度測量）
- Angles（角度）
- Peripheral A. measurement（周邊動脈）
- **心室容積與射出分率**
  - LVEDV, LVESV, LVEF
  - RVEDV, RVESV, RVEF
  - LAEDV, LAESV, LAEF
  - RAEDV, RAESV, RAEF
- 影像發現
  - Calcification of the aortic valves
  - Mitral annular calcification
  - 其他器官發現
- **Impression**（結論）
  1. Aortic valve: Severe calcification, opening:0.63cm^2
  2. Mitral valve: coaptation gap
  3. Preserved ejection fraction
  4-15. 其他發現
- 報告醫師簽名

---

### 7. 生理測量資訊

**位置**：第 8 頁
**標題**：「6. 生理測量資訊」
**內容**：
- BMI: 22.9
- TBSA: 1.54 m2
- IBW: 52.9 公斤
- Height: 155.0 公分
- Weight: 55.0 公斤

---

### 8. 檢驗報告

**位置**：第 8 頁
**標題**：「7. 檢驗報告」
**內容**：
- **附圖**：醫院系統檢驗報告截圖
- 關鍵數值標註（如：GFR: 58.5）
- 包含多項血液、生化、電解質檢查

---

### 9. 就醫紀錄

**位置**：第 9 頁
**標題**：「8. 就醫紀錄」
**內容**：
- 病患背景描述
  - "She is a 85-year-old woman with underlying disease of:"
  - 列出所有相關疾病史（含日期）
- ADL (activities of daily living) 描述
- 病史發展敘述
  - 何時診斷
  - 症狀發展
  - 就醫經過
- 附圖：醫院系統就醫記錄截圖

---

### 10. List of Diagnosis (Problem List)

**位置**：第 9-10 頁
**標題**：「List of Diagnosis (Problem List)」（用紅字）
**內容**：
- **主要診斷**
  - # Severe aortic stenosis
  - 列出所有相關檢查日期與數據
- **急性問題**
  - # Acute respiratory failure, HF related
  - # Acute decompensated heart failure
  - post intubation on XX/XX
- **Underlying disease**（基礎疾病）
  - # Hypertension
  - # Hyperlipidemia
  - # Post thyroidectomy
  - # Left ICA 50~70% Stenosis

---

### 11. Assessment and Plan

**位置**：第 10 頁
**標題**：「Assessment and Plan」（用紅字）
**內容**：
- 針對每個診斷的評估與治療計畫
- 格式：
  ```
  # Severe aortic stenosis
  - 2025/11/27 cardiac echo: Very Severe AS(...)
  - 2025/11/28 CAG: ...
  - 2025/12/01 heart CT: ...

  # Acute respiratory failure
  # Acute decompensated heart failure
  - post intubation on 11/26
  → keep ventilator support
  → monitor respiratory pattern and SpO2
  → Arranged TAVI on 12/04
  ```

---

### 12. STS Score

**位置**：第 10 頁
**標題**：「11. STS Score : Risk of Mortality：13.4%」（用黃底紅字標註）
**內容**：
- **附圖**：STS Risk Calculator 網站截圖
  - 顯示完整的計算界面
  - 標註 Risk of Mortality 百分比
  - Procedure Type: Isolated AVR
  - PERIOPERATIVE OUTCOME
  - Clinical Summary

---

### 13. 二位心臟外科專科醫師判定

**位置**：第 11 頁
**標題**：「12.二位心臟外科專科醫師判定無法以傳統開心手術進行主動脈瓣膜置換或開刀危險性過高」
**內容**：
- **附件**：已簽名的醫師評估文件掃描檔
- 包含：
  - 申請標題（3 行）
  - TAVI 事前審查（副標題）
  - 摘要段落（與第 1 頁相同內容）
  - 兩位醫師簽名欄
    - 第一位 心臟外科專科醫師\_\_\_\_\_ 日期 \_\_\_\_
    - 第二位 心臟外科專科醫師\_\_\_\_\_ 日期 \_\_\_\_
  - 實際簽名和日期

---

## 文件生成邏輯（Phase 4 實作要點）

### 資料來源對應

| 區塊 | 資料來源 | 是否需要 AI |
|------|---------|------------|
| 1. 摘要段落 | 已有（Phase 2）| ✅ 已實作 |
| 2. 心臟超音波 | examinations (type: echocardiography) | ❌ 直接貼上 |
| 3. 心導管 | examinations (type: catheterization) | ❌ 直接貼上 |
| 4. EKG | examinations (type: ekg) | ❌ 直接貼上 |
| 5. Chest X-ray | examinations (type: chest-xray) | ❌ 直接貼上 |
| 6. Heart CT | examinations (type: heart-ct) | ❌ 直接貼上 |
| 7. 生理測量 | examinations (type: vital-signs) | ❌ 直接貼上 |
| 8. 檢驗報告 | examinations (type: lab-report) | ❌ 圖片 |
| 9. 就醫紀錄 | examinations (type: medical-record) | ❌ 圖片 |
| 10. List of Diagnosis | examinations (type: list-of-diagnosis) | ❌ 直接貼上 |
| 11. Assessment and Plan | examinations (type: assessment-and-plan) | ❌ 直接貼上 |
| 12. STS Score | examinations (type: sts-score) + riskAssessment.stsScore | ❌ 文字+圖片 |
| 13. 醫師判定 | Phase 3 上傳的已簽名文件 | ❌ 圖片 |

### 文件格式要點

1. **字型**：
   - 中文：標楷體
   - 英文：Times New Roman
   - 大小：12pt（正文）、14-16pt（標題）

2. **行距**：1.5 倍

3. **對齊**：兩端對齊

4. **分隔線**：使用 `===` 分隔各區塊

5. **標題編號**：1. 2. 3. ... 12.

6. **重點標註**：用紅字標註關鍵數據（AVA, STS Score 等）

---

## Phase 4 實作步驟

### 階段 1：文件生成邏輯
- [ ] 建立 `lib/docx/complete-application.ts`
- [ ] 設計 Word 文件結構（13 個區塊）
- [ ] 實作文字內容插入
- [ ] 實作圖片插入（base64 → Word 圖片）

### 階段 2：API Route
- [ ] 建立 `/api/docx/complete-application/route.ts`
- [ ] 接收完整 caseData + 已簽名文件
- [ ] 呼叫文件生成函數
- [ ] 返回 Word 檔案

### 階段 3：前端 UI
- [ ] 建立 `CompleteApplicationGenerator.tsx` 組件
- [ ] 前置條件檢查（所有必要資料是否完整）
- [ ] 生成按鈕
- [ ] 下載功能
- [ ] 進度提示

### 階段 4：測試
- [ ] 使用範例案例測試
- [ ] 驗證格式正確性
- [ ] 確認所有區塊都有內容
- [ ] 檢查圖片顯示正常

---

## 注意事項

1. **圖片大小**：需要壓縮或調整圖片大小，避免 Word 檔案過大
2. **日期格式**：統一轉換為民國年（YYYY-MM-DD → YYY/MM/DD）
3. **醫學術語**：保持英文原文（AVA, LVEF, STS Score 等）
4. **完整性檢查**：生成前確認所有必要區塊都有資料
5. **錯誤處理**：缺少某些區塊時應給予提示，而非直接失敗

---

## 參考資料

- 範本文件：`範例事前審查文件.pdf`
- 案例：洪范鳳英 04019515
- 醫院：高雄醫學大學附設中和紀念醫院
- STS Score: 13.4%
- 手術日期：2025/12/04
