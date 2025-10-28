'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CalculatorPage() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)

  const inputNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num))
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.')
      setWaitingForNewValue(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForNewValue(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return firstValue / secondValue
      case '=':
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNewValue(true)
    }
  }

  const toggleSign = () => {
    const newValue = parseFloat(display) * -1
    setDisplay(String(newValue))
  }

  const inputPercent = () => {
    const newValue = parseFloat(display) / 100
    setDisplay(String(newValue))
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
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <Link href="/" className="text-gray-500 hover:text-[#0288d1]">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href="/" className="text-gray-500 hover:text-[#0288d1]">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/tools" className="text-gray-500 hover:text-[#0288d1]">Tools</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Calculator</span>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Calculator</h1>
            <p className="text-gray-600">Perform basic arithmetic operations with our easy-to-use calculator</p>
          </div>

          {/* Calculator Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Basic Calculator</CardTitle>
              <CardDescription className="text-center">
                Supports addition, subtraction, multiplication, and division
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm mx-auto">
                {/* Display */}
                <div className="bg-gray-900 text-white p-4 rounded-t-lg text-right text-2xl font-mono min-h-[60px] flex items-center justify-end">
                  {display}
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-4 gap-1 bg-gray-100 p-2 rounded-b-lg">
                  {/* Row 1 */}
                  <Button
                    onClick={clear}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
                  >
                    C
                  </Button>
                  <Button
                    onClick={toggleSign}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
                  >
                    +/-
                  </Button>
                  <Button
                    onClick={inputPercent}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
                  >
                    %
                  </Button>
                  <Button
                    onClick={() => performOperation('÷')}
                    className="bg-[#0288d1] hover:bg-[#0277bd] text-white font-semibold"
                  >
                    ÷
                  </Button>

                  {/* Row 2 */}
                  <Button
                    onClick={() => inputNumber(7)}
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold"
                  >
                    7
                  </Button>
                  <Button
                    onClick={() => inputNumber(8)}
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold"
                  >
                    8
                  </Button>
                  <Button
                    onClick={() => inputNumber(9)}
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold"
                  >
                    9
                  </Button>
                  <Button
                    onClick={() => performOperation('×')}
                    className="bg-[#0288d1] hover:bg-[#0277bd] text-white font-semibold"
                  >
                    ×
                  </Button>

                  {/* Row 3 */}
                  <Button
                    onClick={() => inputNumber(4)}
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold"
                  >
                    4
                  </Button>
                  <Button
                    onClick={() => inputNumber(5)}
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold"
                  >
                    5
                  </Button>
                  <Button
                    onClick={() => inputNumber(6)}
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold"
                  >
                    6
                  </Button>
                  <Button
                    onClick={() => performOperation('-')}
                    className="bg-[#0288d1] hover:bg-[#0277bd] text-white font-semibold"
                  >
                    −
                  </Button>

                  {/* Row 4 */}
                  <Button
                    onClick={() => inputNumber(1)}
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold"
                  >
                    1
                  </Button>
                  <Button
                    onClick={() => inputNumber(2)}
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold"
                  >
                    2
                  </Button>
                  <Button
                    onClick={() => inputNumber(3)}
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold"
                  >
                    3
                  </Button>
                  <Button
                    onClick={() => performOperation('+')}
                    className="bg-[#0288d1] hover:bg-[#0277bd] text-white font-semibold"
                  >
                    +
                  </Button>

                  {/* Row 5 */}
                  <Button
                    onClick={() => inputNumber(0)}
                    className="col-span-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold"
                  >
                    0
                  </Button>
                  <Button
                    onClick={inputDecimal}
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold"
                  >
                    .
                  </Button>
                  <Button
                    onClick={performCalculation}
                    className="bg-[#0288d1] hover:bg-[#0277bd] text-white font-semibold"
                  >
                    =
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Basic Operations</h3>
                <p className="text-sm text-gray-600">Add, subtract, multiply, divide</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Percentage</h3>
                <p className="text-sm text-gray-600">Calculate percentages easily</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Decimal Support</h3>
                <p className="text-sm text-gray-600">Work with decimal numbers</p>
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