# Output Card:

1. Your full name?: - Praveen Kumar Sakthivel
2. Your role?: - Senior SoftWare developer (IPRO)
3. Project name?: - Live Agent Seperate Domain and Imporvised Ingestion settings Design
4. Problem you solved?: - Creating and Updating connection credentials in simpler way bu uploading the file(.csv,.json,.txt,.env) and Chatbot seperate domain for chatting with Live agent and getting help(create support ticket and platform informations).
5. What you built?: - Ingestion settings simpler connection creation and chatbot live agent seperate domain creation
6. Time this took WITHOUT AI?: - 1 weeks
7. Time it took WITH AI today?: - 4hrs
8. Will you use it next week? (YES/NO/MAYBE + why): - Yes we can do it next week - and why means simpler way to create or update the connection in ingestions and Live agent domain we don't have seperate domain instead of that if we have a seperate domain for live agent means it would be easier to track the direct custom issues and future no issues can come to our platform .
9. Paste the prompt(s) you used: -

   1. create a backend folder under main folder and docker file as well
   2. create a nav bar for ingestion settings with a seperate route
   3. create a nav bar full bar its too short _(with screenshot)_
   4. how to connect the live agent
   5. so create an .env file for this problem: One thing to know: it's a real WebSocket connection to ws://localhost:4000/ws/live-agent, so both the user tab and the agent console tab need the backend actually reachable at that address — if you're running the frontend through Docker but the backend elsewhere, update VITE_BACKEND_URL/VITE_BACKEND_WS_URL (in docker-compose.yml's build args or a .env) to point at wherever the backend actually lives.
   6. once live agent is trying to connect the in Agent console the request is not Initiating why ?
   7. still the live agent request in Agent request is not reflecting the Agent console page
   8. imporve the chatbot design more Attractive and more intractive
   9. show the chatbot Icon in Dashboard and ingestion settings route except Agent console
   10. Add Edit Option to change the creds after the success and if CUstom fields data is added in Array of Objects means show Edit Button before the close button and it will redirect to manage connection route with connection details data based on the custom fields will be added in based on the csv file uploading seamlessly
   11. train the chatbot more and give preview options in the chatbot once it opened, and if live agent is not available, give an option to create a support ticket and send a mail feature to CSM team (give a mock data for success message)
   12. show the data in dashboard page under the transactions at organizations/accounts like this with a imprvised design _(with screenshot)_
   13. tickets create should show in the Agent console if any tickets were created when live agent is offline
   14. while closing the chatbot in Dashboard or ingestion settings page, session should create newly and show the initial set of the Data in chatbot when its opened freshly
   15. Add upload plain text button once we clicked on the manageconnection in ingestion settings means, if we pass the Array of Objects or objects or plain input values also the data should upload in that connection based on input key names
   16. Add the code changes and explanation and how to run the Application what does the Application does, Add in the readme.md file
   17. give the prompts which i used to build this app, and add this in ai-chat-export.json and add in the readme.md file as well

   Full prompt-by-prompt history with what each one produced is in
   [`ai-chat-export.json`](./ai-chat-export.json); the raw, complete session
   transcript is in [`demo/chat_transcript.txt`](./demo/chat_transcript.txt).

# Ingestion Settings & Live Agent Console

A full-stack demo app for managing data-source connections, monitoring transaction
metrics, and getting help — either from a trained chatbot, a real human agent over a
live WebSocket chat, or by filing a support ticket when no agent is available.

React + Vite on the frontend, Node/Express + `ws` on the backend, wired together with
Docker Compose.

## What the application does

The app has three pages (shared sidebar nav) plus a chat widget that follows you
everywhere except the Agent Console:

### Dashboard (`/`) — Transaction Monitor

- A "System" card: a checklist of 8 transaction metrics (Processed Transactions,
  Surveys Sent, Mismatched Transactions, etc.) — check any of them to plot it on the
  line chart. Each metric name has a hover tooltip explaining what it counts.
- Date-range presets (Today / 7D / 15D / 1M / 6M / 1Y) plus a custom range — switching
  regenerates the chart data at the right granularity (hourly/daily/weekly/monthly).
- Hover the chart for a crosshair tooltip with every checked series' value at that
  point; "View as table" gives a plain data table as an accessible fallback.
- An Organizations/Accounts list below — **click any row to expand it** into its own
  independent mini transaction panel (own checklist, own chart, own "Hide Graph"
  toggle) scoped to that organization's/account's own mock data.

### Ingestion Settings (`/ingestion-settings`)

- A grid of 10 platform connection cards (SFTP, API, Arive, HawkSoft, …), filterable
  by All / Connected / Disabled / Not Connected and searchable by name.
- **Add New Connection**: upload a credentials file — `.csv` (key,value rows, or a
  header + one data row), `.json` (an object or an array of objects), or `.env`-style
  `key=value` lines. The parsed fields are previewed (masked) before you confirm, then
  POSTed to the backend and the card flips to Enabled.
- **Manage connection** (on any Enabled/Disabled card): shows the connection's fields
  (masked) and a mock recent-transactions log, and lets you:
  - **Edit** — change field values inline, add a custom field, remove a field,
    **replace all fields from a file**, or **paste plain text** directly (a JSON
    object, an array of objects, or `key=value`/`key,value` lines — same parser as
    the upload flow, keyed by whatever field names you give it).
  - **Disconnect** — reverts the card to Not Connected and clears its stored fields.

### Agent Console (`/agent-console`)

The "other side" of the live chat — meant to be opened in a second tab/browser to
actually exercise the live-agent flow:

- A **Live agent service** on/off switch. Turning it off immediately disconnects any
  active chats (on both ends) and blocks new users from starting one.
- A **Waiting** queue of users who clicked "Talk to a live agent" — Accept one to open
  a live chat with them.
- A **Support Tickets** panel listing every ticket users have filed (see below),
  pushed in live as they're created — no page refresh needed.

### Chatbot widget (bottom-right, everywhere except the Agent Console)

- Hover the launcher to see two quick actions: **Ask Assistant** and **Chat with Live
  Agent**.
- The assistant has ~8 trained topics (shown as a "Popular topics" list) plus a
  free-text question box that keyword-matches against them, falling back to a generic
  "I don't have an answer for that" reply with next steps.
- **Talk to a live agent** opens a real WebSocket connection to the backend, queues
  you, and shows a typing indicator until an agent (from the Agent Console) accepts.
- **If live agent support is turned off**, the widget offers **Create a support
  ticket** instead — fill in a subject and message, and it's POSTed to the backend,
  which returns a mock confirmation (ticket ID, an assigned CSM name, "emailed to
  csm-team@experience.com"). That ticket then shows up live in the Agent Console.
- Closing the widget always starts the next session fresh (back to the greeting and
  topic list) — except an **active** live chat is never dropped just because the
  panel was closed; only a finished one resets.

## Screenshots

|                                                                                                                      |                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| ![Transaction Monitor dashboard](demo/transactions_dashboard_page.png) Dashboard — Transaction Monitor               | ![Redesigned Ingestion Settings](demo/plan_redesign_ingestion_settings.png) Ingestion Settings, redesigned                          |
| ![Editing connection fields](demo/edit_connection_ingestion_settings.png) Manage connection — edit mode              | ![Adding a custom field](demo/edit_connection_custom_field_update.png) Manage connection — custom field added                       |
| ![Uploading a credentials file](demo/config_schema_updation_by_file_upload.png) Creating a connection by file upload | ![Pasting plain text credentials](demo/plain_text_updation_oncreds_or_config_schema.png) Updating credentials by pasting plain text |
| ![Chatbot offering a live agent chat](demo/chatbot_live_agent_console.png) Chatbot — live agent option               | ![Connected live agent chat](<demo/chatbot_live agent_connected_screen.png>) Chatbot — connected to a live agent                    |
| ![Agent Console with an active chat](demo/agent_console_chatbot.png) Agent Console — chatting with a user            |                                                                                                                                     |

## How to run it

### Option A — Docker Compose (recommended)

```bash
cp .env.example .env      # only needed if the backend isn't on localhost:4000
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

The frontend image bakes in `VITE_BACKEND_URL` / `VITE_BACKEND_WS_URL` from `.env` at
**build** time (Vite env vars aren't runtime-configurable), so if you change `.env`
you need `docker compose up --build` again, not just a restart.

### Option B — Local dev (two terminals)

```bash
# Terminal 1 — backend
cd backend
npm install
npm run dev          # http://localhost:4000, auto-restarts on change

# Terminal 2 — frontend
cd frontend
npm install
npm run dev           # http://localhost:5173
```

In local dev mode the frontend defaults to `http://localhost:4000` /
`ws://localhost:4000/ws/live-agent` for the backend without needing a `.env` file at
all (see `frontend/src/config.js`).

### Trying the live-agent flow end-to-end

1. Open `http://localhost:5173/agent-console` in one tab — leave the toggle **On**.
2. Open `http://localhost:5173/` in another tab (or a different browser), open the
   chat widget, and click **Chat with Live Agent**.
3. Back in the Agent Console tab, accept the session from the **Waiting** queue and
   chat.
4. Try flipping the toggle **Off** while a chat is active — both sides get
   disconnected immediately. Then try connecting again as the user — you'll be
   offered **Create a support ticket** instead, and it'll show up live in the console.

## Environment variables

| Variable              | Where              | Default                             | Purpose                                       |
| --------------------- | ------------------ | ----------------------------------- | --------------------------------------------- |
| `VITE_BACKEND_URL`    | frontend build arg | `http://localhost:4000`             | Base URL the frontend calls for REST requests |
| `VITE_BACKEND_WS_URL` | frontend build arg | `ws://localhost:4000/ws/live-agent` | WebSocket URL for the live-agent chat         |
| `PORT`                | backend            | `4000`                              | Port the Express/WS server listens on         |

Copy `.env.example` to `.env` at the repo root to override the frontend's build-time
values (used by `docker-compose.yml`); it's picked up automatically by Compose.

## Backend API

All state is **in-memory** — it resets whenever the backend process restarts. There's
no database and no auth; this is a demo/prototype backend.

| Method & path             | Purpose                                                                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /health`             | Liveness check                                                                                                                          |
| `GET /live-agent/status`  | `{ enabled }` — is live agent support currently on                                                                                      |
| `POST /live-agent/toggle` | `{ enabled }` → turns the service on/off, force-disconnecting active chats when turned off                                              |
| `GET /connections`        | List all created connections (platform id, field names, timestamp)                                                                      |
| `POST /connections`       | `{ platformId, credentials }` → creates/updates a connection (upsert by platform id); only field **names** are retained, not the values |
| `GET /support-tickets`    | List all tickets, newest last                                                                                                           |
| `POST /support-tickets`   | `{ subject, message }` → creates a mock ticket (random ID, assigned CSM, "mailed to" address), broadcasts it to connected agents        |
| `WS /ws/live-agent`       | The live chat protocol (see below)                                                                                                      |

### Live-agent WebSocket protocol

Both the chat widget (`role: "user"`) and the Agent Console (`role: "agent"`) connect
to the same endpoint and speak JSON messages:

- Client → server: `join` (`role: "user"` or `"agent"`), `accept` (agent only,
  `sessionId`), `message` (`sessionId`, `text`), `disconnect` (`sessionId`)
- Server → client: `joined`, `queue` (agent-only, list of waiting sessions),
  `agent_joined`, `accepted`, `message`, `disconnected` (`by`, `reason`),
  `unavailable`, `service_status` (`enabled`), `ticket_created` (agent-only, pushed
  whenever a support ticket is filed)

## Project structure

```
backend/
  src/
    index.js                  Express app + HTTP/WS server wiring
    liveAgentDomain.js         Queue, chat relay, on/off toggle, agent broadcast
    connectionsDomain.js       Create/list connections
    supportTicketsDomain.js    Create/list support tickets

frontend/
  src/
    App.jsx                    Routes + layout shell
    liveAgentUserContext.jsx   Owns the user-side live-agent WebSocket at the app root
                                (survives route changes, so switching tabs mid-chat
                                doesn't disconnect you)
    config.js                  Backend URLs (env-driven)
    chatbotKnowledge.js         Trained topics + free-text keyword matching
    credentialFileParser.js     Shared parser: CSV / JSON / array-of-objects / key=value
    transactionData.js          Mock metric + org/account data generators
    connectionDetailsData.js    Mock connection field/transaction data
    components/
      Dashboard.jsx             Transaction Monitor page
      TransactionChart.jsx      The line chart (SVG, hover tooltip, table fallback)
      IngestionSettings.jsx     Connections grid
      ConnectionUploadModal.jsx "Add New Connection" file-upload flow
      ConnectionDetailsModal.jsx "Manage connection" view/edit/disconnect flow
      AgentConsole.jsx          Human-agent side of the live chat + ticket inbox
      ChatbotWidget.jsx         The floating chat widget
      NavBar.jsx                Left sidebar
```

## Notable implementation details

- **Credential parsing** (`credentialFileParser.js`) auto-detects the input shape by
  content, not just file extension — a `.txt` file (or pasted text with no filename
  at all) that starts with `{` or `[` is parsed as JSON; a 2-row CSV is treated as a
  header + one data record (not two `key,value` pairs); everything else falls back to
  `key=value` / `key,value`-per-line parsing.
- **Mock data is deterministic**, not random-per-render: chart series and connection
  details are seeded from the metric/org/platform id, so numbers stay stable across
  re-renders and only change when you switch the date range or scope — but different
  organizations/accounts genuinely show different numbers (scaled by their verified
  user count).
- **The live-agent WebSocket connection lives in a React context at the app root**
  (`liveAgentUserContext.jsx`), not inside the chat widget component — this was a
  deliberate fix so that navigating to the Agent Console in the same browser tab (to
  check on your own queued session) doesn't tear down the connection.
- Chart colors follow a validated categorical palette (checked for colorblind-safe
  contrast) rather than reusing the app's UI accent color, keeping "this line is
  series X" and "this button is clickable" visually distinct.

## Known limitations

- No persistence — everything (connections, tickets, live sessions) lives in the
  backend's memory and is lost on restart.
- No authentication/authorization — anyone with the URL can act as an agent or create
  connections.
- Credential values are validated and stored only as field _names_ — there's no real
  third-party system on the other end to actually authenticate against.
- Chart and connection data are all mock/generated, not real transaction data.
