import type { Scenario } from '@/constants'
import { DEFAULT_AWARD_VALUE, DEFAULT_SHARE_PRICE, DEFAULT_STRIKE_PRICE, DEFAULT_SCENARIOS, generateId } from '@/constants'
import { formatValuationInput } from '@/utils/formatters'

interface AppState {
  awardValue: number
  sharePrice: number
  strikePrice: number
  scenarios: Scenario[]
}

interface CompactScenario {
  v: number
  r: number
  d: number
  c: boolean
}

export function encodeState(state: AppState): string {
  const params = new URLSearchParams()
  params.set('award', String(state.awardValue))
  params.set('sp', String(state.sharePrice))
  params.set('xp', String(state.strikePrice))

  const compact: CompactScenario[] = state.scenarios.map((s) => ({
    v: s.valuation,
    r: s.rounds,
    d: s.dilutionPerRound,
    c: s.isCurrent,
  }))
  params.set('scenarios', btoa(JSON.stringify(compact)))

  return params.toString()
}

export function decodeState(search: string): AppState {
  const params = new URLSearchParams(search)

  const awardValue = params.has('award') ? Number(params.get('award')) : DEFAULT_AWARD_VALUE
  const sharePrice = params.has('sp') ? Number(params.get('sp')) : DEFAULT_SHARE_PRICE
  const strikePrice = params.has('xp') ? Number(params.get('xp')) : DEFAULT_STRIKE_PRICE

  let scenarios: Scenario[] = DEFAULT_SCENARIOS

  const scenariosParam = params.get('scenarios')
  if (scenariosParam) {
    try {
      const compact: CompactScenario[] = JSON.parse(atob(scenariosParam))
      scenarios = compact.map((s) => ({
        id: generateId(),
        valuation: s.v,
        label: formatValuationInput(s.v),
        rounds: s.r,
        dilutionPerRound: s.d,
        isCurrent: s.c,
      }))
    } catch {
      // Invalid param — fall back to defaults
    }
  }

  return {
    awardValue: isNaN(awardValue) ? DEFAULT_AWARD_VALUE : awardValue,
    sharePrice: isNaN(sharePrice) ? DEFAULT_SHARE_PRICE : sharePrice,
    strikePrice: isNaN(strikePrice) ? DEFAULT_STRIKE_PRICE : strikePrice,
    scenarios,
  }
}

export function buildShareUrl(state: AppState): string {
  const base = window.location.origin + window.location.pathname
  return `${base}?${encodeState(state)}`
}
