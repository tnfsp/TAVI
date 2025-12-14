'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { CaseData } from '@/types'

interface SurgeonAssessmentGeneratorProps {
  caseData: CaseData
}

export function SurgeonAssessmentGenerator({ caseData }: SurgeonAssessmentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState<string>('')
  const [error, setError] = useState<string>('')

  // 檢查是否已完成前置步驟
  const isReadyToGenerate = () => {
    if (!caseData.patient.name || !caseData.patient.chartNumber) {
      return { ready: false, message: '請先完成步驟 1（病患基本資料）' }
    }
    if (caseData.medicalHistory.length === 0) {
      return { ready: false, message: '請先完成步驟 2（病史選擇）' }
    }
    if (caseData.symptoms.length === 0) {
      return { ready: false, message: '請先完成步驟 3（症狀選擇）' }
    }
    if (!caseData.riskAssessment.surgeon1 || !caseData.riskAssessment.surgeon2) {
      return { ready: false, message: '請先完成步驟 6（外科醫師評估）' }
    }
    return { ready: true, message: '' }
  }

  const handleGenerateSummary = async () => {
    setIsGenerating(true)
    setError('')
    setSummary('')

    try {
      // 1. 呼叫 AI API 生成摘要段落
      const aiResponse = await fetch('/api/ai/generate-surgeon-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseData),
      })

      if (!aiResponse.ok) {
        const errorData = await aiResponse.json()
        throw new Error(errorData.error || '生成摘要失敗')
      }

      const { summary: generatedSummary } = await aiResponse.json()
      setSummary(generatedSummary)
    } catch (err) {
      console.error('Generate summary error:', err)
      setError(err instanceof Error ? err.message : '發生未知錯誤')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadDocument = async () => {
    if (!summary) {
      alert('請先生成摘要段落')
      return
    }

    try {
      // 2. 呼叫 DOCX API 下載 Word 文件
      const docxResponse = await fetch('/api/docx/surgeon-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientInfo: {
            name: caseData.patient.name,
            chartNumber: caseData.patient.chartNumber,
          },
          summary,
        }),
      })

      if (!docxResponse.ok) {
        const errorData = await docxResponse.json()
        throw new Error(errorData.error || '生成 Word 文件失敗')
      }

      // 下載檔案
      const blob = await docxResponse.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${caseData.patient.name}${caseData.patient.chartNumber} - 二位心臟外科專科醫師判定.docx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      alert('文件下載成功！')
    } catch (err) {
      console.error('Download document error:', err)
      alert(err instanceof Error ? err.message : '下載失敗')
    }
  }

  const readyStatus = isReadyToGenerate()

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* 狀態檢查 */}
        {!readyStatus.ready && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">⚠️ {readyStatus.message}</p>
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="flex gap-4">
          <Button
            onClick={handleGenerateSummary}
            disabled={!readyStatus.ready || isGenerating}
            className="flex-1"
          >
            {isGenerating ? '正在生成摘要段落...' : '1. 生成摘要段落（AI）'}
          </Button>

          <Button
            onClick={handleDownloadDocument}
            disabled={!summary}
            variant="outline"
            className="flex-1"
          >
            2. 下載 Word 文件
          </Button>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">❌ {error}</p>
          </div>
        )}

        {/* 預覽摘要段落 */}
        {summary && (
          <div className="bg-gray-50 border rounded-lg p-6">
            <h4 className="text-sm font-semibold mb-3 text-gray-700">📄 摘要段落預覽</h4>
            <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              {summary}
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500">
                ✓ 摘要段落已生成，請確認內容無誤後，點擊「下載 Word 文件」。
                文件將包含此摘要段落及兩位外科醫師簽名欄位。
              </p>
            </div>
          </div>
        )}

        {/* 說明文字 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2 text-blue-900">📋 使用說明</h4>
          <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
            <li>點擊「生成摘要段落」，AI 將自動整合您輸入的所有資料生成專業醫療摘要</li>
            <li>確認摘要內容無誤後，點擊「下載 Word 文件」</li>
            <li>列印文件給兩位心臟外科專科醫師簽名</li>
            <li>簽名完成後，掃描或拍照上傳（步驟 8）</li>
          </ol>
        </div>
      </div>
    </Card>
  )
}
