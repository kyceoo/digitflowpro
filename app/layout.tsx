import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Digit Flow Pro - The Original Professional Deriv Market Analysis System | 99.2% Accuracy",
  description:
    "Digit Flow Pro is the original and most accurate market analysis system for Deriv trading. Real-time pattern recognition, instant signals for all volatility indices (V10, V25, V50, V75, V100), and proven 99.2% accuracy. Professional-grade digit analysis with advanced algorithms. Trusted by traders worldwide for Binary.com and Deriv markets.",
  keywords:
    "Digit Flow Pro, original digit flow, deriv analysis, binary trading, volatility indices, market analysis, trading signals, deriv bot, binary bot, V10, V25, V50, V75, V100, digit analysis, pattern recognition, trading system, deriv markets, binary.com",
  authors: [{ name: "Digit Flow Pro Team" }],
  creator: "Digit Flow Pro",
  publisher: "Digit Flow Pro",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://digitflowpro.com",
    title: "Digit Flow Pro - The Original Professional Deriv Market Analysis System",
    description:
      "The original Digit Flow Pro with 99.2% accuracy for Deriv market analysis. Real-time signals, pattern recognition, and professional-grade trading tools.",
    siteName: "Digit Flow Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digit Flow Pro - Original Deriv Market Analysis",
    description: "Professional market analysis for Deriv trading with 99.2% accuracy",
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://digitflowpro.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
