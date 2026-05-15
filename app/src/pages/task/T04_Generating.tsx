import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'

const STEPS = [
  { label: '解析需求', desc: '理解任务目标与数据范围' },
  { label: '读取知识库', desc: '从工作资料中提取关键数据' },
  { label: '设计界面', desc: '生成专属交互界面' },
  { label: '编写逻辑', desc: '实现检索与对比功能' },
  { label: '测试验证', desc: '确保功能可用性' },
]

export default function T04_Generating() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const templateId: string | undefined = state?.templateId
  const templateName: string | undefined = state?.templateName
  const templateIcon: string | undefined = state?.templateIcon
  const templateCoreFeatures: string | undefined = state?.templateCoreFeatures
  const requirement: string | undefined = state?.requirement
  const selectedKbIds: string[] = state?.selectedKbIds ?? []
  const selectedKbNames: string[] = state?.selectedKbNames ?? []
  const sourcePath: string | undefined = state?.sourcePath
  const sourceState = state?.sourceState
  const [currentStep, setCurrentStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= STEPS.length - 1) {
          clearInterval(timer)
          setDone(true)
          setTimeout(() => navigate('/ask/task-datasource', {
            replace: true,
            state: { requirement, templateId, templateName, templateIcon, templateCoreFeatures, selectedKbIds, selectedKbNames, sourcePath, sourceState },
          }), 1000)
          return prev
        }
        return prev + 1
      })
    }, 800)
    return () => clearInterval(timer)
  }, [])

  const progress = Math.round((currentStep / (STEPS.length - 1)) * 100)

  return (
    <PageLayout>
      <TopHeader title="正在生成" />
      <div className="flex flex-col items-center px-8 py-8 gap-6">
        {/* Progress circle */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#EEEEEE" strokeWidth="6" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#FF7A00" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-h1 text-brand-orange font-bold">{progress}%</span>
            <span className="text-micro text-ink-placeholder">生成中</span>
          </div>
        </div>

        {/* Current step */}
        <div className="text-center">
          <p className="text-h2 text-ink-primary">{STEPS[currentStep]?.label}</p>
          <p className="text-body text-ink-secondary mt-1">{STEPS[currentStep]?.desc}</p>
          {selectedKbNames.length > 0 && (
            <p className="text-caption text-ink-placeholder mt-2">
              基于 {selectedKbNames.length === 1 ? selectedKbNames[0] : `${selectedKbNames.length} 个知识库`}
            </p>
          )}
        </div>

        {/* Steps list */}
        <div className="w-full space-y-3">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-micro font-medium ${
                i < currentStep ? 'bg-brand-orange text-white' :
                i === currentStep ? 'border-2 border-brand-orange text-brand-orange' :
                'border-2 border-line-base text-ink-placeholder'
              }`}>
                {i < currentStep ? '✓' : i + 1}
              </div>
              <div className="flex-1">
                <p className={`text-body ${i <= currentStep ? 'text-ink-primary' : 'text-ink-placeholder'}`}>{step.label}</p>
              </div>
              {i === currentStep && !done && (
                <div className="flex gap-0.5">
                  {[0, 1, 2].map(j => (
                    <div key={j} className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce"
                      style={{ animationDelay: `${j * 0.1}s` }} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
