export default function OverviewPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">總覽</h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 transition-colors"
            style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
          >
            重新整理
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ background: '#5865f2' }}
            onMouseEnter={e => e.currentTarget.style.background = '#4752c4'}
            onMouseLeave={e => e.currentTarget.style.background = '#5865f2'}
          >
            + 新增
          </button>
        </div>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center" style={{ background: '#f1f3f5' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
            <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500">尚無資料</p>
        <p className="text-xs text-gray-400 mt-1">點擊「+ 新增」開始建立內容</p>
      </div>
    </div>
  )
}
