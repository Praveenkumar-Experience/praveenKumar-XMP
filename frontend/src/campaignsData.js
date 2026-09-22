// Mock data for the Campaigns list.
export const CAMPAIGN_STATS = {
  totalSurveysSent: 7,
  totalResponses: 4,
  avgCompletionRate: 57.14,
  incompleteSurveys: 0,
  accountLevelNps: 0,
}

export const CAMPAIGN_TYPES = ['Survey Campaign', 'No Survey Campaign', 'SMS Campaign', 'SMS Alert Campaign', 'Group']

export const CAMPAIGNS = [
  { id: 'c1', name: 'Public Campaign', badge: 'Primary', recipients: 7, responses: 4, completionRate: 57.1, avgScore: 3.25, status: 'Active', lastModified: '01 Sep 2026', lastActivated: '17 Jul 2024' },
  { id: 'c2', name: 'Sahaj Test Temp', recipients: 0, responses: 0, completionRate: null, avgScore: null, status: 'Active', lastModified: '08 Jul 2026', lastActivated: '08 Jul 2026' },
  { id: 'c3', name: 'test', recipients: 0, responses: 0, completionRate: null, avgScore: null, status: 'Active', lastModified: '23 Jun 2026', lastActivated: '22 Jul 2026' },
  { id: 'c4', name: 'Blank Template', recipients: null, responses: null, completionRate: null, avgScore: null, status: 'Draft', lastModified: null, lastActivated: null, noSurvey: true },
]
