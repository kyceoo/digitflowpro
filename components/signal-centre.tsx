"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, TrendingDown, Target } from "lucide-react"

interface SignalCentreProps {
  signals?: any[]
  isActive?: boolean
}

export function SignalCentre({ signals = [], isActive = false }: SignalCentreProps) {
  // Mock data for demonstration when no signals
  const displaySignals = signals.length > 0 ? signals.slice(0, 3) : []

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-base md:text-lg text-white">Signal Centre</CardTitle>
          </div>
          <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <CardDescription className="text-xs md:text-sm text-slate-400">
          Live trading signals from all markets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4 md:p-6 pt-0 md:pt-0">
        {displaySignals.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No active signals</p>
            <p className="text-xs mt-1">Generate a signal to see recommendations</p>
          </div>
        ) : (
          displaySignals.map((signal: any, index: number) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold text-sm md:text-base truncate">{signal.marketName}</span>
                {signal.bestStrategy === "rise" && <TrendingUp className="h-4 w-4 text-green-500" />}
                {signal.bestStrategy === "fall" && <TrendingDown className="h-4 w-4 text-red-500" />}
                {(signal.bestStrategy === "even" || signal.bestStrategy === "odd") && (
                  <Activity className="h-4 w-4 text-blue-500" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  className={`text-xs ${
                    signal.bestStrategy === "rise"
                      ? "bg-green-500/20 text-green-400"
                      : signal.bestStrategy === "fall"
                        ? "bg-red-500/20 text-red-400"
                        : signal.bestStrategy === "even"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  {signal.bestStrategy.toUpperCase()}
                </Badge>
                <span className="text-sm font-bold text-white">{signal.confidence.toFixed(1)}%</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-slate-400">Most Digit</p>
                  <p className="text-purple-400 font-bold">{signal.mostAppearingDigit}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400">Matches</p>
                  <p className="text-green-400 font-bold">{signal.matches}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400">Differs</p>
                  <p className="text-red-400 font-bold">{signal.differs}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
