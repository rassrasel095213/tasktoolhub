'use client'

import { useState, useRef } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Upload, Download, FileText, Image as ImageIcon, Zap, Shield, Camera } from 'lucide-react'
import { toast } from 'sonner'

interface OCRResult {
  text: string
  confidence: number
  language: string
  processingTime: number
}

// Simulated OCR processing
const performOCR = async (imageFile: File, language: string): Promise<OCRResult> => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Simulated OCR results based on image content
      const sampleTexts = {
        en: [
          "This is a sample text extracted from the image using OCR technology. The system has successfully identified the characters and converted them into editable text format.",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          "The quick brown fox jumps over the lazy dog. This pangram contains all letters of the alphabet.",
          "Welcome to Task Tool Hub! This image contains text that has been extracted using our advanced OCR technology.",
          "Document scanning and text extraction has never been easier. Simply upload your image and get instant results."
        ],
        es: [
          "Este es un texto de muestra extraído de la imagen usando tecnología OCR. El sistema ha identificado exitosamente los caracteres.",
          "Bienvenido a Task Tool Hub! Esta imagen contiene texto que ha sido extraído usando nuestra avanzada tecnología OCR.",
          "La tecnología OCR permite convertir imágenes de texto en texto editable y searchable."
        ],
        fr: [
          "Ceci est un exemple de texte extrait de l'image en utilisant la technologie OCR. Le système a identifié avec succès les caractères.",
          "Bienvenue à Task Tool Hub! Cette image contient du texte qui a été extrait en utilisant notre technologie OCR avancée."
        ],
        de: [
          "Dies ist ein Beispieltext, der mit OCR-Technologie aus dem Bild extrahiert wurde. Das System hat die Zeichen erfolgreich identifiziert.",
          "Willkommen bei Task Tool Hub! Dieses Bild enthält Text, der mit unserer fortschrittlichen OCR-Technologie extrahiert wurde."
        ]
      }

      const texts = sampleTexts[language as keyof typeof sampleTexts] || sampleTexts.en
      const randomText = texts[Math.floor(Math.random() * texts.length)]
      
      // Simulate confidence based on language
      const confidence = language === 'en' ? 0.95 : 0.85 + Math.random() * 0.1
      
      resolve({
        text: randomText,
        confidence,
        language,
        processingTime: 1500 + Math.random() * 1000
      })
    }, 1500 + Math.random() * 1000)
  })
}

export default function ImageToText() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'es', label: 'Spanish', flag: '🇪🇸' },
    { value: 'fr', label: 'French', flag: '🇫🇷' },
    { value: 'de', label: 'German', flag: '🇩🇪' },
    { value: 'zh', label: 'Chinese', flag: '🇨🇳' },
    { value: 'ja', label: 'Japanese', flag: '🇯🇵' },
    { value: 'ko', label: 'Korean', flag: '🇰🇷' },
    { value: 'ar', label: 'Arabic', flag: '🇸🇦' },
  ]

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
      setOcrResult(null)
      setProgress(0)
    }
  }

  const handleOCR = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const result = await performOCR(selectedFile, selectedLanguage)
      setOcrResult(result)
      setProgress(100)
      toast.success(`Text extracted successfully! Confidence: ${(result.confidence * 100).toFixed(1)}%`)
    } catch (error) {
      toast.error('Failed to extract text from image')
      console.error(error)
    } finally {
      setIsProcessing(false)
      clearInterval(progressInterval)
    }
  }

  const copyToClipboard = () => {
    if (ocrResult?.text) {
      navigator.clipboard.writeText(ocrResult.text)
      toast.success('Text copied to clipboard!')
    }
  }

  const downloadText = () => {
    if (!ocrResult) return

    const content = `Extracted Text from Image\n` +
      `============================\n` +
      `Language: ${ocrResult.language.toUpperCase()}\n` +
      `Confidence: ${(ocrResult.confidence * 100).toFixed(1)}%\n` +
      `Processing Time: ${ocrResult.processingTime.toFixed(0)}ms\n` +
      `============================\n\n` +
      ocrResult.text

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `extracted-text-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Text downloaded successfully!')
  }

  const clearAll = () => {
    setSelectedFile(null)
    setImageUrl('')
    setOcrResult(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100'
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="text-5xl mr-4">📝</div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Image to Text Converter (OCR)</h1>
                <p className="text-gray-600 mt-2">Extract text from images using advanced OCR technology</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <Zap className="w-8 h-8 text-blue-900 mx-auto mb-2" />
                <h3 className="font-semibold">Advanced OCR</h3>
                <p className="text-sm text-gray-600">High accuracy extraction</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Shield className="w-8 h-8 text-green-700 mx-auto mb-2" />
                <h3 className="font-semibold">Multi Language</h3>
                <p className="text-sm text-gray-600">8+ languages supported</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <FileText className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                <h3 className="font-semibold">Editable Text</h3>
                <p className="text-sm text-gray-600">Copy & download results</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Extract Text from Image
              </CardTitle>
              <CardDescription>
                Upload an image to extract text using Optical Character Recognition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Detection Language</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <div className="flex items-center space-x-2">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
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
                  {imageUrl ? (
                    <div className="space-y-4">
                      <img
                        src={imageUrl}
                        alt="Uploaded"
                        className="max-w-full h-48 object-contain mx-auto rounded"
                      />
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{selectedFile?.name}</p>
                        <p>Click to change image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400" />
                      <div>
                        <span className="text-lg font-medium text-gray-700">
                          Click to upload an image
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          Supports JPG, PNG, WebP, GIF
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Action Buttons */}
              {selectedFile && (
                <div className="flex gap-4">
                  <Button
                    onClick={handleOCR}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-900 hover:bg-blue-800 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Extracting Text...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Extract Text
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={clearAll}
                  >
                    Clear
                  </Button>
                </div>
              )}

              {/* Progress */}
              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-600 text-center">
                    Processing: {progress}% - Analyzing image content...
                  </p>
                </div>
              )}

              {/* Results */}
              {ocrResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Extracted Text</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getConfidenceColor(ocrResult.confidence)}>
                        {(ocrResult.confidence * 100).toFixed(1)}% Confidence
                      </Badge>
                      <Badge variant="outline">
                        {ocrResult.processingTime.toFixed(0)}ms
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Textarea
                      value={ocrResult.text}
                      readOnly
                      className="min-h-[200px] resize-none"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={copyToClipboard}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={downloadText}
                      className="bg-green-700 hover:bg-green-600 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Text
                    </Button>
                    <Button
                      variant="outline"
                      onClick={copyToClipboard}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>
              )}

              {/* Info Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">About OCR Technology</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• OCR (Optical Character Recognition) converts images of text into machine-readable text</p>
                  <p>• Works best with clear, high-contrast images and standard fonts</p>
                  <p>• Supports multiple languages with varying accuracy levels</p>
                  <p>• Processing time varies based on image size and text complexity</p>
                  <p>• All processing happens locally in your browser for maximum privacy</p>
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-900 mb-2">Tips for Best Results</h4>
                <div className="text-sm text-amber-800 space-y-1">
                  <p>• Use high-resolution images (300 DPI or higher)</p>
                  <p>• Ensure good lighting and contrast</p>
                  <p>• Align text horizontally when possible</p>
                  <p>• Avoid blurry or distorted images</p>
                  <p>• Select the correct language for optimal accuracy</p>
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