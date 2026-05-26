import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Link as LinkIcon } from 'lucide-react'
import Toast from '../../components/common/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useUser } from '../../context/UserContext'

export default function K16_AddFromThirdParty() {
  const navigate = useNavigate()
  const { showToast } = useUser()
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  const disabled = value.trim().length === 0

  const handleAdd = () => {
    if (disabled) return
    showToast('已添加链接到兴趣库')
    setValue('')
    setTimeout(() => navigate(-1), 500)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleAdd()
  }

  return (
    <div className="flex flex-col h-full relative bg-white">
      <div className="h-14 flex items-center px-4 bg-white border-b border-line-base flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 mr-2 text-ink-secondary">
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-h2 text-ink-primary truncate">粘贴链接添加</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div style={{ paddingTop: 24, paddingLeft: 20, paddingRight: 20 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <LinkIcon
                size={16}
                strokeWidth={2}
                color={focused ? '#FF7A00' : '#9CA3AF'}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
              <input
                autoFocus
                type="url"
                inputMode="url"
                value={value}
                onChange={e => setValue(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="粘贴或输入链接"
                style={{
                  width: '100%',
                  backgroundColor: focused ? '#FFFFFF' : '#F8F8F8',
                  border: focused ? '1.5px solid #FF7A00' : '1px solid #EEEEEE',
                  borderRadius: 12,
                  padding: focused ? '11.5px 14px 11.5px 37.5px' : '12px 14px 12px 38px',
                  fontSize: 13,
                  lineHeight: '20px',
                  color: '#1A1A1A',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={disabled}
              style={{
                backgroundColor: disabled ? '#FFD4B0' : '#FF7A00',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 500,
                padding: '0 18px',
                borderRadius: 12,
                border: 'none',
                cursor: disabled ? 'default' : 'pointer',
                flexShrink: 0,
                transition: 'background-color 150ms ease',
              }}
            >
              添加
            </button>
          </div>
          <p
            style={{
              marginTop: 10,
              paddingLeft: 4,
              fontSize: 11,
              color: '#9CA3AF',
              lineHeight: 1.5,
            }}
          >
            支持小红书、知乎、B 站、微信公众号等
          </p>
        </div>
      </div>

      <Toast />
      <ConfirmDialog />
    </div>
  )
}
