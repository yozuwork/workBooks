import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './hooks/useAuth'
import AdminLayout from './components/AdminLayout'
import OverviewPage from './pages/OverviewPage'
import DivePlanPage from './pages/DivePlanPage'
import NotFoundPage from './pages/NotFoundPage'

function LoginPage({ signIn, authError }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#16181d' }}>
      <div className="flex flex-col items-center gap-6 p-10 rounded-2xl" style={{ background: '#1e2128', border: '1px solid #2a2d35' }}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl" style={{ background: '#5865f2' }}>
            W
          </div>
          <h1 className="text-xl font-bold text-white">Workbook</h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>後台管理系統</p>
        </div>
        {authError && (
          <p className="text-sm text-red-400 text-center max-w-xs">{authError}</p>
        )}
        <button
          onClick={() => signIn()}
          className="flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-medium text-white transition-colors"
          style={{ background: '#5865f2' }}
          onMouseEnter={e => e.currentTarget.style.background = '#4752c4'}
          onMouseLeave={e => e.currentTarget.style.background = '#5865f2'}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          使用 Google 帳號登入
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const { user, loading, signIn, logOut, authError } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#16181d' }}>
        <div className="text-sm" style={{ color: '#6b7280' }}>載入中...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage signIn={signIn} authError={authError} />
  }

  return (
    <Routes>
      <Route element={<AdminLayout user={user} signIn={signIn} logOut={logOut} />}>
        <Route path="/frontend-practice" element={<OverviewPage />} />
        <Route path="/frontend-practice/dive-plan" element={<DivePlanPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/frontend-practice" replace />} />
    </Routes>
  )
}
