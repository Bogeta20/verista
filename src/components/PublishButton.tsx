"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { primaryButtonClass } from "@/lib/ui";

export function PublishButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePublish() {
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/listings/${listingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ACTIVE" }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Couldn't publish the listing. Try again.");
      return;
    }

    router.push("/host/dashboard");
  }

  return (
    <div className="mt-6">
      {error && <p className="mb-2 text-sm text-accent">{error}</p>}
      <button
        type="button"
        onClick={handlePublish}
        disabled={loading}
        className={primaryButtonClass}
      >
        {loading ? "Publishing…" : "Publish listing"}
      </button>
    </div>
  );
}
