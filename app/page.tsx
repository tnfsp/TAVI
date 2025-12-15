'use client'

import { useEffect } from 'react'
import { useCaseStore } from '@/store/useCaseStore'
import { PatientInfoForm } from '@/components/forms/PatientInfoForm'
import { MedicalHistorySelector } from '@/components/forms/MedicalHistorySelector'
import { SymptomSelector } from '@/components/forms/SymptomSelector'
import { ClinicalCourseForm } from '@/components/forms/ClinicalCourseForm'
import { RiskAssessmentForm } from '@/components/forms/RiskAssessmentForm'
import { ExaminationInput } from '@/components/upload/ExaminationInput'
import { SurgeonAssessmentGenerator } from '@/components/document/SurgeonAssessmentGenerator'
import { SignedDocumentUploader } from '@/components/upload/SignedDocumentUploader'
import { CompleteApplicationGenerator } from '@/components/document/CompleteApplicationGenerator'
import { CaseManagement } from '@/components/case/CaseManagement'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { PatientInfo, MedicalHistoryType, SymptomType, ClinicalCourse, Examination, RiskAssessment, SignedDocument } from '@/types'
import { EXAMINATION_LABELS } from '@/types'

export default function Home() {
  const {
    currentCase,
    initializeCase,
    updatePatientInfo,
    updateMedicalHistory,
    updateCustomHistory,
    updateSymptoms,
    updateCustomSymptoms,
    updateSymptomOnset,
    updateClinicalCourse,
    addExamination,
    removeExamination,
    updateRiskAssessment,
    updateSignedAssessment,
    removeSignedAssessment,
  } = useCaseStore()

  // 初始化案例
  useEffect(() => {
    if (!currentCase) {
      initializeCase()
    }
  }, [currentCase, initializeCase])

  const handlePatientSubmit = (data: PatientInfo) => {
    updatePatientInfo(data)
    alert('病患基本資料已儲存')
  }

  const handleMedicalHistorySubmit = (data: { selected: MedicalHistoryType[]; customHistory: string }) => {
    updateMedicalHistory(data.selected)
    updateCustomHistory(data.customHistory)
    alert('病史已儲存')
  }

  const handleSymptomSubmit = (data: { symptoms: SymptomType[]; symptomOnset: string }) => {
    updateSymptoms(data.symptoms)
    updateSymptomOnset(data.symptomOnset)
    alert('症狀已儲存')
  }

  const handleClinicalCourseSubmit = (data: ClinicalCourse) => {
    updateClinicalCourse(data)
    alert('就醫歷程已儲存')
  }

  const handleExaminationSubmit = (examination: Examination) => {
    addExamination(examination)
  }

  const handleRiskAssessmentSubmit = (data: RiskAssessment) => {
    updateRiskAssessment(data)
    alert('風險評估已儲存')
  }

  const handleDeleteExamination = (id: string, examType: string) => {
    if (confirm(`確定要刪除「${examType}」檢查嗎？`)) {
      removeExamination(id)
    }
  }

  if (!currentCase) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-gray-500">載入中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TAVI 健保申請輔助系統</h1>
              <p className="text-sm text-gray-500 mt-1">經導管主動脈瓣膜置換術事前審查申請</p>
            </div>
            <div className="text-sm text-gray-500">
              案例 ID: {currentCase.id.slice(-8)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* 個案管理 */}
          <CaseManagement />

          {/* 說明卡片 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">📋 使用說明</h2>
            <p className="text-blue-700 text-sm">
              請依序填寫以下資料，每個區塊填寫完成後請記得點擊「儲存」按鈕。
              所有資料會自動儲存在瀏覽器中，關閉頁面後重新開啟可繼續編輯。
            </p>
          </div>

          {/* 步驟 1: 病患基本資料 */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700">步驟 1：病患基本資料</h2>
            </div>
            <PatientInfoForm
              defaultValues={currentCase.patient}
              onSubmit={handlePatientSubmit}
            />
          </section>

          {/* 步驟 2: 病史選擇 */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700">步驟 2：病史選擇</h2>
            </div>
            <MedicalHistorySelector
              defaultValues={currentCase.medicalHistory}
              defaultCustomHistory={currentCase.customHistory}
              onSubmit={handleMedicalHistorySubmit}
            />
          </section>

          {/* 步驟 3: 症狀選擇 */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700">步驟 3：症狀選擇</h2>
            </div>
            <SymptomSelector
              defaultValues={{
                symptoms: currentCase.symptoms,
                symptomOnset: currentCase.symptomOnset,
              }}
              onSubmit={handleSymptomSubmit}
            />
          </section>

          {/* 步驟 4: 就醫歷程 */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700">步驟 4：就醫歷程</h2>
            </div>
            <ClinicalCourseForm
              defaultValues={currentCase.clinicalCourse}
              onSubmit={handleClinicalCourseSubmit}
            />
          </section>

          {/* 步驟 5: 檢查報告上傳 */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700">步驟 5：檢查報告輸入</h2>
              <p className="text-sm text-gray-500 mt-1">
                請選擇檢查類型，並上傳圖片或輸入報告內容（可多次上傳不同檢查）
              </p>
            </div>
            <ExaminationInput onSubmit={handleExaminationSubmit} />

            {/* 已上傳的檢查列表 */}
            {currentCase.examinations.length > 0 && (
              <div className="mt-6 bg-white rounded-lg border p-6">
                <h3 className="text-base font-semibold mb-4">已輸入的檢查 ({currentCase.examinations.length})</h3>
                <div className="space-y-3">
                  {currentCase.examinations.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded group hover:bg-gray-100 transition-colors">
                      <div>
                        <span className="font-medium">
                          {EXAMINATION_LABELS[exam.type]}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-green-600">✓ 已儲存</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExamination(exam.id, EXAMINATION_LABELS[exam.type])}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          刪除
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 步驟 6: 風險評估與手術評估 */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700">步驟 6：手術風險評估與適應症</h2>
              <p className="text-sm text-gray-500 mt-1">
                請填寫 STS Score、外科醫師評估、NYHA 分級及手術適應症
              </p>
            </div>
            <RiskAssessmentForm
              defaultValues={currentCase.riskAssessment}
              onSubmit={handleRiskAssessmentSubmit}
            />
          </section>

          {/* 步驟 7: 生成醫師評估文件 */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700">步驟 7：生成醫師評估文件</h2>
              <p className="text-sm text-gray-500 mt-1">
                生成「二位心臟外科專科醫師判定」文件，供醫師簽名使用
              </p>
            </div>
            <SurgeonAssessmentGenerator caseData={currentCase} />
          </section>

          {/* 步驟 8: 上傳已簽名文件 */}
          <section>
            <SignedDocumentUploader
              document={currentCase.signedSurgeonAssessment}
              onUpload={updateSignedAssessment}
              onRemove={removeSignedAssessment}
            />
          </section>

          {/* 步驟 9: 生成完整申請文件 */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700">步驟 9：生成完整事前審查申請文件</h2>
              <p className="text-sm text-gray-500 mt-1">
                整合所有資料，生成完整的 TAVI 事前審查申請 Word 文件
              </p>
            </div>
            <CompleteApplicationGenerator caseData={currentCase} />
          </section>

          {/* 下一步提示 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-base font-semibold text-green-900 mb-2">✅ Phase 4 已完成</h3>
            <p className="text-green-700 text-sm mb-3">
              目前已完成完整申請文件生成功能。後續階段將實作：
            </p>
            <ul className="list-disc list-inside text-green-700 text-sm space-y-1">
              <li>Phase 5：歷史案例管理</li>
              <li>Phase 6：UI/UX 優化與進階功能</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            TAVI 健保申請輔助系統 v0.1.0 | Powered by Claude AI
          </p>
        </div>
      </footer>
    </div>
  )
}
