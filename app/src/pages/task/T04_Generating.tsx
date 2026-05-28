import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { useApps } from '../../context/AppsContext'
import type { TravelPreferences } from '../../mock/data'

interface Step { label: string; desc: string }

const DEFAULT_STEPS: Step[] = [
  { label: '解析需求', desc: '理解任务目标与数据范围' },
  { label: '读取兴趣库', desc: '从工作资料中提取关键数据' },
  { label: '设计界面', desc: '生成专属交互界面' },
  { label: '编写逻辑', desc: '实现检索与对比功能' },
  { label: '测试验证', desc: '确保功能可用性' },
]

const TEMPLATE_STEPS: Record<string, Step[]> = {
  'diet-log': [
    { label: '分析需求', desc: '理解你的饮食打卡需求' },
    { label: '构建结构', desc: '搭建热量与营养记录框架' },
    { label: '连接数据', desc: '对接「健康计划」兴趣库' },
    { label: '生成界面', desc: '设计日常打卡视图' },
    { label: '完成部署', desc: '应用就绪' },
  ],
  'fitness-planner': [
    { label: '分析需求', desc: '理解你的训练跟踪需求' },
    { label: '构建结构', desc: '搭建训练量与身体指标框架' },
    { label: '连接数据', desc: '对接「健身资料」兴趣库' },
    { label: '生成界面', desc: '设计训练打卡视图' },
    { label: '完成部署', desc: '应用就绪' },
  ],
  'watchlist-helper': [
    { label: '分析需求', desc: '理解你的追剧口味与追更习惯' },
    { label: '构建结构', desc: '搭建片单收藏与观看进度框架' },
    { label: '连接数据', desc: '对接「电影深度评论」兴趣库' },
    { label: '生成界面', desc: '设计追剧看板与评分视图' },
    { label: '完成部署', desc: '应用就绪' },
  ],
  'reading-shelf': [
    { label: '分析需求', desc: '理解你的阅读偏好与节奏' },
    { label: '构建结构', desc: '搭建稍后读清单与进度框架' },
    { label: '连接数据', desc: '对接「读书摘录」收藏内容' },
    { label: '生成界面', desc: '设计阅读燃尽与推荐视图' },
    { label: '完成部署', desc: '应用就绪' },
  ],
  'doc-pack': [
    { label: '分析需求', desc: '理解你的资料聚合需求' },
    { label: '构建结构', desc: '搭建多标签与主题归类框架' },
    { label: '连接数据', desc: '聚合多标签页与收藏资料' },
    { label: '生成界面', desc: '设计资料包与处理进度视图' },
    { label: '完成部署', desc: '应用就绪' },
  ],
  'interview-bank': [
    { label: '分析需求', desc: '理解你的备考需求' },
    { label: '构建结构', desc: '搭建题目与掌握度框架' },
    { label: '连接数据', desc: '对接「面试资料」兴趣库' },
    { label: '生成界面', desc: '设计题库学习视图' },
    { label: '完成部署', desc: '应用就绪' },
  ],
  'travel-plan': [
    { label: '理解您的旅行偏好', desc: '解析预算、酒店、行程风格与同行人' },
    { label: '构建结构', desc: '搭建行程与预算框架' },
    { label: '连接数据', desc: '对接「日本旅行攻略」兴趣库' },
    { label: '生成界面', desc: '设计每日行程视图' },
    { label: '完成部署', desc: '应用就绪' },
  ],
}

export default function T04_Generating() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { updateApp } = useApps()
  const templateId: string | undefined = state?.templateId
  const templateName: string | undefined = state?.templateName
  const templateIcon: string | undefined = state?.templateIcon
  const templateCoreFeatures: string | undefined = state?.templateCoreFeatures
  const requirement: string | undefined = state?.requirement
  const targetRuntimeType: string | undefined = state?.targetRuntimeType
  const resultAppName: string | undefined = state?.resultAppName
  const resultAppId: string | undefined = state?.resultAppId
  const resultMainColor: string | undefined = state?.resultMainColor
  const selectedKbIds: string[] = state?.selectedKbIds ?? []
  const selectedKbNames: string[] = state?.selectedKbNames ?? []
  const selectedFeatures: string[] | undefined = state?.selectedFeatures
  const selectedAccessModes: string[] | undefined = state?.selectedAccessModes
  const customRequirement: string | undefined = state?.customRequirement
  const travelPreferences: TravelPreferences | undefined = state?.travelPreferences
  const sourcePath: string | undefined = state?.sourcePath
  const sourceState = state?.sourceState

  const baseSteps = TEMPLATE_STEPS[templateId ?? ''] ?? DEFAULT_STEPS
  const steps: Step[] = customRequirement
    ? [
        baseSteps[0],
        { label: '识别补充需求', desc: `识别到补充需求：${customRequirement.slice(0, 20)}${customRequirement.length > 20 ? '...' : ''}` },
        ...baseSteps.slice(1),
      ]
    : baseSteps

  const [currentStep, setCurrentStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(timer)
          setDone(true)
          if (resultAppId && (travelPreferences || customRequirement !== undefined)) {
            updateApp(resultAppId, {
              ...(travelPreferences ? { travelPreferences } : {}),
              ...(customRequirement !== undefined ? { customRequirement } : {}),
            })
          }
          setTimeout(() => navigate('/ask/task-datasource', {
            replace: true,
            state: {
              requirement, templateId, templateName, templateIcon, templateCoreFeatures,
              targetRuntimeType, resultAppName, resultAppId, resultMainColor,
              selectedKbIds, selectedKbNames,
              selectedFeatures, selectedAccessModes, customRequirement,
              travelPreferences,
              sourcePath, sourceState,
            },
          }), 1000)
          return prev
        }
        return prev + 1
      })
    }, 1500)
    return () => clearInterval(timer)
  }, [])

  const progress = Math.round((currentStep / (steps.length - 1)) * 100)

  return (
    <PageLayout>
      <TopHeader title="正在生成" />
      <div className="flex flex-col items-center px-8 py-8 gap-6">
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

        <div className="text-center">
          <p className="text-h2 text-ink-primary">{steps[currentStep]?.label}</p>
          <p className="text-body text-ink-secondary mt-1">{steps[currentStep]?.desc}</p>
          {selectedKbNames.length > 0 && (
            <p className="text-caption text-ink-placeholder mt-2">
              基于 {selectedKbNames.length === 1 ? selectedKbNames[0] : `${selectedKbNames.length} 个兴趣库`}
            </p>
          )}
        </div>

        <div className="w-full space-y-3">
          {steps.map((step, i) => (
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
