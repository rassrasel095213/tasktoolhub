'use client'

import { useState, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Upload, Download, Compress, Image as ImageIcon, Zap, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface CompressedImage {
  original: {
    size: number
    sizeText: string
    url: string
    name: string
  }
  compressed: {
    size: number
    sizeText: string
    url: string
    name: string
    compressionRatio: number
  }
}

export default function ImageCompressor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [compressedImage, setCompressedImage] = useState<CompressedImage | null>(null)
  const [quality, setQuality] = useState([80])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

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

          // Simulate progress
          let progressValue = 0
          const progressInterval = setInterval(() => {
            progressValue += 10
            setProgress(progressValue)
            if (progressValue >= 90) {
              clearInterval(progressInterval)
            }
          }, 100)

          ctx.drawImage(img, 0, 0)

          canvas.toBlob(
            (blob) => {
              clearInterval(progressInterval)
              setProgress(100)
              
              if (!blob) {
                reject(new Error('Could not compress image'))
                return
              }

              const compressedUrl = URL.createObjectURL(blob)
              const originalSize = file.size
              const compressedSize = blob.size
              const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100

              resolve({
                original: {
                  size: originalSize,
                  sizeText: formatFileSize(originalSize),
                  url: URL.createObjectURL(file),
                  name: file.name
                },
                compressed: {
                  size: compressedSize,
                  sizeText: formatFileSize(compressedSize),
                  url: compressedUrl,
                  name: `compressed_${file.name}`,
                  compressionRatio
                }
              })
            },
            file.type,
            qualityValue / 100
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
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Image Compressor</h1>
                <p className="text-gray-600 mt-2">Reduce image file sizes while maintaining quality</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <Zap className="w-8 h-8 text-blue-900 mx-auto mb-2" />
                <h3 className="font-semibold">Lightning Fast</h3>
                <p className="text-sm text-gray-600">Instant compression</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Shield className="w-8 h-8 text-green-700 mx-auto mb-2" />
                <h3 className="font-semibold">Privacy First</h3>
                <p className="text-sm text-gray-600">Local processing</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <ImageIcon className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                <h3 className="font-semibold">Quality Control</h3>
                <p className="text-sm text-gray-600">Adjustable quality</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Compress className="w-5 h-5 mr-2" />
                Compress Your Image
              </CardTitle>
              <CardDescription>
                Upload an image and adjust the quality slider to compress it
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

              {/* Quality Slider */}
              {selectedFile && (
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
                      <Compress className="w-4 h-4 mr-2" />
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