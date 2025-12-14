'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ExaminationType } from '@/types'
import { Upload, Monitor, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  onImageCapture: (imageData: string, examType: ExaminationType) => void
}

export function ImageUploader({ onImageCapture }: ImageUploaderProps) {
  const [examType, setExamType] = useState<ExaminationType>('echocardiography')
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // 處理檔案上傳
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('請上傳圖片檔案')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      setPreview(imageData)
      onImageCapture(imageData, examType)
    }
    reader.readAsDataURL(file)
  }

  // 點擊上傳
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  // 檔案選擇change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
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
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  // 螢幕截圖功能
  const handleScreenCapture = async () => {
    setIsCapturing(true)
    try {
      // 使用 Screen Capture API
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'never', // 不顯示鼠標
        } as MediaTrackConstraints,
      })

      // 建立 video 元素來顯示串流
      const video = document.createElement('video')
      video.srcObject = stream
      video.play()

      // 等待 video 載入
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve
      })

      // 建立 canvas 並截圖
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0)

      // 轉換為 base64
      const imageData = canvas.toDataURL('image/png')
      setPreview(imageData)
      onImageCapture(imageData, examType)

      // 停止串流
      stream.getTracks().forEach((track) => track.stop())
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

  // 清除預覽
  const handleClear = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">檢查報告上傳</CardTitle>
        <p className="text-sm text-gray-500">
          請上傳心臟超音波或心導管檢查報告（支援拖放、檔案上傳、螢幕截圖）
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 檢查類型選擇 */}
        <div className="space-y-2">
          <Label htmlFor="examType">檢查類型</Label>
          <Select value={examType} onValueChange={(value) => setExamType(value as ExaminationType)}>
            <SelectTrigger id="examType" className="text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="echocardiography">心臟超音波 (Echocardiography)</SelectItem>
              <SelectItem value="catheterization">心導管檢查 (Catheterization)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 上傳區域 */}
        {!preview ? (
          <>
            {/* 拖放區域 */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                transition-all duration-200
                ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
              `}
            >
              <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                拖放圖片到這裡，或點擊上傳
              </p>
              <p className="text-sm text-gray-500">支援 JPG、PNG 格式</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* 操作按鈕 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleClick}
                className="w-full text-base"
              >
                <Upload className="w-5 h-5 mr-2" />
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
                <Monitor className="w-5 h-5 mr-2" />
                {isCapturing ? '截圖中...' : '螢幕截圖'}
              </Button>
            </div>

            {/* 提示說明 */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>截圖功能說明：</strong>點擊「螢幕截圖」後，您可以選擇要截取的視窗或螢幕，
                方便直接截取醫院系統（EXE 或網頁）的檢查報告畫面。
              </p>
            </div>
          </>
        ) : (
          /* 預覽區域 */
          <div className="space-y-4">
            <div className="relative border rounded-lg overflow-hidden">
              <img src={preview} alt="檢查報告預覽" className="w-full" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleClear}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                ✓ 圖片已上傳，類型：
                {examType === 'echocardiography' ? '心臟超音波' : '心導管檢查'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
