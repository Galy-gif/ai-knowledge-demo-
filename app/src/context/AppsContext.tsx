import { createContext, useContext, useState, type ReactNode } from 'react'
import { type LightApp, mockApps } from '../mock/data'

interface AppsContextValue {
  apps: LightApp[]
  userApps: LightApp[]
  activeApp: LightApp | null
  setActiveApp: (app: LightApp | null) => void
  addApp: (app: LightApp) => void
  updateApp: (id: string, patch: Partial<LightApp>) => void
  deleteApp: (id: string) => void
  touchApp: (id: string) => void
  generatingApp: Partial<LightApp> | null
  setGeneratingApp: (app: Partial<LightApp> | null) => void
}

const AppsContext = createContext<AppsContextValue | null>(null)

export function AppsProvider({ children }: { children: ReactNode }) {
  const [apps, setApps] = useState<LightApp[]>(mockApps)
  const [activeApp, setActiveApp] = useState<LightApp | null>(null)
  const [generatingApp, setGeneratingApp] = useState<Partial<LightApp> | null>(null)

  const addApp = (app: LightApp) => setApps(prev => [app, ...prev])
  const updateApp = (id: string, patch: Partial<LightApp>) => {
    setApps(prev => prev.map(app => app.id === id ? { ...app, ...patch } : app))
    setActiveApp(prev => prev?.id === id ? { ...prev, ...patch } : prev)
  }
  const deleteApp = (id: string) => setApps(prev => prev.filter(a => a.id !== id))
  const touchApp = (id: string) => {
    const patch = { lastUsedAt: '刚刚', lastOpenedAt: '刚刚' }
    setApps(prev => {
      const target = prev.find(app => app.id === id)
      if (!target) return prev
      return [{ ...target, ...patch }, ...prev.filter(app => app.id !== id)]
    })
    setActiveApp(prev => prev?.id === id ? { ...prev, ...patch } : prev)
  }

  return (
    <AppsContext.Provider value={{
      apps, userApps: apps,
      activeApp, setActiveApp,
      addApp, updateApp, deleteApp, touchApp,
      generatingApp, setGeneratingApp,
    }}>
      {children}
    </AppsContext.Provider>
  )
}

export function useApps() {
  const ctx = useContext(AppsContext)
  if (!ctx) throw new Error('useApps must be inside AppsProvider')
  return ctx
}
