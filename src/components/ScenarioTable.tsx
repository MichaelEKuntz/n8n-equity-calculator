import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import type { Scenario } from '@/constants'
import { generateId } from '@/constants'
import type { ScenarioResult } from '@/utils/calculations'
import { calculateScenario } from '@/utils/calculations'
import { formatEur, formatMultiple, formatPercent, formatValuationInput } from '@/utils/formatters'

interface ScenarioTableProps {
  scenarios: Scenario[]
  onScenariosChange: (scenarios: Scenario[]) => void
  shares: number
  actualAwardValue: number
  sharePrice: number
  strikePrice: number
}

export function ScenarioTable({
  scenarios,
  onScenariosChange,
  shares,
  actualAwardValue,
  sharePrice,
  strikePrice,
}: ScenarioTableProps) {
  const results: ScenarioResult[] = useMemo(
    () => scenarios.map((s) => calculateScenario(s, shares, actualAwardValue, sharePrice, strikePrice)),
    [scenarios, shares, actualAwardValue, sharePrice, strikePrice],
  )

  const updateScenario = (id: string, updates: Partial<Scenario>) => {
    onScenariosChange(
      scenarios.map((s) => {
        if (s.id !== id) return s
        const updated = { ...s, ...updates }
        if ('valuation' in updates) {
          updated.label = formatValuationInput(updated.valuation)
        }
        return updated
      }),
    )
  }

  const addScenario = () => {
    const lastValuation = scenarios[scenarios.length - 1]?.valuation ?? 10_000_000_000
    const newValuation = lastValuation * 2
    onScenariosChange([
      ...scenarios,
      {
        id: generateId(),
        valuation: newValuation,
        label: formatValuationInput(newValuation),
        rounds: 2,
        dilutionPerRound: 0.10,
        isCurrent: false,
      },
    ])
  }

  const removeScenario = (id: string) => {
    onScenariosChange(scenarios.filter((s) => s.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exit Scenario Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-n8n-border">
                <th className="text-left pb-2 pr-4 font-semibold text-[13px] text-n8n-text">
                  Company Valuation
                </th>
                <th className="text-left pb-2 pr-4 font-semibold text-[13px] text-n8n-text">
                  Rounds
                </th>
                <th className="text-left pb-2 pr-4 font-semibold text-[13px] text-n8n-text">
                  Dilution / Round
                </th>
                <th className="text-right pb-2 pr-4 font-semibold text-[13px] text-n8n-text">
                  Dilution Applied
                </th>
                <th className="text-right pb-2 pr-4 font-semibold text-[13px] text-n8n-text">
                  Your Equity Value
                </th>
                <th className="text-right pb-2 pr-4 font-semibold text-[13px] text-n8n-text">
                  Multiple
                </th>
                <th className="w-8 pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <ScenarioRow
                  key={r.scenario.id}
                  result={r}
                  index={i}
                  onUpdate={(updates) => updateScenario(r.scenario.id, updates)}
                  onRemove={
                    r.scenario.isCurrent ? undefined : () => removeScenario(r.scenario.id)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={addScenario}>
            + Add scenario
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ScenarioRow({
  result,
  index,
  onUpdate,
  onRemove,
}: {
  result: ScenarioResult
  index: number
  onUpdate: (updates: Partial<Scenario>) => void
  onRemove?: () => void
}) {
  const { scenario, netValue, multiple, totalDilution } = result
  const isCurrent = scenario.isCurrent
  const [editingValuation, setEditingValuation] = useState(false)

  return (
    <tr
      className={`border-b border-n8n-border/50 ${
        isCurrent ? 'border-l-4 border-l-n8n-pink' : ''
      } ${index % 2 === 1 ? 'bg-n8n-zebra' : ''}`}
    >
      {/* Valuation */}
      <td className="py-2.5 pr-4">
        {editingValuation ? (
          <Input
            type="number"
            autoFocus
            min={0}
            step={100_000_000}
            value={scenario.valuation}
            onChange={(e) => onUpdate({ valuation: Number(e.target.value) || 0 })}
            onBlur={() => setEditingValuation(false)}
            onKeyDown={(e) => { if (e.key === 'Enter') setEditingValuation(false) }}
            className="h-8 w-36 text-xs"
          />
        ) : (
          <button
            onClick={() => setEditingValuation(true)}
            className="font-medium text-n8n-text hover:text-n8n-pink transition-colors cursor-pointer"
          >
            {scenario.label}
            {isCurrent && (
              <span className="ml-2 text-xs text-n8n-text-secondary">(current)</span>
            )}
          </button>
        )}
      </td>

      {/* Rounds */}
      <td className="py-2.5 pr-4">
        <div className="flex items-center gap-3 min-w-[100px]">
          <Slider
            value={[scenario.rounds]}
            onValueChange={([v]) => onUpdate({ rounds: v ?? 0 })}
            min={0}
            max={4}
            step={1}
            className="flex-1"
          />
          <span className="text-xs font-medium tabular-nums text-n8n-text w-4 text-right">
            {scenario.rounds}
          </span>
        </div>
      </td>

      {/* Dilution per round */}
      <td className="py-2.5 pr-4">
        <div className="flex items-center gap-3 min-w-[100px]">
          <Slider
            value={[scenario.dilutionPerRound * 100]}
            onValueChange={([v]) => onUpdate({ dilutionPerRound: (v ?? 5) / 100 })}
            min={5}
            max={20}
            step={1}
            className="flex-1"
          />
          <span className="text-xs font-medium tabular-nums text-n8n-text w-8 text-right">
            {formatPercent(scenario.dilutionPerRound)}
          </span>
        </div>
      </td>

      {/* Total dilution */}
      <td className="text-right py-2.5 pr-4 tabular-nums text-xs text-n8n-text-secondary">
        {totalDilution > 0 ? formatPercent(totalDilution) : '—'}
      </td>

      {/* Net value */}
      <td className="text-right py-2.5 pr-4 tabular-nums font-semibold text-n8n-text">
        {formatEur(netValue)}
      </td>

      {/* Multiple */}
      <td className={`text-right py-2.5 pr-4 tabular-nums font-semibold ${
        multiple >= 1 ? 'text-n8n-green' : 'text-n8n-text'
      }`}>
        {formatMultiple(multiple)}
      </td>

      {/* Remove */}
      <td className="py-2.5 print:hidden">
        {onRemove ? (
          <Button variant="ghost" size="icon" onClick={onRemove} className="h-6 w-6 text-n8n-text-secondary hover:text-n8n-red">
            <span className="text-sm">×</span>
          </Button>
        ) : (
          <span className="block h-6 w-6" />
        )}
      </td>
    </tr>
  )
}
