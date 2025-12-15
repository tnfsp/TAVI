'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, Download, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import type { CaseData } from '@/types'

interface CompleteApplicationGeneratorProps {
  caseData: CaseData
}

export function CompleteApplicationGenerator({ caseData }: CompleteApplicationGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 檢查前置條件
  const hasGeneratedDocument = !!caseData.generatedDocument
  const hasExaminations = caseData.examinations.length > 0
  const hasPatientInfo = !!(caseData.patient.name && caseData.patient.chartNumber)

  const canGenerate = hasGeneratedDocument && hasExaminations && hasPatientInfo

  const handleGenerate = async () => {
    if (!canGenerate) {
      setError('請先完成所有必要步驟（病患資料、檢查報告、醫師評估文件）')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // 呼叫 API 生成文件
      const response = await fetch('/api/docx/complete-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseData,
          summaryContent: caseData.generatedDocument,
          signedDocumentBase64: caseData.signedSurgeonAssessment?.base64Data,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '文件生成失敗')
      }

      // 下載文件
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${caseData.patient.name}${caseData.patient.chartNumber} - TAVI事前審查申請.docx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      console.error('文件生成錯誤:', err)
      setError(err.message || '文件生成失敗，請稍後再試')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          生成完整事前審查申請文件
        </CardTitle>
        <CardDescription>
          整合所有資料，生成完整的 TAVI 事前審查申請 Word 文件
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 前置條件檢查 */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">前置條件檢查：</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {hasPatientInfo ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
              <span className={hasPatientInfo ? 'text-gray-700' : 'text-amber-700'}>
                病患基本資料（姓名、病歷號）
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {hasExaminations ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
              <span className={hasExaminations ? 'text-gray-700' : 'text-amber-700'}>
                檢查報告（已輸入 {caseData.examinations.length} 項）
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {hasGeneratedDocument ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
              <span className={hasGeneratedDocument ? 'text-gray-700' : 'text-amber-700'}>
                醫師評估摘要（在步驟 7 生成）
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {caseData.signedSurgeonAssessment ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-gray-400" />
              )}
              <span className={caseData.signedSurgeonAssessment ? 'text-gray-700' : 'text-gray-500'}>
                已簽名文件（選填，未上傳將使用預設佔位）
              </span>
            </div>
          </div>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 說明 */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900 font-medium mb-2">📄 文件內容包含：</p>
          <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
            <li>TAVI 事前審查摘要段落</li>
            <li>所有已輸入的檢查報告（含文字與圖片）</li>
            <li>STS Score 或 EuroSCORE</li>
            <li>二位心臟外科專科醫師判定（已簽名文件或佔位）</li>
          </ul>
        </div>

        {/* 生成按鈕 */}
        <Button
          onClick={handleGenerate}
          disabled={!canGenerate || isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              文件生成中...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              生成並下載完整申請文件
            </>
          )}
        </Button>

        {!canGenerate && (
          <p className="text-sm text-amber-600 text-center">
            ⚠️ 請先完成上述必要步驟才能生成文件
          </p>
        )}
      </CardContent>
    </Card>
  )
}
