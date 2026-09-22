// Mock data for the Transactions queue (Unprocessed transactions grouped by status).
export const QUEUE_TABS = [
  { id: 'mismatched', label: 'Mismatched' },
  { id: 'processed', label: 'Processed' },
  { id: 'uncollected', label: 'Uncollected' },
  { id: 'unsubscribed', label: 'Unsubscribed' },
  { id: 'mapped', label: 'Mapped' },
  { id: 'archived', label: 'Archived' },
  { id: 'corrupt', label: 'Corrupt' },
  { id: 'ignored', label: 'Ignored' },
  { id: 'duplicate', label: 'Duplicate' },
]

export const QUEUE_ROWS = [
  { id: 'txn-8821', status: 'mismatched', name: 'TXN-88213', customer: 'Dana Whitfield', sourceId: 'SRC-4471-0219', reason: 'Email does not match any known contact', date: '18 Apr 2026' },
  { id: 'txn-8834', status: 'mismatched', name: 'TXN-88347', customer: 'Marcus Ito', sourceId: 'SRC-2290-0552', reason: 'Phone number format not recognized', date: '19 Apr 2026' },
  { id: 'txn-8850', status: 'mismatched', name: 'TXN-88502', customer: 'Priya Nair', sourceId: 'SRC-6603-0118', reason: 'Account ID missing from mapping table', date: '21 Apr 2026' },
  { id: 'txn-9012', status: 'corrupt', name: 'TXN-90121', customer: 'Owen Baptiste', sourceId: 'SRC-4471-0730', reason: 'File encoding unreadable', date: '22 Apr 2026' },
  { id: 'txn-9033', status: 'corrupt', name: 'TXN-90334', customer: 'Lena Fischer', sourceId: 'SRC-2290-0741', reason: 'Required field truncated mid-record', date: '23 Apr 2026' },
  { id: 'txn-9101', status: 'duplicate', name: 'TXN-91018', customer: 'Theo Marchetti', sourceId: 'SRC-6603-0902', reason: 'Duplicate of TXN-90987', date: '24 Apr 2026' },
  { id: 'txn-9114', status: 'duplicate', name: 'TXN-91145', customer: 'Grace Odell', sourceId: 'SRC-4471-0913', reason: 'Duplicate of TXN-91100', date: '24 Apr 2026' },
  { id: 'txn-9127', status: 'duplicate', name: 'TXN-91278', customer: 'Farah Idris', sourceId: 'SRC-2290-0925', reason: 'Duplicate of TXN-91250', date: '25 Apr 2026' },
  { id: 'txn-9201', status: 'unsubscribed', name: 'TXN-92019', customer: 'Callum Reyes', sourceId: 'SRC-6603-1004', reason: 'Recipient unsubscribed before send', date: '26 Apr 2026' },
  { id: 'txn-9214', status: 'unsubscribed', name: 'TXN-92142', customer: 'Ingrid Solberg', sourceId: 'SRC-4471-1017', reason: 'Recipient unsubscribed before send', date: '27 Apr 2026' },
]
