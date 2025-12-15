'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ZoomIn, ZoomOut, FileText, Image as ImageIcon, X } from 'lucide-react'
import type { SignedDocument } from '@/types'
import { formatFileSize } from '@/lib/utils/file-converter'

// 設定 PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface DocumentPreviewProps {
  document: SignedDocument
  onRemove?: () => void
  showRemoveButton?: boolean
}

export function DocumentPreview({
  document,
  onRemove,
  showRemoveButton = false,
}: DocumentPreviewProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [scale, setScale] = useState<number>(1.0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0))
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* 檔案資訊 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {document.fileType === 'pdf' ? (
                <FileText className="w-5 h-5 text-red-500" />
              ) : (
                <ImageIcon className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div>
              <p className="font-medium text-base">{document.fileName}</p>
              <div className="flex gap-4 text-sm text-gray-500 mt-1">
                <span>{formatFileSize(document.fileSize)}</span>
                <span>•</span>
                <span>上傳時間：{formatDate(document.uploadedAt)}</span>
                {document.fileType === 'pdf' && numPages > 0 && (
                  <>
                    <span>•</span>
                    <span>{numPages} 頁</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {showRemoveButton && onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* 控制按鈕 */}
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="w-4 h-4 mr-1" />
            縮小
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={scale >= 3.0}
          >
            <ZoomIn className="w-4 h-4 mr-1" />
            放大
          </Button>
          <span className="inline-flex items-center px-3 text-sm text-gray-600">
            {Math.round(scale * 100)}%
          </span>
        </div>

        {/* 預覽區域 */}
        <div className="border rounded-lg overflow-auto max-h-[600px] bg-gray-50">
          {document.fileType === 'pdf' ? (
            <div className="flex justify-center p-4">
              <Document
                file={document.base64Data}
                onLoadSuccess={handleDocumentLoadSuccess}
                loading={
                  <div className="flex items-center justify-center p-8">
                    <p className="text-gray-500">載入 PDF 中...</p>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center p-8">
                    <p className="text-red-500">PDF 載入失敗</p>
                  </div>
                }
              >
                {/* 只顯示第一頁作為預覽 */}
                <Page
                  pageNumber={1}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
          ) : (
            <div className="flex justify-center p-4">
              <img
                src={document.base64Data}
                alt={document.fileName}
                style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
                className="max-w-full transition-transform"
              />
            </div>
          )}
        </div>

        {document.fileType === 'pdf' && numPages > 1 && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            預覽第 1 頁（共 {numPages} 頁）
          </p>
        )}
      </CardContent>
    </Card>
  )
}
