import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import SignIn from './components/SignIn.jsx'
import IngestionSettings from './components/IngestionSettings.jsx'
import AutopostSettings from './components/AutopostSettings.jsx'
import TemplateEditor from './components/TemplateEditor.jsx'
import { TemplatesProvider } from './templatesContext.jsx'

function RequireAuth({ children }) {
  const location = useLocation()
  const isAuthed = localStorage.getItem('exp_authed') === 'true'
  if (!isAuthed) return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  return children
}

function AppShell() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <NavBar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/ingestion-settings" replace />} />
          <Route path="/ingestion-settings" element={<IngestionSettings />} />
          <Route path="/autopost-settings" element={<AutopostSettings />} />
          <Route path="/autopost-settings/tier/:tierId" element={<AutopostSettings />} />
          <Route path="/autopost-settings/user/:userId" element={<AutopostSettings />} />
          <Route path="/autopost-settings/templates/new" element={<TemplateEditor />} />
          <Route path="/autopost-settings/templates/:templateId" element={<TemplateEditor />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <TemplatesProvider>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <AppShell />
              </RequireAuth>
            }
          />
        </Routes>
      </TemplatesProvider>
    </BrowserRouter>
  )
}
