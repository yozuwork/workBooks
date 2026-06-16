import { useNavigate } from 'react-router-dom'
import { DATA } from '../data/questions'

const qid = (q) => 'done_m' + q.m + 'w' + q.w + 'd' + q.d

function getDivePlanProgress() {
  const total = DATA.length
  if (!total) return { done: 0, total: 0, pct: 0 }
  let done = 0
  try {
    DATA.forEach(q => { if (localStorage.getItem(qid(q)) === '1') done++ })
  } catch {}
  return { done, total, pct: Math.round((done / total) * 100) }
}

const COURSES = [
  {
    id: 'dive-plan',
    title: '六個月前端成長計畫',
    subtitle: '深潛計畫 · 練習題庫',
    desc: '從 JS/TS 基礎、React 開發、API 串接，到履歷與面試準備，完整六個月路線圖。',
    tags: ['JavaScript', 'TypeScript', 'React', 'API'],
    getProgress: getDivePlanProgress,
    path: '/frontend-practice/dive-plan',
  },
]

export default function OverviewPage() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '32px 28px', minHeight: '100%', background: '#f1f3f5' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 6 }}>前端習題</h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>選擇一個課題開始學習</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {COURSES.map(course => {
            const progress = course.getProgress?.()
            return (
              <div
                key={course.id}
                onClick={() => navigate(course.path)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 16,
                  padding: '22px 22px 20px',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.18s, transform 0.18s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'linear-gradient(135deg, #0a2c44, #1e88b8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, marginBottom: 14,
                }}>
                  🌊
                </div>

                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, fontWeight: 500 }}>
                  {course.subtitle}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8, lineHeight: 1.4 }}>
                  {course.title}
                </div>
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 14 }}>
                  {course.desc}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {course.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, padding: '3px 9px', borderRadius: 99,
                      background: '#f3f4f6', color: '#374151', fontWeight: 500,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Progress bar */}
                {progress && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>練習進度</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: progress.pct === 100 ? '#10b981' : '#5865f2' }}>
                        {progress.done} / {progress.total}
                      </span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: '#f3f4f6', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: progress.pct + '%',
                        borderRadius: 99,
                        background: progress.pct === 100
                          ? 'linear-gradient(90deg, #10b981, #059669)'
                          : 'linear-gradient(90deg, #5865f2, #818cf8)',
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                )}

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  fontSize: 13, color: '#5865f2', fontWeight: 600,
                }}>
                  {progress?.done > 0 ? '繼續學習 →' : '開始學習 →'}
                </div>
              </div>
            )
          })}

          {/* 更多卡片佔位 */}
          <div style={{
            border: '2px dashed #e5e7eb', borderRadius: 16,
            padding: '22px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8,
            color: '#9ca3af', minHeight: 200,
          }}>
            <div style={{ fontSize: 28 }}>＋</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>更多課題</div>
            <div style={{ fontSize: 12 }}>即將推出</div>
          </div>
        </div>
      </div>
    </div>
  )
}
