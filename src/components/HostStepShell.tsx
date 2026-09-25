import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

export function HostStepShell({
  backHref,
  step,
  title,
  subtitle,
  children,
  footer,
}: {
  backHref: string;
  step?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex flex-1 justify-center px-5 py-8 sm:py-12">
      <div className="w-full max-w-[480px]">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={backHref}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-foreground)"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <Logo size={30} />
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          {step && (
            <div className="text-[11px] font-bold uppercase tracking-wide text-accent">
              {step}
            </div>
          )}
          <h1 className="mt-1 font-serif text-2xl font-semibold text-foreground">
            {title}
          </h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}

          <div className="mt-6">{children}</div>

          {footer && (
            <div className="mt-6 border-t border-border pt-6">{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
}
