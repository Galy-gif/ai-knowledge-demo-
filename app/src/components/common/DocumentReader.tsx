import { createContext, useContext, useState, type ReactNode } from 'react'
import { useTextSelection } from '../../hooks/useTextSelection'
import { useAnnotations, type AnnotationDocType, type AnnotationColor } from '../../context/AnnotationContext'
import { useUser } from '../../context/UserContext'
import SelectionMenu, { getSelectionFloatingStyle } from './SelectionMenu'
import BottomSheet from '../ui/BottomSheet'

// ── DocumentReaderContext ─────────────────────────────────────────────────────

interface DocumentReaderContextValue {
  hlTexts: string[]
  hlColors: Map<string, AnnotationColor>
}

const DocumentReaderContext = createContext<DocumentReaderContextValue>({
  hlTexts: [],
  hlColors: new Map(),
})

export function useDocumentReader() {
  return useContext(DocumentReaderContext)
}

// ── AnnotationListSheet ───────────────────────────────────────────────────────

interface AnnotationListSheetProps {
  docId: string
  docType: AnnotationDocType
  open: boolean
  onClose: () => void
}

export function AnnotationListSheet({ docId, docType, open, onClose }: AnnotationListSheetProps) {
  const { getAnnotationsByDoc, removeAnnotation } = useAnnotations()
  const { showToast } = useUser()
  const docAnnotations = getAnnotationsByDoc(docId, docType)

  return (
    <BottomSheet open={open} onClose={onClose} title={`本文标注 (${docAnnotations.length}条)`}>
      <div className="px-5 py-3">
        {docAnnotations.length === 0 ? (
          <p className="text-body text-ink-placeholder py-8 text-center">暂无标注</p>
        ) : (
          <div className="space-y-0.5">
            {docAnnotations.map(ann => {
              const dotClass =
                ann.color === 'green' ? 'bg-green-200' :
                ann.color === 'blue'  ? 'bg-blue-200'  :
                'bg-yellow-200'
              return (
                <div key={ann.id} className="flex items-center gap-3 py-3 border-b border-line-base last:border-0">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${dotClass}`} />
                  <p className="flex-1 text-body text-ink-secondary truncate">
                    {ann.text}
                  </p>
                  <button
                    onClick={() => {
                      removeAnnotation(ann.id)
                      showToast('已删除标注')
                    }}
                    className="text-caption text-red-400 flex-shrink-0"
                  >
                    删除
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </BottomSheet>
  )
}

// ── DocumentReader ────────────────────────────────────────────────────────────

interface DocumentReaderProps {
  docId: string
  docType: AnnotationDocType
  children: ReactNode
  bottomPx?: number
  className?: string
  onAction?: (action: string, text: string) => void
}

export default function DocumentReader({
  docId,
  docType,
  children,
  bottomPx = 8,
  className = 'flex-1 overflow-y-auto scrollbar-hide',
  onAction,
}: DocumentReaderProps) {
  const { addAnnotation, removeAnnotation, getAnnotationsByDoc, findOverlapping } = useAnnotations()
  const { showToast } = useUser()
  const { selection, onSelect, dismiss } = useTextSelection()

  const docAnnotations = getAnnotationsByDoc(docId, docType)
  const hlTexts = docAnnotations.map(a => a.text)
  const hlColors = new Map<string, AnnotationColor>(
    docAnnotations.map(a => [a.text, a.color])
  )

  const matchingHL = selection.visible ? findOverlapping(selection.text, docId) : undefined
  const isHighlighted = !!matchingHL

  const [pickingColor, setPickingColor] = useState(false)

  const handleSelectionAction = (action: string) => {
    switch (action) {
      case '复制':
        navigator.clipboard.writeText(selection.text).catch(() => {})
        showToast('已复制')
        dismiss()
        break
      case '高亮':
        setPickingColor(true)
        // DON'T dismiss yet — keep selection visible
        break
      case '取消高亮':
        if (matchingHL) removeAnnotation(matchingHL.id)
        showToast('已取消高亮')
        dismiss()
        break
      default:
        dismiss()
        setPickingColor(false)
        onAction?.(action, selection.text)
        break
    }
  }

  const handleColorSelect = (color: AnnotationColor) => {
    addAnnotation({
      docId,
      docType,
      type: 'highlight',
      text: selection.text,
      startOffset: 0,
      endOffset: selection.text.length,
      color,
    })
    showToast('已高亮')
    setPickingColor(false)
    dismiss()
  }

  const COLOR_OPTIONS: Array<{ color: AnnotationColor; bgClass: string; label: string }> = [
    { color: 'yellow', bgClass: 'bg-yellow-300', label: '重要' },
    { color: 'green',  bgClass: 'bg-green-300',  label: '赞同' },
    { color: 'blue',   bgClass: 'bg-blue-300',   label: '疑问' },
  ]

  return (
    <>
      <div
        className={className}
        onMouseUp={onSelect}
        onTouchEnd={onSelect}
      >
        <DocumentReaderContext.Provider value={{ hlTexts, hlColors }}>
          {children}
        </DocumentReaderContext.Provider>
      </div>

      <SelectionMenu
        visible={selection.visible && !pickingColor}
        text={selection.text}
        rect={selection.rect}
        onAction={handleSelectionAction}
        onDismiss={() => { dismiss(); setPickingColor(false) }}
        bottomPx={bottomPx}
        isHighlighted={isHighlighted}
      />

      {selection.visible && pickingColor && (
        <div className="fixed inset-0 z-30" onClick={() => { setPickingColor(false); dismiss() }}>
          <div
            className="fixed animate-selection-menu-in rounded-[12px] border-[1.5px] border-[#FF7A00] bg-white/[0.88] px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.08)] backdrop-blur-[20px] supports-[not(backdrop-filter:blur(1px))]:bg-white/[0.95]"
            style={getSelectionFloatingStyle(selection.rect, 152, 44)}
            onClick={event => event.stopPropagation()}
          >
            <div className="flex h-7 items-center gap-4">
              {COLOR_OPTIONS.map(({ color, bgClass, label }) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-[8px] transition-transform active:scale-95"
                >
                  <span className={`h-6 w-6 rounded-full ${bgClass} shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
