/**
 * 生成「二位心臟外科專科醫師判定」文件的 Prompt
 */

export function generateSurgeonAssessmentPrompt(caseData: any) {
  const systemPrompt = `你是一位專業的台灣醫療文書助理，專門協助撰寫 TAVI（經導管主動脈瓣膜置換術）全民健康保險事前審查申請文件。

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
2. History：病史（用頓號分隔，使用通順的中文表達即可，如「主動脈瓣膜嚴重狹窄」、「高血壓」、「高血脂」等）
3. 就醫歷程：在何處追蹤、症狀發生時間、就醫經過
4. 重要檢查結果：心臟超音波、心導管等關鍵數據
5. 外科醫師評估：兩位醫師姓名、STS score
6. 預後評估：日常生活功能、存活機率
7. 手術必要性：強調 Critical AS 的緊急性
8. 結尾：「惠請貴局同意。」

**參考範例（僅供格式參考）**：
「個案：洪范鳳英 04019515（女）85 歲，114/01/18 生，身分證號 N200935271；病史包含主動脈瓣膜嚴重狹窄、高血壓、高血脂，長期於門診追蹤治療；近期常發生暈眩及暈倒情形，此次於 114/11/26 因暈厥至急診求治。於 114/11/27 心臟超音波檢查顯示極重度主動脈瓣膜狹窄（AVA:0.67cm², Vmax:5.61m/s, peak pressure gradient:126mmHg, mean pressure gradient:76mmHg），於 114/11/28 安排心導管檢查，冠狀動脈無明顯狹窄。經二位心臟外科專科醫師（XXX、XXX）評估，STS score 13.4%，傳統開心手術風險過高；病患平時日常生活尚可自理，臨床上判定病患至少有一年以上之存活機率。經醫病共享決策與家屬討論後，決定申請經導管主動脈瓣膜置換手術（TAVI）。由於主動脈瓣膜重度狹窄（Critical AS）隨時都有猝死的可能，需儘速施行 TAVI 手術以改善症狀，惠請貴局同意。」

**格式細節**：
- 日期統一使用民國年（例如：114/11/26）
- 醫學術語保持英文（Severe AS、LVEF、AVA 等）
- 數值要精確且帶單位（如 AVA:0.67cm²）
- 使用頓號「、」分隔並列項目
- 語氣專業、客觀、簡潔`;

  const userPrompt = buildUserPrompt(caseData);

  return { systemPrompt, userPrompt };
}

function buildUserPrompt(caseData: any): string {
  const { patient, medicalHistory, customHistory, symptoms, customSymptoms, symptomOnset, clinicalCourse, examinations, riskAssessment, functionalStatus, prognosis } = caseData;

  // 1. 基本資料
  const patientInfo = `
📋 **個案基本資料**：
- 姓名：${patient.name}
- 病歷號：${patient.chartNumber}
- 性別：${patient.gender === 'male' ? '男' : '女'}
- 年齡：${calculateAge(patient.birthDate)} 歲
- 出生日期：${formatToROCDate(patient.birthDate)}
- 身分證號：${patient.nationalId || '（未提供）'}
`;

  // 2. 病史
  const historyList = [...medicalHistory];
  if (customHistory && customHistory.trim()) historyList.push(customHistory);
  const history = historyList.length > 0 ? `
📝 **病史 (History)**：
${historyList.join('、')}
` : '';

  // 3. 症狀
  const symptomsList = [...symptoms];
  if (customSymptoms && customSymptoms.trim()) symptomsList.push(customSymptoms);
  const symptomsInfo = symptomsList.length > 0 || symptomOnset ? `
🩺 **症狀表現**：
- 主要症狀：${symptomsList.join('、') || '（未記錄）'}
- 症狀發生時間：${symptomOnset || '（未記錄）'}
` : '';

  // 4. 就醫歷程
  const clinicalInfo = (clinicalCourse.previousCare || clinicalCourse.presentation) ? `
🏥 **就醫歷程**：
${clinicalCourse.previousCare ? `- 原追蹤地點：${clinicalCourse.previousCare}` : ''}
${clinicalCourse.presentation ? `- 就醫經過：${clinicalCourse.presentation}` : ''}
` : '';

  // 5. 重要檢查報告摘要（只顯示關鍵檢查）
  const keyExamTypes = ['echocardiography', 'catheterization', 'heart-ct'];
  const keyExams = examinations.filter((exam: any) => keyExamTypes.includes(exam.type));
  const examinationsInfo = keyExams.length > 0 ? `
🔬 **重要檢查結果**：
${keyExams.map((exam: any) => {
    let summary = `- ${getExaminationTypeName(exam.type)}`;
    if (exam.date) summary += `（${formatToROCDate(exam.date)}）`;
    if (exam.textContent) {
      // 提取關鍵資訊
      const text = exam.textContent;
      if (exam.type === 'echocardiography') {
        // 提取 AVA, Vmax, Peak PG, Mean PG 等關鍵數據
        const avaMatch = text.match(/AVA[:\s]*([0-9.]+)\s*cm/i);
        const vmaxMatch = text.match(/Vmax[:\s]*([0-9.]+)\s*m\/s/i);
        const peakMatch = text.match(/Peak\s*PG[:\s]*([0-9.]+)\s*mmHg/i);
        const meanMatch = text.match(/Mean\s*PG[:\s]*([0-9.]+)\s*mmHg/i);

        if (avaMatch || vmaxMatch || peakMatch || meanMatch) {
          summary += '：';
          const findings = [];
          if (avaMatch) findings.push(`AVA:${avaMatch[1]}cm²`);
          if (vmaxMatch) findings.push(`Vmax:${vmaxMatch[1]}m/s`);
          if (peakMatch) findings.push(`Peak PG:${peakMatch[1]}mmHg`);
          if (meanMatch) findings.push(`Mean PG:${meanMatch[1]}mmHg`);
          summary += findings.join(', ');
        }
      } else if (exam.type === 'catheterization') {
        // 提取冠狀動脈狹窄資訊
        if (text.includes('No stenosis') || text.includes('no stenosis')) {
          summary += '：冠狀動脈無明顯狹窄';
        }
      }
    }
    return summary;
  }).join('\n')}
` : '';

  // 6. 風險評估與手術計畫
  const riskInfo = `
⚠️ **手術風險評估**：
- STS Score：${riskAssessment.stsScore || '（未提供）'}
- 第一位心臟外科醫師：${riskAssessment.surgeon1 || '（未提供）'}
- 第二位心臟外科醫師：${riskAssessment.surgeon2 || '（未提供）'}
${riskAssessment.nyhaClass ? `- NYHA 心功能分級：Class ${riskAssessment.nyhaClass}` : ''}
${functionalStatus ? `- 日常生活功能：${functionalStatus}` : ''}
${prognosis ? `- 預後評估：${prognosis}` : ''}
${riskAssessment.urgencyReason ? `- 手術緊急性：${riskAssessment.urgencyReason}` : ''}
`;

  // 組合完整的 user prompt
  return `
請根據以下真實病患資料，生成一個**單一段落**的 TAVI 事前審查摘要。

${patientInfo}
${history}
${symptomsInfo}
${clinicalInfo}
${examinationsInfo}
${riskInfo}

🎯 **生成指示**：
1. **必須是單一段落**，不要分段或使用項目符號
2. 按照範例格式流暢地串接內容
3. **只使用上述提供的真實資料**，絕對不可捏造或臆測
4. 如果某項資料標註為「（未提供）」或「（未記錄）」，請省略該部分
5. 日期已轉為民國年，請直接使用
6. **病史（History）用通順的中文表達即可**
7. **檢查結果用中文描述重要發現，關鍵數值用括號標註**
   - 例如：「心臟超音波檢查顯示極重度主動脈瓣膜狹窄（AVA:0.67cm², mean pressure gradient:76mmHg）」
   - 數值保持英文術語（AVA、Vmax、Peak PG、Mean PG 等）
8. 語句要通順自然，符合台灣醫療文書習慣
9. 強調主動脈瓣膜狹窄（Critical AS）的緊急性
10. 結尾必須寫：「惠請貴局同意。」

請開始生成摘要：
`;
}

// 輔助函數：計算年齡
function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// 輔助函數：轉換為民國年日期
function formatToROCDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const rocYear = date.getFullYear() - 1911;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${rocYear}/${month}/${day}`;
  } catch (error) {
    return dateString; // 如果轉換失敗，返回原始字串
  }
}

// 輔助函數：獲取檢查類型中文名稱
function getExaminationTypeName(type: string): string {
  const typeMap: { [key: string]: string } = {
    'echocardiography': '心臟超音波檢查',
    'catheterization': '心導管檢查',
    'ekg': '心電圖',
    'chest-xray': '胸部 X 光',
    'pulmonary-function': '肺功能檢查',
    'abi': '四肢血流探測',
    'heart-ct': 'Heart CT',
    'myocardial-perfusion-scan': '心肌灌注掃描',
    'vital-signs': '生理測量',
    'lab-report': '檢驗報告',
    'medical-record': '就醫紀錄',
    'medication-record': '就醫用藥',
    'list-of-diagnosis': 'List of Diagnosis',
    'assessment-and-plan': 'Assessment and Plan',
    'sts-score': 'STS Score',
  };
  return typeMap[type] || type;
}
