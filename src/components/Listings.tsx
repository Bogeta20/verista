"use client";

import { useState } from "react";
import { ListingCard, type ListingCardData } from "./ListingCard";

const AREAS = ["All", "Lekki", "Ikoyi", "Victoria Island", "Yaba", "Ajah"];

export function Listings({ listings }: { listings: ListingCardData[] }) {
  const [selected, setSelected] = useState("All");
  const filtered =
    selected === "All"
      ? listings
      : listings.filter((l) => l.area === selected);

  return (
    <>
      {/* Desktop grid */}
      <section className="hidden px-16 pb-16 pt-3 lg:block">
        <h2 className="mb-5 font-serif text-2xl font-semibold text-foreground">
          Popular in Lagos
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {listings.slice(0, 4).map((listing) => (
            <ListingCard key={listing.title} listing={listing} />
          ))}
        </div>
      </section>

      {/* Mobile filter chips */}
      <div className="flex gap-2 overflow-x-auto px-5 py-4 lg:hidden [&::-webkit-scrollbar]:hidden">
        {AREAS.map((area) => {
          const isSelected = area === selected;
          return (
            <button
              key={area}
              onClick={() => setSelected(area)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-semibold ${
                isSelected
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-white text-foreground"
              }`}
            >
              {area}
            </button>
          );
        })}
      </div>

      {/* Mobile single-column list */}
      <div className="flex flex-col gap-4 px-5 pb-28 lg:hidden">
        {filtered.map((listing) => (
          <ListingCard key={listing.title} listing={listing} imageHeight={150} />
        ))}
      </div>
    </>
  );
}
