export default function StatsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">數據統計</h1>
      </div>
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center" style={{ background: '#f1f3f5' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
            <path d="M3 3v18h18M7 16l4-4 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500">尚無統計資料</p>
        <p className="text-xs text-gray-400 mt-1">新增資料後統計資訊將顯示在此</p>
      </div>
    </div>
  )
}
