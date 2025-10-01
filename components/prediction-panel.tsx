import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Prediction } from "@/hooks/use-tick-data"
import { Target, Zap, TrendingUp, GitBranch } from "lucide-react"

interface PredictionPanelProps {
  predictions: Prediction[]
  isAnalyzing: boolean
}

const strategyIcons: { [key: string]: any } = {
  "Most Frequent": Target,
  "Hot Digit": Zap,
  "Sequence Pattern": GitBranch,
  "Transition Analysis": TrendingUp,
}

export function PredictionPanel({ predictions, isAnalyzing }: PredictionPanelProps) {
  const topPrediction = predictions[0]

  return (
    <Card className="p-6 bg-slate-900/50 border-slate-800 h-full">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Predictions</h2>

        {topPrediction ? (
          <>
            <div className="p-6 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50">
              <div className="text-center space-y-2">
                <div className="text-sm text-cyan-400 font-semibold">TOP PREDICTION</div>
                <div className="text-6xl font-bold text-white">{topPrediction.digit}</div>
                <div className="text-2xl text-cyan-400">{topPrediction.confidence.toFixed(1)}%</div>
                <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                  {topPrediction.strategy}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-400">Alternative Strategies</div>
              {predictions.slice(1).map((pred, idx) => {
                const Icon = strategyIcons[pred.strategy] || Target
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="text-sm font-semibold text-white">Digit {pred.digit}</div>
                        <div className="text-xs text-slate-400">{pred.strategy}</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-300">{pred.confidence.toFixed(1)}%</div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-slate-500">
            {isAnalyzing ? "Collecting data..." : "Start analysis to see predictions"}
          </div>
        )}
      </div>
    </Card>
  )
}
