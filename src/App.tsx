import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useThemeStore } from './stores/themeStore'
import Layout from './components/Layout'
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import History from './pages/History'
import Account from './pages/Account'
import Games from './pages/Games'
import Knowledge from './pages/Knowledge'
import './App.css'

function App() {
  const { theme } = useThemeStore()

  return (
    <div className={theme}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assessment/:scaleId" element={<Assessment />} />
            <Route path="/history" element={<History />} />
            <Route path="/account" element={<Account />} />
            <Route path="/games" element={<Games />} />
            <Route path="/knowledge" element={<Knowledge />} />
          </Routes>
        </Layout>
        <Toaster position="top-center" />
      </BrowserRouter>
    </div>
  )
}

export default App
