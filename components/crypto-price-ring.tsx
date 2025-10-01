"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CryptoPrice {
  symbol: string
  price: number
  change: number
  color: string
}

export function CryptoPriceRing() {
  const [prices, setPrices] = useState<CryptoPrice[]>([
    { symbol: "BTC", price: 0, change: 0, color: "#F7931A" },
    { symbol: "ETH", price: 0, change: 0, color: "#627EEA" },
    { symbol: "EUR", price: 0, change: 0, color: "#0052B4" },
    { symbol: "GBP", price: 0, change: 0, color: "#C8102E" },
    { symbol: "AUD", price: 0, change: 0, color: "#00008B" },
    { symbol: "JPY", price: 0, change: 0, color: "#BC002D" },
  ])

  useEffect(() => {
    // Simulate price updates
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((p) => ({
          ...p,
          price: p.price + (Math.random() - 0.5) * 100,
          change: (Math.random() - 0.5) * 5,
        })),
      )
    }, 2000)

    // Initial prices
    setPrices([
      { symbol: "BTC", price: 45230.5, change: 2.3, color: "#F7931A" },
      { symbol: "ETH", price: 2340.8, change: -1.2, color: "#627EEA" },
      { symbol: "EUR", price: 1.0856, change: 0.5, color: "#0052B4" },
      { symbol: "GBP", price: 1.2634, change: -0.3, color: "#C8102E" },
      { symbol: "AUD", price: 0.6523, change: 1.1, color: "#00008B" },
      { symbol: "JPY", price: 149.23, change: 0.8, color: "#BC002D" },
    ])

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-64 w-64">
      <div className="absolute inset-0 animate-spin-slow">
        {prices.map((crypto, index) => {
          const angle = (index * 360) / prices.length
          const radius = 100
          const x = Math.cos((angle * Math.PI) / 180) * radius
          const y = Math.sin((angle * Math.PI) / 180) * radius

          return (
            <div
              key={crypto.symbol}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <div className="animate-pulse rounded-lg border border-white/20 bg-slate-800/90 p-2 backdrop-blur-sm">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold" style={{ color: crypto.color }}>
                    {crypto.symbol}
                  </span>
                  {crypto.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  )}
                </div>
                <div className="text-xs text-white">${crypto.price.toFixed(2)}</div>
                <div className={`text-xs ${crypto.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {crypto.change >= 0 ? "+" : ""}
                  {crypto.change.toFixed(2)}%
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-full border-4 border-blue-500/30 bg-slate-900/50 p-6 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-xs text-blue-300">Live Markets</div>
            <div className="text-sm font-bold text-white">Real-Time</div>
          </div>
        </div>
      </div>
    </div>
  )
}
