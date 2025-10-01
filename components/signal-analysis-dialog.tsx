"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Activity, Wifi, WifiOff } from "lucide-react"
import type { LiveMarketData } from "@/lib/signal-analysis"

export interface MarketSignal {
  market: string
  marketName: string
  bestStrategy: "rise" | "fall" | "even" | "odd"
  confidence: number
  reasoning: string
  digitCounts: number[]
  recentTrend: number[]
  matches: number
  differs: number
  tickCount: number
  mostAppearingDigit: number
  mostAppearingCount: number
}

interface SignalAnalysisDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAnalyze: (onProgress: (progress: number, markets: LiveMarketData[]) => void) => Promise<MarketSignal[]>
  autoStart?: boolean
}

export function SignalAnalysisDialog({ open, onOpenChange, onAnalyze, autoStart = false }: SignalAnalysisDialogProps) {
  const [signals, setSignals] = useState<MarketSignal[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [bestSignal, setBestSignal] = useState<MarketSignal | null>(null)
  const [progress, setProgress] = useState(0)
  const [liveMarkets, setLiveMarkets] = useState<LiveMarketData[]>([])

  useEffect(() => {
    if (open && autoStart && !isAnalyzing && signals.length === 0) {
      handleAnalyze()
    }
  }, [open, autoStart])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setProgress(0)
    setSignals([])
    setBestSignal(null)
    setLiveMarkets([])

    try {
      const results = await onAnalyze((prog, markets) => {
        setProgress(prog)
        setLiveMarkets(markets)
      })

      setSignals(results)

      // Find the signal with highest confidence
      const best = results.reduce((prev, current) => (prev.confidence > current.confidence ? prev : current))
      setBestSignal(best)
    } catch (error) {
      console.error("[v0] Signal analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getStrategyIcon = (strategy: string) => {
    if (strategy === "rise") return <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
    if (strategy === "fall") return <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
    return <Activity className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
  }

  const getStrategyColor = (strategy: string) => {
    if (strategy === "rise") return "bg-green-500/20 text-green-400 border-green-500/50"
    if (strategy === "fall") return "bg-red-500/20 text-red-400 border-red-500/50"
    if (strategy === "even") return "bg-blue-500/20 text-blue-400 border-blue-500/50"
    return "bg-purple-500/20 text-purple-400 border-purple-500/50"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800 p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl text-white">Multi-Market Signal Analysis</DialogTitle>
          <DialogDescription className="text-sm md:text-base text-slate-400">
            {isAnalyzing
              ? "Analyzing all markets for 60 seconds..."
              : "Real-time analysis across all volatility indices"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          {isAnalyzing && (
            <Card className="bg-slate-950 border-blue-500/50">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-white text-base md:text-lg">Analysis Progress</CardTitle>
                <CardDescription className="text-xs md:text-sm text-slate-400">
                  Collecting data from all markets... {Math.round(progress)}%
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6 pt-0 md:pt-0">
                <Progress value={progress} className="h-2 md:h-3" />
                <div className="text-xs md:text-sm text-slate-400 text-center">
                  Time remaining: {Math.max(0, Math.round(60 - (progress / 100) * 60))} seconds
                </div>
              </CardContent>
            </Card>
          )}

          {liveMarkets.length > 0 && (
            <Card className="bg-slate-950 border-slate-700">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-white text-base md:text-lg">Live Market Data - All Volatilities</CardTitle>
                <CardDescription className="text-xs md:text-sm text-slate-400">
                  Real-time prices and statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3">
                  {liveMarkets.map((market) => (
                    <div
                      key={market.marketId}
                      className="bg-slate-900/50 rounded-lg p-3 border border-slate-700 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold text-xs md:text-sm truncate">
                          {market.marketName}
                        </span>
                        {market.isConnected ? (
                          <Wifi className="h-3 w-3 md:h-4 md:w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <WifiOff className="h-3 w-3 md:h-4 md:w-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Price:</span>
                          <span className="text-white font-mono">{market.currentPrice}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Last Digit:</span>
                          <span className="text-blue-400 font-bold">{market.lastDigit}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Most Appearing:</span>
                          <span className="text-purple-400 font-bold">
                            {market.mostAppearingDigit} ({market.mostAppearingCount}x)
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Ticks:</span>
                          <span className="text-white">{market.tickCount}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-green-400">Matches:</span>
                          <span className="text-green-400 font-semibold">{market.matches}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-red-400">Differs:</span>
                          <span className="text-red-400 font-semibold">{market.differs}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {!signals.length && !isAnalyzing && (
            <div className="text-center py-8 md:py-12">
              <Button
                onClick={handleAnalyze}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm md:text-base"
              >
                Start 60-Second Analysis
              </Button>
            </div>
          )}

          {bestSignal && (
            <Card className="bg-gradient-to-br from-blue-950 to-purple-950 border-blue-500/50">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <Activity className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
                  Best Trading Signal - Highest Market Opportunity
                </CardTitle>
                <CardDescription className="text-xs md:text-sm text-slate-300">
                  Based on {bestSignal.tickCount} ticks analyzed over 60 seconds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6 pt-0 md:pt-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs md:text-sm text-slate-400">Market</p>
                    <p className="text-xl md:text-2xl font-bold text-white">{bestSignal.marketName}</p>
                  </div>
                  <Badge
                    className={`text-sm md:text-lg px-3 md:px-4 py-1 md:py-2 ${getStrategyColor(bestSignal.bestStrategy)}`}
                  >
                    {bestSignal.bestStrategy.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
                  <div className="bg-slate-900/50 rounded-lg p-3 md:p-4">
                    <p className="text-xs text-slate-400">Confidence</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-400">{bestSignal.confidence.toFixed(1)}%</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 md:p-4">
                    <p className="text-xs text-slate-400">Most Digit</p>
                    <p className="text-2xl md:text-3xl font-bold text-purple-400">{bestSignal.mostAppearingDigit}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 md:p-4">
                    <p className="text-xs text-slate-400">Matches</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-400">{bestSignal.matches}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 md:p-4">
                    <p className="text-xs text-slate-400">Differs</p>
                    <p className="text-2xl md:text-3xl font-bold text-red-400">{bestSignal.differs}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 flex items-center justify-center col-span-2 md:col-span-1">
                    {getStrategyIcon(bestSignal.bestStrategy)}
                    <span className="ml-2 text-lg md:text-xl font-semibold text-white">
                      {bestSignal.bestStrategy === "rise" && "Rise"}
                      {bestSignal.bestStrategy === "fall" && "Fall"}
                      {bestSignal.bestStrategy === "even" && "Even"}
                      {bestSignal.bestStrategy === "odd" && "Odd"}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-3 md:p-4">
                  <p className="text-xs md:text-sm text-slate-400 mb-2">Analysis</p>
                  <p className="text-sm md:text-base text-white">{bestSignal.reasoning}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {signals.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base md:text-lg font-semibold text-white">
                All Market Signals (Ranked by Confidence)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                {signals
                  .sort((a, b) => b.confidence - a.confidence)
                  .map((signal) => (
                    <Card
                      key={signal.market}
                      className={`bg-slate-900/50 border-slate-700 ${
                        signal.market === bestSignal?.market ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <CardHeader className="pb-3 p-3 md:p-6 md:pb-3">
                        <CardTitle className="text-white text-sm md:text-base flex items-center justify-between">
                          <span className="truncate">{signal.marketName}</span>
                          {getStrategyIcon(signal.bestStrategy)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 p-3 md:p-6 pt-0 md:pt-0">
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs md:text-sm ${getStrategyColor(signal.bestStrategy)}`}>
                            {signal.bestStrategy.toUpperCase()}
                          </Badge>
                          <span className="text-base md:text-lg font-bold text-white">
                            {signal.confidence.toFixed(1)}%
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-1 md:gap-2 text-xs">
                          <div className="bg-slate-800/50 rounded p-2 text-center">
                            <p className="text-slate-400">Ticks</p>
                            <p className="text-white font-semibold">{signal.tickCount}</p>
                          </div>
                          <div className="bg-purple-500/10 rounded p-2 text-center">
                            <p className="text-purple-400">Most</p>
                            <p className="text-purple-400 font-semibold">{signal.mostAppearingDigit}</p>
                          </div>
                          <div className="bg-green-500/10 rounded p-2 text-center">
                            <p className="text-green-400">Match</p>
                            <p className="text-green-400 font-semibold">{signal.matches}</p>
                          </div>
                          <div className="bg-red-500/10 rounded p-2 text-center">
                            <p className="text-red-400">Differ</p>
                            <p className="text-red-400 font-semibold">{signal.differs}</p>
                          </div>
                        </div>

                        <p className="text-xs md:text-sm text-slate-400 line-clamp-2">{signal.reasoning}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {signals.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800 bg-transparent text-sm md:text-base"
              >
                {isAnalyzing ? "Analyzing..." : "Refresh Analysis (60s)"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
