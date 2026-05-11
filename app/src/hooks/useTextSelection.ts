import { useCallback, useState } from 'react'

export interface SelectionState {
  text: string
  visible: boolean
}

export function useTextSelection() {
  const [selection, setSelection] = useState<SelectionState>({ text: '', visible: false })

  const onSelect = useCallback(() => {
    const sel = window.getSelection()?.toString().trim() ?? ''
    if (sel.length > 2) {
      setSelection({ text: sel, visible: true })
    } else {
      setSelection(prev => ({ ...prev, visible: false }))
    }
  }, [])

  const dismiss = useCallback(() => {
    setSelection({ text: '', visible: false })
    window.getSelection()?.removeAllRanges()
  }, [])

  return { selection, onSelect, dismiss }
}
