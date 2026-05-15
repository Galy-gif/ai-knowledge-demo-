import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  QUICK_NOTES_KB_ID,
  type KnowledgeBase,
  type FileType,
  type KnowledgeFile,
  type Team,
  mockKnowledgeBases,
  mockSubscribedKBs,
  mockFiles,
  mockTeams,
} from '../mock/data'

export type SaveSourceType =
  | 'ai-answer'
  | 'web'
  | 'document'
  | 'selection'
  | 'pdf_excerpt'
  | 'doc_excerpt'
  | 'web_excerpt'
  | 'ai_excerpt'
  | 'note_excerpt'

export interface SaveSourceContent {
  title: string
  body: string
  type: SaveSourceType
  metadata?: Record<string, unknown>
}

export interface BatchRemoveItem {
  type: 'file' | 'base'
  id: string
}

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
  updateBase: (baseId: string, patch: Partial<KnowledgeBase>) => void
  removeBase: (baseId: string) => void
  subscribeTeam: (teamId: string) => void
  unsubscribeTeam: (teamId: string) => void
  unsubscribeBase: (baseId: string) => void
  addFile: (file: KnowledgeFile) => void
  updateFile: (fileId: string, patch: Partial<KnowledgeFile>) => void
  deleteFile: (fileId: string) => void
  moveFiles: (fileIds: string[], targetKbId: string) => void
  copyFiles: (fileIds: string[], targetKbId: string) => void
  deleteFiles: (fileIds: string[]) => void
  batchRemove: (items: BatchRemoveItem[]) => void
  saveToKnowledgeBase: (content: SaveSourceContent, kbId: string) => KnowledgeFile
  appendToNote: (content: SaveSourceContent, noteId: string) => KnowledgeFile | undefined
  createNewNote: (content: SaveSourceContent) => KnowledgeFile
  quickNotesBase: KnowledgeBase
  prefillContext: { text: string; source: string } | null
  setPrefillContext: (ctx: { text: string; source: string } | null) => void
}

const KnowledgeContext = createContext<KnowledgeContextValue | null>(null)

function cleanTitle(title: string, fallback: string) {
  return title.replace(/\n/g, ' ').trim().slice(0, 36) || fallback
}

function getTitleFromContent(content: SaveSourceContent) {
  const firstLine = content.body
    .split('\n')
    .map(line => line.replace(/^#+\s*/, '').replace(/^>\s*/, '').trim())
    .find(Boolean)
  return cleanTitle(content.title || firstLine || '', content.type === 'selection' ? '划词速记' : '未命名内容')
}

function getSummary(body: string) {
  return body
    .replace(/^#+\s*/gm, '')
    .replace(/^>\s*/gm, '')
    .split('\n')
    .map(line => line.replace(/^\s*[-*>]+\s*/, '').trim())
    .find(Boolean)
    ?.slice(0, 88) || '内容已保存，可在知识库中继续编辑和引用。'
}

function typeIncludesExcerpt(type: SaveSourceType) {
  return type.endsWith('_excerpt')
}

function getFileType(type: SaveSourceType): FileType {
  if (type === 'web') return 'url'
  if (
    type === 'pdf_excerpt' ||
    type === 'doc_excerpt' ||
    type === 'web_excerpt' ||
    type === 'ai_excerpt' ||
    type === 'note_excerpt'
  ) return type
  return 'note'
}

export function KnowledgeProvider({ children }: { children: ReactNode }) {
  const [bases, setBases] = useState<KnowledgeBase[]>(mockKnowledgeBases)
  const [subscribedBases, setSubscribedBases] = useState<KnowledgeBase[]>(mockSubscribedKBs)
  const [files, setFiles] = useState<KnowledgeFile[]>(mockFiles)
  const [teams, setTeams] = useState<Team[]>(mockTeams)
  const [activeBase, setActiveBase] = useState<KnowledgeBase | null>(mockKnowledgeBases[0])
  const [askSelectedBaseIds, setAskSelectedBaseIds] = useState<string[]>([])
  const [activeFile, setActiveFile] = useState<KnowledgeFile | null>(null)
  const [prefillContext, setPrefillContext] = useState<{ text: string; source: string } | null>(null)
  const quickNotesBase = bases.find(b => b.id === QUICK_NOTES_KB_ID) ?? mockKnowledgeBases[0]

  const applyCountChanges = (changes: Record<string, number>) => {
    const updateBase = (base: KnowledgeBase) => {
      const delta = changes[base.id] ?? 0
      if (!delta) return base
      return {
        ...base,
        fileCount: Math.max(0, base.fileCount + delta),
        updatedAt: '刚刚',
      }
    }

    setBases(prev => prev.map(updateBase))
    setSubscribedBases(prev => prev.map(updateBase))
    setActiveBase(prev => prev ? updateBase(prev) : prev)
  }

  const addBase = (kb: KnowledgeBase) => {
    const normalizedKb: KnowledgeBase = {
      ...kb,
      managementMode: kb.id === QUICK_NOTES_KB_ID ? 'idea' : kb.managementMode,
    }
    setBases(prev => {
      const quickNotesIndex = prev.findIndex(base => base.id === QUICK_NOTES_KB_ID)
      if (quickNotesIndex < 0) return [...prev, normalizedKb]
      return [
        ...prev.slice(0, quickNotesIndex),
        normalizedKb,
        ...prev.slice(quickNotesIndex),
      ]
    })
    setActiveBase(normalizedKb)
  }

  const updateBase = (baseId: string, patch: Partial<KnowledgeBase>) => {
    const applyPatch = (base: KnowledgeBase) => {
      if (base.id !== baseId) return base
      const next = { ...base, ...patch, id: base.id, type: base.type }
      return base.id === QUICK_NOTES_KB_ID ? { ...next, managementMode: 'idea' as const } : next
    }

    setBases(prev => prev.map(applyPatch))
    setSubscribedBases(prev => prev.map(applyPatch))
    setActiveBase(prev => prev ? applyPatch(prev) : prev)
  }

  const removeBase = (baseId: string) => {
    if (baseId === QUICK_NOTES_KB_ID) return
    setBases(prev => prev.filter(base => base.id !== baseId))
    setFiles(prev => prev.filter(file => file.kbId !== baseId))
    setAskSelectedBaseIds(prev => prev.filter(id => id !== baseId))
    setActiveBase(prev => prev?.id === baseId ? null : prev)
    setActiveFile(prev => prev?.kbId === baseId ? null : prev)
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
            managementMode: 'free',
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

  const unsubscribeBase = (baseId: string) => {
    const base = subscribedBases.find(item => item.id === baseId)
    setSubscribedBases(prev => prev.filter(item => item.id !== baseId))
    setAskSelectedBaseIds(prev => prev.filter(id => id !== baseId))
    setActiveBase(prev => prev?.id === baseId ? null : prev)
    setActiveFile(prev => prev?.kbId === baseId ? null : prev)
    if (base) {
      setTeams(prev => prev.map(team =>
        team.name === base.name ? { ...team, isSubscribed: false } : team
      ))
    }
  }

  const unsubscribeTeam = (teamId: string) => {
    const team = teams.find(t => t.id === teamId)
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, isSubscribed: false } : t))
    setSubscribedBases(prev => prev.filter(b =>
      b.id !== `kb_${teamId}` &&
      b.id !== teamId &&
      (!team || b.name !== team.name)
    ))
  }

  const addFile = (file: KnowledgeFile) => {
    setFiles(prev => [file, ...prev])
    applyCountChanges({ [file.kbId]: 1 })
  }

  const updateFile = (fileId: string, patch: Partial<KnowledgeFile>) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, ...patch } : f))
    setActiveFile(prev => prev?.id === fileId ? { ...prev, ...patch } : prev)
  }

  const deleteFile = (fileId: string) => {
    deleteFiles([fileId])
  }

  const moveFiles = (fileIds: string[], targetKbId: string) => {
    const selected = files.filter(file => fileIds.includes(file.id))
    if (selected.length === 0) return

    const changes: Record<string, number> = {}
    selected.forEach(file => {
      if (file.kbId === targetKbId) return
      changes[file.kbId] = (changes[file.kbId] ?? 0) - 1
      changes[targetKbId] = (changes[targetKbId] ?? 0) + 1
    })

    setFiles(prev => prev.map(file =>
      fileIds.includes(file.id)
        ? { ...file, kbId: targetKbId, uploadedAt: '刚刚', updatedAt: '刚刚' }
        : file
    ))
    applyCountChanges(changes)
  }

  const copyFiles = (fileIds: string[], targetKbId: string) => {
    const selected = files.filter(file => fileIds.includes(file.id))
    if (selected.length === 0) return

    const now = Date.now()
    const copies = selected.map((file, index) => ({
      ...file,
      id: `copy_${now}_${index}`,
      kbId: targetKbId,
      uploadedAt: '刚刚',
      updatedAt: '刚刚',
    }))

    setFiles(prev => [...copies, ...prev])
    applyCountChanges({ [targetKbId]: copies.length })
  }

  const deleteFiles = (fileIds: string[]) => {
    const selected = files.filter(file => fileIds.includes(file.id))
    if (selected.length === 0) return

    const changes = selected.reduce<Record<string, number>>((acc, file) => {
      acc[file.kbId] = (acc[file.kbId] ?? 0) - 1
      return acc
    }, {})

    setFiles(prev => prev.filter(file => !fileIds.includes(file.id)))
    applyCountChanges(changes)
    setActiveFile(prev => prev && fileIds.includes(prev.id) ? null : prev)
  }

  const batchRemove = (items: BatchRemoveItem[]) => {
    const fileIds = items.filter(item => item.type === 'file').map(item => item.id)
    const baseIds = items.filter(item => item.type === 'base').map(item => item.id).filter(id => id !== QUICK_NOTES_KB_ID)

    if (fileIds.length > 0) deleteFiles(fileIds)

    const personalBaseIds = baseIds.filter(id => bases.some(base => base.id === id))
    const subscribedBaseIds = baseIds.filter(id => subscribedBases.some(base => base.id === id))

    if (personalBaseIds.length > 0) {
      setBases(prev => prev.filter(base => !personalBaseIds.includes(base.id)))
      setFiles(prev => prev.filter(file => !personalBaseIds.includes(file.kbId)))
      setAskSelectedBaseIds(prev => prev.filter(id => !personalBaseIds.includes(id)))
      setActiveBase(prev => prev && personalBaseIds.includes(prev.id) ? null : prev)
      setActiveFile(prev => prev && personalBaseIds.includes(prev.kbId) ? null : prev)
    }

    if (subscribedBaseIds.length > 0) {
      const removedNames = subscribedBases
        .filter(base => subscribedBaseIds.includes(base.id))
        .map(base => base.name)
      setSubscribedBases(prev => prev.filter(base => !subscribedBaseIds.includes(base.id)))
      setAskSelectedBaseIds(prev => prev.filter(id => !subscribedBaseIds.includes(id)))
      setActiveBase(prev => prev && subscribedBaseIds.includes(prev.id) ? null : prev)
      setActiveFile(prev => prev && subscribedBaseIds.includes(prev.kbId) ? null : prev)
      setTeams(prev => prev.map(team => removedNames.includes(team.name) ? { ...team, isSubscribed: false } : team))
    }
  }

  const saveToKnowledgeBase = (content: SaveSourceContent, kbId: string) => {
    const body = content.body.trim() || '这是一条保存内容，可在文件详情中继续编辑。'
    const file: KnowledgeFile = {
      id: `saved_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      kbId,
      name: getTitleFromContent(content),
      type: getFileType(content.type),
      size: content.type === 'web' ? '—' : `${body.length}字`,
      wordCount: body.length,
      uploadedAt: '刚刚',
      createdAt: '刚刚',
      updatedAt: '刚刚',
      tags: typeIncludesExcerpt(content.type) ? ['划线入库'] : ['保存内容'],
      summary: getSummary(body),
      content: body,
      metadata: content.metadata,
    }
    addFile(file)
    return file
  }

  const createNewNote = (content: SaveSourceContent) => {
    const body = content.body.trim() || '这是一条新的速记，可在文件详情中继续编辑。'
    const file: KnowledgeFile = {
      id: `quick_note_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      kbId: quickNotesBase.id,
      name: getTitleFromContent(content),
      type: 'note',
      size: `${body.length}字`,
      wordCount: body.length,
      uploadedAt: '刚刚',
      createdAt: '刚刚',
      updatedAt: '刚刚',
      tags: ['速记'],
      summary: getSummary(body),
      content: body,
    }
    addFile(file)
    return file
  }

  const appendToNote = (content: SaveSourceContent, noteId: string) => {
    const target = files.find(file => file.id === noteId && file.type === 'note')
    if (!target) return undefined
    const appendBody = content.body.trim() || '追加内容'
    const separator = target.content?.trim() ? '\n\n---\n\n' : ''
    const nextContent = `${target.content ?? ''}${separator}${appendBody}`
    const nextFile: KnowledgeFile = {
      ...target,
      content: nextContent,
      size: `${nextContent.length}字`,
      wordCount: nextContent.length,
      uploadedAt: '刚刚',
      updatedAt: '刚刚',
      summary: getSummary(nextContent),
    }
    updateFile(noteId, nextFile)
    applyCountChanges({ [target.kbId]: 0 })
    return nextFile
  }

  return (
    <KnowledgeContext.Provider value={{
      bases, subscribedBases, files, teams,
      activeBase, setActiveBase,
      askSelectedBaseIds, setAskSelectedBaseIds,
      activeFile, setActiveFile,
      addBase, updateBase, removeBase, subscribeTeam, unsubscribeTeam, unsubscribeBase,
      addFile, updateFile, deleteFile, moveFiles, copyFiles, deleteFiles, batchRemove,
      saveToKnowledgeBase, appendToNote, createNewNote,
      quickNotesBase,
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
