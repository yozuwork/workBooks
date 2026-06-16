import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DATA } from "../data/questions";

const NAV_SECTIONS = [
  {
    label: "主選單",
    items: [
      {
        path: "/frontend-practice",
        label: "前端習題",
        icon: <DashboardIcon sx={{ fontSize: 17 }} />,
      },
    ],
  },
];

const MONTHS = [
  { m: 1, label: '第 1 月', sub: 'JS / TS 基礎' },
  { m: 2, label: '第 2 月', sub: 'React 主線' },
  { m: 3, label: '第 3 月', sub: 'API 串接' },
  { m: 4, label: '第 4 月', sub: '專案案例' },
  { m: 5, label: '第 5 月', sub: '履歷面試' },
  { m: 6, label: '第 6 月', sub: '投遞修正' },
]

function getMonthProgress(m) {
  const items = DATA.filter(q => q.m === m)
  if (!items.length) return { done: 0, total: 0, pct: 0 }
  let done = 0
  try {
    items.forEach(q => {
      if (localStorage.getItem('done_m' + q.m + 'w' + q.w + 'd' + q.d) === '1') done++
    })
  } catch {}
  return { done, total: items.length, pct: Math.round((done / items.length) * 100) }
}

const sidebarBase = {
  background: "#16181d",
  borderRight: "1px solid #2a2d35",
};

const navItemBase = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "7px 12px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: 500,
  cursor: "pointer",
  textDecoration: "none",
  transition: "background 0.15s, color 0.15s",
  color: "#9ca3af",
};

function SidebarNavItem({ path, label, icon }) {
  return (
    <NavLink
      to={path}
      style={({ isActive }) => ({
        ...navItemBase,
        background: isActive ? "#1e2128" : "transparent",
        color: isActive ? "#ffffff" : "#9ca3af",
      })}
      onMouseEnter={(e) => {
        if (!e.currentTarget.getAttribute("aria-current")) {
          e.currentTarget.style.background = "#1e2128";
          e.currentTarget.style.color = "#e5e7eb";
        }
      }}
      onMouseLeave={(e) => {
        if (!e.currentTarget.getAttribute("aria-current")) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#9ca3af";
        }
      }}
    >
      <span style={{ opacity: 0.85 }}>{icon}</span>
      {label}
    </NavLink>
  );
}

function CourseSidebar({ navigate }) {
  return (
    <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Back */}
      <button
        onClick={() => navigate('/frontend-practice')}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 10px', borderRadius: 8, border: 'none',
          background: 'transparent', color: '#6b7280', fontSize: 12,
          cursor: 'pointer', marginBottom: 8, width: '100%',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#1e2128'; e.currentTarget.style.color = '#e5e7eb' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280' }}
      >
        <ArrowBackIcon sx={{ fontSize: 14 }} />
        返回前端習題
      </button>

      <p style={{ padding: '0 10px', marginBottom: 8, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#4b5563' }}>
        卡片進度總覽
      </p>

      {MONTHS.map(({ m, label, sub }) => {
        const { done, total, pct } = getMonthProgress(m)
        const done100 = pct === 100
        return (
          <div key={m} style={{ padding: '8px 10px', borderRadius: 8, background: '#1a1d24', marginBottom: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: done100 ? '#6bf7e3' : '#e5e7eb' }}>{label}</div>
                <div style={{ fontSize: 10, color: '#4b5563', marginTop: 1 }}>{sub}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: done100 ? '#6bf7e3' : '#9ca3af' }}>
                {done}/{total}
              </span>
            </div>
            <div style={{ height: 4, borderRadius: 99, background: '#2a2d35', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: pct + '%',
                borderRadius: 99,
                background: done100
                  ? 'linear-gradient(90deg, #6bf7e3, #3dd6c8)'
                  : 'linear-gradient(90deg, #5865f2, #818cf8)',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )
      })}
    </nav>
  )
}

function UserAvatar({ user }) {
  if (user.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt="avatar"
        className="w-full h-full object-cover"
      />
    );
  }
  return (
    <span className="text-white font-bold text-sm">
      {user.displayName?.[0]?.toUpperCase() ?? "U"}
    </span>
  );
}

export default function AdminLayout({ user, logOut }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const insideCourse = location.pathname.startsWith('/frontend-practice/')

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#f1f3f5" }}
    >
      {/* Sidebar */}
      <aside className="flex flex-col shrink-0 w-[180px]" style={sidebarBase}>
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 px-4 py-4"
          style={{ borderBottom: "1px solid #2a2d35" }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: "#5865f2" }}
          >
            W
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-semibold text-[13px] leading-tight truncate">
              Workbook
            </span>
            <span
              className="text-[11px] leading-tight truncate"
              style={{ color: "#6b7280" }}
            >
              後台管理系統
            </span>
          </div>
        </div>

        {/* Nav — switches based on route */}
        {insideCourse ? (
          <CourseSidebar navigate={navigate} />
        ) : (
          <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label} className="flex flex-col gap-0.5">
                <p
                  className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "#4b5563" }}
                >
                  {section.label}
                </p>
                {section.items.map((item) => (
                  <SidebarNavItem key={item.path} {...item} />
                ))}
              </div>
            ))}
          </nav>
        )}

        {/* Logout */}
        <div className="p-2" style={{ borderTop: "1px solid #2a2d35" }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ color: "#9ca3af", background: "transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1e2128";
              e.currentTarget.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#9ca3af";
            }}
          >
            <LogoutIcon sx={{ fontSize: 17 }} />
            登出
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header
          className="flex items-center justify-between shrink-0 px-6 h-[52px]"
          style={{ background: "#1a1d24", borderBottom: "1px solid #2a2d35" }}
        >
          <span className="text-sm font-medium" style={{ color: "#9ca3af" }}>
            後台管理系統
          </span>
          <div className="flex items-center gap-3">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: "#9ca3af", background: "transparent" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#2a2d35")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <DarkModeIcon sx={{ fontSize: 18 }} />
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: "#9ca3af", background: "transparent" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#2a2d35")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <NotificationsNoneIcon sx={{ fontSize: 18 }} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu((v) => !v)}
                className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center"
                style={{ background: "#5865f2" }}
              >
                <UserAvatar user={user} />
              </button>
              {showUserMenu && (
                <div
                  className="absolute right-0 top-10 rounded-xl shadow-xl py-1 min-w-[180px] z-50"
                  style={{ background: "#1e2128", border: "1px solid #2a2d35" }}
                >
                  <div
                    className="px-4 py-2"
                    style={{ borderBottom: "1px solid #2a2d35" }}
                  >
                    <p className="text-xs font-semibold truncate text-white">
                      {user.displayName}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: "#6b7280" }}
                    >
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm transition-colors"
                    style={{ color: "#ef4444" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#2a2d35")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    登出
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
