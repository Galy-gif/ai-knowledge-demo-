import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import BottomSheet from '../ui/BottomSheet'

export const TEMPLATE_ALL_FEATURES: Record<string, string[]> = {
  'diet-log': ['食物库', '热量记录', '营养分析', '体重曲线', '食谱推荐', '食材采购清单'],
  'fitness-planner': ['训练日程', '动作库', '力量记录', '心率跟踪', '训练计划生成', '身体指标曲线'],
  'fund-portfolio': ['资产总览', '持仓明细', '收益曲线', '风险分析', '调仓建议', '行业分布'],
  'travel-plan': ['行程时间线', '景点收藏', '预算跟踪', 'AI 推荐', '攻略整理', '同行人协作', '离线地图'],
  'interview-bank': ['题目集', '刷题进度', '复盘笔记', '标签分类', '错题归档', '模拟测试'],
}

const DEFAULT_FEATURES = ['功能 A', '功能 B', '功能 C']
const MAX_SELECT = 6

interface FeaturesEditSheetProps {
  open: boolean
  templateId?: string
  selectedFeatures: string[]
  onClose: () => void
  onApply: (features: string[]) => void
}

export default function FeaturesEditSheet({
  open,
  templateId,
  selectedFeatures,
  onClose,
  onApply,
}: FeaturesEditSheetProps) {
  const allFeatures = (templateId ? TEMPLATE_ALL_FEATURES[templateId] : undefined) ?? DEFAULT_FEATURES
  const [draft, setDraft] = useState<string[]>([])

  useEffect(() => {
    if (open) setDraft(selectedFeatures)
  }, [open, selectedFeatures])

  const toggle = (f: string) => {
    setDraft(prev => {
      if (prev.includes(f)) {
        if (prev.length <= 1) return prev
        return prev.filter(x => x !== f)
      }
      if (prev.length >= MAX_SELECT) return prev
      return [...prev, f]
    })
  }

  const canComplete = draft.length >= 1

  const handleComplete = () => {
    if (!canComplete) return
    onApply(draft)
    onClose()
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="功能模块"
      titleAlign="center"
      titleClassName="text-[17px] leading-6 font-semibold text-ink-primary"
      headerLeft={
        <button onClick={onClose} className="text-[14px] text-ink-secondary">取消</button>
      }
      headerRight={
        <button
          onClick={handleComplete}
          className={`text-[14px] font-medium ${canComplete ? 'text-brand-orange' : 'text-ink-placeholder'}`}
        >
          完成
        </button>
      }
    >
      <div className="px-5 pt-3 pb-6">
        <p className="text-caption text-ink-secondary text-center mb-5">
          选择想要的功能，至少 1 个，最多 {MAX_SELECT} 个
        </p>
        <div className="space-y-2">
          {allFeatures.map(f => {
            const selected = draft.includes(f)
            const atMax = !selected && draft.length >= MAX_SELECT
            return (
              <button
                key={f}
                onClick={() => toggle(f)}
                disabled={atMax}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-card border text-left transition-colors ${
                  selected
                    ? 'border-brand-orange bg-[#FFF1E6]'
                    : atMax
                      ? 'border-line-base bg-surface-card opacity-50 cursor-default'
                      : 'border-line-base bg-white active:bg-surface-card'
                }`}
              >
                <span className={`text-body font-medium ${selected ? 'text-brand-orange' : 'text-ink-primary'}`}>
                  {f}
                </span>
                {selected && (
                  <div className="w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
        <p className="text-caption text-ink-placeholder text-center mt-4">
          已选 {draft.length} / {MAX_SELECT}
        </p>
      </div>
    </BottomSheet>
  )
}
