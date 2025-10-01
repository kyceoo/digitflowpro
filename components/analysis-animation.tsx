"use client"

import { useEffect, useState } from "react"
import { Activity, TrendingUp, Zap, Target } from "lucide-react"

export function AnalysisAnimation() {
  const [activeIndex, setActiveIndex] = useState(0)

  const features = [
    { icon: Activity, text: "Real-time Analysis", color: "text-blue-400" },
    { icon: TrendingUp, text: "Pattern Recognition", color: "text-green-400" },
    { icon: Zap, text: "Instant Signals", color: "text-yellow-400" },
    { icon: Target, text: "High Accuracy", color: "text-purple-400" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [features.length])

  return (
    <div className="flex gap-4">
      {features.map((feature, index) => {
        const Icon = feature.icon
        const isActive = index === activeIndex
        return (
          <div
            key={index}
            className={`flex flex-col items-center gap-2 transition-all duration-500 ${
              isActive ? "scale-110" : "scale-90 opacity-50"
            }`}
          >
            <div
              className={`rounded-full p-3 ${isActive ? "animate-pulse bg-slate-700" : "bg-slate-800"} ${
                feature.color
              }`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <span className={`text-xs ${isActive ? "font-bold text-white" : "text-slate-400"}`}>{feature.text}</span>
          </div>
        )
      })}
    </div>
  )
}
