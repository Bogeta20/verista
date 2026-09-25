"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthField } from "@/components/AuthField";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Try again.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <AuthField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="ada@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <AuthField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="text-sm text-accent">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-xl bg-accent py-3.5 text-[15px] font-bold text-white disabled:opacity-60"
      >
        {loading ? "Logging in…" : "Log in"}
      </button>

      <p className="text-center text-sm text-muted">
        New to Verista?{" "}
        <Link href="/signup" className="font-semibold text-accent">
          Create an account
        </Link>
      </p>
    </form>
  );
}
