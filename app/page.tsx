"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MarketSelector } from "@/components/market-selector"
import { DigitDisplay } from "@/components/digit-display"
import { PredictionPanel } from "@/components/prediction-panel"
import { PatternAnalysis } from "@/components/pattern-analysis"
import { MatchTracker } from "@/components/match-tracker"
import { StatisticsPanel } from "@/components/statistics-panel"
import { SignalCentre } from "@/components/signal-centre"
import { TickLineChart } from "@/components/tick-line-chart"
import { DigitFrequencyChart } from "@/components/digit-frequency-chart"
import { SignalAnalysisDialog } from "@/components/signal-analysis-dialog"
import { analyzeAllMarketsWithProgress } from "@/lib/signal-analysis"
import { useTickData } from "@/hooks/use-tick-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Activity, Key, LogOut, Shield } from "lucide-react"
import type { MarketSignal } from "@/components/signal-analysis-dialog"

export default function Home() {
  const router = useRouter()
  const [selectedMarket, setSelectedMarket] = useState("")
  const [maxTicks, setMaxTicks] = useState(100)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [signalDialogOpen, setSignalDialogOpen] = useState(true)
  const [latestSignals, setLatestSignals] = useState<MarketSignal[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem("dfp_session")
    if (!session) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const {
    tickHistory,
    latestTick,
    lastDigit,
    digitCounts,
    predictions,
    matchHistory,
    patterns,
    statistics,
    startAnalysis,
    stopAnalysis,
    resetAnalysis,
  } = useTickData(selectedMarket, maxTicks)

  const handleStart = () => {
    setIsAnalyzing(true)
    startAnalysis()
  }

  const handleStop = () => {
    setIsAnalyzing(false)
    stopAnalysis()
  }

  const handleReset = () => {
    setIsAnalyzing(false)
    resetAnalysis()
  }

  const handleAnalyzeComplete = async (onProgress: any) => {
    const results = await analyzeAllMarketsWithProgress(onProgress)
    setLatestSignals(results)
    return results
  }

  const handleLogout = () => {
    localStorage.removeItem("dfp_session")
    document.cookie = "dfp_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/login")
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto" />
          <p className="text-slate-300">Verifying access...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-2 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <Key className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Digit Flow Pro</h1>
              <p className="text-xs sm:text-sm text-blue-300">The Original Market Analysis System</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/admin")}
              variant="outline"
              size="sm"
              className="border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
            >
              <Shield className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            Advanced Digit Analysis System
          </h2>
          <p className="text-slate-400 text-sm sm:text-base md:text-lg">
            Real-time pattern recognition and prediction analytics
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setSignalDialogOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm md:text-base"
          >
            <Activity className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Generate Trading Signal
          </Button>
        </div>

        <MarketSelector
          selectedMarket={selectedMarket}
          onMarketChange={setSelectedMarket}
          maxTicks={maxTicks}
          onMaxTicksChange={setMaxTicks}
          isAnalyzing={isAnalyzing}
          onStart={handleStart}
          onStop={handleStop}
          onReset={handleReset}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          <div className="lg:col-span-2">
            <DigitDisplay
              digitCounts={digitCounts}
              totalTicks={tickHistory.length}
              latestTick={latestTick}
              lastDigit={lastDigit}
            />
          </div>
          <div>
            <PredictionPanel predictions={predictions} isAnalyzing={isAnalyzing} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          <TickLineChart tickHistory={tickHistory} />
          <DigitFrequencyChart digitCounts={digitCounts} totalTicks={tickHistory.length} />
        </div>

        <Tabs defaultValue="patterns" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-slate-900/50 gap-1">
            <TabsTrigger value="patterns" className="text-xs sm:text-sm">
              Pattern Analysis
            </TabsTrigger>
            <TabsTrigger value="matches" className="text-xs sm:text-sm">
              Match Tracker
            </TabsTrigger>
            <TabsTrigger value="statistics" className="text-xs sm:text-sm">
              Statistics
            </TabsTrigger>
            <TabsTrigger value="signals" className="text-xs sm:text-sm">
              Signal Centre
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patterns" className="mt-4">
            <PatternAnalysis patterns={patterns} tickHistory={tickHistory} />
          </TabsContent>

          <TabsContent value="matches" className="mt-4">
            <MatchTracker matchHistory={matchHistory} />
          </TabsContent>

          <TabsContent value="statistics" className="mt-4">
            <StatisticsPanel statistics={statistics} digitCounts={digitCounts} />
          </TabsContent>

          <TabsContent value="signals" className="mt-4">
            <SignalCentre signals={latestSignals} isActive={latestSignals.length > 0} />
          </TabsContent>
        </Tabs>

        <SignalAnalysisDialog
          open={signalDialogOpen}
          onOpenChange={setSignalDialogOpen}
          onAnalyze={handleAnalyzeComplete}
          autoStart={true}
        />
      </div>
    </main>
  )
}
