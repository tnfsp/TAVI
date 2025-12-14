// 病患基本資料
export interface PatientInfo {
  name: string
  chartNumber: string
  gender: 'male' | 'female'
  age: number
  birthDate: string // YYYY-MM-DD
  nationalId: string
}

// 病史選項（根據 PRD.md）
export type MedicalHistoryType =
  | 'Aortic stenosis'
  | 'Atrial fibrillation'
  | 'Hypertension'
  | 'Type 2 diabetes'
  | 'Hyperlipidemia'
  | 'CAD'
  | 'CKD'
  | 'HFrEF'
  | 'HFpEF'
  | 'COPD'

// 症狀選項（根據 PRD.md）
export type SymptomType =
  | 'dyspnea'
  | 'dizziness'
  | 'chest discomfort'
  | 'hypotension'
  | 'orthopnea'
  | 'weakness'
  | 'syncope'
  | 'decreased exercise tolerance'

// 症狀標籤對照（中英文）
export const SYMPTOM_LABELS: Record<SymptomType, string> = {
  'dyspnea': '呼吸困難',
  'dizziness': '頭暈',
  'chest discomfort': '胸悶',
  'hypotension': '低血壓',
  'orthopnea': '端坐呼吸',
  'weakness': '虛弱',
  'syncope': '暈厥',
  'decreased exercise tolerance': '運動耐力下降',
}

// 病史標籤對照
export const MEDICAL_HISTORY_LABELS: Record<MedicalHistoryType, string> = {
  'Aortic stenosis': '主動脈瓣膜狹窄',
  'Atrial fibrillation': '心房顫動',
  'Hypertension': '高血壓',
  'Type 2 diabetes': '第二型糖尿病',
  'Hyperlipidemia': '高血脂',
  'CAD': '冠狀動脈疾病',
  'CKD': '慢性腎臟病',
  'HFrEF': '射出分率降低型心臟衰竭',
  'HFpEF': '射出分率保留型心臟衰竭',
  'COPD': '慢性阻塞性肺病',
}

// 就醫歷程
export interface ClinicalCourse {
  previousCare: string // 之前在哪裡追蹤
  presentation: string // 就醫經過
}

// 檢查類型
export type ExaminationType = 'echocardiography' | 'catheterization'

// 心臟超音波數據
export interface EchocardiographyData {
  AVA: string | null // Aortic Valve Area
  Vmax: string | null // Peak velocity
  PeakPG: string | null // Peak pressure gradient
  MeanPG: string | null // Mean pressure gradient
  LVEF: string | null // Left ventricular ejection fraction
}

// 心導管檢查數據
export interface CatheterizationData {
  AVA: string | null
  MeanGradient: string | null // Mean pressure gradient (AO-LV)
}

// 檢查報告
export interface Examination {
  id: string
  type: ExaminationType
  date: string // YYYY-MM-DD
  imageUrl?: string // base64 或 blob URL
  data: EchocardiographyData | CatheterizationData
  confidence?: number // AI 信心度 (0-1)
  notes?: string
}

// 手術風險評估
export interface RiskAssessment {
  stsScore: number // STS Score
  surgeon1: string // 第一位外科醫師
  surgeon2: string // 第二位外科醫師
}

// 完整案例資料
export interface CaseData {
  id: string
  createdAt: string
  updatedAt: string
  patient: PatientInfo
  medicalHistory: MedicalHistoryType[]
  symptoms: SymptomType[]
  symptomOnset: string // 症狀發生時間描述
  clinicalCourse: ClinicalCourse
  examinations: Examination[]
  riskAssessment: RiskAssessment
  functionalStatus: string // 日常生活狀態
  prognosis: string // 預後評估
  generatedDocument?: string // 生成的文件內容
}

// 表單狀態（用於多步驟表單）
export interface FormState {
  currentStep: number
  isComplete: boolean
}
