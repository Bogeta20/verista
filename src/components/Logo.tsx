export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[28%] bg-accent"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 36 36"
        width={size * 0.56}
        height={size * 0.56}
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M18 4C11.4 4 6 9.4 6 16c0 9 12 17 12 17s12-8 12-17c0-6.6-5.4-12-12-12z"
          fill="#FFFFFF"
        />
        <path
          d="M12 16 L18 10.5 L24 16"
          stroke="var(--color-accent)"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="18" cy="20.5" r="2.6" fill="var(--color-gold)" />
      </svg>
    </span>
  );
}

export function Logo({
  className = "",
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span className="font-serif text-2xl font-bold tracking-tight text-accent">
        Verista
      </span>
    </div>
  );
}
