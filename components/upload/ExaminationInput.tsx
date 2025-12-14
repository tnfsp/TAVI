'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  type ExaminationType,
  EXAMINATION_LABELS,
  EXAMINATION_INPUT_CONFIG,
  type Examination,
} from '@/types'
import { Upload, Monitor, X, Image as ImageIcon, FileText, ExternalLink } from 'lucide-react'
import { ImageCropper } from './ImageCropper'

interface ExaminationInputProps {
  onSubmit: (examination: Examination) => void
}

export function ExaminationInput({ onSubmit }: ExaminationInputProps) {
  const [examType, setExamType] = useState<ExaminationType>('echocardiography')
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0])
  const [textContent, setTextContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [currentCropImage, setCurrentCropImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const config = EXAMINATION_INPUT_CONFIG[examType]

  // 處理檔案上傳（進入裁切模式）
  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return

    // 只處理第一張圖片，完成後可以再次上傳
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      alert('請上傳圖片檔案')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      setCurrentCropImage(imageData)
    }
    reader.readAsDataURL(file)

    // 重置檔案輸入，允許重複上傳相同檔案
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 點擊上傳
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  // 檔案選擇
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFileUpload(files)
    }
  }

  // 拖放處理
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
    if (files) {
      handleFileUpload(files)
    }
  }

  // 螢幕截圖（截圖後進入裁切模式）
  const handleScreenCapture = async () => {
    setIsCapturing(true)
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'never',
        } as MediaTrackConstraints,
      })

      const video = document.createElement('video')
      video.srcObject = stream
      video.play()

      await new Promise((resolve) => {
        video.onloadedmetadata = resolve
      })

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0)

      const imageData = canvas.toDataURL('image/png')

      stream.getTracks().forEach((track) => track.stop())

      // 進入裁切模式
      setCurrentCropImage(imageData)
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        alert('您拒絕了螢幕截圖權限')
      } else if (error.name === 'NotSupportedError') {
        alert('您的瀏覽器不支援螢幕截圖功能，請使用 Chrome、Edge 或 Firefox')
      } else {
        console.error('截圖失敗:', error)
        alert('截圖失敗，請稍後再試')
      }
    } finally {
      setIsCapturing(false)
    }
  }

  // 刪除圖片
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // 提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 驗證
    if (config.hasText && !textContent.trim()) {
      alert('請輸入報告內容')
      return
    }

    if (config.hasImages && config.minImages && images.length < config.minImages) {
      alert(`此檢查至少需要上傳 ${config.minImages} 張圖片`)
      return
    }

    const examination: Examination = {
      id: `exam-${Date.now()}`,
      type: examType,
      date: examDate,
      textContent: config.hasText && examType !== 'lab-report' ? textContent : undefined,
      labFindings: examType === 'lab-report' ? textContent : undefined,
      images: config.hasImages ? images : undefined,
    }

    onSubmit(examination)

    // 清空表單
    setTextContent('')
    setImages([])
    alert('檢查報告已儲存！')
  }

  // 裁切完成處理
  const handleCropComplete = (croppedImage: string) => {
    setImages((prev) => [...prev, croppedImage])
    setCurrentCropImage(null)
  }

  // 裁切取消處理
  const handleCropCancel = () => {
    setCurrentCropImage(null)
  }

  // 如果正在裁切圖片，顯示裁切介面
  if (currentCropImage) {
    return (
      <ImageCropper
        image={currentCropImage}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">檢查報告輸入</CardTitle>
        <p className="text-sm text-gray-500">
          請選擇檢查類型並輸入相關資料
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 檢查類型選擇 */}
          <div className="space-y-2">
            <Label htmlFor="examType">檢查類型</Label>
            <Select value={examType} onValueChange={(value) => setExamType(value as ExaminationType)}>
              <SelectTrigger id="examType" className="text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EXAMINATION_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 檢查日期 */}
          <div className="space-y-2">
            <Label htmlFor="examDate">檢查日期</Label>
            <Input
              id="examDate"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="text-base"
            />
          </div>

          {/* 文字輸入區 */}
          {config.hasText && (
            <div className="space-y-2">
              <Label htmlFor="textContent" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {examType === 'lab-report' ? '重要 Lab Findings 標註' : '報告內容'}
                {config.minImages && config.minImages > 0 && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Textarea
                id="textContent"
                placeholder={config.placeholder || '請貼上報告內容...'}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={examType === 'lab-report' ? 6 : 12}
                className="text-sm font-mono resize-none"
              />
              {examType === 'sts-score' ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>請輸入計算好的 STS Score 百分比</span>
                  <span>•</span>
                  <a
                    href="https://riskcalc.sts.org/stswebriskcalc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    開啟 STS Calculator
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : examType === 'lab-report' ? (
                <p className="text-sm text-gray-500">
                  請標註重要的異常數據（例如：eGFR 偏低、肌酸酐升高等），這些會在最終申請文件中特別標示
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  請從醫院系統複製報告全文，直接貼上即可
                </p>
              )}
            </div>
          )}

          {/* 圖片上傳區 */}
          {config.hasImages && (
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                上傳圖片
                {config.minImages && (
                  <span className="text-sm text-gray-500">
                    （至少 {config.minImages} 張）
                  </span>
                )}
              </Label>

              {/* 拖放區域 */}
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
                `}
              >
                <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-base font-medium text-gray-700 mb-1">
                  拖放圖片到這裡，或點擊上傳
                </p>
                <p className="text-sm text-gray-500">支援 JPG、PNG 格式，每次上傳一張（可多次上傳）</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* 操作按鈕 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleClick}
                  className="w-full text-base"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  從檔案上傳
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleScreenCapture}
                  disabled={isCapturing}
                  className="w-full text-base"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  {isCapturing ? '截圖中...' : '螢幕截圖'}
                </Button>
              </div>

              {/* 已上傳的圖片預覽 */}
              {images.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    已上傳 {images.length} 張圖片
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative border rounded-lg overflow-hidden group">
                        <img src={img} alt={`圖片 ${index + 1}`} className="w-full aspect-video object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2">
                          圖片 {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 提交按鈕 */}
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" size="lg" className="text-base px-8">
              儲存檢查報告
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
