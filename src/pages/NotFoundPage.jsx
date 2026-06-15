import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center h-full py-24">
      <p className="text-4xl font-bold text-gray-300">404</p>
      <p className="text-sm text-gray-500 mt-2">找不到此頁面</p>
      <button
        onClick={() => navigate('/overview')}
        className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white"
        style={{ background: '#5865f2' }}
      >
        回到總覽
      </button>
    </div>
  )
}
