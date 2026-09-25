"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthField } from "@/components/AuthField";
import { RoleSelect } from "@/components/RoleSelect";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"GUEST" | "HOST" | "BOTH">("GUEST");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password, role }),
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
        label="Name"
        name="name"
        autoComplete="name"
        placeholder="Ada Okoye"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="+234 800 000 0000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <AuthField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />
      <RoleSelect value={role} onChange={setRole} />

      {error && <p className="text-sm text-accent">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-xl bg-accent py-3.5 text-[15px] font-bold text-white disabled:opacity-60"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent">
          Log in
        </Link>
      </p>
    </form>
  );
}
