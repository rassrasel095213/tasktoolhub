'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Calculator, ArrowLeft, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ColorConverterPage() {
  const [hexInput, setHexInput] = useState('#3B82F6')
  const [rgbInput, setRgbInput] = useState({ r: '59', g: '130', b: '246' })
  const [hslInput, setHslInput] = useState({ h: '217', s: '91', l: '60' })
  const [activeFormat, setActiveFormat] = useState('hex')

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1)
  }

  const rgbToHsl = (r, g, b) => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const hslToRgb = (h, s, l) => {
    h /= 360
    s /= 100
    l /= 100
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }

  const handleHexChange = (value) => {
    setHexInput(value)
    const rgb = hexToRgb(value)
    if (rgb) {
      setRgbInput({ r: rgb.r.toString(), g: rgb.g.toString(), b: rgb.b.toString() })
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      setHslInput({ h: hsl.h.toString(), s: hsl.s.toString(), l: hsl.l.toString() })
    }
  }

  const handleRgbChange = (channel, value) => {
    const newRgb = { ...rgbInput, [channel]: value }
    setRgbInput(newRgb)
    
    const r = parseInt(newRgb.r) || 0
    const g = parseInt(newRgb.g) || 0
    const b = parseInt(newRgb.b) || 0
    
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      const hex = rgbToHex(r, g, b)
      setHexInput(hex)
      const hsl = rgbToHsl(r, g, b)
      setHslInput({ h: hsl.h.toString(), s: hsl.s.toString(), l: hsl.l.toString() })
    }
  }

  const handleHslChange = (channel, value) => {
    const newHsl = { ...hslInput, [channel]: value }
    setHslInput(newHsl)
    
    const h = parseInt(newHsl.h) || 0
    const s = parseInt(newHsl.s) || 0
    const l = parseInt(newHsl.l) || 0
    
    if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
      const rgb = hslToRgb(h, s, l)
      setRgbInput({ r: rgb.r.toString(), g: rgb.g.toString(), b: rgb.b.toString() })
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
      setHexInput(hex)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const currentColor = hexInput

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
            <span className="text-gray-900">Color Converter</span>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Color Converter</h1>
            <p className="text-gray-600">Convert between HEX, RGB, and HSL color formats</p>
          </div>

          {/* Color Preview */}
          <Card className="shadow-lg mb-8">
            <CardContent className="p-8">
              <div 
                className="w-full h-32 rounded-lg shadow-inner mb-4"
                style={{ backgroundColor: currentColor }}
              />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">{currentColor}</div>
                <div className="text-gray-600">Current Color</div>
              </div>
            </CardContent>
          </Card>

          {/* Converter Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                <Palette className="w-6 h-6 text-[#0288d1]" />
                <span>Color Converter</span>
              </CardTitle>
              <CardDescription className="text-center">
                Convert between different color formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Format Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Active Format
                </label>
                <Select value={activeFormat} onValueChange={setActiveFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hex">HEX</SelectItem>
                    <SelectItem value="rgb">RGB</SelectItem>
                    <SelectItem value="hsl">HSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* HEX Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HEX Format
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={hexInput}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => copyToClipboard(hexInput)}
                    variant="outline"
                  >
                    Copy
                  </Button>
                </div>
              </div>

              {/* RGB Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RGB Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Red</label>
                    <Input
                      type="number"
                      value={rgbInput.r}
                      onChange={(e) => handleRgbChange('r', e.target.value)}
                      min="0"
                      max="255"
                      placeholder="0-255"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Green</label>
                    <Input
                      type="number"
                      value={rgbInput.g}
                      onChange={(e) => handleRgbChange('g', e.target.value)}
                      min="0"
                      max="255"
                      placeholder="0-255"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Blue</label>
                    <Input
                      type="number"
                      value={rgbInput.b}
                      onChange={(e) => handleRgbChange('b', e.target.value)}
                      min="0"
                      max="255"
                      placeholder="0-255"
                    />
                  </div>
                </div>
                <div className="mt-2 flex space-x-2">
                  <Input
                    type="text"
                    value={`rgb(${rgbInput.r}, ${rgbInput.g}, ${rgbInput.b})`}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    onClick={() => copyToClipboard(`rgb(${rgbInput.r}, ${rgbInput.g}, ${rgbInput.b})`)}
                    variant="outline"
                  >
                    Copy
                  </Button>
                </div>
              </div>

              {/* HSL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HSL Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Hue</label>
                    <Input
                      type="number"
                      value={hslInput.h}
                      onChange={(e) => handleHslChange('h', e.target.value)}
                      min="0"
                      max="360"
                      placeholder="0-360"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Saturation</label>
                    <Input
                      type="number"
                      value={hslInput.s}
                      onChange={(e) => handleHslChange('s', e.target.value)}
                      min="0"
                      max="100"
                      placeholder="0-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Lightness</label>
                    <Input
                      type="number"
                      value={hslInput.l}
                      onChange={(e) => handleHslChange('l', e.target.value)}
                      min="0"
                      max="100"
                      placeholder="0-100"
                    />
                  </div>
                </div>
                <div className="mt-2 flex space-x-2">
                  <Input
                    type="text"
                    value={`hsl(${hslInput.h}, ${hslInput.s}%, ${hslInput.l}%)`}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    onClick={() => copyToClipboard(`hsl(${hslInput.h}, ${hslInput.s}%, ${hslInput.l}%)`)}
                    variant="outline"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Format Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>HEX:</strong> #RRGGBB - Web standard</p>
                  <p><strong>RGB:</strong> rgb(r, g, b) - 0-255 values</p>
                  <p><strong>HSL:</strong> hsl(h, s%, l%) - Hue, Saturation, Lightness</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Common Colors</h3>
                <div className="grid grid-cols-4 gap-2">
                  {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleHexChange(color)}
                      className="w-full h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
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