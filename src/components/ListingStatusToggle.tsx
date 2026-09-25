"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ListingStatusToggle({
  listingId,
  status,
}: {
  listingId: string;
  status: "ACTIVE" | "INACTIVE";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/listings/${listingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className="text-xs font-bold text-accent disabled:opacity-60"
    >
      {status === "ACTIVE" ? "Unpublish" : "Publish"}
    </button>
  );
}
