import { type ReactNode } from 'react'
import Toast from '../common/Toast'
import ConfirmDialog from '../common/ConfirmDialog'

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto scrollbar-hide relative">
        {children}
      </div>
      <Toast />
      <ConfirmDialog />
    </div>
  )
}
