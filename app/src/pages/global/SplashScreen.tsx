import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/ask', { replace: true }), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white">
      <div className="w-20 h-20 bg-brand-orange rounded-card-xl flex items-center justify-center mb-4 shadow-card">
        <span className="text-4xl text-white">✦</span>
      </div>
      <h1 className="text-h1 text-ink-primary">知识 AI</h1>
      <p className="text-caption text-ink-placeholder mt-2">让知识为你所用</p>
    </div>
  )
}
