'use client'

import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SYMPTOM_LABELS, type SymptomType } from '@/types'

interface SymptomSelectorProps {
  defaultValues?: {
    symptoms: SymptomType[]
    symptomOnset: string
  }
  onSubmit: (data: { symptoms: SymptomType[]; symptomOnset: string }) => void
}

export function SymptomSelector({
  defaultValues = { symptoms: [], symptomOnset: '' },
  onSubmit,
}: SymptomSelectorProps) {
  const [selected, setSelected] = useState<SymptomType[]>(defaultValues.symptoms)
  const [symptomOnset, setSymptomOnset] = useState(defaultValues.symptomOnset)

  useEffect(() => {
    setSelected(defaultValues.symptoms)
    setSymptomOnset(defaultValues.symptomOnset)
  }, [defaultValues])

  const handleToggle = (item: SymptomType) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ symptoms: selected, symptomOnset })
  }

  const symptomOptions = Object.keys(SYMPTOM_LABELS) as SymptomType[]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">症狀選擇</CardTitle>
        <p className="text-sm text-gray-500">請選擇病患的症狀（可複選）</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 症狀選擇 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {symptomOptions.map((item) => (
              <div
                key={item}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  id={`symptom-${item}`}
                  checked={selected.includes(item)}
                  onCheckedChange={() => handleToggle(item)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`symptom-${item}`}
                    className="text-base font-normal cursor-pointer leading-relaxed"
                  >
                    {SYMPTOM_LABELS[item]}
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
                已選擇 <span className="font-semibold">{selected.length}</span> 項症狀
              </p>
            </div>
          )}

          {/* 症狀發生時間 */}
          <div className="space-y-2">
            <Label htmlFor="symptomOnset" className="text-base">
              症狀發生時間描述
            </Label>
            <Input
              id="symptomOnset"
              placeholder="例如：近期、三個月前、去年開始等"
              value={symptomOnset}
              onChange={(e) => setSymptomOnset(e.target.value)}
              className="text-base"
            />
            <p className="text-sm text-gray-500">
              請描述症狀開始出現的時間，例如「近期」「三個月前」等
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="text-base px-8">
              儲存症狀
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
