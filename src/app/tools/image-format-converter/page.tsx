'use client'

import { useState, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Upload, Download, RotateCcw, Image as ImageIcon, Zap, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface ConvertedImage {
  original: {
    format: string
    size: number
    sizeText: string
    url: string
    name: string
  }
  converted: {
    format: string
    size: number
    sizeText: string
    url: string
    name: string
  }
}

const SUPPORTED_FORMATS = [
  { value: 'jpeg', label: 'JPEG', extension: 'jpg', mimeType: 'image/jpeg' },
  { value: 'png', label: 'PNG', extension: 'png', mimeType: 'image/png' },
  { value: 'webp', label: 'WebP', extension: 'webp', mimeType: 'image/webp' },
  { value: 'bmp', label: 'BMP', extension: 'bmp', mimeType: 'image/bmp' },
  { value: 'gif', label: 'GIF', extension: 'gif', mimeType: 'image/gif' },
]

export default function ImageFormatConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([])
  const [targetFormat, setTargetFormat] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileFormat = (file: File): string => {
    const format = SUPPORTED_FORMATS.find(f => f.mimeType === file.type)
    return format ? format.label : 'Unknown'
  }

  const convertImage = useCallback(async (file: File, format: typeof SUPPORTED_FORMATS[0]): Promise<ConvertedImage> => {
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

          canvas.width = img.width
          canvas.height = img.height

          // Handle transparency for JPEG
          if (format.value === 'jpeg') {
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
          }

          ctx.drawImage(img, 0, 0)

          // Simulate progress
          let progressValue = 0
          const progressInterval = setInterval(() => {
            progressValue += 10
            setProgress(progressValue)
            if (progressValue >= 90) {
              clearInterval(progressInterval)
            }
          }, 100)

          canvas.toBlob(
            (blob) => {
              clearInterval(progressInterval)
              setProgress(100)
              
              if (!blob) {
                reject(new Error('Could not convert image'))
                return
              }

              const convertedUrl = URL.createObjectURL(blob)
              const originalSize = file.size
              const convertedSize = blob.size

              // Generate new filename
              const originalName = file.name.split('.').slice(0, -1).join('.')
              const newName = `${originalName}.${format.extension}`

              resolve({
                original: {
                  format: getFileFormat(file),
                  size: originalSize,
                  sizeText: formatFileSize(originalSize),
                  url: URL.createObjectURL(file),
                  name: file.name
                },
                converted: {
                  format: format.label,
                  size: convertedSize,
                  sizeText: formatFileSize(convertedSize),
                  url: convertedUrl,
                  name: newName
                }
              })
            },
            format.mimeType,
            format.value === 'jpeg' ? 0.95 : undefined
          )
        }
        img.onerror = () => reject(new Error('Could not load image'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Could not read file'))
      reader.readAsDataURL(file)
    })
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      setSelectedFile(file)
      setConvertedImages([])
      setProgress(0)
    }
  }

  const handleConvert = async () => {
    if (!selectedFile || !targetFormat) return

    const format = SUPPORTED_FORMATS.find(f => f.value === targetFormat)
    if (!format) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const result = await convertImage(selectedFile, format)
      setConvertedImages([result])
      toast.success(`Image converted to ${format.label} successfully!`)
    } catch (error) {
      toast.error('Failed to convert image')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = (converted: ConvertedImage['converted']) => {
    const link = document.createElement('a')
    link.href = converted.url
    link.download = converted.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleConvertAll = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setProgress(0)
    const results: ConvertedImage[] = []

    try {
      for (let i = 0; i < SUPPORTED_FORMATS.length; i++) {
        const format = SUPPORTED_FORMATS[i]
        if (format.mimeType !== selectedFile.type) {
          setProgress((i / SUPPORTED_FORMATS.length) * 100)
          const result = await convertImage(selectedFile, format)
          results.push(result)
        }
      }
      setConvertedImages(results)
      toast.success(`Converted to ${results.length} different formats!`)
    } catch (error) {
      toast.error('Failed to convert some images')
      console.error(error)
    } finally {
      setIsProcessing(false)
      setProgress(100)
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
              <div className="text-5xl mr-4">🔄</div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Image Format Converter</h1>
                <p className="text-gray-600 mt-2">Convert between different image formats seamlessly</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <Zap className="w-8 h-8 text-blue-900 mx-auto mb-2" />
                <h3 className="font-semibold">Multiple Formats</h3>
                <p className="text-sm text-gray-600">JPEG, PNG, WebP, BMP, GIF</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Shield className="w-8 h-8 text-green-700 mx-auto mb-2" />
                <h3 className="font-semibold">Quality Preserved</h3>
                <p className="text-sm text-gray-600">High quality conversion</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <RotateCcw className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                <h3 className="font-semibold">Batch Convert</h3>
                <p className="text-sm text-gray-600">Convert to all formats</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RotateCcw className="w-5 h-5 mr-2" />
                Convert Your Image
              </CardTitle>
              <CardDescription>
                Upload an image and choose the target format
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
                    Supports JPG, PNG, WebP, BMP, GIF
                  </span>
                </label>
              </div>

              {/* Format Selection */}
              {selectedFile && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Format</label>
                      <div className="p-3 border rounded-lg bg-gray-50">
                        <Badge variant="outline" className="text-lg">
                          {getFileFormat(selectedFile)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Target Format</label>
                      <Select value={targetFormat} onValueChange={setTargetFormat}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_FORMATS
                            .filter(format => format.mimeType !== selectedFile.type)
                            .map((format) => (
                              <SelectItem key={format.value} value={format.value}>
                                {format.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={handleConvert}
                      disabled={isProcessing || !targetFormat}
                      className="flex-1 bg-blue-900 hover:bg-blue-800 text-white"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Converting...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Convert to {targetFormat?.toUpperCase()}
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleConvertAll}
                      disabled={isProcessing}
                    >
                      Convert to All
                    </Button>
                  </div>
                </div>
              )}

              {/* Progress */}
              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-600 text-center">Processing: {Math.round(progress)}%</p>
                </div>
              )}

              {/* Results */}
              {convertedImages.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Converted Images</h4>
                  <div className="grid gap-4">
                    {convertedImages.map((converted, index) => (
                      <div key={index} className="border rounded-lg p-4 border-green-200 bg-green-50">
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Original */}
                          <div className="space-y-2">
                            <h5 className="font-medium text-sm">Original</h5>
                            <div className="flex items-center space-x-3">
                              <img
                                src={converted.original.url}
                                alt="Original"
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="text-sm">
                                <p className="font-medium">{converted.original.name}</p>
                                <p className="text-gray-600">
                                  {converted.original.format} • {converted.original.sizeText}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Converted */}
                          <div className="space-y-2">
                            <h5 className="font-medium text-sm">Converted</h5>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={converted.converted.url}
                                  alt="Converted"
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div className="text-sm">
                                  <p className="font-medium">{converted.converted.name}</p>
                                  <p className="text-gray-600">
                                    {converted.converted.format} • {converted.converted.sizeText}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleDownload(converted.converted)}
                                className="bg-green-700 hover:bg-green-600 text-white"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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