import { useEffect, useRef } from 'react'

export default function PlanPage({ scrollEl }) {
  const bgRef = useRef(null)
  const raysRef = useRef(null)
  const planktonRef = useRef(null)
  const bubbleRef = useRef(null)
  const fillRef = useRef(null)
  const zoneRef = useRef(null)
  const depthRef = useRef(null)

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const container = scrollEl?.current || document.getElementById('main-content') || window

    const bWrap = bubbleRef.current
    if (!reduce && bWrap) {
      for (let i = 0; i < 22; i++) {
        const b = document.createElement('div')
        b.className = 'bubble'
        const s = 4 + Math.random() * 14
        b.style.width = b.style.height = s + 'px'
        b.style.left = Math.random() * 100 + '%'
        b.style.animationDuration = 9 + Math.random() * 14 + 's'
        b.style.animationDelay = -Math.random() * 18 + 's'
        bWrap.appendChild(b)
      }
    }

    const pWrap = planktonRef.current
    if (pWrap) {
      for (let i = 0; i < 26; i++) {
        const d = document.createElement('div')
        d.className = 'dot'
        d.style.left = Math.random() * 100 + '%'
        d.style.top = Math.random() * 100 + '%'
        d.style.animationDuration = 4 + Math.random() * 6 + 's'
        d.style.animationDelay = -Math.random() * 6 + 's'
        pWrap.appendChild(d)
      }
    }

    const stops = [
      [143,227,240],[46,156,202],[24,118,168],[14,86,134],
      [9,57,98],[5,33,64],[3,18,40],[2,9,24],
    ]
    const zones = [
      [0,'水面'],[0.07,'第 1 個月・陽光帶'],[0.2,'第 2 個月・陽光帶'],
      [0.33,'第 3 個月・暮光帶'],[0.47,'第 4 個月・暮光帶'],
      [0.6,'第 5 個月・午夜帶'],[0.73,'第 6 個月・深海帶'],
      [0.84,'裝備與守則'],[0.96,'1000m・珍珠'],
    ]

    const lerp = (a, b, t) => Math.round(a + (b - a) * t)
    function mix(p) {
      const seg = Math.min(stops.length - 2, Math.floor(p * (stops.length - 1)))
      const t = p * (stops.length - 1) - seg
      const a = stops[seg], b = stops[seg + 1]
      return `rgb(${lerp(a[0],b[0],t)},${lerp(a[1],b[1],t)},${lerp(a[2],b[2],t)})`
    }

    const getScrollTop = () => container === window ? window.scrollY : container.scrollTop
    const getScrollHeight = () => container === window
      ? document.documentElement.scrollHeight - window.innerHeight
      : container.scrollHeight - container.clientHeight

    const fishes = [...document.querySelectorAll('.px[data-speed]')]
    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const max = getScrollHeight()
        const p = Math.min(1, Math.max(0, getScrollTop() / (max || 1)))
        const top = mix(p), bottom = mix(Math.min(1, p + 0.12))
        if (bgRef.current) bgRef.current.style.background = `linear-gradient(${top},${bottom})`
        if (raysRef.current) raysRef.current.style.opacity = Math.max(0, 1 - p * 3.2)
        if (planktonRef.current) planktonRef.current.style.opacity = p > 0.45 ? Math.min(1, (p - 0.45) * 3) : 0

        const m = Math.round(p * 1000)
        if (depthRef.current) depthRef.current.textContent = m + ' m'
        let z = zones[0][1]
        for (const [s, n] of zones) { if (p >= s) z = n }
        if (zoneRef.current) zoneRef.current.textContent = z
        if (fillRef.current) fillRef.current.style.height = p * 100 + '%'

        if (!reduce) {
          for (const f of fishes) {
            const r = f.getBoundingClientRect()
            const off = (r.top + r.height / 2 - window.innerHeight / 2) * parseFloat(f.dataset.speed || 0.15)
            const flip = f.style.transform.includes('scaleX(-1)') ? ' scaleX(-1)' : ''
            f.style.transform = `translateY(${-off}px) translateX(${Math.sin((getScrollTop() + r.top) * 0.002) * 18}px)${flip}`
          }
        }
        ticking = false
      })
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    const io = new IntersectionObserver((es) => {
      es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          e.target.querySelectorAll('.bar i').forEach(i => (i.style.width = i.dataset.w + '%'))
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    if (reduce) {
      document.querySelectorAll('.bar i').forEach(i => (i.style.width = i.dataset.w + '%'))
    }

    return () => {
      container.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      io.disconnect()
      if (bWrap) bWrap.innerHTML = ''
      if (pWrap) pWrap.innerHTML = ''
    }
  }, [scrollEl])

  const Fish = ({ style, flip }) => (
    <svg className="px fish" data-speed="0.15" style={style} viewBox="0 0 100 40">
      <path d="M5 20 C25 2 60 2 78 20 C60 38 25 38 5 20 Z M78 20 L96 8 L90 20 L96 32 Z" />
      <circle cx="20" cy="17" r="2.4" fill="#8FE3F0" />
    </svg>
  )
  const DeepFish = ({ style, color = '#6BF7E3' }) => (
    <svg className="px fish deepfish" data-speed="0.1" style={style} viewBox="0 0 100 40">
      <path d="M5 20 C25 2 60 2 78 20 C60 38 25 38 5 20 Z M78 20 L96 8 L90 20 L96 32 Z" />
      <circle cx="20" cy="17" r="2.6" fill={color} />
    </svg>
  )
  const Jelly = ({ style, color = 'rgba(159,140,255,.5)', strokeColor = 'rgba(159,140,255,.45)' }) => (
    <svg className="px jelly" data-speed="0.15" style={style} viewBox="0 0 60 80">
      <path d={`M6 34 C6 14 54 14 54 34 C54 42 6 42 6 34Z`} fill={color} />
      <path d="M14 40 q-3 16 2 30 M26 42 q-2 18 3 34 M38 42 q2 18 -3 34 M46 40 q3 16 -2 30" stroke={strokeColor} fill="none" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )

  return (
    <div className="plan-page">
      <div className="plan-bg" ref={bgRef} />
      <div className="plan-rays" ref={raysRef} />
      <div className="plan-bubbles" ref={bubbleRef} />
      <div className="plan-plankton" ref={planktonRef} />

      <aside id="gauge" aria-hidden="true" style={{ position: 'fixed', right: 26, top: '50%', transform: 'translateY(-50%)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--foam-dim)', userSelect: 'none' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--foam)', letterSpacing: 0.5 }} ref={depthRef}>0 m</div>
        <div style={{ width: 2, height: 200, background: 'rgba(234,247,252,0.22)', position: 'relative', borderRadius: 2 }}>
          <div ref={fillRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', background: 'linear-gradient(var(--glow), var(--amber))', height: '0%', borderRadius: 2 }} />
        </div>
        <div ref={zoneRef} style={{ writingMode: 'vertical-rl', letterSpacing: 6, fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 12, color: 'var(--amber)' }}>水面</div>
      </aside>

      <div className="plan-inner">
        {/* HERO */}
        <section id="hero" className="plan-section">
          <div className="wrap">
            <div className="sub">SIX-MONTH DIVE PLAN · 2026</div>
            <h1>深潛六個月<span>前端成長計畫</span></h1>
            <p className="goal">把自己從「會改畫面的人」，提升成「能獨立負責後台管理系統模組、並能從 UI 一路追到 API 與資料來源的前端工程師」。</p>
            <div className="hint">往下潛入 ▾ SCROLL TO DIVE</div>
          </div>
          <div id="waves">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,64 C240,110 480,20 720,56 C960,92 1200,30 1440,70 L1440,120 L0,120 Z" fill="rgba(255,255,255,.18)" />
              <path d="M0,84 C260,40 520,116 780,80 C1040,44 1260,100 1440,84 L1440,120 L0,120 Z" fill="rgba(30,136,184,.55)" />
            </svg>
          </div>
        </section>

        {/* 航線 */}
        <section id="route" className="plan-section">
          <Fish style={{ top: '6%', right: '-40px', width: 150 }} />
          <div className="wrap">
            <div className="reveal">
              <div className="eyebrow">DIVE ROUTE</div>
              <h2>潛航路線總覽</h2>
              <p className="month-goal">六個月，由淺到深。每一層只專注一件事，潛得穩比潛得快重要。</p>
            </div>
            <div className="route reveal">
              {[
                ['#m1','第 1 個月','補強 JavaScript 與 TypeScript 基礎','0–50m'],
                ['#m2','第 2 個月','React 主線能力整理','50–150m'],
                ['#m3','第 3 個月','API 串接與資料流追蹤','150–300m'],
                ['#m4','第 4 個月','公司專案案例整理','300–500m'],
                ['#m5','第 5 個月','履歷、作品集與面試準備','500–750m'],
                ['#m6','第 6 個月','開始投遞與面試修正','750–1000m'],
              ].map(([href, m, desc, d]) => (
                <a key={href} href={href}>
                  <span className="m">{m}</span>
                  <span>{desc}</span>
                  <span className="d">{d}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 第 1 個月 */}
        <section id="m1" className="plan-section">
          <Fish style={{ top: '14%', left: '-30px', width: 110, transform: 'scaleX(-1)' }} />
          <div className="wrap">
            <div className="reveal">
              <div className="depth-tag">DEPTH 0–50m <i>陽光帶</i></div>
              <div className="eyebrow">MONTH 01</div>
              <h2>補強 JavaScript 與 TypeScript 基礎</h2>
              <p className="month-goal">讓自己能更穩定地讀懂公司專案中的 JS / TS 程式碼，並能開始寫出型別清楚的前端程式。</p>
            </div>
            <div className="reveal">
              <h3>學習重點</h3>
              <div className="chips">
                {['map / filter / reduce / find / some / every','解構、展開、深淺拷貝','Promise / async / await','try catch 錯誤處理','import / export 模組化','type / interface / union / optional / generic','API response 型別設計','React props 型別設計'].map(c => <span key={c} className="chip">{c}</span>)}
              </div>
            </div>
            <div className="grid2" style={{ marginTop: 40 }}>
              <div className="reveal">
                <h3 style={{ marginTop: 0 }}>每週安排</h3>
                <div className="card weeks">
                  <div className="week"><b>WEEK 1</b>JavaScript 陣列與物件處理</div>
                  <div className="week"><b>WEEK 2</b>Promise、async / await、錯誤處理</div>
                  <div className="week"><b>WEEK 3</b>TypeScript type、interface、union type</div>
                  <div className="week"><b>WEEK 4</b>把一個小型 API 串接功能改成 TypeScript</div>
                </div>
              </div>
              <div className="reveal">
                <h3 style={{ marginTop: 0 }}>產出成果</h3>
                <div className="card">
                  <ul className="plain">
                    <li>10 張 JavaScript / TypeScript 筆記卡</li>
                    <li>1 個 TypeScript API 串接小練習</li>
                    <li>1 份常用型別範例筆記</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="reveal">
              <h3>驗收標準</h3>
              <div className="card">
                <ul className="plain check">
                  <li>我可以看懂 API 回傳資料的型別</li>
                  <li>我可以定義表單資料的型別</li>
                  <li>我可以定義元件 props 的型別</li>
                  <li>我可以避免所有資料都寫成 any</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 第 2 個月 */}
        <section id="m2" className="plan-section">
          <Fish style={{ top: '10%', right: '4%', width: 90 }} />
          <div className="wrap">
            <div className="reveal">
              <div className="depth-tag">DEPTH 50–150m <i>陽光帶</i></div>
              <div className="eyebrow">MONTH 02</div>
              <h2>React 主線能力整理</h2>
              <p className="month-goal">具備獨立開發一個 React 後台頁面的能力。</p>
            </div>
            <div className="reveal">
              <h3>學習重點</h3>
              <div className="chips">
                {['component / props / state','useState / useEffect','useMemo / useCallback','React Router','表單處理','Modal','表格與分頁','元件拆分','MUI DataGrid / table','基本資料夾結構'].map(c => <span key={c} className="chip">{c}</span>)}
              </div>
            </div>
            <div className="grid2" style={{ marginTop: 40 }}>
              <div className="reveal">
                <h3 style={{ marginTop: 0 }}>每週安排</h3>
                <div className="card weeks">
                  <div className="week"><b>WEEK 1</b>React component、props、state</div>
                  <div className="week"><b>WEEK 2</b>useEffect、資料載入、loading 狀態</div>
                  <div className="week"><b>WEEK 3</b>React Router、頁面切換、表單</div>
                  <div className="week"><b>WEEK 4</b>完成一個查詢頁面 Demo</div>
                </div>
              </div>
              <div className="reveal">
                <h3 style={{ marginTop: 0 }}>產出成果：React 後台查詢頁</h3>
                <div className="card">
                  <div className="chips">
                    {['查詢條件','查詢按鈕','清除按鈕','表格列表','分頁','新增按鈕','編輯 Modal','loading','error','empty'].map(c => <span key={c} className="chip">{c}</span>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="reveal">
              <h3>驗收標準</h3>
              <div className="card">
                <ul className="plain check">
                  <li>我可以從 0 建立一個 React 查詢頁</li>
                  <li>我可以拆分查詢區塊、表格區塊、Modal 區塊</li>
                  <li>我可以說明每個 component 的責任</li>
                  <li>我可以避免整個頁面全部寫在同一個檔案</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 第 3 個月 */}
        <section id="m3" className="plan-section">
          <Jelly style={{ top: '8%', left: '6%', width: 70 }} />
          <div className="wrap">
            <div className="reveal">
              <div className="depth-tag">DEPTH 150–300m <i>暮光帶</i></div>
              <div className="eyebrow">MONTH 03</div>
              <h2>API 串接與資料流追蹤</h2>
              <p className="month-goal">變成可以追蹤資料來源、API 參數、response 結構與畫面欄位對應的人。</p>
            </div>
            <div className="reveal">
              <h3>學習重點</h3>
              <div className="chips">
                {['RESTful API','request payload','response data','query params','error response','loading / error / empty','前端資料 mapping','分頁參數','查詢條件保存','API service 分層','Mock API','TanStack Query 基礎'].map(c => <span key={c} className="chip">{c}</span>)}
              </div>
            </div>
            <div className="grid2" style={{ marginTop: 40 }}>
              <div className="reveal">
                <h3 style={{ marginTop: 0 }}>每週安排</h3>
                <div className="card weeks">
                  <div className="week"><b>WEEK 1</b>整理 API 串接流程</div>
                  <div className="week"><b>WEEK 2</b>練習查詢 API、分頁 API、單筆資料 API</div>
                  <div className="week"><b>WEEK 3</b>練習新增、編輯、刪除流程</div>
                  <div className="week"><b>WEEK 4</b>整理一份完整 API 追蹤筆記</div>
                </div>
              </div>
              <div className="reveal">
                <h3 style={{ marginTop: 0 }}>產出成果：完整 CRUD 後台 Demo</h3>
                <div className="card">
                  <div className="chips">
                    {['列表查詢','分頁','新增','編輯','刪除','表單驗證','API loading / error','資料 mapping','README 文件'].map(c => <span key={c} className="chip">{c}</span>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="reveal">
              <h3>驗收標準：我可以回答</h3>
              <div className="card">
                <ul className="plain check">
                  <li>這個欄位從哪支 API 來？</li>
                  <li>按鈕點下去會送出什麼 request？</li>
                  <li>response 回來後資料怎麼轉成畫面？</li>
                  <li>API 錯誤時畫面怎麼處理？</li>
                  <li>分頁參數前後端怎麼對？</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 第 4 個月 */}
        <section id="m4" className="plan-section">
          <DeepFish style={{ top: '18%', right: '-20px', width: 130 }} />
          <div className="wrap">
            <div className="reveal">
              <div className="depth-tag">DEPTH 300–500m <i>暮光帶</i></div>
              <div className="eyebrow">MONTH 04</div>
              <h2>公司專案案例整理</h2>
              <p className="month-goal">把工作經驗整理成可以放進履歷與面試說明的專案案例。</p>
            </div>
            <div className="grid2">
              <div className="reveal">
                <h3 style={{ marginTop: 0 }}>每週安排</h3>
                <div className="card weeks">
                  <div className="week"><b>WEEK 1</b>整理一個前端 Bug 案例</div>
                  <div className="week"><b>WEEK 2</b>整理一個 API / 資料流案例</div>
                  <div className="week"><b>WEEK 3</b>整理一個上線或災演文件案例</div>
                  <div className="week"><b>WEEK 4</b>整理成履歷專案描述</div>
                </div>
              </div>
              <div className="reveal">
                <h3 style={{ marginTop: 0 }}>案例固定格式</h3>
                <div className="card">
                  <ul className="plain">
                    {[['背景','功能或問題發生在哪個系統、哪個畫面'],['問題','使用者或測試者遇到什麼狀況'],['追查','從哪個畫面、事件、API、資料來源開始查'],['原因','最後確認問題是什麼'],['修正','我做了哪些修改'],['驗證','用哪些情境確認問題已解決'],['影響','對系統或團隊有什麼幫助']].map(([k,v]) => (
                      <li key={k}><b style={{ color: 'var(--amber)', fontWeight: 500 }}>{k}</b>　{v}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="reveal">
              <h3>驗收標準</h3>
              <div className="card">
                <ul className="plain check">
                  <li>我可以用 3 到 5 分鐘說清楚一個工作案例</li>
                  <li>我可以說明我怎麼追問題，不只是說我改了什麼</li>
                  <li>我可以把工作內容轉換成履歷語言</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 第 5 個月 */}
        <section id="m5" className="plan-section">
          <Jelly style={{ top: '5%', right: '10%', width: 54 }} color="rgba(107,247,227,.35)" strokeColor="rgba(107,247,227,.35)" />
          <div className="wrap">
            <div className="reveal">
              <div className="depth-tag">DEPTH 500–750m <i>午夜帶</i></div>
              <div className="eyebrow">MONTH 05</div>
              <h2>履歷、作品集與面試準備</h2>
              <p className="month-goal">完成可以投遞年薪 100 萬前端職缺的履歷與面試準備。</p>
            </div>
            <div className="reveal resume grid2">
              <div className="no">
                <span className="label">✕ 不建議的寫法</span>
                熟悉 React、Vue、JavaScript、API 串接。
              </div>
              <div className="yes">
                <span className="label">✓ 建議改成</span>
                <ul>
                  <li>使用 React / Vue 開發後台管理系統，負責查詢條件、表格分頁、Modal 表單與 API 串接</li>
                  <li>依據後端 API response 設計前端資料 mapping，處理 loading、error、empty state 與欄位空值情境</li>
                  <li>參與大型既有系統維護，能從 UI 事件追蹤至 API 參數與資料來源，定位資料異常原因</li>
                  <li>整理上線與災演操作文件，協助降低正式環境切換風險</li>
                </ul>
              </div>
            </div>
            <div className="reveal">
              <h3>面試準備題目</h3>
              <details><summary>JavaScript</summary><div className="body">Promise 和 async / await 差異・map / filter / reduce 的使用情境・深拷貝與淺拷貝・event loop 基本概念・閉包是什麼</div></details>
              <details><summary>React</summary><div className="body">useState 與 useEffect 怎麼使用・useEffect 常見錯誤・props drilling 是什麼・如何拆分 component・如何避免不必要 render・表單狀態怎麼管理・API loading 和 error 怎麼處理</div></details>
              <details><summary>TypeScript</summary><div className="body">type 和 interface 差異・union type 怎麼用・generic 基本概念・API response 型別怎麼設計・React props 型別怎麼設計</div></details>
              <details><summary>實務題</summary><div className="body">如何從畫面追到 API・如何處理表格分頁・如何處理查詢條件・如何跟後端確認 API 問題・如何 debug 線上問題・如何確認修改沒有影響其他功能</div></details>
            </div>
            <div className="grid2" style={{ marginTop: 30 }}>
              <div className="reveal">
                <h3 style={{ marginTop: 0 }}>產出成果</h3>
                <div className="card">
                  <ul className="plain">
                    <li>一份新版履歷</li><li>一份自我介紹稿</li><li>三個專案案例稿</li>
                    <li>一個 React 後台 Demo</li><li>一份 GitHub README</li><li>一份面試問答筆記</li>
                  </ul>
                </div>
              </div>
              <div className="reveal">
                <h3 style={{ marginTop: 0 }}>驗收標準</h3>
                <div className="card">
                  <ul className="plain check">
                    <li>我可以在 1 分鐘內自我介紹</li>
                    <li>我可以說明自己的技術主線</li>
                    <li>我可以講出 3 個具體工作案例</li>
                    <li>我可以回答常見前端面試題</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="reveal">
              <h3>自我介紹模板</h3>
              <div className="card" style={{ fontSize: 15, color: 'var(--foam-dim)' }}>
                您好，我是＿＿＿。我主要的前端經驗是 React、Vue、JavaScript、TypeScript 以及後台管理系統開發。過去我參與過大型企業系統維護，負責畫面調整、API 串接、表格與表單功能，也處理過測試機、正式機與災演相關文件整理。我目前特別重視資料流追蹤能力，會從畫面事件一路追到 API request、response 結構與資料來源，確認問題原因後再進行修正。我希望下一份工作能持續累積前端架構、TypeScript、React 或 Vue 的實務經驗，並成為能獨立負責前端模組的工程師。
              </div>
            </div>
          </div>
        </section>

        {/* 第 6 個月 */}
        <section id="m6" className="plan-section">
          <DeepFish style={{ top: '12%', left: '2%', width: 96, transform: 'scaleX(-1)' }} color="#FFC36B" />
          <div className="wrap">
            <div className="reveal">
              <div className="depth-tag">DEPTH 750–1000m <i>深海帶</i></div>
              <div className="eyebrow">MONTH 06</div>
              <h2>開始投遞與面試修正</h2>
              <p className="month-goal">開始投遞 70K 到 90K 的前端職缺，並根據面試結果修正能力缺口。</p>
            </div>
            <div className="reveal">
              <h3>投遞職缺關鍵字</h3>
              <div className="chips">
                {['Frontend Engineer','React Frontend Engineer','Vue Frontend Engineer','TypeScript Frontend Engineer','Web Frontend Engineer','後台系統前端工程師','中階前端工程師','Senior Frontend Engineer','SaaS 前端工程師','金融前端工程師'].map(c => <span key={c} className="chip">{c}</span>)}
              </div>
            </div>
            <div className="grid2" style={{ marginTop: 40 }}>
              <div className="reveal">
                <h3 style={{ marginTop: 0 }}>投遞策略</h3>
                <div className="card">
                  <ul className="plain">
                    <li>每週投 5 到 10 個職缺</li>
                    <li>不要只投完全符合的職缺</li>
                    <li>符合 60% 到 70% 就可以投</li>
                    <li>待遇面議的職缺也要投</li>
                    <li>每次面試後都要整理問題</li>
                  </ul>
                </div>
              </div>
              <div className="reveal">
                <h3 style={{ marginTop: 0 }}>面試後檢討格式</h3>
                <div className="card">
                  <ul className="plain">
                    <li>公司名稱、職缺名稱、面試日期</li>
                    <li>被問到的技術題</li>
                    <li>回答不好的地方、我不會的地方</li>
                    <li>下次要補強的內容</li>
                    <li>這間公司要求的能力</li>
                    <li>是否繼續投類似職缺</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 每週節奏 */}
        <section id="rhythm" className="plan-section">
          <div className="wrap">
            <div className="reveal">
              <div className="eyebrow">WEEKLY RHYTHM</div>
              <h2>每週固定執行計畫</h2>
              <p className="month-goal">平日每天 30 到 60 分鐘，像潮汐一樣固定。</p>
            </div>
            <div className="grid2">
              <div className="reveal">
                <h3 style={{ marginTop: 0 }}>平日節奏</h3>
                <div className="card weeks">
                  {[['週一','補技術基礎'],['週二','實作練習'],['週三','讀公司專案或整理工作案例'],['週四','實作練習'],['週五','整理筆記與回顧'],['週六','做作品集或完整功能'],['週日','整理履歷、筆記、下週計畫']].map(([d,t]) => (
                    <div key={d} className="week"><b>{d}</b>{t}</div>
                  ))}
                </div>
              </div>
              <div className="reveal">
                <h3 style={{ marginTop: 0 }}>每週至少產出其中 2 項</h3>
                <div className="card">
                  <ul className="plain">
                    <li>1 張技術筆記卡</li><li>1 個小功能練習</li><li>1 個工作案例整理</li>
                    <li>1 份 API 追蹤紀錄</li><li>1 份 Debug 流程紀錄</li>
                    <li>1 段履歷描述</li><li>1 題面試題回答</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 技能檢查表 */}
        <section id="skills" className="plan-section">
          <div className="wrap">
            <div className="reveal">
              <div className="eyebrow">SONAR CHECK</div>
              <h2>技術能力檢查表</h2>
              <p className="month-goal">聲納掃描八個方向。長條代表目標分數，自己填上目前分數，定期回來對照。</p>
            </div>
            <div className="card reveal">
              {[
                ['JavaScript','目標 4 / 5',80,'陣列處理・物件處理・非同步・錯誤處理・模組化・基本瀏覽器事件・常見資料轉換'],
                ['TypeScript','目標 3.5 / 5',70,'type・interface・union type・optional・generic・API response 型別・React props 型別・表單資料型別'],
                ['React','目標 4 / 5',80,'component・props・state・hooks・router・表單・表格・Modal・API 串接・元件拆分・效能基本概念'],
                ['Vue 3','目標 3.5 / 5',70,'Composition API・Pinia・Vue Router・Vite・元件拆分・API 串接・表單與表格'],
                ['API 串接','目標 4 / 5',80,'request・response・payload・query params・error handling・loading・empty state・資料 mapping・分頁・CRUD'],
                ['Debug','目標 4 / 5',80,'Console・Network・斷點・React DevTools・從畫面追事件・從事件追 API・從 API 追資料・整理假設・驗證修正'],
                ['Git','目標 3.5 / 5',70,'branch・commit・merge・rebase・stash・conflict・pull request・commit message'],
                ['技術文件','目標 4 / 5',80,'操作步驟・問題紀錄・測試案例・API 對照・上線注意事項・異常處理流程'],
              ].map(([name, goal, w, items], i) => (
                <div key={name} className="skill" style={i === 7 ? { marginBottom: 0 } : {}}>
                  <div className="head"><b>{name}</b><span>{goal}</span></div>
                  <div className="bar"><i data-w={w} /></div>
                  <div className="items">{items}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 隨身模板 */}
        <section id="templates" className="plan-section">
          <div className="wrap">
            <div className="reveal">
              <div className="eyebrow">TOOLKIT</div>
              <h2>隨身模板</h2>
              <p className="month-goal">兩份可以反覆使用的格式：整理工作案例、以及問問題前先整理自己。</p>
            </div>
            <div className="reveal">
              <details>
                <summary>工作案例整理模板</summary>
                <div className="body">
                  <p><b>案例名稱</b>｜填寫案例名稱</p>
                  <p><b>背景</b>｜這個問題或功能發生在哪個系統、哪個畫面、哪個流程</p>
                  <p><b>問題</b>｜當時遇到什麼狀況</p>
                  <p><b>我的任務</b>｜我負責處理什麼部分</p>
                  <p><b>追查流程</b>｜先從畫面確認現象 → 找到觸發事件 → 找到前端 function → 找到 API service → 檢查 request payload → 檢查 response data → 對照畫面欄位</p>
                  <p><b>發現原因</b>｜最後確認問題的真正原因</p>
                  <p><b>修正方式</b>｜我做了哪些修改</p>
                  <p><b>測試方式</b>｜我用哪些情境驗證</p>
                  <p><b>結果</b>｜這次修正帶來什麼成果</p>
                  <p><b>可放履歷的描述</b>｜整理成 1 到 2 句履歷語言</p>
                </div>
              </details>
              <details>
                <summary>問問題前的整理模板</summary>
                <div className="body">
                  <p><b>問題標題</b>｜簡短說明問題</p>
                  <p><b>背景</b>｜我現在處理哪個功能或哪個畫面</p>
                  <p><b>目前現象</b>｜畫面或系統目前發生什麼事</p>
                  <p><b>我預期應該怎樣</b>｜正常情況下應該要怎麼運作</p>
                  <p><b>我已經查過什麼</b>｜查過哪些檔案、API、資料、設定</p>
                  <p><b>我目前的判斷</b>｜我懷疑問題可能在哪裡</p>
                  <p><b>我想確認的問題</b>｜我想請對方幫忙確認什麼</p>
                  <p><b>下一步</b>｜如果確認後，我準備怎麼處理</p>
                </div>
              </details>
              <details>
                <summary>每月成果檢查清單</summary>
                <div className="body">
                  <p><b>第 1 個月</b>｜是否補強 JS / TS 基礎？完成 10 張技術筆記？完成 1 個 TypeScript 小練習？</p>
                  <p><b>第 2 個月</b>｜是否完成 React 查詢頁？理解 component 拆分？能處理 loading / error / empty？</p>
                  <p><b>第 3 個月</b>｜是否完成 CRUD Demo？能說明 API 串接流程？能追蹤資料從 API 到畫面？</p>
                  <p><b>第 4 個月</b>｜是否整理出 3 個工作案例？能講成面試故事？能寫進履歷？</p>
                  <p><b>第 5 個月</b>｜是否完成新版履歷？完成自我介紹？準備好面試題？</p>
                  <p><b>第 6 個月</b>｜是否開始投遞職缺？有面試紀錄？知道下一步要補強什麼？</p>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* 原則 */}
        <section id="principles" className="plan-section">
          <div className="wrap">
            <div className="reveal">
              <div className="eyebrow">DIVE RULES</div>
              <h2>最重要的執行原則</h2>
              <p className="month-goal">深潛守則，每次下水前讀一遍。</p>
            </div>
            <div className="rules reveal">
              {[
                ['不要貪多','每週只推進 1 到 2 個重點。'],
                ['不要只看教學','每個學習主題都要有實作或工作案例。'],
                ['不要只學新技術','公司專案、Bug、災演、文件、API 追蹤，都是可以變成履歷價值的材料。'],
                ['不要等準備完才投履歷','準備到第 5 或第 6 個月就可以開始投，透過面試回饋修正方向。'],
                ['不要只說我會什麼','要說我解決過什麼問題、怎麼追查、怎麼驗證。'],
              ].map(([title, desc]) => (
                <div key={title} className="rule">
                  <div>
                    <b>{title}</b>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 終點 */}
        <section id="treasure" className="plan-section">
          <div className="wrap reveal">
            <div className="pearl" aria-hidden="true" />
            <div className="eyebrow" style={{ justifyContent: 'center' }}>DEPTH 1000m · 目標</div>
            <h2>海底的那顆珍珠</h2>
            <div className="from-to">
              <span>會改畫面的人</span>
              <span className="arrow">⟶</span>
              <span>能獨立負責後台模組、<br />能從 UI 追到 API 與資料來源的前端工程師</span>
            </div>
            <p className="tagline">這條路線最符合我目前的工作經驗，也最接近年薪 100 萬前端工程師需要的能力。</p>
          </div>
        </section>

        <footer className="plan-footer">SIX-MONTH DIVE PLAN · 每天往下潛一點</footer>
      </div>
    </div>
  )
}
