import Link from "next/link";
import { formatNaira, isRecentListing } from "@/lib/format";
import { toneForId } from "@/lib/tone";

export type ListingCardData = {
  id: string;
  title: string;
  area: string;
  pricePerNight: number; // kobo
  photos: string[];
  createdAt: string;
  services: { id: string }[];
};

export function ListingCard({
  listing,
  imageHeight = 168,
}: {
  listing: ListingCardData;
  imageHeight?: number;
}) {
  const isNew = isRecentListing(listing.createdAt);
  const hasExtras = listing.services.length > 0;
  const photo = listing.photos[0];

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="block overflow-hidden rounded-2xl border border-border bg-white"
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          height: imageHeight,
          background: photo ? undefined : toneForId(listing.id),
          backgroundImage: photo ? `url(${photo})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!photo && (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-55"
          >
            <rect x="3" y="6" width="18" height="13" rx="2" />
            <circle cx="12" cy="12.5" r="3.4" />
            <path d="M8 6l1.6-2.2h4.8L16 6" />
          </svg>
        )}
        <button
          aria-label="Save listing"
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/85"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-foreground)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21s-7.5-4.6-10-9.3C0.4 8.1 2.2 4.5 5.7 4c2-0.3 3.9 0.7 6.3 3.2C14.4 4.7 16.3 3.7 18.3 4c3.5 0.5 5.3 4.1 3.7 7.7C19.5 16.4 12 21 12 21z" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-1.5 p-3.5 sm:p-4">
        <div className="text-sm font-semibold text-foreground sm:text-[15px]">
          {listing.title}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted sm:text-[13px]">
            {listing.area}
          </span>
          {isNew && (
            <span className="rounded-full bg-accent-tint px-2 py-0.5 text-[10px] font-bold text-accent">
              NEW
            </span>
          )}
        </div>
        <div>
          <span className="text-sm font-bold text-foreground sm:text-[15px]">
            {formatNaira(listing.pricePerNight)}
          </span>
          <span className="text-xs text-muted sm:text-[13px]"> / night</span>
        </div>
        {hasExtras && (
          <span className="mt-0.5 self-start rounded-full bg-teal/10 px-2.5 py-0.5 text-[10px] font-semibold text-teal">
            + Extras available
          </span>
        )}
      </div>
    </Link>
  );
}
