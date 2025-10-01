import { Card } from "@/components/ui/card"
import { BarChart3, PieChart, Activity } from "lucide-react"

interface StatisticsPanelProps {
  statistics: any
  digitCounts: number[]
}

export function StatisticsPanel({ statistics, digitCounts }: StatisticsPanelProps) {
  if (!statistics) {
    return (
      <Card className="p-6 bg-slate-900/50 border-slate-800">
        <div className="text-center py-12 text-slate-500">No statistical data available yet</div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Summary Stats */}
      <Card className="p-6 bg-slate-900/50 border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Summary Statistics</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Ticks</span>
            <span className="text-white font-semibold">{statistics.totalTicks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Mean</span>
            <span className="text-white font-semibold">{statistics.mean.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Standard Deviation</span>
            <span className="text-white font-semibold">{statistics.stdDev.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Variance</span>
            <span className="text-white font-semibold">{statistics.variance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Unique Digits</span>
            <span className="text-white font-semibold">{statistics.uniqueDigits}/10</span>
          </div>
        </div>
      </Card>

      {/* Distribution Analysis */}
      <Card className="p-6 bg-slate-900/50 border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Distribution Analysis</h3>
        </div>
        <div className="space-y-2">
          {statistics.distribution
            .sort((a: any, b: any) => Math.abs(b.deviation) - Math.abs(a.deviation))
            .slice(0, 5)
            .map((dist: any) => (
              <div key={dist.digit} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Digit {dist.digit}</span>
                  <span
                    className={`font-semibold ${
                      dist.deviation > 0 ? "text-green-400" : dist.deviation < 0 ? "text-red-400" : "text-slate-400"
                    }`}
                  >
                    {dist.deviation > 0 ? "+" : ""}
                    {dist.deviation.toFixed(1)}
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      dist.deviation > 0
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : dist.deviation < 0
                          ? "bg-gradient-to-r from-red-500 to-orange-500"
                          : "bg-slate-600"
                    }`}
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Detailed Distribution */}
      <Card className="p-6 bg-slate-900/50 border-slate-800 md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Detailed Distribution</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {statistics.distribution.map((dist: any) => (
            <div key={dist.digit} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-center space-y-1">
                <div className="text-xl font-bold text-white">{dist.digit}</div>
                <div className="text-sm text-slate-400">{dist.count} times</div>
                <div className="text-xs text-slate-500">{dist.percentage.toFixed(1)}%</div>
                <div
                  className={`text-xs font-semibold ${
                    dist.deviation > 0 ? "text-green-400" : dist.deviation < 0 ? "text-red-400" : "text-slate-500"
                  }`}
                >
                  {dist.deviation > 0 ? "+" : ""}
                  {dist.deviation.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
