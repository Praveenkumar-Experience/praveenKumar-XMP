export const STAGES = [
  { id: 'new', label: 'New' },
  { id: 'needs_response', label: 'Needs Response' },
  { id: 'responded', label: 'Responded' },
  { id: 'resolved', label: 'Resolved' },
]

export const NEW_REVIEWS_TREND = [
  { label: 'Mon', value: 4 },
  { label: 'Tue', value: 9 },
  { label: 'Wed', value: 7 },
  { label: 'Thu', value: 3 },
  { label: 'Fri', value: 8 },
]

export const REVIEWS = [
  { id: 'rv1', customer: 'Dana Whitfield', initial: 'DW', color: '#2a78d6', accountId: 'acct-4471', rating: 5, snippet: 'Absolutely loved the service! Highly recommend to anyone looking for quality and care.', channel: 'google', stage: 'new', due: '18 Apr', comments: 2, attachments: 1 },
  { id: 'rv2', customer: 'Marcus Ito', initial: 'MI', color: '#1baf7a', accountId: 'acct-2290', rating: 4, snippet: 'Good experience overall, the team was responsive and professional.', channel: 'facebook', stage: 'new', due: '09 Mar', comments: 4, attachments: 1 },
  { id: 'rv3', customer: 'Priya Nair', initial: 'PN', color: '#4a3aa7', accountId: 'acct-6603', rating: 2, snippet: 'Took longer than expected to hear back after my initial inquiry.', channel: 'x', stage: 'new', due: 'No due date', comments: 1, attachments: 3 },

  { id: 'rv4', customer: 'Owen Baptiste', initial: 'OB', color: '#c2196b', accountId: 'acct-4471', rating: 1, snippet: 'Very disappointed with how my complaint was handled by the front desk.', channel: 'instagram', stage: 'needs_response', due: '21 Mar', comments: 3, attachments: 1 },
  { id: 'rv5', customer: 'Lena Fischer', initial: 'LF', color: '#1a8a3d', accountId: 'acct-2290', rating: 3, snippet: 'Decent, but the wait time could be improved for next time.', channel: 'google', stage: 'needs_response', due: 'No due date', comments: 7, attachments: 2, featured: true, email: 'lena.fischer@example.com', manager: 'Priya Shah' },
  { id: 'rv6', customer: 'Theo Marchetti', initial: 'TM', color: '#334155', accountId: 'acct-6603', rating: 5, snippet: 'Excellent communication from start to finish, will use again.', channel: 'x', stage: 'needs_response', due: '23 Apr', comments: 2, attachments: 6 },
  { id: 'rv7', customer: 'Grace Odell', initial: 'GO', color: '#1868c4', accountId: 'acct-4471', rating: 4, snippet: 'Friendly staff and a clean, welcoming space.', channel: 'facebook', stage: 'needs_response', due: '16 Apr', comments: 1, attachments: 1 },

  { id: 'rv8', customer: 'Farah Idris', initial: 'FI', color: '#2a78d6', accountId: 'acct-2290', rating: 5, snippet: 'They went above and beyond to resolve my issue quickly.', channel: 'google', stage: 'responded', due: '24 Mar', comments: 2, attachments: 1 },
  { id: 'rv9', customer: 'Callum Reyes', initial: 'CR', color: '#1baf7a', accountId: 'acct-6603', rating: 5, snippet: 'Impressed by how thorough the follow-up was after my visit.', channel: 'instagram', stage: 'responded', due: '05 Apr', comments: 1, attachments: 3 },
  { id: 'rv10', customer: 'Ingrid Solberg', initial: 'IS', color: '#4a3aa7', accountId: 'acct-4471', rating: 3, snippet: 'Average experience, nothing stood out either way.', channel: 'x', stage: 'responded', due: '30 Mar', comments: 4, attachments: 7 },

  { id: 'rv11', customer: 'Julio Ferreira', initial: 'JF', color: '#c2196b', accountId: 'acct-2290', rating: 5, snippet: 'Outstanding support, my go-to recommendation from now on.', channel: 'google', stage: 'resolved', due: '10 Mar', comments: 1, attachments: 3 },
  { id: 'rv12', customer: 'Wren Sato', initial: 'WS', color: '#1a8a3d', accountId: 'acct-6603', rating: 4, snippet: 'Resolved my concern within a day, appreciated the speed.', channel: 'facebook', stage: 'resolved', due: '06 Apr', comments: 1, attachments: 3 },
]
