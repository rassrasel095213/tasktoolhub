'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Calculator, ArrowLeft, HardDrive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const dataUnits = {
  'Byte': 1,
  'KB': 1024,
  'MB': 1024 * 1024,
  'GB': 1024 * 1024 * 1024,
  'TB': 1024 * 1024 * 1024 * 1024,
  'PB': 1024 * 1024 * 1024 * 1024 * 1024,
  'EB': 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
  'ZB': 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
  'YB': 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024
}

const unitDescriptions = {
  'Byte': 'Basic unit of digital information',
  'KB': 'Kilobyte - 1,024 bytes',
  'MB': 'Megabyte - 1,024 kilobytes',
  'GB': 'Gigabyte - 1,024 megabytes',
  'TB': 'Terabyte - 1,024 gigabytes',
  'PB': 'Petabyte - 1,024 terabytes',
  'EB': 'Exabyte - 1,024 petabytes',
  'ZB': 'Zettabyte - 1,024 exabytes',
  'YB': 'Yottabyte - 1,024 zettabytes'
}

export default function DataStorageConverterPage() {
  const [fromUnit, setFromUnit] = useState('GB')
  const [toUnit, setToUnit] = useState('MB')
  const [inputValue, setInputValue] = useState('1')
  const [result, setResult] = useState('')

  const convert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value) || value <= 0) {
      setResult('Please enter a valid positive number')
      return
    }

    const fromFactor = dataUnits[fromUnit]
    const toFactor = dataUnits[toUnit]
    const convertedValue = (value * fromFactor) / toFactor
    
    setResult(convertedValue.toLocaleString('en-US', { 
      maximumFractionDigits: 10,
      minimumFractionDigits: 0 
    }))
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  React.useEffect(() => {
    convert()
  }, [fromUnit, toUnit, inputValue])

  const getAllConversions = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value) || value <= 0) return []

    const fromFactor = dataUnits[fromUnit]
    const baseValue = value * fromFactor

    return Object.entries(dataUnits).map(([unit, factor]) => ({
      unit,
      value: baseValue / factor,
      description: unitDescriptions[unit]
    })).filter(item => item.unit !== fromUnit)
  }

  const allConversions = getAllConversions()

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
            <span className="text-gray-900">Data Storage Converter</span>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Data Storage Converter</h1>
            <p className="text-gray-600">Convert between different data storage units (KB, MB, GB, TB)</p>
          </div>

          {/* Converter Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                <HardDrive className="w-6 h-6 text-[#0288d1]" />
                <span>Data Storage Converter</span>
              </CardTitle>
              <CardDescription className="text-center">
                Convert between bytes, kilobytes, megabytes, gigabytes, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="flex space-x-2">
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(dataUnits).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter value"
                    className="flex-1"
                    min="0"
                    step="any"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  onClick={swapUnits}
                  variant="outline"
                  className="px-4 py-2"
                >
                  ⇅ Swap
                </Button>
              </div>

              {/* To Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="flex space-x-2">
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(dataUnits).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-900">
                    {inputValue} {fromUnit} = {result} {toUnit}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Conversions */}
          {allConversions.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>All Conversions</CardTitle>
                <CardDescription>
                  {inputValue} {fromUnit} in other units
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allConversions.map((conversion) => (
                    <div key={conversion.unit} className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-semibold text-gray-900">
                        {conversion.value.toLocaleString('en-US', { 
                          maximumFractionDigits: 6,
                          minimumFractionDigits: 0 
                        })} {conversion.unit}
                      </div>
                      <div className="text-sm text-gray-600">
                        {conversion.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reference Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Common Conversions</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• 1 KB = 1,024 Bytes</p>
                  <p>• 1 MB = 1,024 KB = 1,048,576 Bytes</p>
                  <p>• 1 GB = 1,024 MB = 1,073,741,824 Bytes</p>
                  <p>• 1 TB = 1,024 GB = 1,099,511,627,776 Bytes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Real-World Examples</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• Photo: ~2-5 MB</p>
                  <p>• HD Movie: ~4-8 GB</p>
                  <p>• Smartphone: 64-512 GB</p>
                  <p>• Hard Drive: 1-4 TB</p>
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