import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import { useApps } from '../../context/AppsContext'

export default function T08_MyApps() {
  const navigate = useNavigate()
  const { apps, setActiveApp } = useApps()

  return (
    <PageLayout>
      <TopHeader title="我的轻应用" showBack />
      <div className="px-5 py-4 space-y-3">
        {apps.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="text-5xl mb-4">⚡</div>
            <p className="text-body text-ink-secondary mb-1">还没有轻应用</p>
            <p className="text-caption text-ink-placeholder mb-6">通过任务模式生成专属工具</p>
            <button onClick={() => navigate('/ask/task-mode')}
              className="px-6 py-3 bg-brand-orange text-white rounded-btn text-body font-medium">
              去创建
            </button>
          </div>
        ) : (
          <>
            {apps.map(app => (
              <button
                key={app.id}
                onClick={() => {
                  setActiveApp(app)
                  navigate(`/pwa/run/${app.id}`)
                }}
                className="w-full flex items-center gap-3 p-4 bg-white rounded-card border border-line-base shadow-card text-left">
                <div className="w-12 h-12 bg-brand-orange-light rounded-card-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-card-title text-ink-primary">{app.name}</p>
                  <p className="text-caption text-ink-placeholder mt-0.5 truncate">{app.description}</p>
                  <p className="text-micro text-ink-placeholder mt-1">上次打开 {app.lastOpenedAt}</p>
                </div>
                <ChevronRight size={16} className="text-ink-placeholder flex-shrink-0" />
              </button>
            ))}
            <button onClick={() => navigate('/ask/task-mode')}
              className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-line-base rounded-card text-brand-orange text-body">
              <Plus size={18} />
              新建轻应用
            </button>
          </>
        )}
      </div>
    </PageLayout>
  )
}
