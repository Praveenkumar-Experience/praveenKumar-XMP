export const CHANNELS = [
  {
    id: "instagram",
    name: "Instagram",
    initial: "IG",
    color: "#c2196b",
    bg: "#fbe7f1",
    allowAutopost: true,
    minScore: 4,
    maxPostsPerDay: 3,
    gapHours: 1,
    gapMinutes: 0,
    autoPostDelay: false,
    selectedTemplateIds: ["t1", "t14"],
  },
  {
    id: "facebook",
    name: "Facebook",
    initial: "FB",
    color: "#1868c4",
    bg: "#e7f0ff",
    allowAutopost: true,
    minScore: 3,
    maxPostsPerDay: 5,
    gapHours: 0,
    gapMinutes: 30,
    autoPostDelay: true,
    selectedTemplateIds: ["t5"],
  },
  {
    id: "google",
    name: "Google Business",
    initial: "G",
    color: "#1a8a3d",
    bg: "#e9f7ec",
    allowAutopost: false,
    minScore: 5,
    maxPostsPerDay: 2,
    gapHours: 2,
    gapMinutes: 0,
    autoPostDelay: false,
    selectedTemplateIds: ["t9", "t10", "t12"],
  },
  {
    id: "x",
    name: "X (Twitter)",
    initial: "X",
    color: "#334155",
    bg: "#eef1f5",
    allowAutopost: true,
    minScore: 4,
    maxPostsPerDay: 4,
    gapHours: 1,
    gapMinutes: 15,
    autoPostDelay: false,
    selectedTemplateIds: [],
  },
];

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

const GRADIENTS = [
  "linear-gradient(135deg, #232526, #414345)",
  "linear-gradient(135deg, #f5f7fa, #e6e9f0)",
  "linear-gradient(135deg, #f7c873, #e08e28)",
  "linear-gradient(135deg, #3a1c71, #6a3fae)",
  "linear-gradient(135deg, #396afc, #2948ff)",
  "linear-gradient(135deg, #eef1f5, #dfe4ea)",
  "linear-gradient(135deg, #6a8caf, #45658c)",
  "linear-gradient(135deg, #f5f5f5, #e2e2e2)",
  "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  "linear-gradient(135deg, #22223b, #4a4e69)",
  "linear-gradient(135deg, #2b2d42, #8d99ae)",
  "linear-gradient(135deg, #fdf0e6, #f6e0cf)",
  "linear-gradient(135deg, #0d0d0d, #1a1a1a)",
  "linear-gradient(135deg, #6a11cb, #e63980, #f5576c)",
];

const DARK_INDEXES = new Set([0, 8, 9, 10, 12]);

export function buildTemplateHtml(gradient, dark) {
  const color = dark ? "#f8fafc" : "#0f172a";
  const subColor = dark
    ? "rgba(248, 250, 252, 0.72)"
    : "rgba(15, 23, 42, 0.65)";
  return `<div style="font-family: 'Segoe UI', sans-serif; max-width: 320px; padding: 24px; border-radius: 16px; background: ${gradient}; color: ${color};">
  <div style="font-size: 18px; letter-spacing: 3px; color: #f5a524;">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
  <p style="margin: 14px 0 6px; font-size: 14px; line-height: 1.6; color: ${subColor};">"Absolutely loved the service! Highly recommend to anyone looking for quality and care."</p>
  <div style="margin-top: 12px; font-weight: 600; font-size: 13px;">&mdash; Jordan M.</div>
</div>`;
}

export const TEMPLATES = GRADIENTS.map((gradient, index) => ({
  id: `t${index + 1}`,
  name: `Template ${index + 1}`,
  gradient,
  dark: DARK_INDEXES.has(index),
  html: buildTemplateHtml(gradient, DARK_INDEXES.has(index)),
}));
