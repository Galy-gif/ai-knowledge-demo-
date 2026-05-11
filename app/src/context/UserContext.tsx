import { createContext, useContext, useState, type ReactNode } from 'react'
import { mockUser, type User } from '../mock/data'

interface UserContextValue {
  user: User
  setUser: (u: User) => void
  toast: ToastMsg | null
  showToast: (msg: string, type?: ToastMsg['type']) => void
  confirm: ConfirmConfig | null
  showConfirm: (cfg: ConfirmConfig) => void
  hideConfirm: () => void
}

export interface ToastMsg {
  id: number
  text: string
  type: 'success' | 'error' | 'info'
}

export interface ConfirmConfig {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  danger?: boolean
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(mockUser)
  const [toast, setToast] = useState<ToastMsg | null>(null)
  const [confirm, setConfirm] = useState<ConfirmConfig | null>(null)

  const showToast = (msg: string, type: ToastMsg['type'] = 'success') => {
    const id = Date.now()
    setToast({ id, text: msg, type })
    setTimeout(() => setToast(null), 2000)
  }

  const showConfirm = (cfg: ConfirmConfig) => setConfirm(cfg)
  const hideConfirm = () => setConfirm(null)

  return (
    <UserContext.Provider value={{ user, setUser, toast, showToast, confirm, showConfirm, hideConfirm }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}
