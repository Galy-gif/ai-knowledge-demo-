import { useUser } from '../../context/UserContext'

export default function ConfirmDialog() {
  const { confirm, hideConfirm } = useUser()
  if (!confirm) return null

  const handleConfirm = () => {
    confirm.onConfirm()
    hideConfirm()
  }

  const handleCancel = () => {
    confirm.onCancel?.()
    hideConfirm()
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-card-xl mx-6 w-full overflow-hidden shadow-float">
        <div className="px-6 pt-6 pb-5 text-center">
          <h3 className="text-h2 text-ink-primary">{confirm.title}</h3>
          {confirm.description && (
            <p className="text-body text-ink-secondary mt-2 leading-relaxed">{confirm.description}</p>
          )}
        </div>
        <div className="flex border-t border-line-base">
          <button
            onClick={handleCancel}
            className="flex-1 py-4 text-body text-ink-secondary border-r border-line-base active:bg-surface-card transition-colors"
          >
            {confirm.cancelText ?? '取消'}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-4 text-body font-medium active:opacity-80 transition-opacity
              ${confirm.danger ? 'text-red-500' : 'text-brand-orange'}`}
          >
            {confirm.confirmText ?? '确认'}
          </button>
        </div>
      </div>
    </div>
  )
}
