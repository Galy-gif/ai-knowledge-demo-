import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  User,
  Clock,
  Bookmark,
  Globe2,
  Layers,
  Shield,
  Settings,
  HelpCircle,
  Info,
  Inbox,
} from 'lucide-react'
import TabLayout from '../../components/layout/TabLayout'
import ListItem from '../../components/common/ListItem'
import { useUser } from '../../context/UserContext'
import { useKnowledge } from '../../context/KnowledgeContext'

function SectionHeader({ title }: { title: string }) {
  return (
    <p className="text-caption text-ink-placeholder font-medium px-1 pt-5 pb-2">{title}</p>
  )
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-card border border-line-base overflow-hidden shadow-card">
      {children}
    </div>
  )
}

export default function M01_ProfileHome() {
  const navigate = useNavigate()
  const { user, showConfirm } = useUser()
  const { files } = useKnowledge()

  const totalFiles = files.length

  const handleLogout = () => {
    showConfirm({
      title: '退出登录',
      description: '确认退出当前账号？退出后本地未同步内容不会丢失。',
      confirmText: '退出登录',
      cancelText: '取消',
      danger: true,
      onConfirm: () => {},
    })
  }

  return (
    <TabLayout>
      <div className="bg-surface-card min-h-full pb-6">

        {/* ── 顶部用户行 ── */}
        <button
          onClick={() => navigate('/profile/edit')}
          className="w-full flex items-center gap-4 px-5 py-5 bg-white"
        >
          {/* 头像：橙色背景，仅此处用橙 */}
          <div className="w-14 h-14 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0 shadow-card">
            <User size={24} className="text-white" />
          </div>

          <div className="flex-1 min-w-0 text-left">
            <p className="text-[17px] font-semibold text-ink-primary leading-tight">{user.name}</p>
            <p className="text-caption text-ink-placeholder mt-1">
              已登录 · 云端已同步 · 今天 18:30
            </p>
          </div>

          <ChevronRight size={18} className="text-ink-placeholder flex-shrink-0" />
        </button>

        {/* ── 我的数据 ── */}
        <div className="px-4">
          <SectionHeader title="我的数据" />
          <div className="grid grid-cols-1 gap-3">
            {/* 入库内容 */}
            <button
              onClick={() => navigate('/knowledge')}
              className="bg-white rounded-card border border-line-base shadow-card px-5 py-4 flex items-start justify-between"
            >
              <div>
                <p className="text-[28px] font-bold text-ink-primary leading-none">{totalFiles}</p>
                <p className="text-caption text-ink-placeholder mt-1.5">入库内容</p>
              </div>
              <Inbox size={22} className="text-ink-placeholder mt-1" />
            </button>
          </div>
        </div>

        {/* ── 我的内容 ── */}
        <div className="px-4">
          <SectionHeader title="我的内容" />
          <SectionCard>
            <ListItem
              icon={Clock}
              label="历史记录"
              description="最近浏览: AI 浏览足迹"
              onClick={() => navigate('/coming-soon')}
            />
            <ListItem
              icon={Bookmark}
              label="收藏 / 入库记录"
              onClick={() => navigate('/coming-soon')}
            />
            <ListItem
              icon={Globe2}
              label="已发布的兴趣库"
              description="管理发布到兴趣圈子的兴趣库"
              onClick={() => navigate('/coming-soon')}
            />
            <ListItem
              icon={Layers}
              label="我的小应用"
              badge={
                /* 仅此处用橙色徽章 */
                <span className="flex items-center gap-0.5 text-micro text-brand-orange font-medium bg-brand-orange-light px-2 py-0.5 rounded-pill">
                  ↑ 1
                </span>
              }
              onClick={() => navigate('/profile/my-apps')}
              last
            />
          </SectionCard>
        </div>

        {/* ── 服务与管理 ── */}
        <div className="px-4">
          <SectionHeader title="服务与管理" />
          <SectionCard>
            <ListItem
              icon={Globe2}
              label="发现兴趣库"
              description="浏览公开的兴趣库"
              onClick={() => navigate('/coming-soon')}
            />
            <ListItem
              icon={Shield}
              label="数据与隐私"
              onClick={() => navigate('/coming-soon')}
            />
            <ListItem
              icon={Settings}
              label="通用设置"
              onClick={() => navigate('/coming-soon')}
            />
            <ListItem
              icon={User}
              label="帐号与安全"
              description="个人资料、使用设备、帐号绑定"
              onClick={() => navigate('/profile/edit')}
            />
            <ListItem
              icon={HelpCircle}
              label="帮助与反馈"
              description="功能建议、用户协议、联系我们"
              onClick={() => navigate('/coming-soon')}
            />
            <ListItem
              icon={Info}
              label="关于"
              value="v0.1.0"
              onClick={() => navigate('/coming-soon')}
              last
            />
          </SectionCard>
        </div>

        {/* ── 退出登录 ── */}
        <div className="px-4 mt-3">
          <SectionCard>
            <ListItem
              label="退出登录"
              onClick={handleLogout}
              danger
              showArrow={false}
              last
            />
          </SectionCard>
        </div>

      </div>
    </TabLayout>
  )
}
