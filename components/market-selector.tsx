"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Square, RotateCcw } from "lucide-react"

const MARKETS = [
  { value: "R_10", label: "Volatility 10 Index" },
  { value: "R_25", label: "Volatility 25 Index" },
  { value: "R_50", label: "Volatility 50 Index" },
  { value: "R_75", label: "Volatility 75 Index" },
  { value: "R_100", label: "Volatility 100 Index" },
  { value: "1HZ10V", label: "1Hz Volatility 10 Index" },
  { value: "1HZ25V", label: "1Hz Volatility 25 Index" },
  { value: "1HZ50V", label: "1Hz Volatility 50 Index" },
  { value: "1HZ75V", label: "1Hz Volatility 75 Index" },
  { value: "1HZ100V", label: "1Hz Volatility 100 Index" },
]

interface MarketSelectorProps {
  selectedMarket: string
  onMarketChange: (market: string) => void
  maxTicks: number
  onMaxTicksChange: (ticks: number) => void
  isAnalyzing: boolean
  onStart: () => void
  onStop: () => void
  onReset: () => void
}

export function MarketSelector({
  selectedMarket,
  onMarketChange,
  maxTicks,
  onMaxTicksChange,
  isAnalyzing,
  onStart,
  onStop,
  onReset,
}: MarketSelectorProps) {
  return (
    <Card className="p-6 bg-slate-900/50 border-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="market" className="text-slate-300">
            Select Market
          </Label>
          <Select value={selectedMarket} onValueChange={onMarketChange} disabled={isAnalyzing}>
            <SelectTrigger id="market" className="bg-slate-800 border-slate-700">
              <SelectValue placeholder="Choose a market" />
            </SelectTrigger>
            <SelectContent>
              {MARKETS.map((market) => (
                <SelectItem key={market.value} value={market.value}>
                  {market.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticks" className="text-slate-300">
            History Size
          </Label>
          <Input
            id="ticks"
            type="number"
            min="10"
            max="500"
            value={maxTicks}
            onChange={(e) => onMaxTicksChange(Number.parseInt(e.target.value) || 100)}
            disabled={isAnalyzing}
            className="bg-slate-800 border-slate-700"
          />
        </div>

        <div className="md:col-span-2 flex gap-2">
          <Button
            onClick={onStart}
            disabled={!selectedMarket || isAnalyzing}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Analysis
          </Button>
          <Button onClick={onStop} disabled={!isAnalyzing} className="flex-1 bg-red-600 hover:bg-red-700">
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
          <Button onClick={onReset} variant="outline" className="border-slate-700 bg-transparent">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
