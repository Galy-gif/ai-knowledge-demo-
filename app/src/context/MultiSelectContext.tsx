import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { KnowledgeBase, KnowledgeFile } from '../mock/data'

export type MultiSelectItem =
  | { type: 'file'; id: string; file: KnowledgeFile }
  | { type: 'base'; id: string; base: KnowledgeBase }

interface MultiSelectContextValue {
  isSelecting: boolean
  selectedItems: MultiSelectItem[]
  selectedFiles: KnowledgeFile[]
  selectedBases: KnowledgeBase[]
  selectedIds: string[]
  selectedFileIds: string[]
  selectedBaseIds: string[]
  beginSelection: (file: KnowledgeFile) => void
  beginBaseSelection: (base: KnowledgeBase) => void
  toggleFile: (file: KnowledgeFile) => void
  toggleBase: (base: KnowledgeBase) => void
  replaceSelection: (files: KnowledgeFile[]) => void
  replaceItems: (items: MultiSelectItem[]) => void
  addFiles: (files: KnowledgeFile[]) => void
  addItems: (items: MultiSelectItem[]) => void
  clearSelection: () => void
  isSelected: (id: string) => boolean
}

const MultiSelectContext = createContext<MultiSelectContextValue | null>(null)

function uniqueItems(items: MultiSelectItem[]) {
  const seen = new Set<string>()
  return items.filter(item => {
    const key = `${item.type}:${item.id}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const fileItem = (file: KnowledgeFile): MultiSelectItem => ({ type: 'file', id: file.id, file })
const baseItem = (base: KnowledgeBase): MultiSelectItem => ({ type: 'base', id: base.id, base })

export function MultiSelectProvider({ children }: { children: ReactNode }) {
  const [selectedItems, setSelectedItems] = useState<MultiSelectItem[]>([])
  const selectedFiles = useMemo(
    () => selectedItems.filter((item): item is Extract<MultiSelectItem, { type: 'file' }> => item.type === 'file').map(item => item.file),
    [selectedItems],
  )
  const selectedBases = useMemo(
    () => selectedItems.filter((item): item is Extract<MultiSelectItem, { type: 'base' }> => item.type === 'base').map(item => item.base),
    [selectedItems],
  )
  const selectedIds = useMemo(() => selectedItems.map(item => item.id), [selectedItems])
  const selectedFileIds = useMemo(() => selectedFiles.map(file => file.id), [selectedFiles])
  const selectedBaseIds = useMemo(() => selectedBases.map(base => base.id), [selectedBases])
  const isSelecting = selectedItems.length > 0

  const beginSelection = (file: KnowledgeFile) => {
    setSelectedItems(prev => uniqueItems([...prev, fileItem(file)]))
  }

  const beginBaseSelection = (base: KnowledgeBase) => {
    setSelectedItems(prev => uniqueItems([...prev, baseItem(base)]))
  }

  const toggleFile = (file: KnowledgeFile) => {
    setSelectedItems(prev => (
      prev.some(item => item.type === 'file' && item.id === file.id)
        ? prev.filter(item => !(item.type === 'file' && item.id === file.id))
        : uniqueItems([...prev, fileItem(file)])
    ))
  }

  const toggleBase = (base: KnowledgeBase) => {
    setSelectedItems(prev => (
      prev.some(item => item.type === 'base' && item.id === base.id)
        ? prev.filter(item => !(item.type === 'base' && item.id === base.id))
        : uniqueItems([...prev, baseItem(base)])
    ))
  }

  const replaceSelection = (files: KnowledgeFile[]) => {
    setSelectedItems(uniqueItems(files.map(fileItem)))
  }

  const replaceItems = (items: MultiSelectItem[]) => {
    setSelectedItems(uniqueItems(items))
  }

  const addFiles = (files: KnowledgeFile[]) => {
    setSelectedItems(prev => uniqueItems([...prev, ...files.map(fileItem)]))
  }

  const addItems = (items: MultiSelectItem[]) => {
    setSelectedItems(prev => uniqueItems([...prev, ...items]))
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  const isSelected = (fileId: string) => selectedIds.includes(fileId)

  return (
    <MultiSelectContext.Provider value={{
      isSelecting,
      selectedItems,
      selectedFiles,
      selectedBases,
      selectedIds,
      selectedFileIds,
      selectedBaseIds,
      beginSelection,
      beginBaseSelection,
      toggleFile,
      toggleBase,
      replaceSelection,
      replaceItems,
      addFiles,
      addItems,
      clearSelection,
      isSelected,
    }}>
      {children}
    </MultiSelectContext.Provider>
  )
}

export function useMultiSelect() {
  const ctx = useContext(MultiSelectContext)
  if (!ctx) throw new Error('useMultiSelect must be inside MultiSelectProvider')
  return ctx
}
