import type { ComponentType, CSSProperties } from 'react'
import { FileText, Globe2, Hash, Image as ImageIcon, Mic, PenLine, Video } from 'lucide-react'
import type { FileType } from '../mock/data'

export type VisualFileType = FileType | 'video' | string

export interface FileTypeVisual {
  label: string
  Icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number; style?: CSSProperties }>
  bg: string
  color: string
}

const VISUALS: Record<string, FileTypeVisual> = {
  pdf: {
    label: 'PDF',
    Icon: FileText,
    bg: '#E74C3C14',
    color: '#E74C3C',
  },
  doc: {
    label: 'Word',
    Icon: FileText,
    bg: '#2B7BD614',
    color: '#2B7BD6',
  },
  txt: {
    label: 'Markdown',
    Icon: Hash,
    bg: '#8B5CF614',
    color: '#8B5CF6',
  },
  url: {
    label: '网页',
    Icon: Globe2,
    bg: '#0EA5E914',
    color: '#0284C7',
  },
  image: {
    label: '图片',
    Icon: ImageIcon,
    bg: '#10B98114',
    color: '#10B981',
  },
  audio: {
    label: '音频',
    Icon: Mic,
    bg: '#7C3AED14',
    color: '#7C3AED',
  },
  note: {
    label: '速记',
    Icon: PenLine,
    bg: '#FFF1E6',
    color: '#FF7A00',
  },
  pdf_excerpt: {
    label: 'PDF 节选',
    Icon: FileText,
    bg: '#E74C3C14',
    color: '#E74C3C',
  },
  doc_excerpt: {
    label: '文档节选',
    Icon: FileText,
    bg: '#2B7BD614',
    color: '#2B7BD6',
  },
  web_excerpt: {
    label: '网页节选',
    Icon: Globe2,
    bg: '#0EA5E914',
    color: '#0284C7',
  },
  ai_excerpt: {
    label: 'AI 节选',
    Icon: PenLine,
    bg: '#FFF1E6',
    color: '#FF7A00',
  },
  note_excerpt: {
    label: '笔记节选',
    Icon: PenLine,
    bg: '#FFF1E6',
    color: '#FF7A00',
  },
  video: {
    label: '视频',
    Icon: Video,
    bg: '#B91C1C14',
    color: '#B91C1C',
  },
}

export function getFileTypeVisual(type: VisualFileType): FileTypeVisual {
  return VISUALS[type] ?? VISUALS.txt
}

export function getFileTypeColor(type: VisualFileType) {
  const { bg, color } = getFileTypeVisual(type)
  return { bg, color }
}
