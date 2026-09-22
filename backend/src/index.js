import http from 'http'
import express from 'express'
import cors from 'cors'
import { createConnectionsDomain } from './connectionsDomain.js'
import { createAssistantDomain } from './assistantDomain.js'

const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const connections = createConnectionsDomain()
app.use('/connections', connections.router)

const assistant = createAssistantDomain()
app.use('/assistant', assistant.router)

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`backend listening on http://localhost:${PORT}`)
})
