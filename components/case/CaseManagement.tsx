'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useCaseStore } from '@/store/useCaseStore'
import type { CaseData } from '@/types'

export function CaseManagement() {
  const currentCase = useCaseStore((state) => state.currentCase)
  const loadCase = useCaseStore((state) => state.loadCase)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // 儲存個案（下載 JSON）
  const handleSaveCase = () => {
    if (!currentCase) {
      setMessage({ type: 'error', text: '沒有可儲存的資料' })
      return
    }

    try {
      // 組合要儲存的資料
      const dataToSave = currentCase

      // 轉成 JSON 字串（格式化，方便閱讀）
      const jsonString = JSON.stringify(dataToSave, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })

      // 建立下載連結
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url

      // 檔名：病患姓名+病歷號（如果有的話）
      const fileName = currentCase.patient.name && currentCase.patient.chartNumber
        ? `${currentCase.patient.name}${currentCase.patient.chartNumber}-個案資料.json`
        : `TAVI個案資料-${new Date().toISOString().split('T')[0]}.json`

      a.download = fileName
      document.body.appendChild(a)
      a.click()

      // 清理
      URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setMessage({ type: 'success', text: '個案已成功儲存！' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('儲存個案失敗:', error)
      setMessage({ type: 'error', text: '儲存失敗，請稍後再試' })
    }
  }

  // 載入個案（上傳 JSON）
  const handleLoadCase = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // 讀取檔案
      const text = await file.text()
      const loadedData: CaseData = JSON.parse(text)

      // 驗證資料結構
      if (!loadedData.patient) {
        throw new Error('檔案格式不正確：缺少病患資料')
      }

      // 載入到 store（使用 loadCase 批量載入）
      loadCase(loadedData)

      setMessage({ type: 'success', text: '個案已成功載入！' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('載入個案失敗:', error)
      setMessage({ type: 'error', text: '載入失敗，請確認檔案格式正確' })
    }

    // 重置檔案輸入
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 檢查是否有資料可以儲存
  const hasData = currentCase && (currentCase.patient.name || currentCase.examinations.length > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          個案管理
        </CardTitle>
        <CardDescription>
          儲存或載入個案資料（包含病患資料、檢查報告、圖片等）
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 訊息提示 */}
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* 按鈕區 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* 儲存個案 */}
          <Button
            onClick={handleSaveCase}
            disabled={!hasData}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            儲存個案（下載 JSON）
          </Button>

          {/* 載入個案 */}
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            載入個案（上傳 JSON）
          </Button>
        </div>

        {/* 隱藏的檔案輸入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleLoadCase}
          className="hidden"
        />

        {/* 說明 */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900 font-medium mb-2">💡 使用說明：</p>
          <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
            <li>儲存個案：下載 JSON 檔案到電腦，可備份或分享</li>
            <li>載入個案：上傳 JSON 檔案，快速還原所有資料</li>
            <li>JSON 檔案包含完整資料（病患資料、檢查報告、圖片）</li>
            <li>建議定期儲存，避免資料遺失</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
