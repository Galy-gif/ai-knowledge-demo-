import { createContext, useContext, useState, type ReactNode } from 'react'

export type AnnotationDocType = 'knowledge' | 'web' | 'note' | 'ai-answer'
export type AnnotationColor = 'yellow' | 'green' | 'blue'

export interface Annotation {
  id: string
  docId: string
  docType: AnnotationDocType
  type: 'highlight' | 'note'
  text: string
  startOffset: number
  endOffset: number
  color: AnnotationColor
  comment?: string
  createdAt: number
}

interface AnnotationsContextValue {
  annotations: Annotation[]
  addAnnotation: (a: Omit<Annotation, 'id' | 'createdAt'>) => void
  removeAnnotation: (id: string) => void
  updateAnnotation: (id: string, update: { color?: AnnotationColor; comment?: string }) => void
  getAnnotationsByDoc: (docId: string, docType: AnnotationDocType) => Annotation[]
  findOverlapping: (text: string, docId: string) => Annotation | undefined
}

const AnnotationsContext = createContext<AnnotationsContextValue | null>(null)

const MOCK_ANNOTATIONS: Annotation[] = [
  {
    id: 'ann1',
    docId: 'f1',
    docType: 'knowledge',
    type: 'highlight',
    text: '可溯源的 AI 回答',
    color: 'yellow',
    startOffset: 0,
    endOffset: 10,
    createdAt: Date.now(),
  },
  {
    id: 'ann2',
    docId: 'f1',
    docType: 'knowledge',
    type: 'highlight',
    text: 'AI 检索精准度仍是用户最大痛点',
    color: 'green',
    startOffset: 0,
    endOffset: 15,
    createdAt: Date.now(),
  },
  {
    id: 'ann3',
    docId: 'yourportal.ai:搜索问答产品的对话保持策略',
    docType: 'web',
    type: 'highlight',
    text: '超过 67% 的用户会进行至少一次追问',
    color: 'blue',
    startOffset: 0,
    endOffset: 18,
    createdAt: Date.now(),
  },
  {
    id: 'ann4',
    docId: 'n1',
    docType: 'note',
    type: 'highlight',
    text: '展示来源后用户对回答的采信率提升 34%',
    color: 'yellow',
    startOffset: 0,
    endOffset: 20,
    createdAt: Date.now(),
  },
]

export function AnnotationsProvider({ children }: { children: ReactNode }) {
  const [annotations, setAnnotations] = useState<Annotation[]>(MOCK_ANNOTATIONS)

  const addAnnotation = (a: Omit<Annotation, 'id' | 'createdAt'>) => {
    setAnnotations(prev => [...prev, { ...a, id: `ann_${Date.now()}`, createdAt: Date.now() }])
  }

  const removeAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id))
  }

  const updateAnnotation = (id: string, update: { color?: AnnotationColor; comment?: string }) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, ...update } : a))
  }

  const getAnnotationsByDoc = (docId: string, docType: AnnotationDocType) =>
    annotations.filter(a => a.docId === docId && a.docType === docType)

  const findOverlapping = (text: string, docId: string) =>
    annotations.find(a =>
      a.docId === docId &&
      (a.text === text || a.text.includes(text) || text.includes(a.text))
    )

  return (
    <AnnotationsContext.Provider value={{
      annotations,
      addAnnotation,
      removeAnnotation,
      updateAnnotation,
      getAnnotationsByDoc,
      findOverlapping,
    }}>
      {children}
    </AnnotationsContext.Provider>
  )
}

export function useAnnotations() {
  const ctx = useContext(AnnotationsContext)
  if (!ctx) throw new Error('useAnnotations must be inside AnnotationsProvider')
  return ctx
}
