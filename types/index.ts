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

// 檢查類型（完整版）
export type ExaminationType =
  | 'echocardiography'        // 心臟超音波
  | 'catheterization'         // 心導管檢查
  | 'ekg'                     // 心電圖
  | 'chest-xray'              // 胸部 X 光
  | 'pulmonary-function'      // 肺功能檢查
  | 'abi'                     // 四肢血流探測
  | 'heart-ct'                // Heart CT
  | 'myocardial-perfusion-scan' // 心肌灌注掃描
  | 'vital-signs'             // 生理測量
  | 'lab-report'              // 檢驗報告
  | 'medical-record'          // 就醫紀錄
  | 'medication-record'       // 就醫用藥
  | 'list-of-diagnosis'       // List of Diagnosis
  | 'assessment-and-plan'     // Assessment and Plan
  | 'sts-score'               // STS Score

// 檢查類型標籤
export const EXAMINATION_LABELS: Record<ExaminationType, string> = {
  'echocardiography': '心臟超音波檢查',
  'catheterization': '心導管檢查',
  'ekg': '心電圖（EKG）',
  'chest-xray': '胸部 X 光（CXR）',
  'pulmonary-function': '肺功能檢查',
  'abi': '四肢血流探測（ABI）',
  'heart-ct': 'Heart CT',
  'myocardial-perfusion-scan': '心肌灌注掃描',
  'vital-signs': '生理測量',
  'lab-report': '檢驗報告',
  'medical-record': '就醫紀錄',
  'medication-record': '就醫用藥',
  'list-of-diagnosis': 'List of Diagnosis',
  'assessment-and-plan': 'Assessment and Plan',
  'sts-score': 'STS Score',
}

// 檢查輸入方式配置
export interface ExaminationInputConfig {
  hasText: boolean      // 是否需要文字輸入
  hasImages: boolean    // 是否需要圖片上傳
  minImages?: number    // 最少圖片數量
  placeholder?: string  // 文字框提示
}

export const EXAMINATION_INPUT_CONFIG: Record<ExaminationType, ExaminationInputConfig> = {
  'echocardiography': {
    hasText: true,
    hasImages: true,
    placeholder: '請貼上心臟超音波報告全文...',
  },
  'catheterization': {
    hasText: true,
    hasImages: false,
    placeholder: '請貼上心導管檢查報告內容...',
  },
  'ekg': {
    hasText: true,
    hasImages: true,
    placeholder: '請貼上 EKG 報告內容...',
  },
  'chest-xray': {
    hasText: true,
    hasImages: true,
    placeholder: '請貼上胸部 X 光報告內容...',
  },
  'pulmonary-function': {
    hasText: true,
    hasImages: false,
    placeholder: '請貼上肺功能檢查報告內容...',
  },
  'abi': {
    hasText: true,
    hasImages: false,
    placeholder: '請貼上四肢血流探測報告內容...',
  },
  'heart-ct': {
    hasText: true,
    hasImages: false,
    placeholder: '請貼上 Heart CT 報告內容...',
  },
  'myocardial-perfusion-scan': {
    hasText: true,
    hasImages: true,
    placeholder: '請貼上心肌灌注掃描報告內容...',
  },
  'vital-signs': {
    hasText: true,
    hasImages: false,
    placeholder: '請貼上生理測量數據...',
  },
  'lab-report': {
    hasText: true,
    hasImages: true,
    placeholder: '請標註重要的 Lab Findings（例如：eGFR: 45 mL/min/1.73m² (偏低)、Creatinine: 1.8 mg/dL (升高)）',
  },
  'medical-record': {
    hasText: false,
    hasImages: true,
  },
  'medication-record': {
    hasText: false,
    hasImages: true,
  },
  'list-of-diagnosis': {
    hasText: true,
    hasImages: false,
    placeholder: '請貼上診斷列表內容...',
  },
  'assessment-and-plan': {
    hasText: true,
    hasImages: false,
    placeholder: '請貼上評估與計畫內容...',
  },
  'sts-score': {
    hasText: true,
    hasImages: true,
    placeholder: '請輸入 STS Score 百分比（例如：5.2）',
  },
}

// 檢查報告資料結構
export interface Examination {
  id: string
  type: ExaminationType
  date: string // YYYY-MM-DD
  textContent?: string // 文字內容（複製貼上）
  images?: string[] // 圖片陣列（base64 或 URL）
  labFindings?: string // 重要 Lab Findings 標註（僅用於 lab-report）
  notes?: string // 備註
}

// NYHA 心功能分級
export type NYHAClass = 'I' | 'II' | 'III' | 'IV'

export const NYHA_LABELS: Record<NYHAClass, string> = {
  'I': 'Class I - 無症狀',
  'II': 'Class II - 輕度活動受限',
  'III': 'Class III - 明顯活動受限',
  'IV': 'Class IV - 休息時也有症狀',
}

// 手術風險評估
export interface RiskAssessment {
  stsScore?: string // STS Score 百分比（文字，例如：>10%）
  surgeon1: string // 第一位外科醫師
  surgeon2: string // 第二位外科醫師
  nyhaClass?: NYHAClass // NYHA 心功能分級
  urgencyReason?: string // 手術緊急性/適應症說明
}

// 完整案例資料
export interface CaseData {
  id: string
  createdAt: string
  updatedAt: string
  patient: PatientInfo
  medicalHistory: MedicalHistoryType[]
  customHistory: string // 自訂病史（其他）
  symptoms: SymptomType[]
  customSymptoms: string // 自訂症狀（其他）
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
