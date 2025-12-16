/**
 * 完整 TAVI 事前審查申請文件生成（瀏覽器端版本）
 * 包含 17 個區塊：摘要 + 14 種檢查 + STS Score + 醫師判定
 *
 * 此版本使用 Uint8Array 代替 Buffer，可在瀏覽器中直接執行
 */

import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  ImageRun,
  LineRuleType,
  Packer,
} from 'docx'
import type { CaseData, Examination } from '@/types'

/**
 * 將 Base64 字串轉換為 Uint8Array（瀏覽器兼容）
 */
function base64ToUint8Array(base64: string): Uint8Array {
  // 移除 data URL 前綴（如果有）
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64
  const binaryString = atob(base64Data)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

/**
 * 從 Base64 字串偵測圖片格式
 */
function detectImageFormat(base64: string): 'jpg' | 'png' | 'gif' | 'bmp' {
  if (base64.startsWith('data:image/png')) return 'png'
  if (base64.startsWith('data:image/jpeg') || base64.startsWith('data:image/jpg')) return 'jpg'
  if (base64.startsWith('data:image/gif')) return 'gif'
  if (base64.startsWith('data:image/bmp')) return 'bmp'

  // 預設使用 PNG
  return 'png'
}

/**
 * 建立區塊標題
 */
function createSectionTitle(number: number, title: string): Paragraph {
  return new Paragraph({
    text: `${number}. ${title}`,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    style: 'Heading1',
  })
}

/**
 * 建立分隔線
 */
function createDivider(): Paragraph {
  return new Paragraph({
    text: '═══════════════════════════════════════',
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
  })
}

/**
 * 建立文字段落（支援換行）
 */
function createTextParagraphs(text: string): Paragraph[] {
  const lines = text.split('\n')
  return lines.map(line =>
    new Paragraph({
      children: [
        new TextRun({
          text: line,
          font: {
            name: '標楷體',
            eastAsia: '標楷體',
          },
          size: 24,
        })
      ],
      spacing: {
        before: 0,
        after: 0,
        line: 360,
        lineRule: LineRuleType.AT_LEAST,
      },
      alignment: AlignmentType.JUSTIFIED,
    })
  )
}

/**
 * 計算圖片適合的尺寸（保持原始比例）
 */
function calculateImageSize(imageWidth: number, imageHeight: number): { width: number; height: number } {
  const targetWidthInches = 6.89
  const maxHeightInches = 9.0

  const aspectRatio = imageWidth / imageHeight
  let finalWidth = targetWidthInches
  let finalHeight = finalWidth / aspectRatio

  if (finalHeight > maxHeightInches) {
    finalHeight = maxHeightInches
    finalWidth = finalHeight * aspectRatio
  }

  return { width: finalWidth, height: finalHeight }
}

/**
 * 從 Uint8Array 取得圖片尺寸（支援 PNG 和 JPEG）
 */
function getImageDimensions(data: Uint8Array): { width: number; height: number } {
  // PNG 格式檢測 (89 50 4E 47)
  if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4E && data[3] === 0x47) {
    // PNG: 寬度在 bytes 16-19, 高度在 bytes 20-23
    const width = (data[16] << 24) | (data[17] << 16) | (data[18] << 8) | data[19]
    const height = (data[20] << 24) | (data[21] << 16) | (data[22] << 8) | data[23]
    return { width, height }
  }

  // JPEG 格式檢測 (FF D8)
  if (data[0] === 0xFF && data[1] === 0xD8) {
    let offset = 2
    while (offset < data.length) {
      if (data[offset] === 0xFF && (data[offset + 1] === 0xC0 || data[offset + 1] === 0xC2)) {
        const height = (data[offset + 5] << 8) | data[offset + 6]
        const width = (data[offset + 7] << 8) | data[offset + 8]
        return { width, height }
      }
      if (data[offset] === 0xFF) {
        const markerLength = (data[offset + 2] << 8) | data[offset + 3]
        offset += markerLength + 2
      } else {
        offset++
      }
    }
  }

  // 預設值
  return { width: 1920, height: 1080 }
}

/**
 * 從 Base64 建立圖片段落
 */
function createImageParagraph(base64Data: string): Paragraph {
  try {
    const imageData = base64ToUint8Array(base64Data)
    const format = detectImageFormat(base64Data)
    const { width: imgWidth, height: imgHeight } = getImageDimensions(imageData)
    const { width, height } = calculateImageSize(imgWidth, imgHeight)

    const DPI = 96
    const widthInPixels = Math.round(width * DPI)
    const heightInPixels = Math.round(height * DPI)

    return new Paragraph({
      children: [
        new ImageRun({
          type: format,
          data: imageData,
          transformation: {
            width: widthInPixels,
            height: heightInPixels,
          },
        } as any),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
    })
  } catch (error) {
    console.error('圖片插入失敗:', error)
    return new Paragraph({
      text: '[圖片載入失敗]',
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
    })
  }
}

/**
 * 建立檢查區塊
 */
function createExaminationSection(
  number: number,
  exam: Examination,
  labelMap: Record<string, string>
): Paragraph[] {
  const sections: Paragraph[] = []

  sections.push(createSectionTitle(number, labelMap[exam.type] || exam.type))

  if (exam.textContent) {
    sections.push(...createTextParagraphs(exam.textContent))
  }

  if (exam.type === 'lab-report' && exam.labFindings) {
    sections.push(new Paragraph({
      children: [
        new TextRun({
          text: '重要 Lab Findings：',
          font: { name: '標楷體', eastAsia: '標楷體' },
          size: 24,
          bold: true,
        }),
        new TextRun({
          text: exam.labFindings,
          font: { name: '標楷體', eastAsia: '標楷體' },
          size: 24,
          color: 'FF0000',
        }),
      ],
      spacing: { line: 360 },
    }))
  }

  if (exam.images && exam.images.length > 0) {
    exam.images.forEach((img) => {
      sections.push(createImageParagraph(img))
    })
  }

  sections.push(createDivider())

  return sections
}

/**
 * 生成完整事前審查申請文件（瀏覽器端）
 * 直接返回 Blob，可用於下載
 */
export async function generateCompleteApplicationBlob(
  caseData: CaseData,
  summaryContent: string,
  signedDocumentBase64?: string
): Promise<Blob> {
  const sections: Paragraph[] = []

  const EXAM_LABELS: Record<string, string> = {
    'echocardiography': '心臟超音波檢查',
    'catheterization': '心導管檢查',
    'ekg': 'EKG 心電圖檢查',
    'chest-xray': 'Chest X-ray',
    'heart-ct': 'Heart CT',
    'pulmonary-function': '肺功能檢查',
    'abi': '四肢血流探測 (ABI)',
    'myocardial-perfusion-scan': '心肌灌注掃描',
    'vital-signs': '生理測量資訊',
    'lab-report': '檢驗報告',
    'medical-record': '就醫紀錄',
    'medication-record': '就醫用藥',
    'list-of-diagnosis': 'List of Diagnosis (Problem List)',
    'assessment-and-plan': 'Assessment and Plan',
    'sts-score': 'STS Score',
    'euroscore': 'EuroSCORE',
  }

  let sectionNumber = 1

  // 1. TAVI 事前審查摘要段落
  sections.push(new Paragraph({
    text: 'TAVI 事前審查',
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 400 },
  }))

  sections.push(...createTextParagraphs(summaryContent))
  sections.push(createDivider())

  // 2-16. 檢查報告區塊
  const examOrder = [
    'echocardiography',
    'catheterization',
    'ekg',
    'chest-xray',
    'heart-ct',
    'pulmonary-function',
    'abi',
    'myocardial-perfusion-scan',
    'vital-signs',
    'lab-report',
    'medical-record',
    'medication-record',
    'list-of-diagnosis',
    'assessment-and-plan',
    'sts-score',
    'euroscore',
  ]

  examOrder.forEach((examType) => {
    const exams = caseData.examinations.filter(e => e.type === examType)
    exams.forEach((exam) => {
      const examSections = createExaminationSection(sectionNumber, exam, EXAM_LABELS)
      sections.push(...examSections)
      sectionNumber++
    })
  })

  // 17. 二位心臟外科專科醫師判定
  sections.push(createSectionTitle(
    sectionNumber,
    '二位心臟外科專科醫師判定無法以傳統開心手術進行主動脈瓣膜置換或開刀危險性過高'
  ))

  if (signedDocumentBase64) {
    sections.push(createImageParagraph(signedDocumentBase64))
  } else {
    sections.push(new Paragraph({
      text: '[請在步驟 8 上傳已簽名的醫師評估文件]',
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
      style: 'Strong',
    }))
  }

  // 建立 Word 文件
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
    styles: {
      default: {
        document: {
          run: {
            font: {
              name: 'Times New Roman',
              eastAsia: '標楷體',
            },
            size: 24,
          },
          paragraph: {
            spacing: {
              line: 360,
            },
            alignment: AlignmentType.JUSTIFIED,
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            size: 28,
            bold: true,
            font: {
              name: 'Times New Roman',
              eastAsia: '標楷體',
            },
          },
          paragraph: {
            spacing: {
              before: 400,
              after: 200,
            },
          },
        },
        {
          id: 'Strong',
          name: 'Strong',
          basedOn: 'Normal',
          run: {
            bold: true,
            color: 'FF0000',
          },
        },
      ],
    },
  })

  // 使用 Packer.toBlob 生成 Blob（瀏覽器端）
  return await Packer.toBlob(doc)
}
