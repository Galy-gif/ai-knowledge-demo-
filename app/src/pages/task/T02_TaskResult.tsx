import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { Layers, ArrowLeft, Sparkles } from 'lucide-react'
import { findMatchingPwaTemplate } from '../../mock/pwaTemplates'

export default function T02_TaskResult() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const requirement = state?.requirement || '帮我做一个竞品数据速查工具'
  const selectedKbIds: string[] = state?.selectedKbIds ?? []
  const selectedKbNames: string[] = state?.selectedKbNames ?? []
  const matchedTemplate = findMatchingPwaTemplate(requirement)
  const [customMode, setCustomMode] = useState(false)
  const sourceLabel = selectedKbNames.length === 0
    ? '未限定资料包'
    : selectedKbNames.length === 1
      ? selectedKbNames[0]
      : `${selectedKbNames.length} 个资料包`

  return (
    <PageLayout>
      <TopHeader title="任务分析" showBack />
      <div className="px-5 py-4 space-y-4">
        {/* User message */}
        <div className="bg-surface-card rounded-card p-4">
          <p className="text-body font-medium text-ink-primary">{requirement}</p>
          {selectedKbNames.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-micro text-ink-placeholder self-center">数据源</span>
              {selectedKbNames.map(name => (
                <span key={name} className="text-micro px-2 py-0.5 bg-brand-orange-light text-brand-orange rounded-pill">
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* AI response */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center">
              <span className="text-white text-micro font-bold">AI</span>
            </div>
            <span className="text-caption text-ink-placeholder">任务分析完成</span>
          </div>

          {matchedTemplate && !customMode ? (
            <div className="rounded-card border border-brand-orange/45 bg-brand-orange/[0.03] p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-card bg-brand-orange-light flex items-center justify-center text-xl flex-shrink-0">
                  {matchedTemplate.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body text-ink-primary leading-relaxed">
                    我在模板库找到一个匹配的模板「{matchedTemplate.name}」，包含 {matchedTemplate.coreFeatures}，是否直接使用？
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      onClick={() => navigate('/ask/task-generating', {
                        state: {
                          requirement: matchedTemplate.requirement,
                          templateId: matchedTemplate.id,
                          selectedKbIds,
                          selectedKbNames,
                        },
                      })}
                      className="py-2.5 bg-brand-orange text-white rounded-btn text-body font-medium"
                    >
                      使用模板
                    </button>
                    <button
                      onClick={() => setCustomMode(true)}
                      className="py-2.5 border border-line-base bg-white text-ink-secondary rounded-btn text-body"
                    >
                      我要自定义
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {customMode && matchedTemplate && (
                <div className="flex items-center gap-2 px-3 py-2 bg-surface-card rounded-card">
                  <Sparkles size={14} className="text-brand-orange" />
                  <p className="text-caption text-ink-secondary">已切换为自定义生成流程</p>
                </div>
              )}
              <p className="text-body text-ink-secondary leading-relaxed">
                我理解你想要一个能快速检索竞品数据的工具。基于你的工作资料库，我可以生成一个专属的小应用：
              </p>

              <div className="bg-white rounded-card border border-line-base p-4 space-y-2">
                <p className="text-card-title text-ink-primary">📊 资料速查工具</p>
                <p className="text-caption text-ink-secondary">基于你的「{sourceLabel}」生成</p>
                <div className="space-y-1.5 mt-2">
                  {['快速检索竞品核心指标', '自动生成对比表格', '支持多维度筛选'].map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
                        <span className="text-white" style={{ fontSize: 9 }}>✓</span>
                      </div>
                      <p className="text-caption text-ink-secondary">{f}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {(!matchedTemplate || customMode) && <div className="pt-2 space-y-2">
          <button
            onClick={() => navigate('/ask/task-generate-confirm', { state: { requirement, selectedKbIds, selectedKbNames } })}
            className="w-full flex items-center justify-center gap-2 py-4 bg-brand-orange text-white rounded-btn text-body font-medium"
          >
            <Layers size={18} />
            生成小应用
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-surface-card text-ink-secondary rounded-btn text-body"
          >
            <ArrowLeft size={16} />
            调整需求
          </button>
        </div>}
      </div>
    </PageLayout>
  )
}
