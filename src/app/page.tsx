import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import HomePage from '@/components/HomePage'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HomePage />
      <Footer />
    </div>
  )
}