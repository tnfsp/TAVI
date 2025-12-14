'use client'

import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MEDICAL_HISTORY_LABELS, type MedicalHistoryType } from '@/types'

interface MedicalHistorySelectorProps {
  defaultValues?: MedicalHistoryType[]
  onSubmit: (selected: MedicalHistoryType[]) => void
}

export function MedicalHistorySelector({
  defaultValues = [],
  onSubmit,
}: MedicalHistorySelectorProps) {
  const [selected, setSelected] = useState<MedicalHistoryType[]>(defaultValues)

  useEffect(() => {
    setSelected(defaultValues)
  }, [defaultValues])

  const handleToggle = (item: MedicalHistoryType) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(selected)
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

          {/* 已選擇數量提示 */}
          {selected.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                已選擇 <span className="font-semibold">{selected.length}</span> 項病史
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
