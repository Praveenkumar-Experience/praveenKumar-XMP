// Mock data for the platform-level Organization menu (super-admin views spanning
// every account, as opposed to the single-account modules under Account menu).

export const ACCOUNTS_PENDING_DEACTIVATION = 17
export const ACCOUNT_TABS = ['New Accounts', 'My Accounts', 'All Accounts']
export const ORG_ACCOUNTS = [
  { id: 'a1', name: '07 Nov Account 2.0', tiers: 3, users: 23, info: null, activatedOn: '03 Jan 2024', status: 'Active' },
  { id: 'a2', name: '07 Nov Account editeddd', tiers: 0, users: 0, info: '8 Mismatches', activatedOn: '29 Jul 2024', status: 'Active' },
  { id: 'a3', name: '07 Nov Account 11', tiers: 8, users: 19, info: null, activatedOn: '02 May 2024', status: 'Active' },
  { id: 'a4', name: 'Uploader Testing Account', tiers: 0, users: 0, info: null, activatedOn: null, status: 'Onboarding' },
  { id: 'a5', name: 'Test - V2DEV-6776', tiers: 3, users: 2, info: null, activatedOn: '28 Aug 2023', status: 'Active' },
  { id: 'a6', name: 'IPL 1', tiers: 4, users: 6, info: null, activatedOn: '08 Jan 2025', status: 'Active' },
]

export const ADMIN_GROUP_LABELS = {
  onboarding: { label: 'Onboarding Group', color: '#eda100' },
  cs: { label: 'CS Group', color: '#2a78d6' },
  maker: { label: 'Maker Admin Group', color: '#4a3aa7' },
  checker: { label: 'Checker Admin Group', color: '#1baf7a' },
  banner: { label: 'Banner Management Admin Group', color: '#e34948' },
  superadmin: { label: 'Super Admin', color: '#0f172a' },
  sales: { label: 'Sales Group', color: '#c2196b' },
  xp4: { label: 'XP4 Group', color: '#0d9488' },
}

export const ADMINS = [
  { id: 'ad1', name: 'Abdul Nazar', groups: ['onboarding', 'cs'], orgCount: 16, status: 'Active' },
  { id: 'ad2', name: 'Abilash Jai Baskaren', groups: ['cs'], orgCount: 2, status: 'Inactive' },
  { id: 'ad3', name: 'Aditya L', groups: ['onboarding', 'maker', 'checker', 'banner', 'superadmin'], orgCount: 3, status: 'Active' },
  { id: 'ad4', name: 'Agent Liberty', groups: ['xp4'], orgCount: 1, status: 'Active' },
  { id: 'ad5', name: 'Ahmed Mahmoud', groups: ['sales', 'superadmin'], orgCount: 3, status: 'Active' },
  { id: 'ad6', name: 'Ajay Gowtham', groups: ['cs', 'onboarding'], orgCount: 1, status: 'Inactive' },
]

export const ADMIN_GROUPS = [
  { id: 'g1', name: 'CS Group', members: 14 },
  { id: 'g2', name: 'Onboarding Group', members: 9 },
  { id: 'g3', name: 'Maker Admin Group', members: 5 },
  { id: 'g4', name: 'Checker Admin Group', members: 5 },
  { id: 'g5', name: 'Sales Group', members: 7 },
]

export const ONBOARDING_ADMINS = [
  { id: 'oa1', name: 'Ganesh Hosamani', accounts: 34, users: 78, industries: 5 },
  { id: 'oa2', name: 'Jonathan Angel', accounts: 38, users: 50, industries: 6 },
  { id: 'oa3', name: 'Rashmi Kogali', accounts: 23, users: 135, industries: 3 },
]

export const INCOMPLETE_PROFILES = [
  { id: 'ip1', account: 'Genstone Insurance', userProfiles: 1, location: 1, admin: 'Test' },
  { id: 'ip2', account: 'Account 1', userProfiles: 0, location: 1, admin: 'Ammaturo' },
  { id: 'ip3', account: 'Summit Mortgage', userProfiles: 0, location: 1, admin: 'Test' },
]

export const ABUSIVE_STATS = { totalReviews: 739, totalEdited: 466, totalRestored: 529 }
export const FLAGGED_REVIEWS = [
  { id: 'fr1', name: 'Swathi User One', tag: 'Test Engineer', badge: 'Spanish Response Test', rating: 1, text: 'Tratar con Swathi User One fue desagradable porque el soporte al cliente tardó más de lo esperado en responder.', reviewer: 'Werner C', location: 'Loudon County – Seattle', date: '20 Jul 2026, 3:12 PM' },
  { id: 'fr2', name: 'Swathi User One', tag: 'Test Engineer', badge: 'Spanish Response Test', rating: 1, text: 'El soporte al cliente se sintió muy por debajo de lo esperado durante todo el proceso.', reviewer: 'Chasidy C', location: 'Loudon County – Seattle', date: '20 Jul 2026, 3:30 PM' },
]

export const EMAIL_VERIFICATION_TABS = ['Unverified', 'Approved', 'Rejected']
export const EMAIL_VERIFICATIONS = [
  { id: 'ev1', user: 'Marcus Ito', email: 'marcus.ito@example.com', daysSinceClaimed: 4, comments: 'Awaiting document upload', status: 'Unverified' },
  { id: 'ev2', user: 'Priya Nair', email: 'priya.nair@example.com', daysSinceClaimed: 12, comments: 'Escalated to support', status: 'Unverified' },
]

export const CHATBOT_TABS = ['Chatbot History', 'Un-Answered Questions']
export const CHATBOT_HISTORY = [
  { id: 'ch1', user: 'Dana Whitfield', userType: 'Customer', question: 'How do I update my billing address?', account: '07 Nov Account 2.0', lastChat: '21 Apr 2026', ticket: 'SF-88213', contact: '+1 555-0134', feedback: 'Positive' },
  { id: 'ch2', user: 'Owen Baptiste', userType: 'Customer', question: 'Why was my review flagged?', account: '07 Nov Account 2.0', lastChat: '19 Apr 2026', ticket: 'SF-88347', contact: '+1 555-0177', feedback: 'Neutral' },
]
export const UNANSWERED_QUESTIONS = [
  { id: 'uq1', user: 'Lena Fischer', userType: 'Customer', question: 'Can I export my reviews to CSV?', account: '07 Nov Account 2.0', lastChat: '22 Apr 2026', ticket: 'SF-88502', contact: '+1 555-0192', feedback: '–' },
]

export const ORG_REPORT_TYPES = ['Account Statistics Report', 'AWS Marketplace Customer Report', 'Chatbot Performance Report', 'Deactivated Users Report', 'Detailed Billing Report', 'Survey Results', 'User Details']
export const ORG_ACTIVITY_FEED = [
  { id: 'oaf1', actor: 'Hema Kumar', report: 'Detailed Billing Report', range: 'for All Time', time: '10 Sep, 8:33 AM' },
  { id: 'oaf2', actor: 'Hema Kumar', report: 'Detailed Billing Report', range: 'for Jun 1 – Jun 30', time: '10 Sep, 8:31 AM' },
  { id: 'oaf3', actor: 'Hema Kumar', report: 'Detailed Billing Report', range: 'for May 1 – Jun 30', time: '10 Sep, 8:27 AM' },
  { id: 'oaf4', actor: 'Hema Kumar', report: 'Detailed Billing Report', range: 'for Aug 1 – Aug 31', time: '10 Sep, 8:21 AM' },
]

export const PROMO_CODES = [
  { id: 'pc1', code: 'ADAM-QDZAUZ-100OFF', assignedTo: 'Adam Olivia', pack: 'PRO', users: 0, applicableTo: 'Enterprise', discount: 10, expiry: '18 Sep 2028', status: 'Active' },
  { id: 'pc2', code: 'POON-YDOTWZ-100OFF', assignedTo: 'Poonam Dixit', pack: 'PRO', users: 0, applicableTo: 'Enterprise', discount: 10, expiry: '18 Sep 2028', status: 'Active' },
  { id: 'pc3', code: 'ACCM-SEZPEB-100OFF', assignedTo: 'accmgr mas', pack: 'PRO', users: 0, applicableTo: 'Enterprise', discount: 10, expiry: '18 Sep 2028', status: 'Active' },
  { id: 'pc4', code: 'CHOC-XAYRBD-100OFF', assignedTo: 'Chocolate', pack: 'PRO', users: 0, applicableTo: 'Enterprise', discount: 10, expiry: '17 Sep 2028', status: 'Active' },
]

export const ENGAGEMENT_TILES = ['Senders Info', 'Unsubscribed Domains', 'Triggers', 'Email Service Provider', 'SMTP Users']
export const SMTP_USERS = [
  { id: 's1', domain: 'experience.me', user: 'team.product@experience.me', address: 'mail.experience.me', auth: 'plain', tls: true, status: 'Active' },
  { id: 's2', domain: 'experience.me', user: 'team.experience@experience.me', address: 'mail.experience.me', auth: 'plain', tls: false, status: 'Active' },
  { id: 's3', domain: 'experience.me', user: 'supportteam@experience.me', address: 'mail.experience.me', auth: 'plain', tls: false, status: 'Active' },
  { id: 's4', domain: 'experience.me', user: 'product-team@experience.me', address: 'mail.experience.me', auth: 'plain', tls: true, status: 'Active' },
]
