export const DEFAULT_SHARE_PRICE = 40.65
export const DEFAULT_STRIKE_PRICE = 10.16
export const CURRENT_VALUATION = 2_200_000_000
export const VESTING_MONTHS = 48
export const CLIFF_MONTHS = 12
export const DEFAULT_AWARD_VALUE = 80_000

export interface Scenario {
  id: string
  valuation: number
  label: string
  rounds: number
  dilutionPerRound: number
  isCurrent: boolean
}

let nextId = 1
export function generateId(): string {
  return `scenario-${nextId++}`
}

export const DEFAULT_SCENARIOS: Scenario[] = [
  { id: generateId(), valuation: 2_200_000_000, label: 'EUR 2,2B', rounds: 0, dilutionPerRound: 0.10, isCurrent: true },
  { id: generateId(), valuation: 5_000_000_000, label: 'EUR 5,0B', rounds: 1, dilutionPerRound: 0.10, isCurrent: false },
  { id: generateId(), valuation: 10_000_000_000, label: 'EUR 10,0B', rounds: 1, dilutionPerRound: 0.10, isCurrent: false },
  { id: generateId(), valuation: 20_000_000_000, label: 'EUR 20,0B', rounds: 2, dilutionPerRound: 0.10, isCurrent: false },
  { id: generateId(), valuation: 50_000_000_000, label: 'EUR 50,0B', rounds: 2, dilutionPerRound: 0.10, isCurrent: false },
]

export const CHART_COLORS = {
  navy: '#1E293B',
  blue: '#3B82F6',
  pink: '#EA4B71',
  purple: '#7C3AED',
  flame: '#EE4F27',
  amber: '#F59E0B',
  grey: '#D1D5DB',
} as const
