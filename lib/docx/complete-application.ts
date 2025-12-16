/**
 * 完整 TAVI 事前審查申請文件生成
 * 包含 17 個區塊：摘要 + 14 種檢查 + STS Score + 醫師判定
 */

import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  ImageRun,
  LineRuleType,
} from 'docx'
import type { CaseData, Examination } from '@/types'

/**
 * 將 Base64 字串轉換為 Buffer
 */
function base64ToBuffer(base64: string): Buffer {
  // 移除 data URL 前綴（如果有）
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64
  return Buffer.from(base64Data, 'base64')
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
 * 每一行建立獨立的段落，模仿 Word 的自然換行行為
 */
function createTextParagraphs(text: string): Paragraph[] {
  // 將文字按換行符號分割
  const lines = text.split('\n')

  // 為每一行建立獨立的 Paragraph
  return lines.map(line =>
    new Paragraph({
      children: [
        new TextRun({
          text: line,
          font: {
            name: '標楷體',
            eastAsia: '標楷體',
          },
          size: 24, // 12pt
        })
      ],
      spacing: {
        before: 0, // 段前 0 pt
        after: 0,  // 段後 0 pt
        line: 360, // 行距值（12pt * 1.5 = 18pt = 360 twips）
        lineRule: LineRuleType.AT_LEAST, // 最小值
      },
      alignment: AlignmentType.JUSTIFIED,
    })
  )
}

/**
 * 計算圖片適合的尺寸（保持原始比例）
 * 所有圖片寬度統一為 17.5cm（約 6.89 英寸），高度按比例縮放
 */
function calculateImageSize(imageWidth: number, imageHeight: number): { width: number; height: number } {
  // 統一寬度為 17.5cm = 6.89 英寸
  const targetWidthInches = 6.89
  const maxHeightInches = 9.0 // 避免圖片太高

  // 計算長寬比
  const aspectRatio = imageWidth / imageHeight

  // 寬度設為目標寬度
  let finalWidth = targetWidthInches
  let finalHeight = finalWidth / aspectRatio

  // 如果高度超過限制，改以高度為準
  if (finalHeight > maxHeightInches) {
    finalHeight = maxHeightInches
    finalWidth = finalHeight * aspectRatio
  }

  return { width: finalWidth, height: finalHeight }
}

/**
 * 從 Buffer 取得圖片尺寸（支援 PNG 和 JPEG）
 */
function getImageDimensions(buffer: Buffer): { width: number; height: number } {
  // PNG 格式檢測 (89 50 4E 47)
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    // PNG: 寬度在 bytes 16-19, 高度在 bytes 20-23
    const width = buffer.readUInt32BE(16)
    const height = buffer.readUInt32BE(20)
    return { width, height }
  }

  // JPEG 格式檢測 (FF D8)
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    let offset = 2
    while (offset < buffer.length) {
      // 尋找 SOF0 marker (FF C0)
      if (buffer[offset] === 0xFF && (buffer[offset + 1] === 0xC0 || buffer[offset + 1] === 0xC2)) {
        const height = buffer.readUInt16BE(offset + 5)
        const width = buffer.readUInt16BE(offset + 7)
        return { width, height }
      }
      // 跳到下一個 marker
      if (buffer[offset] === 0xFF) {
        const markerLength = buffer.readUInt16BE(offset + 2)
        offset += markerLength + 2
      } else {
        offset++
      }
    }
  }

  // 如果無法解析，返回預設值（橫式 16:9）
  return { width: 1920, height: 1080 }
}

/**
 * 從 Base64 建立圖片段落（保持原始比例）
 */
function createImageParagraph(base64Data: string): Paragraph {
  try {
    const imageBuffer = base64ToBuffer(base64Data)
    const format = detectImageFormat(base64Data)

    // 取得圖片原始尺寸
    const { width: imgWidth, height: imgHeight } = getImageDimensions(imageBuffer)

    // 計算適合的顯示尺寸（英寸）
    const { width, height } = calculateImageSize(imgWidth, imgHeight)

    // docx.js ImageRun transformation 使用 EMUs (English Metric Units)
    // 1 inch = 914400 EMUs
    const EMUS_PER_INCH = 914400
    const widthInEMUs = Math.round(width * EMUS_PER_INCH)
    const heightInEMUs = Math.round(height * EMUS_PER_INCH)

    return new Paragraph({
      children: [
        new ImageRun({
          type: format,
          data: Uint8Array.from(imageBuffer),
          transformation: {
            width: widthInEMUs,
            height: heightInEMUs,
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

  // 區塊標題
  sections.push(createSectionTitle(number, labelMap[exam.type] || exam.type))

  // 文字內容
  if (exam.textContent) {
    sections.push(...createTextParagraphs(exam.textContent))
  }

  // Lab Findings（如果是檢驗報告）
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
          color: 'FF0000', // 紅字標註
        }),
      ],
      spacing: { line: 360 },
    }))
  }

  // 圖片
  if (exam.images && exam.images.length > 0) {
    exam.images.forEach((img) => {
      sections.push(createImageParagraph(img))
    })
  }

  // 分隔線
  sections.push(createDivider())

  return sections
}

/**
 * 生成完整事前審查申請文件
 */
export async function generateCompleteApplication(
  caseData: CaseData,
  summaryContent: string, // 從 Phase 2 生成的摘要
  signedDocumentBase64?: string // 已簽名文件（可選）
): Promise<Document> {
  const sections: Paragraph[] = []

  // 檢查類型標籤對應
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

  // 區塊計數器
  let sectionNumber = 1

  // ========== 1. TAVI 事前審查摘要段落 ==========
  sections.push(new Paragraph({
    text: 'TAVI 事前審查',
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 400 },
  }))

  sections.push(...createTextParagraphs(summaryContent))
  sections.push(createDivider())

  // ========== 2-16. 檢查報告區塊（動態組裝） ==========
  // 按照標準順序排列檢查類型
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
    // 找出該類型的所有檢查（可能有多個日期的檢查）
    const exams = caseData.examinations.filter(e => e.type === examType)

    exams.forEach((exam) => {
      const examSections = createExaminationSection(sectionNumber, exam, EXAM_LABELS)
      sections.push(...examSections)
      sectionNumber++
    })
  })

  // ========== 17. 二位心臟外科專科醫師判定 ==========
  sections.push(createSectionTitle(
    sectionNumber,
    '二位心臟外科專科醫師判定無法以傳統開心手術進行主動脈瓣膜置換或開刀危險性過高'
  ))

  if (signedDocumentBase64) {
    // 使用已上傳的簽名文件（自動取得正確尺寸和比例）
    sections.push(createImageParagraph(signedDocumentBase64))
  } else {
    // 使用預設佔位圖片/文字
    sections.push(new Paragraph({
      text: '[請在步驟 8 上傳已簽名的醫師評估文件]',
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
      style: 'Strong',
    }))
  }

  // ========== 建立 Word 文件 ==========
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
            size: 24, // 12pt
          },
          paragraph: {
            spacing: {
              line: 360, // 1.5 倍行距
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
            size: 28, // 14pt
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

  return doc
}
