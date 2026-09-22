import Reports from './Reports.jsx'
import { ORG_REPORT_TYPES, ORG_ACTIVITY_FEED } from '../organizationData.js'

export default function OrgReports() {
  return (
    <Reports
      title="Reports"
      subtitle="Platform-wide reports spanning every organization and account."
      reportTypes={ORG_REPORT_TYPES}
      activityFeed={ORG_ACTIVITY_FEED}
    />
  )
}
