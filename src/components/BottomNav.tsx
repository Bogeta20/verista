const ITEMS = [
  {
    label: "Explore",
    active: true,
    icon: (color: string) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="16" y1="16" x2="21" y2="21" />
      </svg>
    ),
  },
  {
    label: "Saved",
    active: false,
    icon: (color: string) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7.5-4.6-10-9.3C0.4 8.1 2.2 4.5 5.7 4c2-0.3 3.9 0.7 6.3 3.2C14.4 4.7 16.3 3.7 18.3 4c3.5 0.5 5.3 4.1 3.7 7.7C19.5 16.4 12 21 12 21z" />
      </svg>
    ),
  },
  {
    label: "Bookings",
    active: false,
    icon: (color: string) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Profile",
    active: false,
    icon: (color: string) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
];

export function BottomNav({ loggedIn }: { loggedIn: boolean }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-around border-t border-border bg-white px-0 py-3 pb-5 lg:hidden">
      {ITEMS.map((item) => {
        const color = item.active ? "var(--color-accent)" : "#98907E";
        const href = item.label === "Profile" && !loggedIn ? "/login" : "#";
        return (
          <a
            key={item.label}
            href={href}
            className="flex flex-col items-center gap-1"
          >
            {item.icon(color)}
            <span
              className="text-[10px]"
              style={{
                color,
                fontWeight: item.active ? 700 : 400,
              }}
            >
              {item.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
