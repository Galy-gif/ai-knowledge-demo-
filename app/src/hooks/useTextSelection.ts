import { useCallback, useState } from 'react'

export interface SelectionState {
  text: string
  visible: boolean
  rect?: {
    top: number
    left: number
    right: number
    bottom: number
    width: number
    height: number
  }
}

export function useTextSelection() {
  const [selection, setSelection] = useState<SelectionState>({ text: '', visible: false })

  const onSelect = useCallback(() => {
    const nativeSelection = window.getSelection()
    const sel = nativeSelection?.toString().trim() ?? ''
    if (sel.length > 2 && nativeSelection && nativeSelection.rangeCount > 0) {
      const range = nativeSelection.getRangeAt(0)
      let rect = range.getBoundingClientRect()
      if ((rect.width === 0 || rect.height === 0) && range.getClientRects().length > 0) {
        rect = range.getClientRects()[0]
      }
      setSelection({
        text: sel,
        visible: true,
        rect: {
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        },
      })
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
