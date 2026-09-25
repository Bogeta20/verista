import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/Logo";
import { ListingStatusToggle } from "@/components/ListingStatusToggle";
import { formatNaira } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HostDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [listings, payout] = await Promise.all([
    prisma.listing.findMany({
      where: { hostId: user.id },
      include: { services: true, _count: { select: { bookings: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.hostPayoutInfo.findUnique({ where: { hostId: user.id } }),
  ]);

  const newListingHref = payout ? "/host/listing/new" : "/host/payout";

  const [paidOutThisMonth, recentPayouts] = await Promise.all([
    prisma.booking.aggregate({
      _sum: { hostPayout: true },
      where: {
        listing: { hostId: user.id },
        status: "COMPLETED",
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.booking.findMany({
      where: {
        listing: { hostId: user.id },
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
      include: { listing: { select: { title: true } } },
      orderBy: { checkIn: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="flex flex-1 justify-center px-5 py-8 sm:py-12">
      <div className="w-full max-w-[560px]">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Your listings
          </h1>
          <Link href="/">
            <Logo size={30} />
          </Link>
        </div>
        <Link
          href="/host/bookings"
          className="mt-1 inline-block text-sm font-medium text-muted"
        >
          All bookings →
        </Link>

        <div className="mt-4 rounded-2xl border border-border bg-white p-4">
          <div className="text-xs text-muted">This month&rsquo;s payout</div>
          <div className="mt-1 text-[22px] font-bold text-foreground">
            {formatNaira(paidOutThisMonth._sum.hostPayout ?? 0)}
          </div>
          <div className="mt-0.5 text-xs text-muted">
            {payout
              ? `Paid directly to ${payout.bankName} •••${payout.accountNumber.slice(-1)}`
              : "Add payout details to start hosting"}
          </div>

          {recentPayouts.length > 0 && (
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              {recentPayouts.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/host/bookings/${booking.id}`}
                  className="flex items-center justify-between text-[13px]"
                >
                  <span className="text-muted">
                    {booking.listing.title} ·{" "}
                    {booking.checkIn.toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatNaira(booking.hostPayout)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          href={newListingHref}
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-border p-4 text-muted"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth={2} strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="text-sm font-semibold">New listing</span>
        </Link>

        <div className="mt-4 flex flex-col gap-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="overflow-hidden rounded-2xl border border-border bg-white"
            >
              <div
                className="h-[120px]"
                style={{
                  background: listing.photos[0] ? undefined : "#F1DCC9",
                  backgroundImage: listing.photos[0]
                    ? `url(${listing.photos[0]})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[15px] font-semibold text-foreground">
                    {listing.title}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      listing.status === "ACTIVE"
                        ? "bg-teal/10 text-teal"
                        : "bg-border/60 text-muted"
                    }`}
                  >
                    {listing.status === "ACTIVE" ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="mt-1 text-[13px] text-muted">
                  {formatNaira(listing.pricePerNight)} / night ·{" "}
                  {listing._count.bookings}{" "}
                  {listing._count.bookings === 1 ? "booking" : "bookings"} ·{" "}
                  {listing.services.length}{" "}
                  {listing.services.length === 1 ? "service" : "services"}
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <Link
                    href={`/host/listing/${listing.id}/bookings`}
                    className="text-xs font-bold text-foreground"
                  >
                    Bookings
                  </Link>
                  <Link
                    href={`/host/listing/${listing.id}/services`}
                    className="text-xs font-bold text-foreground"
                  >
                    Manage services
                  </Link>
                  <ListingStatusToggle
                    listingId={listing.id}
                    status={listing.status}
                  />
                </div>
              </div>
            </div>
          ))}

          {listings.length === 0 && (
            <p className="px-1 text-sm text-muted">
              No listings yet — create your first one above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
