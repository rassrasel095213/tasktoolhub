'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { 
  Zap, 
  Maximize2, 
  Crop, 
  FileImage, 
  QrCode, 
  Type, 
  Scan,
  Menu,
  X,
  Upload,
  Download,
  Copy,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import imageCompression from 'browser-image-compression'
import QRCode from 'qrcode'
import Tesseract from 'tesseract.js'
import { createPortal } from 'react-dom'
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import { getCroppedImg } from '@/lib/cropImage'

export default function TaskToolHub() {
  const [activeTab, setActiveTab] = useState('compressor')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Image Compressor States
  const [compressorImage, setCompressorImage] = useState<File | null>(null)
  const [compressorPreview, setCompressorPreview] = useState<string>('')
  const [compressorQuality, setCompressorQuality] = useState([80])
  const [compressedImage, setCompressedImage] = useState<string>('')
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number>(0)

  // Image Resizer States
  const [resizerImage, setResizerImage] = useState<File | null>(null)
  const [resizerPreview, setResizerPreview] = useState<string>('')
  const [resizerWidth, setResizerWidth] = useState<string>('800')
  const [resizerHeight, setResizerHeight] = useState<string>('600')
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [resizedImage, setResizedImage] = useState<string>('')

  // Image Crop States
  const [cropImage, setCropImage] = useState<File | null>(null)
  const [cropPreview, setCropPreview] = useState<string>('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [croppedImage, setCroppedImage] = useState<string>('')

  // Format Converter States
  const [formatImage, setFormatImage] = useState<File | null>(null)
  const [formatPreview, setFormatPreview] = useState<string>('')
  const [outputFormat, setOutputFormat] = useState<string>('png')
  const [convertedImage, setConvertedImage] = useState<string>('')

  // QR Code States
  const [qrText, setQrText] = useState<string>('')
  const [qrCode, setQrCode] = useState<string>('')
  const [qrSize, setQrSize] = useState<string>('300')

  // Number to Text States
  const [numberInput, setNumberInput] = useState<string>('')
  const [convertedText, setConvertedText] = useState<string>('')

  // OCR States
  const [ocrImage, setOcrImage] = useState<File | null>(null)
  const [ocrPreview, setOcrPreview] = useState<string>('')
  const [extractedText, setExtractedText] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  // Copy states
  const [copied, setCopied] = useState<boolean>(false)

  // Number to Text Converter Function
  const numberToWords = (num: number): string => {
    if (num === 0) return 'zero'
    
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
    const thousands = ['', 'thousand', 'million', 'billion', 'trillion']

    const convertLessThanThousand = (n: number): string => {
      if (n === 0) return ''
      if (n < 10) return ones[n]
      if (n < 20) return teens[n - 10]
      if (n < 100) {
        const ten = Math.floor(n / 10)
        const one = n % 10
        return tens[ten] + (one ? ' ' + ones[one] : '')
      }
      const hundred = Math.floor(n / 100)
      const remainder = n % 100
      return ones[hundred] + ' hundred' + (remainder ? ' ' + convertLessThanThousand(remainder) : '')
    }

    if (num < 0) return 'minus ' + numberToWords(-num)
    if (num === 0) return 'zero'

    let result = ''
    let thousandIndex = 0

    while (num > 0) {
      const chunk = num % 1000
      if (chunk > 0) {
        const chunkWords = convertLessThanThousand(chunk)
        result = chunkWords + (thousands[thousandIndex] ? ' ' + thousands[thousandIndex] : '') + (result ? ' ' + result : '')
      }
      num = Math.floor(num / 1000)
      thousandIndex++
    }

    return result
  }

  // Image Compressor Functions
  const handleCompressorUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCompressorImage(file)
      setOriginalSize(file.size)
      const reader = new FileReader()
      reader.onload = (e) => {
        setCompressorPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const compressImage = async () => {
    if (!compressorImage) return

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      quality: compressorQuality[0] / 100
    }

    try {
      const compressedFile = await imageCompression(compressorImage, options)
      setCompressedSize(compressedFile.size)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setCompressedImage(e.target?.result as string)
      }
      reader.readAsDataURL(compressedFile)
    } catch (error) {
      console.error('Error compressing image:', error)
    }
  }

  // Image Resizer Functions
  const handleResizerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResizerImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setResizerPreview(e.target?.result as string)
        const img = new Image()
        img.onload = () => {
          if (maintainAspectRatio) {
            const aspectRatio = img.width / img.height
            setResizerWidth('800')
            setResizerHeight(Math.round(800 / aspectRatio).toString())
          }
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const resizeImage = () => {
    if (!resizerPreview) return

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = parseInt(resizerWidth)
      canvas.height = parseInt(resizerHeight)
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      setResizedImage(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.src = resizerPreview
  }

  // Image Crop Functions
  const handleCropUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCropImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setCropPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        cropPreview,
        croppedAreaPixels
      )
      setCroppedImage(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }, [cropPreview, croppedAreaPixels])

  // Format Converter Functions
  const handleFormatUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormatImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormatPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const convertFormat = () => {
    if (!formatPreview) return

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      
      ctx.drawImage(img, 0, 0)
      
      const mimeType = outputFormat === 'jpg' ? 'image/jpeg' : `image/${outputFormat}`
      setConvertedImage(canvas.toDataURL(mimeType, 0.9))
    }
    img.src = formatPreview
  }

  // QR Code Functions
  const generateQRCode = async () => {
    if (!qrText) return

    try {
      const qrDataUrl = await QRCode.toDataURL(qrText, {
        width: parseInt(qrSize),
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCode(qrDataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  // Number to Text Function
  const convertNumberToText = () => {
    const num = parseFloat(numberInput)
    if (!isNaN(num)) {
      const words = numberToWords(Math.floor(num))
      if (num % 1 !== 0) {
        const decimal = Math.round((num % 1) * 100)
        setConvertedText(`${words} point ${numberToWords(decimal)}`)
      } else {
        setConvertedText(words)
      }
    }
  }

  // OCR Functions
  const handleOcrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setOcrImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setOcrPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const extractTextFromImage = async () => {
    if (!ocrImage) return

    setIsProcessing(true)
    try {
      const result = await Tesseract.recognize(
        ocrImage,
        'eng',
        {
          logger: (m) => console.log(m)
        }
      )
      setExtractedText(result.data.text)
    } catch (error) {
      console.error('Error extracting text:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Download Functions
  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    link.click()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Auto-generate QR code when text changes
  useEffect(() => {
    if (qrText) {
      generateQRCode()
    }
  }, [qrText, qrSize])

  // Auto-convert number when input changes
  useEffect(() => {
    if (numberInput) {
      convertNumberToText()
    }
  }, [numberInput])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-900 font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Task Tool Hub</h1>
                <p className="text-blue-200 text-sm">by Taskkora</p>
              </div>
            </div>
            
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Professional Tools Hub</h2>
          <p className="text-gray-600">All your image and text processing needs in one place</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
            <TabsTrigger value="compressor" className="flex items-center gap-2">
              <Zap size={16} />
              <span className="hidden sm:inline">Compress</span>
            </TabsTrigger>
            <TabsTrigger value="resizer" className="flex items-center gap-2">
              <Maximize2 size={16} />
              <span className="hidden sm:inline">Resize</span>
            </TabsTrigger>
            <TabsTrigger value="crop" className="flex items-center gap-2">
              <Crop size={16} />
              <span className="hidden sm:inline">Crop</span>
            </TabsTrigger>
            <TabsTrigger value="formatter" className="flex items-center gap-2">
              <FileImage size={16} />
              <span className="hidden sm:inline">Format</span>
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode size={16} />
              <span className="hidden sm:inline">QR Code</span>
            </TabsTrigger>
            <TabsTrigger value="numbertext" className="flex items-center gap-2">
              <Type size={16} />
              <span className="hidden sm:inline">Number→Text</span>
            </TabsTrigger>
            <TabsTrigger value="imagetext" className="flex items-center gap-2">
              <Scan size={16} />
              <span className="hidden sm:inline">Image→Text</span>
            </TabsTrigger>
          </TabsList>

          {/* Image Compressor */}
          <TabsContent value="compressor">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="text-blue-900" />
                  Image Compressor
                </CardTitle>
                <CardDescription>
                  Reduce image file size while maintaining quality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {compressorPreview ? (
                    <div className="space-y-4">
                      <img src={compressorPreview} alt="Preview" className="max-h-64 mx-auto rounded" />
                      <Button variant="outline" onClick={() => {
                        setCompressorImage(null)
                        setCompressorPreview('')
                        setCompressedImage('')
                      }}>
                        Choose Different Image
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">Drop your image here or click to browse</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCompressorUpload}
                        className="hidden"
                        id="compressor-upload"
                      />
                      <Button asChild>
                        <label htmlFor="compressor-upload" className="cursor-pointer">
                          Choose Image
                        </label>
                      </Button>
                    </>
                  )}
                </div>
                
                {compressorPreview && (
                  <div className="space-y-4">
                    <div>
                      <Label>Quality Level: {compressorQuality[0]}%</Label>
                      <Slider
                        value={compressorQuality}
                        onValueChange={setCompressorQuality}
                        max={100}
                        min={10}
                        step={5}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>Low Quality</span>
                        <span>High Quality</span>
                      </div>
                    </div>
                    
                    <Button onClick={compressImage} className="w-full bg-blue-900 hover:bg-blue-800">
                      Compress Image
                    </Button>
                    
                    {compressedImage && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-gray-600">Original Size</p>
                            <p className="font-semibold">{(originalSize / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded">
                            <p className="text-gray-600">Compressed Size</p>
                            <p className="font-semibold text-blue-900">{(compressedSize / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <img src={compressedImage} alt="Compressed" className="max-h-64 mx-auto rounded" />
                          <Button 
                            onClick={() => downloadImage(compressedImage, 'compressed-image.jpg')}
                            className="w-full bg-blue-900 hover:bg-blue-800"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Compressed Image
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Image Resizer */}
          <TabsContent value="resizer">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Maximize2 className="text-blue-900" />
                  Image Resizer
                </CardTitle>
                <CardDescription>
                  Resize images to specific dimensions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {resizerPreview ? (
                    <div className="space-y-4">
                      <img src={resizerPreview} alt="Preview" className="max-h-64 mx-auto rounded" />
                      <Button variant="outline" onClick={() => {
                        setResizerImage(null)
                        setResizerPreview('')
                        setResizedImage('')
                      }}>
                        Choose Different Image
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">Drop your image here or click to browse</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleResizerUpload}
                        className="hidden"
                        id="resizer-upload"
                      />
                      <Button asChild>
                        <label htmlFor="resizer-upload" className="cursor-pointer">
                          Choose Image
                        </label>
                      </Button>
                    </>
                  )}
                </div>
                
                {resizerPreview && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="width">Width (px)</Label>
                        <Input 
                          id="width" 
                          type="number" 
                          value={resizerWidth}
                          onChange={(e) => setResizerWidth(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height (px)</Label>
                        <Input 
                          id="height" 
                          type="number" 
                          value={resizerHeight}
                          onChange={(e) => setResizerHeight(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="maintain-aspect" 
                        checked={maintainAspectRatio}
                        onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                        className="rounded" 
                      />
                      <Label htmlFor="maintain-aspect">Maintain aspect ratio</Label>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setResizerWidth('1920')
                          setResizerHeight('1080')
                        }}
                      >
                        1920×1080
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setResizerWidth('1280')
                          setResizerHeight('720')
                        }}
                      >
                        1280×720
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setResizerWidth('800')
                          setResizerHeight('600')
                        }}
                      >
                        800×600
                      </Button>
                    </div>
                    
                    <Button onClick={resizeImage} className="w-full bg-blue-900 hover:bg-blue-800">
                      Resize Image
                    </Button>
                    
                    {resizedImage && (
                      <div className="space-y-4">
                        <img src={resizedImage} alt="Resized" className="max-h-64 mx-auto rounded" />
                        <Button 
                          onClick={() => downloadImage(resizedImage, 'resized-image.jpg')}
                          className="w-full bg-blue-900 hover:bg-blue-800"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Resized Image
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Image Crop */}
          <TabsContent value="crop">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crop className="text-blue-900" />
                  Image Crop
                </CardTitle>
                <CardDescription>
                  Crop images with live preview and custom dimensions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {cropPreview ? (
                    <div className="space-y-4">
                      <Button variant="outline" onClick={() => {
                        setCropImage(null)
                        setCropPreview('')
                        setCroppedImage('')
                      }}>
                        Choose Different Image
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">Drop your image here or click to browse</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCropUpload}
                        className="hidden"
                        id="crop-upload"
                      />
                      <Button asChild>
                        <label htmlFor="crop-upload" className="cursor-pointer">
                          Choose Image
                        </label>
                      </Button>
                    </>
                  )}
                </div>
                
                {cropPreview && (
                  <div className="space-y-4">
                    <div className="relative bg-gray-100 rounded-lg" style={{ height: '400px' }}>
                      <Cropper
                        image={cropPreview}
                        crop={crop}
                        zoom={zoom}
                        aspect={4 / 3}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                      />
                    </div>
                    
                    <div>
                      <Label>Zoom: {Math.round(zoom * 100)}%</Label>
                      <Slider
                        value={[zoom]}
                        onValueChange={(value) => setZoom(value[0])}
                        max={3}
                        min={1}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCrop({ x: 0, y: 0 })}
                      >
                        1:1 Square
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCrop({ x: 0, y: 0 })}
                      >
                        16:9 Wide
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCrop({ x: 0, y: 0 })}
                      >
                        4:3 Standard
                      </Button>
                    </div>
                    
                    <Button onClick={showCroppedImage} className="w-full bg-blue-900 hover:bg-blue-800">
                      Crop Image
                    </Button>
                    
                    {croppedImage && (
                      <div className="space-y-4">
                        <img src={croppedImage} alt="Cropped" className="max-h-64 mx-auto rounded" />
                        <Button 
                          onClick={() => downloadImage(croppedImage, 'cropped-image.jpg')}
                          className="w-full bg-blue-900 hover:bg-blue-800"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Cropped Image
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Image Format Converter */}
          <TabsContent value="formatter">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="text-blue-900" />
                  Image Format Converter
                </CardTitle>
                <CardDescription>
                  Convert images between different formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {formatPreview ? (
                    <div className="space-y-4">
                      <img src={formatPreview} alt="Preview" className="max-h-64 mx-auto rounded" />
                      <Button variant="outline" onClick={() => {
                        setFormatImage(null)
                        setFormatPreview('')
                        setConvertedImage('')
                      }}>
                        Choose Different Image
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">Drop your image here or click to browse</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFormatUpload}
                        className="hidden"
                        id="format-upload"
                      />
                      <Button asChild>
                        <label htmlFor="format-upload" className="cursor-pointer">
                          Choose Image
                        </label>
                      </Button>
                    </>
                  )}
                </div>
                
                {formatPreview && (
                  <div className="space-y-4">
                    <div>
                      <Label>Output Format</Label>
                      <Select value={outputFormat} onValueChange={setOutputFormat}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                          <SelectItem value="gif">GIF</SelectItem>
                          <SelectItem value="bmp">BMP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button onClick={convertFormat} className="w-full bg-blue-900 hover:bg-blue-800">
                      Convert Format
                    </Button>
                    
                    {convertedImage && (
                      <div className="space-y-4">
                        <img src={convertedImage} alt="Converted" className="max-h-64 mx-auto rounded" />
                        <Button 
                          onClick={() => downloadImage(convertedImage, `converted-image.${outputFormat}`)}
                          className="w-full bg-blue-900 hover:bg-blue-800"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Converted Image
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Code Generator */}
          <TabsContent value="qr">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="text-blue-900" />
                  QR Code Generator
                </CardTitle>
                <CardDescription>
                  Generate QR codes instantly with live preview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="qr-text">Enter Text or URL</Label>
                  <Textarea
                    id="qr-text"
                    placeholder="Enter text, URL, or any content to generate QR code"
                    className="mt-2"
                    rows={3}
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                  />
                </div>
                
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                  <div className="text-center">
                    {qrCode ? (
                      <div className="space-y-4">
                        <img src={qrCode} alt="QR Code" className="w-48 h-48 mx-auto bg-white rounded-lg shadow-lg" />
                        <p className="text-gray-600">QR code generated successfully!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-48 h-48 bg-white rounded-lg shadow-lg mx-auto mb-4 flex items-center justify-center">
                          <QrCode className="h-32 w-32 text-gray-400" />
                        </div>
                        <p className="text-gray-600">Enter text to generate QR code</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Size</Label>
                    <Select value={qrSize} onValueChange={setQrSize}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="200">200×200</SelectItem>
                        <SelectItem value="300">300×300</SelectItem>
                        <SelectItem value="500">500×500</SelectItem>
                        <SelectItem value="1000">1000×1000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Format</Label>
                    <Select defaultValue="png">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                        <SelectItem value="svg">SVG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {qrCode && (
                  <Button 
                    onClick={() => downloadImage(qrCode, 'qrcode.png')}
                    className="w-full bg-blue-900 hover:bg-blue-800"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code (300 DPI)
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Number to Text Converter */}
          <TabsContent value="numbertext">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="text-blue-900" />
                  Number to Text Converter
                </CardTitle>
                <CardDescription>
                  Convert numbers to words in English
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="number-input">Enter Number</Label>
                  <Input
                    id="number-input"
                    type="number"
                    placeholder="Enter a number (e.g., 1234)"
                    className="mt-2"
                    value={numberInput}
                    onChange={(e) => setNumberInput(e.target.value)}
                  />
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <Label>Converted Text</Label>
                  <div className="mt-2 p-3 bg-white rounded border border-blue-200 min-h-[60px]">
                    <p className="text-gray-700 capitalize">
                      {convertedText || 'Enter a number to see the conversion'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setNumberInput('')
                      setConvertedText('')
                    }}
                  >
                    Clear
                  </Button>
                  <Button 
                    className="bg-blue-900 hover:bg-blue-800"
                    onClick={convertNumberToText}
                  >
                    Convert
                  </Button>
                </div>
                
                {convertedText && (
                  <Button 
                    variant="outline"
                    onClick={() => copyToClipboard(convertedText)}
                    className="w-full"
                  >
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy Text'}
                  </Button>
                )}
                
                <Alert>
                  <AlertDescription>
                    Supports numbers up to 999,999,999,999 (trillion)
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Image to Text Converter */}
          <TabsContent value="imagetext">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="text-blue-900" />
                  Image to Text Converter (OCR)
                </CardTitle>
                <CardDescription>
                  Extract text from images using Optical Character Recognition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {ocrPreview ? (
                    <div className="space-y-4">
                      <img src={ocrPreview} alt="Preview" className="max-h-64 mx-auto rounded" />
                      <Button variant="outline" onClick={() => {
                        setOcrImage(null)
                        setOcrPreview('')
                        setExtractedText('')
                      }}>
                        Choose Different Image
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">Drop your image here or click to browse</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleOcrUpload}
                        className="hidden"
                        id="ocr-upload"
                      />
                      <Button asChild>
                        <label htmlFor="ocr-upload" className="cursor-pointer">
                          Choose Image
                        </label>
                      </Button>
                    </>
                  )}
                </div>
                
                {ocrPreview && (
                  <div className="space-y-4">
                    <Button 
                      onClick={extractTextFromImage}
                      disabled={isProcessing}
                      className="w-full bg-blue-900 hover:bg-blue-800"
                    >
                      {isProcessing ? 'Processing...' : 'Extract Text'}
                    </Button>
                    
                    <div>
                      <Label>Extracted Text</Label>
                      <Textarea
                        placeholder="Extracted text will appear here..."
                        className="mt-2 min-h-[150px]"
                        value={extractedText}
                        readOnly
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline"
                        onClick={() => copyToClipboard(extractedText)}
                        disabled={!extractedText}
                      >
                        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copied ? 'Copied!' : 'Copy Text'}
                      </Button>
                      <Button 
                        className="bg-blue-900 hover:bg-blue-800"
                        onClick={extractTextFromImage}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Extract Text'}
                      </Button>
                    </div>
                  </div>
                )}
                
                <Alert>
                  <AlertDescription>
                    For best results, use clear images with good contrast and readable text
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">Task Tool Hub</h3>
            <p className="text-blue-200">Professional tools for your everyday needs</p>
          </div>
          <div className="text-blue-300 text-sm">
            <p>© 2024 Taskkora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}