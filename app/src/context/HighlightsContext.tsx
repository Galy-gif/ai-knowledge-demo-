import { createContext, useContext, useState, type ReactNode } from 'react'

export type HighlightDocType = 'note' | 'knowledge' | 'web'

export interface Highlight {
  id: string
  docId: string
  docType: HighlightDocType
  text: string
  startOffset: number
  endOffset: number
}

interface HighlightsContextValue {
  highlights: Highlight[]
  addHighlight: (h: Omit<Highlight, 'id'>) => void
  removeHighlight: (id: string) => void
  getDocHighlights: (docId: string, docType: HighlightDocType) => Highlight[]
  findOverlapping: (text: string, docId: string) => Highlight | undefined
}

const HighlightsContext = createContext<HighlightsContextValue | null>(null)

export function HighlightsProvider({ children }: { children: ReactNode }) {
  const [highlights, setHighlights] = useState<Highlight[]>([])

  const addHighlight = (h: Omit<Highlight, 'id'>) => {
    setHighlights(prev => [...prev, { ...h, id: `hl_${Date.now()}` }])
  }

  const removeHighlight = (id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id))
  }

  const getDocHighlights = (docId: string, docType: HighlightDocType) =>
    highlights.filter(h => h.docId === docId && h.docType === docType)

  // Returns a highlight that contains or matches the selected text
  const findOverlapping = (text: string, docId: string) =>
    highlights.find(h =>
      h.docId === docId &&
      (h.text === text || h.text.includes(text) || text.includes(h.text))
    )

  return (
    <HighlightsContext.Provider value={{ highlights, addHighlight, removeHighlight, getDocHighlights, findOverlapping }}>
      {children}
    </HighlightsContext.Provider>
  )
}

export function useHighlights() {
  const ctx = useContext(HighlightsContext)
  if (!ctx) throw new Error('useHighlights must be inside HighlightsProvider')
  return ctx
}
