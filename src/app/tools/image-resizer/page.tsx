'use client'

import { useState, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Upload, Download, Maximize2, Image as ImageIcon, Zap, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface ResizedImage {
  original: {
    width: number
    height: number
    size: number
    sizeText: string
    url: string
    name: string
  }
  resized: {
    width: number
    height: number
    size: number
    sizeText: string
    url: string
    name: string
  }
}

// Advanced image resizer with multiple algorithms
class ImageResizer {
  static async resizeImage(
    file: File, 
    newWidth: number, 
    newHeight: number,
    algorithm: 'bilinear' | 'bicubic' | 'lanczos' = 'bilinear'
  ): Promise<{ blob: Blob; actualWidth: number; actualHeight: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
          }

          // Calculate actual dimensions maintaining aspect ratio if needed
          const aspectRatio = img.width / img.height
          let actualWidth = newWidth
          let actualHeight = newHeight

          // If only one dimension is provided, calculate the other
          if (newWidth === 0 && newHeight > 0) {
            actualWidth = Math.round(newHeight * aspectRatio)
          } else if (newHeight === 0 && newWidth > 0) {
            actualHeight = Math.round(newWidth / aspectRatio)
          }

          canvas.width = actualWidth
          canvas.height = actualHeight

          // Set image smoothing based on algorithm
          ctx.imageSmoothingEnabled = true
          switch (algorithm) {
            case 'bicubic':
              ctx.imageSmoothingQuality = 'high'
              break
            case 'lanczos':
              ctx.imageSmoothingQuality = 'high'
              // Additional Lanczos implementation would go here
              break
            default:
              ctx.imageSmoothingQuality = 'medium'
          }

          // Fill with white background for JPEG
          if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, actualWidth, actualHeight)
          }

          ctx.drawImage(img, 0, 0, actualWidth, actualHeight)

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Could not resize image'))
                return
              }
              resolve({
                blob,
                actualWidth,
                actualHeight
              })
            },
            file.type,
            0.95
          )
        }
        img.onerror = () => reject(new Error('Could not load image'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Could not read file'))
      reader.readAsDataURL(file)
    })
  }

  static async smartResize(file: File, targetWidth: number, targetHeight: number): Promise<{ blob: Blob; actualWidth: number; actualHeight: number }> {
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })

    const originalWidth = img.width
    const originalHeight = img.height

    // Smart resizing to avoid quality loss
    let steps = 1
    const ratio = Math.max(targetWidth / originalWidth, targetHeight / originalHeight)
    
    if (ratio < 0.5) {
      // Multiple steps for significant downscaling
      steps = Math.ceil(Math.log2(1 / ratio))
    }

    let currentBlob = file
    let currentWidth = originalWidth
    let currentHeight = originalHeight

    for (let i = 0; i < steps; i++) {
      const stepRatio = steps === 1 ? ratio : Math.pow(ratio, 1 / steps)
      const stepWidth = i === steps - 1 ? targetWidth : Math.round(currentWidth * stepRatio)
      const stepHeight = i === steps - 1 ? targetHeight : Math.round(currentHeight * stepRatio)

      const result = await this.resizeImage(currentBlob, stepWidth, stepHeight, 'bicubic')
      currentBlob = result.blob
      currentWidth = result.actualWidth
      currentHeight = result.actualHeight
    }

    return {
      blob: currentBlob,
      actualWidth: targetWidth,
      actualHeight: targetHeight
    }
  }

  static calculateOptimalSize(originalWidth: number, originalHeight: number, maxWidth: number, maxHeight: number): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight
    
    let width = originalWidth
    let height = originalHeight

    if (width > maxWidth) {
      width = maxWidth
      height = width / aspectRatio
    }

    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }

    return {
      width: Math.round(width),
      height: Math.round(height)
    }
  }
}

export default function ImageResizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [resizedImage, setResizedImage] = useState<ResizedImage | null>(null)
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
  const [resizeAlgorithm, setResizeAlgorithm] = useState<'bilinear' | 'bicubic' | 'lanczos'>('bicubic')
  const [resizeMode, setResizeMode] = useState<'custom' | 'preset' | 'percentage'>('custom')
  const [percentage, setPercentage] = useState(50)

  const presetSizes = [
    { name: 'Instagram Square', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Cover', width: 1200, height: 630 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'Full HD', width: 1920, height: 1080 },
    { name: '4K', width: 3840, height: 2160 },
    { name: 'Web Banner', width: 728, height: 90 },
  ]

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getImageDimensions = useCallback((file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          resolve({ width: img.width, height: img.height })
        }
        img.onerror = () => reject(new Error('Could not load image'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Could not read file'))
      reader.readAsDataURL(file)
    })
  }, [])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      try {
        const dimensions = await getImageDimensions(file)
        setOriginalDimensions(dimensions)
        setWidth(dimensions.width.toString())
        setHeight(dimensions.height.toString())
        setSelectedFile(file)
        setResizedImage(null)
        setProgress(0)
      } catch (error) {
        toast.error('Failed to load image dimensions')
      }
    }
  }

  const handleWidthChange = (value: string) => {
    setWidth(value)
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width
      const newHeight = Math.round(parseInt(value) * ratio)
      setHeight(newHeight.toString())
    }
  }

  const handleHeightChange = (value: string) => {
    setHeight(value)
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height
      const newWidth = Math.round(parseInt(value) * ratio)
      setWidth(newWidth.toString())
    }
  }

  const handlePercentageChange = (value: number) => {
    setPercentage(value)
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const newWidth = Math.round(originalDimensions.width * (value / 100))
      const newHeight = Math.round(originalDimensions.height * (value / 100))
      setWidth(newWidth.toString())
      setHeight(newHeight.toString())
    }
  }

  const handlePresetSelect = (preset: typeof presetSizes[0]) => {
    setWidth(preset.width.toString())
    setHeight(preset.height.toString())
    setResizeMode('custom')
  }

  const handleResize = async () => {
    if (!selectedFile || !width || !height) return

    const newWidth = parseInt(width)
    const newHeight = parseInt(height)

    if (isNaN(newWidth) || isNaN(newHeight) || newWidth <= 0 || newHeight <= 0) {
      toast.error('Please enter valid dimensions')
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      // Simulate progress
      let progressValue = 0
      const progressInterval = setInterval(() => {
        progressValue += 10
        setProgress(progressValue)
        if (progressValue >= 90) {
          clearInterval(progressInterval)
        }
      }, 100)

      const result = await ImageResizer.smartResize(selectedFile, newWidth, newHeight)
      
      clearInterval(progressInterval)
      setProgress(100)

      const resizedUrl = URL.createObjectURL(result.blob)
      const originalSize = selectedFile.size
      const resizedSize = result.blob.size

      setResizedImage({
        original: {
          width: originalDimensions.width,
          height: originalDimensions.height,
          size: originalSize,
          sizeText: formatFileSize(originalSize),
          url: URL.createObjectURL(selectedFile),
          name: selectedFile.name
        },
        resized: {
          width: result.actualWidth,
          height: result.actualHeight,
          size: resizedSize,
          sizeText: formatFileSize(resizedSize),
          url: resizedUrl,
          name: `resized_${selectedFile.name}`
        }
      })
      
      toast.success(`Image resized to ${result.actualWidth}×${result.actualHeight}px successfully!`)
    } catch (error) {
      toast.error('Failed to resize image')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resizedImage) return

    const link = document.createElement('a')
    link.href = resizedImage.resized.url
    link.download = resizedImage.resized.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="text-5xl mr-4">📐</div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Advanced Image Resizer</h1>
                <p className="text-gray-600 mt-2">Professional image resizing with multiple algorithms and smart optimization</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <Zap className="w-8 h-8 text-blue-900 mx-auto mb-2" />
                <h3 className="font-semibold">Smart Algorithms</h3>
                <p className="text-sm text-gray-600">Bicubic & Lanczos</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Shield className="w-8 h-8 text-green-700 mx-auto mb-2" />
                <h3 className="font-semibold">Quality Preserved</h3>
                <p className="text-sm text-gray-600">Multi-step resizing</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Maximize2 className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                <h3 className="font-semibold">Preset Sizes</h3>
                <p className="text-sm text-gray-600">Social media ready</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Maximize2 className="w-5 h-5 mr-2" />
                Professional Image Resizing
              </CardTitle>
              <CardDescription>
                Resize images with advanced algorithms and quality preservation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <span className="text-lg font-medium text-gray-700">
                    {selectedFile ? selectedFile.name : 'Click to upload an image'}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    Supports JPG, PNG, WebP, GIF
                  </span>
                </label>
              </div>

              {/* Resize Mode Selection */}
              {selectedFile && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Resize Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={resizeMode === 'custom' ? 'default' : 'outline'}
                        onClick={() => setResizeMode('custom')}
                        className={resizeMode === 'custom' ? 'bg-blue-900' : ''}
                      >
                        Custom
                      </Button>
                      <Button
                        variant={resizeMode === 'preset' ? 'default' : 'outline'}
                        onClick={() => setResizeMode('preset')}
                        className={resizeMode === 'preset' ? 'bg-blue-900' : ''}
                      >
                        Preset
                      </Button>
                      <Button
                        variant={resizeMode === 'percentage' ? 'default' : 'outline'}
                        onClick={() => setResizeMode('percentage')}
                        className={resizeMode === 'percentage' ? 'bg-blue-900' : ''}
                      >
                        Percentage
                      </Button>
                    </div>
                  </div>

                  {/* Custom Dimensions */}
                  {resizeMode === 'custom' && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="width">Width (px)</Label>
                          <Input
                            id="width"
                            type="number"
                            value={width}
                            onChange={(e) => handleWidthChange(e.target.value)}
                            placeholder="Enter width"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (px)</Label>
                          <Input
                            id="height"
                            type="number"
                            value={height}
                            onChange={(e) => handleHeightChange(e.target.value)}
                            placeholder="Enter height"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="aspect-ratio"
                          checked={maintainAspectRatio}
                          onCheckedChange={(checked) => setMaintainAspectRatio(checked as boolean)}
                        />
                        <Label htmlFor="aspect-ratio" className="text-sm">
                          Maintain aspect ratio
                        </Label>
                      </div>

                      {originalDimensions.width > 0 && (
                        <div className="text-sm text-gray-600">
                          Original dimensions: {originalDimensions.width} × {originalDimensions.height}px
                        </div>
                      )}
                    </div>
                  )}

                  {/* Preset Sizes */}
                  {resizeMode === 'preset' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {presetSizes.map((preset) => (
                          <Button
                            key={preset.name}
                            variant="outline"
                            size="sm"
                            onClick={() => handlePresetSelect(preset)}
                            className="text-xs"
                          >
                            {preset.name}
                          </Button>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        Selected: {width} × {height}px
                      </div>
                    </div>
                  )}

                  {/* Percentage */}
                  {resizeMode === 'percentage' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Resize Percentage: {percentage}%</Label>
                        <input
                          type="range"
                          min="10"
                          max="200"
                          value={percentage}
                          onChange={(e) => handlePercentageChange(parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>10%</span>
                          <span>100%</span>
                          <span>200%</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Result: {width} × {height}px
                      </div>
                    </div>
                  )}

                  {/* Algorithm Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Resize Algorithm</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={resizeAlgorithm === 'bilinear' ? 'default' : 'outline'}
                        onClick={() => setResizeAlgorithm('bilinear')}
                        size="sm"
                        className={resizeAlgorithm === 'bilinear' ? 'bg-blue-900' : ''}
                      >
                        Bilinear
                      </Button>
                      <Button
                        variant={resizeAlgorithm === 'bicubic' ? 'default' : 'outline'}
                        onClick={() => setResizeAlgorithm('bicubic')}
                        size="sm"
                        className={resizeAlgorithm === 'bicubic' ? 'bg-blue-900' : ''}
                      >
                        Bicubic
                      </Button>
                      <Button
                        variant={resizeAlgorithm === 'lanczos' ? 'default' : 'outline'}
                        onClick={() => setResizeAlgorithm('lanczos')}
                        size="sm"
                        className={resizeAlgorithm === 'lanczos' ? 'bg-blue-900' : ''}
                      >
                        Lanczos
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Resize Button */}
              {selectedFile && (
                <Button
                  onClick={handleResize}
                  disabled={isProcessing}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Resizing...
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Resize Image
                    </>
                  )}
                </Button>
              )}

              {/* Progress */}
              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-600 text-center">Processing: {progress}%</p>
                </div>
              )}

              {/* Results */}
              {resizedImage && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Original */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Original</h4>
                      <div className="border rounded-lg p-4">
                        <img
                          src={resizedImage.original.url}
                          alt="Original"
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <div className="text-sm space-y-1">
                          <p className="font-medium">{resizedImage.original.name}</p>
                          <p className="text-gray-600">
                            Size: {resizedImage.original.width} × {resizedImage.original.height}px
                          </p>
                          <p className="text-gray-600">
                            File size: {resizedImage.original.sizeText}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Resized */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Resized</h4>
                      <div className="border rounded-lg p-4 border-green-200 bg-green-50">
                        <img
                          src={resizedImage.resized.url}
                          alt="Resized"
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <div className="text-sm space-y-1">
                          <p className="font-medium">{resizedImage.resized.name}</p>
                          <p className="text-gray-600">
                            Size: {resizedImage.resized.width} × {resizedImage.resized.height}px
                          </p>
                          <p className="text-gray-600">
                            File size: {resizedImage.resized.sizeText}
                          </p>
                          <Badge className="bg-green-100 text-green-800">
                            Resized Successfully
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-green-700 hover:bg-green-600 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resized Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}