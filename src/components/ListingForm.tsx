"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthField } from "@/components/AuthField";
import { TextAreaField } from "@/components/TextAreaField";
import { AmenitiesGrid } from "@/components/AmenitiesGrid";
import { primaryButtonClass } from "@/lib/ui";

export function ListingForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [houseRules, setHouseRules] = useState("");
  const [amenities, setAmenities] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleAmenity(key: string) {
    setAmenities((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        area,
        pricePerNightNaira: Number(price),
        houseRules,
        amenities: Array.from(amenities),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Try again.");
      return;
    }

    const { listing } = await res.json();
    router.push(`/host/listing/${listing.id}/services`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <AuthField
        label="Title"
        name="title"
        placeholder="Cozy 2-bed, Lekki Phase 1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextAreaField
        label="Description"
        name="description"
        rows={3}
        placeholder="Tell guests what makes this place great."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <AuthField
        label="Area"
        name="area"
        placeholder="Lekki"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        required
      />
      <AuthField
        label="Price / night (₦)"
        name="price"
        type="number"
        inputMode="numeric"
        placeholder="45000"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        min={1}
      />
      <TextAreaField
        label="House rules"
        name="houseRules"
        rows={3}
        placeholder="No parties or events. Check-in after 2pm, checkout by 11am."
        value={houseRules}
        onChange={(e) => setHouseRules(e.target.value)}
      />

      <div className="mt-1">
        <div className="mb-2 text-[13px] font-semibold text-foreground">
          Amenities <span className="font-normal text-[#A69F91]">— tap to select</span>
        </div>
        <AmenitiesGrid selected={amenities} onToggle={toggleAmenity} />
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      <button type="submit" disabled={loading} className={`${primaryButtonClass} mt-2`}>
        {loading ? "Creating…" : "Continue"}
      </button>
    </form>
  );
}
