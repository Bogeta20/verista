const CONFIG: Record<
  string,
  { bg: string; color: string; icon: React.ReactNode }
> = {
  CHEF: {
    bg: "#F1DCC9",
    color: "var(--color-accent)",
    icon: (
      <>
        <path d="M6 3v7a2 2 0 0 0 4 0V3" />
        <path d="M8 10v11" />
        <path d="M16 3c-1.5 0-2 2-2 4s0.5 4 2 4 2-2 2-4-0.5-4-2-4z" />
        <path d="M16 11v10" />
      </>
    ),
  },
  DRIVER: {
    bg: "#D9EAE6",
    color: "#1F6F63",
    icon: (
      <>
        <path d="M5 17h14" />
        <path d="M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
        <path d="M19 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
        <path d="M3 17V9l2-5h9l3 5h2a2 2 0 0 1 2 2v6" />
      </>
    ),
  },
  FUEL_TOPUP: {
    bg: "#EFE4CE",
    color: "#8A4B2E",
    icon: <polygon points="13 2 3 14 11 14 9 22 21 9 13 9 13 2" />,
  },
  CLEANING: {
    bg: "#E8C7B0",
    color: "var(--color-accent)",
    icon: (
      <>
        <path d="M12 2v6" />
        <path d="M12 2l3 4-3 2-3-2z" />
        <path d="M6 22l6-14 6 14" />
      </>
    ),
  },
  CUSTOM: {
    bg: "#EAD9E0",
    color: "#8A4B2E",
    icon: (
      <>
        <path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5z" />
      </>
    ),
  },
};

export function ServiceIcon({ category }: { category: string }) {
  const config = CONFIG[category] ?? CONFIG.CUSTOM;
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
      style={{ background: config.bg }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={config.color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {config.icon}
      </svg>
    </span>
  );
}
