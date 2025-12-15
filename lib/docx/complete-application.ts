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
  convertInchesToTwip,
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
 * 建立文字段落
 */
function createTextParagraph(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        font: {
          name: '標楷體',
          eastAsia: '標楷體',
        },
        size: 24, // 12pt
      }),
    ],
    spacing: { line: 360 }, // 1.5 倍行距
    alignment: AlignmentType.JUSTIFIED,
  })
}

/**
 * 從 Base64 建立圖片段落
 */
function createImageParagraph(base64Data: string, width: number = 6): Paragraph {
  try {
    const imageBuffer = base64ToBuffer(base64Data)
    const format = detectImageFormat(base64Data)

    return new Paragraph({
      children: [
        new ImageRun({
          type: format,
          data: Uint8Array.from(imageBuffer),
          transformation: {
            width: convertInchesToTwip(width),
            height: convertInchesToTwip(width * 0.75), // 假設 4:3 比例
          },
        } as any), // 暫時使用 any 避免類型錯誤
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
    })
  } catch (error) {
    console.error('圖片插入失敗:', error)
    // 返回錯誤提示段落
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
    sections.push(createTextParagraph(exam.textContent))
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

  sections.push(createTextParagraph(summaryContent))
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
    // 使用已上傳的簽名文件
    sections.push(createImageParagraph(signedDocumentBase64, 7))
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
