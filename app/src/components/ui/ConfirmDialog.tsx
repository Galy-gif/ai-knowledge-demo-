import { useUser } from '../../context/UserContext'

export default function ConfirmDialog() {
  const { confirm, hideConfirm } = useUser()
  if (!confirm) return null

  const handleConfirm = () => {
    confirm.onConfirm()
    hideConfirm()
  }

  const handleCancel = () => {
    if (confirm.onCancel) confirm.onCancel()
    hideConfirm()
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-card-xl mx-6 w-full overflow-hidden shadow-float">
        <div className="p-6 text-center">
          <h3 className="text-h2 text-ink-primary mb-2">{confirm.title}</h3>
          {confirm.description && (
            <p className="text-body text-ink-secondary">{confirm.description}</p>
          )}
        </div>
        <div className="border-t border-line-base flex">
          <button
            onClick={handleCancel}
            className="flex-1 py-4 text-body text-ink-secondary border-r border-line-base"
          >
            {confirm.cancelText || '取消'}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-4 text-body font-medium ${confirm.danger ? 'text-red-500' : 'text-brand-orange'}`}
          >
            {confirm.confirmText || '确认'}
          </button>
        </div>
      </div>
    </div>
  )
}
