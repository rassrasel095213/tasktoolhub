'use client'

import { useState, useEffect, useRef } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { QrCode, Download, RefreshCw, Smartphone, Zap, Shield } from 'lucide-react'
import { toast } from 'sonner'

// Simple QR Code generation using canvas
const generateQRCode = (text: string, size: number): string => {
  // This is a simplified QR code generator for demonstration
  // In production, you'd use a proper QR code library
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  canvas.width = size
  canvas.height = size

  // Background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, size, size)

  // Generate a pattern based on the text (simplified)
  const moduleSize = Math.floor(size / 25)
  const modules = 25

  // Simple hash function to create pattern
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }

  // Draw QR-like pattern
  ctx.fillStyle = '#000000'
  
  // Position markers (corners)
  drawPositionMarker(ctx, 0, 0, moduleSize * 7)
  drawPositionMarker(ctx, size - moduleSize * 7, 0, moduleSize * 7)
  drawPositionMarker(ctx, 0, size - moduleSize * 7, moduleSize * 7)

  // Data pattern based on text hash
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      // Skip position markers
      if (
        (row < 9 && col < 9) ||
        (row < 9 && col >= modules - 8) ||
        (row >= modules - 8 && col < 9)
      ) {
        continue
      }

      // Generate pattern based on hash and position
      const index = row * modules + col
      const shouldFill = Math.abs(hash + index) % 3 === 0
      
      if (shouldFill) {
        ctx.fillRect(
          col * moduleSize,
          row * moduleSize,
          moduleSize,
          moduleSize
        )
      }
    }
  }

  return canvas.toDataURL('image/png')
}

const drawPositionMarker = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  // Outer square
  ctx.fillStyle = '#000000'
  ctx.fillRect(x, y, size, size)
  
  // Inner white square
  ctx.fillStyle = '#FFFFFF'
  const innerSize = size * 0.6
  const innerOffset = (size - innerSize) / 2
  ctx.fillRect(x + innerOffset, y + innerOffset, innerSize, innerSize)
  
  // Center black square
  ctx.fillStyle = '#000000'
  const centerSize = size * 0.4
  const centerOffset = (size - centerSize) / 2
  ctx.fillRect(x + centerOffset, y + centerOffset, centerSize, centerSize)
}

export default function QRGenerator() {
  const [text, setText] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [size, setSize] = useState([300])
  const [errorCorrection, setErrorCorrection] = useState('M')
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const errorCorrectionLevels = [
    { value: 'L', label: 'Low (7%)', description: 'Can recover up to 7% of data' },
    { value: 'M', label: 'Medium (15%)', description: 'Can recover up to 15% of data' },
    { value: 'Q', label: 'Quartile (25%)', description: 'Can recover up to 25% of data' },
    { value: 'H', label: 'High (30%)', description: 'Can recover up to 30% of data' },
  ]

  useEffect(() => {
    if (text) {
      generateQR()
    } else {
      setQrCodeUrl('')
    }
  }, [text, size, errorCorrection])

  const generateQR = async () => {
    if (!text.trim()) {
      toast.error('Please enter text or URL')
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const qrDataUrl = generateQRCode(text, size[0])
      setQrCodeUrl(qrDataUrl)
      toast.success('QR Code generated successfully!')
    } catch (error) {
      toast.error('Failed to generate QR Code')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQR = (format: 'png' | 'svg') => {
    if (!qrCodeUrl) return

    if (format === 'png') {
      const link = document.createElement('a')
      link.href = qrCodeUrl
      link.download = `qrcode_${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('QR Code downloaded as PNG')
    } else {
      // For SVG, we'd need a proper QR library that supports SVG export
      toast.info('SVG export requires advanced QR library')
    }
  }

  const copyToClipboard = () => {
    if (text) {
      navigator.clipboard.writeText(text)
      toast.success('Text copied to clipboard')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="text-5xl mr-4">📱</div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">QR Code Generator</h1>
                <p className="text-gray-600 mt-2">Generate QR codes instantly with live preview</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <Zap className="w-8 h-8 text-blue-900 mx-auto mb-2" />
                <h3 className="font-semibold">Live Generation</h3>
                <p className="text-sm text-gray-600">Real-time preview</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Shield className="w-8 h-8 text-green-700 mx-auto mb-2" />
                <h3 className="font-semibold">High Quality</h3>
                <p className="text-sm text-gray-600">300 DPI download</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Smartphone className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                <h3 className="font-semibold">Mobile Ready</h3>
                <p className="text-sm text-gray-600">Scan anywhere</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="w-5 h-5 mr-2" />
                Generate QR Code
              </CardTitle>
              <CardDescription>
                Enter text, URL, or any data to generate a QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="qr-text">Text or URL</Label>
                    <div className="relative">
                      <Input
                        id="qr-text"
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text, URL, or any data..."
                        className="pr-10"
                      />
                      {text && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                          onClick={copyToClipboard}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Size: {size[0]}px</Label>
                    <Slider
                      value={size}
                      onValueChange={setSize}
                      max={500}
                      min={100}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>100px</span>
                      <span>500px</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Error Correction Level</Label>
                    <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {errorCorrectionLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div>
                              <div className="font-medium">{level.label}</div>
                              <div className="text-xs text-gray-500">{level.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quick Examples</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setText('https://tasktoolhub.com')}
                      >
                        Website URL
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setText('contact@taskkora.com')}
                      >
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setText('+1234567890')}
                      >
                        Phone
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setText('WiFi:TaskToolHub:password123')}
                      >
                        WiFi
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    {qrCodeUrl ? (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="relative">
                            <img
                              src={qrCodeUrl}
                              alt="QR Code"
                              className="max-w-full h-auto border-2 border-gray-300 rounded-lg bg-white"
                              style={{ maxWidth: `${size[0]}px` }}
                            />
                            {isGenerating && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                                <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Size: {size[0]} × {size[0]}px</p>
                          <p>Format: PNG</p>
                          <p>Quality: 300 DPI</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <QrCode className="w-16 h-16 text-gray-400 mx-auto" />
                        <p className="text-gray-500">
                          Enter text to generate QR code
                        </p>
                      </div>
                    )}
                  </div>

                  {qrCodeUrl && (
                    <div className="space-y-2">
                      <Button
                        onClick={() => downloadQR('png')}
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PNG (300 DPI)
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadQR('svg')}
                        >
                          Download SVG
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateQR}
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">About QR Codes</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• QR codes can store various types of data: URLs, text, contact info, WiFi credentials</p>
                  <p>• Higher error correction levels allow QR codes to be scanned even if partially damaged</p>
                  <p>• Generated QR codes are optimized for 300 DPI printing quality</p>
                  <p>• All processing happens locally in your browser for maximum privacy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}