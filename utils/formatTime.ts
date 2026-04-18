/**
 * Converts an ISO 8601 timestamp (e.g. "2026-04-14T19:05:11+00:00") to a
 * human-readable "ago" string: "just now", "5m ago", "3h ago", "2d ago", etc.
 */
export function timeAgo(timestamp: string | number | Date): string {
  const date = typeof timestamp === 'object' ? timestamp : new Date(timestamp)
  if (isNaN(date.getTime())) return String(timestamp)
  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return 'just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  const diffWeek = Math.floor(diffDay / 7)
  if (diffWeek < 5) return `${diffWeek}w ago`
  const diffMonth = Math.floor(diffDay / 30)
  if (diffMonth < 12) return `${diffMonth}mo ago`
  const diffYear = Math.floor(diffDay / 365)
  return `${diffYear}y ago`
}

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};
