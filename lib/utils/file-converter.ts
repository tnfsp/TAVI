/**
 * 檔案處理工具
 * 提供檔案轉 Base64、PDF 處理等功能
 */

/**
 * 將檔案轉換為 Base64 字串
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result as string
      resolve(result)
    }

    reader.onerror = (error) => {
      reject(new Error('檔案讀取失敗'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * 格式化檔案大小顯示
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 驗證檔案類型
 */
export function validateFileType(file: File, acceptedTypes: string[]): boolean {
  return acceptedTypes.some(type => {
    if (type.endsWith('/*')) {
      // 支援 image/*, application/* 等通配符
      const prefix = type.slice(0, -2)
      return file.type.startsWith(prefix)
    }
    return file.type === type
  })
}

/**
 * 驗證檔案大小
 */
export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}

/**
 * 判斷檔案類型（PDF 或圖片）
 */
export function getFileType(file: File): 'pdf' | 'image' | 'unknown' {
  if (file.type === 'application/pdf') {
    return 'pdf'
  }
  if (file.type.startsWith('image/')) {
    return 'image'
  }
  return 'unknown'
}
