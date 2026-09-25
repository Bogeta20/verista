import { AMENITIES } from "@/lib/constants";

const ICONS: Record<string, React.ReactNode> = {
  wifi: (
    <>
      <path d="M2 8.5a15 15 0 0 1 20 0" />
      <path d="M5.5 12a10 10 0 0 1 13 0" />
      <path d="M9 15.5a5 5 0 0 1 6 0" />
      <circle cx="12" cy="19" r="1" />
    </>
  ),
  grid: <polygon points="13 2 3 14 11 14 9 22 21 9 13 9 13 2" />,
  powergrid: (
    <>
      <path d="M12 2L6 22" />
      <path d="M12 2l6 20" />
      <path d="M7 10h10" />
      <path d="M8.5 15h7" />
    </>
  ),
  pool: (
    <>
      <path d="M2 17c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0" />
      <path d="M2 12c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0" />
    </>
  ),
  ac: (
    <>
      <path d="M12 2v20" />
      <path d="M4.5 6.5l15 11" />
      <path d="M19.5 6.5l-15 11" />
    </>
  ),
  parking: (
    <>
      <path d="M3 16l1.5-6.5A2 2 0 0 1 6.4 8h11.2a2 2 0 0 1 1.9 1.5L21 16" />
      <path d="M3 16h18v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3z" />
    </>
  ),
  security: (
    <>
      <path d="M12 2l8 3.5v5.6c0 4.7-3.2 8.8-8 10.4-4.8-1.6-8-5.7-8-10.4V5.5L12 2z" />
      <path d="M9 12l2 2 4-4.5" />
    </>
  ),
  borehole: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  kitchen: (
    <>
      <path d="M6 3v7a2 2 0 0 0 4 0V3" />
      <path d="M8 10v11" />
      <path d="M16 3c-1.5 0-2 2-2 4s0.5 4 2 4 2-2 2-4-0.5-4-2-4z" />
      <path d="M16 11v10" />
    </>
  ),
  washer: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="12" cy="13" r="5" />
    </>
  ),
  tv: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <line x1="9" y1="20" x2="15" y2="20" />
    </>
  ),
};

export function AmenitiesGrid({
  selected,
  onToggle,
}: {
  selected: Set<string>;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
      {AMENITIES.map((amenity) => {
        const on = selected.has(amenity.key);
        return (
          <button
            key={amenity.key}
            type="button"
            onClick={() => onToggle(amenity.key)}
            className="flex flex-col items-center gap-1.5 rounded-xl border px-1.5 py-3"
            style={{
              background: on ? "var(--color-accent)" : "#ffffff",
              borderColor: on ? "var(--color-accent)" : "var(--color-border)",
            }}
          >
            <span
              className="flex h-[30px] w-[30px] items-center justify-center rounded-full"
              style={{
                background: on ? "rgba(255,255,255,0.25)" : "var(--color-accent-tint)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={on ? "#ffffff" : "var(--color-accent)"}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {ICONS[amenity.key]}
              </svg>
            </span>
            <span
              className="text-center text-[11px] font-semibold leading-tight"
              style={{ color: on ? "#ffffff" : "var(--color-foreground)" }}
            >
              {amenity.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
