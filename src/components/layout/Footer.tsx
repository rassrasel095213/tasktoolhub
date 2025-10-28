import Link from 'next/link'
import { Github, Twitter, Mail, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TH</span>
              </div>
              <span className="font-bold text-xl text-blue-900">Task Tool Hub</span>
            </div>
            <p className="text-gray-600 text-sm">
              Professional web tools for image processing, QR code generation, and text conversion. 
              Empowering productivity with powerful, easy-to-use tools.
            </p>
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by Taskkora</span>
            </div>
          </div>

          {/* Tools */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Image Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/image-compressor" className="text-gray-600 hover:text-blue-900 transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/image-resizer" className="text-gray-600 hover:text-blue-900 transition-colors">
                  Image Resizer
                </Link>
              </li>
              <li>
                <Link href="/tools/image-crop" className="text-gray-600 hover:text-blue-900 transition-colors">
                  Image Crop
                </Link>
              </li>
              <li>
                <Link href="/tools/image-format-converter" className="text-gray-600 hover:text-blue-900 transition-colors">
                  Format Converter
                </Link>
              </li>
            </ul>
          </div>

          {/* Utility Tools */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Utility Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/qr-generator" className="text-gray-600 hover:text-blue-900 transition-colors">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/number-to-text" className="text-gray-600 hover:text-blue-900 transition-colors">
                  Number to Text
                </Link>
              </li>
              <li>
                <Link href="/tools/image-to-text" className="text-gray-600 hover:text-blue-900 transition-colors">
                  Image to Text (OCR)
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-600 hover:text-blue-900 transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              © 2025 Task Tool Hub by Taskkora. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <a 
                href="https://github.com/rassrasel095213/tasktoolhub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-900 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-blue-900 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@taskkora.com" 
                className="text-gray-500 hover:text-blue-900 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}