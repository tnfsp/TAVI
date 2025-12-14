import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function GET() {
  try {
    // 檢查 API Key 是否存在
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: '未設定 ANTHROPIC_API_KEY' },
        { status: 500 }
      )
    }

    // 初始化 Claude API 客戶端
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    // 發送簡單測試請求
    const message = await client.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: '請回覆：API 連線測試成功',
        },
      ],
    })

    // 提取回應內容
    const response = message.content[0]
    const text = response.type === 'text' ? response.text : '無法解析回應'

    return NextResponse.json({
      success: true,
      message: 'Claude API 連線成功',
      response: text,
      model: message.model,
      usage: message.usage,
    })
  } catch (error: any) {
    console.error('Claude API 測試失敗:', error)
    return NextResponse.json(
      {
        error: 'Claude API 連線失敗',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
