'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Calculator, ArrowLeft, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [age, setAge] = useState(null)

  const calculateAge = () => {
    if (!birthDate) {
      setAge(null)
      return
    }

    const birth = new Date(birthDate)
    const current = new Date(currentDate)

    if (birth > current) {
      setAge({ error: 'Birth date cannot be in the future' })
      return
    }

    let years = current.getFullYear() - birth.getFullYear()
    let months = current.getMonth() - birth.getMonth()
    let days = current.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const lastMonth = new Date(current.getFullYear(), current.getMonth(), 0)
      days += lastMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    const totalDays = Math.floor((current - birth) / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months

    setAge({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      birthDay: birth.toLocaleDateString('en-US', { weekday: 'long' }),
      nextBirthday: calculateNextBirthday(birth, current)
    })
  }

  const calculateNextBirthday = (birthDate, currentDate) => {
    const nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate())
    
    if (nextBirthday < currentDate) {
      nextBirthday.setFullYear(currentDate.getFullYear() + 1)
    }

    const daysUntilBirthday = Math.ceil((nextBirthday - currentDate) / (1000 * 60 * 60 * 24))
    
    return {
      date: nextBirthday.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      daysLeft: daysUntilBirthday
    }
  }

  React.useEffect(() => {
    calculateAge()
  }, [birthDate, currentDate])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#0a233b] rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#0a233b]">Task Tool Hub</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-[#0288d1] transition-colors">Home</Link>
              <Link href="/tools" className="text-gray-700 hover:text-[#0288d1] transition-colors">Tools</Link>
              <Link href="/api" className="text-gray-700 hover:text-[#0288d1] transition-colors">API</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <Link href="/" className="text-gray-500 hover:text-[#0288d1]">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href="/" className="text-gray-500 hover:text-[#0288d1]">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/tools" className="text-gray-500 hover:text-[#0288d1]">Tools</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Age Calculator</span>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Age Calculator</h1>
            <p className="text-gray-600">Calculate your exact age in years, months, and days</p>
          </div>

          {/* Calculator Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                <Calendar className="w-6 h-6 text-[#0288d1]" />
                <span>Age Calculator</span>
              </CardTitle>
              <CardDescription className="text-center">
                Enter your birth date to calculate your exact age
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={currentDate}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Date
                  </label>
                  <Input
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Results */}
              {age && (
                <div className="space-y-4">
                  {age.error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <div className="text-red-800">{age.error}</div>
                    </div>
                  ) : (
                    <>
                      {/* Main Age Display */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <div className="text-3xl font-bold text-blue-900 mb-2">
                          {age.years} Years, {age.months} Months, {age.days} Days
                        </div>
                        <div className="text-lg text-blue-700">
                          Total: {age.totalDays.toLocaleString()} days old
                        </div>
                      </div>

                      {/* Detailed Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900">{age.totalMonths}</div>
                            <div className="text-sm text-gray-600">Total Months</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900">{age.totalWeeks.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Total Weeks</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900">{age.totalDays.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Total Days</div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Birth Information</h3>
                            <p className="text-sm text-gray-600">
                              Born on: {age.birthDay}
                            </p>
                            <p className="text-sm text-gray-600">
                              Birth date: {new Date(birthDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Next Birthday</h3>
                            <p className="text-sm text-gray-600">
                              {age.nextBirthday.date}
                            </p>
                            <p className="text-sm text-gray-600">
                              {age.nextBirthday.daysLeft} days to go
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fun Facts */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Age Milestones</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• 1 year = 365 days</p>
                  <p>• 10 years = 3,652 days</p>
                  <p>• 25 years = 9,131 days</p>
                  <p>• 50 years = 18,262 days</p>
                  <p>• 100 years = 36,525 days</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Did You Know?</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• Average human lifespan: 79 years</p>
                  <p>• You've lived about 1/3 of your life sleeping</p>
                  <p>• Your heart beats ~100,000 times per day</p>
                  <p>• You take ~20,000 breaths per day</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a233b] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-[#0a233b]" />
                </div>
                <span className="text-xl font-bold">Task Tool Hub</span>
              </div>
              <p className="text-gray-300 mb-4">
                Professional online tools for calculations, conversions, and data analysis.
              </p>
              <p className="text-sm text-gray-400">
                © 2025 Task Tool Hub by Taskkora
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/tools" className="text-gray-300 hover:text-white transition-colors">All Tools</Link></li>
                <li><Link href="/api" className="text-gray-300 hover:text-white transition-colors">API</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>

            {/* Popular Tools */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Popular Tools</h3>
              <ul className="space-y-2">
                <li><Link href="/tools/calculator" className="text-gray-300 hover:text-white transition-colors">Calculator</Link></li>
                <li><Link href="/tools/unit-converter" className="text-gray-300 hover:text-white transition-colors">Unit Converter</Link></li>
                <li><Link href="/tools/currency" className="text-gray-300 hover:text-white transition-colors">Currency Converter</Link></li>
                <li><Link href="/tools/percentage" className="text-gray-300 hover:text-white transition-colors">Percentage Calculator</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Task Tool Hub. All rights reserved. Developed by Taskkora.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}