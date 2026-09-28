import crypto from "crypto";

function sortKeys(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sortKeys);
  return Object.keys(value as Record<string, unknown>)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = sortKeys((value as Record<string, unknown>)[key]);
        return acc;
      },
      {} as Record<string, unknown>,
    );
}

function normalizeResumeData(resumeData: unknown) {
  return sortKeys(JSON.parse(JSON.stringify(resumeData || {})));
}

export function hashResumeData(resumeData: unknown): string {
  const normalized = normalizeResumeData(resumeData);
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(normalized))
    .digest("hex");
}

export function buildExportLabel(profileName: string): string {
  const dateStr = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${profileName} — ${dateStr}`;
}
