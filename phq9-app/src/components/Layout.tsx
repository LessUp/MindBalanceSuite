import { Sun, Moon, User, BarChart3, History } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useThemeStore } from '../stores/themeStore'
import { useAuthStore } from '../stores/authStore'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useThemeStore()
  const { user, isAuthenticated, logout } = useAuthStore()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            心理健康自评中心
          </Link>
          
          <nav className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <BarChart3 size={16} />
              量表评估
            </Link>
            <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
              <History size={16} />
              历史记录
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/account" className={`nav-link ${isActive('/account') ? 'active' : ''}`}>
                  <User size={16} />
                  {user?.name}
                </Link>
                <button onClick={logout} className="nav-link">
                  退出
                </button>
              </>
            ) : (
              <Link to="/account" className={`nav-link ${isActive('/account') ? 'active' : ''}`}>
                <User size={16} />
                账户
              </Link>
            )}
            <button onClick={toggleTheme} className="theme-toggle" title={`切换到${theme === 'light' ? '深色' : '浅色'}模式`}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>本工具用于自我筛查与健康教育，不能替代专业人员的临床诊断或治疗建议。</p>
          <p>如有明显困扰或功能受损，请尽快咨询精神科或心理健康专业人员。</p>
          <p>&copy; 2024 心理健康自评中心. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  )
}