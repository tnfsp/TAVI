import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  CaseData,
  PatientInfo,
  MedicalHistoryType,
  SymptomType,
  ClinicalCourse,
  Examination,
  RiskAssessment,
  SignedDocument,
} from '@/types'

interface CaseStore {
  // 當前編輯的案例
  currentCase: CaseData | null

  // 初始化新案例
  initializeCase: () => void

  // 更新病患基本資料
  updatePatientInfo: (patientInfo: PatientInfo) => void

  // 更新病史
  updateMedicalHistory: (history: MedicalHistoryType[]) => void

  // 更新自訂病史
  updateCustomHistory: (customHistory: string) => void

  // 更新症狀
  updateSymptoms: (symptoms: SymptomType[]) => void

  // 更新自訂症狀
  updateCustomSymptoms: (customSymptoms: string) => void

  // 更新症狀發生時間
  updateSymptomOnset: (onset: string) => void

  // 更新就醫歷程
  updateClinicalCourse: (course: ClinicalCourse) => void

  // 新增檢查報告
  addExamination: (exam: Examination) => void

  // 更新檢查報告
  updateExamination: (id: string, exam: Partial<Examination>) => void

  // 刪除檢查報告
  removeExamination: (id: string) => void

  // 更新手術風險評估
  updateRiskAssessment: (assessment: RiskAssessment) => void

  // 更新功能狀態
  updateFunctionalStatus: (status: string) => void

  // 更新預後評估
  updatePrognosis: (prognosis: string) => void

  // 更新生成的文件
  updateGeneratedDocument: (document: string) => void

  // 更新簽名文件（Phase 3 新增）
  updateSignedAssessment: (document: SignedDocument) => void

  // 移除簽名文件（Phase 3 新增）
  removeSignedAssessment: () => void

  // 清空當前案例
  clearCase: () => void

  // 載入完整案例資料（用於個案管理）
  loadCase: (caseData: Partial<CaseData>) => void
}

export const useCaseStore = create<CaseStore>()(
  persist(
    (set) => ({
      currentCase: null,

      initializeCase: () => {
        const now = new Date().toISOString()
        set({
          currentCase: {
            id: `case-${Date.now()}`,
            createdAt: now,
            updatedAt: now,
            patient: {
              name: '',
              chartNumber: '',
              gender: 'female',
              age: 0,
              birthDate: '',
              nationalId: '',
            },
            medicalHistory: [],
            customHistory: '',
            symptoms: [],
            customSymptoms: '',
            symptomOnset: '',
            clinicalCourse: {
              previousCare: '',
              presentation: '',
            },
            examinations: [],
            riskAssessment: {
              surgeon1: '',
              surgeon2: '',
            },
            functionalStatus: '',
            prognosis: '',
          },
        })
      },

      updatePatientInfo: (patientInfo) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                patient: patientInfo,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateMedicalHistory: (history) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                medicalHistory: history,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateCustomHistory: (customHistory) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                customHistory,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateSymptoms: (symptoms) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                symptoms,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateCustomSymptoms: (customSymptoms) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                customSymptoms,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateSymptomOnset: (onset) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                symptomOnset: onset,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateClinicalCourse: (course) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                clinicalCourse: course,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      addExamination: (exam) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                examinations: [...state.currentCase.examinations, exam],
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateExamination: (id, exam) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                examinations: state.currentCase.examinations.map((e) =>
                  e.id === id ? { ...e, ...exam } : e
                ),
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      removeExamination: (id) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                examinations: state.currentCase.examinations.filter(
                  (e) => e.id !== id
                ),
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateRiskAssessment: (assessment) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                riskAssessment: assessment,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateFunctionalStatus: (status) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                functionalStatus: status,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updatePrognosis: (prognosis) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                prognosis,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateGeneratedDocument: (document) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                generatedDocument: document,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateSignedAssessment: (document) =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                signedSurgeonAssessment: document,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      removeSignedAssessment: () =>
        set((state) => ({
          currentCase: state.currentCase
            ? {
                ...state.currentCase,
                signedSurgeonAssessment: undefined,
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      clearCase: () => set({ currentCase: null }),

      // 載入個案時，始終生成新的 ID 以確保表單重新初始化
      loadCase: (caseData) => {
        const now = new Date().toISOString()
        const newId = `case-${Date.now()}`

        return set(() => ({
          currentCase: {
            id: newId,
            createdAt: now,
            updatedAt: now,
            patient: {
              name: '',
              chartNumber: '',
              gender: 'female',
              age: 0,
              birthDate: '',
              nationalId: '',
              ...caseData.patient,
            },
            medicalHistory: caseData.medicalHistory || [],
            customHistory: caseData.customHistory || '',
            symptoms: caseData.symptoms || [],
            customSymptoms: caseData.customSymptoms || '',
            symptomOnset: caseData.symptomOnset || '',
            clinicalCourse: {
              previousCare: '',
              presentation: '',
              ...caseData.clinicalCourse,
            },
            examinations: caseData.examinations || [],
            riskAssessment: {
              surgeon1: '',
              surgeon2: '',
              ...caseData.riskAssessment,
            },
            functionalStatus: caseData.functionalStatus || '',
            prognosis: caseData.prognosis || '',
            generatedDocument: caseData.generatedDocument,
            signedSurgeonAssessment: caseData.signedSurgeonAssessment,
          },
        }))
      },
    }),
    {
      name: 'tavi-case-storage', // LocalStorage key
      // 自訂序列化：排除大型圖片資料以避免 localStorage 配額限制
      partialize: (state) => {
        if (!state.currentCase) {
          return { currentCase: null }
        }

        // 複製 currentCase 但排除圖片資料
        const caseWithoutImages = {
          ...state.currentCase,
          // 排除檢查報告中的圖片（只保留文字內容）
          examinations: state.currentCase.examinations.map((exam) => ({
            ...exam,
            images: [], // 清空圖片陣列
          })),
          // 排除已簽名文件的 base64 資料
          signedSurgeonAssessment: state.currentCase.signedSurgeonAssessment
            ? {
                ...state.currentCase.signedSurgeonAssessment,
                base64Data: '', // 清空 base64 資料
              }
            : undefined,
        }

        return { currentCase: caseWithoutImages }
      },
    }
  )
)
