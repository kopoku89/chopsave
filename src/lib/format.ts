// Formatting helpers. Keep UI code free of ad-hoc formatting logic.

/** Format pesewas into a Ghana Cedi currency string. */
export function formatGHS(pesewas: number): string {
  const cedis = pesewas / 100;
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(cedis);
}

/** Percentage discount between an original and discounted price. */
export function discountPercent(original: number, discounted: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

/** Short, human-friendly time window, e.g. "5:30 PM – 8:00 PM". */
export function formatPickupWindow(startIso: string, endIso: string): string {
  const fmt = new Intl.DateTimeFormat("en-GH", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${fmt.format(new Date(startIso))} – ${fmt.format(new Date(endIso))}`;
}

/** "Today", "Tomorrow" or a short date like "Mon 22 Apr". */
export function formatPickupDay(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  if (sameDay) return "Today";
  if (isTomorrow) return "Tomorrow";
  return new Intl.DateTimeFormat("en-GH", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(date);
}

/** Returns a short distance label. Mock helper for UI only. */
export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
