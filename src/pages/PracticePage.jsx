import { useState, useEffect, useRef, useCallback } from 'react'
import { DATA, MONTH_NAMES, DAY_NAMES } from '../data/questions'
import { useProgressSync } from '../hooks/useProgressSync'

const localStore = (() => {
  try {
    localStorage.setItem('__t', '1')
    localStorage.removeItem('__t')
    return {
      get: (k) => localStorage.getItem(k),
      set: (k, v) => localStorage.setItem(k, v),
    }
  } catch {
    const mem = {}
    return { get: (k) => mem[k] ?? null, set: (k, v) => { mem[k] = v } }
  }
})()

const qid = (q) => 'm' + q.m + 'w' + q.w + 'd' + q.d

function QuestionCard({ q, onDoneChange, syncKey }) {
  const selKey = 'sel_' + qid(q)
  const [selected, setSelected] = useState(() => {
    const v = localStore.get(selKey)
    return v !== null ? parseInt(v, 10) : null
  })
  const [done, setDone] = useState(localStore.get('done_' + qid(q)) === '1')
  const [showAns, setShowAns] = useState(false)
  const id = qid(q)
  const tcls = q.t === '觀念題' ? 't1' : q.t === '程式題' ? 't2' : 't3'
  const hasMcq = Array.isArray(q.opts) && q.opts.length === 4

  useEffect(() => {
    const handler = () => {
      setDone(localStore.get('done_' + id) === '1')
      const v = localStore.get(selKey)
      setSelected(v !== null ? parseInt(v, 10) : null)
    }
    window.addEventListener('progress-loaded', handler)
    return () => window.removeEventListener('progress-loaded', handler)
  }, [id, selKey])

  const handleSelect = (idx) => {
    if (selected !== null) return // already answered
    setSelected(idx)
    syncKey(selKey, String(idx))
    const correct = idx === q.ans
    if (correct && !done) {
      setDone(true)
      syncKey('done_' + id, '1')
      onDoneChange()
    }
  }

  const toggleDone = () => {
    const next = !done
    setDone(next)
    syncKey('done_' + id, next ? '1' : '0')
    onDoneChange()
  }

  const answered = selected !== null
  const correct = answered && selected === q.ans

  return (
    <div className={'q' + (done ? ' done' : '')} id={id}>
      <div className="meta">
        <span className={'pill ' + tcls}>{q.t}</span>
        <span className="pill">M{q.m}-W{q.w}</span>
        <span className="day">{DAY_NAMES[q.d]}</span>
      </div>
      <h4 dangerouslySetInnerHTML={{ __html: q.q }} />

      {hasMcq ? (
        <div className="mcq-opts">
          {q.opts.map((opt, idx) => {
            let cls = 'mcq-opt'
            if (answered) {
              if (idx === q.ans) cls += ' opt-correct'
              else if (idx === selected) cls += ' opt-wrong'
              else cls += ' opt-dim'
            }
            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleSelect(idx)}
                disabled={answered}
              >
                <span className="opt-label">{String.fromCharCode(65 + idx)}</span>
                <span className="opt-text">{opt}</span>
              </button>
            )
          })}
          {answered && (
            <div className={'mcq-result' + (correct ? ' ok' : ' fail')}>
              {correct ? '✓ 答對了！' : `✗ 正確答案是 ${String.fromCharCode(65 + q.ans)}`}
              <button className="ghost" style={{ marginLeft: 10, fontSize: 12 }} onClick={() => setShowAns(!showAns)}>
                {showAns ? '收起解析' : '查看解析'}
              </button>
            </div>
          )}
          <div className={'ans' + (showAns ? ' show' : '')} dangerouslySetInnerHTML={{ __html: q.a }} />
        </div>
      ) : (
        <>
          <div className="acts">
            <button className="ghost" onClick={() => setShowAns(!showAns)}>
              {showAns ? '隱藏答案' : '顯示答案'}
            </button>
          </div>
          <div className={'ans' + (showAns ? ' show' : '')} dangerouslySetInnerHTML={{ __html: q.a }} />
        </>
      )}

      <div className="acts" style={{ marginTop: 8 }}>
        <button className={'ghost donebtn' + (done ? ' on' : '')} onClick={toggleDone}>
          {done ? '✓ 已完成' : '標記完成'}
        </button>
      </div>
    </div>
  )
}

export default function PracticePage() {
  const { syncKey } = useProgressSync('dive-plan')

  const [curMonth, setCurMonth] = useState(() => parseInt(localStore.get('dive_month') || '1', 10))
  const [curType, setCurType] = useState('all')
  const [startDate, setStartDate] = useState(() => localStore.get('dive_start') || '')
  const [todayInfo, setTodayInfo] = useState({ text: '設定你的計畫開始日，這裡就會自動指到今天該做的題目。', target: null })
  const [, forceUpdate] = useState(0)
  const bubbleRef = useRef(null)

  // Re-render when Firestore data loads
  useEffect(() => {
    const handler = () => {
      setCurMonth(parseInt(localStore.get('dive_month') || '1', 10))
      setStartDate(localStore.get('dive_start') || '')
      forceUpdate(n => n + 1)
    }
    window.addEventListener('progress-loaded', handler)
    return () => window.removeEventListener('progress-loaded', handler)
  }, [])

  useEffect(() => {
    const wrap = bubbleRef.current
    if (!wrap || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    for (let i = 0; i < 14; i++) {
      const b = document.createElement('div')
      b.className = 'bubble'
      const s = 4 + Math.random() * 10
      b.style.width = b.style.height = s + 'px'
      b.style.left = Math.random() * 100 + '%'
      b.style.animationDuration = 11 + Math.random() * 14 + 's'
      b.style.animationDelay = -Math.random() * 20 + 's'
      wrap.appendChild(b)
    }
    return () => { if (wrap) wrap.innerHTML = '' }
  }, [])

  useEffect(() => {
    if (!startDate) {
      setTodayInfo({ text: '設定你的計畫開始日，這裡就會自動指到今天該做的題目。', target: null })
      return
    }
    const start = new Date(startDate + 'T00:00:00')
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const diff = Math.floor((now - start) / 86400000)
    if (diff < 0) {
      setTodayInfo({ text: `計畫還沒開始，${-diff} 天後下水。先逛逛題庫暖身吧。`, target: null })
      return
    }
    const week = Math.floor(diff / 7)
    const m = Math.min(6, Math.floor(week / 4) + 1)
    const w = Math.min(4, (week % 4) + 1)
    const dow = now.getDay()
    if (diff >= 168) {
      setTodayInfo({ text: '六個月計畫已完成 🎉 用「隨機一題」維持手感，或回頭複習第 5 個月的面試題。', target: null })
      return
    }
    if (dow === 0 || dow === 6) {
      setTodayInfo({ text: `第 ${m} 個月・第 ${w} 週・週末：照計畫做作品集 / 整理履歷與下週規劃。`, target: null })
      return
    }
    const target = DATA.find(q => q.m === m && q.w === w && q.d === dow)
    if (target) {
      const preview = target.q.replace(/<[^>]+>/g, ' ').slice(0, 80) + (target.q.length > 80 ? '…' : '')
      setTodayInfo({ text: `計畫第 ${diff + 1} 天｜${MONTH_NAMES[m]}・WEEK ${w}・${DAY_NAMES[dow]}`, preview, target, m })
    }
  }, [startDate])

  const scrollToQ = (target, m) => {
    setCurMonth(m)
    setCurType('all')
    syncKey('dive_month', String(m))
    setTimeout(() => {
      const el = document.getElementById(qid(target))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.style.borderColor = 'var(--amber)'
        setTimeout(() => (el.style.borderColor = ''), 2500)
      }
    }, 50)
  }

  const goToday = () => {
    if (!todayInfo.target) return
    scrollToQ(todayInfo.target, todayInfo.m)
  }

  const randomPick = () => {
    const pool = DATA.filter(q => localStore.get('done_' + qid(q)) !== '1')
    const arr = pool.length ? pool : DATA
    const pick = arr[Math.floor(Math.random() * arr.length)]
    scrollToQ(pick, pick.m)
  }

  const handleMonthChange = (m) => {
    setCurMonth(m)
    syncKey('dive_month', String(m))
  }

  const handleDateChange = (v) => {
    setStartDate(v)
    syncKey('dive_start', v)
  }

  const monthItems = DATA.filter(q => q.m === curMonth)
  let filtered = monthItems
  if (curType === 'undone') filtered = monthItems.filter(q => localStore.get('done_' + qid(q)) !== '1')
  else if (curType !== 'all') filtered = monthItems.filter(q => q.t === curType)

  const doneCount = monthItems.filter(q => localStore.get('done_' + qid(q)) === '1').length
  const progPct = monthItems.length ? (doneCount / monthItems.length) * 100 : 0

  const weeks = []
  let lastW = 0
  filtered.forEach(q => {
    if (q.w !== lastW) { weeks.push({ w: q.w, items: [] }); lastW = q.w }
    weeks[weeks.length - 1].items.push(q)
  })

  return (
    <div className="practice-page">
      <div className="bubbles-wrap" ref={bubbleRef} />
      <main>
        <header>
          <div className="sub">DAILY DIVE TRAINING</div>
          <h1>每日潛訓・前端練習題庫</h1>
          <p className="lead">搭配六個月成長計畫的每日一題。週一到週五各一題，對應每月的學習重點；每題都有答案或驗收清單，做完就打勾。</p>
        </header>

        <section id="today">
          <div className="tag">◆ 今日訓練</div>
          <div className="where">{todayInfo.text}</div>
          {todayInfo.preview && <div style={{ marginTop: 6, fontWeight: 500, fontSize: 15.5 }}>{todayInfo.preview}</div>}
          <div className="start">
            計畫開始日：
            <input type="date" value={startDate} onChange={e => handleDateChange(e.target.value)} />
            {todayInfo.target && (
              <button className="btn" onClick={goToday}>跳到今日題目</button>
            )}
            <button className="btn amber" onClick={randomPick}>🎲 隨機一題</button>
          </div>
        </section>

        <div id="controls">
          <div className="tabs">
            {[1,2,3,4,5,6].map(m => (
              <button
                key={m}
                className={'tab' + (m === curMonth ? ' on' : '')}
                title={MONTH_NAMES[m]}
                onClick={() => handleMonthChange(m)}
              >
                第 {m} 月
              </button>
            ))}
          </div>
          <div className="row2">
            {[['all','全部類型'],['觀念題','觀念題'],['程式題','程式題'],['任務題','任務題'],['undone','只看未完成']].map(([val, label]) => (
              <button
                key={val}
                className={'tab sm' + (curType === val ? ' on' : '')}
                onClick={() => setCurType(val)}
              >
                {label}
              </button>
            ))}
            <div id="prog">
              <span>{doneCount} / {monthItems.length}</span>
              <div className="pbar"><i style={{ width: progPct + '%' }} /></div>
            </div>
          </div>
        </div>

        <div id="list">
          {filtered.length === 0 ? (
            <div className="empty">
              {curType === 'undone' ? '這個月的題目都完成了！潛得漂亮 🐚' : '沒有符合的題目'}
            </div>
          ) : (
            weeks.map(({ w, items }) => (
              <div key={w}>
                <div className="wk-head">WEEK {w}</div>
                {items.map(q => (
                  <QuestionCard key={qid(q)} q={q} syncKey={syncKey} onDoneChange={() => forceUpdate(n => n + 1)} />
                ))}
              </div>
            ))
          )}
        </div>

        <footer className="practice-footer">SIX-MONTH DIVE PLAN · 練習是往下潛的氧氣</footer>
      </main>
    </div>
  )
}
