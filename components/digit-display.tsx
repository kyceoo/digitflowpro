import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface DigitDisplayProps {
  digitCounts: number[]
  totalTicks: number
  latestTick: string
  lastDigit: string
}

export function DigitDisplay({ digitCounts, totalTicks, latestTick, lastDigit }: DigitDisplayProps) {
  const maxCount = Math.max(...digitCounts)
  const avgCount = totalTicks / 10

  return (
    <Card className="p-6 bg-slate-900/50 border-slate-800">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Digit Distribution</h2>
          <div className="flex gap-4 text-sm">
            <div className="text-slate-400">
              Latest: <span className="text-cyan-400 font-mono">{latestTick}</span>
            </div>
            <div className="text-slate-400">
              Last Digit: <span className="text-cyan-400 font-mono text-lg">{lastDigit}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {digitCounts.map((count, digit) => {
            const percentage = totalTicks > 0 ? (count / totalTicks) * 100 : 0
            const isHot = count > avgCount * 1.2
            const isCold = count < avgCount * 0.8 && totalTicks > 20
            const isMax = count === maxCount && count > 0

            return (
              <div
                key={digit}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  isMax
                    ? "bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/50"
                    : isHot
                      ? "bg-orange-500/10 border-orange-500/50"
                      : isCold
                        ? "bg-blue-500/10 border-blue-500/50"
                        : "bg-slate-800/50 border-slate-700"
                }`}
              >
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-white">{digit}</div>
                  <div className={`text-sm font-semibold ${isMax ? "text-cyan-400" : "text-slate-400"}`}>
                    {percentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500">{count}</div>
                </div>
                {isHot && <TrendingUp className="absolute top-1 right-1 w-3 h-3 text-orange-500" />}
                {isCold && <TrendingDown className="absolute top-1 right-1 w-3 h-3 text-blue-500" />}
              </div>
            )
          })}
        </div>

        <div className="flex gap-4 text-xs text-slate-400 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded border-2 border-cyan-500 bg-cyan-500/20" />
            <span>Most Frequent</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded border-2 border-orange-500/50 bg-orange-500/10" />
            <span>Hot (+20%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded border-2 border-blue-500/50 bg-blue-500/10" />
            <span>Cold (-20%)</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
