"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthField } from "@/components/AuthField";
import { SERVICE_CATEGORIES, type ServiceCategoryKey } from "@/lib/constants";
import { formatNaira } from "@/lib/format";
import { primaryButtonClass } from "@/lib/ui";

const CATEGORY_KEYS = Object.keys(SERVICE_CATEGORIES) as ServiceCategoryKey[];

export function ServiceForm({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [category, setCategory] = useState<ServiceCategoryKey>("CHEF");
  const [name, setName] = useState<string>(SERVICE_CATEGORIES.CHEF.defaultName);
  const [price, setPrice] = useState<number>(SERVICE_CATEGORIES.CHEF.min ?? 10000);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cat = SERVICE_CATEGORIES[category];

  function pickCategory(key: ServiceCategoryKey) {
    setCategory(key);
    setName(SERVICE_CATEGORIES[key].defaultName);
    setPrice(SERVICE_CATEGORIES[key].min ?? 10000);
  }

  const showWarning =
    cat.min !== null && (price < cat.min || price > (cat.max as number));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/listings/${listingId}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        name,
        priceNaira: price,
        priceType: cat.priceType,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Try again.");
      return;
    }

    router.push(`/host/listing/${listingId}/services`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <div className="mb-2.5 text-xs font-semibold text-muted">Category</div>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_KEYS.map((key) => {
            const isSelected = key === category;
            return (
              <button
                key={key}
                type="button"
                onClick={() => pickCategory(key)}
                className={`rounded-full border px-4 py-2.5 text-[13px] font-semibold ${
                  isSelected
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-white text-foreground"
                }`}
              >
                {SERVICE_CATEGORIES[key].label}
              </button>
            );
          })}
        </div>
      </div>

      <AuthField
        label="Service name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-4">
        <div>
          <div className="text-[11px] text-[#A69F91]">Price</div>
          <div className="mt-0.5 text-xs text-muted">{cat.unitLabel}</div>
        </div>
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            aria-label="Lower price"
            onClick={() => setPrice((p) => Math.max(p - 1000, 1000))}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-border bg-background"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-foreground)" strokeWidth={2.5} strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <span className="min-w-[74px] text-center text-base font-bold text-foreground">
            {formatNaira(price * 100)}
          </span>
          <button
            type="button"
            aria-label="Raise price"
            onClick={() => setPrice((p) => Math.min(p + 1000, 50000))}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-accent"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {showWarning && (
        <div className="flex items-start gap-2 rounded-[10px] bg-[#F6ECD3] p-3.5">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A9821F"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 shrink-0"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-xs leading-relaxed text-[#A9821F]">
            This is {price < (cat.min as number) ? "below" : "above"} the
            typical range for {cat.label} services in Lagos. You can still
            save this price.
          </span>
        </div>
      )}
      {cat.min !== null && (
        <div className="px-0.5 text-xs text-[#A69F91]">
          Typical range in Lagos: {formatNaira(cat.min * 100)} –{" "}
          {formatNaira((cat.max as number) * 100)}
        </div>
      )}

      {error && <p className="text-sm text-accent">{error}</p>}

      <button type="submit" disabled={loading} className={primaryButtonClass}>
        {loading ? "Saving…" : "Save service"}
      </button>
    </form>
  );
}
