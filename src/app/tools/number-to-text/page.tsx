'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Copy, Download, Hash, Languages, Zap, Shield } from 'lucide-react'
import { toast } from 'sonner'

const numberToWords = (num: number, language: 'en' | 'es' | 'fr' | 'de'): string => {
  if (num === 0) {
    return language === 'en' ? 'zero' : language === 'es' ? 'cero' : language === 'fr' ? 'zéro' : 'null'
  }

  if (language === 'en') {
    return numberToWordsEnglish(num)
  } else if (language === 'es') {
    return numberToWordsSpanish(num)
  } else if (language === 'fr') {
    return numberToWordsFrench(num)
  } else {
    return numberToWordsGerman(num)
  }
}

const numberToWordsEnglish = (num: number): string => {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  const thousands = ['', 'thousand', 'million', 'billion', 'trillion']

  if (num === 0) return 'zero'
  
  let result = ''
  let thousandCounter = 0

  while (num > 0) {
    const chunk = num % 1000
    if (chunk > 0) {
      const chunkWords = convertChunkEnglish(chunk)
      if (thousandCounter > 0) {
        result = chunkWords + ' ' + thousands[thousandCounter] + ' ' + result
      } else {
        result = chunkWords + ' ' + result
      }
    }
    num = Math.floor(num / 1000)
    thousandCounter++
  }

  return result.trim()
}

const convertChunkEnglish = (num: number): string => {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

  let result = ''

  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + ' hundred'
    num %= 100
    if (num > 0) result += ' '
  }

  if (num >= 20) {
    result += tens[Math.floor(num / 10)]
    num %= 10
    if (num > 0) result += ' '
  }

  if (num >= 10) {
    result += teens[num - 10]
  } else if (num > 0) {
    result += ones[num]
  }

  return result
}

const numberToWordsSpanish = (num: number): string => {
  // Simplified Spanish number conversion
  const ones = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve']
  const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve']
  const tens = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa']
  
  if (num === 0) return 'cero'
  if (num < 10) return ones[num]
  if (num < 20) return teens[num - 10]
  if (num < 30) return num === 20 ? 'veinte' : 'veinti' + ones[num % 10]
  if (num < 100) {
    const ten = Math.floor(num / 10)
    const one = num % 10
    return tens[ten] + (one > 0 ? ' y ' + ones[one] : '')
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100)
    const rest = num % 100
    if (hundred === 1) return 'cien' + (rest > 0 ? 'to ' + numberToWordsSpanish(rest) : '')
    return ones[hundred] + 'cientos' + (rest > 0 ? ' ' + numberToWordsSpanish(rest) : '')
  }
  
  // For larger numbers, fallback to English with Spanish note
  return numberToWordsEnglish(num) + ' (en español: implementación limitada)'
}

const numberToWordsFrench = (num: number): string => {
  // Simplified French number conversion
  const ones = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf']
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf']
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix']
  
  if (num === 0) return 'zéro'
  if (num < 10) return ones[num]
  if (num < 20) return teens[num - 10]
  if (num < 100) {
    if (num < 60) {
      const ten = Math.floor(num / 10)
      const one = num % 10
      return tens[ten] + (one > 0 ? '-' + ones[one] : '')
    }
    // Simplified for 60+
    return numberToWordsEnglish(num) + ' (en français: implémentation limitée)'
  }
  
  return numberToWordsEnglish(num) + ' (en français: implémentation limitée)'
}

const numberToWordsGerman = (num: number): string => {
  // Simplified German number conversion
  const ones = ['', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun']
  const teens = ['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn']
  const tens = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig']
  
  if (num === 0) return 'null'
  if (num < 10) return ones[num]
  if (num < 20) return teens[num - 10]
  if (num < 100) {
    const ten = Math.floor(num / 10)
    const one = num % 10
    if (one === 0) return tens[ten]
    return ones[one] + 'und' + tens[ten]
  }
  
  return numberToWordsEnglish(num) + ' (auf Deutsch: begrenzte Implementierung)'
}

export default function NumberToText() {
  const [inputNumber, setInputNumber] = useState('')
  const [convertedText, setConvertedText] = useState('')
  const [language, setLanguage] = useState<'en' | 'es' | 'fr' | 'de'>('en')
  const [batchInput, setBatchInput] = useState('')
  const [batchResults, setBatchResults] = useState<Array<{number: string, text: string}>>([])

  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'es', label: 'Spanish', flag: '🇪🇸' },
    { value: 'fr', label: 'French', flag: '🇫🇷' },
    { value: 'de', label: 'German', flag: '🇩🇪' },
  ]

  const handleConvert = () => {
    const num = parseFloat(inputNumber)
    if (isNaN(num)) {
      toast.error('Please enter a valid number')
      return
    }

    if (num < 0 || num > 999999999999) {
      toast.error('Please enter a number between 0 and 999,999,999,999')
      return
    }

    const text = numberToWords(Math.floor(num), language)
    setConvertedText(text)
    toast.success('Number converted successfully!')
  }

  const handleBatchConvert = () => {
    const numbers = batchInput.split('\n').filter(n => n.trim())
    const results = numbers.map(numStr => {
      const num = parseFloat(numStr.trim())
      if (isNaN(num)) {
        return { number: numStr, text: 'Invalid number' }
      }
      const text = numberToWords(Math.floor(num), language)
      return { number: numStr, text }
    })
    setBatchResults(results)
    toast.success(`Converted ${results.length} numbers!`)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const downloadResults = () => {
    const content = batchResults.length > 0 
      ? batchResults.map(r => `${r.number} = ${r.text}`).join('\n')
      : `${inputNumber} = ${convertedText}`
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `number-to-text-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Results downloaded!')
  }

  const clearAll = () => {
    setInputNumber('')
    setConvertedText('')
    setBatchInput('')
    setBatchResults([])
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="text-5xl mr-4">🔢</div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Number to Text Converter</h1>
                <p className="text-gray-600 mt-2">Convert numbers to written text format in multiple languages</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <Languages className="w-8 h-8 text-blue-900 mx-auto mb-2" />
                <h3 className="font-semibold">Multiple Languages</h3>
                <p className="text-sm text-gray-600">English, Spanish, French, German</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Zap className="w-8 h-8 text-green-700 mx-auto mb-2" />
                <h3 className="font-semibold">Instant Conversion</h3>
                <p className="text-sm text-gray-600">Real-time processing</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Hash className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                <h3 className="font-semibold">Batch Processing</h3>
                <p className="text-sm text-gray-600">Convert multiple numbers</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tool */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hash className="w-5 h-5 mr-2" />
                Convert Numbers to Text
              </CardTitle>
              <CardDescription>
                Enter numbers to convert them to written text format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
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

              {/* Single Number Conversion */}
              <div className="space-y-4">
                <h3 className="font-medium">Single Number Conversion</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="number">Enter Number</Label>
                    <Input
                      id="number"
                      type="number"
                      value={inputNumber}
                      onChange={(e) => setInputNumber(e.target.value)}
                      placeholder="Enter a number (e.g., 1234)"
                      min="0"
                      max="999999999999"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Result</Label>
                    <div className="relative">
                      <Textarea
                        value={convertedText}
                        readOnly
                        placeholder="Converted text will appear here"
                        className="min-h-[80px] resize-none"
                      />
                      {convertedText && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => copyToClipboard(convertedText)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleConvert}
                    disabled={!inputNumber}
                    className="bg-blue-900 hover:bg-blue-800 text-white"
                  >
                    Convert Number
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setInputNumber('')
                      setConvertedText('')
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Batch Conversion */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium">Batch Conversion</h3>
                <div className="space-y-2">
                  <Label htmlFor="batch">Enter Numbers (one per line)</Label>
                  <Textarea
                    id="batch"
                    value={batchInput}
                    onChange={(e) => setBatchInput(e.target.value)}
                    placeholder="123&#10;4567&#10;89012&#10;..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleBatchConvert}
                    disabled={!batchInput}
                    variant="outline"
                  >
                    Convert Batch
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBatchInput('')
                      setBatchResults([])
                    }}
                  >
                    Clear Batch
                  </Button>
                </div>

                {/* Batch Results */}
                {batchResults.length > 0 && (
                  <div className="space-y-2">
                    <Label>Batch Results</Label>
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
                      {batchResults.map((result, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="font-mono text-sm">{result.number}</span>
                          <span className="text-sm text-gray-600">=</span>
                          <span className="text-sm flex-1 ml-2">{result.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Download Results */}
              {(convertedText || batchResults.length > 0) && (
                <div className="flex gap-2 border-t pt-4">
                  <Button
                    onClick={downloadResults}
                    className="bg-green-700 hover:bg-green-600 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Results
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearAll}
                  >
                    Clear All
                  </Button>
                </div>
              )}

              {/* Info Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Supported Features</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Numbers from 0 to 999,999,999,999</p>
                  <p>• Multiple language support (English fully implemented)</p>
                  <p>• Batch processing for multiple numbers</p>
                  <p>• Download results as text file</p>
                  <p>• Copy to clipboard functionality</p>
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