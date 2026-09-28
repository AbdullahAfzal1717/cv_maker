export function formatDateSlash(dateString: string): string {
  if (!dateString || dateString.toLowerCase() === "") return dateString || "";
  const [year, month] = dateString.split("-");
  if (!year || !month) return dateString;
  return `${month}/${year}`;
}

export function formatDateReadable(dateString: string): string {
  if (!dateString || dateString.toLowerCase() === "present")
    return dateString || "Present";
  const [year, month] = dateString.split("-");
  if (!year || !month) return dateString;
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export const formatMonthYear = formatDateReadable;

export function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
