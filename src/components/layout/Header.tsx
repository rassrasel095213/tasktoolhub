'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Home, Settings, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tools = [
    { name: 'Image Compressor', href: '/tools/image-compressor', icon: '🗜️' },
    { name: 'Image Resizer', href: '/tools/image-resizer', icon: '📐' },
    { name: 'Image Crop', href: '/tools/image-crop', icon: '✂️' },
    { name: 'Image Format Converter', href: '/tools/image-format-converter', icon: '🔄' },
    { name: 'QR Code Generator', href: '/tools/qr-generator', icon: '📱' },
    { name: 'Number to Text', href: '/tools/number-to-text', icon: '🔢' },
    { name: 'Image to Text', href: '/tools/image-to-text', icon: '📝' },
  ]

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TH</span>
            </div>
            <span className="font-bold text-xl text-blue-900">Task Tool Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-900 transition-colors">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-900 transition-colors">
                Tools
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {tools.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">{tool.icon}</span>
                    <span className="text-gray-700">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/about" className="text-gray-700 hover:text-blue-900 transition-colors">
              About
            </Link>
            <Link href="/api" className="text-gray-700 hover:text-blue-900 transition-colors">
              API
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {filteredTools.length > 0 ? (
                    filteredTools.map((tool) => (
                      <Link
                        key={tool.name}
                        href={tool.href}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setSearchQuery('')}
                      >
                        <span className="text-xl">{tool.icon}</span>
                        <span className="text-gray-700">{tool.name}</span>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">No tools found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/"
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-900 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Tools</h3>
                  {tools.map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-xl">{tool.icon}</span>
                      <span>{tool.name}</span>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/about"
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-900 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Info className="w-5 h-5" />
                  <span>About</span>
                </Link>
                
                <Link
                  href="/api"
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-900 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>API</span>
                </Link>

                <div className="pt-4 border-t border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {searchQuery && (
                    <div className="mt-2 space-y-1">
                      {filteredTools.length > 0 ? (
                        filteredTools.map((tool) => (
                          <Link
                            key={tool.name}
                            href={tool.href}
                            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => {
                              setSearchQuery('')
                              setIsMobileMenuOpen(false)
                            }}
                          >
                            <span className="text-xl">{tool.icon}</span>
                            <span>{tool.name}</span>
                          </Link>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500">No tools found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}