import type { MarketSignal } from "@/components/signal-analysis-dialog"

const MARKETS = [
  { id: "R_10", name: "Volatility 10 Index" },
  { id: "R_25", name: "Volatility 25 Index" },
  { id: "R_50", name: "Volatility 50 Index" },
  { id: "R_75", name: "Volatility 75 Index" },
  { id: "R_100", name: "Volatility 100 Index" },
  { id: "1HZ10V", name: "Volatility 10 (1s) Index" },
  { id: "1HZ25V", name: "Volatility 25 (1s) Index" },
  { id: "1HZ50V", name: "Volatility 50 (1s) Index" },
  { id: "1HZ75V", name: "Volatility 75 (1s) Index" },
  { id: "1HZ100V", name: "Volatility 100 (1s) Index" },
]

export interface LiveMarketData {
  marketId: string
  marketName: string
  currentPrice: string
  lastDigit: number
  digitCounts: number[]
  tickCount: number
  matches: number
  differs: number
  isConnected: boolean
  mostAppearingDigit: number
  mostAppearingCount: number
}

export async function analyzeAllMarketsWithProgress(
  onProgress: (progress: number, markets: LiveMarketData[]) => void,
): Promise<MarketSignal[]> {
  const signals: MarketSignal[] = []
  const liveData: LiveMarketData[] = []
  const analysisTime = 60000 // 1 minute in milliseconds
  const startTime = Date.now()

  // Create WebSocket connections for all markets
  const marketConnections = MARKETS.map((market) => {
    const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=69948")
    const digitCounts: number[] = Array(10).fill(0)
    const recentTrend: number[] = []
    let currentPrice = "0.00"
    let lastDigit = 0
    let tickCount = 0
    let matches = 0
    let differs = 0
    let mostAppearingDigit = 0
    let mostAppearingCount = 0

    const marketData: LiveMarketData = {
      marketId: market.id,
      marketName: market.name,
      currentPrice,
      lastDigit,
      digitCounts: [...digitCounts],
      tickCount,
      matches,
      differs,
      isConnected: false,
      mostAppearingDigit,
      mostAppearingCount,
    }

    liveData.push(marketData)

    ws.onopen = () => {
      ws.send(JSON.stringify({ ticks: market.id }))
      marketData.isConnected = true
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.tick) {
        const tickQuote = data.tick.quote.toString()
        const digit = Number.parseInt(tickQuote.slice(-1))

        currentPrice = tickQuote
        lastDigit = digit
        digitCounts[digit]++
        recentTrend.push(digit)
        tickCount++

        const maxCount = Math.max(...digitCounts)
        mostAppearingDigit = digitCounts.indexOf(maxCount)
        mostAppearingCount = maxCount

        if (digit === mostAppearingDigit) {
          matches++
        } else {
          differs++
        }

        // Update live data
        marketData.currentPrice = currentPrice
        marketData.lastDigit = lastDigit
        marketData.digitCounts = [...digitCounts]
        marketData.tickCount = tickCount
        marketData.matches = matches
        marketData.differs = differs
        marketData.mostAppearingDigit = mostAppearingDigit
        marketData.mostAppearingCount = mostAppearingCount
      }
    }

    ws.onerror = () => {
      marketData.isConnected = false
    }

    return {
      ws,
      market,
      getData: () => ({
        digitCounts: [...digitCounts],
        recentTrend: [...recentTrend],
        matches,
        differs,
        tickCount,
        mostAppearingDigit,
        mostAppearingCount,
      }),
    }
  })

  // Update progress every 500ms
  const progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const progress = Math.min((elapsed / analysisTime) * 100, 100)
    onProgress(progress, [...liveData])
  }, 500)

  // Wait for 1 minute
  await new Promise((resolve) => setTimeout(resolve, analysisTime))

  // Clear progress updates
  clearInterval(progressInterval)

  // Close all connections and analyze
  for (const connection of marketConnections) {
    connection.ws.close()
    const data = connection.getData()
    const signal = determineStrategy(
      connection.market.id,
      connection.market.name,
      data.digitCounts,
      data.recentTrend,
      data.matches,
      data.differs,
      data.tickCount,
      data.mostAppearingDigit,
      data.mostAppearingCount,
    )
    signals.push(signal)
  }

  // Final progress update
  onProgress(100, [...liveData])

  return signals
}

function determineStrategy(
  marketId: string,
  marketName: string,
  digitCounts: number[],
  recentTrend: number[],
  matches: number,
  differs: number,
  tickCount: number,
  mostAppearingDigit: number,
  mostAppearingCount: number,
): MarketSignal {
  // Calculate even/odd distribution
  const evenCount = digitCounts.filter((_, idx) => idx % 2 === 0).reduce((sum, count) => sum + count, 0)
  const oddCount = digitCounts.filter((_, idx) => idx % 2 === 1).reduce((sum, count) => sum + count, 0)
  const totalCount = evenCount + oddCount

  const evenPercentage = totalCount > 0 ? (evenCount / totalCount) * 100 : 50
  const oddPercentage = totalCount > 0 ? (oddCount / totalCount) * 100 : 50

  // Calculate rise/fall trend
  const halfPoint = Math.floor(recentTrend.length / 2)
  const firstHalf = recentTrend.slice(0, halfPoint)
  const secondHalf = recentTrend.slice(halfPoint)

  const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length : 5
  const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length : 5

  const trendDiff = secondAvg - firstAvg
  const trendPercentage = 50 + Math.abs(trendDiff) * 10

  // Calculate match accuracy based on most appearing digit
  const matchRate = matches + differs > 0 ? (matches / (matches + differs)) * 100 : 0

  const strategies = [
    {
      type: "even" as const,
      confidence: evenPercentage * (1 + matchRate / 200),
      reasoning: `Even digits: ${evenPercentage.toFixed(1)}% | Most appearing: ${mostAppearingDigit} (${mostAppearingCount}x) | Matches: ${matches} | Differs: ${differs} | Accuracy: ${matchRate.toFixed(1)}%`,
    },
    {
      type: "odd" as const,
      confidence: oddPercentage * (1 + matchRate / 200),
      reasoning: `Odd digits: ${oddPercentage.toFixed(1)}% | Most appearing: ${mostAppearingDigit} (${mostAppearingCount}x) | Matches: ${matches} | Differs: ${differs} | Accuracy: ${matchRate.toFixed(1)}%`,
    },
    {
      type: trendDiff > 0 ? ("rise" as const) : ("fall" as const),
      confidence: trendPercentage * (1 + matchRate / 200),
      reasoning:
        trendDiff > 0
          ? `Rising trend: ${firstAvg.toFixed(2)} → ${secondAvg.toFixed(2)} | Most appearing: ${mostAppearingDigit} | Matches: ${matches} | Differs: ${differs}`
          : `Falling trend: ${firstAvg.toFixed(2)} → ${secondAvg.toFixed(2)} | Most appearing: ${mostAppearingDigit} | Matches: ${matches} | Differs: ${differs}`,
    },
  ]

  const bestStrategyData = strategies.reduce((prev, current) => (prev.confidence > current.confidence ? prev : current))

  return {
    market: marketId,
    marketName,
    bestStrategy: bestStrategyData.type,
    confidence: Math.min(bestStrategyData.confidence, 95),
    reasoning: bestStrategyData.reasoning,
    digitCounts,
    recentTrend,
    matches,
    differs,
    tickCount,
    mostAppearingDigit,
    mostAppearingCount,
  }
}
