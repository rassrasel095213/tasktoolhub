'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Star, Zap, Shield, Download, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const tools = [
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Reduce image file sizes from MB to KB with intelligent compression algorithms.',
    icon: '🗜️',
    href: '/tools/image-compressor',
    category: 'Image Tools',
    trending: false,
    features: ['Smart compression', 'Quality control', 'Batch processing']
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to any custom dimensions while maintaining aspect ratio.',
    icon: '📐',
    href: '/tools/image-resizer',
    category: 'Image Tools',
    trending: false,
    features: ['Custom dimensions', 'Aspect ratio lock', 'Multiple formats']
  },
  {
    id: 'image-crop',
    name: 'Image Crop',
    description: 'Live preview cropping tool with custom size options and precise controls.',
    icon: '✂️',
    href: '/tools/image-crop',
    category: 'Image Tools',
    trending: true,
    features: ['Live preview', 'Custom sizes', 'Precise control']
  },
  {
    id: 'image-format-converter',
    name: 'Image Format Converter',
    description: 'Convert between different image formats seamlessly with quality preservation.',
    icon: '🔄',
    href: '/tools/image-format-converter',
    category: 'Image Tools',
    trending: false,
    features: ['Multiple formats', 'Quality preservation', 'Fast conversion']
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes instantly with live preview and 300 DPI download capability.',
    icon: '📱',
    href: '/tools/qr-generator',
    category: 'Utility Tools',
    trending: false,
    features: ['Live generation', 'High quality', 'Customizable']
  },
  {
    id: 'number-to-text',
    name: 'Number to Text Converter',
    description: 'Convert numbers to written text format in multiple languages.',
    icon: '🔢',
    href: '/tools/number-to-text',
    category: 'Utility Tools',
    trending: false,
    features: ['Multiple languages', 'Accurate conversion', 'Easy to use']
  },
  {
    id: 'image-to-text',
    name: 'Image to Text Converter (OCR)',
    description: 'Extract text from images using advanced OCR technology.',
    icon: '📝',
    href: '/tools/image-to-text',
    category: 'Utility Tools',
    trending: false,
    features: ['Advanced OCR', 'Multiple languages', 'High accuracy']
  }
]

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Image Tools', 'Utility Tools']
  
  const filteredTools = activeCategory === 'All' 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory)

  const trendingTool = tools.find(tool => tool.trending)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-900 text-white">
              <Zap className="w-3 h-3 mr-1" />
              Professional Tools Suite
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Task Tool Hub by
              <span className="text-blue-900"> Taskkora</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Professional web tools for image processing, QR code generation, and text conversion. 
              All tools work locally in your browser for maximum privacy and speed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-900 hover:bg-blue-800 text-white">
                Explore All Tools
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                View API Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-900" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Lightning Fast</p>
                <p className="text-sm text-gray-600">Instant processing</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Privacy First</p>
                <p className="text-sm text-gray-600">Local processing</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">High Quality</p>
                <p className="text-sm text-gray-600">Premium results</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-orange-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Mobile Ready</p>
                <p className="text-sm text-gray-600">Works everywhere</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Tool Section */}
      {trendingTool && (
        <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Badge className="bg-yellow-400 text-yellow-900">
                  <Star className="w-3 h-3 mr-1" />
                  Trending Tool
                </Badge>
              </div>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="text-6xl mb-4">{trendingTool.icon}</div>
                      <h2 className="text-3xl font-bold mb-4">{trendingTool.name}</h2>
                      <p className="text-white/80 text-lg mb-6">{trendingTool.description}</p>
                      <div className="space-y-2 mb-6">
                        {trendingTool.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span className="text-white/80">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-semibold">
                        Try {trendingTool.name} Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-lg blur-xl"></div>
                      <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8 text-center">
                        <div className="text-8xl mb-4">{trendingTool.icon}</div>
                        <p className="text-white/80">Live Preview</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Tools Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Professional Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our complete suite of professional tools designed to boost your productivity.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white rounded-lg border border-gray-200 p-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Card key={tool.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-4xl">{tool.icon}</div>
                    {tool.trending && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-blue-900 transition-colors">
                    {tool.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {tool.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Link href={tool.href}>
                      <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white">
                        Use Tool
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Task Tool Hub?
            </h2>
            <div className="space-y-4 text-lg text-gray-600">
              <p>
                Task Tool Hub stands at the forefront of web-based productivity tools, offering professional-grade 
                functionality right in your browser. Our commitment to excellence ensures every tool delivers 
                consistent, high-quality results.
              </p>
              <p>
                Built with modern web technologies and designed with user experience in mind, our platform 
                provides the perfect balance between power and simplicity. Whether you're compressing images, 
                generating QR codes, or converting text, Task Tool Hub delivers reliable performance every time.
              </p>
              <p>
                Join thousands of professionals who trust Taskkora's tools for their daily workflow. 
                Experience the difference that attention to detail and commitment to quality can make in 
                your productivity journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credits */}
      <section className="py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h3 className="text-xl font-bold mb-2">Task Tool Hub</h3>
              <p className="text-gray-400">Professional Web Tools Suite</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-lg font-semibold">Created by Taskkora</p>
              <p className="text-gray-400">© 2025 All rights reserved</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}