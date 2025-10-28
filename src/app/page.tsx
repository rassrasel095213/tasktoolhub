'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Calculator, Ruler, Percent, Zap, DollarSign, Clock, Calendar, BarChart3, Sigma, Users, TrendingUp, Grid3x3, Palette, Image, Thermometer, HardDrive, Award, LineChart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const tools = [
  { id: 'calculator', name: 'Calculator', description: 'Basic arithmetic operations (+, -, ×, ÷)', icon: Calculator, path: '/tools/calculator' },
  { id: 'unit-converter', name: 'Unit Converter', description: 'Convert length, weight, time, temperature and more', icon: Ruler, path: '/tools/unit-converter' },
  { id: 'percentage', name: 'Percentage Calculator', description: 'Calculate percentages and percentage changes', icon: Percent, path: '/tools/percentage' },
  { id: 'electrical', name: 'Electrical Calculator', description: 'Calculate resistance, voltage, and current', icon: Zap, path: '/tools/electrical' },
  { id: 'currency', name: 'Currency Converter', description: 'Convert between different currencies', icon: DollarSign, path: '/tools/currency' },
  { id: 'timezone', name: 'Time Zone Converter', description: 'Convert between different time zones', icon: Clock, path: '/tools/timezone' },
  { id: 'age', name: 'Age Calculator', description: 'Calculate age from date of birth', icon: Calendar, path: '/tools/age' },
  { id: 'date', name: 'Date Calculator', description: 'Calculate days, months, years between dates', icon: Calendar, path: '/tools/date' },
  { id: 'charts', name: 'Charts & Graphs', description: 'Create beautiful charts and graphs', icon: BarChart3, path: '/tools/charts' },
  { id: 'scientific', name: 'Scientific Calculator', description: 'Advanced math functions (sin, cos, log, etc.)', icon: Sigma, path: '/tools/scientific' },
  { id: 'profit-sharing', name: 'Profit Sharing Calculator', description: 'Calculate profit splits and distributions', icon: Users, path: '/tools/profit-sharing' },
  { id: 'compound-interest', name: 'Compound Interest Calculator', description: 'Calculate compound interest and returns', icon: TrendingUp, path: '/tools/compound-interest' },
  { id: 'matrix', name: 'Matrix Calculator', description: 'Matrix and vector operations', icon: Grid3x3, path: '/tools/matrix' },
  { id: 'color', name: 'Color Converter', description: 'Convert HEX, RGB, HSL color formats', icon: Palette, path: '/tools/color' },
  { id: 'image', name: 'Image Size Converter', description: 'Resize and convert image dimensions', icon: Image, path: '/tools/image' },
  { id: 'metric-imperial', name: 'Metric to Imperial Converter', description: 'Convert between metric and imperial units', icon: Thermometer, path: '/tools/metric-imperial' },
  { id: 'data-storage', name: 'Data Storage Converter', description: 'Convert KB, MB, GB, TB', icon: HardDrive, path: '/tools/data-storage' },
  { id: 'percentile', name: 'Percentile Calculator', description: 'Calculate percentiles and score rankings', icon: Award, path: '/tools/percentile' },
  { id: 'graphing', name: 'Graphing Calculator', description: 'Advanced graphing like Desmos', icon: LineChart, path: '/tools/graphing' }
]

const trendingTool = tools[0] // Calculator as trending tool

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.length > 0) {
      const filtered = tools.filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
      )
      setSearchSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSearchSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (tool) => {
    setSearchQuery(tool.name)
    setShowSuggestions(false)
    window.location.href = tool.path
  }

  return (
    <div className="min-h-screen bg-white">
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

            {/* Search Bar */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0288d1]"
                />
              </div>
              
              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchSuggestions.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => handleSuggestionClick(tool)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3"
                    >
                      <tool.icon className="w-4 h-4 text-[#0288d1]" />
                      <div>
                        <div className="font-medium text-gray-900">{tool.name}</div>
                        <div className="text-sm text-gray-500">{tool.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-6 h-0.5 bg-gray-600"></div>
                <div className="w-6 h-0.5 bg-gray-600"></div>
                <div className="w-6 h-0.5 bg-gray-600"></div>
              </div>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0a233b] to-[#0288d1] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Task Tool Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Your comprehensive collection of online calculators and converters
          </p>
          <p className="text-lg mb-8 text-blue-200 max-w-2xl mx-auto">
            Professional tools for calculations, conversions, and data analysis - all in one place
          </p>
          <Link href="/tools">
            <Button size="lg" className="bg-white text-[#0a233b] hover:bg-gray-100 px-8 py-3 text-lg">
              Explore All Tools
            </Button>
          </Link>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">👑</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Trending Tool</h2>
            </div>
            <p className="text-gray-600">Most popular tool this week</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Link href={trendingTool.path}>
              <Card className="border-2 border-yellow-400 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <trendingTool.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{trendingTool.name}</CardTitle>
                  <CardDescription className="text-lg text-gray-700">
                    {trendingTool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="inline-flex items-center space-x-2 text-yellow-600 font-medium">
                    <span className="text-2xl">🔥</span>
                    <span>Trending Now</span>
                    <span className="text-2xl">🔥</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Cards Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Tools</h2>
            <p className="text-gray-600">Choose from our comprehensive collection of professional tools</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link key={tool.id} href={tool.path}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-[#0288d1] group">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-[#0a233b] rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-[#0288d1] transition-colors">
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-900 group-hover:text-[#0288d1] transition-colors">
                      {tool.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

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