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

export default function ImageResizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [resizedImage, setResizedImage] = useState<ResizedImage | null>(null)
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })

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

  const resizeImage = useCallback(async (file: File, newWidth: number, newHeight: number): Promise<ResizedImage> => {
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

          canvas.width = newWidth
          canvas.height = newHeight

          // Simulate progress
          let progressValue = 0
          const progressInterval = setInterval(() => {
            progressValue += 10
            setProgress(progressValue)
            if (progressValue >= 90) {
              clearInterval(progressInterval)
            }
          }, 100)

          ctx.drawImage(img, 0, 0, newWidth, newHeight)

          canvas.toBlob(
            (blob) => {
              clearInterval(progressInterval)
              setProgress(100)
              
              if (!blob) {
                reject(new Error('Could not resize image'))
                return
              }

              const resizedUrl = URL.createObjectURL(blob)
              const originalSize = file.size
              const resizedSize = blob.size

              resolve({
                original: {
                  width: img.width,
                  height: img.height,
                  size: originalSize,
                  sizeText: formatFileSize(originalSize),
                  url: URL.createObjectURL(file),
                  name: file.name
                },
                resized: {
                  width: newWidth,
                  height: newHeight,
                  size: resizedSize,
                  sizeText: formatFileSize(resizedSize),
                  url: resizedUrl,
                  name: `resized_${file.name}`
                }
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
      const result = await resizeImage(selectedFile, newWidth, newHeight)
      setResizedImage(result)
      toast.success(`Image resized to ${newWidth}x${newHeight} successfully!`)
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
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Image Resizer</h1>
                <p className="text-gray-600 mt-2">Resize images to any custom dimensions</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <Zap className="w-8 h-8 text-blue-900 mx-auto mb-2" />
                <h3 className="font-semibold">Custom Dimensions</h3>
                <p className="text-sm text-gray-600">Set exact size</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Shield className="w-8 h-8 text-green-700 mx-auto mb-2" />
                <h3 className="font-semibold">Aspect Ratio</h3>
                <p className="text-sm text-gray-600">Maintain proportions</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Maximize2 className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                <h3 className="font-semibold">High Quality</h3>
                <p className="text-sm text-gray-600">Preserve quality</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Maximize2 className="w-5 h-5 mr-2" />
                Resize Your Image
              </CardTitle>
              <CardDescription>
                Upload an image and set your desired dimensions
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

              {/* Dimensions Input */}
              {selectedFile && (
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