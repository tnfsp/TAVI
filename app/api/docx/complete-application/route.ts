/**
 * API Route: 生成完整 TAVI 事前審查申請文件
 * POST /api/docx/complete-application
 */

import { NextRequest, NextResponse } from 'next/server'
import { Packer } from 'docx'
import { generateCompleteApplication } from '@/lib/docx/complete-application'
import type { CaseData } from '@/types'

// 增加請求大小限制到 50MB（因為可能有多張高解析度圖片）
export const runtime = 'nodejs'
export const maxDuration = 60 // 最長執行 60 秒
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { caseData, summaryContent, signedDocumentBase64 }: {
      caseData: CaseData
      summaryContent: string
      signedDocumentBase64?: string
    } = body

    // 驗證必要欄位
    if (!caseData || !caseData.patient) {
      return NextResponse.json(
        { error: '缺少病患資料' },
        { status: 400 }
      )
    }

    if (!summaryContent) {
      return NextResponse.json(
        { error: '缺少摘要內容，請先在步驟 7 生成醫師評估文件' },
        { status: 400 }
      )
    }

    // 生成 Word 文件
    const doc = await generateCompleteApplication(
      caseData,
      summaryContent,
      signedDocumentBase64
    )

    // 轉換為 Buffer
    const buffer = await Packer.toBuffer(doc)

    // 產生檔名：姓名+病歷號 - TAVI事前審查申請.docx
    const fileName = `${caseData.patient.name}${caseData.patient.chartNumber} - TAVI事前審查申請.docx`
    const encodedFileName = encodeURIComponent(fileName)

    // 返回 Word 檔案（將 Buffer 轉為 Uint8Array）
    return new NextResponse(Uint8Array.from(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`,
      },
    })
  } catch (error: any) {
    console.error('完整申請文件生成失敗:', error)
    return NextResponse.json(
      { error: '文件生成失敗: ' + error.message },
      { status: 500 }
    )
  }
}
