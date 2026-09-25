"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { primaryButtonClass } from "@/lib/ui";

const POLL_MS = 3000;

export function PayButton({
  bookingId,
  payable,
}: {
  bookingId: string;
  payable: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (res.ok) {
        const { booking } = await res.json();
        if (booking.status !== "PENDING") {
          router.refresh();
        }
      }
    }, POLL_MS);
    return () => clearInterval(interval);
  }, [bookingId, router]);

  async function handlePay() {
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/bookings/${bookingId}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callbackUrl: window.location.href }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setLoading(false);
      setError(data?.error ?? "Couldn't start payment. Try again.");
      return;
    }

    const { authorizationUrl } = await res.json();
    window.location.href = authorizationUrl;
  }

  if (!payable) {
    return (
      <p className="mt-5 rounded-xl bg-accent-tint px-4 py-3 text-[13px] leading-relaxed text-foreground">
        This booking is saved and pending payment. It will be confirmed once
        payment is set up.
      </p>
    );
  }

  return (
    <div className="mt-5">
      {error && <p className="mb-2 text-sm text-accent">{error}</p>}
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className={primaryButtonClass}
      >
        {loading ? "Starting payment…" : "Pay now"}
      </button>
      <p className="mt-2 text-center text-xs text-muted">
        You&rsquo;ll be redirected to Paystack to complete payment securely.
      </p>
    </div>
  );
}
