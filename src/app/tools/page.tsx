'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Calculator, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const tools = [
  { id: 'calculator', name: 'Calculator', description: 'Basic arithmetic operations (+, -, ×, ÷)', icon: Calculator, path: '/tools/calculator', category: 'Calculators' },
  { id: 'unit-converter', name: 'Unit Converter', description: 'Convert length, weight, time, temperature and more', icon: Calculator, path: '/tools/unit-converter', category: 'Converters' },
  { id: 'percentage', name: 'Percentage Calculator', description: 'Calculate percentages and percentage changes', icon: Calculator, path: '/tools/percentage', category: 'Calculators' },
  { id: 'electrical', name: 'Electrical Calculator', description: 'Calculate resistance, voltage, and current', icon: Calculator, path: '/tools/electrical', category: 'Calculators' },
  { id: 'currency', name: 'Currency Converter', description: 'Convert between different currencies', icon: Calculator, path: '/tools/currency', category: 'Converters' },
  { id: 'timezone', name: 'Time Zone Converter', description: 'Convert between different time zones', icon: Calculator, path: '/tools/timezone', category: 'Converters' },
  { id: 'age', name: 'Age Calculator', description: 'Calculate age from date of birth', icon: Calculator, path: '/tools/age', category: 'Calculators' },
  { id: 'date', name: 'Date Calculator', description: 'Calculate days, months, years between dates', icon: Calculator, path: '/tools/date', category: 'Calculators' },
  { id: 'charts', name: 'Charts & Graphs', description: 'Create beautiful charts and graphs', icon: Calculator, path: '/tools/charts', category: 'Data Tools' },
  { id: 'scientific', name: 'Scientific Calculator', description: 'Advanced math functions (sin, cos, log, etc.)', icon: Calculator, path: '/tools/scientific', category: 'Calculators' },
  { id: 'profit-sharing', name: 'Profit Sharing Calculator', description: 'Calculate profit splits and distributions', icon: Calculator, path: '/tools/profit-sharing', category: 'Calculators' },
  { id: 'compound-interest', name: 'Compound Interest Calculator', description: 'Calculate compound interest and returns', icon: Calculator, path: '/tools/compound-interest', category: 'Calculators' },
  { id: 'matrix', name: 'Matrix Calculator', description: 'Matrix and vector operations', icon: Calculator, path: '/tools/matrix', category: 'Calculators' },
  { id: 'color', name: 'Color Converter', description: 'Convert HEX, RGB, HSL color formats', icon: Calculator, path: '/tools/color', category: 'Converters' },
  { id: 'image', name: 'Image Size Converter', description: 'Resize and convert image dimensions', icon: Calculator, path: '/tools/image', category: 'Converters' },
  { id: 'metric-imperial', name: 'Metric to Imperial Converter', description: 'Convert between metric and imperial units', icon: Calculator, path: '/tools/metric-imperial', category: 'Converters' },
  { id: 'data-storage', name: 'Data Storage Converter', description: 'Convert KB, MB, GB, TB', icon: Calculator, path: '/tools/data-storage', category: 'Converters' },
  { id: 'percentile', name: 'Percentile Calculator', description: 'Calculate percentiles and score rankings', icon: Calculator, path: '/tools/percentile', category: 'Calculators' },
  { id: 'graphing', name: 'Graphing Calculator', description: 'Advanced graphing like Desmos', icon: Calculator, path: '/tools/graphing', category: 'Calculators' }
]

const categories = ['All', 'Calculators', 'Converters', 'Data Tools']

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
              <Link href="/tools" className="text-[#0288d1] font-medium">Tools</Link>
              <Link href="/api" className="text-gray-700 hover:text-[#0288d1] transition-colors">API</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <Link href="/" className="text-gray-500 hover:text-[#0288d1]">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href="/" className="text-gray-500 hover:text-[#0288d1]">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">All Tools</span>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">All Tools</h1>
            <p className="text-gray-600">Choose from our comprehensive collection of professional tools</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex justify-center space-x-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="mb-2"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <Link key={tool.id} href={tool.path}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-[#0288d1] group">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-[#0a233b] rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-[#0288d1] transition-colors">
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-900 group-hover:text-[#0288d1] transition-colors">
                      {tool.name}
                    </CardTitle>
                    <div className="text-xs text-[#0288d1] font-medium">
                      {tool.category}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tools found matching your search.</p>
            </div>
          )}
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