import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { primaryButtonClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

const BENEFITS = [
  {
    title: "Set your own price",
    body: "You decide the nightly rate for your place.",
    icon: (
      <path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    ),
  },
  {
    title: "Choose when it's available",
    body: "Block off dates whenever you need the place yourself.",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="3" x2="8" y2="7" />
        <line x1="16" y1="3" x2="16" y2="7" />
      </>
    ),
  },
  {
    title: "Get paid directly to your bank",
    body: "Payouts land in your account after every booking.",
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </>
    ),
  },
];

export default async function BecomeHostPage() {
  const user = await getCurrentUser();
  const ctaHref = user ? "/host/payout" : "/signup";

  return (
    <div className="flex flex-1 justify-center px-5 py-8 sm:py-12">
      <div className="w-full max-w-[480px]">
        <Link
          href="/"
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

        <div className="mt-5 flex h-[220px] items-center justify-center rounded-2xl bg-accent-tint">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#B0522F"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-75"
          >
            <path d="M3 11l9-7 9 7" />
            <path d="M5 10v10h14V10" />
            <path d="M9 20v-6h6v6" />
          </svg>
        </div>

        <h1 className="mt-6 font-serif text-[26px] font-semibold leading-tight text-foreground">
          List your place on Verista
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">
          Earn from your apartment while you&rsquo;re away. Hosting takes a
          few minutes to set up, and you&rsquo;re always in control of
          pricing and availability.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-3">
              <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-accent-tint">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {benefit.icon}
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {benefit.title}
                </div>
                <div className="mt-0.5 text-[13px] text-muted">
                  {benefit.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <Link href={ctaHref} className={primaryButtonClass}>
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
