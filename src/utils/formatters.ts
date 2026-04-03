const locale = 'en-US'

const wholeFormatter = new Intl.NumberFormat(locale, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const decimalFormatter = new Intl.NumberFormat(locale, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const oneDecimalFormatter = new Intl.NumberFormat(locale, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatEur(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `EUR ${wholeFormatter.format(Math.round(value))}`
  }
  return `EUR ${decimalFormatter.format(value)}`
}

export function formatEurPerShare(value: number): string {
  return `EUR ${decimalFormatter.format(value)}`
}

export function formatEurCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) {
    return `EUR ${oneDecimalFormatter.format(value / 1_000_000_000)}B`
  }
  if (Math.abs(value) >= 1_000_000) {
    return `EUR ${oneDecimalFormatter.format(value / 1_000_000)}M`
  }
  if (Math.abs(value) >= 1_000) {
    return `EUR ${oneDecimalFormatter.format(value / 1_000)}K`
  }
  return formatEur(value)
}

export function formatNumber(value: number): string {
  return wholeFormatter.format(Math.round(value))
}

export function formatShareCount(value: number): string {
  return wholeFormatter.format(Math.round(value))
}

export function formatPercent(value: number): string {
  return `${wholeFormatter.format(Math.round(value * 100))}%`
}

export function formatMultiple(value: number): string {
  return `${oneDecimalFormatter.format(value)}x`
}

export function formatValuationInput(value: number): string {
  if (value >= 1_000_000_000) {
    const b = value / 1_000_000_000
    return `EUR ${oneDecimalFormatter.format(b)}B`
  }
  if (value >= 1_000_000) {
    const m = value / 1_000_000
    return `EUR ${oneDecimalFormatter.format(m)}M`
  }
  return `EUR ${wholeFormatter.format(value)}`
}
