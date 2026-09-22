import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import NavBar from './components/NavBar.jsx'
import IssueBanner from './components/IssueBanner.jsx'
import SignIn from './components/SignIn.jsx'
import Dashboard from './components/Dashboard.jsx'
import AnalyticsDashboard from './components/AnalyticsDashboard.jsx'
import Hierarchy from './components/Hierarchy.jsx'
import SettingsLayout from './components/SettingsLayout.jsx'
import AccountSettings from './components/AccountSettings.jsx'
import IngestionSettings from './components/IngestionSettings.jsx'
import AutopostSettings from './components/AutopostSettings.jsx'
import TemplateEditor from './components/TemplateEditor.jsx'
import TransactionMonitor from './components/TransactionMonitor.jsx'
import Transactions from './components/Transactions.jsx'
import ReviewsManagement from './components/ReviewsManagement.jsx'
import Widgets from './components/Widgets.jsx'
import Reports from './components/Reports.jsx'
import Listings from './components/Listings.jsx'
import Campaigns from './components/Campaigns.jsx'
import LearningHub from './components/LearningHub.jsx'
import OrgAccounts from './components/OrgAccounts.jsx'
import OrgAdmins from './components/OrgAdmins.jsx'
import OrgGroups from './components/OrgGroups.jsx'
import OrgAbusiveReviews from './components/OrgAbusiveReviews.jsx'
import OrgIndividualProfiles from './components/OrgIndividualProfiles.jsx'
import OrgChatbotHistory from './components/OrgChatbotHistory.jsx'
import OrgReports from './components/OrgReports.jsx'
import OrgSettings from './components/OrgSettings.jsx'
import ComingSoon from './components/ComingSoon.jsx'
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
        <IssueBanner />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hierarchy" element={<Hierarchy />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="account" replace />} />
            <Route path="account" element={<AccountSettings />} />
            <Route path="ingestion" element={<IngestionSettings />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="autopost" element={<AutopostSettings />} />
            <Route path="autopost/tier/:tierId" element={<AutopostSettings />} />
            <Route path="autopost/user/:userId" element={<AutopostSettings />} />
            <Route path="autopost/templates/new" element={<TemplateEditor />} />
            <Route path="autopost/templates/:templateId" element={<TemplateEditor />} />
          </Route>
          <Route path="/listings" element={<Listings />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/transaction-monitor" element={<TransactionMonitor />} />
          <Route path="/social-posts" element={<ComingSoon icon={MessageSquare} title="Social Posts" description="A feed of everything auto-posted to your social channels is coming here." />} />
          <Route path="/reviews-management" element={<ReviewsManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/widgets" element={<Widgets />} />
          <Route path="/learning-hub" element={<LearningHub />} />
          <Route path="/organization/accounts" element={<OrgAccounts />} />
          <Route path="/organization/admins" element={<OrgAdmins />} />
          <Route path="/organization/groups" element={<OrgGroups />} />
          <Route path="/organization/abusive-reviews" element={<OrgAbusiveReviews />} />
          <Route path="/organization/individual-profiles" element={<OrgIndividualProfiles />} />
          <Route path="/organization/chatbot-history" element={<OrgChatbotHistory />} />
          <Route path="/organization/reports" element={<OrgReports />} />
          <Route path="/organization/settings" element={<OrgSettings />} />
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
