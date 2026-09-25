import type { InputHTMLAttributes } from "react";

export function AuthField({
  label,
  error,
  ...props
}: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <div
        className={`rounded-xl border bg-white px-4 py-3 ${
          error ? "border-accent" : "border-border"
        }`}
      >
        <span className="block text-[11px] text-[#A69F91]">{label}</span>
        <input
          {...props}
          className="mt-0.5 w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted/50"
        />
      </div>
      {error && <p className="mt-1.5 px-1 text-xs text-accent">{error}</p>}
    </label>
  );
}
