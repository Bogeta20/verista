import { AMENITIES } from "@/lib/constants";
import { AMENITY_ICONS } from "@/components/AmenitiesGrid";

export function AmenityStrip({ amenities }: { amenities: string[] }) {
  if (amenities.length === 0) return null;

  return (
    <div className="flex gap-6 overflow-x-auto border-y border-border py-3.5 [&::-webkit-scrollbar]:hidden">
      {amenities.map((key) => {
        const label = AMENITIES.find((a) => a.key === key)?.label ?? key;
        return (
          <div
            key={key}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {AMENITY_ICONS[key]}
            </svg>
            <span className="text-[11px] text-muted">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
