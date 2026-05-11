import { createContext, useContext, useState, type ReactNode } from 'react'
import { type KnowledgeBase, type KnowledgeFile, type Team, mockKnowledgeBases, mockSubscribedKBs, mockFiles, mockTeams } from '../mock/data'

interface KnowledgeContextValue {
  bases: KnowledgeBase[]
  subscribedBases: KnowledgeBase[]
  files: KnowledgeFile[]
  teams: Team[]
  activeBase: KnowledgeBase | null
  setActiveBase: (kb: KnowledgeBase | null) => void
  askSelectedBaseIds: string[]
  setAskSelectedBaseIds: (ids: string[]) => void
  activeFile: KnowledgeFile | null
  setActiveFile: (f: KnowledgeFile | null) => void
  addBase: (kb: KnowledgeBase) => void
  subscribeTeam: (teamId: string) => void
  unsubscribeTeam: (teamId: string) => void
  addFile: (file: KnowledgeFile) => void
  deleteFile: (fileId: string) => void
  prefillContext: { text: string; source: string } | null
  setPrefillContext: (ctx: { text: string; source: string } | null) => void
}

const KnowledgeContext = createContext<KnowledgeContextValue | null>(null)

export function KnowledgeProvider({ children }: { children: ReactNode }) {
  const [bases, setBases] = useState<KnowledgeBase[]>(mockKnowledgeBases)
  const [subscribedBases, setSubscribedBases] = useState<KnowledgeBase[]>(mockSubscribedKBs)
  const [files, setFiles] = useState<KnowledgeFile[]>(mockFiles)
  const [teams, setTeams] = useState<Team[]>(mockTeams)
  const [activeBase, setActiveBase] = useState<KnowledgeBase | null>(mockKnowledgeBases[0])
  const [askSelectedBaseIds, setAskSelectedBaseIds] = useState<string[]>([])
  const [activeFile, setActiveFile] = useState<KnowledgeFile | null>(null)
  const [prefillContext, setPrefillContext] = useState<{ text: string; source: string } | null>(null)

  const addBase = (kb: KnowledgeBase) => {
    setBases(prev => [...prev, kb])
    setActiveBase(kb)
  }

  const subscribeTeam = (teamId: string) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, isSubscribed: true } : t))
    const team = teams.find(t => t.id === teamId)
    if (team) {
      const catalogKb = mockSubscribedKBs.find(kb => kb.name === team.name)
      const newKb: KnowledgeBase = catalogKb
        ? { ...catalogKb, updatedAt: '刚刚', isSubscribed: true }
        : {
            id: `kb_${teamId}`,
            name: team.name,
            icon: '🏢',
            color: '#8B5CF6',
            fileCount: team.contentCount,
            updatedAt: '刚刚',
            isSubscribed: true,
            type: 'subscribed',
          }
      setSubscribedBases(prev => {
        if (prev.some(kb => kb.id === newKb.id || kb.name === newKb.name)) {
          return prev.map(kb => kb.id === newKb.id || kb.name === newKb.name ? { ...kb, ...newKb } : kb)
        }
        return [...prev, newKb]
      })
    }
  }

  const unsubscribeTeam = (teamId: string) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, isSubscribed: false } : t))
    setSubscribedBases(prev => prev.filter(b => b.id !== `kb_${teamId}`))
  }

  const addFile = (file: KnowledgeFile) => {
    setFiles(prev => [...prev, file])
    setBases(prev => prev.map(b =>
      b.id === file.kbId ? { ...b, fileCount: b.fileCount + 1, updatedAt: '刚刚' } : b
    ))
  }
  const deleteFile = (fileId: string) => setFiles(prev => prev.filter(f => f.id !== fileId))

  return (
    <KnowledgeContext.Provider value={{
      bases, subscribedBases, files, teams,
      activeBase, setActiveBase,
      askSelectedBaseIds, setAskSelectedBaseIds,
      activeFile, setActiveFile,
      addBase, subscribeTeam, unsubscribeTeam,
      addFile, deleteFile,
      prefillContext, setPrefillContext,
    }}>
      {children}
    </KnowledgeContext.Provider>
  )
}

export function useKnowledge() {
  const ctx = useContext(KnowledgeContext)
  if (!ctx) throw new Error('useKnowledge must be inside KnowledgeProvider')
  return ctx
}
