import { useMemo } from 'react'
import { formatEur, formatNumber } from '@/utils/formatters'

interface VestingSummaryProps {
  shares: number
  sharePrice: number
  strikePrice: number
}

export function VestingSummary({ shares, sharePrice, strikePrice }: VestingSummaryProps) {
  const valuePerShare = sharePrice - strikePrice

  const milestones = useMemo(() => {
    const cliffShares = Math.floor(shares * 0.25)
    const remainingShares = shares - cliffShares
    const monthlyVest = remainingShares / 36

    return [
      { label: 'After 1 year', pct: 25, shares: cliffShares },
      { label: 'After 2 years', pct: 50, shares: cliffShares + Math.floor(monthlyVest * 12) },
      { label: 'After 3 years', pct: 75, shares: cliffShares + Math.floor(monthlyVest * 24) },
      { label: 'Fully vested (4 years)', pct: 100, shares },
    ]
  }, [shares])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {milestones.map((m) => (
        <div
          key={m.label}
          className="rounded-card border border-n8n-border bg-n8n-surface p-4 text-center"
        >
          <p className="text-xs text-n8n-text-secondary mb-1">{m.label}</p>
          <p className="text-lg font-bold text-n8n-text">{m.pct}%</p>
          <p className="text-xs text-n8n-text-secondary">
            {formatNumber(m.shares)} shares
          </p>
          <p className="text-xs font-medium text-n8n-pink">
            {formatEur(m.shares * valuePerShare)}
          </p>
        </div>
      ))}
    </div>
  )
}
