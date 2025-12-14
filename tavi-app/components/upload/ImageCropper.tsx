'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Check, X, ZoomIn } from 'lucide-react'

interface ImageCropperProps {
  image: string
  onCropComplete: (croppedImage: string) => void
  onCancel: () => void
}

interface CroppedArea {
  x: number
  y: number
  width: number
  height: number
}

export function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null)

  const onCropChange = (location: { x: number; y: number }) => {
    setCrop(location)
  }

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom)
  }

  const onCropCompleteCallback = useCallback(
    (croppedArea: any, croppedAreaPixels: CroppedArea) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return

    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels)
      onCropComplete(croppedImage)
    } catch (e) {
      console.error('裁切失敗:', e)
      alert('裁切失敗，請重試')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* 裁切區域 */}
      <div className="flex-1 relative">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={undefined}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteCallback}
        />
      </div>

      {/* 控制面板 */}
      <div className="bg-gray-900 p-6 space-y-4">
        {/* 縮放控制 */}
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <ZoomIn className="w-5 h-5 text-white" />
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={(values) => setZoom(values[0])}
            className="flex-1"
          />
          <span className="text-white text-sm w-12 text-right">{Math.round(zoom * 100)}%</span>
        </div>

        {/* 提示文字 */}
        <p className="text-center text-white text-sm">
          拖動圖片調整位置，使用滑桿或滾輪縮放，拖動邊角調整裁切範圍
        </p>

        {/* 按鈕 */}
        <div className="flex gap-3 justify-center">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="min-w-32"
          >
            <X className="w-4 h-4 mr-2" />
            取消
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={createCroppedImage}
            className="min-w-32 bg-blue-600 hover:bg-blue-700"
          >
            <Check className="w-4 h-4 mr-2" />
            確認裁切
          </Button>
        </div>
      </div>
    </div>
  )
}

// 裁切圖片的輔助函數
async function getCroppedImg(imageSrc: string, pixelCrop: CroppedArea): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('無法取得 canvas context')
  }

  // 設定 canvas 大小為裁切區域大小
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // 繪製裁切後的圖片
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  // 轉換為 base64
  return canvas.toDataURL('image/png')
}

// 建立 Image 物件
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.src = url
  })
}
