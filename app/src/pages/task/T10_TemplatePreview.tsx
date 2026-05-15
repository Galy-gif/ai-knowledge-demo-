import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Sparkles } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import { getPwaTemplateById } from '../../mock/pwaTemplates'

export default function T10_TemplatePreview() {
  const navigate = useNavigate()
  const { id } = useParams()
  const template = getPwaTemplateById(id)

  if (!template) {
    return (
      <PageLayout>
        <div className="h-full bg-white">
          <div className="h-14 px-4 flex items-center border-b border-line-base">
            <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-ink-secondary">
              <ChevronLeft size={24} />
            </button>
            <h1 className="flex-1 text-center text-h2 text-ink-primary">模板预览</h1>
            <div className="w-6" />
          </div>
          <div className="py-20 text-center">
            <p className="text-body text-ink-secondary">模板不存在</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="h-full flex flex-col bg-surface-card">
        <div className="h-14 px-4 flex items-center bg-white border-b border-line-base flex-shrink-0">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-ink-secondary">
            <ChevronLeft size={24} />
          </button>
          <h1 className="flex-1 text-center text-h2 text-ink-primary">模板预览</h1>
          <div className="w-6" />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto bg-brand-orange-light rounded-card-xl flex items-center justify-center text-4xl mb-4">
              {template.icon}
            </div>
            <h2 className="text-h1 text-ink-primary">{template.name}</h2>
            <p className="text-body text-ink-secondary mt-2">{template.coreFeatures}</p>
          </div>

          <div className="bg-white rounded-card-lg border border-line-base shadow-card overflow-hidden mb-5">
            <div className="px-4 py-3 border-b border-line-base flex items-center gap-2">
              <Sparkles size={16} className="text-brand-orange" />
              <span className="text-card-title text-ink-primary">模板包含</span>
            </div>
            {template.coreFeatures.split('、').map(feature => (
              <div key={feature} className="px-4 py-3 border-b border-line-base last:border-0">
                <p className="text-body text-ink-primary">{feature}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/ask/task-generate-confirm', {
              state: {
                requirement: template.requirement,
                templateId: template.id,
              },
            })}
            className="w-full py-4 bg-brand-orange text-white rounded-btn text-body font-medium"
          >
            立即使用模板
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
