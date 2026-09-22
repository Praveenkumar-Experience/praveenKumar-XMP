export function parseCredentialsFile(text, filename = "") {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("The input is empty.");
  }

  // Sniff JSON by content too, not just a .json filename — plain pasted text
  // has no filename at all.
  const looksLikeJson = filename.toLowerCase().endsWith(".json") || /^[[{]/.test(trimmed);
  if (looksLikeJson) {
    let data;
    try {
      data = JSON.parse(trimmed);
    } catch {
      throw new Error("Could not parse this as JSON.");
    }
    return normalizeJsonCredentials(data);
  }

  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.every((line) => /^[^=,]+=.*$/.test(line))) {
    const result = {};
    for (const line of lines) {
      const idx = line.indexOf("=");
      result[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
    return stripEmpty(result);
  }

  const rows = lines.map((line) => line.split(",").map((cell) => cell.trim()));
  const hasKeyValueHeader =
    rows[0]?.[0]?.toLowerCase() === "key" &&
    rows[0]?.[1]?.toLowerCase() === "value";

  // A single header row + a single data row (e.g. an exported table row) is a
  // column-per-field record, not a list of "key,value" pairs — zip them.
  // Ambiguous only when both rows have exactly 2 columns; a single-record
  // export is the far more common shape for that case, so it wins.
  if (
    !hasKeyValueHeader &&
    rows.length === 2 &&
    rows[0].length === rows[1].length &&
    rows[0].length >= 2
  ) {
    const result = {};
    rows[0].forEach((key, i) => {
      if (key) result[key] = rows[1][i];
    });
    return stripEmpty(result);
  }

  const dataRows = hasKeyValueHeader ? rows.slice(1) : rows;

  const result = {};
  for (const row of dataRows) {
    if (row.length < 2 || !row[0]) continue;
    result[row[0]] = row.slice(1).join(",");
  }

  if (Object.keys(result).length === 0) {
    throw new Error('Could not find any "key,value" pairs in this file.');
  }
  return stripEmpty(result);
}

// Accepts either a single { field: value } object, or an array of objects to
// merge — each array item is either a { key, value } pair (used verbatim) or
// an arbitrary object whose own keys/values are folded in directly, so any
// input key names carry straight through to the resulting credentials.
function normalizeJsonCredentials(data) {
  if (Array.isArray(data)) {
    const merged = {};
    for (const item of data) {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        throw new Error("Each item in the array must be an object of credential fields.");
      }
      const keys = Object.keys(item);
      if (keys.length === 2 && keys.includes("key") && keys.includes("value")) {
        merged[item.key] = item.value;
      } else {
        Object.assign(merged, item);
      }
    }
    return stripEmpty(merged);
  }

  if (typeof data !== "object" || data === null) {
    throw new Error("The JSON must be an object, or an array of objects, of credential fields.");
  }
  return stripEmpty(data);
}

function stripEmpty(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (String(value).trim() !== "") result[key] = value;
  }
  if (Object.keys(result).length === 0) {
    throw new Error("No non-empty credential fields were found in this file.");
  }
  return result;
}

export function maskCredentialValue(value) {
  const str = String(value);
  if (str.length <= 4) return "••••";
  return `${str.slice(0, 2)}••••${str.slice(-2)}`;
}
