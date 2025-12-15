'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { RiskAssessment, NYHAClass } from '@/types'
import { NYHA_LABELS } from '@/types'
import { FileText, Users, Activity, AlertCircle, ExternalLink, Plus } from 'lucide-react'

// 常用手術適應症範本
const URGENCY_TEMPLATES = [
  {
    label: '症狀惡化 + Critical AS',
    text: '由於呼吸喘及心衰竭症狀越來越嚴重，主動脈瓣膜狹窄的情形(Critical AS)隨時都有猝死的可能。需盡快行經導管主動脈瓣膜置換術(TAVI)來改善症狀。',
  },
  {
    label: 'NYHA III-IV + 傳統手術高風險',
    text: '病患心功能不佳，已達 NYHA Class III-IV，經兩位心臟外科專科醫師評估傳統主動脈瓣膜手術風險過高，符合健保局經導管主動脈瓣膜置換手術的適應症。',
  },
  {
    label: 'Low flow low gradient',
    text: '嚴重主動脈瓣膜狹窄且屬於 Low cardiac output, Low pressure gradient，傳統手術風險極高，建議進行經導管主動脈瓣膜置換術(TAVI)。',
  },
  {
    label: '生活品質 + 預後評估',
    text: '病患平時日常生活在家人協助下可以自理，臨床上判定病人至少有一年以上之存活機率。由於症狀持續惡化，建議盡快進行 TAVI 手術以改善生活品質。',
  },
]

const riskAssessmentSchema = z.object({
  scoreType: z.enum(['sts', 'euroscore']).optional(),
  stsScore: z.string().optional(),
  euroScore: z.string().optional(),
  surgeon1: z.string().min(1, '請輸入第一位外科醫師姓名'),
  surgeon2: z.string().min(1, '請輸入第二位外科醫師姓名'),
  nyhaClass: z.enum(['I', 'II', 'III', 'IV'], {
    message: '請選擇 NYHA 心功能分級',
  }),
  urgencyReason: z.string().min(1, '請說明手術適應症與緊急性'),
}).refine(
  (data) => {
    // 根據 scoreType 驗證對應的 score 欄位
    if (data.scoreType === 'sts') {
      return !!data.stsScore && data.stsScore.trim().length > 0
    } else if (data.scoreType === 'euroscore') {
      return !!data.euroScore && data.euroScore.trim().length > 0
    }
    // 預設要求 STS Score
    return !!data.stsScore && data.stsScore.trim().length > 0
  },
  {
    message: '請輸入風險評分',
    path: ['stsScore'], // 錯誤訊息顯示位置
  }
)

type RiskAssessmentFormData = z.infer<typeof riskAssessmentSchema>

interface RiskAssessmentFormProps {
  defaultValues?: Partial<RiskAssessment>
  onSubmit: (data: RiskAssessment) => void
}

export function RiskAssessmentForm({
  defaultValues,
  onSubmit,
}: RiskAssessmentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RiskAssessmentFormData>({
    resolver: zodResolver(riskAssessmentSchema),
    defaultValues: {
      scoreType: defaultValues?.scoreType || 'sts',
      stsScore: defaultValues?.stsScore || '',
      euroScore: defaultValues?.euroScore || '',
      surgeon1: defaultValues?.surgeon1 || '',
      surgeon2: defaultValues?.surgeon2 || '',
      nyhaClass: defaultValues?.nyhaClass || undefined,
      urgencyReason: defaultValues?.urgencyReason || '',
    },
  })

  const scoreType = watch('scoreType')
  const nyhaClass = watch('nyhaClass')
  const urgencyReason = watch('urgencyReason')

  // 插入範本文字
  const insertTemplate = (text: string) => {
    const currentText = urgencyReason || ''
    const newText = currentText ? `${currentText}\n\n${text}` : text
    setValue('urgencyReason', newText, { shouldValidate: true })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">手術風險評估與適應症</CardTitle>
        <p className="text-sm text-gray-500">
          請填寫 STS Score、外科醫師評估、心功能分級及手術適應症
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 風險評分類型選擇 */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4" />
              風險評分 <span className="text-red-500">*</span>
            </Label>

            {/* 切換按鈕（Tab 樣式） */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setValue('scoreType', 'sts', { shouldValidate: true })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  scoreType === 'sts'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                STS Score
              </button>
              <button
                type="button"
                onClick={() => setValue('scoreType', 'euroscore', { shouldValidate: true })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  scoreType === 'euroscore'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                EuroSCORE
              </button>
            </div>

            {/* STS Score 輸入（條件顯示） */}
            {scoreType === 'sts' && (
              <div className="space-y-2">
                <Input
                  id="stsScore"
                  placeholder="例如：>10% 或 12.5%"
                  {...register('stsScore')}
                  aria-describedby={errors.stsScore ? 'stsScore-error' : undefined}
                  className="text-base"
                />
                {errors.stsScore && (
                  <p id="stsScore-error" className="text-sm text-red-500">
                    {errors.stsScore.message}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>請輸入計算好的 STS Score 百分比</span>
                  <span>•</span>
                  <a
                    href="https://riskcalc.sts.org/stswebriskcalc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    開啟 STS Calculator
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* EuroSCORE 輸入（條件顯示） */}
            {scoreType === 'euroscore' && (
              <div className="space-y-2">
                <Input
                  id="euroScore"
                  placeholder="例如：8.5% 或 >10%"
                  {...register('euroScore')}
                  aria-describedby={errors.euroScore ? 'euroScore-error' : undefined}
                  className="text-base"
                />
                {errors.euroScore && (
                  <p id="euroScore-error" className="text-sm text-red-500">
                    {errors.euroScore.message}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>請輸入計算好的 EuroSCORE 百分比（舊版）</span>
                  <span>•</span>
                  <a
                    href="http://www.euroscore.org/calc.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    開啟 EuroSCORE Calculator
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 外科醫師評估 */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4" />
              外科醫師評估 <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-500">
              請輸入兩位心臟外科專科醫師的姓名（評估傳統手術風險高）
            </p>

            {/* 第一位醫師 */}
            <div className="space-y-2">
              <Label htmlFor="surgeon1" className="text-sm">
                第一位外科醫師
              </Label>
              <Input
                id="surgeon1"
                placeholder="例如：謝炯昭"
                {...register('surgeon1')}
                aria-describedby={errors.surgeon1 ? 'surgeon1-error' : undefined}
                className="text-base"
              />
              {errors.surgeon1 && (
                <p id="surgeon1-error" className="text-sm text-red-500">
                  {errors.surgeon1.message}
                </p>
              )}
            </div>

            {/* 第二位醫師 */}
            <div className="space-y-2">
              <Label htmlFor="surgeon2" className="text-sm">
                第二位外科醫師
              </Label>
              <Input
                id="surgeon2"
                placeholder="例如：曾政哲"
                {...register('surgeon2')}
                aria-describedby={errors.surgeon2 ? 'surgeon2-error' : undefined}
                className="text-base"
              />
              {errors.surgeon2 && (
                <p id="surgeon2-error" className="text-sm text-red-500">
                  {errors.surgeon2.message}
                </p>
              )}
            </div>
          </div>

          {/* NYHA 心功能分級 */}
          <div className="space-y-2">
            <Label htmlFor="nyhaClass" className="flex items-center gap-2 text-base">
              <Activity className="w-4 h-4" />
              NYHA 心功能分級 <span className="text-red-500">*</span>
            </Label>
            <Select
              value={nyhaClass}
              onValueChange={(value) => setValue('nyhaClass', value as NYHAClass, { shouldValidate: true })}
            >
              <SelectTrigger id="nyhaClass" className="text-base">
                <SelectValue placeholder="請選擇心功能分級" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(NYHA_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.nyhaClass && (
              <p className="text-sm text-red-500">
                {errors.nyhaClass.message}
              </p>
            )}
            <p className="text-sm text-gray-500">
              NYHA 分級用於評估心臟衰竭的嚴重程度
            </p>
          </div>

          {/* 手術適應症與緊急性說明 */}
          <div className="space-y-3">
            <Label htmlFor="urgencyReason" className="flex items-center gap-2 text-base">
              <AlertCircle className="w-4 h-4" />
              手術適應症與緊急性說明 <span className="text-red-500">*</span>
            </Label>

            {/* 快捷輸入按鈕 */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">快捷輸入：</p>
              <div className="flex flex-wrap gap-2">
                {URGENCY_TEMPLATES.map((template, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertTemplate(template.text)}
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {template.label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                點擊按鈕可快速插入常用說明文字（可自行修改）
              </p>
            </div>

            <Textarea
              id="urgencyReason"
              placeholder="請說明為何需要進行 TAVI 手術、症狀嚴重程度、以及手術的緊急性..."
              rows={8}
              {...register('urgencyReason')}
              aria-describedby={errors.urgencyReason ? 'urgencyReason-error' : undefined}
              className="text-base resize-none"
            />
            {errors.urgencyReason && (
              <p id="urgencyReason-error" className="text-sm text-red-500">
                {errors.urgencyReason.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" size="lg" className="text-base px-8">
              儲存風險評估
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
