import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Snowflake, Repeat, ArrowRight } from "lucide-react"

interface PatternAnalysisProps {
  patterns: any
  tickHistory: number[]
}

export function PatternAnalysis({ patterns, tickHistory }: PatternAnalysisProps) {
  if (!patterns) {
    return (
      <Card className="p-6 bg-slate-900/50 border-slate-800">
        <div className="text-center py-12 text-slate-500">No pattern data available yet</div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Hot Digits */}
      <Card className="p-6 bg-slate-900/50 border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-white">Hot Digits</h3>
        </div>
        <div className="space-y-2">
          {patterns.hotDigits.map((hot: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-white">{hot.digit}</div>
                <div className="text-sm text-slate-400">Last 20 ticks</div>
              </div>
              <div className="text-lg font-semibold text-orange-400">{hot.percentage.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Cold Digits */}
      <Card className="p-6 bg-slate-900/50 border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Snowflake className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Cold Digits</h3>
        </div>
        <div className="space-y-2">
          {patterns.coldDigits.map((cold: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-white">{cold.digit}</div>
                <div className="text-sm text-slate-400">Last 20 ticks</div>
              </div>
              <div className="text-lg font-semibold text-blue-400">{cold.percentage.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Streaks */}
      <Card className="p-6 bg-slate-900/50 border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Repeat className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Recent Streaks</h3>
        </div>
        <div className="space-y-2">
          {patterns.streaks.length > 0 ? (
            patterns.streaks.map((streak: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30"
              >
                <div className="text-2xl font-bold text-white">{streak.digit}</div>
                <div className="text-sm text-slate-400">appeared</div>
                <Badge variant="outline" className="border-purple-500 text-purple-400">
                  {streak.count}x in a row
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-500">No streaks detected</div>
          )}
        </div>
      </Card>

      {/* Sequences */}
      <Card className="p-6 bg-slate-900/50 border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <ArrowRight className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Repeating Sequences</h3>
        </div>
        <div className="space-y-2">
          {patterns.sequences.length > 0 ? (
            patterns.sequences.map((seq: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30"
              >
                <div className="flex items-center gap-2">
                  {seq.pattern.map((digit: number, i: number) => (
                    <span key={i} className="text-lg font-bold text-white">
                      {digit}
                      {i < seq.pattern.length - 1 && " → "}
                    </span>
                  ))}
                </div>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {seq.occurrences}x
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-500">No sequences detected</div>
          )}
        </div>
      </Card>

      {/* Even/Odd Pattern */}
      <Card className="p-6 bg-slate-900/50 border-slate-800">
        <h3 className="text-lg font-semibold text-white mb-4">Even/Odd Distribution</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Even</span>
              <span className="text-white font-semibold">{patterns.evenOddPattern.evenPercentage.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                style={{ width: `${patterns.evenOddPattern.evenPercentage}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Odd</span>
              <span className="text-white font-semibold">{patterns.evenOddPattern.oddPercentage.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${patterns.evenOddPattern.oddPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* High/Low Pattern */}
      <Card className="p-6 bg-slate-900/50 border-slate-800">
        <h3 className="text-lg font-semibold text-white mb-4">High/Low Distribution</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">High (5-9)</span>
              <span className="text-white font-semibold">{patterns.highLowPattern.highPercentage.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                style={{ width: `${patterns.highLowPattern.highPercentage}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Low (0-4)</span>
              <span className="text-white font-semibold">{patterns.highLowPattern.lowPercentage.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                style={{ width: `${patterns.highLowPattern.lowPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
