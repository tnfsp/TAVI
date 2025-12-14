'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { PatientInfo } from '@/types'

// Zod 驗證 schema
const patientSchema = z.object({
  name: z.string().min(2, '姓名至少需要 2 個字').max(10, '姓名最多 10 個字'),
  chartNumber: z.string().min(1, '請輸入病歷號'),
  gender: z.enum(['male', 'female'], { message: '請選擇性別' }),
  age: z.number().min(0, '年齡不可為負數').max(150, '請輸入有效年齡'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '請輸入正確的日期格式 (YYYY-MM-DD)'),
  nationalId: z.string().min(10, '身分證號格式錯誤').max(10, '身分證號格式錯誤'),
})

type PatientFormData = z.infer<typeof patientSchema>

interface PatientInfoFormProps {
  defaultValues?: Partial<PatientInfo>
  onSubmit: (data: PatientInfo) => void
}

export function PatientInfoForm({ defaultValues, onSubmit }: PatientInfoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      chartNumber: defaultValues?.chartNumber || '',
      gender: defaultValues?.gender || 'female',
      age: defaultValues?.age || 0,
      birthDate: defaultValues?.birthDate || '',
      nationalId: defaultValues?.nationalId || '',
    },
  })

  const gender = watch('gender')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">病患基本資料</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 姓名與病歷號 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                姓名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="請輸入姓名"
                {...register('name')}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className="text-base"
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="chartNumber">
                病歷號 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="chartNumber"
                placeholder="請輸入病歷號"
                {...register('chartNumber')}
                aria-describedby={errors.chartNumber ? 'chartNumber-error' : undefined}
                className="text-base"
              />
              {errors.chartNumber && (
                <p id="chartNumber-error" className="text-sm text-red-500">
                  {errors.chartNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* 性別與年齡 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">
                性別 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={gender}
                onValueChange={(value) => setValue('gender', value as 'male' | 'female')}
              >
                <SelectTrigger id="gender" className="text-base">
                  <SelectValue placeholder="請選擇性別" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">男性</SelectItem>
                  <SelectItem value="female">女性</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">
                年齡 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="請輸入年齡"
                {...register('age')}
                aria-describedby={errors.age ? 'age-error' : undefined}
                className="text-base"
              />
              {errors.age && (
                <p id="age-error" className="text-sm text-red-500">
                  {errors.age.message}
                </p>
              )}
            </div>
          </div>

          {/* 出生日期與身分證號 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">
                出生日期 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="birthDate"
                type="date"
                {...register('birthDate')}
                aria-describedby={errors.birthDate ? 'birthDate-error' : undefined}
                className="text-base"
              />
              {errors.birthDate && (
                <p id="birthDate-error" className="text-sm text-red-500">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalId">
                身分證號 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nationalId"
                placeholder="請輸入身分證號"
                maxLength={10}
                {...register('nationalId')}
                aria-describedby={errors.nationalId ? 'nationalId-error' : undefined}
                className="text-base"
              />
              {errors.nationalId && (
                <p id="nationalId-error" className="text-sm text-red-500">
                  {errors.nationalId.message}
                </p>
              )}
            </div>
          </div>

          {/* 提交按鈕 */}
          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="text-base px-8">
              儲存基本資料
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
