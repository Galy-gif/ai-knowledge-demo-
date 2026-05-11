import { CheckCircle, XCircle } from 'lucide-react'
import { useUser } from '../../context/UserContext'

export default function Toast() {
  const { toast } = useUser()
  if (!toast) return null

  return (
    <div
      className="absolute top-14 left-4 right-4 z-50"
      style={{ animation: 'slideDown 0.2s ease-out' }}
    >
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-card shadow-float
        ${toast.type === 'error' ? 'bg-red-50 border border-red-100' : 'bg-ink-primary'}`}>
        {toast.type === 'error'
          ? <XCircle size={16} className="text-red-500 flex-shrink-0" />
          : <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
        }
        <span className={`text-body ${toast.type === 'error' ? 'text-red-700' : 'text-white'}`}>
          {toast.text}
        </span>
      </div>
    </div>
  )
}
