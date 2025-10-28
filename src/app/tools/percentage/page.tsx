'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Calculator, ArrowLeft, Percent } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PercentageCalculatorPage() {
  const [calculationType, setCalculationType] = useState('percentage')
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const [result, setResult] = useState('')
  const [explanation, setExplanation] = useState('')

  const calculate = () => {
    const num1 = parseFloat(value1)
    const num2 = parseFloat(value2)

    if (isNaN(num1) || isNaN(num2)) {
      setResult('Please enter valid numbers')
      setExplanation('')
      return
    }

    let calcResult = 0
    let calcExplanation = ''

    switch (calculationType) {
      case 'percentage':
        calcResult = (num1 / num2) * 100
        calcExplanation = `${num1} is ${calcResult.toFixed(2)}% of ${num2}`
        break
      case 'percentage_of':
        calcResult = (num1 * num2) / 100
        calcExplanation = `${num1}% of ${num2} is ${calcResult.toFixed(2)}`
        break
      case 'percentage_change':
        calcResult = ((num2 - num1) / num1) * 100
        calcExplanation = `Change from ${num1} to ${num2} is ${calcResult.toFixed(2)}%`
        break
      case 'percentage_increase':
        calcResult = num1 * (1 + num2 / 100)
        calcExplanation = `${num1} increased by ${num2}% is ${calcResult.toFixed(2)}`
        break
      case 'percentage_decrease':
        calcResult = num1 * (1 - num2 / 100)
        calcExplanation = `${num1} decreased by ${num2}% is ${calcResult.toFixed(2)}`
        break
    }

    setResult(calcResult.toFixed(2))
    setExplanation(calcExplanation)
  }

  React.useEffect(() => {
    if (value1 && value2) {
      calculate()
    } else {
      setResult('')
      setExplanation('')
    }
  }, [calculationType, value1, value2])

  const getInputs = () => {
    switch (calculationType) {
      case 'percentage':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value
              </label>
              <Input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder="Enter value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total
              </label>
              <Input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="Enter total"
              />
            </div>
          </>
        )
      case 'percentage_of':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Percentage (%)
              </label>
              <Input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder="Enter percentage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Of Value
              </label>
              <Input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="Enter value"
              />
            </div>
          </>
        )
      case 'percentage_change':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Value
              </label>
              <Input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder="Enter original value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Value
              </label>
              <Input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="Enter new value"
              />
            </div>
          </>
        )
      case 'percentage_increase':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Value
              </label>
              <Input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder="Enter original value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Increase Percentage (%)
              </label>
              <Input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="Enter increase percentage"
              />
            </div>
          </>
        )
      case 'percentage_decrease':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Value
              </label>
              <Input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder="Enter original value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decrease Percentage (%)
              </label>
              <Input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder="Enter decrease percentage"
              />
            </div>
          </>
        )
      default:
        return null
    }
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
            <span className="text-gray-900">Percentage Calculator</span>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Percentage Calculator</h1>
            <p className="text-gray-600">Calculate percentages, percentage changes, and more</p>
          </div>

          {/* Calculator Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                <Percent className="w-6 h-6 text-[#0288d1]" />
                <span>Percentage Calculator</span>
              </CardTitle>
              <CardDescription className="text-center">
                Calculate percentages, percentage changes, increases, and decreases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Calculation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calculation Type
                </label>
                <Select value={calculationType} onValueChange={setCalculationType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">What percentage is X of Y?</SelectItem>
                    <SelectItem value="percentage_of">What is X% of Y?</SelectItem>
                    <SelectItem value="percentage_change">Percentage change from X to Y</SelectItem>
                    <SelectItem value="percentage_increase">Increase X by Y%</SelectItem>
                    <SelectItem value="percentage_decrease">Decrease X by Y%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getInputs()}
              </div>

              {/* Result */}
              {result && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-900 mb-2">
                      {result}%
                    </div>
                    <div className="text-lg text-blue-700">
                      {explanation}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Examples */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Common Calculations</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• 25 is 50% of 50</p>
                  <p>• 20% of 100 is 20</p>
                  <p>• 50 to 75 is a 50% increase</p>
                  <p>• 100 decreased by 25% is 75</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Real-World Uses</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Calculate discounts and sales</p>
                  <p>• Determine tax amounts</p>
                  <p>• Analyze financial changes</p>
                  <p>• Track growth metrics</p>
                </div>
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