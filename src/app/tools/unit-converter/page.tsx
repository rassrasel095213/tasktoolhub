'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Calculator, ArrowLeft, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const conversionUnits = {
  length: {
    name: 'Length',
    units: {
      'Meter': 1,
      'Kilometer': 0.001,
      'Centimeter': 100,
      'Millimeter': 1000,
      'Mile': 0.000621371,
      'Yard': 1.09361,
      'Foot': 3.28084,
      'Inch': 39.3701
    }
  },
  weight: {
    name: 'Weight',
    units: {
      'Kilogram': 1,
      'Gram': 1000,
      'Milligram': 1000000,
      'Pound': 2.20462,
      'Ounce': 35.274,
      'Ton': 0.001
    }
  },
  temperature: {
    name: 'Temperature',
    units: {
      'Celsius': 'celsius',
      'Fahrenheit': 'fahrenheit',
      'Kelvin': 'kelvin'
    },
    special: true
  },
  time: {
    name: 'Time',
    units: {
      'Second': 1,
      'Minute': 1/60,
      'Hour': 1/3600,
      'Day': 1/86400,
      'Week': 1/604800,
      'Month': 1/2592000,
      'Year': 1/31536000
    }
  },
  volume: {
    name: 'Volume',
    units: {
      'Liter': 1,
      'Milliliter': 1000,
      'Gallon': 0.264172,
      'Quart': 1.05669,
      'Pint': 2.11338,
      'Cup': 4.22675,
      'Fluid Ounce': 33.814
    }
  },
  area: {
    name: 'Area',
    units: {
      'Square Meter': 1,
      'Square Kilometer': 0.000001,
      'Square Centimeter': 10000,
      'Square Mile': 0.000000386102,
      'Square Yard': 1.19599,
      'Square Foot': 10.7639,
      'Square Inch': 1550,
      'Acre': 0.000247105,
      'Hectare': 0.0001
    }
  }
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState('Meter')
  const [toUnit, setToUnit] = useState('Foot')
  const [inputValue, setInputValue] = useState('1')
  const [result, setResult] = useState('')

  const convertTemperature = (value, from, to) => {
    let celsius
    
    // Convert to Celsius first
    switch (from) {
      case 'celsius':
        celsius = parseFloat(value)
        break
      case 'fahrenheit':
        celsius = (parseFloat(value) - 32) * 5/9
        break
      case 'kelvin':
        celsius = parseFloat(value) - 273.15
        break
      default:
        celsius = parseFloat(value)
    }

    // Convert from Celsius to target
    switch (to) {
      case 'celsius':
        return celsius.toFixed(2)
      case 'fahrenheit':
        return (celsius * 9/5 + 32).toFixed(2)
      case 'kelvin':
        return (celsius + 273.15).toFixed(2)
      default:
        return celsius.toFixed(2)
    }
  }

  const convert = () => {
    if (!inputValue || isNaN(inputValue)) {
      setResult('Invalid input')
      return
    }

    const categoryData = conversionUnits[category]
    
    if (categoryData.special) {
      // Handle temperature conversion
      const converted = convertTemperature(inputValue, categoryData.units[fromUnit], categoryData.units[toUnit])
      setResult(converted)
    } else {
      // Handle regular unit conversion
      const fromFactor = categoryData.units[fromUnit]
      const toFactor = categoryData.units[toUnit]
      const converted = (parseFloat(inputValue) / fromFactor) * toFactor
      setResult(converted.toFixed(6).replace(/\.?0+$/, ''))
    }
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  React.useEffect(() => {
    convert()
  }, [category, fromUnit, toUnit, inputValue])

  const currentCategory = conversionUnits[category]
  const availableUnits = Object.keys(currentCategory.units)

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
            <span className="text-gray-900">Unit Converter</span>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Unit Converter</h1>
            <p className="text-gray-600">Convert between different units of measurement</p>
          </div>

          {/* Converter Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                <Ruler className="w-6 h-6 text-[#0288d1]" />
                <span>Unit Converter</span>
              </CardTitle>
              <CardDescription className="text-center">
                Convert length, weight, temperature, time, volume, and area units
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(conversionUnits).map(([key, data]) => (
                      <SelectItem key={key} value={key}>
                        {data.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                      {availableUnits.map((unit) => (
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
                      {availableUnits.map((unit) => (
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
              {result && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-900">
                    {inputValue} {fromUnit} = {result} {toUnit}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Common Conversions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Length</h3>
                <p className="text-sm text-gray-600">1 meter = 3.28084 feet</p>
                <p className="text-sm text-gray-600">1 kilometer = 0.621371 miles</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Weight</h3>
                <p className="text-sm text-gray-600">1 kilogram = 2.20462 pounds</p>
                <p className="text-sm text-gray-600">1 gram = 0.035274 ounces</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Temperature</h3>
                <p className="text-sm text-gray-600">0°C = 32°F = 273.15K</p>
                <p className="text-sm text-gray-600">100°C = 212°F = 373.15K</p>
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