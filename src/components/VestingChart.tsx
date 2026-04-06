import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CLIFF_MONTHS, VESTING_MONTHS } from '@/constants'
import { calculateVestingSchedule } from '@/utils/calculations'
import { formatEur, formatShareCount } from '@/utils/formatters'

interface VestingChartProps {
  shares: number
  sharePrice: number
  strikePrice: number
}

export function VestingChart({ shares, sharePrice, strikePrice }: VestingChartProps) {
  const data = useMemo(() => calculateVestingSchedule(shares, sharePrice, strikePrice), [shares, sharePrice, strikePrice])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vesting Schedule</CardTitle>
        <p className="text-sm text-n8n-text-secondary">
          Cumulative vested shares over {VESTING_MONTHS} months
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="vestingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#9490AD' }}
              axisLine={{ stroke: '#2E2B4A' }}
              tickLine={false}
              label={{ value: 'Month', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#9490AD' }}
            />
            <YAxis
              yAxisId="shares"
              tick={{ fontSize: 11, fill: '#9490AD' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => formatShareCount(v)}
              label={{ value: 'Shares', angle: -90, position: 'insideLeft', offset: -5, fontSize: 11, fill: '#9490AD' }}
            />
            <YAxis
              yAxisId="eur"
              orientation="right"
              tick={{ fontSize: 11, fill: '#9490AD' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `€${formatShareCount(v)}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload as (typeof data)[0] | undefined
                if (!d) return null
                return (
                  <div className="bg-n8n-surface-elevated border border-n8n-border rounded-card p-3 shadow-card text-xs">
                    <p className="font-semibold text-n8n-text">Month {d.month}</p>
                    <p className="text-n8n-text-secondary mt-1">
                      Shares vested: <span className="font-medium tabular-nums text-n8n-text">{formatShareCount(d.sharesVested)}</span>
                    </p>
                    <p className="text-n8n-text-secondary">
                      Cumulative: <span className="font-medium tabular-nums text-n8n-text">{d.percentVested.toFixed(1)}%</span>
                    </p>
                    <p className="text-n8n-text-secondary">
                      EUR value: <span className="font-medium tabular-nums text-n8n-text">{formatEur(d.eurValue)}</span>
                    </p>
                  </div>
                )
              }}
            />
            <ReferenceLine
              yAxisId="shares"
              x={CLIFF_MONTHS}
              stroke="#7C3AED"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: '1-year cliff',
                position: 'insideTopRight',
                fontSize: 10,
                fill: '#7C3AED',
                fontWeight: 600,
                offset: 10,
              }}
            />
            <ReferenceLine
              yAxisId="shares"
              x={VESTING_MONTHS}
              stroke="#9490AD"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{
                value: 'Fully vested',
                position: 'insideTopLeft',
                fontSize: 10,
                fill: '#9490AD',
                fontWeight: 600,
                offset: 10,
              }}
            />
            <Area
              yAxisId="shares"
              type="stepAfter"
              dataKey="sharesVested"
              stroke="#94A3B8"
              strokeWidth={2}
              fill="url(#vestingGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
