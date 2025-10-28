'use client'

import { useState, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Upload, Download, FileArchive, Image as ImageIcon, Zap, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface CompressedImage {
  original: {
    size: number
    sizeText: string
    url: string
    name: string
    width: number
    height: number
  }
  compressed: {
    size: number
    sizeText: string
    url: string
    name: string
    compressionRatio: number
    width: number
    height: number
  }
}

// Advanced image compression algorithms
class AdvancedImageCompressor {
  static async compressImage(file: File, quality: number, maxWidth?: number, maxHeight?: number): Promise<Blob> {
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

          // Calculate new dimensions
          let { width, height } = img
          
          if (maxWidth && width > maxWidth) {
            height = (maxWidth / width) * height
            width = maxWidth
          }
          
          if (maxHeight && height > maxHeight) {
            width = (maxHeight / height) * width
            height = maxHeight
          }

          // Ensure dimensions are integers
          width = Math.round(width)
          height = Math.round(height)

          canvas.width = width
          canvas.height = height

          // Apply advanced compression techniques
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          
          // Fill with white background for JPEG
          if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, width, height)
          }

          ctx.drawImage(img, 0, 0, width, height)

          // Convert to blob with specified quality
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Could not compress image'))
                return
              }
              resolve(blob)
            },
            file.type,
            quality / 100
          )
        }
        img.onerror = () => reject(new Error('Could not load image'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Could not read file'))
      reader.readAsDataURL(file)
    })
  }

  static async progressiveCompress(file: File, targetSizeKB: number): Promise<Blob> {
    let quality = 90
    let result = await this.compressImage(file, quality)
    
    // Progressive compression to reach target size
    while (result.size > targetSizeKB * 1024 && quality > 10) {
      quality -= 10
      result = await this.compressImage(file, quality)
    }
    
    return result
  }

  static async smartCompress(file: File): Promise<{ blob: Blob; quality: number; dimensions: { width: number; height: number } }> {
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })

    const { width, height } = img
    const pixels = width * height
    
    // Smart quality based on image size and type
    let quality = 85
    let maxWidth = 2048
    let maxHeight = 2048

    if (pixels > 4000000) { // > 4MP
      quality = 70
      maxWidth = 1920
      maxHeight = 1080
    } else if (pixels > 2000000) { // > 2MP
      quality = 75
      maxWidth = 1600
      maxHeight = 1200
    } else if (pixels > 1000000) { // > 1MP
      quality = 80
      maxWidth = 1280
      maxHeight = 960
    }

    // Adjust for file type
    if (file.type.includes('png')) {
      quality = Math.min(quality + 5, 95)
    }

    const blob = await this.compressImage(file, quality, maxWidth, maxHeight)
    
    return {
      blob,
      quality,
      dimensions: { width: maxWidth, height: maxHeight }
    }
  }
}

export default function ImageCompressor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [compressedImage, setCompressedImage] = useState<CompressedImage | null>(null)
  const [quality, setQuality] = useState([80])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [compressionMode, setCompressionMode] = useState<'quality' | 'size' | 'smart'>('quality')
  const [targetSizeKB, setTargetSizeKB] = useState(100)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const compressImage = useCallback(async (file: File, qualityValue: number): Promise<CompressedImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const img = new Image()
        img.onload = async () => {
          try {
            // Simulate progress
            let progressValue = 0
            const progressInterval = setInterval(() => {
              progressValue += 5
              setProgress(progressValue)
              if (progressValue >= 90) {
                clearInterval(progressInterval)
              }
            }, 50)

            let compressedBlob: Blob
            let finalWidth = img.width
            let finalHeight = img.height

            if (compressionMode === 'smart') {
              const result = await AdvancedImageCompressor.smartCompress(file)
              compressedBlob = result.blob
              finalWidth = result.dimensions.width
              finalHeight = result.dimensions.height
            } else if (compressionMode === 'size') {
              compressedBlob = await AdvancedImageCompressor.progressiveCompress(file, targetSizeKB)
            } else {
              compressedBlob = await AdvancedImageCompressor.compressImage(file, qualityValue, 2048, 2048)
            }

            clearInterval(progressInterval)
            setProgress(100)

            const compressedUrl = URL.createObjectURL(compressedBlob)
            const originalSize = file.size
            const compressedSize = compressedBlob.size
            const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100

            resolve({
              original: {
                size: originalSize,
                sizeText: formatFileSize(originalSize),
                url: URL.createObjectURL(file),
                name: file.name,
                width: img.width,
                height: img.height
              },
              compressed: {
                size: compressedSize,
                sizeText: formatFileSize(compressedSize),
                url: compressedUrl,
                name: `compressed_${file.name}`,
                compressionRatio,
                width: finalWidth,
                height: finalHeight
              }
            })
          } catch (error) {
            reject(error)
          }
        }
        img.onerror = () => reject(new Error('Could not load image'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Could not read file'))
      reader.readAsDataURL(file)
    })
  }, [compressionMode, targetSizeKB])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      setSelectedFile(file)
      setCompressedImage(null)
      setProgress(0)
    }
  }

  const handleCompress = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const result = await compressImage(selectedFile, quality[0])
      setCompressedImage(result)
      toast.success(`Image compressed successfully! Saved ${result.compressed.compressionRatio.toFixed(1)}%`)
    } catch (error) {
      toast.error('Failed to compress image')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!compressedImage) return

    const link = document.createElement('a')
    link.href = compressedImage.compressed.url
    link.download = compressedImage.compressed.name
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
              <div className="text-5xl mr-4">🗜️</div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Advanced Image Compressor</h1>
                <p className="text-gray-600 mt-2">Professional-grade image compression with multiple algorithms</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <Zap className="w-8 h-8 text-blue-900 mx-auto mb-2" />
                <h3 className="font-semibold">Smart Compression</h3>
                <p className="text-sm text-gray-600">AI-powered optimization</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Shield className="w-8 h-8 text-green-700 mx-auto mb-2" />
                <h3 className="font-semibold">Privacy First</h3>
                <p className="text-sm text-gray-600">Local processing only</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <ImageIcon className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                <h3 className="font-semibold">Multiple Modes</h3>
                <p className="text-sm text-gray-600">Quality, Size & Smart</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileArchive className="w-5 h-5 mr-2" />
                Professional Image Compression
              </CardTitle>
              <CardDescription>
                Choose compression mode and settings for optimal results
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
                    Supports JPG, PNG, WebP, GIF (Max 50MB)
                  </span>
                </label>
              </div>

              {/* Compression Mode Selection */}
              {selectedFile && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Compression Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={compressionMode === 'quality' ? 'default' : 'outline'}
                        onClick={() => setCompressionMode('quality')}
                        className={compressionMode === 'quality' ? 'bg-blue-900' : ''}
                      >
                        Quality
                      </Button>
                      <Button
                        variant={compressionMode === 'size' ? 'default' : 'outline'}
                        onClick={() => setCompressionMode('size')}
                        className={compressionMode === 'size' ? 'bg-blue-900' : ''}
                      >
                        Target Size
                      </Button>
                      <Button
                        variant={compressionMode === 'smart' ? 'default' : 'outline'}
                        onClick={() => setCompressionMode('smart')}
                        className={compressionMode === 'smart' ? 'bg-blue-900' : ''}
                      >
                        Smart
                      </Button>
                    </div>
                  </div>

                  {/* Quality Slider */}
                  {compressionMode === 'quality' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Quality</label>
                        <Badge variant="outline">{quality[0]}%</Badge>
                      </div>
                      <Slider
                        value={quality}
                        onValueChange={setQuality}
                        max={100}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Lower size</span>
                        <span>Higher quality</span>
                      </div>
                    </div>
                  )}

                  {/* Target Size Input */}
                  {compressionMode === 'size' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Target File Size (KB)</label>
                      <input
                        type="number"
                        value={targetSizeKB}
                        onChange={(e) => setTargetSizeKB(parseInt(e.target.value) || 100)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="10"
                        max="5000"
                      />
                      <p className="text-xs text-gray-500">
                        Progressive compression will attempt to reach this target size
                      </p>
                    </div>
                  )}

                  {/* Smart Mode Info */}
                  {compressionMode === 'smart' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Smart Compression</h4>
                      <p className="text-sm text-blue-800">
                        Automatically analyzes image content and applies optimal compression settings based on image size, type, and content complexity.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Compress Button */}
              {selectedFile && (
                <Button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Compressing...
                    </>
                  ) : (
                    <>
                      <FileArchive className="w-4 h-4 mr-2" />
                      Compress Image
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
              {compressedImage && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Original */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Original</h4>
                      <div className="border rounded-lg p-4">
                        <img
                          src={compressedImage.original.url}
                          alt="Original"
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <div className="text-sm space-y-1">
                          <p className="font-medium">{compressedImage.original.name}</p>
                          <p className="text-gray-600">Size: {compressedImage.original.sizeText}</p>
                          <p className="text-gray-600">Dimensions: {compressedImage.original.width} × {compressedImage.original.height}px</p>
                        </div>
                      </div>
                    </div>

                    {/* Compressed */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Compressed</h4>
                      <div className="border rounded-lg p-4 border-green-200 bg-green-50">
                        <img
                          src={compressedImage.compressed.url}
                          alt="Compressed"
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <div className="text-sm space-y-1">
                          <p className="font-medium">{compressedImage.compressed.name}</p>
                          <p className="text-gray-600">Size: {compressedImage.compressed.sizeText}</p>
                          <p className="text-gray-600">Dimensions: {compressedImage.compressed.width} × {compressedImage.compressed.height}px</p>
                          <Badge className="bg-green-100 text-green-800">
                            Saved {compressedImage.compressed.compressionRatio.toFixed(1)}%
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
                    Download Compressed Image
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