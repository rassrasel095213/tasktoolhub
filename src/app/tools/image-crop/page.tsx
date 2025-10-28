'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Upload, Download, Crop, Image as ImageIcon, Zap, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface CroppedImage {
  original: {
    width: number
    height: number
    size: number
    sizeText: string
    url: string
    name: string
  }
  cropped: {
    width: number
    height: number
    size: number
    sizeText: string
    url: string
    name: string
  }
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

const PRESET_SIZES = [
  { name: 'Free', width: 0, height: 0 },
  { name: 'Square (1:1)', width: 1, height: 1 },
  { name: 'Portrait (4:5)', width: 4, height: 5 },
  { name: 'Landscape (16:9)', width: 16, height: 9 },
  { name: 'Instagram Post (1:1)', width: 1, height: 1 },
  { name: 'Instagram Story (9:16)', width: 9, height: 16 },
  { name: 'Facebook Cover (16:9)', width: 16, height: 9 },
  { name: 'YouTube Thumbnail (16:9)', width: 16, height: 9 },
  { name: 'Twitter Header (3:1)', width: 3, height: 1 },
]

export default function ImageCrop() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [croppedImage, setCroppedImage] = useState<CroppedImage | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedPreset, setSelectedPreset] = useState('Free')
  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('')
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setSelectedFile(file)
      setCroppedImage(null)
      
      // Load image to get dimensions
      const img = new Image()
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height })
        // Set initial crop area to center
        const initialSize = Math.min(img.width, img.height) * 0.5
        setCropArea({
          x: (img.width - initialSize) / 2,
          y: (img.height - initialSize) / 2,
          width: initialSize,
          height: initialSize
        })
      }
      img.src = url
    }
  }

  const drawCropArea = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const img = imageRef.current
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    // Set canvas size to match display size
    canvas.width = rect.width
    canvas.height = rect.height
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Calculate scale factor
    const scaleX = canvas.width / img.naturalWidth
    const scaleY = canvas.height / img.naturalHeight
    
    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Clear the crop area
    ctx.clearRect(
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY
    )
    
    // Draw crop border
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.strokeRect(
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY
    )
    
    // Draw corner handles
    const handleSize = 8
    ctx.fillStyle = '#3b82f6'
    
    // Top-left
    ctx.fillRect(
      cropArea.x * scaleX - handleSize / 2,
      cropArea.y * scaleY - handleSize / 2,
      handleSize,
      handleSize
    )
    // Top-right
    ctx.fillRect(
      (cropArea.x + cropArea.width) * scaleX - handleSize / 2,
      cropArea.y * scaleY - handleSize / 2,
      handleSize,
      handleSize
    )
    // Bottom-left
    ctx.fillRect(
      cropArea.x * scaleX - handleSize / 2,
      (cropArea.y + cropArea.height) * scaleY - handleSize / 2,
      handleSize,
      handleSize
    )
    // Bottom-right
    ctx.fillRect(
      (cropArea.x + cropArea.width) * scaleX - handleSize / 2,
      (cropArea.y + cropArea.height) * scaleY - handleSize / 2,
      handleSize,
      handleSize
    )
  }, [cropArea])

  useEffect(() => {
    drawCropArea()
  }, [drawCropArea])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect || !imageRef.current) return
    
    const scaleX = imageRef.current.naturalWidth / rect.width
    const scaleY = imageRef.current.naturalHeight / rect.height
    
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    
    // Check if click is within crop area
    if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    ) {
      setIsDragging(true)
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current || !imageRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = imageRef.current.naturalWidth / rect.width
    const scaleY = imageRef.current.naturalHeight / rect.height
    
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    
    const newX = Math.max(0, Math.min(x - dragStart.x, imageRef.current.naturalWidth - cropArea.width))
    const newY = Math.max(0, Math.min(y - dragStart.y, imageRef.current.naturalHeight - cropArea.height))
    
    setCropArea(prev => ({
      ...prev,
      x: newX,
      y: newY
    }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName)
    const preset = PRESET_SIZES.find(p => p.name === presetName)
    if (preset && preset.width > 0 && preset.height > 0 && imageDimensions.width > 0) {
      const aspectRatio = preset.width / preset.height
      const maxSize = Math.min(imageDimensions.width, imageDimensions.height) * 0.8
      
      let newWidth = maxSize
      let newHeight = maxSize / aspectRatio
      
      if (newWidth > imageDimensions.width) {
        newWidth = imageDimensions.width
        newHeight = newWidth / aspectRatio
      }
      
      if (newHeight > imageDimensions.height) {
        newHeight = imageDimensions.height
        newWidth = newHeight * aspectRatio
      }
      
      setCropArea(prev => ({
        x: (imageDimensions.width - newWidth) / 2,
        y: (imageDimensions.height - newHeight) / 2,
        width: newWidth,
        height: newHeight
      }))
      
      setCustomWidth(Math.round(newWidth).toString())
      setCustomHeight(Math.round(newHeight).toString())
    }
  }

  const handleCustomSizeChange = () => {
    const width = parseInt(customWidth)
    const height = parseInt(customHeight)
    
    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      const maxX = imageDimensions.width - width
      const maxY = imageDimensions.height - height
      
      setCropArea(prev => ({
        ...prev,
        x: Math.min(prev.x, Math.max(0, maxX)),
        y: Math.min(prev.y, Math.max(0, maxY)),
        width: Math.min(width, imageDimensions.width),
        height: Math.min(height, imageDimensions.height)
      }))
    }
  }

  const cropImage = async () => {
    if (!selectedFile || !imageRef.current) return

    setIsProcessing(true)

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        throw new Error('Could not get canvas context')
      }

      canvas.width = cropArea.width
      canvas.height = cropArea.height

      ctx.drawImage(
        imageRef.current,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      )

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error('Could not crop image')
          }

          const croppedUrl = URL.createObjectURL(blob)
          const originalSize = selectedFile.size
          const croppedSize = blob.size

          setCroppedImage({
            original: {
              width: imageDimensions.width,
              height: imageDimensions.height,
              size: originalSize,
              sizeText: formatFileSize(originalSize),
              url: imageUrl,
              name: selectedFile.name
            },
            cropped: {
              width: cropArea.width,
              height: cropArea.height,
              size: croppedSize,
              sizeText: formatFileSize(croppedSize),
              url: croppedUrl,
              name: `cropped_${selectedFile.name}`
            }
          })
          
          toast.success(`Image cropped to ${Math.round(cropArea.width)}×${Math.round(cropArea.height)}px successfully!`)
          setIsProcessing(false)
        },
        selectedFile.type,
        0.95
      )
    } catch (error) {
      toast.error('Failed to crop image')
      console.error(error)
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!croppedImage) return

    const link = document.createElement('a')
    link.href = croppedImage.cropped.url
    link.download = croppedImage.cropped.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="text-5xl mr-4">✂️</div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Image Crop</h1>
                <p className="text-gray-600 mt-2">Crop images with live preview and custom sizing</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <Zap className="w-8 h-8 text-blue-900 mx-auto mb-2" />
                <h3 className="font-semibold">Live Preview</h3>
                <p className="text-sm text-gray-600">Real-time cropping</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Shield className="w-8 h-8 text-green-700 mx-auto mb-2" />
                <h3 className="font-semibold">Custom Sizes</h3>
                <p className="text-sm text-gray-600">Any dimensions</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Crop className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                <h3 className="font-semibold">Precise Control</h3>
                <p className="text-sm text-gray-600">Pixel perfect</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crop className="w-5 h-5 mr-2" />
                Crop Your Image
              </CardTitle>
              <CardDescription>
                Upload an image and select the area you want to crop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              {!imageUrl && (
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
                      Click to upload an image
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      Supports JPG, PNG, WebP, GIF
                    </span>
                  </label>
                </div>
              )}

              {/* Image Editor */}
              {imageUrl && (
                <div className="space-y-4">
                  {/* Controls */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Preset Sizes</Label>
                      <Select value={selectedPreset} onValueChange={handlePresetChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRESET_SIZES.map((preset) => (
                            <SelectItem key={preset.name} value={preset.name}>
                              {preset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Custom Width (px)</Label>
                      <Input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        onBlur={handleCustomSizeChange}
                        placeholder="Width"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Custom Height (px)</Label>
                      <Input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        onBlur={handleCustomSizeChange}
                        placeholder="Height"
                      />
                    </div>
                  </div>

                  {/* Image Preview */}
                  <div className="relative border rounded-lg overflow-hidden bg-gray-100" ref={containerRef}>
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt="Upload"
                      className="w-full h-auto max-h-96 object-contain"
                      draggable={false}
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full cursor-move"
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    />
                  </div>

                  {/* Crop Info */}
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                      Crop area: {Math.round(cropArea.width)} × {Math.round(cropArea.height)}px
                    </span>
                    <span>
                      Position: ({Math.round(cropArea.x)}, {Math.round(cropArea.y)})
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={cropImage}
                      disabled={isProcessing}
                      className="flex-1 bg-blue-900 hover:bg-blue-800 text-white"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Cropping...
                        </>
                      ) : (
                        <>
                          <Crop className="w-4 h-4 mr-2" />
                          Crop Image
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        setImageUrl('')
                        setSelectedFile(null)
                        setCroppedImage(null)
                      }}
                    >
                      Upload New Image
                    </Button>
                  </div>
                </div>
              )}

              {/* Results */}
              {croppedImage && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Original */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Original</h4>
                      <div className="border rounded-lg p-4">
                        <img
                          src={croppedImage.original.url}
                          alt="Original"
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <div className="text-sm space-y-1">
                          <p className="font-medium">{croppedImage.original.name}</p>
                          <p className="text-gray-600">
                            Size: {croppedImage.original.width} × {croppedImage.original.height}px
                          </p>
                          <p className="text-gray-600">
                            File size: {croppedImage.original.sizeText}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cropped */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Cropped</h4>
                      <div className="border rounded-lg p-4 border-green-200 bg-green-50">
                        <img
                          src={croppedImage.cropped.url}
                          alt="Cropped"
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <div className="text-sm space-y-1">
                          <p className="font-medium">{croppedImage.cropped.name}</p>
                          <p className="text-gray-600">
                            Size: {croppedImage.cropped.width} × {croppedImage.cropped.height}px
                          </p>
                          <p className="text-gray-600">
                            File size: {croppedImage.cropped.sizeText}
                          </p>
                          <Badge className="bg-green-100 text-green-800">
                            Cropped Successfully
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
                    Download Cropped Image
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