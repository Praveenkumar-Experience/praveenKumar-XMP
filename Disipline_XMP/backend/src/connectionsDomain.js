import { Router } from 'express'

// Creates connections from uploaded credential files. Only field NAMES and a
// timestamp are retained — the actual credential values are validated and
// discarded, since this demo has no real third-party API to hand them to.
export function createConnectionsDomain() {
  const connections = new Map() // platformId -> { fields: string[], connectedAt }

  const router = Router()

  router.get('/', (_req, res) => {
    res.json({
      connections: [...connections.entries()].map(([platformId, data]) => ({
        platformId,
        fields: data.fields,
        connectedAt: data.connectedAt,
      })),
    })
  })

  router.post('/', (req, res) => {
    const { platformId, credentials } = req.body || {}

    if (typeof platformId !== 'string' || !platformId.trim()) {
      res.status(400).json({ error: 'platformId is required.' })
      return
    }
    if (typeof credentials !== 'object' || credentials === null || Array.isArray(credentials)) {
      res.status(400).json({ error: 'credentials must be an object of key-value pairs.' })
      return
    }
    const fields = Object.keys(credentials).filter((key) => String(credentials[key]).trim() !== '')
    if (fields.length === 0) {
      res.status(400).json({ error: 'No non-empty credential fields were found.' })
      return
    }

    connections.set(platformId, { fields, connectedAt: Date.now() })
    res.status(201).json({ platformId, fields })
  })

  return { router }
}
