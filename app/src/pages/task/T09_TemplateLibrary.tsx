import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Search } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import TemplateCard from '../../components/common/TemplateCard'
import {
  pwaTemplateCategories,
  pwaTemplates,
  type PwaTemplate,
  type PwaTemplateCategory,
} from '../../mock/pwaTemplates'

type CategoryFilter = typeof pwaTemplateCategories[number]

export default function T09_TemplateLibrary() {
  const navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('全部')

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return pwaTemplates.filter(template => {
      const categoryMatched = category === '全部' || template.category === category
      const searchMatched = !keyword || [
        template.name,
        template.category,
        template.tag,
        template.coreFeatures,
        ...template.keywords,
      ].some(text => text.toLowerCase().includes(keyword))
      return categoryMatched && searchMatched
    })
  }, [category, query])

  const grouped = useMemo(() => {
    return filtered.reduce<Record<PwaTemplateCategory, PwaTemplate[]>>((acc, template) => {
      if (!acc[template.category]) acc[template.category] = []
      acc[template.category].push(template)
      return acc
    }, {} as Record<PwaTemplateCategory, PwaTemplate[]>)
  }, [filtered])

  const categories = pwaTemplateCategories.filter(item => item === '全部' || grouped[item as PwaTemplateCategory]?.length || category === item)

  const generateTemplate = (template: PwaTemplate) => {
    navigate('/ask/task-generate-confirm', {
      state: {
        requirement: template.requirement,
        templateId: template.id,
      },
    })
  }

  return (
    <PageLayout>
      <div className="h-full flex flex-col bg-surface-card">
        <div className="bg-white border-b border-line-base flex-shrink-0">
          <div className="h-14 px-4 flex items-center">
            <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-ink-secondary">
              <ChevronLeft size={24} />
            </button>
            <h1 className="flex-1 text-center text-h2 text-ink-primary">小应用模板库</h1>
            <button onClick={() => setShowSearch(v => !v)} className="p-1 text-ink-secondary">
              <Search size={20} />
            </button>
          </div>

          {showSearch && (
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-card rounded-pill">
                <Search size={16} className="text-ink-placeholder" />
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="搜索模板..."
                  autoFocus
                  className="flex-1 bg-transparent text-body text-ink-primary outline-none placeholder:text-ink-placeholder"
                />
              </div>
            </div>
          )}

          <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {pwaTemplateCategories.map(item => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-3 py-1.5 rounded-pill text-caption whitespace-nowrap flex-shrink-0 transition-colors ${
                  category === item
                    ? 'bg-brand-orange text-white'
                    : 'bg-surface-card text-ink-secondary'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
          {categories
            .filter(item => item !== '全部')
            .map(item => {
              const list = grouped[item as PwaTemplateCategory] ?? []
              if (list.length === 0) return null
              return (
                <section key={item} className="mb-5">
                  <h2 className="text-[13px] leading-5 text-ink-secondary mb-2">{item}</h2>
                  {list.map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      variant="list"
                      onClick={() => navigate(`/pwa/template/${template.id}`)}
                      onGenerate={() => generateTemplate(template)}
                    />
                  ))}
                </section>
              )
            })}

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-body text-ink-secondary">没有找到相关模板</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
