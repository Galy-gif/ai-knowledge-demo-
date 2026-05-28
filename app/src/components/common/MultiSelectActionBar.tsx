import { useState } from 'react'
import { ChevronRight, Copy, FolderInput, Inbox, Trash2 } from 'lucide-react'
import BottomSheet from '../ui/BottomSheet'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useMultiSelect } from '../../context/MultiSelectContext'
import { useUser } from '../../context/UserContext'
import { QUICK_NOTES_KB_ID } from '../../mock/data'

type SheetMode = 'move' | 'copy' | null

export default function MultiSelectActionBar() {
  const [sheetMode, setSheetMode] = useState<SheetMode>(null)
  const { bases, subscribedBases, moveFiles, copyFiles, batchRemove } = useKnowledge()
  const {
    isSelecting,
    selectedItems,
    selectedFiles,
    selectedBases,
    selectedFileIds,
    clearSelection,
  } = useMultiSelect()
  const { showToast, showConfirm } = useUser()

  if (!isSelecting) return null

  const count = selectedItems.length
  const fileCount = selectedFiles.length
  const baseCount = selectedBases.length
  const noSelection = count === 0
  const hasSystemBase = selectedBases.some(base => base.id === QUICK_NOTES_KB_ID || base.isSystem || base.locked)
  const hasBaseSelection = selectedBases.length > 0
  const fileActionsDisabled = noSelection || hasBaseSelection || selectedFileIds.length === 0
  const selectedKbIds = Array.from(new Set(selectedFiles.map(file => file.kbId)))
  const excludedKbId = selectedKbIds.length === 1 ? selectedKbIds[0] : null
  const targets = [...bases, ...subscribedBases].filter(kb => kb.id !== excludedKbId)
  const sheetTitle = sheetMode === 'move' ? '移动到哪个资料包' : '复制到哪个资料包'

  const runBatch = (targetKbId: string, targetName: string) => {
    if (sheetMode === 'move') {
      moveFiles(selectedFileIds, targetKbId)
      showToast(`已移动 ${fileCount} 项到「${targetName}」`)
    } else if (sheetMode === 'copy') {
      copyFiles(selectedFileIds, targetKbId)
      showToast(`已复制 ${fileCount} 项到「${targetName}」`)
    }
    setSheetMode(null)
    clearSelection()
  }

  const openFileAction = (mode: Exclude<SheetMode, null>) => {
    if (fileActionsDisabled) {
      showToast(noSelection ? '请先选择要操作的内容' : hasBaseSelection ? '资料包不能移动或复制到资料包里' : '请先选择文件', 'info')
      return
    }
    setSheetMode(mode)
  }

  const getDeleteDescription = () => {
    if (baseCount > 0 && fileCount > 0) {
      return `你将删除 ${baseCount} 个资料包和 ${fileCount} 个文件。资料包内的所有内容也将一并丢失。此操作无法撤销。`
    }
    if (baseCount > 0) {
      return `你将删除 ${baseCount} 个资料包。其中包含的所有内容也将一并丢失。此操作无法撤销。`
    }
    return `你将删除 ${fileCount} 个文件。此操作无法撤销。`
  }

  const confirmDelete = () => {
    if (noSelection) {
      showToast('请先选择要操作的内容', 'info')
      return
    }
    if (hasSystemBase) {
      showToast('我的速记为系统默认资料包，不可删除。请先取消勾选', 'info')
      return
    }
    showConfirm({
      title: `删除 ${count} 项？`,
      description: getDeleteDescription(),
      confirmText: '确认删除',
      danger: true,
      onConfirm: () => {
        batchRemove(selectedItems.map(item => ({ type: item.type, id: item.id })))
        showToast(`已删除 ${count} 项`)
        clearSelection()
      },
    })
  }

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      <div className="absolute left-0 right-0 bottom-0 bg-white border-t border-line-base shadow-float px-4 pt-3 pb-5 pointer-events-auto">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => openFileAction('move')}
            className={`flex flex-col items-center gap-1 py-2 rounded-card active:bg-surface-card ${
              fileActionsDisabled ? 'text-ink-placeholder' : 'text-ink-secondary'
            }`}
          >
            <FolderInput size={20} />
            <span className="text-[11px] leading-4">移动到…</span>
          </button>
          <button
            onClick={() => openFileAction('copy')}
            className={`flex flex-col items-center gap-1 py-2 rounded-card active:bg-surface-card ${
              fileActionsDisabled ? 'text-ink-placeholder' : 'text-ink-secondary'
            }`}
          >
            <Copy size={20} />
            <span className="text-[11px] leading-4">复制到…</span>
          </button>
          <button
            onClick={confirmDelete}
            className={`flex flex-col items-center gap-1 py-2 active:bg-red-50 rounded-card ${
              noSelection || hasSystemBase ? 'text-ink-placeholder' : 'text-red-500'
            }`}
          >
            <Trash2 size={20} />
            <span className="text-[11px] leading-4">删除</span>
          </button>
        </div>
      </div>

      <div className="pointer-events-auto">
        <BottomSheet
          open={sheetMode !== null}
          onClose={() => setSheetMode(null)}
          title={sheetTitle}
        >
          <div className="px-4 py-3 space-y-2">
            {targets.map(kb => (
              <button
                key={kb.id}
                onClick={() => runBatch(kb.id, kb.name)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-card border border-line-base text-left active:bg-surface-card"
              >
                <div
                  className="w-10 h-10 rounded-card flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: kb.icon === 'inbox' ? '#F8F8F8' : kb.color + '22' }}
                >
                  {kb.icon === 'pen-line' ? '✎'
                    : kb.icon === 'inbox' ? <Inbox size={20} className="text-[#9CA3AF]" />
                    : kb.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-card-title text-ink-primary truncate">{kb.name}</p>
                  <p className="text-caption text-ink-placeholder">{kb.fileCount} 个内容</p>
                </div>
                <ChevronRight size={15} className="text-ink-placeholder" />
              </button>
            ))}
          </div>
        </BottomSheet>
      </div>
    </div>
  )
}
