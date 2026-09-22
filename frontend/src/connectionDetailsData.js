// Deterministic mock connection details for platforms that are Enabled/Disabled
// without ever going through the upload flow this session (the ones seeded as
// already-connected). Uploaded connections show their real parsed fields instead —
// see IngestionSettings.jsx's connectionCredentials map.

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash) || 1
}

function seededRandom(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return function next() {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const FIELD_TEMPLATES = {
  sftp: [
    ['Host', () => 'sftp.experience-transfer.com'],
    ['Port', () => '22'],
    ['Username', (rand) => `svc_ingest_${Math.floor(rand() * 900 + 100)}`],
    ['Private Key', (rand) => `ssh-rsa-${randomToken(rand, 28)}`],
  ],
  api: [
    ['API Key', (rand) => `ak_live_${randomToken(rand, 20)}`],
    ['Endpoint', () => 'https://api.experience.com/v2'],
    ['Scope', () => 'transactions:read'],
  ],
  default: [
    ['Client ID', (rand) => `cid_${randomToken(rand, 10)}`],
    ['API Token', (rand) => randomToken(rand, 24)],
    ['Account Region', (rand) => (rand() > 0.5 ? 'us-east-1' : 'us-west-2')],
  ],
}

function randomToken(rand, length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let out = ''
  for (let i = 0; i < length; i++) out += chars[Math.floor(rand() * chars.length)]
  return out
}

const STATUS_WEIGHTS = [
  ['Success', 0.78],
  ['Pending', 0.12],
  ['Failed', 0.1],
]

function pickStatus(rand) {
  const r = rand()
  let acc = 0
  for (const [status, weight] of STATUS_WEIGHTS) {
    acc += weight
    if (r <= acc) return status
  }
  return 'Success'
}

export function getMockConnectionDetails(platform, now = new Date('2026-08-26T11:45:00')) {
  const rand = seededRandom(hashString(`connection:${platform.id}`))
  const template = FIELD_TEMPLATES[platform.kind] || FIELD_TEMPLATES.default

  const fields = template.map(([key, gen]) => ({ key, value: gen(rand) }))

  const connectedDaysAgo = 5 + Math.floor(rand() * 200)
  const connectedSince = new Date(now.getTime() - connectedDaysAgo * 24 * 60 * 60 * 1000)

  const transactions = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getTime() - i * 8 * 60 * 60 * 1000)
    return {
      id: `TXN-${randomToken(rand, 8).toUpperCase()}`,
      date,
      status: pickStatus(rand),
    }
  })

  return { fields, connectedSince, transactions }
}
