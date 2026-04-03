import { useState, useMemo } from 'react'
import { Header } from '@/components/Header'
import { EquityInput } from '@/components/EquityInput'
import { ScenarioTable } from '@/components/ScenarioTable'
import { WaterfallChart } from '@/components/WaterfallChart'
import { VestingChart } from '@/components/VestingChart'
import { VestingSummary } from '@/components/VestingSummary'
import { Footer } from '@/components/Footer'
import { DEFAULT_AWARD_VALUE, DEFAULT_SHARE_PRICE, DEFAULT_STRIKE_PRICE, DEFAULT_SCENARIOS } from '@/constants'
import type { Scenario } from '@/constants'
import { calculateShares, calculateActualAwardValue, calculateExerciseCost } from '@/utils/calculations'

export default function App() {
  const [awardValue, setAwardValue] = useState(DEFAULT_AWARD_VALUE)
  const [sharePrice, setSharePrice] = useState(DEFAULT_SHARE_PRICE)
  const [strikePrice, setStrikePrice] = useState(DEFAULT_STRIKE_PRICE)
  const [scenarios, setScenarios] = useState<Scenario[]>(DEFAULT_SCENARIOS)

  const shares = useMemo(() => calculateShares(awardValue, sharePrice, strikePrice), [awardValue, sharePrice, strikePrice])
  const actualAwardValue = useMemo(() => calculateActualAwardValue(shares, sharePrice, strikePrice), [shares, sharePrice, strikePrice])
  const exerciseCost = useMemo(() => calculateExerciseCost(shares, strikePrice), [shares, strikePrice])

  return (
    <div className="min-h-screen bg-n8n-bg">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Header />

        <div className="space-y-6">
          <EquityInput
            awardValue={awardValue}
            onAwardValueChange={setAwardValue}
            sharePrice={sharePrice}
            onSharePriceChange={setSharePrice}
            strikePrice={strikePrice}
            onStrikePriceChange={setStrikePrice}
            shares={shares}
            actualAwardValue={actualAwardValue}
            exerciseCost={exerciseCost}
          />

          <ScenarioTable
            scenarios={scenarios}
            onScenariosChange={setScenarios}
            shares={shares}
            actualAwardValue={actualAwardValue}
            sharePrice={sharePrice}
            strikePrice={strikePrice}
          />

          <WaterfallChart
            scenarios={scenarios}
            shares={shares}
            actualAwardValue={actualAwardValue}
            sharePrice={sharePrice}
            strikePrice={strikePrice}
          />

          <VestingChart shares={shares} sharePrice={sharePrice} strikePrice={strikePrice} />
          <VestingSummary shares={shares} sharePrice={sharePrice} strikePrice={strikePrice} />
        </div>

        <Footer />
      </div>
    </div>
  )
}
