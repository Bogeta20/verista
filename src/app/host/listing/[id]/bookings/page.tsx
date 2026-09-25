import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Logo } from "@/components/Logo";
import { BOOKING_STATUS_STYLE } from "@/lib/constants";
import { formatNaira } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HostListingBookingsPage({
  params,
}: PageProps<"/host/listing/[id]/bookings">) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.hostId !== user.id) notFound();

  const bookings = await prisma.booking.findMany({
    where: { listingId: id },
    include: { guest: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-1 justify-center px-5 py-8 sm:py-12">
      <div className="w-full max-w-[480px]">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/host/dashboard" className="text-sm font-medium text-muted">
            ← Your listings
          </Link>
          <Logo size={30} />
        </div>

        <h1 className="font-serif text-2xl font-semibold text-foreground">
          {listing.title}
        </h1>
        <p className="mt-1 text-sm text-muted">Bookings</p>

        <div className="mt-5 flex flex-col gap-3">
          {bookings.map((booking) => {
            const status =
              BOOKING_STATUS_STYLE[booking.status] ?? BOOKING_STATUS_STYLE.PENDING;
            return (
              <Link
                key={booking.id}
                href={`/host/bookings/${booking.id}`}
                className="rounded-2xl border border-border bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold text-foreground">
                    {booking.guest.name}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted">
                  {booking.checkIn.toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  –{" "}
                  {booking.checkOut.toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {formatNaira(booking.totalPrice)}
                </div>
              </Link>
            );
          })}

          {bookings.length === 0 && (
            <p className="text-sm text-muted">No bookings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
