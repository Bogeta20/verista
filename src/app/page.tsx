import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Listings } from "@/components/Listings";
import { BottomNav } from "@/components/BottomNav";
import { AuthHeaderActions } from "@/components/AuthHeaderActions";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [user, listings] = await Promise.all([
    getCurrentUser(),
    prisma.listing.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        title: true,
        area: true,
        pricePerNight: true,
        photos: true,
        createdAt: true,
        services: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      {/* Desktop header */}
      <header className="hidden items-center justify-between border-b border-border px-16 py-6 lg:flex">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-9">
          <a href="#" className="text-[15px] font-medium text-foreground">
            Explore
          </a>
          <Link
            href="/become-host"
            className="text-[15px] font-medium text-foreground"
          >
            Become a host
          </Link>
          <AuthHeaderActions user={user} />
        </div>
      </header>

      <Listings
        initialListings={listings.map((l) => ({
          ...l,
          createdAt: l.createdAt.toISOString(),
        }))}
      />

      {/* Desktop footer */}
      <footer className="mt-auto hidden items-center justify-between border-t border-border px-16 py-5 lg:flex">
        <div className="text-xs text-muted/80">
          © 2026 Verista. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-muted">
            Terms of Service
          </a>
          <a href="#" className="text-xs text-muted">
            Privacy Policy
          </a>
          <a href="#" className="text-xs text-muted">
            Help
          </a>
        </div>
      </footer>

      <BottomNav loggedIn={Boolean(user)} />
    </div>
  );
}
