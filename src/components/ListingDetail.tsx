"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AmenityStrip } from "@/components/AmenityStrip";
import { PRICE_TYPE_LABELS } from "@/lib/constants";
import { formatNaira, isRecentListing } from "@/lib/format";
import { toneForId } from "@/lib/tone";
import { nightsBetween, computeBookingPrice } from "@/lib/pricing";
import { primaryButtonClass } from "@/lib/ui";

type ServiceData = {
  id: string;
  name: string;
  price: number;
  priceType: string;
};

export type PublicListingData = {
  id: string;
  title: string;
  area: string;
  description: string;
  houseRules: string | null;
  pricePerNight: number;
  amenities: string[];
  discountTiers: unknown;
  photos: string[];
  status: string;
  createdAt: string;
  hostName: string;
  address: string | null;
  accessNotes: string | null;
  services: ServiceData[];
};

export function ListingDetail({
  listing,
  isLoggedIn,
}: {
  listing: PublicListingData;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(
    new Set()
  );
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nights =
    checkIn && checkOut ? nightsBetween(new Date(checkIn), new Date(checkOut)) : 0;

  const breakdown = useMemo(() => {
    if (nights <= 0) return null;
    const selected = listing.services.filter((s) =>
      selectedServiceIds.has(s.id)
    );
    return computeBookingPrice({
      pricePerNight: listing.pricePerNight,
      nights,
      discountTiers: listing.discountTiers,
      services: selected.map((s) => ({
        id: s.id,
        price: s.price,
        priceType: s.priceType,
      })),
    });
  }, [nights, selectedServiceIds, listing]);

  function toggleService(id: string) {
    setSelectedServiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBook() {
    if (!checkIn || !checkOut) return;
    setError(null);
    setLoading(true);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId: listing.id,
        checkIn,
        checkOut,
        guestCount,
        serviceIds: Array.from(selectedServiceIds),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Couldn't create the booking. Try again.");
      return;
    }

    const { booking } = await res.json();
    router.push(`/bookings/${booking.id}`);
  }

  const isNew = isRecentListing(listing.createdAt);
  const photo = listing.photos[0];

  return (
    <div className="flex flex-1 justify-center pb-28 lg:pb-16">
      <div className="w-full max-w-[900px]">
        <div
          className="relative flex h-[280px] items-center justify-center lg:h-[380px] lg:rounded-2xl"
          style={{
            background: photo ? undefined : toneForId(listing.id),
            backgroundImage: photo ? `url(${photo})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!photo && (
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-50"
            >
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <circle cx="12" cy="12.5" r="3.6" />
              <path d="M8 6l1.6-2.2h4.8L16 6" />
            </svg>
          )}
          <Link
            href="/"
            aria-label="Back to explore"
            className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-foreground)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <button
            onClick={() => setSaved((s) => !s)}
            aria-label="Save listing"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill={saved ? "var(--color-accent)" : "none"}
              stroke={saved ? "var(--color-accent)" : "var(--color-foreground)"}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21s-7.5-4.6-10-9.3C0.4 8.1 2.2 4.5 5.7 4c2-0.3 3.9 0.7 6.3 3.2C14.4 4.7 16.3 3.7 18.3 4c3.5 0.5 5.3 4.1 3.7 7.7C19.5 16.4 12 21 12 21z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:gap-10 lg:px-0">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <h1 className="font-serif text-[22px] font-semibold text-foreground lg:text-3xl">
                {listing.title}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-muted">
                  {listing.area}, Lagos · Hosted by {listing.hostName}
                </span>
                {isNew && (
                  <span className="rounded-full bg-accent-tint px-2 py-0.5 text-[10px] font-bold text-accent">
                    NEW
                  </span>
                )}
              </div>
            </div>

            <AmenityStrip amenities={listing.amenities} />

            <p className="text-sm leading-relaxed text-muted">
              {listing.description}
            </p>

            {listing.houseRules && (
              <div className="rounded-xl border border-border bg-white p-4">
                <div className="mb-1 text-xs font-semibold text-foreground">
                  House rules
                </div>
                <div className="text-[13px] leading-relaxed text-muted">
                  {listing.houseRules}
                </div>
              </div>
            )}

            {listing.address && (
              <div className="rounded-xl border border-teal/30 bg-teal/10 p-4">
                <div className="mb-1 text-xs font-semibold text-teal">
                  Address
                </div>
                <div className="text-[13px] leading-relaxed text-foreground">
                  {listing.address}
                </div>
                {listing.accessNotes && (
                  <div className="mt-2 text-[13px] leading-relaxed text-muted">
                    {listing.accessNotes}
                  </div>
                )}
              </div>
            )}

            {listing.services.length > 0 && (
              <div>
                <div className="mb-2.5 text-[13px] font-semibold text-foreground">
                  Extras{" "}
                  <span className="font-normal text-[#A69F91]">
                    — add to your stay
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {listing.services.map((service) => {
                    const on = selectedServiceIds.has(service.id);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className="flex items-center gap-3 rounded-xl border bg-white p-3.5 text-left"
                        style={{
                          borderColor: on
                            ? "var(--color-accent)"
                            : "var(--color-border)",
                        }}
                      >
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-[1.5px]"
                          style={{
                            borderColor: on ? "var(--color-accent)" : "#DEDACE",
                            background: on ? "var(--color-accent)" : "#ffffff",
                          }}
                        >
                          {on && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <div className="flex-1">
                          <div className="text-[13px] font-semibold text-foreground">
                            {service.name}
                          </div>
                          <div className="text-[11px] text-muted">
                            {PRICE_TYPE_LABELS[service.priceType] ?? service.priceType}
                          </div>
                        </div>
                        <div className="text-[13px] font-bold text-foreground">
                          {formatNaira(service.price)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 lg:w-[340px] lg:shrink-0">
            <div className="rounded-2xl border border-border bg-white p-4">
              <div className="mb-3 text-[13px] font-semibold text-foreground">
                Choose dates
              </div>
              <div className="flex gap-2.5">
                <label className="flex-1 rounded-xl border border-border px-3.5 py-2.5">
                  <span className="block text-[11px] text-[#A69F91]">
                    Check in
                  </span>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-sm text-foreground outline-none"
                  />
                </label>
                <label className="flex-1 rounded-xl border border-border px-3.5 py-2.5">
                  <span className="block text-[11px] text-[#A69F91]">
                    Check out
                  </span>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="mt-0.5 w-full bg-transparent text-sm text-foreground outline-none"
                  />
                </label>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl border border-border px-3.5 py-2.5">
                <span className="text-sm text-foreground">Guests</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Fewer guests"
                    onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-foreground)" strokeWidth={2.5} strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span className="w-4 text-center text-sm font-semibold text-foreground">
                    {guestCount}
                  </span>
                  <button
                    type="button"
                    aria-label="More guests"
                    onClick={() => setGuestCount((g) => Math.min(20, g + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-accent"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {breakdown && (
              <div className="rounded-2xl border border-border bg-white p-4">
                <div className="mb-3 text-[13px] font-semibold text-foreground">
                  Price breakdown
                </div>
                <div className="flex flex-col gap-1.5 text-[13px]">
                  <Row
                    label={`${formatNaira(listing.pricePerNight)} × ${nights} night${nights === 1 ? "" : "s"}`}
                    value={formatNaira(breakdown.nightlySubtotal)}
                  />
                  {breakdown.discountAmount > 0 && (
                    <Row
                      label={`${breakdown.discountPercent}% long-stay discount`}
                      value={`-${formatNaira(breakdown.discountAmount)}`}
                      muted="text-teal"
                    />
                  )}
                  <Row label="HORC tax (5%)" value={formatNaira(breakdown.horcTax)} />
                  <Row label="VAT (7.5%)" value={formatNaira(breakdown.vat)} />
                  {breakdown.servicesTotal > 0 && (
                    <Row
                      label="Extras"
                      value={formatNaira(breakdown.servicesTotal)}
                    />
                  )}
                  <div className="mt-1.5 flex items-center justify-between border-t border-border pt-2.5 text-sm font-bold text-foreground">
                    <span>Total</span>
                    <span>{formatNaira(breakdown.totalPrice)}</span>
                  </div>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-accent">{error}</p>}

            <div className="hidden lg:block">
              <BookButton
                isLoggedIn={isLoggedIn}
                disabled={!breakdown || loading}
                loading={loading}
                onClick={handleBook}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-between border-t border-border bg-white px-5 py-4 lg:hidden">
        <div>
          {breakdown ? (
            <>
              <span className="text-lg font-bold text-foreground">
                {formatNaira(breakdown.totalPrice)}
              </span>
              <span className="text-[13px] text-muted"> total</span>
            </>
          ) : (
            <>
              <span className="text-lg font-bold text-foreground">
                {formatNaira(listing.pricePerNight)}
              </span>
              <span className="text-[13px] text-muted"> / night</span>
            </>
          )}
        </div>
        <BookButton
          isLoggedIn={isLoggedIn}
          disabled={!breakdown || loading}
          loading={loading}
          onClick={handleBook}
          compact
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className={muted ?? "text-foreground"}>{value}</span>
    </div>
  );
}

function BookButton({
  isLoggedIn,
  disabled,
  loading,
  onClick,
  compact,
}: {
  isLoggedIn: boolean;
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className={
          compact
            ? "rounded-xl bg-accent px-6 py-3 text-[15px] font-bold text-white"
            : primaryButtonClass
        }
      >
        Log in to book
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        compact
          ? "rounded-xl bg-accent px-6 py-3 text-[15px] font-bold text-white disabled:opacity-60"
          : `${primaryButtonClass} disabled:opacity-60`
      }
    >
      {loading ? "Booking…" : "Book now"}
    </button>
  );
}
