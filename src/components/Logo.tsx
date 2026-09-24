export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3.2 3.6 10.4V20.4H20.4V10.4Z"
            fill="#FFFFFF"
          />
          <circle cx="15.4" cy="13.6" r="1.7" fill="var(--color-gold)" />
        </svg>
      </span>
      <span className="font-serif text-xl font-bold tracking-tight text-foreground">
        Verista
      </span>
    </div>
  );
}
