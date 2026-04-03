import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { VESTING_MONTHS, CLIFF_MONTHS } from '@/constants'
import { formatEur, formatShareCount } from '@/utils/formatters'

interface EquityInputProps {
  awardValue: number
  onAwardValueChange: (value: number) => void
  sharePrice: number
  onSharePriceChange: (value: number) => void
  strikePrice: number
  onStrikePriceChange: (value: number) => void
  shares: number
  actualAwardValue: number
  exerciseCost: number
}

export function EquityInput({
  awardValue,
  onAwardValueChange,
  sharePrice,
  onSharePriceChange,
  strikePrice,
  onStrikePriceChange,
  shares,
  actualAwardValue,
  exerciseCost,
}: EquityInputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Equity Award</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Editable inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="award-value" className="uppercase tracking-wide text-xs font-semibold">
              VESOP Award Value (EUR)
            </Label>
            <input
              id="award-value"
              type="text"
              inputMode="numeric"
              value={awardValue.toLocaleString('en-US')}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '')
                const num = parseInt(raw, 10)
                if (!isNaN(num)) onAwardValueChange(num)
                else if (raw === '') onAwardValueChange(0)
              }}
              className="mt-1.5 w-full rounded-md border border-n8n-border bg-n8n-surface px-4 py-3 text-xl font-semibold tabular-nums text-n8n-text focus:outline-none focus:ring-2 focus:ring-n8n-pink focus:border-transparent"
            />
          </div>

          <div>
            <Label htmlFor="share-price" className="uppercase tracking-wide text-xs font-semibold">
              Share Price at Grant (EUR)
            </Label>
            <input
              id="share-price"
              type="text"
              inputMode="decimal"
              value={sharePrice}
              onChange={(e) => {
                const num = parseFloat(e.target.value)
                if (!isNaN(num)) onSharePriceChange(num)
                else if (e.target.value === '') onSharePriceChange(0)
              }}
              className="mt-1.5 w-full rounded-md border border-n8n-border bg-n8n-surface px-4 py-3 text-xl font-semibold tabular-nums text-n8n-text focus:outline-none focus:ring-2 focus:ring-n8n-pink focus:border-transparent"
            />
            <p className="text-xs text-n8n-text-secondary mt-1">Series C price per share</p>
          </div>

          <div>
            <Label htmlFor="strike-price" className="uppercase tracking-wide text-xs font-semibold">
              Strike Price (EUR)
            </Label>
            <input
              id="strike-price"
              type="text"
              inputMode="decimal"
              value={strikePrice}
              onChange={(e) => {
                const num = parseFloat(e.target.value)
                if (!isNaN(num)) onStrikePriceChange(num)
                else if (e.target.value === '') onStrikePriceChange(0)
              }}
              className="mt-1.5 w-full rounded-md border border-n8n-border bg-n8n-surface px-4 py-3 text-xl font-semibold tabular-nums text-n8n-text focus:outline-none focus:ring-2 focus:ring-n8n-pink focus:border-transparent"
            />
            <p className="text-xs text-n8n-text-secondary mt-1">Your exercise price</p>
          </div>
        </div>

        {/* Derived info rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <InfoRow
            label="Number of virtual shares"
            value={formatShareCount(shares)}
          />
          <InfoRow
            label="Actual award value"
            value={formatEur(actualAwardValue)}
            accent
          />
          <InfoRow
            label="Exercise cost"
            value={formatEur(exerciseCost)}
            sub="Deducted from payout at exit"
          />
          <InfoRow
            label="Vesting"
            value={`${VESTING_MONTHS} months`}
            sub={`${CLIFF_MONTHS}-month cliff`}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function InfoRow({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div>
      <span className="text-n8n-text-secondary">{label}</span>
      <div className={`font-medium tabular-nums ${accent ? 'text-n8n-pink' : 'text-n8n-text'}`}>
        {value}
      </div>
      {sub && <span className="text-xs text-n8n-text-secondary">{sub}</span>}
    </div>
  )
}
