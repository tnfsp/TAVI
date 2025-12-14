'use client'

import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MEDICAL_HISTORY_LABELS, type MedicalHistoryType } from '@/types'

interface MedicalHistorySelectorProps {
  defaultValues?: MedicalHistoryType[]
  defaultCustomHistory?: string
  onSubmit: (data: { selected: MedicalHistoryType[]; customHistory: string }) => void
}

export function MedicalHistorySelector({
  defaultValues = [],
  defaultCustomHistory = '',
  onSubmit,
}: MedicalHistorySelectorProps) {
  const [selected, setSelected] = useState<MedicalHistoryType[]>(defaultValues)
  const [customHistory, setCustomHistory] = useState(defaultCustomHistory)

  useEffect(() => {
    setSelected(defaultValues)
    setCustomHistory(defaultCustomHistory)
  }, [defaultValues, defaultCustomHistory])

  const handleToggle = (item: MedicalHistoryType) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ selected, customHistory })
  }

  const medicalHistoryOptions = Object.keys(MEDICAL_HISTORY_LABELS) as MedicalHistoryType[]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">病史選擇</CardTitle>
        <p className="text-sm text-gray-500">請選擇病患的相關病史（可複選）</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicalHistoryOptions.map((item) => (
              <div key={item} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id={`history-${item}`}
                  checked={selected.includes(item)}
                  onCheckedChange={() => handleToggle(item)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`history-${item}`}
                    className="text-base font-normal cursor-pointer leading-relaxed"
                  >
                    {MEDICAL_HISTORY_LABELS[item]}
                    <span className="text-sm text-gray-500 ml-2">({item})</span>
                  </Label>
                </div>
              </div>
            ))}
          </div>

          {/* 其他病史（自訂輸入） */}
          <div className="space-y-3">
            <Label htmlFor="custom-history" className="text-base font-medium">
              其他病史
            </Label>
            <Textarea
              id="custom-history"
              placeholder="請輸入其他病史（例如：Parkinson's disease、Peripheral artery disease 等）"
              value={customHistory}
              onChange={(e) => setCustomHistory(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              若有上方未列出的病史，請在此輸入（可輸入中文或英文醫學術語）
            </p>
          </div>

          {/* 已選擇數量提示 */}
          {(selected.length > 0 || customHistory.trim()) && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                已選擇 <span className="font-semibold">{selected.length}</span> 項病史
                {customHistory.trim() && <span> + 其他病史</span>}
              </p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="text-base px-8">
              儲存病史
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
