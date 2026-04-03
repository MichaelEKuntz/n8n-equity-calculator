import { CURRENT_VALUATION, CLIFF_MONTHS, VESTING_MONTHS } from '../constants'
import type { Scenario } from '../constants'

export function calculateShares(awardValue: number, sharePrice: number, strikePrice: number): number {
  const intrinsicValue = sharePrice - strikePrice
  if (intrinsicValue <= 0) return 0
  return Math.floor(awardValue / intrinsicValue)
}

export function calculateActualAwardValue(shares: number, sharePrice: number, strikePrice: number): number {
  return shares * (sharePrice - strikePrice)
}

export function calculateExerciseCost(shares: number, strikePrice: number): number {
  return shares * strikePrice
}

export function calculateTotalDilution(rounds: number, dilutionPerRound: number): number {
  return 1 - Math.pow(1 - dilutionPerRound, rounds)
}

export interface ScenarioResult {
  scenario: Scenario
  dilutedShares: number
  targetSharePrice: number
  grossValue: number
  exerciseCost: number
  netValue: number
  multiple: number
  totalDilution: number
}

export function calculateScenario(
  scenario: Scenario,
  shares: number,
  actualAwardValue: number,
  sharePrice: number,
  strikePrice: number,
): ScenarioResult {
  const totalDilution = calculateTotalDilution(scenario.rounds, scenario.dilutionPerRound)
  const dilutedShares = shares * (1 - totalDilution)
  const targetSharePrice = sharePrice * (scenario.valuation / CURRENT_VALUATION)
  const grossValue = dilutedShares * targetSharePrice
  const exerciseCost = dilutedShares * strikePrice
  const netValue = grossValue - exerciseCost
  const multiple = actualAwardValue > 0 ? netValue / actualAwardValue : 0

  return {
    scenario,
    dilutedShares,
    targetSharePrice,
    grossValue,
    exerciseCost,
    netValue,
    multiple,
    totalDilution,
  }
}

export interface VestingDataPoint {
  month: number
  sharesVested: number
  percentVested: number
  eurValue: number
}

export function calculateVestingSchedule(totalShares: number, sharePrice: number, strikePrice: number): VestingDataPoint[] {
  const data: VestingDataPoint[] = []
  const valuePerShare = sharePrice - strikePrice
  const cliffShares = Math.floor(totalShares * 0.25)
  const remainingShares = totalShares - cliffShares
  const monthlyVest = remainingShares / (VESTING_MONTHS - CLIFF_MONTHS)

  for (let month = 0; month <= VESTING_MONTHS; month++) {
    let sharesVested: number
    if (month < CLIFF_MONTHS) {
      sharesVested = 0
    } else if (month === CLIFF_MONTHS) {
      sharesVested = cliffShares
    } else {
      sharesVested = cliffShares + Math.floor(monthlyVest * (month - CLIFF_MONTHS))
    }

    sharesVested = Math.min(sharesVested, totalShares)

    data.push({
      month,
      sharesVested,
      percentVested: totalShares > 0 ? (sharesVested / totalShares) * 100 : 0,
      eurValue: sharesVested * valuePerShare,
    })
  }

  return data
}
