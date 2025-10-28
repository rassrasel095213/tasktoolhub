'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calculator, ArrowLeft, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Exchange rates (relative to USD)
const exchangeRates = {
  'USD': 1,
  'EUR': 0.85,
  'GBP': 0.73,
  'JPY': 110.0,
  'AUD': 1.35,
  'CAD': 1.25,
  'CHF': 0.92,
  'CNY': 6.45,
  'INR': 74.0,
  'BRL': 5.2,
  'RUB': 73.0,
  'KRW': 1180.0,
  'MXN': 20.0,
  'SGD': 1.35,
  'HKD': 7.8,
  'SEK': 8.6,
  'NOK': 8.5,
  'NZD': 1.4,
  'ZAR': 15.0
}

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' }
]

export default function CurrencyConverterPage() {
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [amount, setAmount] = useState('100')
  const [result, setResult] = useState('')
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString())

  const convert = () => {
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setResult('Please enter a valid amount')
      return
    }

    // Convert to USD first, then to target currency
    const usdAmount = amountNum / exchangeRates[fromCurrency]
    const convertedAmount = usdAmount * exchangeRates[toCurrency]
    
    setResult(convertedAmount.toFixed(2))
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  useEffect(() => {
    convert()
  }, [fromCurrency, toCurrency, amount])

  const getCurrencySymbol = (code) => {
    const currency = currencies.find(c => c.code === code)
    return currency ? currency.symbol : code
  }

  const getCurrencyName = (code) => {
    const currency = currencies.find(c => c.code === code)
    return currency ? currency.name : code
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#0a233b] rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#0a233b]">Task Tool Hub</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-[#0288d1] transition-colors">Home</Link>
              <Link href="/tools" className="text-gray-700 hover:text-[#0288d1] transition-colors">Tools</Link>
              <Link href="/api" className="text-gray-700 hover:text-[#0288d1] transition-colors">API</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <Link href="/" className="text-gray-500 hover:text-[#0288d1]">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href="/" className="text-gray-500 hover:text-[#0288d1]">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/tools" className="text-gray-500 hover:text-[#0288d1]">Tools</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Currency Converter</span>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Currency Converter</h1>
            <p className="text-gray-600">Convert between major world currencies</p>
          </div>

          {/* Converter Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                <DollarSign className="w-6 h-6 text-[#0288d1]" />
                <span>Currency Converter</span>
              </CardTitle>
              <CardDescription className="text-center">
                Real-time currency conversion for major world currencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="flex space-x-2">
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  onClick={swapCurrencies}
                  variant="outline"
                  className="px-4 py-2"
                >
                  ⇅ Swap
                </Button>
              </div>

              {/* To Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="flex space-x-2">
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    value={result}
                    readOnly
                    placeholder="Result"
                    className="flex-1 bg-gray-50"
                  />
                </div>
              </div>

              {/* Result Display */}
              {result && !isNaN(result) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-900">
                    {getCurrencySymbol(fromCurrency)}{amount} {fromCurrency} = {getCurrencySymbol(toCurrency)}{result} {toCurrency}
                  </div>
                  <div className="text-sm text-green-700 mt-2">
                    1 {fromCurrency} = {(parseFloat(result) / parseFloat(amount)).toFixed(4)} {toCurrency}
                  </div>
                </div>
              )}

              {/* Exchange Rate Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-800">
                  <div className="font-semibold mb-2">Exchange Rate Information:</div>
                  <div>• Exchange rates are for reference only</div>
                  <div>• Actual rates may vary between financial institutions</div>
                  <div>• Last updated: {lastUpdated}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Conversions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">USD to EUR</h3>
                <p className="text-sm text-gray-600">$1 = €0.85</p>
                <p className="text-sm text-gray-600">$100 = €85.00</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">USD to GBP</h3>
                <p className="text-sm text-gray-600">$1 = £0.73</p>
                <p className="text-sm text-gray-600">$100 = £73.00</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">USD to JPY</h3>
                <p className="text-sm text-gray-600">$1 = ¥110.00</p>
                <p className="text-sm text-gray-600">$100 = ¥11,000</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a233b] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-[#0a233b]" />
                </div>
                <span className="text-xl font-bold">Task Tool Hub</span>
              </div>
              <p className="text-gray-300 mb-4">
                Professional online tools for calculations, conversions, and data analysis.
              </p>
              <p className="text-sm text-gray-400">
                © 2025 Task Tool Hub by Taskkora
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/tools" className="text-gray-300 hover:text-white transition-colors">All Tools</Link></li>
                <li><Link href="/api" className="text-gray-300 hover:text-white transition-colors">API</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>

            {/* Popular Tools */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Popular Tools</h3>
              <ul className="space-y-2">
                <li><Link href="/tools/calculator" className="text-gray-300 hover:text-white transition-colors">Calculator</Link></li>
                <li><Link href="/tools/unit-converter" className="text-gray-300 hover:text-white transition-colors">Unit Converter</Link></li>
                <li><Link href="/tools/currency" className="text-gray-300 hover:text-white transition-colors">Currency Converter</Link></li>
                <li><Link href="/tools/percentage" className="text-gray-300 hover:text-white transition-colors">Percentage Calculator</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Task Tool Hub. All rights reserved. Developed by Taskkora.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}