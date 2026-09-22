import { Router } from 'express'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-5'

// Answers natural-language questions about the caller's ingestion
// integrations using a real LLM call, grounded in the platform connection
// data the frontend sends as context. Falls back to a clearly-labeled stub
// reply when no ANTHROPIC_API_KEY is configured, so the frontend can be
// built and wired up before a real key exists.
export function createAssistantDomain() {
  const router = Router()

  router.post('/ingestion', async (req, res) => {
    const { query, platforms } = req.body || {}

    if (typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ error: 'query is required.' })
      return
    }

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      res.json({
        stub: true,
        reply: `Stub response — no ANTHROPIC_API_KEY is configured on the backend yet, so this isn't a real model call. Once a key is set, I'll answer "${query.trim()}" using your actual integration data.`,
      })
      return
    }

    try {
      const systemPrompt = [
        'You are an assistant embedded in an admin dashboard, answering questions strictly about the',
        "user's data ingestion integrations (connectors like Arive, HawkSoft, SFTP, etc).",
        'Here is the current state of their connections as JSON:',
        JSON.stringify(Array.isArray(platforms) ? platforms : []),
        'Answer concisely (2-3 sentences max) using only this data. If the question is unrelated to ingestion',
        'integrations, say so briefly instead of guessing.',
      ].join(' ')

      const llmResponse = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 300,
          system: systemPrompt,
          messages: [{ role: 'user', content: query.trim() }],
        }),
      })

      if (!llmResponse.ok) {
        const detail = await llmResponse.text().catch(() => '')
        res.status(502).json({ error: 'The LLM provider rejected the request.', detail })
        return
      }

      const data = await llmResponse.json()
      const reply = data.content?.[0]?.text?.trim() || 'The model returned an empty response.'
      res.json({ stub: false, reply })
    } catch (err) {
      res.status(500).json({ error: 'Failed to reach the LLM provider.', detail: String(err) })
    }
  })

  return { router }
}
