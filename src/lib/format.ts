export function formatNaira(kobo: number) {
  return `₦${Math.round(kobo / 100).toLocaleString("en-NG")}`;
}

const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

export function isRecentListing(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < NEW_WINDOW_MS;
}
