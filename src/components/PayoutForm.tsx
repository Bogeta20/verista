"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthField } from "@/components/AuthField";
import { primaryButtonClass } from "@/lib/ui";

type Bank = { name: string; code: string };

export function PayoutForm({
  initialBankName = "",
  initialBankCode = "",
  initialAccountNumber = "",
}: {
  initialBankName?: string;
  initialBankCode?: string;
  initialAccountNumber?: string;
}) {
  const router = useRouter();
  const [banks, setBanks] = useState<Bank[] | null>(null);
  const [bankName, setBankName] = useState(initialBankName);
  const [bankCode, setBankCode] = useState(initialBankCode);
  const [accountNumber, setAccountNumber] = useState(initialAccountNumber);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/paystack/banks")
      .then((res) => res.json())
      .then((data) => setBanks(data.configured ? data.banks : []))
      .catch(() => setBanks([]));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/host/payout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bankName, bankCode, accountNumber }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Try again.");
      return;
    }

    router.push("/host/listing/new");
  }

  const showBankSelect = banks && banks.length > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="mb-1 flex items-center gap-2 rounded-xl bg-accent-tint px-4 py-3 text-[13px] text-foreground">
        This creates a Paystack subaccount so guest payments split
        automatically between you and Verista.
      </div>

      {showBankSelect ? (
        <label className="block">
          <div className="rounded-xl border border-border bg-white px-4 py-3">
            <span className="block text-[11px] text-[#A69F91]">Bank</span>
            <select
              value={bankCode}
              onChange={(e) => {
                setBankCode(e.target.value);
                setBankName(
                  banks.find((b) => b.code === e.target.value)?.name ?? ""
                );
              }}
              required
              className="mt-0.5 w-full bg-transparent text-[15px] text-foreground outline-none"
            >
              <option value="" disabled>
                Select your bank
              </option>
              {banks.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
        </label>
      ) : (
        <AuthField
          label="Bank"
          name="bankName"
          placeholder="GTBank"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          required
        />
      )}

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
