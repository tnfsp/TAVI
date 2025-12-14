import { NextRequest, NextResponse } from 'next/server';
import { Packer } from 'docx';
import {
  createSurgeonAssessmentDocument,
  generateFileName,
} from '@/lib/docx/surgeon-assessment';

export async function POST(request: NextRequest) {
  try {
    const { patientInfo, summary } = await request.json();

    // 驗證必要欄位
    if (!patientInfo?.name || !patientInfo?.chartNumber || !summary) {
      return NextResponse.json(
        { error: '缺少必要的病患資料或摘要內容' },
        { status: 400 }
      );
    }

    // 生成 Word 文件
    const doc = createSurgeonAssessmentDocument(patientInfo, summary);

    // 將文件轉換為 buffer
    const buffer = await Packer.toBuffer(doc);

    // 生成檔案名稱
    const fileName = generateFileName(
      patientInfo.name,
      patientInfo.chartNumber
    );

    // 返回檔案
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(
          fileName
        )}.docx"`,
      },
    });
  } catch (error) {
    console.error('Generate Word document error:', error);
    return NextResponse.json(
      { error: '生成 Word 文件失敗，請稍後再試' },
      { status: 500 }
    );
  }
}
