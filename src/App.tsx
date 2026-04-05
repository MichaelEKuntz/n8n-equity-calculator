import { useState, useMemo, useCallback } from 'react'
import { Header } from '@/components/Header'
import { EquityInput } from '@/components/EquityInput'
import { ScenarioTable } from '@/components/ScenarioTable'
import { WaterfallChart } from '@/components/WaterfallChart'
import { VestingChart } from '@/components/VestingChart'
import { VestingSummary } from '@/components/VestingSummary'
import { Footer } from '@/components/Footer'
import type { Scenario } from '@/constants'
import { calculateShares, calculateActualAwardValue, calculateExerciseCost } from '@/utils/calculations'
import { decodeState, buildShareUrl } from '@/utils/url-state'

const initial = decodeState(window.location.search)

export default function App() {
  const [awardValue, setAwardValue] = useState(initial.awardValue)
  const [sharePrice, setSharePrice] = useState(initial.sharePrice)
  const [strikePrice, setStrikePrice] = useState(initial.strikePrice)
  const [scenarios, setScenarios] = useState<Scenario[]>(initial.scenarios)
  const [copied, setCopied] = useState(false)

  const shares = useMemo(() => calculateShares(awardValue, sharePrice, strikePrice), [awardValue, sharePrice, strikePrice])
  const actualAwardValue = useMemo(() => calculateActualAwardValue(shares, sharePrice, strikePrice), [shares, sharePrice, strikePrice])
  const exerciseCost = useMemo(() => calculateExerciseCost(shares, strikePrice), [shares, strikePrice])

  const handleShare = useCallback(() => {
    const url = buildShareUrl({ awardValue, sharePrice, strikePrice, scenarios })
    window.history.replaceState(null, '', url)
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [awardValue, sharePrice, strikePrice, scenarios])

  const handleExportPdf = useCallback(() => {
    window.print()
  }, [])

  return (
    <div className="min-h-screen bg-n8n-bg">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Header onShare={handleShare} onExportPdf={handleExportPdf} copied={copied} />

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
