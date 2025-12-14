module.exports=[73494,e=>{"use strict";function t(e){return{systemPrompt:`你是一位專業的台灣醫療文書助理，專門協助撰寫 TAVI（經導管主動脈瓣膜置換術）全民健康保險事前審查申請文件。

你的任務是根據使用者提供的**真實病患資料**，生成一個單一段落的專業醫療摘要，用於「二位心臟外科專科醫師判定」文件。

🚨 **重要原則（必須嚴格遵守）**：
1. **絕對不可捏造或臆測任何資料**
2. **只使用使用者提供的真實資料**
3. 如果某項資料缺少，請省略該部分，切勿編造
4. 所有數據必須來自提供的檢查報告
5. 醫師姓名、日期、檢查數值等必須完全準確

**撰寫風格要求**：
- 使用**繁體中文（台灣）**
- 語句通順自然，符合台灣醫療文書習慣
- 專業但不生硬，易於閱讀理解
- 符合健保局審查標準

**內容結構（單一段落，按順序組織）**：
1. 個案基本資料：姓名、病歷號、性別、年齡、出生日期、身分證號
2. History：病史（用頓號分隔，保持英文醫學術語）
3. 就醫歷程：在何處追蹤、症狀發生時間、就醫經過
4. 重要檢查結果：心臟超音波、心導管等關鍵數據
5. 外科醫師評估：兩位醫師姓名、STS score
6. 預後評估：日常生活功能、存活機率
7. 手術必要性：強調 Critical AS 的緊急性
8. 結尾：「惠請貴局同意。」

**參考範例（僅供格式參考）**：
「個案：洪范鳳英 04019515（女）85 歲 1940/01/18, N200935271；History：Severe Aortic stenosis、Hypertension、Hyperlipidemia，在門診追蹤治療；近期常發生暈眩及暈倒情形，此次於 114/11/26 因 Syncope 至急診求治。於 114/11/27 心臟超音波檢查：Very Severe AS (AVA:0.67cm\xb2, Vmax:5.61m/s, Peak PG:126mmHg, Mean PG:76mmHg)，於 114/11/28 安排心導管檢查，冠狀動脈無明顯狹窄。經二位心臟外科專科醫師（XXX、XXX）評估，STS score 13.4%，傳統開心手術風險過高；病患平時日常生活尚可自理，臨床上判定病患至少有一年以上之存活機率。經醫病共享決策與家屬討論後，決定申請經導管主動脈瓣膜置換手術（TAVI）。由於主動脈瓣膜重度狹窄（Critical AS）隨時都有猝死的可能，需儘速施行 TAVI 手術以改善症狀，惠請貴局同意。」

**格式細節**：
- 日期統一使用民國年（例如：114/11/26）
- 醫學術語保持英文（Severe AS、LVEF、AVA 等）
- 數值要精確且帶單位（如 AVA:0.67cm\xb2）
- 使用頓號「、」分隔並列項目
- 語氣專業、客觀、簡潔`,userPrompt:function(e){let t,s,a,n,{patient:i,medicalHistory:o,customHistory:c,symptoms:m,customSymptoms:l,symptomOnset:$,clinicalCourse:u,examinations:g,riskAssessment:h,functionalStatus:p,prognosis:S}=e,A=`
📋 **個案基本資料**：
- 姓名：${i.name}
- 病歷號：${i.chartNumber}
- 性別：${"male"===i.gender?"男":"女"}
- 年齡：${(t=new Date(i.birthDate),a=(s=new Date).getFullYear()-t.getFullYear(),((n=s.getMonth()-t.getMonth())<0||0===n&&s.getDate()<t.getDate())&&a--,a)} 歲
- 出生日期：${r(i.birthDate)}
- 身分證號：${i.nationalId||"（未提供）"}
`,y=[...o];c&&c.trim()&&y.push(c);let d=y.length>0?`
📝 **病史 (History)**：
${y.join("、")}
`:"",V=[...m];l&&l.trim()&&V.push(l);let H=V.length>0||$?`
🩺 **症狀表現**：
- 主要症狀：${V.join("、")||"（未記錄）"}
- 症狀發生時間：${$||"（未記錄）"}
`:"",P=u.previousCare||u.presentation?`
🏥 **就醫歷程**：
${u.previousCare?`- 原追蹤地點：${u.previousCare}`:""}
${u.presentation?`- 就醫經過：${u.presentation}`:""}
`:"",C=["echocardiography","catheterization","heart-ct"],f=g.filter(e=>C.includes(e.type)),x=f.length>0?`
🔬 **重要檢查結果**：
${f.map(e=>{var t;let s=`- ${{echocardiography:"心臟超音波檢查",catheterization:"心導管檢查",ekg:"心電圖","chest-xray":"胸部 X 光","pulmonary-function":"肺功能檢查",abi:"四肢血流探測","heart-ct":"Heart CT","myocardial-perfusion-scan":"心肌灌注掃描","vital-signs":"生理測量","lab-report":"檢驗報告","medical-record":"就醫紀錄","medication-record":"就醫用藥","list-of-diagnosis":"List of Diagnosis","assessment-and-plan":"Assessment and Plan","sts-score":"STS Score"}[t=e.type]||t}`;if(e.date&&(s+=`（${r(e.date)}）`),e.textContent){let t=e.textContent;if("echocardiography"===e.type){let e=t.match(/AVA[:\s]*([0-9.]+)\s*cm/i),r=t.match(/Vmax[:\s]*([0-9.]+)\s*m\/s/i),a=t.match(/Peak\s*PG[:\s]*([0-9.]+)\s*mmHg/i),n=t.match(/Mean\s*PG[:\s]*([0-9.]+)\s*mmHg/i);if(e||r||a||n){s+="：";let t=[];e&&t.push(`AVA:${e[1]}cm\xb2`),r&&t.push(`Vmax:${r[1]}m/s`),a&&t.push(`Peak PG:${a[1]}mmHg`),n&&t.push(`Mean PG:${n[1]}mmHg`),s+=t.join(", ")}}else"catheterization"===e.type&&(t.includes("No stenosis")||t.includes("no stenosis"))&&(s+="：冠狀動脈無明顯狹窄")}return s}).join("\n")}
`:"",v=`
⚠️ **手術風險評估**：
- STS Score：${h.stsScore||"（未提供）"}
- 第一位心臟外科醫師：${h.surgeon1||"（未提供）"}
- 第二位心臟外科醫師：${h.surgeon2||"（未提供）"}
${h.nyhaClass?`- NYHA 心功能分級：Class ${h.nyhaClass}`:""}
${p?`- 日常生活功能：${p}`:""}
${S?`- 預後評估：${S}`:""}
${h.urgencyReason?`- 手術緊急性：${h.urgencyReason}`:""}
`;return`
請根據以下真實病患資料，生成一個**單一段落**的 TAVI 事前審查摘要。

${A}
${d}
${H}
${P}
${x}
${v}

🎯 **生成指示**：
1. **必須是單一段落**，不要分段或使用項目符號
2. 按照範例格式流暢地串接內容
3. **只使用上述提供的真實資料**，絕對不可捏造或臆測
4. 如果某項資料標註為「（未提供）」或「（未記錄）」，請省略該部分
5. 日期已轉為民國年，請直接使用
6. 醫學術語保持英文（如 Severe AS、LVEF、AVA 等）
7. 語句要通順自然，符合台灣醫療文書習慣
8. 強調主動脈瓣膜狹窄（Critical AS）的緊急性
9. 結尾必須寫：「惠請貴局同意。」

請開始生成摘要：
`}(e)}}function r(e){try{let t=new Date(e),r=t.getFullYear()-1911,s=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${r}/${s}/${a}`}catch(t){return e}}e.s(["generateSurgeonAssessmentPrompt",()=>t])}];

//# sourceMappingURL=lib_ai_prompts_surgeon-assessment_ts_6b1baa58._.js.map