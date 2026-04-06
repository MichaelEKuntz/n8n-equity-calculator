import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Scenario } from '@/constants'
import { CHART_COLORS } from '@/constants'
import { calculateScenario } from '@/utils/calculations'
import { formatEur, formatEurCompact } from '@/utils/formatters'

interface WaterfallChartProps {
  scenarios: Scenario[]
  shares: number
  actualAwardValue: number
  sharePrice: number
  strikePrice: number
}

export function WaterfallChart({ scenarios, shares, actualAwardValue, sharePrice, strikePrice }: WaterfallChartProps) {
  const data = useMemo(() => {
    return scenarios.map((s) => {
      const r = calculateScenario(s, shares, actualAwardValue, sharePrice, strikePrice)
      return {
        name: s.label,
        exerciseCost: Math.round(r.exerciseCost),
        netValue: Math.round(Math.max(0, r.netValue)),
        total: Math.round(r.grossValue),
        isCurrent: s.isCurrent,
      }
    })
  }, [scenarios, shares, actualAwardValue, sharePrice, strikePrice])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Value Composition by Scenario</CardTitle>
        <p className="text-sm text-n8n-text-secondary">
          Exercise cost vs. net equity value at each exit valuation
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(280, scenarios.length * 56)}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 120, left: 20, bottom: 0 }}>
            <XAxis
              type="number"
              tickFormatter={(v: number) => formatEurCompact(v)}
              tick={{ fontSize: 11, fill: '#9490AD' }}
              axisLine={{ stroke: '#2E2B4A' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              tick={{ fontSize: 12, fill: '#F1F0F5' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatEur(value),
                name === 'exerciseCost' ? 'Exercise Cost' : 'Net Equity Value',
              ]}
              contentStyle={{
                backgroundColor: '#252540',
                border: '1px solid #2E2B4A',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#F1F0F5',
              }}
            />
            <Bar dataKey="exerciseCost" stackId="a" fill={CHART_COLORS.grey} radius={[0, 0, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.isCurrent ? '#3A3352' : CHART_COLORS.grey} />
              ))}
            </Bar>
            <Bar dataKey="netValue" stackId="a" fill={CHART_COLORS.slate} radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.isCurrent ? CHART_COLORS.pink : CHART_COLORS.slate}
                />
              ))}
              <LabelList
                dataKey="netValue"
                position="right"
                formatter={(v: number) => formatEurCompact(v)}
                style={{ fontSize: 11, fontWeight: 600, fill: '#F1F0F5' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
