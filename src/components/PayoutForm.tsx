"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthField } from "@/components/AuthField";
import { primaryButtonClass } from "@/lib/ui";

export function PayoutForm({
  initialBankName = "",
  initialAccountNumber = "",
}: {
  initialBankName?: string;
  initialAccountNumber?: string;
}) {
  const router = useRouter();
  const [bankName, setBankName] = useState(initialBankName);
  const [accountNumber, setAccountNumber] = useState(initialAccountNumber);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/host/payout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bankName, accountNumber }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Try again.");
      return;
    }

    router.push("/host/listing/new");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="mb-1 flex items-center gap-2 rounded-xl bg-accent-tint px-4 py-3 text-[13px] text-foreground">
        This creates a Paystack subaccount so guest payments split
        automatically between you and Verista.
      </div>
      <AuthField
        label="Bank"
        name="bankName"
        placeholder="GTBank"
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
        required
      />
      <AuthField
        label="Account number"
        name="accountNumber"
        placeholder="0123456789"
        inputMode="numeric"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        required
      />

      {error && <p className="text-sm text-accent">{error}</p>}

      <button type="submit" disabled={loading} className={`${primaryButtonClass} mt-2`}>
        {loading ? "Saving…" : "Save & continue"}
      </button>
    </form>
  );
}
