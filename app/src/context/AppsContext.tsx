import { createContext, useContext, useState, type ReactNode } from 'react'
import { type LightApp, mockApps } from '../mock/data'

interface AppsContextValue {
  apps: LightApp[]
  activeApp: LightApp | null
  setActiveApp: (app: LightApp | null) => void
  addApp: (app: LightApp) => void
  deleteApp: (id: string) => void
  generatingApp: Partial<LightApp> | null
  setGeneratingApp: (app: Partial<LightApp> | null) => void
}

const AppsContext = createContext<AppsContextValue | null>(null)

export function AppsProvider({ children }: { children: ReactNode }) {
  const [apps, setApps] = useState<LightApp[]>(mockApps)
  const [activeApp, setActiveApp] = useState<LightApp | null>(null)
  const [generatingApp, setGeneratingApp] = useState<Partial<LightApp> | null>(null)

  const addApp = (app: LightApp) => setApps(prev => [app, ...prev])
  const deleteApp = (id: string) => setApps(prev => prev.filter(a => a.id !== id))

  return (
    <AppsContext.Provider value={{
      apps, activeApp, setActiveApp,
      addApp, deleteApp,
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
