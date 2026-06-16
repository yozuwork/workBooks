import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../plan-practice.css'
import PlanPage from './PlanPage'
import PracticePage from './PracticePage'

export default function DivePlanPage() {
  const [tab, setTab] = useState('plan')
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  return (
    <div className="overview-tabs">
      <div className="overview-tab-bar" style={{ alignItems: 'center' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', fontSize: 12, color: '#6b7280', flexShrink: 0 }}>
          <button
            onClick={() => navigate('/frontend-practice')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 12, padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = '#6bf7e3'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
          >
            前端習題
          </button>
          <span style={{ color: '#4b5563' }}>/</span>
          <span style={{ color: '#e5e7eb', fontWeight: 500 }}>六個月前端成長計畫</span>
        </div>

        <div style={{ width: 1, height: 20, background: '#2a2d35', flexShrink: 0 }} />

        {/* Tabs */}
        <button
          className={'overview-tab-btn' + (tab === 'plan' ? ' active' : '')}
          onClick={() => setTab('plan')}
        >
          🌊 成長計畫
        </button>
        <button
          className={'overview-tab-btn' + (tab === 'practice' ? ' active' : '')}
          onClick={() => setTab('practice')}
        >
          📚 練習題庫
        </button>
      </div>
      <div className="overview-tab-content" ref={scrollRef}>
        {tab === 'plan'
          ? <PlanPage scrollEl={scrollRef} />
          : <PracticePage />
        }
      </div>
    </div>
  )
}
