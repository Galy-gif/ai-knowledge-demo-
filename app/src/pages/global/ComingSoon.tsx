import { useNavigate } from 'react-router-dom'
import { Wrench } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'

export default function ComingSoon() {
  const navigate = useNavigate()
  return (
    <PageLayout>
      <TopHeader title="" showBack />
      <div className="flex flex-col items-center justify-center flex-1 px-8 text-center py-20">
        <div className="w-16 h-16 bg-surface-card rounded-card-xl flex items-center justify-center mb-5">
          <Wrench size={28} className="text-ink-placeholder" />
        </div>
        <h2 className="text-h2 text-ink-primary mb-2">开发中</h2>
        <p className="text-body text-ink-secondary mb-8">该功能正在建设中，敬请期待</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-surface-card text-ink-secondary rounded-btn text-body"
        >
          返回
        </button>
      </div>
    </PageLayout>
  )
}
