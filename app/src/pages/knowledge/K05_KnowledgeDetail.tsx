import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Archive, ArrowDown, Award, Check, ChevronDown, ChevronLeft, ChevronRight, Eye, FileText, Folder, FolderInput, Globe2,
  ArrowRight, Inbox, Lightbulb, Mic, MoreHorizontal, Network, PenLine, Plus, Search, Sparkles, Table2, Tag, Target, Trash2, Workflow,
} from 'lucide-react'
import AskAIPanel from '../../components/common/AskAIPanel'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import LongPressActionMenu, { type LongPressMenuAction } from '../../components/common/LongPressActionMenu'
import SwipeableListItem, { type SwipeAction } from '../../components/common/SwipeableListItem'
import Toast from '../../components/common/Toast'
import BottomSheet from '../../components/ui/BottomSheet'
import { useKnowledge } from '../../context/KnowledgeContext'
import { useWatch } from '../../context/WatchContext'
import { useMultiSelect } from '../../context/MultiSelectContext'
import { useUser } from '../../context/UserContext'
import { QUICK_NOTES_KB_ID, type KnowledgeFile, type KnowledgeManagementMode } from '../../mock/data'
import { getFileTypeVisual } from '../../utils/fileTypeVisuals'

const TYPE_FILTERS = ['全部', '速记', '文档', '网页', '音频', '图片'] as const
const FILE_TYPE_LABELS: Record<KnowledgeFile['type'], string> = {
  pdf: 'PDF',
  doc: '文档',
  txt: '文本',
  url: '网页',
  image: '图片',
  audio: '音频',
  note: '速记',
  pdf_excerpt: 'PDF 节选',
  doc_excerpt: '文档节选',
  web_excerpt: '网页节选',
  ai_excerpt: 'AI 回答节选',
  note_excerpt: '笔记节选',
}

const MANAGEMENT_OPTIONS: Array<{
  id: KnowledgeManagementMode | null
  title: string
  subtitle: string
  desc: string
  keywords: string
  badge?: 'ai'
}> = [
  {
    id: 'project',
    title: 'PARA',
    subtitle: '按任务距离分类，而非主题',
    desc: '按"距离当前任务的远近"分类，适合管理频繁变化、有明确截止时间的行动资料。',
    keywords: '工作文档 · 待办事项 · 短期学习资料',
  },
  {
    id: 'second_brain',
    title: '第二大脑',
    subtitle: '宁滥勿缺地收集，事后复用',
    desc: '"宁滥勿缺"的收集策略，适合不想预先分类、先存后理的场景。',
    keywords: '随手摘录 · 灵感 · 会议记录 · 读书划线',
  },
  {
    id: 'output',
    title: 'CODE',
    subtitle: '收整提用四步，逼你从囤到用',
    desc: '强制"收 → 整 → 提 → 出"四步流程，适合那些容易"只囤不用"的资料类型，比如文章草稿、案例集、数据表。',
    keywords: '写作素材库 · 项目产出库 · 报告产出资料',
  },
  {
    id: 'idea',
    title: '卡片盒笔记法',
    subtitle: '一卡一念，链接成网',
    desc: '一卡一念加双向链接，适合需要不断产生新见解、形成网状知识体系而非线性目录的内容。',
    keywords: '学术笔记 · 主题思考 · 跨学科连接',
  },
  {
    id: 'ai',
    title: '自动整理与维护',
    subtitle: 'AI 全自动分类、链接、清理',
    desc: '适合完全不想手动维护、希望 AI 自动分类提炼清理的人，尤其是信息过载严重且对时效性要求不高的档案库。',
    keywords: '浏览器收藏夹 · 聊天记录存档 · 邮件 · RSS 订阅',
    badge: 'ai',
  },
  {
    id: null,
    title: '不选',
    subtitle: '不按任何方法整理',
    desc: '想到什么丢什么，按添加顺序排列，自己心里有数就行。',
    keywords: '零规则 · 完全自由 · 自己掌控',
  },
]

const MODE_LABELS: Record<string, string> = {
  project: 'PARA',
  second_brain: '第二大脑',
  output: '从资料变成果',
  idea: '卡片盒笔记法',
  ai: '自动整理与维护',
}

function getManagementModeLabel(mode?: KnowledgeManagementMode | null) {
  return (mode != null ? MODE_LABELS[mode] : null) ?? '选择整理方式 →'
}

const PROJECT_GROUPS = [
  {
    id: 'active',
    title: '进行中',
    count: 3,
    color: '#FF7A00',
    badgeClass: 'bg-[#FFF1E6] text-[#FF7A00]',
    items: [
      { id: 'folder_ai_browser', title: 'AI 浏览器竞品分析', subtitle: '12 篇资料 · 3 个任务', icon: Folder, color: '#FF7A00', bg: '#FFF1E6' },
      { id: 'folder_search_revamp', title: '搜索结果页改版', subtitle: '8 篇资料 · 2 个待办', icon: Folder, color: '#FF7A00', bg: '#FFF1E6' },
      { id: 'folder_cross_import', title: '跨端导入流程', subtitle: '6 篇资料 · 本周推进', icon: Folder, color: '#FF7A00', bg: '#FFF1E6' },
    ],
  },
  {
    id: 'area',
    title: '长期关注',
    count: 2,
    color: '#3B82F6',
    badgeClass: 'bg-blue-50 text-blue-600',
    items: [
      { id: 'folder_ai_trends', title: 'AI 浏览器交互趋势', subtitle: '18 篇资料 · 持续更新', icon: Globe2, color: '#2563EB', bg: '#DBEAFE' },
      { id: 'folder_mobile_km', title: '移动端知识管理范式', subtitle: '10 篇资料 · 长期跟踪', icon: FileText, color: '#2563EB', bg: '#DBEAFE' },
    ],
  },
  {
    id: 'resource',
    title: '参考资料',
    count: 3,
    color: '#10B981',
    badgeClass: 'bg-emerald-50 text-emerald-600',
    items: [
      { id: 'folder_screenshots', title: '竞品截图与录屏', subtitle: '9 个文件 · 设计参考', icon: FileText, color: '#059669', bg: '#D1FAE5' },
      { id: 'folder_papers', title: '搜索与来源追踪论文', subtitle: '5 篇文档 · 方法参考', icon: FileText, color: '#059669', bg: '#D1FAE5' },
      { id: 'folder_plugins', title: '浏览器插件调研', subtitle: '7 个网页 · 技术参考', icon: Globe2, color: '#059669', bg: '#D1FAE5' },
    ],
  },
  {
    id: 'archive',
    title: '已归档',
    count: 2,
    color: '#9CA3AF',
    badgeClass: 'bg-gray-100 text-gray-500',
    items: [
      { id: 'folder_early_interviews', title: '早期需求访谈', subtitle: '4 篇资料 · 已完成', icon: Archive, color: '#6B7280', bg: '#F3F4F6' },
      { id: 'folder_v1_review', title: 'V1 原型评审记录', subtitle: '3 个文件 · 已归档', icon: Archive, color: '#6B7280', bg: '#F3F4F6' },
    ],
  },
] as const

// ─── PARA mode folder mock files ──────────────────────────────────────────────

export interface FolderMockFile {
  id: string
  title: string
  type: KnowledgeFile['type']
  meta: string
  time: string
}

const PARA_FOLDER_FILES: Record<string, FolderMockFile[]> = {
  folder_ai_browser: [
    { id: 'fab_1', title: 'Arc 浏览器架构分析.pdf', type: 'pdf', meta: 'PDF · 18 页', time: '今天' },
    { id: 'fab_2', title: '用户访谈 - 浏览器使用习惯.txt', type: 'txt', meta: '文本 · 4200 字', time: '昨天' },
    { id: 'fab_3', title: '竞品功能对比表.docx', type: 'doc', meta: 'Word · 12 页', time: '3 天前' },
    { id: 'fab_4', title: '关键技术调研.pdf', type: 'pdf', meta: 'PDF · 22 页', time: '4 天前' },
    { id: 'fab_5', title: '移动端浏览器现状.docx', type: 'doc', meta: 'Word · 8 页', time: '5 天前' },
    { id: 'fab_6', title: '用户研究方法论.pdf', type: 'pdf', meta: 'PDF · 16 页', time: '1 周前' },
    { id: 'fab_7', title: 'Arc 产品体验录音.m4a', type: 'audio', meta: '音频 · 28 分钟', time: '1 周前' },
    { id: 'fab_8', title: 'AI 浏览器市场趋势', type: 'url', meta: '网页 · 36Tech', time: '2 周前' },
    { id: 'fab_9', title: '搜索体验截图合集', type: 'image', meta: '图片 · 24 张', time: '2 周前' },
    { id: 'fab_10', title: '竞品导航分析.pdf', type: 'pdf', meta: 'PDF · 10 页', time: '3 周前' },
    { id: 'fab_11', title: '浏览器用户画像洞察.docx', type: 'doc', meta: 'Word · 14 页', time: '3 周前' },
    { id: 'fab_12', title: '下一代浏览器交互模式', type: 'url', meta: '网页 · Medium', time: '1 个月前' },
  ],
  folder_search_revamp: [
    { id: 'fsr_1', title: '搜索结果页现状截图', type: 'image', meta: '图片 · 8 张', time: '今天' },
    { id: 'fsr_2', title: '用户反馈整理.txt', type: 'txt', meta: '文本 · 1800 字', time: '昨天' },
    { id: 'fsr_3', title: '来源卡片设计方案.docx', type: 'doc', meta: 'Word · 9 页', time: '3 天前' },
    { id: 'fsr_4', title: '搜索交互参考 - Perplexity', type: 'url', meta: '网页 · Perplexity', time: '4 天前' },
    { id: 'fsr_5', title: '流式输出技术调研.pdf', type: 'pdf', meta: 'PDF · 12 页', time: '5 天前' },
    { id: 'fsr_6', title: '结果页设计评审录音.m4a', type: 'audio', meta: '音频 · 42 分钟', time: '1 周前' },
    { id: 'fsr_7', title: '竞品搜索结果对比.docx', type: 'doc', meta: 'Word · 15 页', time: '1 周前' },
    { id: 'fsr_8', title: '高保真原型 v2', type: 'image', meta: '图片 · 12 张', time: '2 周前' },
  ],
  folder_cross_import: [
    { id: 'fci_1', title: '跨端导入流程图', type: 'image', meta: '图片 · 6 张', time: '今天' },
    { id: 'fci_2', title: '剪贴板来源方案.docx', type: 'doc', meta: 'Word · 7 页', time: '昨天' },
    { id: 'fci_3', title: '最近浏览导入调研.txt', type: 'txt', meta: '文本 · 2200 字', time: '3 天前' },
    { id: 'fci_4', title: '系统分享菜单集成.pdf', type: 'pdf', meta: 'PDF · 8 页', time: '4 天前' },
    { id: 'fci_5', title: '跨端同步技术选型.docx', type: 'doc', meta: 'Word · 11 页', time: '1 周前' },
    { id: 'fci_6', title: '导入功能用户测试录音.m4a', type: 'audio', meta: '音频 · 35 分钟', time: '2 周前' },
  ],
  folder_ai_trends: [
    { id: 'fat_1', title: 'AI 原生浏览器分析报告.pdf', type: 'pdf', meta: 'PDF · 32 页', time: '今天' },
    { id: 'fat_2', title: 'Arc Search 深度拆解', type: 'url', meta: '网页 · The Verge', time: '昨天' },
    { id: 'fat_3', title: '侧边栏 AI 助手模式对比.docx', type: 'doc', meta: 'Word · 14 页', time: '3 天前' },
    { id: 'fat_4', title: 'AI 浏览器用户调研 Q2.pdf', type: 'pdf', meta: 'PDF · 20 页', time: '5 天前' },
    { id: 'fat_5', title: '检索增强生成技术白皮书.pdf', type: 'pdf', meta: 'PDF · 28 页', time: '1 周前' },
    { id: 'fat_6', title: 'Perplexity 功能演进记录', type: 'url', meta: '网页 · TechCrunch', time: '2 周前' },
    { id: 'fat_7', title: 'AI 浏览器竞品矩阵 2026.docx', type: 'doc', meta: 'Word · 18 页', time: '3 周前' },
    { id: 'fat_8', title: '语义搜索原理笔记', type: 'note', meta: '速记 · 1600 字', time: '3 周前' },
    { id: 'fat_9', title: '未来浏览器交互预测', type: 'url', meta: '网页 · a16z', time: '1 个月前' },
  ],
  folder_mobile_km: [
    { id: 'fmk_1', title: '移动端知识管理现状扫描.pdf', type: 'pdf', meta: 'PDF · 22 页', time: '昨天' },
    { id: 'fmk_2', title: 'Readwise 产品拆解', type: 'url', meta: '网页 · Product Hunt', time: '3 天前' },
    { id: 'fmk_3', title: '移动端收藏行为研究.docx', type: 'doc', meta: 'Word · 16 页', time: '1 周前' },
    { id: 'fmk_4', title: '知识闭环的核心路径', type: 'note', meta: '速记 · 2100 字', time: '1 周前' },
    { id: 'fmk_5', title: 'Notion Mobile 用户访谈.m4a', type: 'audio', meta: '音频 · 51 分钟', time: '2 周前' },
    { id: 'fmk_6', title: '移动端知识管理产品矩阵.docx', type: 'doc', meta: 'Word · 12 页', time: '3 周前' },
    { id: 'fmk_7', title: '从手机到电脑的工作流调研.pdf', type: 'pdf', meta: 'PDF · 18 页', time: '1 个月前' },
  ],
  folder_screenshots: [
    { id: 'fsc_1', title: 'Arc 搜索界面截图合集', type: 'image', meta: '图片 · 18 张', time: '今天' },
    { id: 'fsc_2', title: 'Perplexity 结果页对比截图', type: 'image', meta: '图片 · 12 张', time: '昨天' },
    { id: 'fsc_3', title: '移动端竞品录屏合集.m4a', type: 'audio', meta: '音频 · 4 段', time: '3 天前' },
    { id: 'fsc_4', title: 'Google 搜索新版截图', type: 'image', meta: '图片 · 9 张', time: '5 天前' },
    { id: 'fsc_5', title: 'Brave Search 体验录屏.m4a', type: 'audio', meta: '音频 · 2 段', time: '1 周前' },
    { id: 'fsc_6', title: '设计参考标注图', type: 'image', meta: '图片 · 6 张', time: '2 周前' },
    { id: 'fsc_7', title: 'AI 结果页视觉对比', type: 'image', meta: '图片 · 15 张', time: '2 周前' },
    { id: 'fsc_8', title: '交互细节对比合集', type: 'image', meta: '图片 · 21 张', time: '3 周前' },
    { id: 'fsc_9', title: '暗色模式设计参考', type: 'image', meta: '图片 · 8 张', time: '1 个月前' },
  ],
  folder_papers: [
    { id: 'fpa_1', title: 'Dense Passage Retrieval 论文.pdf', type: 'pdf', meta: 'PDF · 16 页', time: '3 天前' },
    { id: 'fpa_2', title: 'RAG 综述 2025.pdf', type: 'pdf', meta: 'PDF · 38 页', time: '1 周前' },
    { id: 'fpa_3', title: '信息溯源与可解释性研究.pdf', type: 'pdf', meta: 'PDF · 24 页', time: '2 周前' },
    { id: 'fpa_4', title: '语义搜索精准率评估方法.pdf', type: 'pdf', meta: 'PDF · 20 页', time: '3 周前' },
    { id: 'fpa_5', title: '多模态检索前沿进展.pdf', type: 'pdf', meta: 'PDF · 32 页', time: '1 个月前' },
  ],
  folder_plugins: [
    { id: 'fpl_1', title: 'Kagi 插件功能拆解', type: 'url', meta: '网页 · TechCrunch', time: '昨天' },
    { id: 'fpl_2', title: 'Readwise Reader 插件测评', type: 'url', meta: '网页 · Product Hunt', time: '3 天前' },
    { id: 'fpl_3', title: '浏览器插件架构分析.pdf', type: 'pdf', meta: 'PDF · 14 页', time: '5 天前' },
    { id: 'fpl_4', title: 'Chrome 插件市场调研.docx', type: 'doc', meta: 'Word · 10 页', time: '1 周前' },
    { id: 'fpl_5', title: 'AI 助手类插件对比.docx', type: 'doc', meta: 'Word · 8 页', time: '2 周前' },
    { id: 'fpl_6', title: '插件权限模型设计', type: 'url', meta: '网页 · Chrome Dev', time: '3 周前' },
    { id: 'fpl_7', title: '端侧兴趣库插件 PoC', type: 'url', meta: '网页 · GitHub', time: '1 个月前' },
  ],
  folder_early_interviews: [
    { id: 'fei_1', title: '早期用户访谈 01.m4a', type: 'audio', meta: '音频 · 44 分钟', time: '2 个月前' },
    { id: 'fei_2', title: '访谈纪要汇总.docx', type: 'doc', meta: 'Word · 18 页', time: '2 个月前' },
    { id: 'fei_3', title: '用户痛点分析.pdf', type: 'pdf', meta: 'PDF · 12 页', time: '3 个月前' },
    { id: 'fei_4', title: '早期原型反馈整理.txt', type: 'txt', meta: '文本 · 3200 字', time: '3 个月前' },
  ],
  folder_v1_review: [
    { id: 'fvr_1', title: 'V1 原型录屏 01.m4a', type: 'audio', meta: '音频 · 18 分钟', time: '3 个月前' },
    { id: 'fvr_2', title: '设计评审会议纪要.docx', type: 'doc', meta: 'Word · 8 页', time: '3 个月前' },
    { id: 'fvr_3', title: 'V1 交互问题清单.txt', type: 'txt', meta: '文本 · 2600 字', time: '4 个月前' },
  ],
}

// ─── Second Brain mode static mock data ───────────────────────────────────────

interface SBCard {
  id: string
  title: string
  subtitle: string
  time: string
}

interface SBGroup {
  id: string
  label: string
  count: number
  typeLabel: string
  icon: typeof Globe2
  iconColor: string
  cards: SBCard[]
}

const SECOND_BRAIN_GROUPS: SBGroup[] = [
  {
    id: 'web',
    label: '网页',
    count: 12,
    typeLabel: '网页',
    icon: Globe2,
    iconColor: '#2563EB',
    cards: [
      { id: 'sb_w1', title: 'AI Native 浏览器的未来', subtitle: '知乎', time: '今天' },
      { id: 'sb_w2', title: '用户访谈方法论合集', subtitle: 'Notion', time: '昨天' },
      { id: 'sb_w3', title: '竞品 Arc 的技术架构拆解', subtitle: 'Medium', time: '3 天前' },
      { id: 'sb_w4', title: '硅谷 PM 的工作日常', subtitle: '微信', time: '1 周前' },
      { id: 'sb_w5', title: 'Perplexity 产品路线图分析', subtitle: 'ProductHunt', time: '1 周前' },
    ],
  },
  {
    id: 'doc',
    label: '文档',
    count: 8,
    typeLabel: '文档',
    icon: FileText,
    iconColor: '#EF4444',
    cards: [
      { id: 'sb_d1', title: 'Q3 产品复盘.pdf', subtitle: '24 页', time: '今天' },
      { id: 'sb_d2', title: '用户访谈逐字稿.docx', subtitle: 'Word', time: '昨天' },
      { id: 'sb_d3', title: '竞品分析报告 v2.pdf', subtitle: '32 页', time: '3 天前' },
      { id: 'sb_d4', title: '增长实验手册.docx', subtitle: '18 页', time: '5 天前' },
      { id: 'sb_d5', title: '产品设计原则摘录.pdf', subtitle: '11 页', time: '1 周前' },
    ],
  },
  {
    id: 'note',
    label: '灵感与速记',
    count: 6,
    typeLabel: '速记',
    icon: PenLine,
    iconColor: '#FF7A00',
    cards: [
      { id: 'sb_n1', title: '移动端 AI 浏览器的核心矛盾：克制 vs 主动...', subtitle: '速记', time: '今天' },
      { id: 'sb_n2', title: '今天和老张聊：知识管理工具的护城河...', subtitle: '速记', time: '昨天' },
      { id: 'sb_n3', title: '想到一个新功能：划词后自动找相似内容...', subtitle: '速记', time: '2 天前' },
      { id: 'sb_n4', title: '为什么搜索框不应该在首屏正中间...', subtitle: '速记', time: '3 天前' },
      { id: 'sb_n5', title: '关于知识管理产品留存率的一些假设...', subtitle: '速记', time: '4 天前' },
    ],
  },
  {
    id: 'audio',
    label: '会议与录音',
    count: 3,
    typeLabel: '录音',
    icon: Mic,
    iconColor: '#8B5CF6',
    cards: [
      { id: 'sb_a1', title: '周会 - 产品方向讨论', subtitle: '录音 47 分钟', time: '昨天' },
      { id: 'sb_a2', title: '用户访谈 03', subtitle: '录音 32 分钟', time: '5 天前' },
      { id: 'sb_a3', title: '脑暴会议白板', subtitle: '5 张图片', time: '1 周前' },
      { id: 'sb_a4', title: '产品评审 - 导航重构', subtitle: '录音 51 分钟', time: '1 周前' },
      { id: 'sb_a5', title: 'Q3 OKR 对齐会', subtitle: '录音 38 分钟', time: '2 周前' },
    ],
  },
]

type OutputStageId = 'collecting' | 'organizing' | 'extracting' | 'finished'
type StructuredActionKind = 'project' | 'output' | 'idea' | 'ai'

interface StructuredActionTarget {
  id: string
  kind: StructuredActionKind
  title: string
  groupId?: string
  stageId?: OutputStageId
}

interface OutputStageCard {
  id: string
  title: string
  meta: string
  type: KnowledgeFile['type']
  icon: typeof FileText
  tag?: string
  tone?: 'normal' | 'active' | 'result'
  file: KnowledgeFile
}

interface OutputStage {
  id: OutputStageId
  title: string
  description: string
  badgeStyle: 'normal' | 'active' | 'done'
  items: OutputStageCard[]
}

function makeWorkflowFile(
  id: string,
  title: string,
  type: KnowledgeFile['type'],
  stage: string | undefined,
  summary: string,
  content: string,
  size = '—',
): KnowledgeFile {
  return {
    id,
    kbId: 'kb_output_review',
    name: title,
    type,
    size,
    uploadedAt: '刚刚',
    summary,
    workflowStage: stage,
    content,
  }
}

const INITIAL_OUTPUT_STAGES: OutputStage[] = [
  {
    id: 'collecting',
    title: '收集中',
    description: '刚收进来的原始资料',
    badgeStyle: 'normal',
    items: [
      {
        id: 'out_arc_review',
        title: '竞品 Arc 浏览器深度评测',
        meta: '来源：知乎',
        type: 'url',
        icon: Globe2,
        file: makeWorkflowFile(
          'out_arc_review',
          '竞品 Arc 浏览器深度评测',
          'url',
          '收集中',
          'Arc 浏览器在空间组织、命令入口和 AI 摘要上形成了差异化体验。',
          '## 竞品 Arc 浏览器深度评测\n\nArc 的核心价值在于把标签页、空间和任务上下文合并成一个工作环境。对 AI 浏览器来说，值得借鉴的是：\n\n- 以任务空间承载浏览上下文\n- 让搜索结果与页面操作形成闭环\n- 用轻量摘要降低网页阅读成本',
        ),
      },
      {
        id: 'out_interview_audio',
        title: '用户访谈录音 0312',
        meta: '时长 45 分钟',
        type: 'audio',
        icon: Mic,
        file: makeWorkflowFile(
          'out_interview_audio',
          '用户访谈录音 0312',
          'audio',
          '收集中',
          '访谈对象反复提到移动端资料沉淀困难，临时搜索结果很难复用。',
          '## 用户访谈录音 0312\n\n关键观点：用户在手机上看到有价值网页时，往往只是截图或转发给自己，后续很难整理成可复用资料。\n\n可转化为产品机会：\n\n- 一键保存当前网页\n- 自动识别网页中的观点和数据\n- 与已有兴趣库形成关联',
          '45分钟',
        ),
      },
      {
        id: 'out_q3_data',
        title: 'Q3 数据报表.xlsx',
        meta: '下载于昨天',
        type: 'doc',
        icon: Table2,
        file: makeWorkflowFile(
          'out_q3_data',
          'Q3 数据报表.xlsx',
          'doc',
          '收集中',
          'Q3 搜索转化和资料保存行为出现明显增长。',
          '## Q3 数据报表\n\n| 指标 | Q2 | Q3 | 变化 |\n|---|---|---|---|\n| 网页搜索次数 | 12.4万 | 18.7万 | +50.8% |\n| 保存到兴趣库 | 2.1万 | 4.8万 | +128.5% |\n| AI 摘要使用 | 8.6万 | 13.2万 | +53.4% |',
          'xlsx',
        ),
      },
      {
        id: 'out_market_pdf',
        title: 'AI 浏览器市场分析.pdf',
        meta: '27 页',
        type: 'pdf',
        icon: FileText,
        file: makeWorkflowFile(
          'out_market_pdf',
          'AI 浏览器市场分析.pdf',
          'pdf',
          '收集中',
          'AI 浏览器正从搜索增强转向任务执行入口。',
          '## AI 浏览器市场分析\n\n市场中的主要机会不在于替代传统浏览器，而在于把搜索、阅读、整理和执行串成连续链路。用户不只是想找到网页，更想得到可以复用的结论。',
          '27页',
        ),
      },
      {
        id: 'out_brainstorm',
        title: '团队脑暴笔记',
        meta: '5 张照片',
        type: 'image',
        icon: FileText,
        file: makeWorkflowFile(
          'out_brainstorm',
          '团队脑暴笔记',
          'image',
          '收集中',
          '团队围绕 AI 浏览器的移动端入口和资料复用展开讨论。',
          '## 团队脑暴笔记\n\n照片中记录了三个方向：移动端搜索入口、兴趣库自动沉淀、从网页生成小应用。当前最适合进入复盘报告的是“资料离成果还差几步”的工作流表达。',
          '5张照片',
        ),
      },
    ],
  },
  {
    id: 'organizing',
    title: '整理中',
    description: '分类打标后的资料',
    badgeStyle: 'normal',
    items: [
      {
        id: 'out_competitor_table',
        title: '竞品功能对比表',
        meta: '竞品分析',
        type: 'doc',
        icon: Tag,
        tag: '竞品分析',
        file: makeWorkflowFile(
          'out_competitor_table',
          '竞品功能对比表',
          'doc',
          '整理中',
          '将 Arc、Perplexity、Dia、Edge Copilot 的核心能力整理成对照表。',
          '## 竞品功能对比表\n\n| 产品 | 搜索增强 | AI 摘要 | 资料沉淀 | 移动端 |\n|---|---|---|---|---|\n| Arc | 中 | 中 | 弱 | 弱 |\n| Perplexity | 强 | 强 | 中 | 中 |\n| Dia | 中 | 强 | 中 | 待验证 |\n| Edge Copilot | 强 | 中 | 弱 | 中 |',
        ),
      },
      {
        id: 'out_pain_tags',
        title: '用户痛点归类',
        meta: '用户洞察',
        type: 'txt',
        icon: Tag,
        tag: '用户洞察',
        file: makeWorkflowFile(
          'out_pain_tags',
          '用户痛点归类',
          'txt',
          '整理中',
          '将访谈内容归为搜索中断、资料遗失、难以复用三类痛点。',
          '## 用户痛点归类\n\n- 搜索中断：用户在手机上很难持续追踪搜索线索\n- 资料遗失：截图、收藏、转发分散在多个入口\n- 难以复用：原始网页不能直接转化成报告、看板或任务',
        ),
      },
      {
        id: 'out_data_summary',
        title: '数据趋势摘要',
        meta: '市场数据',
        type: 'doc',
        icon: Tag,
        tag: '市场数据',
        file: makeWorkflowFile(
          'out_data_summary',
          '数据趋势摘要',
          'doc',
          '整理中',
          'Q3 数据显示用户保存资料和 AI 摘要行为同步增长。',
          '## 数据趋势摘要\n\nQ3 的关键变化是“搜索后保存”的比例显著上升。说明用户不再满足于即时答案，而希望把有价值的网页和结论沉淀到长期兴趣库里。',
        ),
      },
    ],
  },
  {
    id: 'extracting',
    title: '提炼中',
    description: '抽取出的核心观点',
    badgeStyle: 'active',
    items: [
      {
        id: 'out_insight_mobile',
        title: '核心结论：移动端 AI 浏览器的三个机会点',
        meta: '观点提炼',
        type: 'note',
        icon: Sparkles,
        tone: 'active',
        file: makeWorkflowFile(
          'out_insight_mobile',
          '核心结论：移动端 AI 浏览器的三个机会点',
          'note',
          '提炼中',
          '机会点包括：搜索上下文保存、网页内容结构化、从资料直接生成小应用。',
          '## 核心结论\n\n移动端 AI 浏览器的机会点不只是“更聪明的搜索”，而是让用户把浏览过程中的价值内容直接沉淀为知识和成果。\n\n三个机会点：\n\n- 搜索上下文保存\n- 网页内容结构化\n- 从资料直接生成小应用',
        ),
      },
      {
        id: 'out_insight_need',
        title: '关键洞察：用户对沉淀工具的需求',
        meta: '观点提炼',
        type: 'note',
        icon: Sparkles,
        tone: 'active',
        file: makeWorkflowFile(
          'out_insight_need',
          '关键洞察：用户对沉淀工具的需求',
          'note',
          '提炼中',
          '用户真正需要的是从网页到成果之间的自动整理桥梁。',
          '## 关键洞察\n\n用户不是缺少收藏工具，而是缺少“收藏之后自动变成可用成果”的路径。产品应把保存、整理、提炼、输出四个阶段做成可见进度。',
        ),
      },
    ],
  },
  {
    id: 'finished',
    title: '已输出',
    description: '最终成果',
    badgeStyle: 'done',
    items: [
      {
        id: 'out_final_report',
        title: 'Q3 产品复盘报告 v1.0',
        meta: '2024-10-15 完成 · 32 页 · 已分享给 3 人',
        type: 'doc',
        icon: Award,
        tone: 'result',
        file: makeWorkflowFile(
          'out_final_report',
          'Q3 产品复盘报告 v1.0',
          'doc',
          undefined,
          '从 7 篇关键资料中提炼出的季度产品复盘报告，已完成分享。',
          '## Q3 产品复盘报告 v1.0\n\n本报告基于竞品评测、用户访谈、市场分析和 Q3 数据报表整理而成。\n\n## 核心结论\n\nAI 浏览器的产品机会集中在“从浏览到沉淀再到成果”的连续工作流。当前用户已经具备搜索和收藏习惯，但缺少把资料加工成报告、看板或小应用的中间层。\n\n## 下一步\n\n- 完成移动端保存链路优化\n- 将网页搜索结果接入兴趣库\n- 在重点资料页提供一键生成成果入口',
          '32页',
        ),
      },
    ],
  },
]

const IDEA_FILTERS = [
  { id: 'all', label: '全部 42' },
  { id: '用户洞察', label: '用户洞察 12' },
  { id: 'AI 趋势', label: 'AI 趋势 8' },
  { id: '产品方法论', label: '产品方法论 6' },
  { id: '读书摘录', label: '读书摘录 9' },
  { id: '灵感闪现', label: '灵感闪现 7' },
] as const

type IdeaFilterId = typeof IDEA_FILTERS[number]['id']

interface IdeaCardData {
  id: string
  label: string
  time: string
  body: string
  related: string[]
}

const IDEA_CARDS: IdeaCardData[] = [
  {
    id: 'idea_mobile_ai_timing',
    label: '灵感',
    time: '今天',
    body: '移动端浏览器的 AI 介入时机比桌面端更克制——用户在手机上更碎片化，太重的 AI 推送会被关掉。',
    related: ['AI 浏览器交互', '用户行为研究'],
  },
  {
    id: 'idea_card_note_book',
    label: '读书摘录',
    time: '昨天',
    body: '读《卡片笔记写作法》：知识不在于收集多少，而在于能否在需要时被想起。',
    related: ['知识管理方法论'],
  },
  {
    id: 'idea_bookmark_problem',
    label: '用户洞察',
    time: '3 天前',
    body: '用户访谈发现：80% 的人会把网页存到收藏夹但再也不打开。这不是用户问题，是工具问题。',
    related: ['产品方法论', 'AI 浏览器交互', '收藏夹设计'],
  },
  {
    id: 'idea_agent_design',
    label: 'AI 趋势',
    time: '5 天前',
    body: "为什么 AI Agent 类产品很难做出来？因为我们还在用'命令-响应'的模式设计，但 Agent 需要的是'授权-自主'。",
    related: ['AI 产品设计'],
  },
  {
    id: 'idea_tool_invisible',
    label: '灵感闪现',
    time: '1 周前',
    body: '灵感：知识管理工具的最高境界是让用户感觉不到工具的存在。',
    related: [],
  },
  {
    id: 'idea_para_distance',
    label: '产品方法论',
    time: '1 周前',
    body: "PARA 方法的核心不是分类，是'离当下任务的距离'——越近越显眼。",
    related: ['知识管理方法论', 'AI 浏览器交互'],
  },
  {
    id: 'idea_second_brain',
    label: '读书摘录',
    time: '2 周前',
    body: '读《Building a Second Brain》：你不需要记住所有东西，你只需要建立一个可信赖的外部记忆系统。',
    related: ['知识管理方法论'],
  },
  {
    id: 'idea_mobile_action',
    label: '灵感',
    time: '2 周前',
    body: "移动端的核心动作是'划-收-问'，不是'点-看-存'。",
    related: ['产品方法论'],
  },
  {
    id: 'idea_ai_filter',
    label: 'AI 趋势',
    time: '3 周前',
    body: 'AI 不是给用户更多信息，是替用户筛掉多余信息。',
    related: ['AI 产品设计'],
  },
  {
    id: 'idea_save_naming',
    label: '用户洞察',
    time: '1 月前',
    body: "用户调研：把'保存'按钮换成'放进兴趣库'后，使用率提升 3 倍。命名重要。",
    related: ['产品方法论'],
  },
]

function makeIdeaFile(card: IdeaCardData, kbId: string): KnowledgeFile {
  return {
    id: card.id,
    kbId,
    name: card.body.slice(0, 22),
    type: 'note',
    size: `${card.body.length}字`,
    wordCount: card.body.length,
    uploadedAt: card.time,
    summary: card.body,
    tags: [card.label, ...card.related],
    content: `## ${card.label}\n\n${card.body}${card.related.length ? `\n\n## 关联\n\n${card.related.map(item => `- ${item}`).join('\n')}` : ''}`,
  }
}

type AIConfidence = 'high' | 'medium' | 'low'

interface AITopicItem {
  id: string
  title: string
  meta: string
  type: KnowledgeFile['type']
  icon: typeof FileText
  aiSuggestion?: string
}

interface AITopicGroup {
  id: string
  title: string
  count: number
  confidence: AIConfidence
  description: string
  weak?: boolean
  items: AITopicItem[]
}

function makeAiFile(group: AITopicGroup, item: AITopicItem, kbId: string): KnowledgeFile {
  return {
    id: item.id,
    kbId,
    name: item.title,
    type: item.type,
    size: '—',
    uploadedAt: '刚刚',
    summary: item.meta,
    aiTopic: group.title,
    aiConfidence: group.confidence,
    aiSuggestion: item.aiSuggestion,
    content: `## ${item.title}\n\n${item.meta}\n\nAI 将这条内容暂时放在「${group.title}」下。${
      item.aiSuggestion ? `\n\nAI 建议：${item.aiSuggestion}` : ''
    }`,
  }
}

function getAiGroups(reorganized: boolean): AITopicGroup[] {
  const pendingCount = reorganized ? 3 : 9
  const browserCount = reorganized ? 18 : 15
  const methodCount = reorganized ? 9 : 12

  const groups: AITopicGroup[] = [
    {
      id: 'browser',
      title: 'AI 浏览器相关',
      count: browserCount,
      confidence: 'high',
      description: '包含竞品、技术、用户研究',
      items: [
        { id: 'ai_arc_notes', title: 'Arc 搜索工作流观察', meta: '网页 · 今天整理', type: 'url', icon: Globe2 },
        { id: 'ai_browser_report', title: 'AI 浏览器市场分析.pdf', meta: 'PDF · 27 页', type: 'pdf', icon: FileText },
        { id: 'ai_mobile_interaction', title: '移动端 AI 交互记录', meta: '速记 · 用户研究', type: 'note', icon: PenLine },
        { id: 'ai_plugin_arch', title: '浏览器插件架构截图', meta: '图片 · 技术参考', type: 'image', icon: FileText },
      ],
    },
    {
      id: 'method',
      title: '产品方法论',
      count: methodCount,
      confidence: 'high',
      description: '包含框架、案例、读书摘录',
      items: [
        { id: 'ai_method_para', title: '按任务距离组织资料', meta: '读书摘录 · 方法论', type: 'note', icon: PenLine, aiSuggestion: '这条内容更适合放在「AI 浏览器相关」' },
        { id: 'ai_method_case', title: '产品复盘案例拆解', meta: '文档 · 案例', type: 'doc', icon: FileText, aiSuggestion: '这条内容更适合放在「AI 浏览器相关」' },
        { id: 'ai_method_flow', title: '从资料到成果的流程', meta: '速记 · 流程', type: 'note', icon: PenLine, aiSuggestion: '这条内容更适合放在「AI 浏览器相关」' },
        { id: 'ai_method_book', title: '第二大脑读书摘录', meta: '摘录 · 2 周前', type: 'note', icon: PenLine },
      ],
    },
    {
      id: 'insight',
      title: '用户访谈与洞察',
      count: 11,
      confidence: 'high',
      description: '包含原始访谈、归纳总结',
      items: [
        { id: 'ai_interview_0312', title: '用户访谈录音 0312', meta: '音频 · 45 分钟', type: 'audio', icon: Mic },
        { id: 'ai_interview_summary', title: '网页收藏行为归纳', meta: '总结 · 用户洞察', type: 'txt', icon: FileText },
        { id: 'ai_survey_save', title: '保存按钮命名调研', meta: '问卷 · 186 份', type: 'doc', icon: FileText },
        { id: 'ai_pain_notes', title: '移动端沉淀痛点', meta: '速记 · 昨天', type: 'note', icon: PenLine },
      ],
    },
    {
      id: 'pending',
      title: '待分类',
      count: pendingCount,
      confidence: 'low',
      description: 'AI 还没想好怎么放，等你确认一下',
      weak: true,
      items: [
        { id: 'ai_pending_screenshot', title: '临时截图 7 张', meta: '图片 · 来源不明', type: 'image', icon: FileText },
        { id: 'ai_pending_link', title: '未命名网页收藏', meta: '网页 · 需要确认', type: 'url', icon: Globe2 },
        { id: 'ai_pending_voice', title: '会议录音片段', meta: '音频 · 8 分钟', type: 'audio', icon: Mic },
      ],
    },
  ]

  return reorganized ? [groups[0], groups[2], groups[1], groups[3]] : groups
}

const AI_REORGANIZE_STEPS = ['分析中...', '识别主题...', '重新分组...']

function ManagementModeCard({
  option,
  selected,
  onClick,
}: {
  option: (typeof MANAGEMENT_OPTIONS)[number]
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full rounded-[12px] p-4 text-left border transition-all duration-150 ${
        selected
          ? 'border-[1.5px] border-[#FF7A00] bg-[#FFF1E6] shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
          : 'border-[#EEEEEE] bg-white'
      }`}
    >
      {/* Row 1: title + badge */}
      <div className="flex items-center justify-between pr-7">
        <p className="text-[15px] leading-5 font-semibold text-[#1A1A1A]">{option.title}</p>
        {option.badge === 'ai' && (
          <span className="px-2 py-[2px] rounded-full bg-[#FFF1E6] text-[11px] leading-4 font-medium text-[#FF7A00] whitespace-nowrap">
            AI 推荐
          </span>
        )}
      </div>
      {/* Row 2: subtitle (orange, the "金句") */}
      <p className="mt-1 text-[12px] leading-4 font-medium text-[#FF7A00]">{option.subtitle}</p>
      {/* Row 3: description */}
      <p className="mt-2 text-[13px] leading-[1.5] text-[#4A4A4A]">{option.desc}</p>
      {/* Row 4: keywords */}
      <p className="mt-2.5 text-[11px] leading-4 text-[#9CA3AF]">{option.keywords}</p>
      {selected && (
        <span className="absolute right-4 top-4 h-5 w-5 rounded-full bg-[#FF7A00] flex items-center justify-center">
          <Check size={14} className="text-white" strokeWidth={2.4} />
        </span>
      )}
    </button>
  )
}

function ProjectSection({
  group,
  hiddenIds,
  deletingIds,
  renamingId,
  renameValue,
  getTitle,
  onRenameChange,
  onRenameCommit,
  getActions,
  longPressDisabled,
  onItemClick,
}: {
  group: typeof PROJECT_GROUPS[number]
  hiddenIds: string[]
  deletingIds: string[]
  renamingId: string | null
  renameValue: string
  getTitle: (id: string, fallback: string) => string
  onRenameChange: (value: string) => void
  onRenameCommit: (target: StructuredActionTarget) => void
  getActions: (target: StructuredActionTarget) => { actions: LongPressMenuAction[]; extraActions?: LongPressMenuAction[] }
  longPressDisabled?: boolean
  onItemClick?: (id: string, title: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const visibleItems = group.items.filter(item => !hiddenIds.includes(`project:${group.id}:${item.title}`))

  return (
    <section className="relative overflow-hidden rounded-card border border-line-base bg-white shadow-card">
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: group.color }} />
      <button
        type="button"
        onClick={() => setExpanded(value => !value)}
        className="w-full flex items-center gap-2 px-4 py-3.5 text-left"
      >
        <span className="text-[16px] leading-5 font-semibold text-ink-primary">{group.title}</span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] leading-4 ${group.badgeClass}`}>{group.count}</span>
        <ChevronDown
          size={16}
          className={`ml-auto text-ink-placeholder transition-transform ${expanded ? '' : '-rotate-90'}`}
        />
      </button>
      {expanded && (
        <div className="border-t border-line-base">
          {visibleItems.map((item, index) => {
            const Icon = item.icon
            const itemId = `project:${group.id}:${item.title}`
            const target: StructuredActionTarget = { id: itemId, kind: 'project', groupId: group.id, title: getTitle(itemId, item.title) }
            const menu = getActions(target)
            return (
              <LongPressActionMenu
                key={item.title}
                actions={menu.actions}
                extraActions={menu.extraActions}
                disabled={longPressDisabled}
                className={`transition-all duration-200 ${
                  deletingIds.includes(itemId) ? 'max-h-0 overflow-hidden opacity-0 scale-[0.98]' : 'max-h-[72px] opacity-100 scale-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onItemClick?.(item.id, item.title)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-transform duration-100 active:scale-[0.98] active:bg-surface-card ${
                  index < group.items.length - 1 ? 'border-b border-line-base' : ''
                }`}
                >
                  <span
                    className="h-9 w-9 flex-shrink-0 rounded-[10px] flex items-center justify-center"
                    style={{ backgroundColor: item.bg }}
                  >
                    <Icon size={18} style={{ color: item.color }} />
                  </span>
                  <span className="min-w-0 flex-1">
                    {renamingId === itemId ? (
                      <InlineRenameInput
                        value={renameValue}
                        onChange={onRenameChange}
                        onCommit={() => onRenameCommit(target)}
                      />
                    ) : (
                      <span className="block truncate text-[14px] font-semibold leading-5 text-ink-primary">{target.title}</span>
                    )}
                    <span className="mt-0.5 block truncate text-[12px] leading-4 text-ink-placeholder">{item.subtitle}</span>
                  </span>
                  <ChevronRight size={15} className="flex-shrink-0 text-ink-placeholder" />
                </button>
              </LongPressActionMenu>
            )
          })}
        </div>
      )}
    </section>
  )
}

function OutputStageBadge({ stage }: { stage: OutputStage }) {
  if (stage.badgeStyle === 'done') {
    return (
      <span className="rounded-full border border-[#FF7A00] bg-white px-2 py-0.5 text-[11px] leading-4 text-[#FF7A00]">
        {stage.items.length}
      </span>
    )
  }
  return (
    <span className="rounded-full bg-[#FFF1E6] px-2 py-0.5 text-[11px] leading-4 text-[#FF7A00]">
      {stage.items.length}
    </span>
  )
}

function OutputStageConnector() {
  return (
    <div className="flex h-4 items-center justify-center">
      <div className="relative h-4 border-l border-dashed border-[#D1D5DB]">
        <ArrowDown size={12} className="absolute -bottom-1.5 -left-[6px] text-[#D1D5DB]" />
      </div>
    </div>
  )
}

function OutputStageCardView({
  card,
  result,
  title,
  renaming,
  renameValue,
  onRenameChange,
  onRenameCommit,
}: {
  card: OutputStageCard
  result: boolean
  title?: string
  renaming?: boolean
  renameValue?: string
  onRenameChange?: (value: string) => void
  onRenameCommit?: () => void
}) {
  const Icon = card.icon
  const displayTitle = title ?? card.title
  if (result) {
    return (
      <div className="flex w-full items-center gap-3 rounded-[12px] border border-[#EEEEEE] bg-white p-4 text-left shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] bg-[#FFF1E6]">
          <Award size={22} className="text-[#FF7A00]" />
        </span>
        <span className="min-w-0 flex-1">
          {renaming && onRenameChange && onRenameCommit ? (
            <InlineRenameInput value={renameValue ?? displayTitle} onChange={onRenameChange} onCommit={onRenameCommit} />
          ) : (
            <span className="block truncate text-[15px] font-semibold leading-5 text-ink-primary">{displayTitle}</span>
          )}
          <span className="mt-1 block line-clamp-2 text-[12px] leading-4 text-ink-secondary">{card.meta}</span>
        </span>
        <span className="rounded-full border border-[#FF7A00] px-3 py-1 text-[12px] font-medium leading-4 text-[#FF7A00]">
          查看
        </span>
      </div>
    )
  }

  const active = card.tone === 'active'
  return (
    <div className="h-[116px] w-[240px] rounded-[12px] border border-[#EEEEEE] bg-white p-3 text-left">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`flex flex-shrink-0 items-center justify-center rounded-[10px] ${
            active ? 'h-11 w-11 bg-[#FFF1E6]' : 'h-8 w-8 bg-[#F8F8F8]'
          }`}
        >
          <Icon size={active ? 20 : 17} className={active ? 'text-[#FF7A00]' : 'text-ink-secondary'} />
        </span>
        {card.tag && (
          <span className="rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[11px] leading-4 text-ink-secondary">
            {card.tag}
          </span>
        )}
      </div>
      {renaming && onRenameChange && onRenameCommit ? (
        <InlineRenameInput value={renameValue ?? displayTitle} onChange={onRenameChange} onCommit={onRenameCommit} />
      ) : (
        <p className="line-clamp-2 text-[13px] font-semibold leading-[1.35] text-ink-primary">{displayTitle}</p>
      )}
      <p className="mt-0.5 truncate text-[11px] leading-4 text-ink-secondary">{card.meta}</p>
    </div>
  )
}

function OutputStageSection({
  stage,
  stageIndex,
  openSwipeId,
  onSwipeOpen,
  onOpenCard,
  onAdvanceCard,
  onDeleteCard,
  hiddenIds,
  deletingIds,
  renamingId,
  renameValue,
  getTitle,
  onRenameChange,
  onRenameCommit,
  getActions,
  longPressDisabled,
}: {
  stage: OutputStage
  stageIndex: number
  openSwipeId: string | null
  onSwipeOpen: (id: string | null) => void
  onOpenCard: (stage: OutputStage, card: OutputStageCard) => void
  onAdvanceCard: (stageId: OutputStageId, cardId: string) => void
  onDeleteCard: (stageId: OutputStageId, cardId: string) => void
  hiddenIds: string[]
  deletingIds: string[]
  renamingId: string | null
  renameValue: string
  getTitle: (id: string, fallback: string) => string
  onRenameChange: (value: string) => void
  onRenameCommit: (target: StructuredActionTarget) => void
  getActions: (target: StructuredActionTarget, stageIndex: number) => { actions: LongPressMenuAction[]; extraActions?: LongPressMenuAction[] }
  longPressDisabled?: boolean
}) {
  const resultStage = stage.id === 'finished'
  const canAdvance = stageIndex < INITIAL_OUTPUT_STAGES.length - 1
  const visibleItems = stage.items.filter(card => !hiddenIds.includes(`output:${stage.id}:${card.id}`))

  return (
    <section>
      <div className="mb-2 flex h-11 items-center gap-2 px-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-semibold leading-5 text-ink-primary">{stage.title}</h2>
            <OutputStageBadge stage={{ ...stage, items: visibleItems }} />
          </div>
          <p className="mt-0.5 text-[12px] leading-4 text-ink-secondary">{stage.description}</p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F8F8] text-[#FF7A00]">
          <Plus size={16} />
        </button>
      </div>

      {resultStage ? (
        <div className="space-y-2">
          {visibleItems.map(card => {
            const itemId = `output:${stage.id}:${card.id}`
            const target: StructuredActionTarget = { id: itemId, kind: 'output', stageId: stage.id, title: getTitle(itemId, card.title) }
            const menu = getActions(target, stageIndex)
            return (
            <SwipeableListItem
              key={card.id}
              id={card.id}
              open={openSwipeId === card.id}
              onOpenChange={onSwipeOpen}
              actions={[
                {
                  id: 'delete',
                  label: '删除',
                  icon: Trash2,
                  color: '#DC2626',
                  onAction: () => onDeleteCard(stage.id, card.id),
                },
              ]}
            >
              <LongPressActionMenu
                actions={menu.actions}
                extraActions={menu.extraActions}
                disabled={longPressDisabled}
                className={`transition-all duration-200 ${
                  deletingIds.includes(itemId) ? 'max-h-0 overflow-hidden opacity-0 scale-[0.98]' : 'max-h-[96px] opacity-100 scale-100'
                }`}
              >
                <button type="button" onClick={() => onOpenCard(stage, card)} className="w-full">
                  <OutputStageCardView
                    card={card}
                    result
                    title={target.title}
                    renaming={renamingId === itemId}
                    renameValue={renameValue}
                    onRenameChange={onRenameChange}
                    onRenameCommit={() => onRenameCommit(target)}
                  />
                </button>
              </LongPressActionMenu>
            </SwipeableListItem>
            )
          })}
        </div>
      ) : (
        <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide">
          <div className="flex gap-2">
            {visibleItems.map(card => {
              const itemId = `output:${stage.id}:${card.id}`
              const target: StructuredActionTarget = { id: itemId, kind: 'output', stageId: stage.id, title: getTitle(itemId, card.title) }
              const menu = getActions(target, stageIndex)
              return (
              <SwipeableListItem
                key={card.id}
                id={card.id}
                className="w-[240px] flex-shrink-0"
                open={openSwipeId === card.id}
                onOpenChange={onSwipeOpen}
                actions={[
                  ...(canAdvance ? [{
                    id: 'advance',
                    label: '推进到下一阶段',
                    icon: ArrowDown,
                    color: '#FF7A00',
                    onAction: () => onAdvanceCard(stage.id, card.id),
                  }] : []),
                  {
                    id: 'delete',
                    label: '删除',
                    icon: Trash2,
                    color: '#DC2626',
                    onAction: () => onDeleteCard(stage.id, card.id),
                  },
                ]}
              >
                <LongPressActionMenu
                  actions={menu.actions}
                  extraActions={menu.extraActions}
                  disabled={longPressDisabled}
                  className={`transition-all duration-200 ${
                    deletingIds.includes(itemId) ? 'w-0 overflow-hidden opacity-0 scale-[0.98]' : 'w-[240px] opacity-100 scale-100'
                  }`}
                >
                  <button type="button" onClick={() => onOpenCard(stage, card)} className="w-full">
                    <OutputStageCardView
                      card={card}
                      result={false}
                      title={target.title}
                      renaming={renamingId === itemId}
                      renameValue={renameValue}
                      onRenameChange={onRenameChange}
                      onRenameCommit={() => onRenameCommit(target)}
                    />
                  </button>
                </LongPressActionMenu>
              </SwipeableListItem>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

function IdeaNetworkOverview({ onOpenNetwork }: { onOpenNetwork: () => void }) {
  return (
    <div className="mx-4 mt-3 flex h-[72px] items-center gap-3 rounded-[12px] border border-[#EEEEEE] bg-white px-4">
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold leading-5 text-ink-primary">42 张卡片，68 条关联</p>
        <p className="mt-1 line-clamp-2 text-[12px] leading-4 text-ink-secondary">
          最常被关联：用户洞察 · AI 趋势 · 产品方法论
        </p>
      </div>
      <button
        type="button"
        onClick={onOpenNetwork}
        aria-label="查看关系图"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#FFF1E6] text-[#FF7A00]"
      >
        <Network size={16} />
      </button>
    </div>
  )
}

function IdeaCard({
  card,
  onOpen,
  onRelatedClick,
  body,
  renaming,
  renameValue,
  onRenameChange,
  onRenameCommit,
}: {
  card: IdeaCardData
  onOpen: () => void
  onRelatedClick: (topic: string) => void
  body?: string
  renaming?: boolean
  renameValue?: string
  onRenameChange?: (value: string) => void
  onRenameCommit?: () => void
}) {
  const visibleRelated = card.related.slice(0, 2)
  const restCount = Math.max(0, card.related.length - visibleRelated.length)
  const displayBody = body ?? card.body

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') onOpen()
      }}
      className="w-full break-inside-avoid rounded-[12px] border border-[#EEEEEE] bg-white p-3.5 text-left active:bg-surface-card"
    >
      <p className="text-[11px] leading-4 text-[#9CA3AF]">{card.label} · {card.time}</p>
      {renaming && onRenameChange && onRenameCommit ? (
        <div className="mt-2">
          <InlineRenameInput value={renameValue ?? displayBody} onChange={onRenameChange} onCommit={onRenameCommit} />
        </div>
      ) : (
        <p className="mt-2 line-clamp-5 text-[14px] leading-[1.55] text-ink-primary">{displayBody}</p>
      )}
      {card.related.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          {visibleRelated.map(topic => (
            <button
              key={topic}
              type="button"
              onClick={event => {
                event.stopPropagation()
                onRelatedClick(topic)
              }}
              className="inline-flex max-w-full items-center gap-0.5 text-[11px] leading-4 text-[#FF7A00]"
            >
              <ArrowRight size={11} />
              <span className="truncate">{topic}</span>
            </button>
          ))}
          {restCount > 0 && (
            <span className="text-[11px] leading-4 text-[#FF7A00]">+{restCount}</span>
          )}
        </div>
      )}
    </div>
  )
}

function AIStatusCard({ onShowSuggestions, onReorganize }: { onShowSuggestions: () => void; onReorganize: () => void }) {
  return (
    <div className="mx-4 mt-3 rounded-[12px] border border-[#FFE4D0] bg-[linear-gradient(135deg,#FFF1E6_0%,#FFFFFF_100%)] p-4">
      <div className="flex items-center gap-2">
        <Sparkles size={17} className="text-[#FF7A00]" />
        <p className="text-[14px] font-semibold leading-5 text-ink-primary">AI 已为你整理了 47 条内容</p>
      </div>
      <p className="mt-2 text-[12px] leading-4 text-ink-secondary">
        识别出 4 个主题，建议归档 8 条过期内容
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onShowSuggestions}
          className="rounded-full bg-[#FF7A00] px-3.5 py-1.5 text-[12px] font-medium leading-4 text-white"
        >
          查看建议
        </button>
        <button
          type="button"
          onClick={onReorganize}
          className="rounded-full border border-[#FF7A00] bg-white px-3.5 py-1.5 text-[12px] font-medium leading-4 text-[#FF7A00]"
        >
          重新整理
        </button>
      </div>
    </div>
  )
}

function AIConfidenceBadge({ confidence }: { confidence: AIConfidence }) {
  if (confidence === 'low') {
    return (
      <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[11px] leading-4 text-[#9CA3AF]">
        AI 不确定
      </span>
    )
  }
  if (confidence === 'medium') {
    return (
      <span className="rounded-full bg-[#FFF1E6] px-2 py-0.5 text-[11px] leading-4 text-[#FF7A00]">
        一般
      </span>
    )
  }
  return (
    <span className="rounded-full bg-[#D1FAE5] px-2 py-0.5 text-[11px] leading-4 text-[#10B981]">
      高相关
    </span>
  )
}

function AITopicGroupSection({
  group,
  onOpenItem,
  hiddenIds,
  deletingIds,
  renamingId,
  renameValue,
  getTitle,
  onRenameChange,
  onRenameCommit,
  getActions,
  longPressDisabled,
}: {
  group: AITopicGroup
  onOpenItem: (group: AITopicGroup, item: AITopicItem) => void
  hiddenIds: string[]
  deletingIds: string[]
  renamingId: string | null
  renameValue: string
  getTitle: (id: string, fallback: string) => string
  onRenameChange: (value: string) => void
  onRenameCommit: (target: StructuredActionTarget) => void
  getActions: (target: StructuredActionTarget) => { actions: LongPressMenuAction[]; extraActions?: LongPressMenuAction[] }
  longPressDisabled?: boolean
}) {
  const visibleItems = group.items.filter(item => !hiddenIds.includes(`ai:${group.id}:${item.id}`))

  return (
    <section className={`rounded-[12px] border border-[#EEEEEE] ${group.weak ? 'bg-[#FAFAFA]' : 'bg-white'}`}>
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <h2 className={`text-[16px] font-semibold leading-5 ${group.weak ? 'text-[#4A4A4A]' : 'text-ink-primary'}`}>
            {group.title}
          </h2>
          <span className={`rounded-full px-2 py-0.5 text-[11px] leading-4 ${
            group.weak ? 'bg-[#F3F4F6] text-[#9CA3AF]' : 'bg-[#FFF1E6] text-[#FF7A00]'
          }`}>
            {group.count}
          </span>
          <AIConfidenceBadge confidence={group.confidence} />
        </div>
        <p className="mt-1 text-[12px] leading-4 text-ink-secondary">{group.description}</p>
      </div>

      <div className="border-t border-[#EEEEEE]">
        {visibleItems.map((item, index) => {
          const Icon = item.icon
          const itemId = `ai:${group.id}:${item.id}`
          const target: StructuredActionTarget = { id: itemId, kind: 'ai', groupId: group.id, title: getTitle(itemId, item.title) }
          const menu = getActions(target)
          return (
            <LongPressActionMenu
              key={item.id}
              actions={menu.actions}
              extraActions={menu.extraActions}
              disabled={longPressDisabled}
              className={`transition-all duration-200 ${
                deletingIds.includes(itemId) ? 'max-h-0 overflow-hidden opacity-0 scale-[0.98]' : 'max-h-[72px] opacity-100 scale-100'
              }`}
            >
              <button
                type="button"
                onClick={() => onOpenItem(group, item)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left active:bg-surface-card ${
                  index < visibleItems.length - 1 ? 'border-b border-[#EEEEEE]' : ''
                }`}
              >
                <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] ${
                  group.weak ? 'bg-white' : 'bg-[#F8F8F8]'
                }`}>
                  <Icon size={17} className={group.weak ? 'text-[#9CA3AF]' : 'text-ink-secondary'} />
                </span>
                <span className="min-w-0 flex-1">
                  {renamingId === itemId ? (
                    <InlineRenameInput
                      value={renameValue}
                      onChange={onRenameChange}
                      onCommit={() => onRenameCommit(target)}
                    />
                  ) : (
                    <span className={`block truncate text-[14px] font-semibold leading-5 ${group.weak ? 'text-[#4A4A4A]' : 'text-ink-primary'}`}>
                      {target.title}
                    </span>
                  )}
                  <span className="mt-0.5 block truncate text-[12px] leading-4 text-ink-placeholder">{item.meta}</span>
                </span>
                <ChevronRight size={15} className="flex-shrink-0 text-ink-placeholder" />
              </button>
            </LongPressActionMenu>
          )
        })}
        {!group.weak && (
          <button
            type="button"
            className="w-full px-4 py-3 text-left text-[13px] leading-5 text-ink-secondary"
          >
            查看全部 {group.count} 条 →
          </button>
        )}
      </div>
    </section>
  )
}

function AISuggestionBar({ onAccept, onIgnore }: { onAccept: () => void; onIgnore: () => void }) {
  return (
    <div className="flex items-start gap-3 rounded-[12px] bg-[#FFF1E6] p-3.5">
      <Lightbulb size={18} className="mt-0.5 flex-shrink-0 text-[#FF7A00]" />
      <p className="min-w-0 flex-1 text-[13px] leading-5 text-[#4A4A4A]">
        AI 建议：这 3 条内容更适合放在「AI 浏览器相关」
      </p>
      <div className="flex flex-shrink-0 gap-1.5">
        <button onClick={onAccept} className="rounded-full bg-[#FF7A00] px-2.5 py-1 text-[12px] leading-4 text-white">
          采纳
        </button>
        <button onClick={onIgnore} className="rounded-full bg-white px-2.5 py-1 text-[12px] leading-4 text-[#FF7A00]">
          忽略
        </button>
      </div>
    </div>
  )
}

function AIOrganizingOverlay({ step }: { step: number }) {
  const progress = `${Math.min(100, 34 + step * 33)}%`
  return (
    <div className="absolute inset-0 z-[55] flex items-center justify-center bg-black/35 px-8">
      <div className="w-full rounded-[16px] bg-white p-5 text-center shadow-sheet">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF1E6]">
          <Sparkles size={22} className="animate-pulse text-[#FF7A00]" />
        </div>
        <p className="text-[15px] font-semibold leading-5 text-ink-primary">AI 正在重新整理你的兴趣库...</p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#EEEEEE]">
          <div className="h-full rounded-full bg-[#FF7A00] transition-all duration-500" style={{ width: progress }} />
        </div>
        <p className="mt-3 text-[13px] leading-5 text-ink-secondary">{AI_REORGANIZE_STEPS[step]}</p>
      </div>
    </div>
  )
}

const EMPTY_MODE_ICONS: Record<KnowledgeManagementMode, typeof Inbox> = {
  project: Target,
  second_brain: Inbox,
  output: Workflow,
  idea: Lightbulb,
  ai: Sparkles,
  free: Inbox,
}

function KnowledgeEmptyState({
  mode,
  onAdd,
  onChooseMode,
}: {
  mode: KnowledgeManagementMode | null | undefined
  onAdd: () => void
  onChooseMode: () => void
}) {
  const hasMode = Boolean(mode)
  const Icon = mode ? EMPTY_MODE_ICONS[mode] : Inbox
  const isFree = mode === 'free'

  return (
    <div className="relative z-[var(--z-content)] flex-1 min-h-0 flex items-center justify-center px-6 bg-white">
      <div className="-translate-y-10 flex flex-col items-center text-center">
        <Icon size={96} className="text-[#D1D5DB]" strokeWidth={1.5} />
        <h2 className="mt-6 text-[16px] font-semibold leading-6 text-[#1A1A1A]">
          {hasMode && !isFree ? '准备好了' : '还没有内容'}
        </h2>
        <p className="mt-2 text-[13px] leading-5 text-[#4A4A4A]">
          {!hasMode
            ? '开始添加，或者先选个整理方式'
            : isFree
              ? '想到什么就丢进来'
              : `这个兴趣库会用「${getManagementModeLabel(mode)}」帮你整理，开始添加吧`}
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onAdd}
            className="h-10 rounded-[10px] bg-[#FF7A00] px-5 text-[14px] font-medium leading-5 text-white"
          >
            添加内容
          </button>
          {!hasMode && (
            <button
              type="button"
              onClick={onChooseMode}
              className="h-10 rounded-[10px] border border-[#FF7A00] bg-white px-5 text-[14px] font-medium leading-5 text-[#FF7A00]"
            >
              选整理方式
            </button>
          )}
        </div>
        {!hasMode && <p className="mt-10 text-[11px] leading-4 text-[#9CA3AF]">先做哪个都不影响</p>}
      </div>
    </div>
  )
}

function InlineRenameInput({
  value,
  onChange,
  onCommit,
}: {
  value: string
  onChange: (value: string) => void
  onCommit: () => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
    }
    if (event.key === 'Escape') {
      onCommit()
    }
  }

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={event => onChange(event.target.value)}
      onBlur={onCommit}
      onKeyDown={handleKeyDown}
      onClick={event => event.stopPropagation()}
      className="block w-full rounded-[8px] border border-brand-orange/60 bg-white px-2 py-1 text-[14px] font-semibold leading-5 text-ink-primary outline-none"
    />
  )
}

function FlatFileRow({
  file,
  onClick,
  onLongPress,
  longPressEnabled = true,
  isTeamShared,
  selecting,
  selected,
  isNew,
  renaming,
  renameValue,
  onRenameChange,
  onRenameCommit,
}: {
  file: KnowledgeFile
  onClick: () => void
  onLongPress: (point: { x: number; y: number }) => void
  longPressEnabled?: boolean
  isTeamShared?: boolean
  selecting: boolean
  selected: boolean
  isNew?: boolean
  renaming?: boolean
  renameValue?: string
  onRenameChange?: (value: string) => void
  onRenameCommit?: () => void
}) {
  const cfg = getFileTypeVisual(file.type)
  const { Icon } = cfg
  const pressTimer = useRef<number | null>(null)
  const didLongPress = useRef(false)
  const pressStart = useRef<{ x: number; y: number } | null>(null)
  const [pressed, setPressed] = useState(false)

  const startPress = (event: PointerEvent<HTMLButtonElement>) => {
    if (!longPressEnabled || selecting || renaming) return
    pressStart.current = { x: event.clientX, y: event.clientY }
    const rect = event.currentTarget.getBoundingClientRect()
    const point = { x: rect.right - 168, y: rect.top + 8 }
    didLongPress.current = false
    pressTimer.current = window.setTimeout(() => {
      didLongPress.current = true
      setPressed(true)
      window.setTimeout(() => setPressed(false), 160)
      onLongPress(point)
    }, 500)
  }

  const clearPress = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
    pressStart.current = null
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const start = pressStart.current
    if (!start) return
    if (Math.abs(event.clientX - start.x) > 8 || Math.abs(event.clientY - start.y) > 8) {
      clearPress()
    }
  }

  const handleClick = () => {
    if (didLongPress.current) {
      didLongPress.current = false
      return
    }
    onClick()
  }

  return (
    <button
      onPointerDown={startPress}
      onPointerMove={handlePointerMove}
      onPointerUp={clearPress}
      onPointerCancel={clearPress}
      onPointerLeave={clearPress}
      onContextMenu={event => event.preventDefault()}
      onClick={handleClick}
      className={`relative flex w-full items-center gap-3 px-4 py-3 text-left transition-all active:bg-surface-card ${
        selected ? 'bg-brand-orange/[0.04]' : 'bg-white'
      } ${pressed ? 'scale-[0.98]' : 'scale-100'}`}
    >
      {isNew && <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-brand-orange" />}
      {selecting && (
        <div className={`absolute left-2 top-2 z-10 w-6 h-6 rounded-full border flex items-center justify-center ${
          selected ? 'bg-brand-orange border-brand-orange' : 'bg-white border-[#D1D5DB]'
        }`}>
          {selected && <span className="text-[12px] font-semibold text-white leading-none">✓</span>}
        </div>
      )}
      <span
        className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px]"
        style={{ backgroundColor: cfg.bg }}
      >
        <Icon size={17} style={{ color: cfg.color }} />
        {isTeamShared && (
          <span className="absolute -top-1.5 -left-1 px-1 py-0.5 bg-brand-orange text-white text-[8px] font-semibold rounded-sm leading-none whitespace-nowrap">
            团队
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        {renaming && onRenameChange && onRenameCommit ? (
          <InlineRenameInput value={renameValue ?? file.name} onChange={onRenameChange} onCommit={onRenameCommit} />
        ) : (
          <span className="block truncate text-[14px] font-semibold leading-5 text-ink-primary">{file.name}</span>
        )}
        <span className="mt-0.5 block truncate text-[12px] leading-4 text-ink-placeholder">
          {FILE_TYPE_LABELS[file.type]} · {file.uploadedAt}
        </span>
      </span>
      <ChevronRight size={15} className="flex-shrink-0 text-ink-placeholder" />
    </button>
  )
}

function FileCard({
  file,
  onClick,
  onLongPress,
  longPressEnabled = true,
  isTeamShared,
  selecting,
  selected,
  isNew,
  renaming,
  renameValue,
  onRenameChange,
  onRenameCommit,
}: {
  file: KnowledgeFile
  onClick: () => void
  onLongPress: (point: { x: number; y: number }) => void
  longPressEnabled?: boolean
  isTeamShared?: boolean
  selecting: boolean
  selected: boolean
  isNew?: boolean
  renaming?: boolean
  renameValue?: string
  onRenameChange?: (value: string) => void
  onRenameCommit?: () => void
}) {
  const cfg = getFileTypeVisual(file.type)
  const { Icon } = cfg
  const pressTimer = useRef<number | null>(null)
  const didLongPress = useRef(false)
  const pressStart = useRef<{ x: number; y: number } | null>(null)
  const [pressed, setPressed] = useState(false)

  const startPress = (event: PointerEvent<HTMLButtonElement>) => {
    if (!longPressEnabled || selecting || renaming) return
    pressStart.current = { x: event.clientX, y: event.clientY }
    const rect = event.currentTarget.getBoundingClientRect()
    const point = { x: rect.right - 168, y: rect.top + 8 }
    didLongPress.current = false
    pressTimer.current = window.setTimeout(() => {
      didLongPress.current = true
      setPressed(true)
      window.setTimeout(() => setPressed(false), 160)
      onLongPress(point)
    }, 500)
  }

  const clearPress = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
    pressStart.current = null
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const start = pressStart.current
    if (!start) return
    if (Math.abs(event.clientX - start.x) > 8 || Math.abs(event.clientY - start.y) > 8) {
      clearPress()
    }
  }

  const handleClick = () => {
    if (didLongPress.current) {
      didLongPress.current = false
      return
    }
    onClick()
  }

  return (
    <button
      onPointerDown={startPress}
      onPointerMove={handlePointerMove}
      onPointerUp={clearPress}
      onPointerCancel={clearPress}
      onPointerLeave={clearPress}
      onContextMenu={event => event.preventDefault()}
      onClick={handleClick}
      className={`relative w-full flex items-center gap-3 p-4 rounded-card border shadow-card text-left active:bg-surface-card transition-all ${
        selected ? 'border-brand-orange/50 ring-1 ring-brand-orange/20 bg-brand-orange/[0.04]' : 'border-line-base bg-white'
      } ${pressed ? 'scale-[0.98]' : 'scale-100'}`}
    >
      {isNew && <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-brand-orange" />}
      {selecting && (
        <div className={`absolute left-2 top-2 z-10 w-6 h-6 rounded-full border flex items-center justify-center ${
          selected ? 'bg-brand-orange border-brand-orange' : 'bg-white border-[#D1D5DB]'
        }`}>
          {selected && <span className="text-[12px] font-semibold text-white leading-none">✓</span>}
        </div>
      )}
      <div className="relative flex-shrink-0">
        <div
          className="w-11 h-11 rounded-card flex items-center justify-center"
          style={{ backgroundColor: cfg.bg }}
        >
          <Icon size={20} style={{ color: cfg.color }} />
        </div>
        {isTeamShared && (
          <span className="absolute -top-1.5 -left-1 px-1 py-0.5 bg-brand-orange text-white text-[8px] font-semibold rounded-sm leading-none whitespace-nowrap">
            团队
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {renaming && onRenameChange && onRenameCommit ? (
          <InlineRenameInput value={renameValue ?? file.name} onChange={onRenameChange} onCommit={onRenameCommit} />
        ) : (
          <p className="text-card-title text-ink-primary truncate">{file.name}</p>
        )}
        <p className="text-caption text-ink-placeholder mt-0.5">
          {file.size !== '—' && `${file.size}`}
          {file.pageCount && ` · ${file.pageCount}页`}
          {` · ${file.uploadedAt}`}
        </p>
        {file.summary && (
          <p className="text-caption text-ink-secondary mt-1 line-clamp-1 leading-relaxed">{file.summary}</p>
        )}
      </div>
      <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
    </button>
  )
}

export default function K05_KnowledgeDetail() {
  const navigate = useNavigate()
  const { activeBase, bases, files, setActiveFile, moveFiles, deleteFile, updateFile, updateBase } = useKnowledge()
  const { showToast, showConfirm } = useUser()
  const { getKbTasks } = useWatch()
  const {
    isSelecting,
    selectedFiles,
    clearSelection,
    replaceSelection,
    addFiles,
    isSelected,
    toggleFile,
  } = useMultiSelect()

  const [activeFilter, setActiveFilter] = useState<string>('全部')
  const openUploadSheet = () => navigate('/knowledge/upload')
  const [showAskPanel, setShowAskPanel] = useState(false)
  const [openSwipeId, setOpenSwipeId] = useState<string | null>(null)
  const [movingFile, setMovingFile] = useState<KnowledgeFile | null>(null)
  const [showModeSheet, setShowModeSheet] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [draftManagementMode, setDraftManagementMode] = useState<KnowledgeManagementMode | null | undefined>(undefined)
  const [modeTransitioning, setModeTransitioning] = useState(false)
  const [outputStages, setOutputStages] = useState<OutputStage[]>(INITIAL_OUTPUT_STAGES)
  const [activeIdeaFilter, setActiveIdeaFilter] = useState<IdeaFilterId>('all')
  const [relatedTopic, setRelatedTopic] = useState<string | null>(null)
  const [aiReorganized, setAiReorganized] = useState(false)
  const [showAiOrganizing, setShowAiOrganizing] = useState(false)
  const [aiOrganizingStep, setAiOrganizingStep] = useState(0)
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null)
  const [renamingStructuredId, setRenamingStructuredId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [deletingFileIds, setDeletingFileIds] = useState<string[]>([])
  const [deletingStructuredIds, setDeletingStructuredIds] = useState<string[]>([])
  const [hiddenStructuredIds, setHiddenStructuredIds] = useState<string[]>([])
  const [structuredRenames, setStructuredRenames] = useState<Record<string, string>>({})
  const [movingStructuredTarget, setMovingStructuredTarget] = useState<StructuredActionTarget | null>(null)
  const [newlyAddedFileIds, setNewlyAddedFileIds] = useState<string[]>([])

  const kbFiles = files.filter(f => f.kbId === activeBase?.id)
  const isProjectMode = activeBase?.managementMode === 'project'
  const isSecondBrainMode = activeBase?.managementMode === 'second_brain'
  const isOutputMode = activeBase?.managementMode === 'output'
  const isIdeaMode = activeBase?.managementMode === 'idea'
  const isAiMode = activeBase?.managementMode === 'ai'
  const isFreeMode = activeBase?.managementMode === 'free'
  const isUnconfiguredMode = activeBase?.managementMode == null
  const effectiveFileCount = Math.max(kbFiles.length, activeBase?.fileCount ?? 0)
  const showEmptyState = effectiveFileCount === 0
  const isStructuredMode = isProjectMode || isSecondBrainMode || isOutputMode || isIdeaMode || isAiMode || isFreeMode
  const aiGroups = getAiGroups(aiReorganized)
  const visibleIdeaCards = activeIdeaFilter === 'all'
    ? IDEA_CARDS
    : IDEA_CARDS.filter(card => card.label === activeIdeaFilter || card.related.includes(activeIdeaFilter))
  const relatedCards = relatedTopic
    ? IDEA_CARDS.filter(card => card.related.includes(relatedTopic))
    : []

  useEffect(() => {
    const handleNewFiles = (event: Event) => {
      const ids = (event as CustomEvent<{ ids?: string[] }>).detail?.ids ?? []
      if (ids.length === 0) return
      setNewlyAddedFileIds(prev => [...new Set([...prev, ...ids])])
      window.setTimeout(() => {
        setNewlyAddedFileIds(prev => prev.filter(id => !ids.includes(id)))
      }, 2000)
    }

    window.addEventListener('knowledge-files-added', handleNewFiles as EventListener)
    return () => window.removeEventListener('knowledge-files-added', handleNewFiles as EventListener)
  }, [])

  const filterMap: Record<string, string[]> = {
    '速记': ['note', 'note_excerpt', 'ai_excerpt'],
    '文档': ['pdf', 'doc', 'txt', 'pdf_excerpt', 'doc_excerpt'],
    '网页': ['url', 'web_excerpt'],
    '音频': ['audio'],
    '图片': ['image'],
  }
  const filtered = activeFilter === '全部'
    ? kbFiles
    : kbFiles.filter(f => (filterMap[activeFilter] ?? []).includes(f.type))
  const allFilteredSelected = filtered.length > 0 && filtered.every(file =>
    selectedFiles.some(selected => selected.id === file.id)
  )

  const handleFileClick = (file: KnowledgeFile) => {
    if (openSwipeId) {
      setOpenSwipeId(null)
      return
    }
    if (isSelecting) {
      toggleFile(file)
      return
    }
    setActiveFile(file)
    navigate('/knowledge/file-detail')
  }

  const startRenameFile = (file: KnowledgeFile) => {
    setRenamingFileId(file.id)
    setRenameValue(file.name)
  }

  const commitRenameFile = (file: KnowledgeFile) => {
    const nextName = renameValue.trim()
    if (nextName && nextName !== file.name) {
      updateFile(file.id, { name: nextName })
      showToast('已重命名')
    }
    setRenamingFileId(null)
    setRenameValue('')
  }

  const getStructuredTitle = (id: string, fallback: string) => structuredRenames[id] ?? fallback

  const startRenameStructured = (target: StructuredActionTarget) => {
    setRenamingStructuredId(target.id)
    setRenameValue(getStructuredTitle(target.id, target.title))
  }

  const commitRenameStructured = (target: StructuredActionTarget) => {
    const nextName = renameValue.trim()
    if (nextName && nextName !== getStructuredTitle(target.id, target.title)) {
      if (target.kind === 'output' && target.stageId) {
        setOutputStages(prev => prev.map(stage => stage.id === target.stageId
          ? {
              ...stage,
              items: stage.items.map(item => `output:${stage.id}:${item.id}` === target.id
                ? { ...item, title: nextName, file: { ...item.file, name: nextName } }
                : item
              ),
            }
          : stage
        ))
      }
      setStructuredRenames(prev => ({ ...prev, [target.id]: nextName }))
      showToast('已重命名')
    }
    setRenamingStructuredId(null)
    setRenameValue('')
  }

  const animateDeleteFile = (file: KnowledgeFile) => {
    setDeletingFileIds(prev => [...new Set([...prev, file.id])])
    window.setTimeout(() => {
      deleteFile(file.id)
      setDeletingFileIds(prev => prev.filter(id => id !== file.id))
      showToast('已删除')
    }, 200)
  }

  const confirmMenuDeleteFile = (file: KnowledgeFile) => {
    showConfirm({
      title: `删除「${file.name}」？`,
      description: activeBase?.id === QUICK_NOTES_KB_ID ? '删除后不可恢复' : '删除后无法恢复，确认删除这个文件？',
      confirmText: '删除',
      danger: true,
      onConfirm: () => animateDeleteFile(file),
    })
  }

  const removeStructuredTarget = (target: StructuredActionTarget) => {
    setDeletingStructuredIds(prev => [...new Set([...prev, target.id])])
    window.setTimeout(() => {
      if (target.kind === 'output' && target.stageId) {
        setOutputStages(prev => prev.map(stage => stage.id === target.stageId
          ? { ...stage, items: stage.items.filter(item => `output:${stage.id}:${item.id}` !== target.id) }
          : stage
        ))
      } else {
        setHiddenStructuredIds(prev => [...new Set([...prev, target.id])])
      }
      setDeletingStructuredIds(prev => prev.filter(id => id !== target.id))
      showToast('已删除')
    }, 200)
  }

  const confirmDeleteStructured = (target: StructuredActionTarget) => {
    showConfirm({
      title: `删除「${getStructuredTitle(target.id, target.title)}」？`,
      description: activeBase?.id === QUICK_NOTES_KB_ID ? '删除后不可恢复' : '删除后无法恢复，确认删除这个文件？',
      confirmText: '删除',
      danger: true,
      onConfirm: () => removeStructuredTarget(target),
    })
  }

  const getFileLongPressActions = (file: KnowledgeFile): LongPressMenuAction[] => [
    {
      id: 'delete',
      label: '删除',
      icon: Trash2,
      danger: true,
      onAction: () => confirmMenuDeleteFile(file),
    },
    {
      id: 'rename',
      label: '重命名',
      icon: PenLine,
      onAction: () => startRenameFile(file),
    },
    {
      id: 'move',
      label: '移动到...',
      icon: FolderInput,
      onAction: () => setMovingFile(file),
    },
  ]

  const moveStructuredToKnowledgeBase = (target: StructuredActionTarget) => {
    setMovingStructuredTarget(target)
  }

  const getStructuredLongPressActions = (
    target: StructuredActionTarget,
    options: { stageIndex?: number } = {},
  ): { actions: LongPressMenuAction[]; extraActions?: LongPressMenuAction[] } => {
    const actions: LongPressMenuAction[] = [
      {
        id: 'delete',
        label: '删除',
        icon: Trash2,
        danger: true,
        onAction: () => confirmDeleteStructured(target),
      },
      {
        id: 'rename',
        label: '重命名',
        icon: PenLine,
        onAction: () => startRenameStructured(target),
      },
      {
        id: 'move',
        label: '移动到...',
        icon: FolderInput,
        onAction: () => moveStructuredToKnowledgeBase(target),
      },
    ]

    const extraActions: LongPressMenuAction[] = []
    if (target.kind === 'project') {
      extraActions.push({
        id: 'move-group',
        label: '移到其他分组...',
        icon: Folder,
        onAction: () => showToast('已移动到其他分组'),
      })
    }
    if (target.kind === 'output' && target.stageId) {
      if ((options.stageIndex ?? 0) < INITIAL_OUTPUT_STAGES.length - 1) {
        extraActions.push({
          id: 'advance',
          label: '推进到下一阶段',
          icon: ArrowDown,
          onAction: () => advanceOutputCard(target.stageId!, target.id.split(':').at(-1) ?? target.id),
        })
      }
      if ((options.stageIndex ?? 0) > 0) {
        extraActions.push({
          id: 'retreat',
          label: '打回上一阶段',
          icon: ArrowRight,
          onAction: () => retreatOutputCard(target.stageId!, target.id.split(':').at(-1) ?? target.id),
        })
      }
    }
    return { actions, extraActions }
  }

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      replaceSelection(selectedFiles.filter(file => !filtered.some(item => item.id === file.id)))
      return
    }
    addFiles(filtered)
  }

  const confirmDeleteFile = (file: KnowledgeFile) => {
    showConfirm({
      title: `删除「${file.name}」？`,
      description: '删除后无法恢复，确认删除这个文件？',
      confirmText: '删除',
      danger: true,
      onConfirm: () => {
        deleteFile(file.id)
        showToast(`已删除「${file.name}」`)
      },
    })
  }

  const getFileActions = (file: KnowledgeFile): SwipeAction[] => [
    {
      id: 'move',
      label: '移动到',
      icon: FolderInput,
      color: '#6B7280',
      onAction: () => setMovingFile(file),
    },
    {
      id: 'delete',
      label: '删除',
      icon: Trash2,
      color: '#DC2626',
      onAction: () => confirmDeleteFile(file),
    },
  ]

  const targetBases = bases.filter(base => base.id !== activeBase?.id)

  const moveSingleFile = (targetKbId: string, targetName: string) => {
    if (movingFile) {
      moveFiles([movingFile.id], targetKbId)
      showToast(`已移动到「${targetName}」`)
      setMovingFile(null)
      return
    }
    if (movingStructuredTarget) {
      if (movingStructuredTarget.kind === 'output' && movingStructuredTarget.stageId) {
        setOutputStages(prev => prev.map(stage => stage.id === movingStructuredTarget.stageId
          ? { ...stage, items: stage.items.filter(item => `output:${stage.id}:${item.id}` !== movingStructuredTarget.id) }
          : stage
        ))
      } else {
        setHiddenStructuredIds(prev => [...new Set([...prev, movingStructuredTarget.id])])
      }
      showToast(`已移动到「${targetName}」`)
      setMovingStructuredTarget(null)
      return
    }
  }

  const openManagementModeSheet = () => {
    if (!activeBase) return

    if (activeBase.type === 'subscribed') {
      showToast('订阅兴趣库不能修改管理方式')
      return
    }

    if (activeBase.id === QUICK_NOTES_KB_ID || activeBase.isSystem || activeBase.locked) {
      showToast('我的速记为系统默认兴趣库，不可修改管理方式')
      return
    }

    setDraftManagementMode(activeBase.managementMode ?? null)  // null = "不选" pre-selected
    setShowModeSheet(true)
  }

  const openManagementModeFromMoreMenu = () => {
    setShowMoreMenu(false)
    openManagementModeSheet()
  }

  const confirmManagementMode = () => {
    if (!activeBase || draftManagementMode === undefined) return
    const baseId = activeBase.id
    const nextMode = draftManagementMode  // can be null (不选) or a mode value

    setShowModeSheet(false)
    setModeTransitioning(true)
    window.setTimeout(() => {
      updateBase(baseId, { managementMode: nextMode })
      showToast(nextMode != null ? `已切换到「${getManagementModeLabel(nextMode)}」` : '已取消管理方式')
      window.setTimeout(() => setModeTransitioning(false), 200)
    }, 100)
  }

  const openIdeaCard = (card: IdeaCardData) => {
    setActiveFile(makeIdeaFile(card, activeBase?.id ?? QUICK_NOTES_KB_ID))
    setRelatedTopic(null)
    navigate('/knowledge/file-detail')
  }

  const openAiItem = (group: AITopicGroup, item: AITopicItem) => {
    setActiveFile(makeAiFile(group, item, activeBase?.id ?? 'kb1'))
    navigate('/knowledge/file-detail')
  }

  const runAiReorganize = () => {
    setShowAiOrganizing(true)
    setAiOrganizingStep(0)
    window.setTimeout(() => setAiOrganizingStep(1), 650)
    window.setTimeout(() => setAiOrganizingStep(2), 1300)
    window.setTimeout(() => {
      setAiReorganized(true)
      setShowAiOrganizing(false)
      showToast('已完成重新整理')
    }, 2000)
  }

  const openOutputCard = (stage: OutputStage, card: OutputStageCard) => {
    setActiveFile({
      ...card.file,
      workflowStage: stage.id === 'finished' ? undefined : stage.title,
    })
    navigate('/knowledge/file-detail')
  }

  const advanceOutputCard = (stageId: OutputStageId, cardId: string) => {
    setOutputStages(prev => {
      const stageIndex = prev.findIndex(stage => stage.id === stageId)
      if (stageIndex < 0 || stageIndex >= prev.length - 1) return prev
      const card = prev[stageIndex].items.find(item => item.id === cardId)
      if (!card) return prev
      const nextStage = prev[stageIndex + 1]
      return prev.map((stage, index) => {
        if (index === stageIndex) {
          return { ...stage, items: stage.items.filter(item => item.id !== cardId) }
        }
        if (index === stageIndex + 1) {
          return {
            ...stage,
            items: [
              {
                ...card,
                tone: nextStage.id === 'extracting' ? 'active' : nextStage.id === 'finished' ? 'result' : card.tone,
                file: {
                  ...card.file,
                  workflowStage: nextStage.id === 'finished' ? undefined : nextStage.title,
                },
              },
              ...stage.items,
            ],
          }
        }
        return stage
      })
    })
    setOpenSwipeId(null)
    showToast('已推进到下一阶段')
  }

  const retreatOutputCard = (stageId: OutputStageId, cardId: string) => {
    setOutputStages(prev => {
      const stageIndex = prev.findIndex(stage => stage.id === stageId)
      if (stageIndex <= 0) return prev
      const card = prev[stageIndex].items.find(item => item.id === cardId)
      if (!card) return prev
      const previousStage = prev[stageIndex - 1]
      return prev.map((stage, index) => {
        if (index === stageIndex) {
          return { ...stage, items: stage.items.filter(item => item.id !== cardId) }
        }
        if (index === stageIndex - 1) {
          return {
            ...stage,
            items: [
              {
                ...card,
                tone: previousStage.id === 'extracting' ? 'active' : previousStage.id === 'finished' ? 'result' : 'normal',
                file: {
                  ...card.file,
                  workflowStage: previousStage.id === 'finished' ? undefined : previousStage.title,
                },
              },
              ...stage.items,
            ],
          }
        }
        return stage
      })
    })
    setOpenSwipeId(null)
    showToast('已打回上一阶段')
  }

  const deleteOutputCard = (stageId: OutputStageId, cardId: string) => {
    setOutputStages(prev => prev.map(stage =>
      stage.id === stageId
        ? { ...stage, items: stage.items.filter(item => item.id !== cardId) }
        : stage
    ))
    setOpenSwipeId(null)
    showToast('已删除')
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden relative bg-surface-card">

      {/* ── Header ── */}
      <div className="flex-shrink-0 flex items-center h-14 px-4 bg-white border-b border-line-base">
        {isSelecting ? (
          <>
            <button onClick={clearSelection} className="w-16 text-left text-body text-ink-secondary">
              取消
            </button>
            <span className="flex-1 text-center text-body font-semibold text-ink-primary">已选 {selectedFiles.length} 项</span>
            <button onClick={toggleSelectAll} className="w-16 text-right text-body text-brand-orange">
              {allFilteredSelected ? '取消全选' : '全选'}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/knowledge')} className="relative z-10 p-1 -ml-1 mr-2 text-ink-secondary">
              <ChevronLeft size={24} />
            </button>
            <span className="absolute left-16 right-16 text-center text-h2 text-ink-primary truncate">{activeBase?.name ?? '兴趣库'}</span>
            <button
              type="button"
              onClick={() => setShowMoreMenu(true)}
              className="relative z-10 ml-auto p-2 text-ink-secondary"
            >
              <MoreHorizontal size={21} />
            </button>
          </>
        )}
      </div>

      {/* Watch status bar */}
      {(() => {
        const kbTasks = getKbTasks(activeBase?.id ?? '')
        const running = kbTasks.filter(t => t.status === 'running')
        const todayCount = running.reduce((s, t) => s + t.todayFetched, 0)
        if (running.length === 0) return null
        return (
          <button
            type="button"
            onClick={() => navigate('/knowledge/watch', { state: { kbId: activeBase?.id, kbName: activeBase?.name } })}
            className="flex flex-shrink-0 items-center justify-between bg-white"
            style={{
              borderLeft: '3px solid #FF7A00',
              padding: '12px 14px',
              marginBottom: 12,
            }}
          >
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-[#FF7A00] flex-shrink-0" />
              <span className="text-[13px] text-ink-primary">
                {running.length} 个蹲守中 · 今天蹲到 {todayCount} 条新内容
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#FF7A00]">管理 →</span>
          </button>
        )
      })()}

      <div className={`flex min-h-0 flex-1 flex-col transition-opacity duration-200 ${modeTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {showEmptyState ? (
          <KnowledgeEmptyState
            mode={activeBase?.managementMode}
            onAdd={() => openUploadSheet()}
            onChooseMode={openManagementModeSheet}
          />
        ) : (
          <>
            {isStructuredMode && (
              <>

          {isProjectMode && (
            <div className="relative z-[var(--z-content)] flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 pt-3 space-y-3 pb-4">
              {PROJECT_GROUPS.map(group => (
                <ProjectSection
                  key={group.id}
                  group={group}
                  hiddenIds={hiddenStructuredIds}
                  deletingIds={deletingStructuredIds}
                  renamingId={renamingStructuredId}
                  renameValue={renameValue}
                  getTitle={getStructuredTitle}
                  onRenameChange={setRenameValue}
                  onRenameCommit={commitRenameStructured}
                  getActions={target => getStructuredLongPressActions(target)}
                  longPressDisabled={activeBase?.type === 'subscribed'}
                  onItemClick={(id, title) => {
                    const files = PARA_FOLDER_FILES[id] ?? []
                    navigate('/knowledge/folder', {
                      state: { folderId: id, folderTitle: title, kbName: activeBase?.name ?? '', files },
                    })
                  }}
                />
              ))}
            </div>
          )}

          {isSecondBrainMode && (
            <div className="relative z-[var(--z-content)] flex-1 min-h-0 overflow-y-auto scrollbar-hide pb-4">
              {/* Horizontal scroll groups by content type */}
              {SECOND_BRAIN_GROUPS.map(group => {
                const Icon = group.icon
                return (
                  <div key={group.id} className="mt-5">
                    <div className="mb-2 flex items-center justify-between px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-ink-primary">{group.label}</span>
                        <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[11px] text-[#6B7280]">{group.count}</span>
                      </div>
                      <button type="button" className="text-[12px] text-ink-secondary">全部 →</button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-1">
                      {group.cards.map(card => (
                        <div key={card.id} className="w-[200px] flex-shrink-0 rounded-[12px] border border-[#EEEEEE] bg-white p-3">
                          <div className="mb-2 flex items-center gap-1.5">
                            <Icon size={16} style={{ color: group.iconColor }} />
                            <span className="text-[11px] text-ink-secondary">{group.typeLabel}</span>
                          </div>
                          <p className="line-clamp-2 text-[13px] font-medium leading-5 text-[#1A1A1A]">{card.title}</p>
                          <p className="mt-1 text-[11px] text-[#9CA3AF]">{card.subtitle} · {card.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* AI reuse suggestion card */}
              <div className="mx-4 mt-5 rounded-[12px] bg-[#FFF1E6] p-[14px]">
                <div className="flex items-start gap-3">
                  <Sparkles size={18} className="mt-0.5 flex-shrink-0 text-[#FF7A00]" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#1A1A1A]">3 条素材可以组合使用</p>
                    <p className="mt-1 text-[12px] leading-[1.5] text-ink-secondary">你近 7 天存的「AI 浏览器架构」「用户访谈洞察」「竞品对比」可以组合写一篇分析报告</p>
                    <button type="button" className="mt-2 text-[13px] font-medium text-[#FF7A00]">查看建议 →</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isOutputMode && (
            <div className="relative z-[var(--z-content)] flex-1 min-h-0 overflow-y-auto scrollbar-hide pb-4">
              <div className="px-4 pt-6">
                {outputStages.map((stage, index) => (
                  <div key={stage.id}>
                    <OutputStageSection
                      stage={stage}
                      stageIndex={index}
                      openSwipeId={openSwipeId}
                      onSwipeOpen={setOpenSwipeId}
                      onOpenCard={openOutputCard}
                      onAdvanceCard={advanceOutputCard}
                      onDeleteCard={deleteOutputCard}
                      hiddenIds={hiddenStructuredIds}
                      deletingIds={deletingStructuredIds}
                      renamingId={renamingStructuredId}
                      renameValue={renameValue}
                      getTitle={getStructuredTitle}
                      onRenameChange={setRenameValue}
                      onRenameCommit={commitRenameStructured}
                      getActions={(target, stageIndexValue) => getStructuredLongPressActions(target, { stageIndex: stageIndexValue })}
                      longPressDisabled={activeBase?.type === 'subscribed'}
                    />
                    {index < outputStages.length - 1 && (
                      <div className="py-2">
                        <OutputStageConnector />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isIdeaMode && (
            <div className="relative z-[var(--z-content)] flex-1 min-h-0 overflow-y-auto scrollbar-hide pb-4">
              <IdeaNetworkOverview onOpenNetwork={() => showToast('关系图功能即将上线')} />

              <div className="mt-3 overflow-x-auto px-4 scrollbar-hide">
                <div className="flex gap-2">
                  {IDEA_FILTERS.map(filter => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveIdeaFilter(filter.id)}
                      className={`h-8 flex-shrink-0 rounded-full px-3 text-[12px] leading-4 transition-colors ${
                        activeIdeaFilter === filter.id
                          ? 'bg-[#FF7A00] text-white'
                          : 'border border-[#EEEEEE] bg-white text-ink-secondary'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 px-4 pt-3">
                {[0, 1].map(column => (
                  <div key={column} className="space-y-2">
                    {visibleIdeaCards
                      .filter((_, index) => index % 2 === column)
                      .filter(card => !hiddenStructuredIds.includes(`idea:${card.id}`))
                      .map(card => {
                        const itemId = `idea:${card.id}`
                        const target: StructuredActionTarget = { id: itemId, kind: 'idea', title: getStructuredTitle(itemId, card.body) }
                        const menu = getStructuredLongPressActions(target)
                        return (
                          <LongPressActionMenu
                            key={card.id}
                            actions={menu.actions}
                            extraActions={menu.extraActions}
                            disabled={activeBase?.type === 'subscribed'}
                            className={`transition-all duration-200 ${
                              deletingStructuredIds.includes(itemId) ? 'max-h-0 overflow-hidden opacity-0 scale-[0.98]' : 'max-h-[260px] opacity-100 scale-100'
                            }`}
                          >
                            <IdeaCard
                              card={card}
                              body={target.title}
                              renaming={renamingStructuredId === itemId}
                              renameValue={renameValue}
                              onRenameChange={setRenameValue}
                              onRenameCommit={() => commitRenameStructured(target)}
                              onOpen={() => openIdeaCard({ ...card, body: target.title })}
                              onRelatedClick={setRelatedTopic}
                            />
                          </LongPressActionMenu>
                        )
                      })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isAiMode && (
            <div className="relative z-[var(--z-content)] flex-1 min-h-0 overflow-y-auto scrollbar-hide pb-4">
              <AIStatusCard
                onShowSuggestions={() => showToast('AI 发现 3 条可优化建议')}
                onReorganize={runAiReorganize}
              />
              <div className="px-4 pt-4 space-y-3">
                {aiGroups.map(group => (
                  <div key={group.id} className="space-y-3">
                    <AITopicGroupSection
                      group={group}
                      onOpenItem={openAiItem}
                      hiddenIds={hiddenStructuredIds}
                      deletingIds={deletingStructuredIds}
                      renamingId={renamingStructuredId}
                      renameValue={renameValue}
                      getTitle={getStructuredTitle}
                      onRenameChange={setRenameValue}
                      onRenameCommit={commitRenameStructured}
                      getActions={target => getStructuredLongPressActions(target)}
                      longPressDisabled={activeBase?.type === 'subscribed'}
                    />
                    {group.id === 'method' && (
                      <AISuggestionBar
                        onAccept={() => {
                          setAiReorganized(true)
                          showToast('已采纳建议')
                        }}
                        onIgnore={() => showToast('已忽略建议')}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isFreeMode && (
            <div
              className="relative z-[var(--z-content)] flex-1 min-h-0 overflow-y-auto scrollbar-hide pb-4"
              onClick={() => openSwipeId && setOpenSwipeId(null)}
            >
              <div className="mx-4 mt-3 overflow-hidden rounded-[12px] border border-[#EEEEEE] bg-white">
                {kbFiles.map((file, index) => (
                  <div
                    key={file.id}
                    className={`transition-all duration-200 ${
                      deletingFileIds.includes(file.id) ? 'max-h-0 overflow-hidden opacity-0 scale-[0.98]' : 'max-h-[96px] opacity-100 scale-100'
                    } ${index < kbFiles.length - 1 ? 'border-b border-[#EEEEEE]' : ''}`}
                  >
                    <LongPressActionMenu
                      actions={getFileLongPressActions(file)}
                      disabled={activeBase?.type === 'subscribed'}
                    >
                      <SwipeableListItem
                        id={file.id}
                        actions={getFileActions(file)}
                        open={openSwipeId === file.id}
                        onOpenChange={setOpenSwipeId}
                      >
                        <FlatFileRow
                          file={file}
                          onClick={() => handleFileClick(file)}
                          onLongPress={() => {}}
                          longPressEnabled={false}
                          selecting={isSelecting}
                          selected={isSelected(file.id)}
                          isNew={newlyAddedFileIds.includes(file.id)}
                          renaming={renamingFileId === file.id}
                          renameValue={renameValue}
                          onRenameChange={setRenameValue}
                          onRenameCommit={() => commitRenameFile(file)}
                          isTeamShared={activeBase?.type === 'subscribed'}
                        />
                      </SwipeableListItem>
                    </LongPressActionMenu>
                  </div>
                ))}
              </div>
            </div>
          )}
          </>
        )}

            {isUnconfiguredMode && (
              <div
                className="relative z-[var(--z-content)] flex-1 min-h-0 overflow-y-auto scrollbar-hide"
                onClick={() => openSwipeId && setOpenSwipeId(null)}
              >
                <div className="mx-4 mt-3 overflow-hidden rounded-[12px] border border-[#EEEEEE] bg-white">
                  {kbFiles.map((file, index) => (
                    <div
                      key={file.id}
                      className={`transition-all duration-200 ${
                        deletingFileIds.includes(file.id) ? 'max-h-0 overflow-hidden opacity-0 scale-[0.98]' : 'max-h-[96px] opacity-100 scale-100'
                      } ${index < kbFiles.length - 1 ? 'border-b border-[#EEEEEE]' : ''}`}
                    >
                      <LongPressActionMenu
                        actions={getFileLongPressActions(file)}
                        disabled={activeBase?.type === 'subscribed'}
                      >
                        <SwipeableListItem
                          id={file.id}
                          actions={getFileActions(file)}
                          open={openSwipeId === file.id}
                          onOpenChange={setOpenSwipeId}
                        >
                          <FlatFileRow
                            file={file}
                            onClick={() => handleFileClick(file)}
                            onLongPress={() => {}}
                            longPressEnabled={false}
                            selecting={isSelecting}
                            selected={isSelected(file.id)}
                            isNew={newlyAddedFileIds.includes(file.id)}
                            renaming={renamingFileId === file.id}
                            renameValue={renameValue}
                            onRenameChange={setRenameValue}
                            onRenameCommit={() => commitRenameFile(file)}
                            isTeamShared={activeBase?.type === 'subscribed'}
                          />
                        </SwipeableListItem>
                      </LongPressActionMenu>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isStructuredMode && !isUnconfiguredMode && (
              <>
                {/* ── Filter tabs ── */}
                <div className="flex-shrink-0 bg-white border-b border-line-base px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
                  {TYPE_FILTERS.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      className={`px-3 py-1.5 rounded-pill text-caption whitespace-nowrap transition-colors flex-shrink-0 ${
                        activeFilter === tab ? 'bg-brand-orange text-white' : 'bg-surface-card text-ink-secondary'
                      }`}
                    >
                      {tab}
                      {tab !== '全部' && filterMap[tab] && (
                        <span className="ml-1 opacity-70">
                          {kbFiles.filter(f => filterMap[tab].includes(f.type)).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* ── File list ── */}
                <div
                  className={`relative z-[var(--z-content)] flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 pt-4 space-y-3 ${isSelecting ? 'pb-28' : 'pb-4'}`}
                  onClick={() => openSwipeId && setOpenSwipeId(null)}
                >
                  {filtered.length > 0 ? (
                    filtered.map(f => (
                      <div
                        key={f.id}
                        className={`transition-all duration-200 ${
                          deletingFileIds.includes(f.id) ? 'max-h-0 overflow-hidden opacity-0 scale-[0.98]' : 'max-h-[140px] opacity-100 scale-100'
                        }`}
                      >
                        <LongPressActionMenu
                          actions={getFileLongPressActions(f)}
                          disabled={activeBase?.type === 'subscribed'}
                        >
                          <SwipeableListItem
                            id={f.id}
                            actions={getFileActions(f)}
                            open={openSwipeId === f.id}
                            onOpenChange={setOpenSwipeId}
                          >
                            <FileCard
                              file={f}
                              onClick={() => handleFileClick(f)}
                              onLongPress={() => {}}
                              longPressEnabled={false}
                              selecting={isSelecting}
                              selected={isSelected(f.id)}
                              isNew={newlyAddedFileIds.includes(f.id)}
                              renaming={renamingFileId === f.id}
                              renameValue={renameValue}
                              onRenameChange={setRenameValue}
                              onRenameCommit={() => commitRenameFile(f)}
                              isTeamShared={activeBase?.type === 'subscribed'}
                            />
                          </SwipeableListItem>
                        </LongPressActionMenu>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center py-12 text-center">
                      <p className="text-body text-ink-secondary">该类型暂无文件</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ── Bottom Ask AI bar ── */}
      {!isSelecting && <div className="relative z-[var(--z-bottom-bar)] flex-shrink-0 border-t border-line-base bg-white px-4 py-3 shadow-[0_-8px_18px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAskPanel(true)}
            className="h-11 min-w-0 flex-1 flex items-center gap-2 px-4 bg-[#F5F5F5] rounded-pill border border-transparent text-left"
          >
            <Search size={15} className="text-ink-placeholder flex-shrink-0" />
            <span className="flex-1 min-w-0 truncate text-body text-ink-placeholder">问 AI 关于「{activeBase?.name ?? '兴趣库'}」…</span>
            <Mic size={17} className="text-ink-placeholder flex-shrink-0" />
          </button>
          <button
            onClick={() => openUploadSheet()}
            aria-label="添加内容"
            className="w-11 h-11 bg-brand-orange rounded-full flex items-center justify-center shadow-card flex-shrink-0"
          >
            <Plus size={20} className="text-white" />
          </button>
        </div>
      </div>}

      {showAiOrganizing && <AIOrganizingOverlay step={aiOrganizingStep} />}

      <AskAIPanel
        open={showAskPanel}
        onClose={() => setShowAskPanel(false)}
        scope="knowledge"
        scopeName={activeBase?.name ?? '兴趣库'}
        scopeId={activeBase?.id ?? ''}
      />

      <BottomSheet
        open={showMoreMenu}
        onClose={() => setShowMoreMenu(false)}
        title="更多操作"
        titleAlign="center"
        titleClassName="text-[17px] leading-6 font-semibold text-ink-primary"
      >
        <div className="px-5 pt-2 pb-4 space-y-2">
          <button
            type="button"
            onClick={() => {
              setShowMoreMenu(false)
              navigate('/knowledge/watch', { state: { kbId: activeBase?.id, kbName: activeBase?.name } })
            }}
            className="w-full rounded-[12px] border border-[#FFE4D0] bg-[#FFF7F0] px-4 py-3 text-left text-[14px] font-medium leading-5 text-[#FF7A00]"
          >
            蹲一下
          </button>
          <button
            type="button"
            onClick={openManagementModeFromMoreMenu}
            className={`w-full rounded-[12px] border px-4 py-3 text-left text-[14px] font-medium leading-5 ${
              isUnconfiguredMode
                ? 'border-[#FFE4D0] bg-[#FFF7F0] text-[#FF7A00]'
                : 'border-[#EEEEEE] bg-white text-ink-primary'
            }`}
          >
            选择整理方式
          </button>
          <button
            type="button"
            onClick={() => {
              setShowMoreMenu(false)
              openUploadSheet()
            }}
            className="w-full rounded-[12px] border border-[#EEEEEE] bg-white px-4 py-3 text-left text-[14px] leading-5 text-ink-primary"
          >
            添加内容
          </button>
        </div>
      </BottomSheet>

      <BottomSheet
        open={Boolean(relatedTopic)}
        onClose={() => setRelatedTopic(null)}
        title={relatedTopic ? `关联：${relatedTopic}（${relatedCards.length} 张卡片）` : '关联'}
        titleAlign="center"
        titleClassName="text-[17px] leading-6 font-semibold text-ink-primary"
      >
        <div className="px-5 pt-2 pb-4 space-y-2">
          {relatedCards.map(card => (
            <button
              key={card.id}
              type="button"
              onClick={() => openIdeaCard(card)}
              className="w-full rounded-[12px] border border-[#EEEEEE] bg-white p-3.5 text-left active:bg-surface-card"
            >
              <p className="text-[11px] leading-4 text-[#9CA3AF]">{card.label} · {card.time}</p>
              <p className="mt-1.5 line-clamp-2 text-[14px] leading-[1.55] text-ink-primary">{card.body}</p>
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet
        open={showModeSheet}
        onClose={() => setShowModeSheet(false)}
        title="选择管理方式"
        titleAlign="center"
        titleClassName="text-[17px] leading-6 font-semibold text-ink-primary"
        fullHeight
        heightClassName="h-[75%] max-h-[75%]"
      >
        <div className="flex h-full min-h-0 flex-col px-5 pt-2">
          <p className="text-[13px] leading-5 text-[#4A4A4A] text-center">
            6 种知识管理方式，选一种适合你的，之后可以改
          </p>
          <div className="mt-4 flex-1 min-h-0 space-y-3 overflow-y-auto scrollbar-hide pb-4">
            {MANAGEMENT_OPTIONS.map(option => (
              <ManagementModeCard
                key={String(option.id)}
                option={option}
                selected={draftManagementMode === option.id}
                onClick={() => setDraftManagementMode(option.id)}
              />
            ))}
          </div>
          <div className="-mx-5 flex-shrink-0 border-t border-line-base/70 bg-white px-5 pt-3 pb-4">
            <button
              onClick={confirmManagementMode}
              disabled={draftManagementMode === undefined}
              className={`w-full py-3.5 rounded-btn text-body font-semibold ${
                draftManagementMode !== undefined ? 'bg-[#FF7A00] text-white' : 'bg-[#FFD7BF] text-white/80'
              }`}
            >
              确认
            </button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet
        open={Boolean(movingFile || movingStructuredTarget)}
        onClose={() => {
          setMovingFile(null)
          setMovingStructuredTarget(null)
        }}
        title="移动到哪个兴趣库"
        titleAlign="center"
        titleClassName="text-[17px] leading-6 font-semibold text-ink-primary"
      >
        <div className="px-5 pt-2 pb-4">
          <p className="text-caption text-ink-secondary text-center mb-4">选择目标兴趣库</p>
          <div className="space-y-2">
            {targetBases.map(base => (
              <button
                key={base.id}
                onClick={() => moveSingleFile(base.id, base.name)}
                className="w-full flex items-center gap-3 px-3 py-3 bg-white rounded-card border border-line-base text-left active:bg-surface-card"
              >
                <div
                  className="w-9 h-9 rounded-card flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: base.icon === 'inbox' ? '#F8F8F8' : base.color + '22' }}
                >
                  {base.id === QUICK_NOTES_KB_ID ? (
                    <PenLine size={17} className="text-brand-orange" />
                  ) : base.icon === 'inbox' ? (
                    <Inbox size={17} className="text-[#9CA3AF]" />
                  ) : (
                    base.icon
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-card-title text-ink-primary truncate">{base.name}</p>
                  <p className="text-caption text-ink-placeholder">{base.fileCount} 个内容</p>
                </div>
                <ChevronRight size={15} className="text-ink-placeholder" />
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      <Toast />
      <ConfirmDialog />
    </div>
  )
}
