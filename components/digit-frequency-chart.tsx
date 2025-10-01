"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"

interface DigitFrequencyChartProps {
  digitCounts: number[]
  totalTicks: number
}

export function DigitFrequencyChart({ digitCounts, totalTicks }: DigitFrequencyChartProps) {
  // Prepare data for the chart
  const chartData = digitCounts.map((count, digit) => ({
    digit: digit.toString(),
    count,
    percentage: totalTicks > 0 ? ((count / totalTicks) * 100).toFixed(1) : "0.0",
  }))

  // Color scale based on frequency
  const getBarColor = (count: number) => {
    if (totalTicks === 0) return "hsl(var(--chart-1))"
    const percentage = (count / totalTicks) * 100
    if (percentage >= 12) return "hsl(142, 76%, 36%)" // Green - hot
    if (percentage >= 10) return "hsl(var(--chart-1))" // Blue - normal
    if (percentage >= 8) return "hsl(48, 96%, 53%)" // Yellow - warm
    return "hsl(0, 84%, 60%)" // Red - cold
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Digit Frequency Distribution</CardTitle>
        <CardDescription className="text-slate-400">
          Occurrence count for each digit (Total: {totalTicks} ticks)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            count: {
              label: "Count",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="digit"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
                label={{ value: "Digit", position: "insideBottom", offset: -5, fill: "#94a3b8" }}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
                label={{ value: "Count", angle: -90, position: "insideLeft", fill: "#94a3b8" }}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
                        <p className="text-white font-semibold">Digit: {payload[0].payload.digit}</p>
                        <p className="text-blue-400">Count: {payload[0].value}</p>
                        <p className="text-slate-300">Percentage: {payload[0].payload.percentage}%</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.count)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[hsl(142,76%,36%)]" />
            <span>Hot (≥12%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[hsl(var(--chart-1))]" />
            <span>Normal (10-12%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[hsl(48,96%,53%)]" />
            <span>Warm (8-10%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[hsl(0,84%,60%)]" />
            <span>Cold (&lt;8%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
