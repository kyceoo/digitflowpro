"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface TickLineChartProps {
  tickHistory: number[]
}

export function TickLineChart({ tickHistory }: TickLineChartProps) {
  const chartData = tickHistory.slice(-50).map((digit, index) => ({
    tick: tickHistory.length - 50 + index + 1,
    digit,
    isEven: digit % 2 === 0,
  }))

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    const color = payload.isEven ? "#10b981" : "#f59e0b" // green for even, amber for odd

    return <circle cx={cx} cy={cy} r={4} fill={color} stroke={color} strokeWidth={1} />
  }

  const getLineColor = () => {
    if (chartData.length < 2) return "hsl(var(--chart-1))"

    const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2))
    const secondHalf = chartData.slice(Math.floor(chartData.length / 2))

    const firstAvg = firstHalf.reduce((sum, d) => sum + d.digit, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.digit, 0) / secondHalf.length

    // Green for rising trend, red for falling trend
    return secondAvg > firstAvg ? "#10b981" : "#ef4444"
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Digit Trend</CardTitle>
        <CardDescription className="text-slate-400">
          Last {chartData.length} digits over time
          <span className="ml-4 text-xs">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
            Even
            <span className="inline-block w-3 h-3 rounded-full bg-amber-500 ml-3 mr-1"></span>
            Odd
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            digit: {
              label: "Digit",
              color: getLineColor(),
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="tick"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
                label={{ value: "Tick Number", position: "insideBottom", offset: -5, fill: "#94a3b8" }}
              />
              <YAxis
                domain={[0, 9]}
                ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
                label={{ value: "Digit", angle: -90, position: "insideLeft", fill: "#94a3b8" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="digit"
                stroke={getLineColor()}
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
