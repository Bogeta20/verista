"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ListingCard, type ListingCardData } from "./ListingCard";

export function Listings({
  initialListings,
}: {
  initialListings: ListingCardData[];
}) {
  const [listings, setListings] = useState(initialListings);
  const [area, setArea] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedChip, setSelectedChip] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const areaChips = useMemo(() => {
    const areas = Array.from(new Set(initialListings.map((l) => l.area)));
    return ["All", ...areas];
  }, [initialListings]);

  async function runSearch(searchArea: string) {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (searchArea && searchArea !== "All") params.set("area", searchArea);
    if (checkIn && checkOut) {
      params.set("checkIn", checkIn);
      params.set("checkOut", checkOut);
    }

    const res = await fetch(`/api/listings?${params.toString()}`);
    setLoading(false);

    if (!res.ok) {
      setError("Couldn't load listings. Try again.");
      return;
    }

    const data = await res.json();
    setListings(data.listings);
  }

  function handleDesktopSearch(event: FormEvent) {
    event.preventDefault();
    runSearch(area);
  }

  function pickChip(chip: string) {
    setSelectedChip(chip);
    setArea(chip === "All" ? "" : chip);
    runSearch(chip);
  }

  return (
    <>
      {/* Desktop hero + search */}
      <section className="hidden flex-col items-start gap-5 px-16 pb-11 pt-16 lg:flex">
        <h1 className="max-w-[700px] font-serif text-5xl font-semibold leading-[1.08] text-foreground">
          Short stays across Lagos, without the guesswork.
        </h1>
        <p className="max-w-[520px] text-[17px] leading-relaxed text-muted">
          Verified apartments in Lekki, Ikoyi, VI and beyond — booked in
          minutes, hosted by real people.
        </p>

        <form
          onSubmit={handleDesktopSearch}
          className="mt-2 flex items-stretch rounded-2xl border border-border bg-white p-1.5 shadow-[0_10px_30px_rgba(32,27,20,0.08)]"
        >
          <label className="flex flex-1 flex-col justify-center gap-0.5 px-5 py-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
              Where
            </span>
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Search Lagos areas"
              className="bg-transparent text-[15px] font-medium text-foreground outline-none placeholder:text-foreground/60"
            />
          </label>
          <div className="my-2 w-px bg-border" />
          <label className="flex flex-1 flex-col justify-center gap-0.5 px-5 py-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
              Check in
            </span>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-transparent text-[15px] font-medium text-foreground outline-none"
            />
          </label>
          <div className="my-2 w-px bg-border" />
          <label className="flex flex-1 flex-col justify-center gap-0.5 px-5 py-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
              Check out
            </span>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-transparent text-[15px] font-medium text-foreground outline-none"
            />
          </label>
          <button
            type="submit"
            aria-label="Search"
            className="ml-1 flex h-12 w-12 flex-shrink-0 items-center justify-center self-center rounded-xl bg-accent disabled:opacity-60"
            disabled={loading}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16" y1="16" x2="21" y2="21" />
            </svg>
          </button>
        </form>
      </section>

      {/* Mobile header + search */}
      <div className="px-5 pb-1 pt-6 lg:hidden">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Explore Lagos
        </h1>
        <p className="mt-0.5 text-[13px] text-muted">Find your next stay</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(area);
        }}
        className="px-5 pt-4 lg:hidden"
      >
        <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-white px-4 py-3">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16" y1="16" x2="21" y2="21" />
          </svg>
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            onBlur={() => runSearch(area)}
            placeholder="Where in Lagos?"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
          />
        </div>
      </form>

      {/* Desktop grid */}
      <section className="hidden px-16 pb-16 pt-3 lg:block">
        <h2 className="mb-5 font-serif text-2xl font-semibold text-foreground">
          {loading ? "Searching…" : "Popular in Lagos"}
        </h2>
        {error && <p className="mb-4 text-sm text-accent">{error}</p>}
        {listings.length === 0 ? (
          <p className="text-sm text-muted">No listings match yet.</p>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* Mobile filter chips */}
      <div className="flex gap-2 overflow-x-auto px-5 py-4 lg:hidden [&::-webkit-scrollbar]:hidden">
        {areaChips.map((chip) => {
          const isSelected = chip === selectedChip;
          return (
            <button
              key={chip}
              onClick={() => pickChip(chip)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-semibold ${
                isSelected
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-white text-foreground"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Mobile single-column list */}
      <div className="flex flex-col gap-4 px-5 pb-28 lg:hidden">
        {error && <p className="text-sm text-accent">{error}</p>}
        {listings.length === 0 && !loading && (
          <p className="text-sm text-muted">No listings match yet.</p>
        )}
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} imageHeight={150} />
        ))}
      </div>
    </>
  );
}
