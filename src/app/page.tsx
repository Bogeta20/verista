import { Logo } from "@/components/Logo";
import { Listings } from "@/components/Listings";
import { BottomNav } from "@/components/BottomNav";
import type { ListingCardData } from "@/components/ListingCard";

// Placeholder data — wired to the real search/listing API in a later stage.
const listings: ListingCardData[] = [
  {
    title: "Cozy 2-bed, Lekki Phase 1",
    area: "Lekki",
    price: "₦45,000",
    tone: "#F1DCC9",
    isNew: true,
    hasExtras: true,
  },
  {
    title: "Serene studio near the lagoon",
    area: "Ikoyi",
    price: "₦38,000",
    tone: "#D9EAE6",
  },
  {
    title: "Bright apartment, Victoria Island",
    area: "Victoria Island",
    price: "₦52,000",
    tone: "#EFE4CE",
    isNew: true,
  },
  {
    title: "Quiet 1-bed, Yaba",
    area: "Yaba",
    price: "₦25,000",
    tone: "#E8C7B0",
  },
  {
    title: "Family duplex, Ajah",
    area: "Ajah",
    price: "₦30,000",
    tone: "#EAD9E0",
  },
];

function SearchField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-0.5 px-5 py-2.5">
      <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
        {label}
      </span>
      <span className="text-[15px] font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Desktop header */}
      <header className="hidden items-center justify-between border-b border-border px-16 py-6 lg:flex">
        <a href="#">
          <Logo />
        </a>
        <div className="flex items-center gap-9">
          <a href="#" className="text-[15px] font-medium text-foreground">
            Explore
          </a>
          <a href="#" className="text-[15px] font-medium text-foreground">
            Become a host
          </a>
          <a href="#" className="text-[15px] font-medium text-muted">
            Log in
          </a>
          <button className="rounded-[10px] bg-accent px-[22px] py-[11px] text-sm font-semibold text-white">
            Sign up
          </button>
        </div>
      </header>

      {/* Mobile header */}
      <div className="px-5 pb-1 pt-6 lg:hidden">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Explore Lagos
        </h1>
        <p className="mt-0.5 text-[13px] text-muted">Find your next stay</p>
      </div>

      {/* Desktop hero + search */}
      <section className="hidden flex-col items-start gap-5 px-16 pb-11 pt-16 lg:flex">
        <h1 className="max-w-[700px] font-serif text-5xl font-semibold leading-[1.08] text-foreground">
          Short stays across Lagos, without the guesswork.
        </h1>
        <p className="max-w-[520px] text-[17px] leading-relaxed text-muted">
          Verified apartments in Lekki, Ikoyi, VI and beyond — booked in
          minutes, hosted by real people.
        </p>

        <div className="mt-2 flex items-stretch rounded-2xl border border-border bg-white p-1.5 shadow-[0_10px_30px_rgba(32,27,20,0.08)]">
          <SearchField label="Where" value="Search Lagos areas" />
          <div className="my-2 w-px bg-border" />
          <SearchField label="Check in — Check out" value="Add dates" />
          <div className="my-2 w-px bg-border" />
          <SearchField label="Guests" value="Add guests" />
          <button
            aria-label="Search"
            className="ml-1 flex h-12 w-12 flex-shrink-0 items-center justify-center self-center rounded-xl bg-accent"
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
        </div>
      </section>

      {/* Mobile search pill */}
      <div className="px-5 pt-4 lg:hidden">
        <button className="flex w-full items-center gap-2.5 rounded-2xl border border-border bg-white px-4 py-3">
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
          <span className="text-sm text-muted">Where in Lagos?</span>
        </button>
      </div>

      <Listings listings={listings} />

      {/* Desktop footer */}
      <footer className="mt-auto hidden items-center justify-between border-t border-border px-16 py-5 lg:flex">
        <div className="text-xs text-muted/80">
          © 2026 Verista. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-muted">
            Terms of Service
          </a>
          <a href="#" className="text-xs text-muted">
            Privacy Policy
          </a>
          <a href="#" className="text-xs text-muted">
            Help
          </a>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}
