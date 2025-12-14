'use client'

import { useEffect } from 'react'
import { useCaseStore } from '@/store/useCaseStore'
import { PatientInfoForm } from '@/components/forms/PatientInfoForm'
import { MedicalHistorySelector } from '@/components/forms/MedicalHistorySelector'
import { SymptomSelector } from '@/components/forms/SymptomSelector'
import { ClinicalCourseForm } from '@/components/forms/ClinicalCourseForm'
import { ImageUploader } from '@/components/upload/ImageUploader'
import { Button } from '@/components/ui/button'
import type { PatientInfo, MedicalHistoryType, SymptomType, ClinicalCourse, ExaminationType } from '@/types'

export default function Home() {
  const {
    currentCase,
    initializeCase,
    updatePatientInfo,
    updateMedicalHistory,
    updateSymptoms,
    updateSymptomOnset,
    updateClinicalCourse,
    addExamination,
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

  const handleMedicalHistorySubmit = (selected: MedicalHistoryType[]) => {
    updateMedicalHistory(selected)
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

  const handleImageCapture = (imageData: string, examType: ExaminationType) => {
    const examination = {
      id: `exam-${Date.now()}`,
      type: examType,
      date: new Date().toISOString().split('T')[0],
      imageUrl: imageData,
      data: examType === 'echocardiography'
        ? { AVA: null, Vmax: null, PeakPG: null, MeanPG: null, LVEF: null }
        : { AVA: null, MeanGradient: null },
    }
    addExamination(examination)
    alert('檢查報告已上傳！（AI 數據提取功能將在 Phase 2 實作）')
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
              <h2 className="text-lg font-semibold text-gray-700">步驟 5：檢查報告上傳</h2>
              <p className="text-sm text-gray-500 mt-1">
                請上傳心臟超音波或心導管檢查報告（可多次上傳不同檢查）
              </p>
            </div>
            <ImageUploader onImageCapture={handleImageCapture} />

            {/* 已上傳的檢查列表 */}
            {currentCase.examinations.length > 0 && (
              <div className="mt-6 bg-white rounded-lg border p-6">
                <h3 className="text-base font-semibold mb-4">已上傳的檢查 ({currentCase.examinations.length})</h3>
                <div className="space-y-3">
                  {currentCase.examinations.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">
                          {exam.type === 'echocardiography' ? '心臟超音波' : '心導管檢查'}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({exam.date})
                        </span>
                      </div>
                      <span className="text-sm text-green-600">✓ 已上傳</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 下一步提示 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-base font-semibold text-yellow-900 mb-2">🚧 Phase 1 功能展示</h3>
            <p className="text-yellow-700 text-sm mb-3">
              目前已完成基礎資料輸入功能。後續階段將實作：
            </p>
            <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
              <li>Phase 2：AI 自動提取檢查報告數據（使用 Claude Vision API）</li>
              <li>Phase 3：自動生成申請文件</li>
              <li>Phase 4：匯出 Word 檔案</li>
              <li>Phase 5：歷史案例管理</li>
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
