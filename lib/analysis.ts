import type { Prediction } from "@/hooks/use-tick-data"

export function analyzePatterns(history: number[]) {
  if (history.length < 5) return null

  return {
    streaks: findStreaks(history),
    sequences: findSequences(history),
    hotDigits: findHotDigits(history),
    coldDigits: findColdDigits(history),
    transitions: analyzeTransitions(history),
    evenOddPattern: analyzeEvenOdd(history),
    highLowPattern: analyzeHighLow(history),
  }
}

function findStreaks(history: number[]) {
  const streaks: { digit: number; count: number; endIndex: number }[] = []
  let currentStreak = { digit: history[0], count: 1, endIndex: 0 }

  for (let i = 1; i < history.length; i++) {
    if (history[i] === currentStreak.digit) {
      currentStreak.count++
      currentStreak.endIndex = i
    } else {
      if (currentStreak.count >= 3) {
        streaks.push({ ...currentStreak })
      }
      currentStreak = { digit: history[i], count: 1, endIndex: i }
    }
  }

  if (currentStreak.count >= 3) {
    streaks.push(currentStreak)
  }

  return streaks.slice(-5)
}

function findSequences(history: number[]) {
  const sequences: { pattern: number[]; occurrences: number }[] = []
  const patternLength = 3

  for (let i = 0; i <= history.length - patternLength; i++) {
    const pattern = history.slice(i, i + patternLength)
    const existing = sequences.find(
      (s) => s.pattern.length === pattern.length && s.pattern.every((val, idx) => val === pattern[idx]),
    )

    if (existing) {
      existing.occurrences++
    } else {
      sequences.push({ pattern, occurrences: 1 })
    }
  }

  return sequences
    .filter((s) => s.occurrences >= 2)
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 5)
}

function findHotDigits(history: number[]) {
  const recent = history.slice(-20)
  const counts = Array(10).fill(0)
  recent.forEach((d) => counts[d]++)

  return counts
    .map((count, digit) => ({ digit, count, percentage: (count / recent.length) * 100 }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
}

function findColdDigits(history: number[]) {
  const recent = history.slice(-20)
  const counts = Array(10).fill(0)
  recent.forEach((d) => counts[d]++)

  return counts
    .map((count, digit) => ({ digit, count, percentage: (count / recent.length) * 100 }))
    .sort((a, b) => a.count - b.count)
    .slice(0, 3)
}

function analyzeTransitions(history: number[]) {
  const transitions: { [key: string]: number } = {}

  for (let i = 0; i < history.length - 1; i++) {
    const key = `${history[i]}->${history[i + 1]}`
    transitions[key] = (transitions[key] || 0) + 1
  }

  return Object.entries(transitions)
    .map(([transition, count]) => ({ transition, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

function analyzeEvenOdd(history: number[]) {
  const recent = history.slice(-20)
  const even = recent.filter((d) => d % 2 === 0).length
  const odd = recent.length - even

  return {
    even,
    odd,
    evenPercentage: (even / recent.length) * 100,
    oddPercentage: (odd / recent.length) * 100,
  }
}

function analyzeHighLow(history: number[]) {
  const recent = history.slice(-20)
  const high = recent.filter((d) => d >= 5).length
  const low = recent.length - high

  return {
    high,
    low,
    highPercentage: (high / recent.length) * 100,
    lowPercentage: (low / recent.length) * 100,
  }
}

export function calculateStatistics(history: number[], counts: number[]) {
  if (history.length === 0) return null

  const mean = history.reduce((sum, val) => sum + val, 0) / history.length
  const variance = history.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / history.length
  const stdDev = Math.sqrt(variance)

  const distribution = counts.map((count, digit) => ({
    digit,
    count,
    percentage: (count / history.length) * 100,
    deviation: count - history.length / 10,
  }))

  return {
    mean,
    variance,
    stdDev,
    distribution,
    totalTicks: history.length,
    uniqueDigits: counts.filter((c) => c > 0).length,
  }
}

export function generatePredictions(history: number[], counts: number[], patterns: any): Prediction[] {
  const predictions: Prediction[] = []

  // Strategy 1: Most Frequent Digit
  const maxCount = Math.max(...counts)
  const mostFrequent = counts.indexOf(maxCount)
  predictions.push({
    digit: mostFrequent,
    confidence: (maxCount / history.length) * 100,
    strategy: "Most Frequent",
    timestamp: Date.now(),
  })

  // Strategy 2: Hot Digit (recent trend)
  if (patterns?.hotDigits?.[0]) {
    predictions.push({
      digit: patterns.hotDigits[0].digit,
      confidence: patterns.hotDigits[0].percentage,
      strategy: "Hot Digit",
      timestamp: Date.now(),
    })
  }

  // Strategy 3: Pattern-based (sequence continuation)
  if (history.length >= 3 && patterns?.sequences?.[0]) {
    const lastPattern = history.slice(-2)
    const matchingSequence = patterns.sequences.find(
      (s: any) => s.pattern[0] === lastPattern[0] && s.pattern[1] === lastPattern[1],
    )
    if (matchingSequence) {
      predictions.push({
        digit: matchingSequence.pattern[2],
        confidence: (matchingSequence.occurrences / history.length) * 100,
        strategy: "Sequence Pattern",
        timestamp: Date.now(),
      })
    }
  }

  // Strategy 4: Transition-based
  if (history.length > 0 && patterns?.transitions?.[0]) {
    const lastDigit = history[history.length - 1]
    const relevantTransitions = patterns.transitions.filter((t: any) => t.transition.startsWith(`${lastDigit}->`))
    if (relevantTransitions.length > 0) {
      const nextDigit = Number.parseInt(relevantTransitions[0].transition.split("->")[1])
      predictions.push({
        digit: nextDigit,
        confidence: (relevantTransitions[0].count / history.length) * 100,
        strategy: "Transition Analysis",
        timestamp: Date.now(),
      })
    }
  }

  return predictions.sort((a, b) => b.confidence - a.confidence)
}
