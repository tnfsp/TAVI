import { NextRequest, NextResponse } from 'next/server';
import { generateSurgeonAssessment } from '@/lib/ai/claude';

export async function POST(request: NextRequest) {
  try {
    const caseData = await request.json();

    // 验证必要字段
    if (!caseData.patient || !caseData.riskAssessment) {
      return NextResponse.json(
        { error: '缺少必要的病患资料或风险评估信息' },
        { status: 400 }
      );
    }

    // 调用 Claude API 生成摘要段落
    const summary = await generateSurgeonAssessment(caseData);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Generate surgeon assessment error:', error);
    return NextResponse.json(
      { error: '生成医师评估文件失败，请稍后再试' },
      { status: 500 }
    );
  }
}
