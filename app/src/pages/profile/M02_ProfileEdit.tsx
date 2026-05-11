import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Pen,
  AtSign,
  Monitor,
  Link2,
  Cloud,
  RefreshCw,
  ChevronRight,
} from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import TopHeader from '../../components/layout/TopHeader'
import ListItem from '../../components/common/ListItem'
import { useUser } from '../../context/UserContext'

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

export default function M02_ProfileEdit() {
  const navigate = useNavigate()
  const { user, setUser, showToast, showConfirm } = useUser()

  const [editingName, setEditingName] = useState(false)
  const [draftName, setDraftName] = useState(user.name)

  const saveName = () => {
    if (draftName.trim() && draftName !== user.name) {
      setUser({ ...user, name: draftName.trim() })
      showToast('昵称已更新')
    }
    setEditingName(false)
  }

  const handleLogout = () => {
    showConfirm({
      title: '退出登录',
      description: '确认退出当前账号？',
      confirmText: '退出登录',
      cancelText: '取消',
      danger: true,
      onConfirm: () => navigate('/profile'),
    })
  }

  return (
    <PageLayout>
      <div className="bg-surface-card min-h-full pb-8">
        <TopHeader title="个人资料" showBack />

        {/* 用户小结行 */}
        <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-line-base">
          <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0">
            <User size={18} className="text-white" />
          </div>
          <div>
            <p className="text-body font-medium text-ink-primary">{user.name}</p>
            <p className="text-caption text-ink-placeholder">已登录 · 云端已同步</p>
          </div>
        </div>

        {/* ── 基本信息 ── */}
        <div className="px-4">
          <SectionHeader title="基本信息" />
          <SectionCard>
            {/* 头像 */}
            <button
              onClick={() => navigate('/coming-soon')}
              className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-line-base active:bg-surface-card text-left"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <User size={18} className="text-ink-secondary" />
              </div>
              <span className="flex-1 text-body text-ink-primary">头像</span>
              <div className="flex items-center gap-2">
                <span className="text-caption text-ink-placeholder">点击可更换头像</span>
                <div className="w-7 h-7 rounded-full bg-brand-orange flex items-center justify-center">
                  <User size={13} className="text-white" />
                </div>
                <ChevronRight size={16} className="text-ink-placeholder -mr-1" />
              </div>
            </button>

            {/* 昵称 — 内联编辑 */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line-base">
              <div className="w-8 h-8 flex items-center justify-center">
                <Pen size={18} className="text-ink-secondary" />
              </div>
              <span className="flex-1 text-body text-ink-primary">昵称</span>
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={draftName}
                    onChange={e => setDraftName(e.target.value)}
                    onBlur={saveName}
                    onKeyDown={e => e.key === 'Enter' && saveName()}
                    autoFocus
                    className="text-body text-ink-primary text-right outline-none bg-transparent w-32"
                  />
                  <button onClick={saveName} className="text-caption text-brand-orange font-medium">
                    保存
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingName(true)}
                  className="flex items-center gap-2"
                >
                  <span className="text-caption text-ink-secondary">{user.name}</span>
                  <ChevronRight size={16} className="text-ink-placeholder -mr-1" />
                </button>
              )}
            </div>

            {/* 账号 ID / 邮箱 */}
            <ListItem
              icon={AtSign}
              label="账号 ID / 邮箱"
              description="用于记录账号"
              value={user.email}
              onClick={() => navigate('/coming-soon')}
              last
            />
          </SectionCard>
        </div>

        {/* ── 账号安全 ── */}
        <div className="px-4">
          <SectionHeader title="账号安全" />
          <SectionCard>
            <ListItem
              icon={Monitor}
              label="登录设备"
              description="查看当前登录设备"
              onClick={() => navigate('/coming-soon')}
            />
            <ListItem
              icon={Link2}
              label="账号绑定"
              description="邮箱 / 手机 / 第三方账号"
              onClick={() => navigate('/coming-soon')}
              last
            />
          </SectionCard>
        </div>

        {/* ── 同步状态 ── */}
        <div className="px-4">
          <SectionHeader title="同步状态" />
          <SectionCard>
            <ListItem
              icon={Cloud}
              label="云端同步"
              value="已开启"
              onClick={() => navigate('/coming-soon')}
            />
            <ListItem
              icon={RefreshCw}
              label="最近同步"
              value="今天 18:30"
              showArrow={false}
              last
            />
          </SectionCard>
        </div>

        {/* ── 退出登录 ── */}
        <div className="px-4 mt-8">
          <button
            onClick={handleLogout}
            className="w-full py-4 text-body font-medium text-red-500 bg-white rounded-card border border-line-base shadow-card active:opacity-80 transition-opacity"
          >
            退出登录
          </button>
        </div>

      </div>
    </PageLayout>
  )
}
