export function formatNaira(kobo: number) {
  return `₦${Math.round(kobo / 100).toLocaleString("en-NG")}`;
}
