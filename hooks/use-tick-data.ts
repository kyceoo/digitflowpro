"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { analyzePatterns, calculateStatistics, generatePredictions } from "@/lib/analysis"

export interface Prediction {
  digit: number
  confidence: number
  strategy: string
  timestamp: number
}

export interface MatchRecord {
  predicted: number
  actual: number
  matched: boolean
  confidence: number
  timestamp: number
}

export function useTickData(market: string, maxTicks: number) {
  const [tickHistory, setTickHistory] = useState<number[]>([])
  const [latestTick, setLatestTick] = useState<string>("--")
  const [lastDigit, setLastDigit] = useState<string>("--")
  const [digitCounts, setDigitCounts] = useState<number[]>(Array(10).fill(0))
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [matchHistory, setMatchHistory] = useState<MatchRecord[]>([])
  const [patterns, setPatterns] = useState<any>(null)
  const [statistics, setStatistics] = useState<any>(null)
  const [isRunning, setIsRunning] = useState(false)

  const socketRef = useRef<WebSocket | null>(null)
  const predictionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentPredictionRef = useRef<Prediction | null>(null)

  const updateAnalysis = useCallback((history: number[]) => {
    // Update digit counts
    const counts = Array(10).fill(0)
    history.forEach((digit) => counts[digit]++)
    setDigitCounts(counts)

    // Analyze patterns
    const patternAnalysis = analyzePatterns(history)
    setPatterns(patternAnalysis)

    // Calculate statistics
    const stats = calculateStatistics(history, counts)
    setStatistics(stats)
  }, [])

  const checkPrediction = useCallback((actualDigit: number) => {
    if (currentPredictionRef.current) {
      const matched = currentPredictionRef.current.digit === actualDigit
      const record: MatchRecord = {
        predicted: currentPredictionRef.current.digit,
        actual: actualDigit,
        matched,
        confidence: currentPredictionRef.current.confidence,
        timestamp: Date.now(),
      }
      setMatchHistory((prev) => [...prev.slice(-49), record])
    }
  }, [])

  const makePrediction = useCallback(() => {
    if (tickHistory.length < 10) return

    const newPredictions = generatePredictions(tickHistory, digitCounts, patterns)
    setPredictions(newPredictions)
    currentPredictionRef.current = newPredictions[0] || null
  }, [tickHistory, digitCounts, patterns])

  useEffect(() => {
    if (!market || !isRunning) return

    socketRef.current = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=69948")

    socketRef.current.onopen = () => {
      socketRef.current?.send(JSON.stringify({ ticks: market }))
    }

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.tick) {
        const tickQuote = data.tick.quote.toString()
        const digit = Number.parseInt(tickQuote.slice(-1))

        setLatestTick(tickQuote)
        setLastDigit(digit.toString())

        // Check if prediction was correct
        checkPrediction(digit)

        setTickHistory((prev) => {
          const newHistory = [...prev, digit]
          if (newHistory.length > maxTicks) {
            newHistory.shift()
          }
          updateAnalysis(newHistory)
          return newHistory
        })
      }
    }

    // Make predictions every 30 seconds
    predictionIntervalRef.current = setInterval(makePrediction, 30000)
    makePrediction() // Initial prediction

    return () => {
      socketRef.current?.close()
      if (predictionIntervalRef.current) {
        clearInterval(predictionIntervalRef.current)
      }
    }
  }, [market, maxTicks, isRunning, updateAnalysis, makePrediction, checkPrediction])

  const startAnalysis = useCallback(() => {
    setIsRunning(true)
  }, [])

  const stopAnalysis = useCallback(() => {
    setIsRunning(false)
    socketRef.current?.close()
    if (predictionIntervalRef.current) {
      clearInterval(predictionIntervalRef.current)
    }
  }, [])

  const resetAnalysis = useCallback(() => {
    setTickHistory([])
    setLatestTick("--")
    setLastDigit("--")
    setDigitCounts(Array(10).fill(0))
    setPredictions([])
    setMatchHistory([])
    setPatterns(null)
    setStatistics(null)
    currentPredictionRef.current = null
  }, [])

  return {
    tickHistory,
    latestTick,
    lastDigit,
    digitCounts,
    predictions,
    matchHistory,
    patterns,
    statistics,
    startAnalysis,
    stopAnalysis,
    resetAnalysis,
  }
}
