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
import { FileText, Users, Activity, AlertCircle } from 'lucide-react'

const riskAssessmentSchema = z.object({
  stsScore: z.string().min(1, '請輸入 STS Score'),
  surgeon1: z.string().min(1, '請輸入第一位外科醫師姓名'),
  surgeon2: z.string().min(1, '請輸入第二位外科醫師姓名'),
  nyhaClass: z.enum(['I', 'II', 'III', 'IV'], {
    required_error: '請選擇 NYHA 心功能分級',
  }),
  urgencyReason: z.string().min(1, '請說明手術適應症與緊急性'),
})

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
      stsScore: defaultValues?.stsScore || '',
      surgeon1: defaultValues?.surgeon1 || '',
      surgeon2: defaultValues?.surgeon2 || '',
      nyhaClass: defaultValues?.nyhaClass || undefined,
      urgencyReason: defaultValues?.urgencyReason || '',
    },
  })

  const nyhaClass = watch('nyhaClass')

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
          {/* STS Score */}
          <div className="space-y-2">
            <Label htmlFor="stsScore" className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4" />
              STS Score <span className="text-red-500">*</span>
            </Label>
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
            <p className="text-sm text-gray-500">
              請輸入計算好的 STS Score 百分比（可在檢查報告中上傳計算結果截圖）
            </p>
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
          <div className="space-y-2">
            <Label htmlFor="urgencyReason" className="flex items-center gap-2 text-base">
              <AlertCircle className="w-4 h-4" />
              手術適應症與緊急性說明 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="urgencyReason"
              placeholder="例如：由於呼吸喘及心衰竭症狀越來越嚴重，主動脈瓣膜狹窄的情形(Critical AS)隨時都有猝死的可能。需盡快行經導管主動脈瓣膜置換術(TAVI)來改善的症狀。"
              rows={6}
              {...register('urgencyReason')}
              aria-describedby={errors.urgencyReason ? 'urgencyReason-error' : undefined}
              className="text-base resize-none"
            />
            {errors.urgencyReason && (
              <p id="urgencyReason-error" className="text-sm text-red-500">
                {errors.urgencyReason.message}
              </p>
            )}
            <p className="text-sm text-gray-500">
              請說明為何需要進行 TAVI 手術、症狀嚴重程度、以及手術的緊急性
            </p>
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
