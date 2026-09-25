"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthHeaderActions({
  user,
}: {
  user: { name: string } | null;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!user) {
    return (
      <>
        <Link href="/login" className="text-[15px] font-medium text-muted">
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-[10px] bg-accent px-[22px] py-[11px] text-sm font-semibold text-white"
        >
          Sign up
        </Link>
      </>
    );
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <>
      <span className="text-[15px] font-medium text-foreground">
        Hi, {user.name.split(" ")[0]}
      </span>
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="rounded-[10px] border border-border px-[18px] py-[10px] text-sm font-semibold text-foreground disabled:opacity-60"
      >
        {loggingOut ? "Logging out…" : "Log out"}
      </button>
    </>
  );
}
