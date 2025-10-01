import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MatchRecord } from "@/hooks/use-tick-data"
import { CheckCircle2, XCircle, TrendingUp, TrendingDown } from "lucide-react"

interface MatchTrackerProps {
  matchHistory: MatchRecord[]
}

export function MatchTracker({ matchHistory }: MatchTrackerProps) {
  if (matchHistory.length === 0) {
    return (
      <Card className="p-6 bg-slate-900/50 border-slate-800">
        <div className="text-center py-12 text-slate-500">No prediction matches recorded yet</div>
      </Card>
    )
  }

  const totalMatches = matchHistory.length
  const successfulMatches = matchHistory.filter((m) => m.matched).length
  const accuracy = (successfulMatches / totalMatches) * 100

  const recentMatches = matchHistory.slice(-10).reverse()

  return (
    <div className="space-y-4">
      {/* Accuracy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-slate-900/50 border-slate-800">
          <div className="text-center space-y-2">
            <div className="text-sm text-slate-400">Accuracy Rate</div>
            <div className="text-4xl font-bold text-white">{accuracy.toFixed(1)}%</div>
            <div className="flex items-center justify-center gap-2">
              {accuracy >= 50 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm text-slate-400">
                {successfulMatches}/{totalMatches} correct
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/50 border-slate-800">
          <div className="text-center space-y-2">
            <div className="text-sm text-slate-400">Successful Predictions</div>
            <div className="text-4xl font-bold text-green-500">{successfulMatches}</div>
            <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/50 border-slate-800">
          <div className="text-center space-y-2">
            <div className="text-sm text-slate-400">Failed Predictions</div>
            <div className="text-4xl font-bold text-red-500">{totalMatches - successfulMatches}</div>
            <XCircle className="w-6 h-6 text-red-500 mx-auto" />
          </div>
        </Card>
      </div>

      {/* Recent Matches */}
      <Card className="p-6 bg-slate-900/50 border-slate-800">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Predictions</h3>
        <div className="space-y-2">
          {recentMatches.map((match, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                match.matched ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <div className="flex items-center gap-4">
                {match.matched ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Predicted:</span>
                    <span className="text-lg font-bold text-white">{match.predicted}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-sm text-slate-400">Actual:</span>
                    <span className="text-lg font-bold text-white">{match.actual}</span>
                  </div>
                  <div className="text-xs text-slate-500">{new Date(match.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={match.matched ? "border-green-500 text-green-400" : "border-red-500 text-red-400"}
              >
                {match.confidence.toFixed(1)}% confidence
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
