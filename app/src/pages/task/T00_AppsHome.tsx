import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Plus, RefreshCw } from 'lucide-react'
import TabLayout from '../../components/layout/TabLayout'
import { useApps } from '../../context/AppsContext'
import { pwaTemplates } from '../../mock/pwaTemplates'
import type { RuntimeType } from '../../mock/data'
import type { PwaTemplate } from '../../mock/pwaTemplates'

const ICON_BG: Record<RuntimeType, string> = {
  learning_list: '#DBEAFE',
  data_dashboard: '#D1FAE5',
  daily_tracker: '#EDE9FE',
  travel_planner: '#CCFBF1',
  watchlist: '#FFF1E6',
}

const DEFAULT_HOME_TEMPLATE_IDS = ['diet-log', 'fitness-planner', 'watchlist-helper', 'travel-plan']

const TEMPLATE_TONES: Record<PwaTemplate['category'], { bg: string; color: string }> = {
  财经: { bg: '#DBEAFE', color: '#0C447C' },
  健康: { bg: '#D1FAE5', color: '#0F6E56' },
  职场: { bg: '#E9D5FF', color: '#3C3489' },
  教育: { bg: '#FEF3C7', color: '#7C4D00' },
  生活: { bg: '#FED7AA', color: '#993C1D' },
}

const TEMPLATE_ID_TONES: Record<string, { bg: string; color: string }> = {
  'diet-log': { bg: '#D1FAE5', color: '#0F6E56' },
  'fitness-planner': { bg: '#DBEAFE', color: '#0C447C' },
  'watchlist-helper': { bg: '#FCE7F3', color: '#9F1239' },
  'travel-plan': { bg: '#CCFBF1', color: '#0F766E' },
}

function getDefaultHomeTemplates() {
  return DEFAULT_HOME_TEMPLATE_IDS
    .map(id => pwaTemplates.find(template => template.id === id))
    .filter((template): template is PwaTemplate => Boolean(template))
}

function pickFourTemplates() {
  return [...pwaTemplates]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
}

function getTemplateTone(template: PwaTemplate) {
  if (TEMPLATE_ID_TONES[template.id]) return TEMPLATE_ID_TONES[template.id]
  return TEMPLATE_TONES[template.category]
}

export default function T00_AppsHome() {
  const navigate = useNavigate()
  const { apps, setActiveApp } = useApps()
  const [homeTemplates, setHomeTemplates] = useState<PwaTemplate[]>(() => getDefaultHomeTemplates())
  const [refreshingTemplates, setRefreshingTemplates] = useState(false)

  const openTemplateConfirm = (template: PwaTemplate) => {
    navigate('/pwa/confirm', {
      state: {
        requirement: template.requirement,
        templateId: template.id,
        templateName: template.name,
        templateIcon: template.icon,
        templateCoreFeatures: template.coreFeatures,
        targetRuntimeType: template.targetRuntimeType,
        resultAppName: template.resultAppName,
        resultAppId: template.resultAppId,
        resultMainColor: template.resultMainColor,
        fromSource: 'apps_home_grid',
        selectedKbIds: [],
        selectedKbNames: [],
      },
    })
  }

  const refreshTemplates = () => {
    setRefreshingTemplates(true)
    window.setTimeout(() => {
      setHomeTemplates(pickFourTemplates())
    }, 150)
    window.setTimeout(() => {
      setRefreshingTemplates(false)
    }, 300)
  }

  return (
    <TabLayout>
      <div className="flex h-full flex-col bg-white">
        <div className="px-5 pt-6 pb-3">
          <h1 className="text-h1 text-ink-primary">轻应用</h1>
          <p className="text-caption text-ink-secondary mt-1">把兴趣库的内容变成专属小工具</p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-6">
          <section className="mb-6">
            <h2 className="mb-3 text-[14px] leading-5 font-semibold text-[#1A1A1A]">我的轻应用</h2>
            {apps.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="text-5xl mb-4">⚡</div>
                <p className="text-body text-ink-secondary mb-1">还没有轻应用</p>
                <p className="text-caption text-ink-placeholder mb-6">通过任务模式生成专属工具</p>
                <button
                  onClick={() => navigate('/ask/task-mode')}
                  className="px-6 py-3 bg-brand-orange text-white rounded-btn text-body font-medium"
                >
                  去创建
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {apps.map(app => (
                  <button
                    key={app.id}
                    onClick={() => {
                      setActiveApp(app)
                      navigate(`/pwa/run/${app.id}`)
                    }}
                    className="w-full flex items-center gap-3 p-4 bg-white rounded-card border border-line-base shadow-card text-left"
                  >
                    <div
                      className="w-12 h-12 rounded-card-lg flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: app.runtimeType ? ICON_BG[app.runtimeType] : '#FFF1E6' }}
                    >
                      {app.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-card-title text-ink-primary">{app.name}</p>
                      <p className="text-caption text-ink-placeholder mt-0.5 truncate">{app.description}</p>
                      <p className="text-micro text-ink-placeholder mt-1">上次打开 {app.lastOpenedAt} · 来自「{app.dataSource}」</p>
                    </div>
                    <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] leading-5 font-semibold text-[#1A1A1A]">快速生成轻应用</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={refreshTemplates}
                  className="flex items-center gap-1 text-[12px] leading-4 text-[#9CA3AF]"
                >
                  <RefreshCw size={12} className={refreshingTemplates ? 'animate-[spin_300ms_linear]' : ''} />
                  <span>换一批</span>
                </button>
                <button
                  onClick={() => navigate('/pwa/templates')}
                  aria-label="查看全部轻应用模板"
                  className="flex h-5 w-5 items-center justify-center text-[#FF7A00]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className={`grid grid-cols-2 gap-2.5 transition-opacity duration-150 ${
              refreshingTemplates ? 'opacity-0' : 'opacity-100'
            }`}>
              {homeTemplates.map(template => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => openTemplateConfirm(template)}
                  className="h-[68px] min-w-0 flex items-center gap-3 rounded-[12px] border border-[#EEEEEE] bg-white px-3 py-2.5 text-left active:bg-[#FAFAFA] transition-colors"
                >
                  <span
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[19px] flex-shrink-0"
                    style={{
                      backgroundColor: getTemplateTone(template).bg,
                      color: getTemplateTone(template).color,
                    }}
                  >
                    {template.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] leading-5 font-semibold text-[#1A1A1A]">
                      {template.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] leading-4 text-[#4A4A4A]">
                      {template.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <button
            onClick={() => navigate('/ask/task-mode')}
            className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-line-base rounded-card text-brand-orange text-body"
          >
            <Plus size={18} />
            新建轻应用
          </button>
        </div>
      </div>
    </TabLayout>
  )
}
