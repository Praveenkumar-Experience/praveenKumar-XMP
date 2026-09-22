import { ACCOUNTS } from './transactionData.js'
import { PLATFORMS } from './ingestionData.js'

// Mock "logged in account" the agent reasons about — deliberately has a
// couple of issues baked in (unverified email, failed sync) so the demo
// queries below always have something real to find.
export const USERS = [
  {
    id: "user-1",
    name: "Praveen Kumar",
    email: "praveen.kumar@experience.com",
    initial: "PK",
    color: "#2a78d6",
    accountId: "acct-4471",
  },
  {
    id: "user-2",
    name: "Priya Shah",
    email: "priyatest@experience.com",
    initial: "PS",
    color: "#2a78d6",
    accountId: "acct-4471",
  },
  {
    id: "user-3",
    name: "Carlos Nunez",
    email: "Carlostest@experience.com",
    initial: "CN",
    color: "#1baf7a",
    accountId: "acct-2290",
  },
  {
    id: "user-4",
    name: "Emily Chen",
    email: "Emilytest@experience.com",
    initial: "EC",
    color: "#1baf7a",
    accountId: "acct-2290",
  },
  {
    id: "user-5",
    name: "Sam O’Neal",
    email: "samtest@experience.com",
    initial: "SO",
    color: "#4a3aa7",
    accountId: "acct-6603",
  },
];

const primaryUser = USERS[0]
export const CURRENT_ACCOUNT = {
  name: primaryUser.name,
  email: primaryUser.email,
  emailVerified: false,
  accountName: ACCOUNTS.find((a) => a.id === primaryUser.accountId)?.name ?? '',
  role: 'Admin',
}

export const KNOWN_ISSUES = [
  {
    id: "sftp-timeout",
    severity: "error",
    title: "Today's transactions did not process",
    message:
      "The SFTP connector for Academy Mortgage — Denver timed out at 2:14 AM while syncing. 0 of an expected ~210 transactions were processed today.",
    keywords: [
      "transaction",
      "processed",
      "sync",
      "sftp",
      "ingest",
      "ingestion",
      "pipeline",
    ],
  },
  {
    id: "ig-rate-limit",
    severity: "warning",
    title: "Instagram autopost is delayed",
    message:
      "Instagram autoposting is running about 40 minutes behind due to a temporary API rate limit from Meta. Queued posts will publish automatically once the limit clears.",
    keywords: ["instagram", "autopost"],
  },
  {
    id: "release-notes",
    severity: "info",
    title: "Known issue in this release (2026.9.3)",
    message:
      "Reports export can time out for date ranges over 6 months. A fix is scheduled for the next release — for now, export in smaller ranges.",
    keywords: [
      "release",
      "known issue",
      "bug",
      "export",
      "reports",
      "version",
      "error message",
    ],
  },
];

export const SUGGESTED_PROMPTS = [
  "Is my email verified?",
  "Were today's transactions processed?",
  "How are my ingestion integrations doing?",
  "Any known issues with this release?",
  "Give me a full account health check",
];

// Word-boundary match so short names (e.g. "API") don't false-positive
// inside unrelated words (e.g. "capital").
function mentionsWord(q, word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(q);
}

function findMentionedPlatform(q) {
  return PLATFORMS.find((p) => mentionsWord(q, p.name.toLowerCase()) || mentionsWord(q, p.id));
}

function platformFinding(platform) {
  if (platform.status === "enabled") {
    return {
      severity: "ok",
      title: `${platform.name} is connected`,
      message: `${platform.name} is connected and enabled — syncing normally.`,
    };
  }
  if (platform.status === "disabled") {
    return {
      severity: "warning",
      title: `${platform.name} is disabled`,
      message: `${platform.name} is connected but currently disabled, so it isn't syncing. Re-enable it from Ingestion Settings.`,
    };
  }
  return {
    severity: "error",
    title: `${platform.name} isn't connected`,
    message: `${platform.name} hasn't been connected yet. Add a connection for it from Ingestion Settings.`,
  };
}

function integrationsFinding() {
  const enabled = PLATFORMS.filter((p) => p.status === "enabled");
  const disabled = PLATFORMS.filter((p) => p.status === "disabled");
  const notConnected = PLATFORMS.filter((p) => p.status === "not_connected");

  if (disabled.length === 0 && notConnected.length === 0) {
    return {
      severity: "ok",
      title: "Integrations healthy",
      message: `All ${enabled.length} connected integrations are enabled and syncing.`,
    };
  }

  const parts = [`${enabled.length} enabled`];
  if (disabled.length) parts.push(`${disabled.length} disabled (${disabled.map((p) => p.name).join(", ")})`);
  if (notConnected.length) parts.push(`${notConnected.length} not connected (${notConnected.map((p) => p.name).join(", ")})`);

  return {
    severity: disabled.length ? "warning" : "info",
    title: "Some integrations need attention",
    message: `${parts.join("; ")}. Manage connections from Ingestion Settings.`,
  };
}

// A standing "detected issue" for the sidebar/banner, computed from the same
// mock platform data the chat agent reasons over — null when nothing to flag.
export const INTEGRATION_ISSUE = (() => {
  const disabled = PLATFORMS.filter((p) => p.status === "disabled");
  const notConnected = PLATFORMS.filter((p) => p.status === "not_connected");
  if (disabled.length === 0 && notConnected.length === 0) return null;
  const finding = integrationsFinding();
  return { id: "integrations-attention", severity: finding.severity, title: finding.title, message: finding.message };
})();

const EMAIL_KEYWORDS = ["email", "verify", "verified", "verification"];
const INTEGRATION_KEYWORDS = [
  "integration",
  "connection",
  "connected",
  "ingestion",
  "data source",
  "platform",
];
const HEALTH_KEYWORDS = [
  "health",
  "everything",
  "status",
  "how is my account",
  "overview",
  "summary",
];

function emailFinding() {
  return CURRENT_ACCOUNT.emailVerified
    ? {
        severity: "ok",
        title: "Email verified",
        message: `${CURRENT_ACCOUNT.email} is verified.`,
      }
    : {
        severity: "error",
        title: "Email not verified",
        message: `${CURRENT_ACCOUNT.email} is not verified yet. Check your inbox for a verification link, or resend it from Account Settings.`,
      };
}

function issueFinding(issue) {
  return {
    severity: issue.severity,
    title: issue.title,
    message: issue.message,
  };
}

// True when a query is specifically about ingestion integrations (and isn't
// a broad "full health check", which stays on the local aggregate answer so
// it can cover every topic in one reply). AnalyticsDashboard uses this to
// decide whether to route the question to the real backend/LLM endpoint.
export function isIngestionQuery(query) {
  const q = query.toLowerCase();
  if (HEALTH_KEYWORDS.some((k) => q.includes(k))) return false;
  return !!findMentionedPlatform(q) || INTEGRATION_KEYWORDS.some((k) => q.includes(k));
}

// Simple keyword-matched "reasoning" — no backend LLM, just enough logic to
// make the canned demo queries (and their near-variants) resolve sensibly.
export function runAgent(query) {
  const q = query.toLowerCase();
  const steps = [
    "Checking your account status…",
    "Checking today's transaction pipeline…",
    "Checking your ingestion connections…",
    "Scanning known issues for this release…",
  ];

  const isHealthCheck = HEALTH_KEYWORDS.some((k) => q.includes(k));
  const wantsEmail = isHealthCheck || EMAIL_KEYWORDS.some((k) => q.includes(k));
  const mentionedPlatform = findMentionedPlatform(q);
  const wantsIntegrations = isHealthCheck || !!mentionedPlatform || INTEGRATION_KEYWORDS.some((k) => q.includes(k));
  const matchedIssues = isHealthCheck
    ? KNOWN_ISSUES
    : KNOWN_ISSUES.filter((issue) => issue.keywords.some((k) => q.includes(k)));

  const findings = [];
  if (wantsEmail) findings.push(emailFinding());
  if (wantsIntegrations) findings.push(mentionedPlatform ? platformFinding(mentionedPlatform) : integrationsFinding());
  matchedIssues.forEach((issue) => findings.push(issueFinding(issue)));

  if (findings.length === 0) {
    return {
      steps,
      findings: [],
      fallback:
        "I couldn't find anything specific to that in your account. Try asking about email verification, today's transactions, your ingestion integrations, or known issues with this release.",
    };
  }

  return { steps, findings, fallback: null };
}
