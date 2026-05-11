import { CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useUser } from '../../context/UserContext'

export default function Toast() {
  const { toast } = useUser()
  if (!toast) return null

  const icons = {
    success: <CheckCircle size={16} className="text-green-500 flex-shrink-0" />,
    error: <AlertCircle size={16} className="text-red-500 flex-shrink-0" />,
    info: <Info size={16} className="text-brand-orange flex-shrink-0" />,
  }

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-ink-primary text-white text-caption px-4 py-2.5 rounded-pill shadow-float whitespace-nowrap">
        {icons[toast.type]}
        {toast.text}
      </div>
    </div>
  )
}
