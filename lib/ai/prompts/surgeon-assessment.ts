/**
 * 生成「二位心脏外科专科医师判定」文件的 Prompt
 */

export function generateSurgeonAssessmentPrompt(caseData: any) {
  const systemPrompt = `你是一位专业的医疗文书助理，专门协助撰写 TAVI（经导管主动脉瓣膜置换术）健保事前审查申请文件中的「病患摘要段落」。

你的任务是根据提供的病患资料，生成一个**单一段落**的专业医疗摘要，用于「二位心脏外科专科医师判定」文件。

**格式要求：**
1. 必须是**单一段落**，不分段
2. 使用繁体中文，专业医学用语
3. 按照以下顺序组织内容：
   - 个案基本资料（姓名、病历号、性别、年龄、出生日期、身份证号）
   - History（病史，使用医学英文缩写，用顿号分隔）
   - 就医历程与症状发展（时间序列叙述）
   - 重要检查结果摘要（心脏超音波、心导管等）
   - 外科医师评估（STS score、两位医师姓名）
   - 日常生活功能状态
   - 存活机率评估
   - 手术适应症与紧急性说明
   - 结尾：请求健保局同意

**范例格式参考：**
"个案: [姓名] [病历号]（[性别]）[年龄] 岁 [出生日期], [身份证号]；History：[病史1]、[病史2]、[病史3]，在[追踪地点]追踪。[症状发生时间]开始感[症状]的情形、[就医时间]因[症状]加剧至[地点]就医。于 [日期] 安排心导管检查: [结果摘要]。于 [日期] 心脏超音波：[关键数据]。[近期病情发展]，经二位心脏外科专科医师([医师1],[医师2])评估(STS score >10%)传统手术风险高；病患平时日常生活[功能状态]，临床上判定病人至少有一年以上之存活机率。医病共享决策与家属讨论后决定申请经导管主动脉瓣膜置换手术(TAVI)来改善的症状。由于主动脉瓣膜狭窄的情形(Critical AS) 随时都有猝死的可能，需尽快施行经导管主动脉瓣膜置换术(TAVI)来改善的症状，惠请贵局同意。"

**注意事项：**
- 所有日期使用民国年格式（例如 114/04/21）
- 医学术语保持英文（如 Severe AS, LVEF, CAD 等）
- 数据要精确（如 AVA:0.67cm2, LVEF:32%）
- 语气专业、客观、简洁
- 强调 Critical AS 的紧急性`;

  const userPrompt = buildUserPrompt(caseData);

  return { systemPrompt, userPrompt };
}

function buildUserPrompt(caseData: any): string {
  const { patient, medicalHistory, customHistory, symptoms, customSymptoms, symptomOnset, clinicalCourse, examinations, riskAssessment } = caseData;

  // 1. 基本资料
  const patientInfo = `
个案基本资料：
- 姓名：${patient.name}
- 病历号：${patient.chartNumber}
- 性别：${patient.gender === 'male' ? '男' : '女'}
- 出生日期：${patient.birthDate}（${calculateAge(patient.birthDate)} 岁）
- 身份证号：${patient.nationalId || '无'}
`;

  // 2. 病史
  const historyList = [...medicalHistory];
  if (customHistory) historyList.push(customHistory);
  const history = `
病史 (History)：
${historyList.join('、')}
`;

  // 3. 症状
  const symptomsList = [...symptoms];
  if (customSymptoms) symptomsList.push(customSymptoms);
  const symptomsInfo = `
症状：
${symptomsList.join('、')}
症状发生时间：${symptomOnset || '无记录'}
`;

  // 4. 就医历程
  const clinicalInfo = `
就医历程：
- 原追踪地点：${clinicalCourse.previousCare || '无记录'}
- 就医经过：${clinicalCourse.presentation || '无记录'}
`;

  // 5. 检查报告摘要
  const examinationsInfo = examinations.map((exam: any) => {
    let summary = `\n${getExaminationTypeName(exam.type)}：`;
    if (exam.date) summary += `日期 ${exam.date}`;
    if (exam.textContent) summary += `\n${exam.textContent.substring(0, 200)}...`; // 取前200字
    if (exam.extractedData) {
      summary += `\n关键数据：${JSON.stringify(exam.extractedData)}`;
    }
    return summary;
  }).join('\n');

  // 6. 风险评估
  const riskInfo = `
手术风险评估：
- STS Score：${riskAssessment.stsScore || '无记录'}
- 第一位心脏外科医师：${riskAssessment.surgeon1 || '无'}
- 第二位心脏外科医师：${riskAssessment.surgeon2 || '无'}
- NYHA 心功能分级：${riskAssessment.nyhaClass || '无'}
- 手术适应症与紧急性：${riskAssessment.urgencyReason || '无'}
`;

  // 组合完整的 user prompt
  return `
请根据以下病患资料，生成一个**单一段落**的 TAVI 事前审查摘要：

${patientInfo}
${history}
${symptomsInfo}
${clinicalInfo}
${examinationsInfo}
${riskInfo}

**重要提示：**
1. 请生成**单一段落**，不要分段
2. 按照范例格式组织内容
3. 所有日期转换为民国年格式
4. 保持医学术语的英文缩写
5. 强调 Critical AS 的紧急性，需尽快手术
6. 结尾请写：「惠请贵局同意。」

请开始生成：
`;
}

// 辅助函数：计算年龄
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

// 辅助函数：获取检查类型中文名称
function getExaminationTypeName(type: string): string {
  const typeMap: { [key: string]: string } = {
    'echocardiography': '心脏超音波检查',
    'catheterization': '心导管检查',
    'ekg': '心电图 (EKG)',
    'chest-xray': '胸部 X 光 (CXR)',
    'pulmonary-function': '肺功能检查',
    'abi': '四肢血流探测 (ABI)',
    'heart-ct': 'Heart CT',
    'myocardial-perfusion-scan': '心肌灌注扫描',
    'vital-signs': '生理测量',
    'lab-report': '检验报告',
    'medical-record': '就医纪录',
    'medication-record': '就医用药',
    'list-of-diagnosis': 'List of Diagnosis',
    'assessment-and-plan': 'Assessment and Plan',
    'sts-score': 'STS Score',
  };
  return typeMap[type] || type;
}
