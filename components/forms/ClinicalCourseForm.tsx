'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ClinicalCourse } from '@/types'

const clinicalCourseSchema = z.object({
  previousCare: z.string().min(1, '請輸入之前的就醫追蹤情形'),
  presentation: z.string().min(1, '請輸入本次就醫經過'),
})

type ClinicalCourseFormData = z.infer<typeof clinicalCourseSchema>

interface ClinicalCourseFormProps {
  defaultValues?: Partial<ClinicalCourse>
  onSubmit: (data: ClinicalCourse) => void
}

export function ClinicalCourseForm({
  defaultValues,
  onSubmit,
}: ClinicalCourseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClinicalCourseFormData>({
    resolver: zodResolver(clinicalCourseSchema),
    defaultValues: {
      previousCare: defaultValues?.previousCare || '',
      presentation: defaultValues?.presentation || '',
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">就醫歷程</CardTitle>
        <p className="text-sm text-gray-500">請描述病患的就醫追蹤與本次就醫經過</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 之前追蹤情形 */}
          <div className="space-y-2">
            <Label htmlFor="previousCare" className="text-base">
              之前追蹤情形 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="previousCare"
              placeholder="例如：在診所追蹤、在其他醫院追蹤心臟問題等"
              rows={3}
              {...register('previousCare')}
              aria-describedby={errors.previousCare ? 'previousCare-error' : undefined}
              className="text-base resize-none"
            />
            {errors.previousCare && (
              <p id="previousCare-error" className="text-sm text-red-500">
                {errors.previousCare.message}
              </p>
            )}
            <p className="text-sm text-gray-500">
              請描述病患在來本院就醫前的追蹤情形
            </p>
          </div>

          {/* 本次就醫經過 */}
          <div className="space-y-2">
            <Label htmlFor="presentation" className="text-base">
              本次就醫經過 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="presentation"
              placeholder="例如：因症狀加劇至本院就醫，經過檢查發現瓣膜狹窄變嚴重等"
              rows={4}
              {...register('presentation')}
              aria-describedby={errors.presentation ? 'presentation-error' : undefined}
              className="text-base resize-none"
            />
            {errors.presentation && (
              <p id="presentation-error" className="text-sm text-red-500">
                {errors.presentation.message}
              </p>
            )}
            <p className="text-sm text-gray-500">
              請描述病患這次來本院就醫的原因和經過
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="text-base px-8">
              儲存就醫歷程
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
