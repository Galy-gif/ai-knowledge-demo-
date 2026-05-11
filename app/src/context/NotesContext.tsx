import { createContext, useContext, useState, type ReactNode } from 'react'
import { type Note, mockNotes } from '../mock/data'

interface NotesContextValue {
  notes: Note[]
  activeNote: Note | null
  setActiveNote: (n: Note | null) => void
  addNote: (note: Note) => void
  updateNote: (id: string, patch: Partial<Note>) => void
  deleteNote: (id: string) => void
  prefillContent: string
  setPrefillContent: (c: string) => void
}

const NotesContext = createContext<NotesContextValue | null>(null)

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(mockNotes)
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [prefillContent, setPrefillContent] = useState('')

  const addNote = (note: Note) => setNotes(prev => [note, ...prev])

  const updateNote = (id: string, patch: Partial<Note>) =>
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...patch } : n))

  const deleteNote = (id: string) =>
    setNotes(prev => prev.filter(n => n.id !== id))

  return (
    <NotesContext.Provider value={{
      notes, activeNote, setActiveNote,
      addNote, updateNote, deleteNote,
      prefillContent, setPrefillContent,
    }}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotes must be inside NotesProvider')
  return ctx
}
