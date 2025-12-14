import Anthropic from '@anthropic-ai/sdk';

// 初始化 Claude API 客户端
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * 调用 Claude API 生成文本
 * @param systemPrompt 系统提示词
 * @param userPrompt 用户提示词
 * @param maxTokens 最大生成 token 数
 * @returns 生成的文本内容
 */
export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 2000
): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // 提取文本内容
    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response');
    }

    return textContent.text;
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to generate text from Claude API');
  }
}

/**
 * 生成医师评估摘要段落
 * @param caseData 案例数据
 * @returns 生成的摘要段落
 */
export async function generateSurgeonAssessment(caseData: any): Promise<string> {
  const { generateSurgeonAssessmentPrompt } = await import('./prompts/surgeon-assessment');
  const { systemPrompt, userPrompt } = generateSurgeonAssessmentPrompt(caseData);

  return await generateText(systemPrompt, userPrompt, 3000);
}
