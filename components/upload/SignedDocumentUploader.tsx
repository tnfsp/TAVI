'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { SignedDocument } from '@/types'
import {
  fileToBase64,
  validateFileType,
  validateFileSize,
  getFileType,
} from '@/lib/utils/file-converter'

// 動態載入 DocumentPreview，避免 SSR 問題
const DocumentPreview = dynamic(() => import('./DocumentPreview').then(mod => ({ default: mod.DocumentPreview })), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-gray-500">載入預覽中...</div>
})

interface SignedDocumentUploaderProps {
  document?: SignedDocument
  onUpload: (document: SignedDocument) => void
  onRemove: () => void
}

const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
const MAX_FILE_SIZE_MB = 5

export function SignedDocumentUploader({
  document,
  onUpload,
  onRemove,
}: SignedDocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)
    setIsUploading(true)

    try {
      // 驗證檔案類型
      if (!validateFileType(file, ACCEPTED_FILE_TYPES)) {
        throw new Error('不支援的檔案格式，請上傳 PDF 或圖片檔（PNG, JPG）')
      }

      // 驗證檔案大小
      if (!validateFileSize(file, MAX_FILE_SIZE_MB)) {
        throw new Error(`檔案大小超過 ${MAX_FILE_SIZE_MB}MB 限制`)
      }

      // 轉換為 Base64
      const base64Data = await fileToBase64(file)

      // 判斷檔案類型
      const fileType = getFileType(file)
      if (fileType === 'unknown') {
        throw new Error('無法識別檔案類型')
      }

      // 建立簽名文件物件
      const signedDocument: SignedDocument = {
        fileName: file.name,
        fileType,
        base64Data,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size,
      }

      onUpload(signedDocument)
    } catch (err: any) {
      setError(err.message || '檔案上傳失敗')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
    // 重置 input，允許重複上傳相同檔案
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    if (confirm('確定要移除這份簽名文件嗎？')) {
      onRemove()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">上傳已簽名的醫師評估文件</CardTitle>
        <p className="text-sm text-gray-500">
          請上傳已由兩位心臟外科專科醫師簽名的「醫師評估文件」
        </p>
      </CardHeader>
      <CardContent>
        {/* 錯誤訊息 */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!document ? (
          <>
            {/* 上傳區域 */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-all duration-200
                ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
                ${isUploading ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-base font-medium text-gray-700 mb-1">
                {isUploading ? '上傳中...' : '拖放文件到這裡，或點擊上傳'}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                支援 PDF、PNG、JPG 格式，檔案大小限制 {MAX_FILE_SIZE_MB}MB
              </p>
              <p className="text-xs text-amber-600 font-medium">
                ⚠️ 請確認文件已由兩位心臟外科專科醫師簽名
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FILE_TYPES.join(',')}
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
            </div>

            {/* 說明提示 */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900 font-medium mb-2">📝 上傳步驟：</p>
              <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                <li>先在「步驟 7」生成醫師評估文件</li>
                <li>列印文件並請兩位心臟外科專科醫師簽名</li>
                <li>掃描或拍照已簽名的文件</li>
                <li>將檔案上傳到這裡</li>
              </ol>
            </div>
          </>
        ) : (
          <>
            {/* 已上傳的文件預覽 */}
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                簽名文件已上傳，可繼續進行下一步
              </AlertDescription>
            </Alert>

            <DocumentPreview
              document={document}
              onRemove={handleRemove}
              showRemoveButton={true}
            />

            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={handleClick}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                重新上傳
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
